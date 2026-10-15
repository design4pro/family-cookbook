# T13: Review and save a recipe in the app

Status: not started
Type: engineering
Phase: Recipes
Depends on: T12, T03, T04
Assignee: unassigned

## Outcome

Deliver the common editable review screen first using manually entered source text.

## Dependencies

[T12: Persist reviewable recipe revisions](t12-persist-reviewable-recipe-revisions.md), [T03: Prove native pending-check persistence](t03-prove-native-pending-check-persistence.md), [T04: Prove web pending-check persistence](t04-prove-web-pending-check-persistence.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/app/recipe-review.tsx`
- `apps/app/src/recipes/review-form.tsx`
- `tests/web/recipe-review.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Users edit title, attribution, note, servings, ingredients and steps, then explicitly save; uncertainty markers never claim all other fields are correct.
- [ ] Desktop supports source/fields side by side, mobile a source/form switch; keyboard focus and screen-reader labels work.
- [ ] A stale save keeps local unsaved input and presents reload/reconciliation instead of silent loss; failed saving never shows success.

## Verification

- [ ] Run tests/web/recipe-review.spec.ts for valid, uncertain and stale drafts.
- [ ] Check narrow/wide layouts, large text and keyboard traversal.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t13.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
