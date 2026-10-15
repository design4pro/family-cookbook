# T22: Build deterministic shopping contributions

Status: not started
Type: engineering
Phase: Shopping
Depends on: T12, T20, T01
Assignee: unassigned

## Outcome

Create confirmed recipe snapshots, compatible aggregation and removable recipe contributions.

## Dependencies

[T12: Persist reviewable recipe revisions](t12-persist-reviewable-recipe-revisions.md), [T20: Cook from an approved recipe](t20-cook-from-an-approved-recipe.md), [T01: Prove atomic shopping mutations in D1](t01-prove-atomic-shopping-mutations-in-d1.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `packages/domain/src/shopping.ts`
- `apps/api/src/shopping/add-recipes.ts`
- `packages/domain/tests/shopping.test.ts`
- `apps/api/tests/shopping/contributions.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Merge only equivalent ingredients and compatible units; flour/almond flour, grams/milliliters and unknown amounts remain distinct.
- [ ] Replaying one confirmation does not duplicate items; deliberate new cooking occasions are separate additions.
- [ ] Later recipe edits do not change the list; removing one recipe contribution preserves others/manual items, and new servings require explicit re-addition.

## Verification

- [ ] Run shopping unit tests and contribution integration tests with multiple recipes sharing ingredients.
- [ ] Inspect the provenance of aggregated items after contribution removal.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t22.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
