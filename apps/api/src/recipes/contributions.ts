export interface Contribution {
  readonly id: string;
  readonly recipeId: string;
  readonly kind: "text" | "source";
  readonly value: string;
  readonly contributorIds: readonly string[];
}

export interface Recipe {
  readonly id: string;
  readonly creatorId: string | null;
  readonly status: "draft" | "approved" | "review-required";
  readonly currentContributionIds: readonly string[];
}

export interface RecipeRevision {
  readonly id: string;
  readonly recipeId: string;
  readonly editorId: string;
  readonly contributionIds: readonly string[];
}

export interface AssetCopy {
  readonly id: string;
  readonly contributionId: string;
  readonly store: "source" | "recovery" | "processor";
  readonly key: string;
}

export interface ManagedExport {
  readonly id: string;
  readonly contributionIds: readonly string[];
  readonly key: string;
}

export interface ContributionInventory {
  readonly recipes: readonly Recipe[];
  readonly contributions: readonly Contribution[];
  readonly revisions: readonly RecipeRevision[];
  readonly assets: readonly AssetCopy[];
  readonly exports: readonly ManagedExport[];
}

export function contributionAccounts(contribution: Pick<Contribution, "contributorIds">): readonly string[] {
  const ids = contribution.contributorIds;
  if (ids.length === 0 || ids.some((id) => id.length === 0)) {
    throw new Error("Contribution provenance is required");
  }
  return ids;
}

// Trusted write paths supply parents: the previous fragment for an edit, all
// source/context fragments for AI. Clients must not choose or reset lineage.
export function createContribution(
  input: Omit<Contribution, "contributorIds"> & { contributorId: string | null },
  parents: readonly Contribution[] = [],
): Contribution {
  const { contributorId, ...content } = input;
  const contributorIds = [...new Set([
    ...(contributorId === null ? [] : [contributorId]),
    ...parents.flatMap(contributionAccounts),
  ])].sort();
  contributionAccounts({ contributorIds });
  return { ...content, contributorIds };
}

// This is the content-eligibility check, not household/session authorization.
export function assistantRecipeContent(inventory: ContributionInventory, recipeId: string): readonly Contribution[] | null {
  const recipe = inventory.recipes.find(({ id }) => id === recipeId);
  if (!recipe || recipe.status !== "approved") return null;
  const byId = new Map(inventory.contributions.map((row) => [row.id, row]));
  const current: Contribution[] = [];
  for (const id of recipe.currentContributionIds) {
    const contribution = byId.get(id);
    if (!contribution || contribution.recipeId !== recipeId) return null;
    if (contribution.kind === "text") current.push(contribution);
  }
  return current;
}
