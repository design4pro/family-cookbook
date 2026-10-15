# T32: Apply Archive without losing shopping checks

Status: not started
Type: engineering
Phase: Billing
Depends on: T24, T28, T29, T20, T26
Assignee: unassigned

## Outcome

Apply the accepted feature matrix consistently across API, UI and offline synchronization.

## Dependencies

[T24: Connect durable offline checks to the shared list](t24-connect-durable-offline-checks-to-the-shared-list.md), [T28: Enforce sample and paid usage windows](t28-enforce-sample-and-paid-usage-windows.md), [T29: Reconcile provider entitlements](t29-reconcile-provider-entitlements.md), [T20: Cook from an approved recipe](t20-cook-from-an-approved-recipe.md), [T26: Use the text cookbook assistant](t26-use-the-text-cookbook-assistant.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/billing/access-policy.ts`
- `apps/app/src/billing/access-state.tsx`
- `apps/api/tests/billing/archive.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Verified expiry keeps all existing recipes/sources/members, reading/cooking/search/download/export and check/uncheck of current shopping items.
- [ ] New creation, edits, uploads, AI and new shopping additions require renewal; deletion/export never require payment.
- [ ] Pending pre-expiry checks can sync after expiry, while membership/deletion conflicts still apply; renewing does not reset consumed usage.

## Verification

- [ ] Run Archive integration tests across representative endpoints.
- [ ] Expire a synthetic household while a device holds pending checks, then reconnect and renew.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t32.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
