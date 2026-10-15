# T10: Create and join a private household

Status: complete under the authorized sequencing exception
Type: engineering
Phase: Core identity
Depends on: T07, T02, T04, T06, T08 (T09 sequencing dependency deferred by the developer-authorized exception)
Assignee: Codex

## Authorized sequencing exception

On 2026-10-15 the developer explicitly authorized this task before T03/T09 completion; see the exception in [the plan](../plan.md). T03 physical-device testing and T09 quality/corpus blockers remain open, as do C1/C3 and both readiness gates. No other task dependency is waived.

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

- [x] Creation makes one book; its creator initially holds both administrator and payer roles, which remain separate responsibilities. A user cannot acquire two active household memberships.
- [x] Single-use, expiring email-bound invitations cannot exceed five people even with simultaneous acceptances.
- [x] Removal or voluntary leave immediately blocks recipe/object/job/sync access without deleting the account or contributions or canceling billing. Leaving administrators use the continuity rules. Existing downloaded exports cannot be remotely recalled and the UI explains that limit.

## Verification

- [x] Run membership integration tests and tests/web/household.spec.ts.
- [x] Exercise competing invitation acceptances, voluntary leave and a removed user's already-open session.

## Execution checklist

- [x] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [x] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [x] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [x] Run the focused checks above and the affected build/type checks established by the harness.
- [x] Record evidence, limitations and pass/fail in `docs/evidence/t10.md` or link the named report already produced by this task.
- [x] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.

## T07 session handoff

Reuse the proven Better Auth/D1 session resolver and add server-side household membership checks. Native cached session data is presentation only. See the [proven session contract](../../../runbooks/auth-session-proof.md) and [T07 evidence](../../../evidence/t07.md). T03 physical-device acceptance remains blocked.

## Execution evidence

The [T10 report](../../../evidence/t10.md) records 11 new D1/authenticated integration tests, 109 passing API regressions, six household browser checks, four authentication browser regressions, 13 storage checks, type checks and platform exports. All acceptance criteria pass at this slice's boundary. Recipe/object endpoint owners must use the tested private-read guard; those product endpoints remain future tasks. Administrator handover remains T11; until then an administrator cannot leave other members without handing over. Invitation links expire after seven days and are shared explicitly by the sender.

No production deployment or new real email delivery was needed. T03/T09 remain open with their existing blockers; both gates remain closed.
