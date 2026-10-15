import { contributionAccounts, type ContributionInventory, type Recipe } from "../recipes/contributions";

export interface ContributorPurgePlan {
  readonly accountId: string;
  readonly createdRecipeIds: readonly string[];
  readonly rows: {
    readonly recipes: readonly string[];
    readonly contributions: readonly string[];
    readonly revisions: readonly string[];
    readonly assets: readonly string[];
    readonly exports: readonly string[];
  };
  readonly objects: readonly { store: "source" | "recovery" | "processor" | "export"; key: string }[];
  readonly recipeUpdates: readonly Recipe[];
}

function requireCompleteInventory(inventory: ContributionInventory) {
  const recipes = new Set(inventory.recipes.map(({ id }) => id));
  const contributions = new Map(inventory.contributions.map((row) => [row.id, row]));
  function requireReferences(ids: readonly string[], recipeId?: string) {
    if ((recipeId !== undefined && !recipes.has(recipeId)) || ids.some((id) => {
      const contribution = contributions.get(id);
      return !contribution || (recipeId !== undefined && contribution.recipeId !== recipeId);
    })) throw new Error("Incomplete contribution inventory");
  }
  for (const contribution of inventory.contributions) {
    if (!recipes.has(contribution.recipeId)) throw new Error("Incomplete contribution inventory");
  }
  for (const recipe of inventory.recipes) requireReferences(recipe.currentContributionIds, recipe.id);
  for (const revision of inventory.revisions) requireReferences(revision.contributionIds, revision.recipeId);
  for (const asset of inventory.assets) requireReferences([asset.contributionId]);
  for (const archive of inventory.exports) requireReferences(archive.contributionIds);
}

export function planContributorPurge(inventory: ContributionInventory, accountId: string): ContributorPurgePlan {
  requireCompleteInventory(inventory);
  const contributions = new Set(inventory.contributions
    .filter((contribution) => contributionAccounts(contribution).includes(accountId)).map(({ id }) => id));
  const remainingRecipeIds = new Set(inventory.contributions
    .filter(({ id }) => !contributions.has(id)).map(({ recipeId }) => recipeId));
  const affectedRecipeIds = new Set(inventory.contributions
    .filter(({ id }) => contributions.has(id)).map(({ recipeId }) => recipeId));
  const createdRecipeIds = inventory.recipes.filter(({ creatorId }) => creatorId === accountId).map(({ id }) => id);
  const deletedRecipes = new Set(inventory.recipes.filter(({ id, creatorId }) =>
    !remainingRecipeIds.has(id) && (affectedRecipeIds.has(id) || creatorId === accountId),
  ).map(({ id }) => id));
  const assets = inventory.assets.filter(({ contributionId }) => contributions.has(contributionId));
  const exports = inventory.exports.filter(({ contributionIds }) => contributionIds.some((id) => contributions.has(id)));
  const recipeUpdates: Recipe[] = [];
  for (const recipe of inventory.recipes) {
    if (deletedRecipes.has(recipe.id)) continue;
    const currentContributionIds = recipe.currentContributionIds.filter((id) => !contributions.has(id));
    const lostCurrentContent = currentContributionIds.length !== recipe.currentContributionIds.length;
    if (lostCurrentContent || recipe.creatorId === accountId) {
      recipeUpdates.push({
        ...recipe,
        creatorId: recipe.creatorId === accountId ? null : recipe.creatorId,
        // Do not restore an earlier version or guess that surviving instructions
        // are complete. Human approval is required after losing current content.
        status: lostCurrentContent ? "review-required" : recipe.status,
        currentContributionIds,
      });
    }
  }
  return {
    accountId,
    createdRecipeIds: createdRecipeIds.sort(),
    rows: {
      recipes: [...deletedRecipes].sort(),
      contributions: [...contributions].sort(),
      revisions: inventory.revisions.filter(({ recipeId, editorId, contributionIds }) =>
        deletedRecipes.has(recipeId) || editorId === accountId || contributionIds.some((id) => contributions.has(id)),
      ).map(({ id }) => id).sort(),
      assets: assets.map(({ id }) => id).sort(),
      exports: exports.map(({ id }) => id).sort(),
    },
    objects: [
      ...assets.map(({ store, key }) => ({ store, key })),
      ...exports.map(({ key }) => ({ store: "export" as const, key })),
    ],
    recipeUpdates,
  };
}
