export const HANDOVER_LIFETIME_MS = 7 * 86400_000;
export const REAUTHENTICATION_LIFETIME_MS = 5 * 60_000;

// Only call after successful one-time email verification for this session's user.
export async function grantHandoverReauthentication(db: D1Database, userId: string, sessionId: string, householdId: string, now = Date.now()) {
  const result = await db.prepare(`INSERT INTO household_reauthentication (session_id, household_id, expires_at)
    SELECT s.id, h.id, ?4 FROM session s JOIN households h ON h.id = ?3
      JOIN household_members m ON m.household_id = h.id AND m.member_id = ?1
    WHERE s.id = ?2 AND s.userId = ?1 AND h.administrator_id = ?1 AND h.closed = 0
    ON CONFLICT (session_id) DO UPDATE SET household_id = excluded.household_id, expires_at = excluded.expires_at
    RETURNING session_id`).bind(userId, sessionId, householdId, now + REAUTHENTICATION_LIFETIME_MS).all();
  return result.results.length === 1;
}

export async function requestHandover(db: D1Database, userId: string, sessionId: string, householdId: string, recipientId: string, now = Date.now()) {
  const id = crypto.randomUUID(), expiresAt = now + HANDOVER_LIFETIME_MS;
  const results = await db.batch([
    db.prepare("DELETE FROM household_handovers WHERE household_id = ? AND expires_at <= ?").bind(householdId, now),
    db.prepare(`INSERT INTO household_handovers (id, household_id, sender_id, recipient_id, expires_at)
      SELECT ?1, h.id, ?3, ?4, ?5 FROM households h
        JOIN household_members sender ON sender.household_id = h.id AND sender.member_id = ?3
        JOIN household_members recipient ON recipient.household_id = h.id AND recipient.member_id = ?4
        JOIN user u ON u.id = recipient.member_id AND u.emailVerified = 1
        JOIN household_reauthentication r ON r.household_id = h.id AND r.session_id = ?6 AND r.expires_at > ?7
        JOIN session s ON s.id = r.session_id AND s.userId = ?3
      WHERE h.id = ?2 AND h.administrator_id = ?3 AND h.closed = 0 AND ?3 != ?4
        AND NOT EXISTS (SELECT 1 FROM household_handovers WHERE household_id = h.id)
      RETURNING id`).bind(id, householdId, userId, recipientId, expiresAt, sessionId, now),
    // SQLite changes() excludes trigger writes and describes the preceding INSERT.
    db.prepare("DELETE FROM household_reauthentication WHERE session_id = ? AND changes() = 1").bind(sessionId),
  ]);
  return results[1]!.results.length === 1 ? { id, expiresAt } : null;
}

export async function cancelHandover(db: D1Database, userId: string, householdId: string, requestId: string) {
  const result = await db.prepare(`DELETE FROM household_handovers WHERE id = ?1 AND household_id = ?2 AND sender_id = ?3
    AND EXISTS (SELECT 1 FROM households h JOIN household_members m ON m.household_id = h.id
      WHERE h.id = ?2 AND h.administrator_id = ?3 AND m.member_id = ?3 AND h.closed = 0)
    RETURNING id`).bind(requestId, householdId, userId).all();
  return result.results.length === 1;
}

export async function acceptHandover(db: D1Database, userId: string, householdId: string, requestId: string, now = Date.now()) {
  const result = await db.prepare(`UPDATE households SET administrator_id = ?1, administration_claimable = 0
    WHERE id = ?2 AND closed = 0 AND EXISTS (
      SELECT 1 FROM household_handovers r
        JOIN household_members recipient ON recipient.household_id = r.household_id AND recipient.member_id = ?1
        JOIN user u ON u.id = recipient.member_id AND u.emailVerified = 1
        JOIN household_members sender ON sender.household_id = r.household_id AND sender.member_id = r.sender_id
      WHERE r.id = ?3 AND r.household_id = households.id AND r.recipient_id = ?1
        AND r.sender_id = households.administrator_id AND r.expires_at > ?4)
    RETURNING id`).bind(userId, householdId, requestId, now).all();
  return result.results.length === 1;
}

export async function claimAdministration(db: D1Database, userId: string, householdId: string) {
  const result = await db.prepare(`UPDATE households SET administrator_id = ?1, administration_claimable = 0
    WHERE id = ?2 AND administrator_id IS NULL AND administration_claimable = 1 AND closed = 0
      AND EXISTS (SELECT 1 FROM household_administration_claimants c
        JOIN household_members m ON m.household_id = c.household_id AND m.member_id = c.member_id
        JOIN user u ON u.id = m.member_id AND u.emailVerified = 1
        WHERE c.household_id = households.id AND c.member_id = ?1)
    RETURNING id`).bind(userId, householdId).all();
  return result.results.length === 1;
}
