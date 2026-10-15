import { closeRecovery, readJournal, verifyRecovery } from "../deletion/journal";
import { planContributorPurge, type ContributorPurgePlan } from "../deletion/plan-contributor-purge";
import type { ContributionInventory } from "../recipes/contributions";

export interface RecoveryManifest {
  prefix: string;
  inventory: ContributionInventory;
  sources: { sourceKey: string; recoveryKey: string; sha256: string }[];
}
export interface RecoveryEnvironment { DB: D1Database; JOURNAL: D1Database; ACTIVE: R2Bucket; RECOVERY: R2Bucket }

export async function readManifest(db: D1Database): Promise<RecoveryManifest> {
  const payload = await db.prepare("SELECT payload FROM recovery_manifest WHERE id = 1").first<string>("payload");
  if (!payload) throw new Error("Recovery manifest missing");
  return JSON.parse(payload) as RecoveryManifest;
}

export async function sha256(bytes: ArrayBuffer | Uint8Array) {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(value => value.toString(16).padStart(2, "0")).join("");
}

function removeRows(inventory: ContributionInventory, plan: ContributorPurgePlan): ContributionInventory {
  const removed = (collection: keyof ContributorPurgePlan["rows"], id: string) => plan.rows[collection].includes(id);
  return {
    recipes: inventory.recipes.filter(row => !removed("recipes", row.id)).map(row => plan.recipeUpdates.find(update => update.id === row.id) ?? row),
    contributions: inventory.contributions.filter(row => !removed("contributions", row.id)),
    revisions: inventory.revisions.filter(row => !removed("revisions", row.id)),
    assets: inventory.assets.filter(row => !removed("assets", row.id)),
    exports: inventory.exports.filter(row => !removed("exports", row.id)),
  };
}

async function keys(bucket: R2Bucket, prefix: string) {
  const result: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix, cursor });
    result.push(...page.objects.map(object => object.key));
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return result.sort();
}

// The caller must isolate routes, consumers, cron and external effects before provider restore.
// The independent gate is closed before invoking that destructive operation and stays closed on errors.
export async function restoreHousehold(env: RecoveryEnvironment, restoreDatabase: () => Promise<void>, now = Date.now) {
  const epoch = await closeRecovery(env.JOURNAL);
  await restoreDatabase();
  const journal = await readJournal(env.JOURNAL);
  const sequence = journal.at(-1)?.sequence ?? 0;
  let manifest = await readManifest(env.DB);
  if (!manifest.prefix || [...manifest.inventory.assets, ...manifest.inventory.exports].some(row => !row.key.startsWith(manifest.prefix))) {
    throw new Error("Object outside recovery boundary");
  }
  const originals = manifest.inventory.assets.filter(row => row.store === "source");
  if (manifest.sources.length !== originals.length || originals.some(asset => {
    const mappings = manifest.sources.filter(source => source.sourceKey === asset.key);
    return mappings.length !== 1 || !manifest.inventory.assets.some(copy => copy.store === "recovery"
      && copy.key === mappings[0]!.recoveryKey && copy.contributionId === asset.contributionId);
  })) throw new Error("Source recovery inventory incomplete");
  // Restored sessions are never trusted, even for retained members. Fence all old job deliveries.
  await env.DB.batch([
    env.DB.prepare("UPDATE recovery_sessions SET revoked = 1"),
    env.DB.prepare(`UPDATE import_jobs SET generation = generation + 1, state = 'pending', token = NULL,
      attempts = 0, lease_until = 0, dispatch_after = 0 WHERE state IN ('pending', 'running')`),
  ]);
  for (const record of journal) {
    const plan = planContributorPurge(manifest.inventory, record.account_id);
    const statements = [env.DB.prepare("DELETE FROM household_members WHERE member_id = ?").bind(record.account_id)];
    for (const id of plan.rows.assets) statements.push(env.DB.prepare("UPDATE import_sources SET deleted = 1 WHERE id = ?").bind(id));
    statements.push(
      env.DB.prepare(`UPDATE import_jobs SET state = 'canceled', token = NULL, lease_until = 0
        WHERE member_id = ? OR source_id IN (SELECT id FROM import_sources WHERE deleted = 1)`).bind(record.account_id),
      env.DB.prepare("DELETE FROM import_results WHERE job_id IN (SELECT id FROM import_jobs WHERE state = 'canceled')"),
      env.DB.prepare("UPDATE usage_reservations SET state = 'released' WHERE state = 'reserved' AND job_id IN (SELECT id FROM import_jobs WHERE state = 'canceled')"),
    );
    await env.DB.batch(statements);
    // Delete objects before dropping their inventory. An interrupted purge remains retryable.
    for (const object of plan.objects) {
      const bucket = object.store === "recovery" ? env.RECOVERY : env.ACTIVE;
      await bucket.delete(object.key);
      if (await bucket.head(object.key)) throw new Error("Object deletion not confirmed");
    }
    const deletedSources = new Set(plan.objects.filter(object => object.store === "source").map(object => object.key));
    manifest = { ...manifest, inventory: removeRows(manifest.inventory, plan), sources: manifest.sources.filter(source => !deletedSources.has(source.sourceKey)) };
    await env.DB.prepare("UPDATE recovery_manifest SET payload = ? WHERE id = 1").bind(JSON.stringify(manifest)).run();
  }
  let recoveredSources = 0;
  for (const source of manifest.sources) {
    let original = await env.ACTIVE.get(source.sourceKey);
    if (!original) {
      const copy = await env.RECOVERY.get(source.recoveryKey);
      if (!copy) throw new Error("Retained source recovery copy missing");
      const bytes = await copy.arrayBuffer();
      if (await sha256(bytes) !== source.sha256) throw new Error("Recovery copy checksum mismatch");
      await env.ACTIVE.put(source.sourceKey, bytes);
      recoveredSources++;
      original = await env.ACTIVE.get(source.sourceKey);
    }
    if (!original || await sha256(await original.arrayBuffer()) !== source.sha256) throw new Error("Restored source checksum mismatch");
  }
  const expectedActive = [...manifest.inventory.assets.filter(row => row.store !== "recovery").map(row => row.key),
    ...manifest.inventory.exports.map(row => row.key)].sort();
  const expectedRecovery = manifest.inventory.assets.filter(row => row.store === "recovery").map(row => row.key).sort();
  const active = await keys(env.ACTIVE, manifest.prefix);
  const recovery = await keys(env.RECOVERY, manifest.prefix);
  if (JSON.stringify(active) !== JSON.stringify(expectedActive) || JSON.stringify(recovery) !== JSON.stringify(expectedRecovery)) {
    throw new Error("Object inventory mismatch; recovery remains closed");
  }
  for (const record of journal) await env.JOURNAL.prepare("UPDATE deletion_journal SET active_purged_at = COALESCE(active_purged_at, ?) WHERE sequence = ?")
    .bind(now(), record.sequence).run();
  await verifyRecovery(env.JOURNAL, epoch, sequence);
  return { epoch, journalSequence: sequence, replayedAccounts: journal.length, recoveredSources, activeKeys: active, recoveryKeys: recovery };
}
