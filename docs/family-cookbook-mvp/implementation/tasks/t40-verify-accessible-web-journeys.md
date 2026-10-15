# T40: Verify accessible web journeys

Status: not started
Type: engineering
Phase: Readiness
Depends on: T13, T17, T19, T20, T23, T26, T34, T37, T11, T30, T33
Assignee: unassigned

## Outcome

Run web accessibility review on the completed core journeys and fix attributable blockers in the owning feature tasks.

## Dependencies

[T13: Review and save a recipe in the app](t13-review-and-save-a-recipe-in-the-app.md), [T17: Capture and order recipe images](t17-capture-and-order-recipe-images.md), [T19: Transcribe recordings into reviewable drafts](t19-transcribe-recordings-into-reviewable-drafts.md), [T20: Cook from an approved recipe](t20-cook-from-an-approved-recipe.md), [T23: Use one shared shopping list](t23-use-one-shared-shopping-list.md), [T26: Use the text cookbook assistant](t26-use-the-text-cookbook-assistant.md), [T34: Request account deletion with a precise preview](t34-request-account-deletion-with-a-precise-preview.md), [T37: Export a self-contained family archive](t37-export-a-self-contained-family-archive.md), [T11: Transfer cookbook administration](t11-transfer-cookbook-administration.md), [T30: Purchase and manage the plan on web](t30-purchase-and-manage-the-plan-on-web.md), [T33: Replace the household payer after expiry](t33-replace-the-household-payer-after-expiry.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `tests/web/accessibility.spec.ts`
- `docs/evidence/web-accessibility.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Keyboard operation, focus recovery, labels, errors, contrast and large text meet the WCAG 2.2 AA target for core journeys.
- [ ] Source/draft review, pending shopping states and quota errors are understandable without color or voice.
- [ ] Automated checks are supplemented with manual screen-reader verification; unresolved core accessibility blockers keep the task open.

## Verification

- [ ] Run the web accessibility suite in the agreed browsers.
- [ ] Record manual keyboard/screen-reader results per journey; return focused fixes to the responsible feature.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t40.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
