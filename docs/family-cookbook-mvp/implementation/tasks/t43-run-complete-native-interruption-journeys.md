# T43: Run complete native interruption journeys

Status: not started
Type: engineering
Phase: Readiness
Depends on: T17, T19, T21, T24, T27, T32, T34
Assignee: unassigned

## Outcome

Validate end-to-end behavior across permissions, recording/upload interruptions and offline restarts.

## Dependencies

[T17: Capture and order recipe images](t17-capture-and-order-recipe-images.md), [T19: Transcribe recordings into reviewable drafts](t19-transcribe-recordings-into-reviewable-drafts.md), [T21: Download recipes for native offline reading](t21-download-recipes-for-native-offline-reading.md), [T24: Connect durable offline checks to the shared list](t24-connect-durable-offline-checks-to-the-shared-list.md), [T27: Suggest meals then confirm shopping](t27-suggest-meals-then-confirm-shopping.md), [T32: Apply Archive without losing shopping checks](t32-apply-archive-without-losing-shopping-checks.md), [T34: Request account deletion with a precise preview](t34-request-account-deletion-with-a-precise-preview.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `docs/evidence/native-journeys.md`
- `tests/native/core-journeys.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] The complete capture-to-cook flow works on both real platforms, with denied/revoked permissions and interrupted uploads recoverable.
- [ ] Downloaded recipes and pending checks survive restart; account deletion/removal stops server access and cross-account replay.
- [ ] No unresolved native data-loss/core-flow defect remains; screenshots/logs identify build and device without exposing real family material.

## Verification

- [ ] Run the native journey checklist on iOS and Android synthetic households.
- [ ] Repeat airplane-mode/relaunch and concurrent change cases with two devices.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t43.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
