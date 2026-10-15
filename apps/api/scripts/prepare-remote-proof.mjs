import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import ts from "typescript";

// Emits code for the authenticated Cloudflare connector; never reads credentials.
// This module has no imports after TypeScript erasure. Execute its exact logic
// with a small D1 REST adapter, rather than maintaining a second copy of the SQL.
const source = readFileSync(new URL("../src/shopping/apply-check.ts", import.meta.url), "utf8");
const migration = readFileSync(new URL("../migrations/0001-shopping-proof.sql", import.meta.url), "utf8");
const implementation = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText.replace(/^export /gm, "");
const sourceHash = createHash("sha256").update(source).digest("hex");
const migrationHash = createHash("sha256").update(migration).digest("hex");

async function verifyRemote(applyCheck, migration, sourceHash, migrationHash) {
  const accountId = "6cfdf3b5143cddc631383a4c14736c3a";
  const databaseId = "bb45490f-7369-438f-af78-f55202ba5448";
  const path = `/accounts/${accountId}/d1/database/${databaseId}`;
  const identity = await cloudflare.request({ method: "GET", path });
  if (!identity.success || identity.result.name !== "family-cookbook-t01-proof") {
    throw new Error("Refusing to run outside the designated T01 proof database");
  }

  const observations = [];
  const db = {
    prepare(sql) {
      return { sql, params: [], bind(...params) { return { sql, params }; } };
    },
    async batch(batch) {
      const response = await cloudflare.request({ method: "POST", path: `${path}/query`, body: { batch } });
      if (!response.success || response.result?.some((result) => !result.success)) {
        throw new Error(JSON.stringify(response.errors));
      }
      observations.push(response.result.map(({ meta }) => ({
        changes: meta.changes, servedBy: meta.served_by, region: meta.served_by_region,
        primary: meta.served_by_primary,
      })));
      return response.result;
    },
  };
  async function query(sql, ...params) {
    return (await db.batch([{ sql, params }]))[0].results;
  }
  function equal(actual, expected, label) {
    const normalize = (value) => value !== null && typeof value === "object"
      ? Array.isArray(value) ? value.map(normalize)
        : Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalize(value[key])]))
      : value;
    if (JSON.stringify(normalize(actual)) !== JSON.stringify(normalize(expected))) {
      throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
  }
  const schema = await query("SELECT name FROM sqlite_master WHERE name = 'shopping_items'");
  if (schema.length === 0) await query(migration);
  await query("CREATE TABLE IF NOT EXISTS proof_reservations (id TEXT PRIMARY KEY, state TEXT NOT NULL)");

  // Every run owns a fresh namespace. Previous evidence and other runs survive.
  const run = `t01-${crypto.randomUUID()}`;
  const householdId = `${run}-household`;
  const memberId = `${run}-member-a`;
  const listId = `${run}-list`;
  await db.batch([
    db.prepare("INSERT INTO household_members VALUES (?, ?), (?, ?)").bind(householdId, memberId, householdId, `${run}-member-b`),
    db.prepare("INSERT INTO shopping_lists (id, household_id) VALUES (?, ?)").bind(listId, householdId),
    db.prepare("INSERT INTO proof_reservations VALUES (?, 'reserved')").bind(run),
  ]);
  async function item(suffix) {
    const itemId = `${run}-${suffix}`;
    await query("INSERT INTO shopping_items (id, list_id, revision, purchased) VALUES (?, ?, 7, 0)", itemId, listId);
    return { householdId, memberId, operationId: `${itemId}-op`, listId, itemId, expectedRevision: 7, purchased: true };
  }
  async function state(input) {
    return (await query("SELECT revision, purchased FROM shopping_items WHERE id = ?", input.itemId))[0];
  }
  const accepted = { status: "accepted", revision: 8, purchased: true };
  const passed = [];

  const lost = await item("lost-response");
  await applyCheck(db, lost);
  equal(await applyCheck(db, lost), accepted, "lost response replay");
  equal(await state(lost), { revision: 8, purchased: 1 }, "one mutation");
  await applyCheck(db, { ...lost, operationId: `${lost.operationId}-later`, expectedRevision: 8, purchased: false });
  equal(await applyCheck(db, lost), accepted, "original outcome after later change");
  equal(await state(lost), { revision: 9, purchased: 0 }, "replay does not overwrite later change");
  passed.push("lost response and immutable replay");

  const duplicate = await item("duplicate");
  equal(await Promise.all([applyCheck(db, duplicate), applyCheck(db, duplicate)]), [accepted, accepted], "concurrent duplicate");
  equal(await state(duplicate), { revision: 8, purchased: 1 }, "duplicate changes once");
  equal(await query("SELECT count(*) AS count FROM shopping_operations WHERE item_id = ?", duplicate.itemId), [{ count: 1 }], "one durable outcome");
  passed.push("concurrent duplicate delivery");

  const race = await item("race");
  const outcomes = await Promise.all([
    applyCheck(db, race),
    applyCheck(db, { ...race, memberId: `${run}-member-b`, operationId: `${race.operationId}-b`, purchased: false }),
  ]);
  equal(outcomes.map(({ status }) => status).sort(), ["accepted", "conflict"], "two writers");
  equal(await state(race), { revision: 8, purchased: Number(outcomes.find(({ status }) => status === "accepted").purchased) }, "race winner");
  passed.push("two writers on revision 7");

  const stale = await item("stale");
  equal(await applyCheck(db, { ...stale, expectedRevision: 6 }), { status: "conflict", revision: 7, purchased: false }, "zero-row conflict");
  equal(await state(stale), { revision: 7, purchased: 0 }, "no stale mutation");
  equal(await query("SELECT state FROM proof_reservations WHERE id = ?", run), [{ state: "reserved" }], "unrelated reservation");
  passed.push("zero-row conflict and untouched reservation sentinel");

  const crash = await item("crash");
  const trigger = `fail_${run.replaceAll("-", "_")}`;
  // Generated UUID identifiers only; the trigger fails after UPDATE but before
  // the outcome INSERT. It is confined to this run's operation and always removed.
  await query(`CREATE TRIGGER ${trigger} BEFORE INSERT ON shopping_operations
    WHEN NEW.operation_id = '${crash.operationId}'
    BEGIN SELECT RAISE(ABORT, 'injected outcome failure'); END`);
  let failure;
  try {
    try { await applyCheck(db, crash); } catch (error) { failure = String(error); }
    if (!failure?.includes("injected outcome failure")) throw new Error(`Expected injected failure: ${failure}`);
    equal(await state(crash), { revision: 7, purchased: 0 }, "rollback item");
    equal(await query("SELECT count(*) AS count FROM shopping_operations WHERE item_id = ?", crash.itemId), [{ count: 0 }], "rollback outcome");
  } finally {
    await query(`DROP TRIGGER ${trigger}`);
  }
  equal(await applyCheck(db, crash), accepted, "retry after rollback");
  passed.push("rollback between mutation and outcome, then retry");

  const deleted = await item("deleted");
  await query("UPDATE shopping_items SET deleted = 1 WHERE id = ?", deleted.itemId);
  equal(await applyCheck(db, deleted), { status: "unavailable", revision: null, purchased: null }, "deleted item");
  equal(await state(deleted), { revision: 7, purchased: 0 }, "no resurrection");
  equal(await applyCheck(db, { ...deleted, householdId: `${run}-foreign`, operationId: `${run}-forbidden` }), { status: "forbidden", revision: null, purchased: null }, "foreign household");
  equal(await state(deleted), { revision: 7, purchased: 0 }, "no foreign mutation");
  passed.push("deleted item and cross-household denial");

  const rows = await query("SELECT operation_id, status, revision, purchased FROM shopping_operations WHERE household_id = ? ORDER BY operation_id", householdId);
  return { run, accountId, databaseId, databaseName: identity.result.name, sourceHash, migrationHash, passed, injectedFailure: failure, outcomes: rows, observations };
}

process.stdout.write(JSON.stringify({
  code: `async () => {\n${implementation}\n${verifyRemote.toString()}\nreturn verifyRemote(applyCheck, ${JSON.stringify(migration)}, ${JSON.stringify(sourceHash)}, ${JSON.stringify(migrationHash)});\n}`,
}));
