# T24: Connect durable offline checks to the shared list

Status: not started
Type: engineering
Phase: Shopping
Depends on: T01, T03, T04, T23
Assignee: unassigned

## Outcome

Connect the proven state machine and platform stores to authenticated list commands and remove temporary proof UI.

## Dependencies

[T01: Prove atomic shopping mutations in D1](t01-prove-atomic-shopping-mutations-in-d1.md), [T03: Prove native pending-check persistence](t03-prove-native-pending-check-persistence.md), [T04: Prove web pending-check persistence](t04-prove-web-pending-check-persistence.md), [T23: Use one shared shopping list](t23-use-one-shared-shopping-list.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/src/shopping/sync.ts`
- `apps/api/src/shopping/check-route.ts`
- `tests/web/offline-shopping.spec.ts`
- `tests/native/offline-shopping.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Offline changes show a pending count and survive native restart; storage failure is visible. Focus/reconnect/manual retry sync only while the app is active.
- [ ] Stale server changes win, deleted items stay deleted, same-state/unchanged-content refresh is quiet, and different items progress independently.
- [ ] Lost responses reuse operation IDs; later taps and background refresh cannot erase pending intent; revocation/logout prevents replay.

## Verification

- [ ] Run offline-shopping Playwright tests with controlled response loss/delay.
- [ ] Complete two-device airplane-mode, concurrent edit and restart scenarios on native.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t24.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
