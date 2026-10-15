export interface DeletionRecord {
  sequence: number;
  account_id: string;
  requested_at: number;
  active_purged_at: number | null;
}

// This database is outside the application restore boundary. Store only opaque IDs and timing.
export async function recordDeletion(journal: D1Database, accountId: string, requestedAt: number) {
  await journal.batch([
    journal.prepare("INSERT INTO deletion_journal (account_id, requested_at) VALUES (?, ?) ON CONFLICT (account_id) DO NOTHING")
      .bind(accountId, requestedAt),
    journal.prepare("UPDATE recovery_control SET phase = 'closed', epoch = epoch + 1 WHERE id = 1"),
  ]);
}

export async function closeRecovery(journal: D1Database): Promise<number> {
  const row = await journal.prepare("UPDATE recovery_control SET phase = 'closed', epoch = epoch + 1 WHERE id = 1 RETURNING epoch")
    .first<{ epoch: number }>();
  if (!row) throw new Error("Recovery control missing");
  return row.epoch;
}

export async function readJournal(journal: D1Database) {
  return (await journal.prepare("SELECT * FROM deletion_journal ORDER BY sequence").all<DeletionRecord>()).results;
}

export async function verifyRecovery(journal: D1Database, epoch: number, sequence: number) {
  const result = await journal.prepare(`UPDATE recovery_control SET phase = 'verified', replayed_sequence = ?
    WHERE id = 1 AND epoch = ? AND COALESCE((SELECT MAX(sequence) FROM deletion_journal), 0) = ?`)
    .bind(sequence, epoch, sequence).run();
  if (result.meta.changes !== 1) throw new Error("Deletion journal or recovery epoch changed; replay required");
}

export async function assertRecoveryVerified(journal: D1Database, expectedEpoch?: number) {
  const row = await journal.prepare(`SELECT epoch FROM recovery_control WHERE id = 1 AND phase = 'verified'
    AND replayed_sequence = COALESCE((SELECT MAX(sequence) FROM deletion_journal), 0)`).first();
  if (!row) throw new Error("Recovery is closed");
  if (expectedEpoch !== undefined && row.epoch !== expectedEpoch) throw new Error("Stale recovery epoch");
}

export function deletionDeadlines(record: DeletionRecord) {
  const day = 86_400_000;
  return {
    activePurgeBy: record.requested_at + 7 * day,
    backupExpiryBy: record.active_purged_at === null ? record.requested_at + 37 * day
      : Math.min(record.active_purged_at + 30 * day, record.requested_at + 37 * day),
  };
}
