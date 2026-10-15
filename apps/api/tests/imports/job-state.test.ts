import { env } from "cloudflare:workers";
import { expect, test } from "vitest";
import { createJob, retryJob, type Job } from "../../src/usage/reservations";
import { reconcileDispatch } from "../../src/imports/reconcile-dispatch";

import { claimJob, LEASE_MS, processJob, recoverExpired, settleJob } from "../../src/imports/job-state";

const input = { id: "job-1", householdId: "home", memberId: "alice", sourceId: "source", windowId: "window", units: 1 };
async function seed(capacity = 2) {
  await env.DB.batch([
    env.DB.prepare("INSERT INTO household_members VALUES ('home', 'alice')"),
    env.DB.prepare("INSERT INTO import_sources VALUES ('source', 'home', 0)"),
    env.DB.prepare("INSERT INTO allowance_windows VALUES ('window', 'home', ?)").bind(capacity),
  ]);
}
async function usage() {
  return (await env.DB.prepare("SELECT state, SUM(units) AS units FROM usage_reservations GROUP BY state ORDER BY state").all()).results;
}

test("creation reserves once and failed publication stays discoverable", async () => {
  await seed();
  await Promise.all([createJob(env.DB, input), createJob(env.DB, input)]);
  expect(await usage()).toEqual([{ state: "reserved", units: 1 }]);
  await expect(reconcileDispatch(env.DB, { send: async () => { throw new Error("enqueue failed"); } }, 100)).rejects.toThrow("enqueue failed");
  const sent: unknown[] = [];
  await reconcileDispatch(env.DB, { send: async message => { sent.push(message); } }, 100);
  expect(sent).toEqual([{ jobId: input.id, generation: 0 }]);
  expect(await usage()).toEqual([{ state: "reserved", units: 1 }]);
});

const message = { jobId: input.id, generation: 0 };
async function stored() { return env.DB.prepare("SELECT * FROM import_jobs WHERE id = ?").bind(input.id).first<Job>(); }
async function results() { return (await env.DB.prepare("SELECT * FROM import_results").all()).results; }

test("concurrent last-unit reservations cannot oversubscribe a window", async () => {
  await seed(1);
  const outcomes = await Promise.allSettled([createJob(env.DB, input), createJob(env.DB, { ...input, id: "other" })]);
  expect(outcomes.filter(value => value.status === "fulfilled")).toHaveLength(1);
  expect(await usage()).toEqual([{ state: "reserved", units: 1 }]);
});

test("reservation insert failure rolls back job creation", async () => {
  await seed();
  await env.DB.exec("CREATE TRIGGER fail_reservation BEFORE INSERT ON usage_reservations BEGIN SELECT RAISE(ABORT, 'reservation fault'); END;");
  await expect(createJob(env.DB, input)).rejects.toThrow("reservation fault");
  expect(await stored()).toBeNull();
  expect(await usage()).toEqual([]);
});

test("lost enqueue acknowledgment permits duplicate publication without another reservation", async () => {
  await seed();
  await createJob(env.DB, input);
  const sent: unknown[] = [];
  const publisher = { send: async (body: unknown) => { sent.push(body); } };
  await env.DB.exec("CREATE TRIGGER fail_dispatch BEFORE UPDATE OF dispatch_after ON import_jobs WHEN NEW.dispatch_after > 0 BEGIN SELECT RAISE(ABORT, 'dispatch fault'); END;");
  await expect(reconcileDispatch(env.DB, publisher, 100)).rejects.toThrow("dispatch fault");
  await env.DB.exec("DROP TRIGGER fail_dispatch;");
  await reconcileDispatch(env.DB, publisher, 100);
  expect(sent).toEqual([message, message]);
  expect(await usage()).toEqual([{ state: "reserved", units: 1 }]);
});

test("duplicate consumers and lost acknowledgments publish and charge once", async () => {
  await seed(); await createJob(env.DB, input);
  let calls = 0;
  const process = async () => { calls++; return "synthetic draft"; };
  await Promise.all([processJob(env.DB, message, process, 100), processJob(env.DB, message, process, 100)]);
  await processJob(env.DB, message, process, 100);
  expect(calls).toBe(1);
  expect(await results()).toEqual([{ job_id: input.id, content: "synthetic draft" }]);
  expect(await usage()).toEqual([{ state: "consumed", units: 1 }]);
});

test("crashed worker lease expires; a stale worker cannot settle the replacement", async () => {
  await seed(); await createJob(env.DB, input);
  const abandoned = (await claimJob(env.DB, message, 100))!;
  expect(await processJob(env.DB, message, async () => "must not execute", 101)).toBe("retry");
  const replacement = (await claimJob(env.DB, message, 100 + LEASE_MS))!;
  expect(replacement.token).not.toBe(abandoned.token);
  await settleJob(env.DB, abandoned, "stale draft");
  expect(await results()).toEqual([]);
  await Promise.all([settleJob(env.DB, replacement, "fresh draft"), settleJob(env.DB, replacement, "duplicate draft")]);
  expect(await results()).toHaveLength(1);
  expect(await usage()).toEqual([{ state: "consumed", units: 1 }]);
});

