# T28: Enforce sample and paid usage windows

Status: not started
Type: engineering
Phase: Billing
Depends on: T05, T10, T12
Assignee: unassigned

## Outcome

Promote the proven reservation core into the accepted household quotas and calendar windows. Expose one server-owned policy contract for later capture/assistant routes and attach recipe-count enforcement to approval; do not duplicate limit constants in clients.

## T05 integration boundary

Reuse the atomic reservation, fenced settlement and reconciliation contract in [T05 evidence](../../../evidence/t05.md). Preserve logical operation IDs on technical/user retry, generation fences, current authorization checks and commit-before-ack ordering. Supply actual server-owned allowance policy and measured processing deadlines; do not copy the synthetic proof controls into production.

## Dependencies

[T05: Prove queued-job allowance settlement](t05-prove-queued-job-allowance-settlement.md), [T10: Create and join a private household](t10-create-and-join-a-private-household.md), [T12: Persist reviewable recipe revisions](t12-persist-reviewable-recipe-revisions.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/usage/policy.ts`
- `packages/domain/src/usage-window.ts`
- `apps/api/tests/usage/limits.test.ts`
- `packages/domain/tests/usage-window.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Sample: 5 people/10 recipes/100 MB/5 pages/10 minutes/20 answers without countdown; Family: 5/500/1 GB/200 first paid usage month then 50 pages, 60 minutes and 200 answers monthly.
- [ ] Month-end/leap-year boundaries use the original activation anchor; reinstall/reactivation/payer changes cannot reset sample or welcome allowance; no rollover.
- [ ] Concurrent operations cannot exceed reserved limits; failures release once, technical copies do not double user storage, and only the exhausted action is blocked.

## Verification

- [ ] Run usage tests with Jan 31, leap-day activation, duplicate jobs and concurrent last-unit reservations.
- [ ] Verify the allowance/reset-date response against server decisions; client rendering is checked when T30/T31 connect plan screens.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t28.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
