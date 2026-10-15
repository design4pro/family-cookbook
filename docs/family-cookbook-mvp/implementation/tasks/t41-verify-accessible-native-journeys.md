# T41: Verify accessible native journeys

Status: not started
Type: engineering
Phase: Readiness
Depends on: T13, T17, T19, T20, T21, T24, T26, T34, T11, T31, T33, T37
Assignee: unassigned

## Outcome

Validate the product on actual iOS and Android accessibility tooling.

## Dependencies

[T13: Review and save a recipe in the app](t13-review-and-save-a-recipe-in-the-app.md), [T17: Capture and order recipe images](t17-capture-and-order-recipe-images.md), [T19: Transcribe recordings into reviewable drafts](t19-transcribe-recordings-into-reviewable-drafts.md), [T20: Cook from an approved recipe](t20-cook-from-an-approved-recipe.md), [T21: Download recipes for native offline reading](t21-download-recipes-for-native-offline-reading.md), [T24: Connect durable offline checks to the shared list](t24-connect-durable-offline-checks-to-the-shared-list.md), [T26: Use the text cookbook assistant](t26-use-the-text-cookbook-assistant.md), [T34: Request account deletion with a precise preview](t34-request-account-deletion-with-a-precise-preview.md), [T11: Transfer cookbook administration](t11-transfer-cookbook-administration.md), [T31: Purchase and restore on native](t31-purchase-and-restore-on-native.md), [T33: Replace the household payer after expiry](t33-replace-the-household-payer-after-expiry.md), [T37: Export a self-contained family archive](t37-export-a-self-contained-family-archive.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `docs/evidence/native-accessibility.md`
- `tests/native/accessibility.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] VoiceOver and TalkBack can complete capture, review, recipe reading and shopping with meaningful control/state labels.
- [ ] Large text, touch targets and layout do not hide confirmation/error controls; voice playback is optional.
- [ ] Permission denial and pending offline states remain navigable; evidence names devices, OS and build and no core blocker is waived.

## Verification

- [ ] Complete native accessibility scenarios using VoiceOver and TalkBack.
- [ ] Record and retest each defect after its owning feature is corrected.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t41.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
