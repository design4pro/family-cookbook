import { assertRecoveryVerified, closeRecovery, readJournal, recordDeletion } from "../deletion/journal";
import { processJob } from "../imports/job-state";
import { readManifest, restoreHousehold, sha256, type RecoveryEnvironment } from "../recovery/restore-household";
import { seedRecoveryFixture } from "./t06-fixture";

type Control = { action: "seed" | "delete" | "disaster" | "inspect-restored" | "replay" };

async function inspect(env: RecoveryEnvironment) {
  const manifest = await readManifest(env.DB);
  let readsAllowed = false;
  try { await assertRecoveryVerified(env.JOURNAL); readsAllowed = true; } catch { /* Closed is the expected maintenance state. */ }
  const source = await env.ACTIVE.get("t06/source/a");
  return {
    readsAllowed, outboundEffectsEnabled: false,
    journal: await readJournal(env.JOURNAL),
    control: await env.JOURNAL.prepare("SELECT * FROM recovery_control").first(),
    contributions: manifest.inventory.contributions.map(row => row.id),
    revisions: manifest.inventory.revisions.length,
    containsDeletedText: JSON.stringify(manifest).includes("B_PRIVATE"),
    activeKeys: (await env.ACTIVE.list({ prefix: "t06/" })).objects.map(row => row.key),
    recoveryKeys: (await env.RECOVERY.list({ prefix: "t06/" })).objects.map(row => row.key),
    retainedSourceHash: source ? await sha256(await source.arrayBuffer()) : null,
    sessions: (await env.DB.prepare("SELECT * FROM recovery_sessions ORDER BY id").all()).results,
    members: (await env.DB.prepare("SELECT * FROM household_members ORDER BY member_id").all()).results,
    jobs: (await env.DB.prepare("SELECT id, state, generation, attempts FROM import_jobs ORDER BY id").all()).results,
    reservations: (await env.DB.prepare("SELECT job_id, state FROM usage_reservations ORDER BY job_id").all()).results,
    results: await env.DB.prepare("SELECT COUNT(*) AS n FROM import_results").first("n"),
  };
}

// Private maintenance controls only: no fetch, scheduled handler, producer or external processor.
export default {
  async queue(batch: MessageBatch<Control>, env: RecoveryEnvironment) {
    for (const message of batch.messages) {
      const { action } = message.body;
      if (await env.JOURNAL.prepare("SELECT phase FROM proof_audits WHERE phase = ?").bind(action).first()) {
        message.ack();
        continue;
      }
      try {
        let recovery;
        if (action === "seed") await seedRecoveryFixture(env);
        else if (action === "delete") {
          await recordDeletion(env.JOURNAL, "B", Date.now());
          recovery = await restoreHousehold(env, async () => {});
        } else if (action === "disaster") {
          await closeRecovery(env.JOURNAL);
          await env.ACTIVE.delete("t06/source/a");
        } else if (action === "replay") {
          recovery = await restoreHousehold(env, async () => {});
          let staleProcessorCalls = 0;
          for (const jobId of ["job-a", "job-b"]) await processJob(env.DB, { jobId, generation: 0 }, async () => {
            staleProcessorCalls++;
            throw new Error("Stale delivery reached processor");
          });
          if (staleProcessorCalls) throw new Error("Stale delivery was not fenced");
          // A pre-restore retry may have the same generation as a restored job.
          // The epoch lives outside Time Travel and must fence it before dispatch.
          const previous = await env.JOURNAL.prepare("SELECT payload FROM proof_audits WHERE phase = 'delete'").first<string>("payload");
          if (!previous) throw new Error("Pre-restore epoch evidence missing");
          let rejected = false;
          try { await assertRecoveryVerified(env.JOURNAL, JSON.parse(previous).recovery.epoch); }
          catch { rejected = true; }
          if (!rejected) throw new Error("Pre-restore epoch was accepted");
        } else if (action !== "inspect-restored") throw new Error("Unknown proof action");
        await env.JOURNAL.prepare("INSERT INTO proof_audits VALUES (?, ?)")
          .bind(action, JSON.stringify({ ok: true, at: new Date().toISOString(), recovery, snapshot: await inspect(env) })).run();
      } catch (error) {
        await closeRecovery(env.JOURNAL);
        await env.JOURNAL.prepare("INSERT INTO proof_audits VALUES (?, ?)")
          .bind(action, JSON.stringify({ ok: false, at: new Date().toISOString(), error: String(error) })).run();
      }
      message.ack();
    }
  },
} satisfies ExportedHandler<RecoveryEnvironment, Control>;
