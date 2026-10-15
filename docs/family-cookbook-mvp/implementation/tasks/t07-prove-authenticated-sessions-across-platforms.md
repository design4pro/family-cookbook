# T07: Prove authenticated sessions across platforms

Status: not started
Type: engineering
Phase: Architecture proofs
Depends on: T03, O01
Assignee: unassigned

## Outcome

Validate the selected Better Auth/D1/email-OTP integration on web and native before household UI expands.

## Dependencies

[T03: Prove native pending-check persistence](t03-prove-native-pending-check-persistence.md), [O01: Prepare isolated verification access](o01-prepare-isolated-verification-access.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/auth/auth.ts`
- `apps/app/src/auth/client.ts`
- `apps/app/app/sign-in.tsx`
- `tests/auth/session-boundaries.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Email code sign-in completes on web/iOS/Android; expired/reused codes, wrong codes and rate limits are handled without logging the code.
- [ ] Web cookies and native secure session storage survive the intended restart; logout/deletion revokes protected requests, including a previously cached native session.
- [ ] Untrusted origins/redirects and account enumeration behavior are tested; test email cannot be sent to arbitrary recipients.

## Verification

- [ ] Run the focused session-boundary integration test.
- [ ] Use synthetic accounts on web plus real iOS/Android builds; verify code expiry, logout and server revocation.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t07.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
