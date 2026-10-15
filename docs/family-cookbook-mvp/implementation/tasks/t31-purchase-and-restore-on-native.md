# T31: Purchase and restore on native

Status: not started
Type: engineering
Phase: Billing
Depends on: T29, T07
Assignee: unassigned

## Outcome

Implement RevenueCat-backed Apple/Google purchase and restore in development/test builds.

## Dependencies

[T29: Reconcile provider entitlements](t29-reconcile-provider-entitlements.md), [T07: Prove authenticated sessions across platforms](t07-prove-authenticated-sessions-across-platforms.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/src/billing/purchases.native.ts`
- `apps/app/src/billing/plan.native.tsx`
- `apps/app/tests/billing/native-identity.test.ts`
- `tests/native/purchases.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Sign-in precedes purchase; restore respects the original personal payer and cannot attach a receipt to a different family.
- [ ] Show provider-local prices, current server allowances/reset dates, cancellation/restore/error states and subscription management; no external checkout promotion bypasses store requirements.
- [ ] Real iOS and Android sandbox exercises verify purchase/restore; Google license testers are explicit and Expo Go is not used as proof.

## Verification

- [ ] Run native identity/state tests.
- [ ] Execute the native purchase checklist with recorded build IDs and synthetic accounts.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t31.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
