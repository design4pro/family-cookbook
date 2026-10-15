export interface CheckOperation {
  householdId: string;
  memberId: string;
  operationId: string;
  listId: string;
  itemId: string;
  expectedRevision: number;
  purchased: boolean;
}

export type CheckOutcome =
  | { status: "accepted" | "conflict"; revision: number; purchased: boolean }
  | { status: "unavailable" | "forbidden"; revision: null; purchased: null };

interface StoredOutcome {
  list_id: string;
  item_id: string;
  expected_revision: number;
  desired_state: number;
  status: "accepted" | "conflict" | "unavailable";
  revision: number | null;
  purchased: number | null;
}

// memberId must come from a verified session, never from a request body.
export async function applyCheck(db: D1Database, operation: CheckOperation): Promise<CheckOutcome> {
  const { householdId, memberId, operationId, listId, itemId, expectedRevision, purchased } = operation;
  const parameters = [householdId, memberId, operationId, listId, itemId, expectedRevision, Number(purchased)];

  const results = await db.batch<StoredOutcome>([
    db.prepare(`
      UPDATE shopping_items SET purchased = ?7, revision = revision + 1
      WHERE id = ?5 AND list_id = ?4 AND revision = ?6 AND deleted = 0
        AND EXISTS (SELECT 1 FROM shopping_lists WHERE id = ?4 AND household_id = ?1 AND active = 1)
        AND EXISTS (SELECT 1 FROM household_members WHERE household_id = ?1 AND member_id = ?2)
        AND NOT EXISTS (
          SELECT 1 FROM shopping_operations
          WHERE household_id = ?1 AND member_id = ?2 AND operation_id = ?3
        )
    `).bind(...parameters),
    // Keep this INSERT immediately after the UPDATE: changes() describes that
    // statement, including a zero-row conflict. Both writes commit or roll back.
    db.prepare(`
      INSERT INTO shopping_operations (
        household_id, member_id, operation_id, list_id, item_id,
        expected_revision, desired_state, status, revision, purchased
      )
      SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7,
        CASE WHEN changes() = 1 THEN 'accepted'
             WHEN item.id IS NULL THEN 'unavailable' ELSE 'conflict' END,
        item.revision, item.purchased
      FROM (SELECT 1)
      LEFT JOIN shopping_items AS item ON item.id = ?5 AND item.list_id = ?4 AND item.deleted = 0
        AND EXISTS (SELECT 1 FROM shopping_lists WHERE id = ?4 AND household_id = ?1 AND active = 1)
      WHERE EXISTS (SELECT 1 FROM household_members WHERE household_id = ?1 AND member_id = ?2)
      ON CONFLICT (household_id, member_id, operation_id) DO NOTHING
    `).bind(...parameters),
    db.prepare(`
      SELECT list_id, item_id, expected_revision, desired_state, status, revision, purchased
      FROM shopping_operations
      WHERE household_id = ?1 AND member_id = ?2 AND operation_id = ?3
        AND EXISTS (SELECT 1 FROM household_members WHERE household_id = ?1 AND member_id = ?2)
    `).bind(householdId, memberId, operationId),
  ]);

  const outcome = results[2]!.results[0];
  if (!outcome) return { status: "forbidden", revision: null, purchased: null };
  if (outcome.list_id !== listId || outcome.item_id !== itemId
    || outcome.expected_revision !== expectedRevision || outcome.desired_state !== Number(purchased)) {
    throw new Error("Operation ID reused with different intent");
  }
  if (outcome.status === "unavailable") {
    return { status: "unavailable", revision: null, purchased: null };
  }
  return { status: outcome.status, revision: outcome.revision!, purchased: outcome.purchased === 1 };
}
