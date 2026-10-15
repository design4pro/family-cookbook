# T11: Transfer cookbook administration

Status: not started
Type: engineering
Phase: Core identity
Depends on: T10
Assignee: unassigned

## Outcome

Deliver recipient-accepted handover and the no-administrator claim path without touching payer identity.

## Dependencies

[T10: Create and join a private household](t10-create-and-join-a-private-household.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/households/handover.ts`
- `apps/app/app/household-members.tsx`
- `apps/api/tests/households/handover.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] A reauthenticated administrator nominates one current member; acceptance within seven days atomically switches the role and leaves the previous administrator as a member.
- [ ] Canceled/expired requests and removed recipients cannot complete; role transfer does not move content authorship, subscriptions or allowance history.
- [ ] After administrator deletion, only a verified pre-existing member can claim; simultaneous claims produce one administrator and notifications go to remaining members.

## Verification

- [ ] Run the handover integration tests with expiry, revocation and concurrent claims.
- [ ] Review the member screen as administrator, member and payer-only account.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t11.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
