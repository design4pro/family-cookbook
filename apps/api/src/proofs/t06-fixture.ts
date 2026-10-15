import { createContribution } from "../recipes/contributions";
import { createJob } from "../usage/reservations";
import { sha256, type RecoveryEnvironment, type RecoveryManifest } from "../recovery/restore-household";
export { readManifest } from "../recovery/restore-household";

export async function seedRecoveryFixture(env: RecoveryEnvironment) {
  const aText = createContribution({ id: "a-text", recipeId: "shared", kind: "text", value: "A independent instruction", contributorId: "A" });
  const aSource = createContribution({ id: "a-source", recipeId: "shared", kind: "source", value: "A original image", contributorId: "A" });
  const bSource = createContribution({ id: "b-source", recipeId: "shared", kind: "source", value: "B_PRIVATE audio", contributorId: "B" });
  const derived = createContribution({ id: "derived", recipeId: "shared", kind: "text", value: "B_PRIVATE derived text", contributorId: "A" }, [bSource]);
  const manifest: RecoveryManifest = {
    prefix: "t06/",
    inventory: {
      recipes: [{ id: "shared", creatorId: "A", status: "approved", currentContributionIds: ["a-text", "derived"] }],
      contributions: [aText, aSource, bSource, derived],
      revisions: [{ id: "old-b", recipeId: "shared", editorId: "B", contributionIds: ["b-source", "derived"] }],
      assets: [
        { id: "a-original", contributionId: "a-source", store: "source", key: "t06/source/a" },
        { id: "a-copy", contributionId: "a-source", store: "recovery", key: "t06/recovery/a" },
        { id: "a-cache", contributionId: "a-source", store: "processor", key: "t06/cache/a" },
        { id: "b-original", contributionId: "b-source", store: "source", key: "t06/source/b" },
        { id: "b-copy", contributionId: "b-source", store: "recovery", key: "t06/recovery/b" },
        { id: "b-processor", contributionId: "b-source", store: "processor", key: "t06/processor/b" },
        { id: "b-cache", contributionId: "b-source", store: "processor", key: "t06/cache/b" },
      ],
      exports: [
        { id: "safe", contributionIds: ["a-text", "a-source"], key: "t06/export/a" },
        { id: "mixed", contributionIds: ["a-text", "b-source", "derived"], key: "t06/export/mixed" },
      ],
    },
    sources: [],
  };
  for (const letter of ["a", "b"]) {
    const text = letter === "a" ? "A original media bytes" : "B_PRIVATE original media bytes";
    const bytes = new TextEncoder().encode(text);
    await env.ACTIVE.put(`t06/source/${letter}`, bytes);
    await env.RECOVERY.put(`t06/recovery/${letter}`, bytes);
    await env.ACTIVE.put(`t06/cache/${letter}`, text);
    manifest.sources.push({ sourceKey: `t06/source/${letter}`, recoveryKey: `t06/recovery/${letter}`, sha256: await sha256(bytes) });
  }
  await env.ACTIVE.put("t06/processor/b", "B_PRIVATE temporary processor copy");
  await env.ACTIVE.put("t06/export/a", "A independent archive");
  await env.ACTIVE.put("t06/export/mixed", "A and B_PRIVATE archive");
  await env.DB.batch([
    env.DB.prepare("INSERT INTO recovery_manifest VALUES (1, ?)").bind(JSON.stringify(manifest)),
    env.DB.prepare("INSERT INTO household_members VALUES ('home', 'A'), ('home', 'B')"),
    env.DB.prepare("INSERT INTO recovery_sessions VALUES ('session-a', 'A', 0), ('session-b', 'B', 0)"),
    env.DB.prepare("INSERT INTO import_sources VALUES ('a-original', 'home', 0), ('b-original', 'home', 0)"),
    env.DB.prepare("INSERT INTO allowance_windows VALUES ('window', 'home', 10)"),
  ]);
  for (const letter of ["a", "b"]) await createJob(env.DB, {
    id: `job-${letter}`, householdId: "home", memberId: letter.toUpperCase(), sourceId: `${letter}-original`, windowId: "window", units: 1,
  });
  return manifest;
}
