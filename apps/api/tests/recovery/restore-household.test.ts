import { env } from "cloudflare:workers";
import { beforeEach, expect, test, vi } from "vitest";
import journalSchema from "./journal-schema.sql?raw";
import applicationSchema from "./application-schema.sql?raw";
import { recordDeletion, assertRecoveryVerified, readJournal, deletionDeadlines } from "../../src/deletion/journal";
import { claimJob, processJob, settleJob } from "../../src/imports/job-state";
import { restoreHousehold } from "../../src/recovery/restore-household";
import { seedRecoveryFixture, readManifest } from "../../src/proofs/t06-fixture";

beforeEach(async () => {
  await env.JOURNAL.exec(journalSchema.replaceAll("\n", " "));
  await env.DB.exec(applicationSchema.replaceAll("\n", " "));
});

test("provider failure and missing external control fail closed before application access", async () => {
  await seedRecoveryFixture(env);
  await expect(restoreHousehold(env, async () => { throw new Error("Provider unavailable"); })).rejects.toThrow("Provider unavailable");
  await expect(assertRecoveryVerified(env.JOURNAL)).rejects.toThrow("closed");
  await env.JOURNAL.prepare("DELETE FROM recovery_control").run();
  const restore = vi.fn();
  await expect(restoreHousehold(env, restore)).rejects.toThrow("control missing");
  expect(restore).not.toHaveBeenCalled();
});

test.each(["missing", "corrupt"])("%s retained backup prevents verification", async failure => {
  await seedRecoveryFixture(env);
  await recordDeletion(env.JOURNAL, "B", 100);
  await env.ACTIVE.delete("t06/source/a");
  if (failure === "missing") await env.RECOVERY.delete("t06/recovery/a");
  else await env.RECOVERY.put("t06/recovery/a", "wrong bytes");
  await expect(restoreHousehold(env, async () => {})).rejects.toThrow(failure === "missing" ? "copy missing" : "checksum mismatch");
  await expect(assertRecoveryVerified(env.JOURNAL)).rejects.toThrow("closed");
});

test("interrupted object deletion preserves inventory and retry completes the purge", async () => {
  await seedRecoveryFixture(env);
  await recordDeletion(env.JOURNAL, "B", 100);
  const deletion = vi.spyOn(env.RECOVERY, "delete").mockRejectedValueOnce(new Error("Injected delete failure"));
  await expect(restoreHousehold(env, async () => {}, () => 200)).rejects.toThrow("Injected delete failure");
  expect((await readManifest(env.DB)).inventory.assets.some(row => row.id === "b-copy")).toBe(true);
  expect((await readJournal(env.JOURNAL))[0]!.active_purged_at).toBeNull();
  await expect(assertRecoveryVerified(env.JOURNAL)).rejects.toThrow("closed");
  deletion.mockRestore();
  await restoreHousehold(env, async () => {}, () => 300);
  expect((await readJournal(env.JOURNAL))[0]!.active_purged_at).toBe(300);
});

test("an untracked cached object blocks completion and purge timing claims", async () => {
  await seedRecoveryFixture(env);
  await recordDeletion(env.JOURNAL, "B", 100);
  await env.ACTIVE.put("t06/cache/orphan", "B_PRIVATE unknown copy");
  await expect(restoreHousehold(env, async () => {}, () => 200)).rejects.toThrow("inventory mismatch");
  expect((await readJournal(env.JOURNAL))[0]!.active_purged_at).toBeNull();
  await expect(assertRecoveryVerified(env.JOURNAL)).rejects.toThrow("closed");
  await env.ACTIVE.delete("t06/cache/orphan");
  await restoreHousehold(env, async () => {}, () => 300);
});

test("a deletion arriving during media recovery requires another replay", async () => {
  await seedRecoveryFixture(env);
  await recordDeletion(env.JOURNAL, "B", 100);
  await env.ACTIVE.delete("t06/source/a");
  const originalPut = env.ACTIVE.put.bind(env.ACTIVE);
  const put = vi.spyOn(env.ACTIVE, "put").mockImplementationOnce(async (...args: Parameters<R2Bucket["put"]>) => {
    const result = await originalPut(...args);
    await recordDeletion(env.JOURNAL, "A", 150);
    return result;
  });
  await expect(restoreHousehold(env, async () => {}, () => 200)).rejects.toThrow("replay required");
  await expect(assertRecoveryVerified(env.JOURNAL)).rejects.toThrow("closed");
  put.mockRestore();
  const report = await restoreHousehold(env, async () => {}, () => 300);
  expect(report.activeKeys).toEqual([]);
  expect(report.recoveryKeys).toEqual([]);
  expect((await readManifest(env.DB)).inventory.recipes).toEqual([]);
});

