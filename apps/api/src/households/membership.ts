import type { Household } from "./contract";

export const INVITATION_LIFETIME_MS = 7 * 86400_000;

async function tokenHash(token: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

// The caller obtains userId from a verified session, never from the request body.
export async function createHousehold(db: D1Database, userId: string): Promise<string | null> {
  const id = crypto.randomUUID();
  const results = await db.batch([
    db.prepare(`INSERT INTO households (id, administrator_id) SELECT ?, ?
      WHERE EXISTS (SELECT 1 FROM user WHERE id = ? AND emailVerified = 1)
      AND NOT EXISTS (SELECT 1 FROM household_members WHERE member_id = ?)`)
      .bind(id, userId, userId, userId),
    db.prepare(`INSERT INTO household_members (household_id, member_id)
      SELECT id, administrator_id FROM households WHERE id = ?`).bind(id),
    db.prepare(`INSERT INTO billing_households (household_id, payer_user_id)
      SELECT id, administrator_id FROM households WHERE id = ?`).bind(id),
  ]);
  return results[0]!.meta.changes === 1 ? id : null;
}

export async function hasMembership(db: D1Database, userId: string, householdId: string) {
  return !!await db.prepare(`SELECT 1 FROM household_members m JOIN households h ON h.id = m.household_id
    WHERE m.member_id = ? AND h.id = ? AND h.closed = 0`).bind(userId, householdId).first();
}

export async function getHousehold(db: D1Database, userId: string): Promise<Household | null> {
  // One SQL snapshot avoids leaking member details if removal races a read.
  const row = await db.prepare(`SELECT h.id, h.administrator_id AS administratorId, b.payer_user_id AS payerId,
    (SELECT json_group_array(json_object('id', m.member_id, 'email', u.email))
      FROM household_members m JOIN user u ON u.id = m.member_id WHERE m.household_id = h.id) AS members,
    CASE WHEN h.administrator_id = ?1 THEN (SELECT json_group_array(json_object('id', i.id, 'email', i.email, 'expiresAt', i.expires_at))
      FROM household_invitations i WHERE i.household_id = h.id AND i.consumed_by IS NULL AND i.revoked = 0 AND i.expires_at > ?2)
      ELSE '[]' END AS invitations,
    (SELECT json_object('id', r.id, 'senderId', r.sender_id, 'recipientId', r.recipient_id, 'expiresAt', r.expires_at)
      FROM household_handovers r WHERE r.household_id = h.id AND r.expires_at > ?2) AS handover,
    (h.administrator_id IS NULL AND h.administration_claimable = 1 AND EXISTS
      (SELECT 1 FROM household_administration_claimants c JOIN user u ON u.id = c.member_id AND u.emailVerified = 1
        WHERE c.household_id = h.id AND c.member_id = ?1)) AS canClaimAdministration,
    (SELECT json_group_array(json_object('id', n.id, 'kind', n.kind, 'createdAt', n.created_at)) FROM
      (SELECT id, kind, created_at FROM household_notifications WHERE household_id = h.id AND member_id = ?1 ORDER BY id DESC LIMIT 20) n) AS notifications
    FROM households h JOIN household_members self ON self.household_id = h.id
      LEFT JOIN billing_households b ON b.household_id = h.id
    WHERE self.member_id = ?1 AND h.closed = 0`).bind(userId, Date.now())
    .first<{ id: string; administratorId: string | null; payerId: string | null; members: string; invitations: string;
      handover: string | null; canClaimAdministration: number; notifications: string }>();
  return row ? { ...row, members: JSON.parse(row.members), invitations: JSON.parse(row.invitations),
    handover: row.handover ? JSON.parse(row.handover) : null, canClaimAdministration: !!row.canClaimAdministration,
    notifications: JSON.parse(row.notifications) } : null;
}

export async function inviteMember(db: D1Database, userId: string, householdId: string, email: string, now = Date.now()) {
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return null;
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, "0")).join("");
  const id = crypto.randomUUID(), expiresAt = now + INVITATION_LIFETIME_MS;
  const result = await db.prepare(`INSERT INTO household_invitations (id, household_id, email, token_hash, issued_by, expires_at)
    SELECT ?1, h.id, ?3, ?4, ?5, ?6 FROM households h JOIN household_members m ON m.household_id = h.id
    WHERE h.id = ?2 AND h.closed = 0 AND h.administrator_id = ?5 AND m.member_id = ?5
      AND (SELECT COUNT(*) FROM household_members WHERE household_id = h.id) < 5`)
    .bind(id, householdId, normalized, await tokenHash(token), userId, expiresAt).run();
  return result.meta.changes === 1 ? { id, token, expiresAt } : null;
}

