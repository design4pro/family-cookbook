import { env } from "cloudflare:workers";
import { beforeEach, expect, it } from "vitest";
import { applyCheck, type CheckOperation } from "../../src/shopping/apply-check";

const operation: CheckOperation = {
  householdId: "household-a",
  memberId: "member-a",
  operationId: "operation-a",
  listId: "list-a",
  itemId: "item-a",
  expectedRevision: 7,
  purchased: true,
};

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("INSERT INTO household_members VALUES ('household-a', 'member-a'), ('household-a', 'member-b'), ('household-b', 'member-c')"),
    env.DB.prepare("INSERT INTO shopping_lists (id, household_id) VALUES ('list-a', 'household-a'), ('list-b', 'household-b')"),
    env.DB.prepare("INSERT INTO shopping_items (id, list_id, revision, purchased) VALUES ('item-a', 'list-a', 7, 0), ('item-b', 'list-b', 7, 0)"),
  ]);
});

it("changes revision 7 once and returns the durable outcome after a lost response", async () => {
  await applyCheck(env.DB, operation); // The caller never receives this response.
  expect(await applyCheck(env.DB, operation)).toEqual({ status: "accepted", revision: 8, purchased: true });
  expect(await env.DB.prepare("SELECT revision, purchased FROM shopping_items WHERE id = 'item-a'").first()).toEqual({ revision: 8, purchased: 1 });
  expect(await env.DB.prepare("SELECT count(*) AS count FROM shopping_operations").first()).toEqual({ count: 1 });
});

it("accepts at most one of two members writing revision 7 concurrently", async () => {
  const outcomes = await Promise.all([
    applyCheck(env.DB, operation),
    applyCheck(env.DB, { ...operation, memberId: "member-b", operationId: "operation-b", purchased: false }),
  ]);
  expect(outcomes.map(({ status }) => status).sort()).toEqual(["accepted", "conflict"]);
  const winner = outcomes.find(({ status }) => status === "accepted")!;
  expect(await env.DB.prepare("SELECT revision, purchased FROM shopping_items WHERE id = 'item-a'").first())
    .toEqual({ revision: 8, purchased: Number(winner.purchased) });
  expect(await env.DB.prepare("SELECT count(*) AS count FROM shopping_operations").first()).toEqual({ count: 2 });
});

it("deduplicates concurrent deliveries of the same operation", async () => {
  const outcomes = await Promise.all(Array.from({ length: 5 }, () => applyCheck(env.DB, operation)));
  expect(outcomes).toEqual(Array(5).fill({ status: "accepted", revision: 8, purchased: true }));
  expect(await env.DB.prepare("SELECT revision FROM shopping_items WHERE id = 'item-a'").first()).toEqual({ revision: 8 });
  expect(await env.DB.prepare("SELECT count(*) AS count FROM shopping_operations").first()).toEqual({ count: 1 });
});

it("retains the original accepted outcome after a later uncheck", async () => {
  await applyCheck(env.DB, operation);
  await applyCheck(env.DB, { ...operation, operationId: "later", expectedRevision: 8, purchased: false });
  expect(await applyCheck(env.DB, operation)).toEqual({ status: "accepted", revision: 8, purchased: true });
  expect(await env.DB.prepare("SELECT revision, purchased FROM shopping_items WHERE id = 'item-a'").first())
    .toEqual({ revision: 9, purchased: 0 });
});

it("records a zero-row update as conflict and leaves unrelated reservations untouched", async () => {
  // A sentinel proves this no-charge command leaves existing reservations alone.
  // Queue reservation settlement itself is the separate T05 proof.
  await env.DB.prepare("CREATE TABLE proof_reservations (id TEXT PRIMARY KEY, state TEXT NOT NULL)").run();
  await env.DB.prepare("INSERT INTO proof_reservations VALUES ('unrelated-job', 'reserved')").run();
  const stale = { ...operation, expectedRevision: 6 };
  expect(await applyCheck(env.DB, stale)).toEqual({ status: "conflict", revision: 7, purchased: false });
  await applyCheck(env.DB, { ...operation, operationId: "fresh" });
  expect(await applyCheck(env.DB, stale)).toEqual({ status: "conflict", revision: 7, purchased: false });
  expect(await env.DB.prepare("SELECT * FROM proof_reservations").all()).toMatchObject({ results: [{ id: "unrelated-job", state: "reserved" }] });
});