test("bounded terminal failure releases once; user retries keep one logical operation", async () => {
  await seed(); await createJob(env.DB, input);
  const fail = async () => { throw new Error("processor unavailable"); };
  expect(await processJob(env.DB, message, fail, 100)).toBe("retry");
  expect(await processJob(env.DB, message, fail, 101)).toBe("retry");
  expect(await processJob(env.DB, message, fail, 102)).toBe("done");
  await processJob(env.DB, message, fail, 103);
  expect((await stored())?.state).toBe("failed");
  expect(await usage()).toEqual([{ state: "released", units: 1 }]);
  await Promise.all([retryJob(env.DB, input), retryJob(env.DB, input)]);
  expect((await stored())?.generation).toBe(1);
  expect(await processJob(env.DB, message, async () => "obsolete generation", 104)).toBe("done");
  expect(await results()).toEqual([]);
  await processJob(env.DB, { ...message, generation: 1 }, async () => "recovered", 105);
  await retryJob(env.DB, input);
  expect((await stored())?.state).toBe("succeeded");
  expect(await results()).toEqual([{ job_id: input.id, content: "recovered" }]);
  expect(await usage()).toEqual([{ state: "consumed", units: 1 }]);
});

test("a released slot may be reused, so retry must reacquire capacity", async () => {
  await seed(1); await createJob(env.DB, input);
  const job = (await claimJob(env.DB, message, 100))!;
  await settleJob(env.DB, job, null);
  await createJob(env.DB, { ...input, id: "other" });
  expect((await retryJob(env.DB, input)).state).toBe("failed");
  expect(await usage()).toEqual([{ state: "released", units: 1 }, { state: "reserved", units: 1 }]);
});

for (const mutation of ["DELETE FROM household_members", "UPDATE import_sources SET deleted = 1", "DELETE FROM import_sources"]) {
  test(`late result is suppressed after ${mutation}`, async () => {
    await seed(); await createJob(env.DB, input);
    await processJob(env.DB, message, async () => { await env.DB.prepare(mutation).run(); return "must not publish"; }, 100);
    expect((await stored())?.state).toBe("canceled");
    expect(await results()).toEqual([]);
    expect(await usage()).toEqual([{ state: "released", units: 1 }]);
    expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM import_sources WHERE deleted = 0").first("n"))
      .toBe(mutation.includes("household_members") ? 1 : 0);
    await processJob(env.DB, message, async () => { throw new Error("must not run"); }, 101);
    expect((await stored())?.attempts).toBe(1);
  });
}

test("revocation before delivery avoids external processing and frees capacity", async () => {
  await seed(); await createJob(env.DB, input);
  await env.DB.exec("DELETE FROM household_members;");
  expect(await processJob(env.DB, message, async () => { throw new Error("must not run"); }, 100)).toBe("done");
  expect((await stored())?.state).toBe("canceled");
  expect((await stored())?.attempts).toBe(0);
  expect(await usage()).toEqual([{ state: "released", units: 1 }]);
});

test("failed result commit rolls back job and charge, then crash recovery settles once", async () => {
  await seed(); await createJob(env.DB, input);
  await env.DB.exec("CREATE TRIGGER fail_result BEFORE INSERT ON import_results BEGIN SELECT RAISE(ABORT, 'result fault'); END;");
  await expect(processJob(env.DB, message, async () => "draft", 100)).rejects.toThrow("result fault");
  expect((await stored())?.state).toBe("running");
  expect(await usage()).toEqual([{ state: "reserved", units: 1 }]);
  await env.DB.exec("DROP TRIGGER fail_result;");
  await processJob(env.DB, message, async () => "recovered", 100 + LEASE_MS);
  expect(await usage()).toEqual([{ state: "consumed", units: 1 }]);
  expect(await results()).toHaveLength(1);
});

test("repeated worker crashes eventually release the reservation through reconciliation", async () => {
  await seed(); await createJob(env.DB, input);
  for (let i = 0; i < 3; i++) expect(await claimJob(env.DB, message, i * LEASE_MS)).not.toBeNull();
  await recoverExpired(env.DB, 3 * LEASE_MS);
  expect((await stored())?.state).toBe("failed");
  expect(await usage()).toEqual([{ state: "released", units: 1 }]);
  expect(await claimJob(env.DB, message, 4 * LEASE_MS)).toBeNull();
});

test("operation IDs cannot be reused with changed source, units or ownership", async () => {
  await seed(); await createJob(env.DB, input);
  for (const changed of [{ units: 2 }, { sourceId: "other" }, { memberId: "mallory" }, { windowId: "other" }]) {
    await expect(createJob(env.DB, { ...input, ...changed })).rejects.toThrow("different intent");
  }
  expect(await usage()).toEqual([{ state: "reserved", units: 1 }]);
});

test("scheduled handler reconciles pending dispatch with the configured publisher", async () => {
  await seed(); await createJob(env.DB, input);
  const { default: worker } = await import("../../src/proofs/t05-worker");
  const sent: unknown[] = [];
  const JOBS = { send: async (body: unknown) => { sent.push(body); } } as unknown as Queue;
  await worker.scheduled({} as ScheduledController, { DB: env.DB, JOBS });
  expect(sent).toEqual([message]);
  expect((await stored())?.dispatch_after).toBeGreaterThan(0);
});
