# T01: Prove atomic shopping mutations in D1

Status: complete (2026-10-15)
Type: engineering
Phase: Architecture proofs
Depends on: O01
Assignee: Codex

## Execution result

[Local and remote evidence](../../../evidence/t01.md) records 16 local integration cases, six remote proof groups, typecheck, build dry-run, and scope limitations. The T01-relevant [O01 prerequisites](../../../evidence/o01.md) pass; O01 remains open for unrelated provider/device access. No readiness gate has passed.

## Outcome

Build the smallest executable D1 proof and its test harness. Use only synthetic households; later shopping routes reuse the proven mutation core.

## Dependencies

[O01: Prepare isolated verification access](o01-prepare-isolated-verification-access.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/shopping/apply-check.ts`
- `apps/api/migrations/0001-shopping-proof.sql`
- `apps/api/vitest.config.ts`
- `apps/api/tests/shopping/apply-check.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [x] Applying operation A to item revision 7 yields one revision change and one durable outcome; replaying A after a lost response returns the same result without another mutation.
- [x] Two distinct operations targeting revision 7 produce at most one accepted mutation; a zero-row conditional UPDATE cannot store a false success or consume an unrelated reservation.
- [x] Failure between mutation and outcome cannot leave a partial committed state; deleted/cross-household items cannot be changed. Record local and isolated remote D1 results.

## Verification

- [x] Establish pnpm test:api and run the focused shopping mutation test against the Workers-compatible test runtime.
- [x] Repeat duplicate/concurrent/crash cases against an isolated remote D1 database and inspect stored revisions/outcomes.

## Execution checklist

- [x] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [x] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [x] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [x] Run the focused checks above and the affected build/type checks established by the harness.
- [x] Record evidence, limitations and pass/fail in `docs/evidence/t01.md` or link the named report already produced by this task.
- [x] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
