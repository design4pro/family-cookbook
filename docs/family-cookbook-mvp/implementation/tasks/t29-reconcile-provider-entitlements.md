# T29: Reconcile provider entitlements

Status: not started
Type: engineering
Phase: Billing
Depends on: T08, T28
Assignee: unassigned

## Outcome

Build verified household entitlement updates from authenticated provider events and scheduled refresh.

## Dependencies

[T08: Prove purchase identity cannot cross households](t08-prove-purchase-identity-cannot-cross-households.md), [T28: Enforce sample and paid usage windows](t28-enforce-sample-and-paid-usage-windows.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/billing/webhook.ts`
- `apps/api/src/billing/reconcile.ts`
- `apps/api/tests/billing/reconcile.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Duplicate/delayed/reordered events produce current verified state, not arrival-order state; client booleans and success redirects cannot unlock payment.
- [ ] Cancellation, expiry, grace, refund/revocation and late renewal have distinct tested transitions; sandbox cannot unlock live access.
- [ ] Purchase/restore refresh and scheduled repair recover missed notifications while preserving payer identity and quota history.

## Verification

- [ ] Run reconciliation tests with an event matrix and provider-status fixtures.
- [ ] Exercise actual sandbox events in the isolated environment and record replay/recovery results.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t29.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
