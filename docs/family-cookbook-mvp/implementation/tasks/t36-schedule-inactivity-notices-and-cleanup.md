# T36: Schedule inactivity notices and cleanup

Status: not started
Type: engineering
Phase: Continuity
Depends on: T10, T29, T35
Assignee: unassigned

## Outcome

Implement the independent twelve-month inactivity policy and observable reminders.

## Dependencies

[T10: Create and join a private household](t10-create-and-join-a-private-household.md), [T29: Reconcile provider entitlements](t29-reconcile-provider-entitlements.md), [T35: Purge contributions and all owned copies](t35-purge-contributions-and-all-owned-copies.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/households/inactivity.ts`
- `apps/api/src/notifications/retention.ts`
- `apps/api/tests/households/inactivity.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Only explicit authenticated online activity extends retention; background polling and unreported offline use do not. Active paid coverage prevents inactivity deletion.
- [ ] Unpaid inactive households receive 30-day and 7-day notices before cleanup; book opening/export cancels scheduling.
- [ ] Delivery failures retry/alert rather than being called successful; never-paid samples follow the disclosed policy and payment failure alone never deletes content.

## Verification

- [ ] Run time-controlled inactivity tests across activity, renewed payment and failed email delivery.
- [ ] Verify sample notification contents and cleanup records in a test mailbox.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t36.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