it("does not turn an already-matching state into success when the revision is stale", async () => {
  expect(await applyCheck(env.DB, { ...operation, expectedRevision: 6, purchased: false }))
    .toEqual({ status: "conflict", revision: 7, purchased: false });
  expect(await env.DB.prepare("SELECT revision FROM shopping_items WHERE id = 'item-a'").first()).toEqual({ revision: 7 });
});

it("rolls the mutation back if writing the outcome fails, then permits a retry", async () => {
  await env.DB.prepare(`CREATE TRIGGER fail_outcome BEFORE INSERT ON shopping_operations
    BEGIN SELECT RAISE(ABORT, 'injected outcome failure'); END`).run();
  await expect(applyCheck(env.DB, operation)).rejects.toThrow("injected outcome failure");
  expect(await env.DB.prepare("SELECT revision, purchased FROM shopping_items WHERE id = 'item-a'").first())
    .toEqual({ revision: 7, purchased: 0 });
  expect(await env.DB.prepare("SELECT count(*) AS count FROM shopping_operations").first()).toEqual({ count: 0 });
  await env.DB.prepare("DROP TRIGGER fail_outcome").run();
  expect(await applyCheck(env.DB, operation)).toEqual({ status: "accepted", revision: 8, purchased: true });
});

it.each(["deleted", "missing", "replaced-list", "wrong-list", "foreign-item"])(
  "does not change or recreate an unavailable item: %s", async (reason) => {
    let input = operation;
    if (reason === "deleted") await env.DB.prepare("UPDATE shopping_items SET deleted = 1 WHERE id = 'item-a'").run();
    if (reason === "missing") input = { ...operation, itemId: "missing-item" };
    if (reason === "replaced-list") await env.DB.prepare("UPDATE shopping_lists SET active = 0 WHERE id = 'list-a'").run();
    if (reason === "wrong-list") input = { ...operation, listId: "list-b" };
    if (reason === "foreign-item") input = { ...operation, listId: "list-b", itemId: "item-b" };
    expect(await applyCheck(env.DB, input)).toEqual({ status: "unavailable", revision: null, purchased: null });
    expect(await env.DB.prepare("SELECT id, revision, purchased FROM shopping_items ORDER BY id").all())
      .toMatchObject({ results: [{ id: "item-a", revision: 7, purchased: 0 }, { id: "item-b", revision: 7, purchased: 0 }] });
  },
);

it("does not disclose or replay another member's recorded operation after membership removal", async () => {
  await applyCheck(env.DB, operation);
  await env.DB.prepare("DELETE FROM household_members WHERE member_id = 'member-a'").run();
  expect(await applyCheck(env.DB, operation)).toEqual({ status: "forbidden", revision: null, purchased: null });
  expect(await applyCheck(env.DB, { ...operation, operationId: "new", expectedRevision: 8, purchased: false }))
    .toEqual({ status: "forbidden", revision: null, purchased: null });
  expect(await env.DB.prepare("SELECT count(*) AS count FROM shopping_operations").first()).toEqual({ count: 1 });
  expect(await env.DB.prepare("SELECT revision, purchased FROM shopping_items WHERE id = 'item-a'").first()).toEqual({ revision: 8, purchased: 1 });
});

it("rejects a member trying to act in another household", async () => {
  expect(await applyCheck(env.DB, { ...operation, householdId: "household-b", listId: "list-b", itemId: "item-b" }))
    .toEqual({ status: "forbidden", revision: null, purchased: null });
  expect(await env.DB.prepare("SELECT count(*) AS count FROM shopping_operations").first()).toEqual({ count: 0 });
  expect(await env.DB.prepare("SELECT revision, purchased FROM shopping_items WHERE id = 'item-b'").first()).toEqual({ revision: 7, purchased: 0 });
});

it("rejects reuse of an operation ID with different intent without mutating again", async () => {
  await applyCheck(env.DB, operation);
  await expect(applyCheck(env.DB, { ...operation, expectedRevision: 8, purchased: false }))
    .rejects.toThrow("Operation ID reused with different intent");
  expect(await env.DB.prepare("SELECT revision, purchased FROM shopping_items WHERE id = 'item-a'").first()).toEqual({ revision: 8, purchased: 1 });
});

it("synchronizes unrelated items independently", async () => {
  await env.DB.prepare("INSERT INTO shopping_items (id, list_id, revision, purchased) VALUES ('other', 'list-a', 7, 0)").run();
  const outcomes = await Promise.all([
    applyCheck(env.DB, operation),
    applyCheck(env.DB, { ...operation, itemId: "other", operationId: "other-operation" }),
  ]);
  expect(outcomes.map(({ status }) => status)).toEqual(["accepted", "accepted"]);
});
