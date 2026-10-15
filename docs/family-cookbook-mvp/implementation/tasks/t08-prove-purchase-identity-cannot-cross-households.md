# T08: Prove purchase identity cannot cross households

Status: complete
Type: engineering
Phase: Architecture proofs
Depends on: T07, O01
Assignee: Codex

## Outcome

Validate one personal payer ID and household mapping with sandbox provider fixtures; do not build the whole purchase UI yet.

## Dependencies

[T07: Prove authenticated sessions across platforms](t07-prove-authenticated-sessions-across-platforms.md), [O01: Prepare isolated verification access](o01-prepare-isolated-verification-access.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/billing/identity.ts`
- `apps/api/src/billing/provider-client.ts`
- `apps/api/tests/billing/identity.test.ts`
- `docs/evidence/t08.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [x] One verified payer purchase unlocks only its mapped household; a different signed-in person or another household cannot claim it through restore.
- [x] Sandbox subscriptions/events cannot create live paid entitlements; deleting or changing a public profile does not silently reassign a Polar subscription.
- [x] Record supported restore behavior and minimal reconciliation identifiers; any unresolved provider feasibility blocks live payment tasks.

## Verification

- [x] Run `pnpm test:api tests/billing` with two payers and two households.
- [x] Check actual sandbox purchase identity and restore evidence against the configured provider behavior.

## Execution checklist

- [x] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [x] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [x] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [x] Run the focused checks above and the affected build/type checks established by the harness.
- [x] Record evidence, limitations and pass/fail in `docs/evidence/t08.md` or link the named report already produced by this task.
- [x] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.

## T07 session handoff

Bind provider customer/purchase identity to the canonical authenticated Better Auth user ID; never accept an email or native cached session as authorization. See the [proven session contract](../../../runbooks/auth-session-proof.md) and [T07 evidence](../../../evidence/t07.md). T03 physical-device acceptance remains blocked.

## Execution result

See [T08 evidence](../../../evidence/t08.md) for 27 passing focused tests, actual developer-completed sandbox checkout, MCP verification of immutable personal identity and the recorded-response D1 replay. [ADR 0001](../../../decisions/0001-polar-only-purchases.md) explicitly replaces native purchases with backend entitlement consumption. All acceptance rows pass under the revised scope; native consumption and full billing lifecycle remain T29-T31/T48 work. T03 physical-device acceptance and both gates remain blocked.