test("restored sessions, old queue deliveries and in-flight settlements remain fenced", async () => {
  await seedRecoveryFixture(env);
  const oldJob = await claimJob(env.DB, { jobId: "job-a", generation: 0 }, 100);
  expect(oldJob).not.toBeNull();
  await env.DB.prepare("UPDATE import_jobs SET attempts = 3 WHERE id = 'job-a'").run();
  await recordDeletion(env.JOURNAL, "B", 150);
  await restoreHousehold(env, async () => {}, () => 200);
  await settleJob(env.DB, oldJob!, "late result");
  const processor = vi.fn(async () => "must not execute");
  for (const jobId of ["job-a", "job-b"]) await processJob(env.DB, { jobId, generation: 0 }, processor, 300);
  expect(processor).not.toHaveBeenCalled();
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM import_results").first("n")).toBe(0);
  expect(await env.DB.prepare("SELECT state FROM usage_reservations WHERE job_id = 'job-b'").first("state")).toBe("released");
  expect(await env.DB.prepare("SELECT state FROM import_jobs WHERE id = 'job-a'").first("state")).toBe("pending");
  expect(await env.DB.prepare("SELECT attempts FROM import_jobs WHERE id = 'job-a'").first("attempts")).toBe(0);
});

test("duplicate requests and replay never restart the deletion deadline", async () => {
  await seedRecoveryFixture(env);
  await recordDeletion(env.JOURNAL, "B", 100);
  await restoreHousehold(env, async () => {}, () => 200);
  await recordDeletion(env.JOURNAL, "B", 900);
  await restoreHousehold(env, async () => {}, () => 1000);
  const records = await readJournal(env.JOURNAL);
  expect(records).toHaveLength(1);
  expect(records[0]).toMatchObject({ requested_at: 100, active_purged_at: 200 });
  const day = 86_400_000;
  expect(deletionDeadlines(records[0]!)).toEqual({ activePurgeBy: 100 + 7 * day, backupExpiryBy: 200 + 30 * day });
  expect(deletionDeadlines({ ...records[0]!, active_purged_at: 100 + 9 * day }).backupExpiryBy).toBe(100 + 37 * day);
});

test.each(["mapping", "boundary"])("invalid %s inventory blocks recovery", async failure => {
  const manifest = await seedRecoveryFixture(env);
  if (failure === "mapping") manifest.sources.pop();
  else manifest.inventory = { ...manifest.inventory, assets: manifest.inventory.assets.map((row, index) => index === 0 ? { ...row, key: "another-household/source" } : row) };
  await env.DB.prepare("UPDATE recovery_manifest SET payload = ?").bind(JSON.stringify(manifest)).run();
  await expect(restoreHousehold(env, async () => {})).rejects.toThrow(failure === "mapping" ? "inventory incomplete" : "outside recovery boundary");
  await expect(assertRecoveryVerified(env.JOURNAL)).rejects.toThrow("closed");
});

test("historical restore replays external deletion before verifying reads and recovers retained media", async () => {
  await seedRecoveryFixture(env);
  await recordDeletion(env.JOURNAL, "B", 100);
  await env.ACTIVE.delete("t06/source/a");
  await expect(assertRecoveryVerified(env.JOURNAL)).rejects.toThrow("closed");
  const report = await restoreHousehold(env, async () => {}, () => 200);
  expect(report.recoveredSources).toBe(1);
  const manifest = await readManifest(env.DB);
  expect(JSON.stringify(manifest)).not.toContain("B_PRIVATE");
  expect(manifest.inventory.contributions.map(row => row.id)).toEqual(["a-text", "a-source"]);
  expect(await (await env.ACTIVE.get("t06/source/a"))?.text()).toBe("A original media bytes");
  expect(await env.ACTIVE.get("t06/source/b")).toBeNull();
  expect(await env.RECOVERY.get("t06/recovery/b")).toBeNull();
  expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM recovery_sessions WHERE revoked = 0").first("n")).toBe(0);
  expect(await env.DB.prepare("SELECT state FROM import_jobs WHERE id = 'job-b'").first("state")).toBe("canceled");
  await assertRecoveryVerified(env.JOURNAL);
});

test("external epoch rejects historical messages even when job generations collide", async () => {
  await seedRecoveryFixture(env);
  const first = await restoreHousehold(env, async () => {});
  const second = await restoreHousehold(env, async () => {
    await env.DB.prepare("UPDATE import_jobs SET generation = 0").run();
  });
  expect(await env.DB.prepare("SELECT generation FROM import_jobs WHERE id = 'job-a'").first("generation")).toBe(1);
  await expect(assertRecoveryVerified(env.JOURNAL, first.epoch)).rejects.toThrow("Stale recovery epoch");
  await assertRecoveryVerified(env.JOURNAL, second.epoch);
});

test("purge completion time is read only after copy verification", async () => {
  await seedRecoveryFixture(env);
  await recordDeletion(env.JOURNAL, "B", 100);
  let copiesVerified = false;
  const list = env.RECOVERY.list.bind(env.RECOVERY);
  const inventory = vi.spyOn(env.RECOVERY, "list").mockImplementationOnce(async options => {
    const result = await list(options);
    expect(result.objects.map(row => row.key)).toEqual(["t06/recovery/a"]);
    copiesVerified = true;
    return result;
  });
  await restoreHousehold(env, async () => {}, () => {
    expect(copiesVerified).toBe(true);
    return 200;
  });
  inventory.mockRestore();
  expect((await readJournal(env.JOURNAL))[0]!.active_purged_at).toBe(200);
  await recordDeletion(env.JOURNAL, "A", 300);
  await expect(assertRecoveryVerified(env.JOURNAL)).rejects.toThrow("closed");
});
