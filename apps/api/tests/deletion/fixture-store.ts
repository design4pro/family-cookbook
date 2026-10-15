import type { ContributionInventory } from "../../src/recipes/contributions";
import type { ContributorPurgePlan } from "../../src/deletion/plan-contributor-purge";

const collections = ["recipes", "contributions", "revisions", "assets", "exports"] as const;
type FixtureObject = { store: string; key: string; body: string };

// Test-only row storage: T02 proves the representation before T12's full schema.
export async function storeFixture(db: D1Database, inventory: ContributionInventory, objects: readonly FixtureObject[]) {
  const statements = collections.flatMap((collection) => [
    db.prepare(`CREATE TABLE proof_${collection} (id TEXT PRIMARY KEY, payload TEXT NOT NULL)`),
    ...inventory[collection].map((row) => db.prepare(`INSERT INTO proof_${collection} VALUES (?, ?)`).bind(row.id, JSON.stringify(row))),
  ]);
  statements.push(db.prepare("CREATE TABLE proof_objects (store TEXT, key TEXT, body TEXT NOT NULL, PRIMARY KEY (store, key))"));
  statements.push(...objects.map(({ store, key, body }) => db.prepare("INSERT INTO proof_objects VALUES (?, ?, ?)").bind(store, key, body)));
  await db.batch(statements);
}

export async function readFixture(db: D1Database): Promise<ContributionInventory> {
  const result = await db.batch<{ payload: string }>(collections.map((collection) => db.prepare(`SELECT payload FROM proof_${collection} ORDER BY id`)));
  return Object.fromEntries(collections.map((collection, index) => [
    collection, result[index]!.results.map(({ payload }) => JSON.parse(payload)),
  ])) as unknown as ContributionInventory;
}

export async function applyFixturePurge(db: D1Database, plan: ContributorPurgePlan) {
  const statements = collections.flatMap((collection) => plan.rows[collection].map((id) =>
    db.prepare(`DELETE FROM proof_${collection} WHERE id = ?`).bind(id),
  ));
  statements.push(...plan.recipeUpdates.map((recipe) =>
    db.prepare("UPDATE proof_recipes SET payload = ? WHERE id = ?").bind(JSON.stringify(recipe), recipe.id),
  ));
  if (statements.length) await db.batch(statements);
  // Deliberately separate from row deletion: this is a synthetic object inventory,
  // not a claim that D1, R2 and external processors share a transaction.
  if (plan.objects.length) {
    await db.batch(plan.objects.map(({ store, key }) => db.prepare("DELETE FROM proof_objects WHERE store = ? AND key = ?").bind(store, key)));
  }
}

export async function readObjects(db: D1Database) {
  return (await db.prepare("SELECT store, key, body FROM proof_objects ORDER BY store, key").all<FixtureObject>()).results;
}
