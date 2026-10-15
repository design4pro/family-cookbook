# T48: Run the cross-channel billing acceptance matrix

Status: not started
Type: engineering
Phase: Readiness
Depends on: T30, T31, T32, T33, T34, T35
Assignee: unassigned

## Outcome

Exercise real provider sandbox transitions and identity recovery across all accepted purchase channels.

## Dependencies

[T30: Purchase and manage the plan on web](t30-purchase-and-manage-the-plan-on-web.md), [T31: Purchase and restore on native](t31-purchase-and-restore-on-native.md), [T32: Apply Archive without losing shopping checks](t32-apply-archive-without-losing-shopping-checks.md), [T33: Replace the household payer after expiry](t33-replace-the-household-payer-after-expiry.md), [T34: Request account deletion with a precise preview](t34-request-account-deletion-with-a-precise-preview.md), [T35: Purge contributions and all owned copies](t35-purge-contributions-and-all-owned-copies.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `tests/billing/lifecycle-matrix.test.ts`
- `docs/evidence/billing-gate.md`
- `tests/native/billing-matrix.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Purchase/restore/cancel/expiry/grace/refund/revocation and delayed/duplicate events produce correct household state on web and both mobile platforms.
- [ ] Payer deletion and replacement preserve only permitted verified access; old receipts cannot move to a new family or grant sandbox access in live data.
- [ ] Limits, one-time welcome allowance, Archive/offline check behavior and late-renewal overlap are verified with two payer identities and documented remediation.

## Verification

- [ ] Run lifecycle tests, Stripe sandbox events and actual Apple/Google sandbox checklists.
- [ ] Record sandbox provider evidence plus isolated verification of the production-configured web entitlement path and household mapping, with credentials and charging disabled. Do not count a fixture as an actual live purchase; the first real charge remains after Gate 2.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t48.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
