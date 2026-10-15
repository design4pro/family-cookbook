# T09: Verify capture models on representative fixtures

Status: not started
Type: engineering
Phase: Architecture proofs
Depends on: T05, O01
Assignee: unassigned

## Outcome

Use a small consented evaluation sample to detect codec, handwriting and structured-output failures before committing to capture UI. This is not the final fifty-example gate.

## Dependencies

[T05: Prove queued-job allowance settlement](t05-prove-queued-job-allowance-settlement.md), [O01: Prepare isolated verification access](o01-prepare-isolated-verification-access.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `scripts/evaluation/capture-smoke.ts`
- `tests/fixtures/capture/manifest.json`
- `docs/evidence/capture-feasibility.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Evaluate at least three legible images, three difficult images, three spoken recipes and one five-minute recording with reference facts; preserve spoken corrections and unknown values.
- [ ] Record chosen model IDs, codec/size behavior, decodable chunking, billed usage and latency; validate structured output without treating JSON validity as accuracy.
- [ ] Failures have a manual-entry/retry path; unacceptable quality is reported before feature expansion and does not silently switch to an external model.

## Verification

- [ ] Run the smoke evaluation in the isolated test environment with consented fixtures.
- [ ] Compare quantities, units, temperatures and missing instructions to human references; publish pass/fail by input class.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t09.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
