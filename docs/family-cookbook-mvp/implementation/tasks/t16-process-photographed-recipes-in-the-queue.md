# T16: Process photographed recipes in the queue

Status: not started
Type: engineering
Phase: Capture
Depends on: T05, T09, T12, T15
Assignee: unassigned

## Outcome

Connect image extraction to the proven job state machine and common draft store.

## T05 integration boundary

Reuse the atomic reservation, fenced settlement and reconciliation contract in [T05 evidence](../../../evidence/t05.md). Preserve logical operation IDs on technical/user retry, generation fences, current authorization checks and commit-before-ack ordering. Supply actual server-owned allowance policy and measured processing deadlines; do not copy the synthetic proof controls into production.

## Dependencies

[T05: Prove queued-job allowance settlement](t05-prove-queued-job-allowance-settlement.md), [T09: Verify capture models on representative fixtures](t09-verify-capture-models-on-representative-fixtures.md), [T12: Persist reviewable recipe revisions](t12-persist-reviewable-recipe-revisions.md), [T15: Upload private sources with recoverable copies](t15-upload-private-sources-with-recoverable-copies.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/imports/photo-job.ts`
- `apps/api/src/ai/extract-image.ts`
- `apps/app/src/imports/job-status.tsx`
- `apps/api/tests/imports/photo-job.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Ordered pages create one draft and one allowance settlement; schema validation failures retain the source and permit manual entry.
- [ ] After upload the job completes without the capture screen remaining open; visible job states distinguish upload, processing and review readiness.
- [ ] Repeated delivery, cancellation/deletion and a late model response cannot duplicate recipes or resurrect inaccessible content.

## Verification

- [ ] Run photo-job integration tests with model fixtures and queue fault injection.
- [ ] Use a real authorized test image to confirm remote model, source and job integration.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t16.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