export async function acceptInvitation(db: D1Database, userId: string, token: string, now = Date.now()): Promise<string | null> {
  const hash = await tokenHash(token);
  const results = await db.batch<{ household_id: string }>([
    db.prepare(`INSERT INTO household_members (household_id, member_id)
      SELECT i.household_id, u.id FROM household_invitations i
        JOIN user u ON u.id = ?1 AND lower(u.email) = i.email AND u.emailVerified = 1
        JOIN households h ON h.id = i.household_id AND h.closed = 0 AND h.administrator_id = i.issued_by
      WHERE i.token_hash = ?2 AND i.consumed_by IS NULL AND i.revoked = 0 AND i.expires_at > ?3
        AND EXISTS (SELECT 1 FROM household_members WHERE household_id = h.id AND member_id = i.issued_by)
        AND NOT EXISTS (SELECT 1 FROM household_members WHERE member_id = ?1)
        AND (SELECT COUNT(*) FROM household_members WHERE household_id = i.household_id) < 5
      RETURNING household_id`).bind(userId, hash, now),
    db.prepare(`UPDATE household_invitations SET consumed_by = ? WHERE token_hash = ? AND changes() = 1`)
      .bind(userId, hash),
  ]);
  return results[0]!.results[0]?.household_id ?? null;
}

export async function revokeInvitation(db: D1Database, userId: string, householdId: string, invitationId: string) {
  const result = await db.prepare(`UPDATE household_invitations SET revoked = 1
    WHERE id = ? AND household_id = ? AND consumed_by IS NULL AND revoked = 0
      AND EXISTS (SELECT 1 FROM households h JOIN household_members m ON m.household_id = h.id
        WHERE h.id = household_invitations.household_id AND h.administrator_id = ? AND m.member_id = ? AND h.closed = 0)`)
    .bind(invitationId, householdId, userId, userId).run();
  return result.meta.changes === 1;
}

export async function removeMember(db: D1Database, userId: string, householdId: string, memberId: string) {
  const result = await db.prepare(`DELETE FROM household_members WHERE household_id = ?1 AND member_id = ?2
    AND EXISTS (SELECT 1 FROM households h JOIN household_members actor ON actor.household_id = h.id
      WHERE h.id = ?1 AND h.closed = 0 AND actor.member_id = ?3
        AND (?2 = ?3 OR h.administrator_id = ?3)
        AND (h.administrator_id IS NULL OR h.administrator_id != ?2
          OR (SELECT COUNT(*) FROM household_members WHERE household_id = ?1) = 1)) RETURNING member_id`)
    .bind(householdId, memberId, userId).all();
  return result.results.length === 1;
}

// Future recipe/object handlers must wrap private reads here, never issue permanent public URLs.
export async function readHouseholdResource(db: D1Database, userId: string, householdId: string, read: () => Promise<Response>) {
  const forbidden = () => Response.json({ error: "Household access revoked" }, { status: 403, headers: { "cache-control": "no-store" } });
  if (!await hasMembership(db, userId, householdId)) return forbidden();
  const response = await read();
  // An object fetch may finish after removal. Recheck before exposing its body.
  if (!await hasMembership(db, userId, householdId)) return forbidden();
  response.headers.set("cache-control", "no-store");
  return response;
}
