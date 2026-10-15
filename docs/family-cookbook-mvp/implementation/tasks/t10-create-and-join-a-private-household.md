# T10: Create and join a private household

Status: not started
Type: engineering
Phase: Core identity
Depends on: T07, T02, T04, T06, T08, T09
Assignee: unassigned

## Outcome

Deliver authenticated household creation and email-bound invitation acceptance with the accepted five-person boundary.

## Dependencies

[T07: Prove authenticated sessions across platforms](t07-prove-authenticated-sessions-across-platforms.md), [T02: Prove contribution-aware recipe deletion](t02-prove-contribution-aware-recipe-deletion.md), [T04: Prove web pending-check persistence](t04-prove-web-pending-check-persistence.md), [T06: Prove restore without deleted-data resurrection](t06-prove-restore-without-deleted-data-resurrection.md), [T08: Prove purchase identity cannot cross households](t08-prove-purchase-identity-cannot-cross-households.md), [T09: Verify capture models on representative fixtures](t09-verify-capture-models-on-representative-fixtures.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/households/membership.ts`
- `apps/app/app/household-start.tsx`
- `apps/api/tests/households/membership.test.ts`
- `tests/web/household.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Creation makes one book; its creator initially holds both administrator and payer roles, which remain separate responsibilities. A user cannot acquire two active household memberships.
- [ ] Single-use, expiring email-bound invitations cannot exceed five people even with simultaneous acceptances.
- [ ] Removal or voluntary leave immediately blocks recipe/object/job/sync access without deleting the account or contributions or canceling billing. Leaving administrators use the continuity rules. Existing downloaded exports cannot be remotely recalled and the UI explains that limit.

## Verification

- [ ] Run membership integration tests and tests/web/household.spec.ts.
- [ ] Exercise competing invitation acceptances, voluntary leave and a removed user's already-open session.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t10.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
