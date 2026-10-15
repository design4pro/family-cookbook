# T30: Purchase and manage the plan on web

Status: not started
Type: engineering
Phase: Billing
Depends on: T29, T07
Assignee: unassigned

## Outcome

Deliver explicit authenticated Stripe checkout and management for the designated payer.

## Dependencies

[T29: Reconcile provider entitlements](t29-reconcile-provider-entitlements.md), [T07: Prove authenticated sessions across platforms](t07-prove-authenticated-sessions-across-platforms.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/billing/web-checkout.ts`
- `apps/app/app/plan.tsx`
- `apps/api/tests/billing/web-checkout.test.ts`
- `tests/web/purchase.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Display actual monthly/annual offer and renewal period; only the payer can start checkout, and current active household coverage prevents duplicate checkout.
- [ ] Returning from checkout waits for verified entitlement; failed/canceled checkout preserves existing access.
- [ ] Manage/restore status uses the original channel; all members see current allowances and server-provided reset dates, and non-payers see contact-payer information without access to payment details.

## Verification

- [ ] Run purchase Playwright tests against sandbox fixtures.
- [ ] Complete Stripe sandbox checkout, cancellation and portal return on a synthetic household.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t30.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
