import { env } from "cloudflare:workers";
import { expect, it } from "vitest";
import { createContribution, assistantRecipeContent, type ContributionInventory } from "../../src/recipes/contributions";
import { planContributorPurge } from "../../src/deletion/plan-contributor-purge";
import { applyFixturePurge, readFixture, readObjects, storeFixture } from "./fixture-store";

function fixture(): ContributionInventory {
  const original = createContribution({ id: "a-text", recipeId: "shared", kind: "text", value: "A independent instruction", contributorId: "A" });
  const originalStep = createContribution({ id: "a-step", recipeId: "shared", kind: "text", value: "A superseded step", contributorId: "A" });
  const originalSource = createContribution({ id: "a-source", recipeId: "shared", kind: "source", value: "A original image", contributorId: "A" });
  const bEdit = createContribution({ id: "b-text", recipeId: "shared", kind: "text", value: "B_PRIVATE edit", contributorId: "B" }, [originalStep]);
  const cEdit = createContribution({ id: "c-derived", recipeId: "shared", kind: "text", value: "C revised B_PRIVATE edit", contributorId: "C" }, [bEdit]);
  const cIndependent = createContribution({ id: "c-independent", recipeId: "shared", kind: "text", value: "C independent garnish", contributorId: "C" });
  const source = createContribution({ id: "b-source", recipeId: "shared", kind: "source", value: "B_PRIVATE recording", contributorId: "B" });
  const ai = createContribution({ id: "ai-derived", recipeId: "shared", kind: "text", value: "B_PRIVATE AI extraction", contributorId: null }, [source]);
  const safe = createContribution({ id: "safe-text", recipeId: "safe", kind: "text", value: "A separate recipe", contributorId: "A" });
  return {
    recipes: [
      { id: "shared", creatorId: "A", status: "approved", currentContributionIds: ["a-text", "c-derived", "c-independent", "ai-derived"] },
      { id: "safe", creatorId: "A", status: "approved", currentContributionIds: ["safe-text"] },
    ],
    contributions: [original, originalStep, originalSource, bEdit, cEdit, cIndependent, source, ai, safe],
    revisions: [
      { id: "history-a", recipeId: "shared", editorId: "A", contributionIds: ["a-text", "a-step"] },
      { id: "history-b", recipeId: "shared", editorId: "B", contributionIds: ["a-text", "b-text"] },
      { id: "history-c", recipeId: "shared", editorId: "C", contributionIds: ["a-text", "c-derived", "c-independent", "ai-derived"] },
    ],
    assets: [
      { id: "a-original", contributionId: "a-source", store: "source", key: "a-original" },
      { id: "a-recovery", contributionId: "a-source", store: "recovery", key: "a-recovery" },
      { id: "a-processor", contributionId: "a-source", store: "processor", key: "a-processor" },
      { id: "b-original", contributionId: "b-source", store: "source", key: "b-original" },
      { id: "b-recovery", contributionId: "b-source", store: "recovery", key: "b-recovery" },
      { id: "b-processor", contributionId: "b-source", store: "processor", key: "b-processor" },
    ],
    exports: [
      { id: "mixed-export", contributionIds: ["a-text", "c-derived", "b-source"], key: "mixed-export.zip" },
      { id: "safe-export", contributionIds: ["a-text", "a-source", "safe-text"], key: "safe-export.zip" },
    ],
  };
}

async function seed(inventory = fixture()) {
  await storeFixture(env.DB, inventory, [
    { store: "source", key: "a-original", body: "A image bytes" },
    { store: "recovery", key: "a-recovery", body: "A recovery bytes" },
    { store: "processor", key: "a-processor", body: "A processor bytes" },
    { store: "source", key: "b-original", body: "B_PRIVATE audio bytes" },
    { store: "recovery", key: "b-recovery", body: "B_PRIVATE recovery bytes" },
    { store: "processor", key: "b-processor", body: "B_PRIVATE processor bytes" },
    { store: "export", key: "mixed-export.zip", body: "A independent text and B_PRIVATE text/audio" },
    { store: "export", key: "safe-export.zip", body: "A independent exported recipes" },
  ]);
}

