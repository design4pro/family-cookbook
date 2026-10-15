# T15: Upload private sources with recoverable copies

Status: not started
Type: engineering
Phase: Capture
Depends on: T06, T10, T28
Assignee: unassigned

## Outcome

Create bounded, authorized image/audio storage with an explicit recovery-copy inventory.

## Dependencies

[T06: Prove restore without deleted-data resurrection](t06-prove-restore-without-deleted-data-resurrection.md), [T10: Create and join a private household](t10-create-and-join-a-private-household.md), [T28: Enforce sample and paid usage windows](t28-enforce-sample-and-paid-usage-windows.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/sources/upload.ts`
- `apps/api/src/sources/access.ts`
- `apps/api/tests/sources/access.test.ts`
- `apps/api/src/sources/recovery-copy.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Validate media type/size and enforce the shared storage/usage policy before accepting the source; count logical original storage once even when an internal recovery copy exists.
- [ ] Active and recovery objects are private; guessed keys, revoked membership and deleted sources cannot be read through the Worker.
- [ ] Incomplete uploads/copies remain visible as incomplete, are retryable/cleanable, and cannot be represented as fully archived sources.

## Verification

- [ ] Run source access and interrupted-copy integration tests.
- [ ] Attempt direct/guessed R2 URLs and enumerate recovery inventory after failure.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t15.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
