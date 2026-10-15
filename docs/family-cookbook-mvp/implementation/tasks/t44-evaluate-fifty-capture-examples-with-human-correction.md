# T44: Evaluate fifty capture examples with human correction

Status: not started
Type: engineering
Phase: Readiness
Depends on: T17, T19, T13
Assignee: unassigned

## Outcome

Execute the accepted admission benchmark using consented examples and reference facts.

## Dependencies

[T17: Capture and order recipe images](t17-capture-and-order-recipe-images.md), [T19: Transcribe recordings into reviewable drafts](t19-transcribe-recordings-into-reviewable-drafts.md), [T13: Review and save a recipe in the app](t13-review-and-save-a-recipe-in-the-app.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `scripts/evaluation/capture-gate.ts`
- `tests/fixtures/capture/gate-manifest.json`
- `docs/evidence/capture-gate.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] The dataset contains 30 photographed recipes and 20 recordings with reference quantities/units/temperatures and consent/provenance records.
- [ ] At least 40/50 become usable through review in <=2 minutes; saved critical values are checked, and image/voice outcomes, failures and manual fallbacks are reported separately.
- [ ] Record model/configuration, observed costs, correction timing method and raw result counts; a failed threshold blocks Gate 1 rather than being relabeled success.

## Verification

- [ ] Run capture-gate evaluation through the actual import/review flow.
- [ ] Have a human compare saved results with references and retain the timed correction evidence.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t44.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
