# T04: Prove web pending-check persistence

Status: complete (loaded-web proof; T03 physical-device blocker remains)
Type: engineering
Phase: Architecture proofs
Depends on: T03
Assignee: Codex

## Execution result

See [T04 evidence](../../../evidence/t04.md): 18 Playwright cases pass across Chromium and WebKit, with 13 app tests and full workspace verification. The developer explicitly authorized proceeding while T03 awaits physical iOS/Android tests. That blocker and C1 remain open. The shell was served through local isolated Worker assets; nothing was deployed.

## Outcome

Implement the same narrow pending-state contract using IndexedDB in the loaded web app. Serve the minimal exported Expo web shell through isolated Worker assets and verify direct-route loading; this establishes the test hosting boundary, not production deployment.

## Dependencies

[T03: Prove native pending-check persistence](t03-prove-native-pending-check-persistence.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/src/shopping/pending.web.ts`
- `apps/app/tests/shopping/pending.web.test.ts`
- `tests/web/offline-proof.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [x] Offline checks remain pending through a reload when the app can load; the product does not promise web cold-start offline.
- [x] Storage denied/full and browser restart cases do not silently lose acknowledged-local intent; account switching cannot replay another account's queue.
- [x] The shared state-machine contract passes in Chromium and WebKit; a fetched snapshot does not clear pending intent before a terminal result.

## Verification

- [x] Run `pnpm test:app tests/shopping/pending.web.test.ts`.
- [x] Establish pnpm test:web and run tests/web/offline-proof.spec.ts in Chromium and WebKit.

## Execution checklist

- [x] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [x] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [x] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [x] Run the focused checks above and the affected build/type checks established by the harness.
- [x] Record evidence, limitations and pass/fail in `docs/evidence/t04.md` or link the named report already produced by this task.
- [x] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
