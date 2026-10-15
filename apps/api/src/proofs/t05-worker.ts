import { createJob, type JobRequest } from "../usage/reservations";
import { processJob, type JobMessage } from "../imports/job-state";
import { reconcileDispatch } from "../imports/reconcile-dispatch";

// Isolated proof entry point. No HTTP handler, model call, real sources or production bindings.
type Mode = "success" | "failure" | "revoke" | "delete" | "lost-ack" | "enqueue-failure";
type ProofMessage = JobMessage | { action: "create"; request: JobRequest; mode: Mode } | { action: "reconcile" };
interface ProofEnv { DB: D1Database; JOBS: Queue<JobMessage> }

export default {
  async scheduled(_event: ScheduledController, env: ProofEnv) {
    await reconcileDispatch(env.DB, env.JOBS);
  },
  async queue(batch: MessageBatch<ProofMessage>, env: ProofEnv) {
    await Promise.all(batch.messages.map(async message => {
      const body = message.body;
      if ("action" in body) {
        if (body.action === "create") {
          await createJob(env.DB, body.request);
          await env.DB.prepare("INSERT INTO proof_cases (job_id, mode) VALUES (?, ?) ON CONFLICT DO NOTHING")
            .bind(body.request.id, body.mode).run();
          if (body.mode === "enqueue-failure") {
            try { await reconcileDispatch(env.DB, { send: async () => { throw new Error("Injected enqueue failure"); } }); }
            catch {
              await env.DB.prepare("INSERT INTO proof_deliveries (job_id, message_id, attempt, outcome) VALUES (?, ?, ?, 'enqueue-failed')")
                .bind(body.request.id, message.id, message.attempts).run();
            }
            message.ack();
            return;
          }
        }
        await reconcileDispatch(env.DB, env.JOBS);
        message.ack();
        return;
      }
      const mode = await env.DB.prepare("SELECT mode FROM proof_cases WHERE job_id = ?").bind(body.jobId).first<Mode>("mode");
      const outcome = await processJob(env.DB, body, async job => {
        if (mode === "failure") throw new Error("Injected processing failure");
        if (mode === "revoke") await env.DB.prepare("DELETE FROM household_members WHERE household_id = ? AND member_id = ?")
          .bind(job.household_id, job.member_id).run();
        if (mode === "delete") await env.DB.prepare("UPDATE import_sources SET deleted = 1 WHERE id = ?").bind(job.source_id).run();
        return "Synthetic T05 result";
      });
      const retry = outcome === "retry" || (mode === "lost-ack" && message.attempts === 1);
      await env.DB.prepare("INSERT INTO proof_deliveries (job_id, message_id, attempt, outcome) VALUES (?, ?, ?, ?)")
        .bind(body.jobId, message.id, message.attempts, retry ? "retry" : "ack").run();
      if (retry) message.retry({ delaySeconds: 1 });
      else message.ack();
    }));
  },
} satisfies ExportedHandler<ProofEnv, ProofMessage>;
