# T34: Request account deletion with a precise preview

Status: not started
Type: engineering
Phase: Continuity
Depends on: T02, T10, T11, T29
Assignee: unassigned

## Outcome

Deliver reauthentication, affected-content/billing preview and non-blocking confirmation on web/native.

## Dependencies

[T02: Prove contribution-aware recipe deletion](t02-prove-contribution-aware-recipe-deletion.md), [T10: Create and join a private household](t10-create-and-join-a-private-household.md), [T11: Transfer cookbook administration](t11-transfer-cookbook-administration.md), [T29: Reconcile provider entitlements](t29-reconcile-provider-entitlements.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/deletion/request.ts`
- `apps/app/app/delete-account.tsx`
- `apps/api/tests/deletion/request.test.ts`
- `tests/web/delete-account.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Preview identifies account-associated recipes/sources and private data, distinguishes leaving from deletion, and offers optional export/handover.
- [ ] Confirmation immediately revokes sessions and ordinary affected reads; active subscription or absent successor cannot block the request.
- [ ] Other members' independent content remains scoped correctly. Queue supported Stripe/Google period-end cancellation, expose Apple management controls and report failures without blocking deletion; deleting a provider profile is never treated as proof of cancellation.

## Verification

- [ ] Run deletion request integration and web tests.
- [ ] Check the in-app path on both platforms, including administrator/payer and ordinary member cases.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t34.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
