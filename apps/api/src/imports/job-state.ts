import { authorizedJob, releaseTerminal, type Job } from "../usage/reservations";

export interface JobMessage { jobId: string; generation: number }
export const MAX_ATTEMPTS = 3;
export const LEASE_MS = 60_000;

export async function recoverExpired(db: D1Database, now: number) {
  await db.batch([
    db.prepare(`UPDATE import_jobs SET state = CASE WHEN attempts >= ? THEN 'failed' ELSE 'pending' END,
      token = NULL, lease_until = 0, dispatch_after = 0 WHERE state = 'running' AND lease_until <= ?`)
      .bind(MAX_ATTEMPTS, now),
    releaseTerminal(db),
  ]);
}

export async function claimJob(db: D1Database, message: JobMessage, now: number): Promise<Job | null> {
  await recoverExpired(db, now);
  const results = await db.batch<Job>([
    db.prepare(`UPDATE import_jobs SET state = 'canceled', token = NULL, lease_until = 0
      WHERE id = ? AND generation = ? AND state IN ('pending', 'running') AND NOT (${authorizedJob})`)
      .bind(message.jobId, message.generation),
    releaseTerminal(db),
    db.prepare(`UPDATE import_jobs SET state = 'running', token = ?, lease_until = ?, attempts = attempts + 1
      WHERE id = ? AND generation = ? AND state = 'pending' AND attempts < ? AND ${authorizedJob} RETURNING *`)
      .bind(crypto.randomUUID(), now + LEASE_MS, message.jobId, message.generation, MAX_ATTEMPTS),
  ]);
  return results[2]!.results[0] ?? null;
}

export async function settleJob(db: D1Database, job: Job, result: string | null) {
  await db.batch([
    db.prepare(`UPDATE import_jobs SET state = CASE WHEN ${authorizedJob} THEN ? ELSE 'canceled' END,
      token = NULL, lease_until = 0
      WHERE id = ? AND generation = ? AND token = ? AND state = 'running'`)
      .bind(result === null ? "failed" : "succeeded", job.id, job.generation, job.token),
    // changes() gates publication on winning the fenced transition in this batch.
    db.prepare(`INSERT INTO import_results (job_id, content)
      SELECT id, ? FROM import_jobs WHERE id = ? AND state = 'succeeded' AND changes() = 1`)
      .bind(result, job.id),
    db.prepare(`UPDATE usage_reservations SET state = CASE
      WHEN EXISTS (SELECT 1 FROM import_jobs WHERE id = ? AND state = 'succeeded') THEN 'consumed' ELSE 'released' END
      WHERE job_id = ? AND state = 'reserved' AND EXISTS
        (SELECT 1 FROM import_jobs WHERE id = ? AND state IN ('succeeded', 'failed', 'canceled'))`)
      .bind(job.id, job.id, job.id),
  ]);
}

export async function processJob(db: D1Database, message: JobMessage,
  process: (job: Job) => Promise<string>, now = Date.now()): Promise<"done" | "retry"> {
  const job = await claimJob(db, message, now);
  if (!job) {
    const current = await db.prepare("SELECT state, generation FROM import_jobs WHERE id = ?").bind(message.jobId).first<Job>();
    return current?.generation === message.generation && ["pending", "running"].includes(current.state) ? "retry" : "done";
  }
  let result: string;
  try { result = await process(job); }
  catch {
    if (job.attempts >= MAX_ATTEMPTS) { await settleJob(db, job, null); return "done"; }
    await db.prepare(`UPDATE import_jobs SET state = 'pending', token = NULL, lease_until = 0, dispatch_after = 0
      WHERE id = ? AND generation = ? AND token = ? AND state = 'running'`)
      .bind(job.id, job.generation, job.token).run();
    return "retry";
  }
  // A failed commit must be retried, never acknowledged as successful processing.
  await settleJob(db, job, result);
  return "done";
}
