# T14: Browse the household cookbook

Status: not started
Type: engineering
Phase: Recipes
Depends on: T12, T13
Assignee: unassigned

## Outcome

Deliver cards, favorites, search and a visible list of drafts awaiting review.

## Dependencies

[T12: Persist reviewable recipe revisions](t12-persist-reviewable-recipe-revisions.md), [T13: Review and save a recipe in the app](t13-review-and-save-a-recipe-in-the-app.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/recipes/search.ts`
- `apps/app/app/(tabs)/cookbook.tsx`
- `apps/app/src/recipes/recipe-card.tsx`
- `tests/web/cookbook.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Search by title, ingredient and tag returns only the caller's household; favorites and attribution display consistently.
- [ ] Empty books guide the first capture; drafts are distinguishable and never presented as approved assistant sources.
- [ ] Loading/failure/stale-cache states have clear retry behavior without replacing the collection with a false empty result.

## Verification

- [ ] Run cookbook search integration tests through tests/web/cookbook.spec.ts fixtures.
- [ ] Check a five-hundred-recipe synthetic collection for usable pagination and search.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t14.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