it("purges B's text, transitive edits, AI output, history and copies while preserving independent A/C content", async () => {
  await seed();
  const plan = planContributorPurge(await readFixture(env.DB), "B");
  expect(plan.rows.contributions).toEqual(["ai-derived", "b-source", "b-text", "c-derived"]);
  expect(plan.rows.revisions).toEqual(["history-b", "history-c"]);
  expect(plan.rows.assets).toEqual(["b-original", "b-processor", "b-recovery"]);
  expect(plan.rows.exports).toEqual(["mixed-export"]);
  expect(plan.objects).toEqual([
    { store: "source", key: "b-original" },
    { store: "processor", key: "b-processor" },
    { store: "recovery", key: "b-recovery" },
    { store: "export", key: "mixed-export.zip" },
  ]);
  await applyFixturePurge(env.DB, plan);
  const after = await readFixture(env.DB);
  expect(after.contributions.map(({ id }) => id)).toEqual(["a-source", "a-step", "a-text", "c-independent", "safe-text"]);
  expect(after.revisions.map(({ id }) => id)).toEqual(["history-a"]);
  expect(after.recipes.find(({ id }) => id === "shared")).toEqual({
    id: "shared", creatorId: "A", status: "review-required", currentContributionIds: ["a-text", "c-independent"],
  });
  expect(assistantRecipeContent(after, "shared")).toBeNull();
  expect(assistantRecipeContent(after, "safe")?.map(({ value }) => value)).toEqual(["A separate recipe"]);
  expect(JSON.stringify(after)).not.toContain("B_PRIVATE");
  expect(after.assets.map(({ id }) => id)).toEqual(["a-original", "a-processor", "a-recovery"]);
  expect(await readObjects(env.DB)).toEqual([
    { store: "export", key: "safe-export.zip", body: "A independent exported recipes" },
    { store: "processor", key: "a-processor", body: "A processor bytes" },
    { store: "recovery", key: "a-recovery", body: "A recovery bytes" },
    { store: "source", key: "a-original", body: "A image bytes" },
  ]);
});

it("refuses to plan a purge when stored content has lost its provenance", async () => {
  const inventory = fixture();
  await seed({ ...inventory, contributions: inventory.contributions.map((row) => row.id === "c-derived" ? { ...row, contributorIds: [] } : row) });
  expect(() => planContributorPurge(inventory, "B")).not.toThrow();
  const incomplete = await readFixture(env.DB);
  expect(() => planContributorPurge(incomplete, "B")).toThrow("Contribution provenance is required");
});

it("retains B in provenance through repeated edits and multi-source AI derivation", () => {
  const inventory = fixture();
  const b = inventory.contributions.find(({ id }) => id === "b-source")!;
  const a = inventory.contributions.find(({ id }) => id === "a-text")!;
  let derived = createContribution({ id: "combined", recipeId: "shared", kind: "text", value: "Combined extraction", contributorId: null }, [a, b]);
  for (let index = 0; index < 100; index++) {
    derived = createContribution({ id: `edit-${index}`, recipeId: "shared", kind: "text", value: "Rewritten text", contributorId: "C" }, [derived]);
  }
  expect(derived.contributorIds).toEqual(["A", "B", "C"]);
  expect(b.contributorIds).toEqual(["B"]);
});

it("rejects AI output without sources and edits whose parent lost provenance", () => {
  const input = { id: "unknown", recipeId: "shared", kind: "text" as const, value: "Untraceable", contributorId: null };
  expect(() => createContribution(input)).toThrow("Contribution provenance is required");
  expect(() => createContribution({ ...input, contributorId: "C" }, [{ ...input, contributorIds: [] }]))
    .toThrow("Contribution provenance is required");
});

it("does not mistake relabeled authorship for removal of embedded text or history", async () => {
  const inventory = fixture();
  await seed({ ...inventory, revisions: inventory.revisions.map((revision) => ({ ...revision, editorId: "C" })) });
  const relabeled = await readFixture(env.DB);
  expect(JSON.stringify(relabeled)).toContain("B_PRIVATE");
  const plan = planContributorPurge(relabeled, "B");
  expect(plan.rows.revisions).toEqual(["history-b", "history-c"]);
  await applyFixturePurge(env.DB, plan);
  expect(JSON.stringify(await readFixture(env.DB))).not.toContain("B_PRIVATE");
  expect(JSON.stringify(await readObjects(env.DB))).not.toContain("B_PRIVATE");
});

it("lists creator-owned recipes, removes empty ones and keeps another person's independent work", async () => {
  const inventory = fixture();
  const owned = createContribution({ id: "b-owned-text", recipeId: "b-owned", kind: "text", value: "B_PRIVATE original", contributorId: "B" });
  const sharedB = createContribution({ id: "b-created-text", recipeId: "b-created", kind: "text", value: "B_PRIVATE title", contributorId: "B" });
  const sharedC = createContribution({ id: "c-created-text", recipeId: "b-created", kind: "text", value: "C independent contribution", contributorId: "C" });
  await seed({
    ...inventory,
    recipes: [...inventory.recipes,
      { id: "b-owned", creatorId: "B", status: "approved", currentContributionIds: [owned.id] },
      { id: "b-created", creatorId: "B", status: "approved", currentContributionIds: [sharedB.id, sharedC.id] },
    ],
    contributions: [...inventory.contributions, owned, sharedB, sharedC],
  });
  const plan = planContributorPurge(await readFixture(env.DB), "B");
  expect(plan.createdRecipeIds).toEqual(["b-created", "b-owned"]);
  expect(plan.rows.recipes).toEqual(["b-owned"]);
  await applyFixturePurge(env.DB, plan);
  const after = await readFixture(env.DB);
  expect(after.recipes.find(({ id }) => id === "b-created")).toEqual({
    id: "b-created", creatorId: null, status: "review-required", currentContributionIds: ["c-created-text"],
  });
  expect(after.contributions.find(({ id }) => id === "c-created-text")).toEqual(sharedC);
  expect(after.recipes.some(({ id }) => id === "b-owned")).toBe(false);
  expect(JSON.stringify(after)).not.toContain("B_PRIVATE");
});

