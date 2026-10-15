# T12: Persist reviewable recipe revisions

Status: not started
Type: engineering
Phase: Recipes
Depends on: T02, T10
Assignee: unassigned

## Outcome

Implement manual text drafts, explicit approval and provenance-backed revisions as the shared capture destination.

## Dependencies

[T02: Prove contribution-aware recipe deletion](t02-prove-contribution-aware-recipe-deletion.md), [T10: Create and join a private household](t10-create-and-join-a-private-household.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/recipes/save-draft.ts`
- `apps/api/src/recipes/approve.ts`
- `packages/domain/src/recipe.ts`
- `apps/api/tests/recipes/revisions.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Original source metadata, draft and approved revision are distinct; drafts never appear in assistant retrieval.
- [ ] Unknown quantities/times remain explicit; every member can approve, while stale revision saves cannot silently overwrite another member.
- [ ] Uploader, editor and family attribution remain separate; saved revisions satisfy the deletion proof model and duplicate Save requests are idempotent.

## Verification

- [ ] Run recipe revision integration tests, including concurrent saves and missing servings.
- [ ] Inspect stored provenance for a recipe edited by two different people.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t12.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
