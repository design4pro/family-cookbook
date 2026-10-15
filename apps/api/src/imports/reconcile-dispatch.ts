import { LEASE_MS, recoverExpired, type JobMessage } from "./job-state";

export interface JobPublisher { send(message: JobMessage): Promise<unknown> }

export async function reconcileDispatch(db: D1Database, publisher: JobPublisher, now = Date.now()) {
  await recoverExpired(db, now);
  const jobs = await db.prepare(`SELECT id, generation FROM import_jobs
    WHERE state = 'pending' AND dispatch_after <= ? ORDER BY dispatch_after, id LIMIT 100`)
    .bind(now).all<{ id: string; generation: number }>();
  for (const job of jobs.results) {
    await publisher.send({ jobId: job.id, generation: job.generation });
    // An uncertain send or a crash before this write leaves discoverable work.
    // Successful dispatch is also revisited if no consumer starts before the deadline.
    await db.prepare(`UPDATE import_jobs SET dispatch_after = ?
      WHERE id = ? AND generation = ? AND state = 'pending'`)
      .bind(now + LEASE_MS, job.id, job.generation).run();
  }
}
