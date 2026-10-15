# T08: Prove purchase identity cannot cross households

Status: not started
Type: engineering
Phase: Architecture proofs
Depends on: T07, O01
Assignee: unassigned

## Outcome

Validate one personal payer ID and household mapping with sandbox provider fixtures; do not build the whole purchase UI yet.

## Dependencies

[T07: Prove authenticated sessions across platforms](t07-prove-authenticated-sessions-across-platforms.md), [O01: Prepare isolated verification access](o01-prepare-isolated-verification-access.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/billing/identity.ts`
- `apps/api/src/billing/provider-client.ts`
- `apps/api/tests/billing/identity.test.ts`
- `docs/evidence/purchase-identity.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] One verified payer purchase unlocks only its mapped household; a different signed-in person or another household cannot claim it through restore.
- [ ] Sandbox receipts/events cannot create live paid entitlements; deleting or changing a public profile does not silently reassign a store purchase.
- [ ] Record supported restore behavior and minimal reconciliation identifiers; any unresolved provider feasibility blocks live payment tasks.

## Verification

- [ ] Run pnpm test:api -- apps/api/tests/billing/identity.test.ts with two payers and two households.
- [ ] Check actual sandbox purchase identity and restore evidence against the configured provider behavior.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t08.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
