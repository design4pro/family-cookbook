# T05: Prove queued-job allowance settlement

Status: not started
Type: engineering
Phase: Architecture proofs
Depends on: T01
Assignee: unassigned

## Outcome

Exercise the D1-to-Queue failure boundary and at-least-once consumer behavior before any live model integration.

## Dependencies

[T01: Prove atomic shopping mutations in D1](t01-prove-atomic-shopping-mutations-in-d1.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/imports/job-state.ts`
- `apps/api/src/usage/reservations.ts`
- `apps/api/src/imports/reconcile-dispatch.ts`
- `apps/api/tests/imports/job-state.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Job creation reserves allowance once; failed enqueue leaves a discoverable pending dispatch that reconciliation can safely enqueue.
- [ ] Concurrent duplicate consumers settle one result/charge; terminal failure releases capacity once, and user retry cannot duplicate the existing logical operation.
- [ ] Membership revocation or deletion while work is running prevents publication of the result and source recreation.

## Verification

- [ ] Run pnpm test:api -- apps/api/tests/imports/job-state.test.ts with enqueue, worker-crash and lost-ack fault injection.
- [ ] Exercise duplicate queue delivery on the isolated remote Worker, then inspect job and usage rows.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t05.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
