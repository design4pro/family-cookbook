# T47: Record Gate 1 readiness evidence

Status: not started
Type: milestone
Phase: Milestones
Depends on: T38, T39, T40, T41, T42, T43, T44, T45, T46, O01
Assignee: unassigned

## Outcome

Collect the accepted real-data admission evidence and make an explicit release decision.

## Dependencies

[T38: Rehearse production-shaped deletion and recovery](t38-rehearse-production-shaped-deletion-and-recovery.md), [T39: Instrument failures without logging family content](t39-instrument-failures-without-logging-family-content.md), [T40: Verify accessible web journeys](t40-verify-accessible-web-journeys.md), [T41: Verify accessible native journeys](t41-verify-accessible-native-journeys.md), [T42: Run complete web and isolation journeys](t42-run-complete-web-and-isolation-journeys.md), [T43: Run complete native interruption journeys](t43-run-complete-native-interruption-journeys.md), [T44: Evaluate fifty capture examples with human correction](t44-evaluate-fifty-capture-examples-with-human-correction.md), [T45: Evaluate thirty assistant questions](t45-evaluate-thirty-assistant-questions.md), [T46: Measure response and import latency](t46-measure-response-and-import-latency.md), [O01: Prepare isolated verification access](o01-prepare-isolated-verification-access.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `docs/releases/gate-1.md`

Estimated scope: S (operator/evidence artifact). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Every Gate 1 requirement in the specification links to a passing report with build/environment identity; there is no open data-loss, isolation or core-flow blocker.
- [ ] Deletion/retention notice matches tested behavior, support/alerts/recovery work, and real data cannot flow into sandbox QA environments.
- [ ] A responsible reviewer records go/no-go; a partial checklist is a no-go. This milestone does not enable charges or claim public-store readiness.

## Verification

- [ ] Audit the evidence links against specification section 9 and the coverage matrix.
- [ ] Record the release reviewer and decision; only a go permits inviting the ten pilot households.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t47.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
