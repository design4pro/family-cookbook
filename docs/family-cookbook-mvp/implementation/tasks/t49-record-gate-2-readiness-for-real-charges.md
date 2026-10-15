# T49: Record Gate 2 readiness for real charges

Status: not started
Type: milestone
Phase: Milestones
Depends on: T47, T48, O02, T39
Assignee: unassigned

## Outcome

Validate the accepted prerequisites before enabling the real web purchase phase.

## Dependencies

[T47: Record Gate 1 readiness evidence](t47-record-gate-1-readiness-evidence.md), [T48: Run the cross-channel billing acceptance matrix](t48-run-the-cross-channel-billing-acceptance-matrix.md), [O02: Prepare operator retention and commercial records](o02-prepare-operator-retention-and-commercial-records.md), [T39: Instrument failures without logging family content](t39-instrument-failures-without-logging-family-content.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `docs/releases/gate-2.md`

Estimated scope: S (operator/evidence artifact). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Gate 1 still holds on the release build and the full billing matrix passes; sandbox/live identities and credentials are isolated.
- [ ] Operating-entity retention records, localized offers, renewal disclosures, taxes, support and sender configuration are complete and consistent with the implementation.
- [ ] A responsible operator records go/no-go before live checkout is enabled; native test builds do not advertise an external-checkout shortcut.

## Verification

- [ ] Audit specification section 10, billing reports and operator evidence.
- [ ] Confirm live checkout is disabled on no-go and that enabling it is a separate controlled release action.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t49.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
