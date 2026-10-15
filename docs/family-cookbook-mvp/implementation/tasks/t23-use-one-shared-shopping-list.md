# T23: Use one shared shopping list

Status: not started
Type: engineering
Phase: Shopping
Depends on: T22, T10
Assignee: unassigned

## Outcome

Deliver recipe/portion review, already-available exclusions and manual list entries.

## Dependencies

[T22: Build deterministic shopping contributions](t22-build-deterministic-shopping-contributions.md), [T10: Create and join a private household](t10-create-and-join-a-private-household.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/app/(tabs)/shopping.tsx`
- `apps/app/src/shopping/review-additions.tsx`
- `apps/api/src/shopping/manual-items.ts`
- `tests/web/shopping.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] No additions occur before confirmation; items show quantity and recipe origins and support online manual quantity edits.
- [ ] Clear checked items is explicit; online changes advance revisions and deleted IDs are not reused.
- [ ] All current members see one active list with loading/failure states; refresh does not invent success for failed mutations.

## Verification

- [ ] Run tests/web/shopping.spec.ts for recipe and manual items.
- [ ] Use two accounts to verify shared list changes and visible origin information.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t23.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
