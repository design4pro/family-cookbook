# T21: Download recipes for native offline reading

Status: not started
Type: engineering
Phase: Cooking
Depends on: T15, T20, T03
Assignee: unassigned

## Outcome

Persist explicitly downloaded recipe versions and selected assets with visible offline availability.

## Dependencies

[T15: Upload private sources with recoverable copies](t15-upload-private-sources-with-recoverable-copies.md), [T20: Cook from an approved recipe](t20-cook-from-an-approved-recipe.md), [T03: Prove native pending-check persistence](t03-prove-native-pending-check-persistence.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/src/recipes/download.native.ts`
- `apps/app/src/recipes/cache.native.ts`
- `apps/app/tests/recipes/download.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] A downloaded recipe reopens after force-close in airplane mode; missing assets are labeled rather than implied available.
- [ ] Version/cache state is scoped to account/household and controlled caches are cleared on logout; revoked server access cannot refresh content.
- [ ] An interrupted download is distinguishable from a complete one, and the UI does not call a cached subset a full export.

## Verification

- [ ] Run cache manifest/version tests.
- [ ] Verify cold-start offline with full/partial downloads on iOS and Android.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t21.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