it("removes tainted history without changing an independently complete approved recipe", async () => {
  const inventory = fixture();
  await seed({ ...inventory, recipes: inventory.recipes.map((recipe) => recipe.id === "shared"
    ? { ...recipe, currentContributionIds: ["a-text", "c-independent"] } : recipe) });
  const before = await readFixture(env.DB);
  const plan = planContributorPurge(before, "B");
  expect(plan.recipeUpdates).toEqual([]);
  await applyFixturePurge(env.DB, plan);
  const after = await readFixture(env.DB);
  expect(after.recipes).toEqual(before.recipes);
  expect(assistantRecipeContent(after, "shared")?.map(({ id }) => id)).toEqual(["a-text", "c-independent"]);
  expect(after.revisions.map(({ id }) => id)).toEqual(["history-a"]);
});

it("removes an editor's history metadata even when its referenced content is independent", async () => {
  const inventory = fixture();
  await seed({ ...inventory, revisions: [...inventory.revisions,
    { id: "b-review-only", recipeId: "safe", editorId: "B", contributionIds: ["safe-text"] },
  ] });
  const plan = planContributorPurge(await readFixture(env.DB), "B");
  expect(plan.rows.revisions).toContain("b-review-only");
  await applyFixturePurge(env.DB, plan);
  expect(assistantRecipeContent(await readFixture(env.DB), "safe")?.map(({ id }) => id)).toEqual(["safe-text"]);
});

it("preserves independent historical work even when no current text survives", async () => {
  const inventory = fixture();
  await seed({ ...inventory, recipes: inventory.recipes.map((recipe) => recipe.id === "shared"
    ? { ...recipe, currentContributionIds: ["c-derived", "ai-derived"] } : recipe) });
  const plan = planContributorPurge(await readFixture(env.DB), "B");
  expect(plan.rows.recipes).toEqual([]);
  await applyFixturePurge(env.DB, plan);
  const after = await readFixture(env.DB);
  expect(after.recipes.find(({ id }) => id === "shared")).toEqual({
    id: "shared", creatorId: "A", status: "review-required", currentContributionIds: [],
  });
  expect(after.revisions.map(({ id }) => id)).toEqual(["history-a"]);
  expect(after.contributions.find(({ id }) => id === "a-step")?.value).toBe("A superseded step");
  expect(assistantRecipeContent(after, "shared")).toBeNull();
});

it("produces a harmless empty plan after deletion and for an unrelated account", async () => {
  await seed();
  const before = await readFixture(env.DB);
  const original = structuredClone(before);
  expect(planContributorPurge(before, "unrelated")).toEqual({
    accountId: "unrelated", createdRecipeIds: [],
    rows: { recipes: [], contributions: [], revisions: [], assets: [], exports: [] },
    objects: [], recipeUpdates: [],
  });
  const plan = planContributorPurge(before, "B");
  await applyFixturePurge(env.DB, plan);
  const once = await readFixture(env.DB);
  await applyFixturePurge(env.DB, planContributorPurge(once, "B"));
  expect(await readFixture(env.DB)).toEqual(once);
  expect(planContributorPurge(once, "B").rows.contributions).toEqual([]);
  expect(before).toEqual(original);
});

it.each(["current", "history", "asset", "export"])("refuses an incomplete inventory with an unknown %s reference", (kind) => {
  const inventory = fixture();
  const broken = {
    ...inventory,
    recipes: kind === "current" ? [{ ...inventory.recipes[0]!, currentContributionIds: ["unknown"] }, inventory.recipes[1]!] : inventory.recipes,
    revisions: kind === "history" ? [{ ...inventory.revisions[0]!, contributionIds: ["unknown"] }] : inventory.revisions,
    assets: kind === "asset" ? [{ ...inventory.assets[0]!, contributionId: "unknown" }] : inventory.assets,
    exports: kind === "export" ? [{ ...inventory.exports[0]!, contributionIds: ["unknown"] }] : inventory.exports,
  };
  expect(() => planContributorPurge(broken, "B")).toThrow("Incomplete contribution inventory");
});

it("preserves the approved recipe's fragment order in assistant context", () => {
  const inventory = fixture();
  const ordered = { ...inventory, recipes: [{
    ...inventory.recipes[0]!, currentContributionIds: ["c-independent", "a-text"],
  }, inventory.recipes[1]!] };
  expect(assistantRecipeContent(ordered, "shared")?.map(({ id }) => id)).toEqual(["c-independent", "a-text"]);
});

it("does not expose drafts or incomplete manifests to assistant retrieval", () => {
  const inventory = fixture();
  expect(assistantRecipeContent({ ...inventory, recipes: [{ ...inventory.recipes[0]!, status: "draft" }] }, "shared")).toBeNull();
  expect(assistantRecipeContent({ ...inventory, recipes: [{ ...inventory.recipes[0]!, currentContributionIds: ["missing"] }] }, "shared")).toBeNull();
  expect(assistantRecipeContent({ ...inventory, recipes: [{ ...inventory.recipes[0]!, currentContributionIds: ["safe-text"] }] }, "shared")).toBeNull();
});
