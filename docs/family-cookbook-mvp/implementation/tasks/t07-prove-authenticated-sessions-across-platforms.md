# T07: Prove authenticated sessions across platforms

Status: complete (native Release builds on simulator/emulator; T03 physical-device blocker retained)
Type: engineering
Phase: Architecture proofs
Depends on: T03, O01
Assignee: Codex

## Execution result

All T07 acceptance criteria pass with [recorded evidence](../../../evidence/t07.md). Ten D1 session-boundary tests, four Chromium/WebKit checks, real Resend OTP delivery and native Release session/restart/logout/revocation trials passed. Native trials used iOS 27 Simulator and Android API 35 Emulator, not physical devices. The developer explicitly authorized proceeding while T03 remains blocked on physical devices. See the [runbook and downstream session contract](../../../runbooks/auth-session-proof.md). O01 email access is verified for the restricted test sender/recipient; other O01 gaps and both readiness gates remain open.

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

- [x] Email code sign-in completes on web/iOS/Android; expired/reused codes, wrong codes and rate limits are handled without logging the code.
- [x] Web cookies and native secure session storage survive the intended restart; logout/deletion revokes protected requests, including a previously cached native session.
- [x] Untrusted origins/redirects and account enumeration behavior are tested; test email cannot be sent to arbitrary recipients.

## Verification

- [x] Run the focused session-boundary integration test.
- [x] Use synthetic accounts on web plus real iOS/Android builds; verify code expiry, logout and server revocation.

## Execution checklist

- [x] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [x] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [x] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [x] Run the focused checks above and the affected build/type checks established by the harness.
- [x] Record evidence, limitations and pass/fail in `docs/evidence/t07.md` or link the named report already produced by this task.
- [x] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
