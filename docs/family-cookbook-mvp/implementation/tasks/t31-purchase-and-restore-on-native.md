# T31: Consume and refresh paid access on native

Status: not started
Type: engineering
Phase: Billing
Depends on: T29, T07
Assignee: unassigned

## Outcome

Consume verified backend household entitlements in native development/test builds, following the [Polar-only decision](../../../decisions/0001-polar-only-purchases.md). Native purchase SDKs and checkout are out of scope.

## Dependencies

[T29: Reconcile provider entitlements](t29-reconcile-provider-entitlements.md), [T07: Prove authenticated sessions across platforms](t07-prove-authenticated-sessions-across-platforms.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/src/billing/entitlements.native.ts`
- `apps/app/src/billing/plan.native.tsx`
- `apps/app/tests/billing/native-identity.test.ts`
- `tests/native/entitlements.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Sign-in and backend verification precede paid access; account/household switching and refresh cannot expose another household or rebind a subscription.
- [ ] Show current server entitlement, allowances/reset dates, expiry and refresh/error states. Do not add native checkout, store purchase SDKs or external-checkout promotion.
- [ ] Actual iOS and Android builds verify consumption and refresh with synthetic Polar sandbox households. Record an accepted store/distribution route for the paid-web companion scope; unresolved eligibility blocks release, and Expo Go is not proof.

## Verification

- [ ] Run native identity/state tests.
- [ ] Execute the native entitlement checklist with recorded build IDs and synthetic accounts.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t31.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
