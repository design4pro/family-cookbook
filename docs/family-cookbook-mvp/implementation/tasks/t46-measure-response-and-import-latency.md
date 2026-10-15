# T46: Measure response and import latency

Status: not started
Type: engineering
Phase: Readiness
Depends on: T16, T19, T25, T39
Assignee: unassigned

## Outcome

Measure the accepted performance thresholds on documented builds, devices and networks.

## Dependencies

[T16: Process photographed recipes in the queue](t16-process-photographed-recipes-in-the-queue.md), [T19: Transcribe recordings into reviewable drafts](t19-transcribe-recordings-into-reviewable-drafts.md), [T25: Answer only with authorized recipe context](t25-answer-only-with-authorized-recipe-context.md), [T39: Instrument failures without logging family content](t39-instrument-failures-without-logging-family-content.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `scripts/evaluation/performance-gate.ts`
- `docs/evidence/performance-gate.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] At least 30 ordinary API runs achieve p95 <1 second and at least 30 text answers achieve p95 completion <15 seconds under the recorded conditions.
- [ ] Ten representative five-minute audio jobs finish or expose an actionable error within 3 minutes; failure counts remain visible and cannot substitute for capture success.
- [ ] Record warm/cold behavior, queue delay, model time and sample counts; failed thresholds are fixed and rerun before Gate 1.

## Verification

- [ ] Run the performance script against the isolated pilot-shaped environment.
- [ ] Inspect raw timings and error counts rather than only averages.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t46.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
