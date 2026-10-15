export interface JobRequest {
  id: string;
  householdId: string;
  memberId: string;
  sourceId: string;
  windowId: string;
  units: number;
}
export interface Job {
  id: string;
  household_id: string;
  member_id: string;
  source_id: string;
  window_id: string;
  units: number;
  state: "pending" | "running" | "succeeded" | "failed" | "canceled";
  generation: number;
  attempts: number;
  token: string | null;
  lease_until: number;
  dispatch_after: number;
}

// This predicate is evaluated again inside settlement, after external work.
export const authorizedJob = `EXISTS (SELECT 1 FROM household_members m
    WHERE m.household_id = import_jobs.household_id AND m.member_id = import_jobs.member_id)
  AND EXISTS (SELECT 1 FROM import_sources s
    WHERE s.id = import_jobs.source_id AND s.household_id = import_jobs.household_id AND s.deleted = 0)`;

const availableCapacity = `capacity - COALESCE((SELECT SUM(units) FROM usage_reservations
  WHERE window_id = allowance_windows.id AND state != 'released'), 0)`;

// Identity, window and units are server-owned inputs; never trust client quota values.
export async function createJob(db: D1Database, input: JobRequest): Promise<Job> {
  if (!Number.isSafeInteger(input.units) || input.units <= 0) throw new Error("Invalid reservation units");
  const p = [input.id, input.householdId, input.memberId, input.sourceId, input.windowId, input.units];
  const results = await db.batch<Job>([
    db.prepare(`INSERT INTO import_jobs (id, household_id, member_id, source_id, window_id, units, state)
      SELECT ?1, ?2, ?3, ?4, ?5, ?6, 'pending'
      WHERE EXISTS (SELECT 1 FROM household_members WHERE household_id = ?2 AND member_id = ?3)
        AND EXISTS (SELECT 1 FROM import_sources WHERE id = ?4 AND household_id = ?2 AND deleted = 0)
        AND EXISTS (SELECT 1 FROM allowance_windows WHERE id = ?5 AND household_id = ?2 AND ${availableCapacity} >= ?6)
      ON CONFLICT (id) DO NOTHING`).bind(...p),
    db.prepare(`INSERT INTO usage_reservations (job_id, window_id, units, state)
      SELECT id, window_id, units, 'reserved' FROM import_jobs WHERE id = ? AND changes() = 1`).bind(input.id),
    db.prepare("SELECT * FROM import_jobs WHERE id = ?").bind(input.id),
  ]);
  const job = results[2]!.results[0];
  if (!job) throw new Error("Source, membership or allowance unavailable");
  if (job.household_id !== input.householdId || job.member_id !== input.memberId
    || job.source_id !== input.sourceId || job.window_id !== input.windowId || job.units !== input.units) {
    throw new Error("Operation ID reused with different intent");
  }
  return job;
}

export async function retryJob(db: D1Database, input: JobRequest): Promise<Job> {
  await createJob(db, input); // Validates the immutable intent; does not reserve an existing job again.
  const result = await db.batch<Job>([
    db.prepare(`UPDATE import_jobs SET state = 'pending', generation = generation + 1,
      attempts = 0, token = NULL, lease_until = 0, dispatch_after = 0
      WHERE id = ? AND state = 'failed' AND ${authorizedJob}
        AND EXISTS (SELECT 1 FROM allowance_windows WHERE id = import_jobs.window_id AND ${availableCapacity} >= import_jobs.units)`)
      .bind(input.id),
    db.prepare(`UPDATE usage_reservations SET state = 'reserved'
      WHERE job_id = ? AND state = 'released' AND changes() = 1`).bind(input.id),
    db.prepare("SELECT * FROM import_jobs WHERE id = ?").bind(input.id),
  ]);
  return result[2]!.results[0]!;
}

// Paired with every terminal transition in the same batch, including crash recovery.
export function releaseTerminal(db: D1Database) {
  return db.prepare(`UPDATE usage_reservations SET state = 'released'
    WHERE state = 'reserved' AND job_id IN (SELECT id FROM import_jobs WHERE state IN ('failed', 'canceled'))`);
}
