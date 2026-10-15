# T33: Replace the household payer after expiry

Status: not started
Type: engineering
Phase: Billing
Depends on: T11, T29, T30, T31, T32
Assignee: unassigned

## Outcome

Deliver accepted nomination and purchase-after-expiry without moving receipts or administrative roles.

## Dependencies

[T11: Transfer cookbook administration](t11-transfer-cookbook-administration.md), [T29: Reconcile provider entitlements](t29-reconcile-provider-entitlements.md), [T30: Purchase and manage the plan on web](t30-purchase-and-manage-the-plan-on-web.md), [T31: Purchase and restore on native](t31-purchase-and-restore-on-native.md), [T32: Apply Archive without losing shopping checks](t32-apply-archive-without-losing-shopping-checks.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/billing/payer-change.ts`
- `apps/app/app/payer-change.tsx`
- `apps/api/tests/billing/payer-change.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] A willing current member accepts nomination without authorizing a future charge; old renewal status and paid-through date are visible.
- [ ] Active/grace/late-renewed old entitlement blocks new checkout; verified expiry permits an explicit new purchase, with Archive covering the gap.
- [ ] The same book and allowance history survive; receipt transfer, prorating and silent double subscriptions are not introduced.

## Verification

- [ ] Run payer-change tests including renewal races and same/different administrator.
- [ ] Exercise old payer cancellation and new payer purchase using separate sandbox identities.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t33.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
