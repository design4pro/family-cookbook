# T42: Run complete web and isolation journeys

Status: not started
Type: engineering
Phase: Readiness
Depends on: T10, T11, T17, T19, T24, T27, T32, T34, T37
Assignee: unassigned

## Outcome

Cover complete user paths and cross-household denial on the integrated system.

## Dependencies

[T10: Create and join a private household](t10-create-and-join-a-private-household.md), [T11: Transfer cookbook administration](t11-transfer-cookbook-administration.md), [T17: Capture and order recipe images](t17-capture-and-order-recipe-images.md), [T19: Transcribe recordings into reviewable drafts](t19-transcribe-recordings-into-reviewable-drafts.md), [T24: Connect durable offline checks to the shared list](t24-connect-durable-offline-checks-to-the-shared-list.md), [T27: Suggest meals then confirm shopping](t27-suggest-meals-then-confirm-shopping.md), [T32: Apply Archive without losing shopping checks](t32-apply-archive-without-losing-shopping-checks.md), [T34: Request account deletion with a precise preview](t34-request-account-deletion-with-a-precise-preview.md), [T37: Export a self-contained family archive](t37-export-a-self-contained-family-archive.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `tests/web/core-journeys.spec.ts`
- `tests/security/household-isolation.test.ts`
- `docs/evidence/web-journeys.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Sign-in/create/invite/capture/review/save/ask/shop/cook/export complete without data-loss or core-flow blockers.
- [ ] Two unrelated households cannot access each other's recipes, objects, jobs, export links, assistant references, sessions or pending operations.
- [ ] Revoked sessions/invitations and concurrent membership limits remain enforced with open browser tabs and stale clients.

## Verification

- [ ] Run Playwright core journeys and backend household-isolation tests.
- [ ] Record environment/build identity and failing scenarios; do not mark complete on a partial run.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t42.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
