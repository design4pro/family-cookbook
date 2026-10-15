# T03: Prove native pending-check persistence

Status: not started
Type: engineering
Phase: Architecture proofs
Depends on: T01
Assignee: unassigned

## Outcome

Create a minimal Expo development shell and native outbox proof. This temporary proof route is removed when the production list is connected.

## Dependencies

[T01: Prove atomic shopping mutations in D1](t01-prove-atomic-shopping-mutations-in-d1.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/src/shopping/pending.native.ts`
- `apps/app/src/shopping/sync-state.ts`
- `apps/app/tests/shopping/pending.test.ts`
- `apps/app/app/proof-shopping.tsx`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] A check survives force-close/relaunch in airplane mode on iOS and Android; storage failure is visible rather than reported as a saved change.
- [ ] Unsent taps collapse, in-flight commands remain immutable, and an old acknowledgment cannot erase a newer local intent.
- [ ] The queue is partitioned by account/household; logout or revoked membership never sends old changes under a new identity.

## Verification

- [ ] Establish pnpm test:app and run apps/app/tests/shopping/pending.test.ts.
- [ ] Run the proof route on real iOS and Android devices with airplane mode, process termination and reconnect.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t03.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
