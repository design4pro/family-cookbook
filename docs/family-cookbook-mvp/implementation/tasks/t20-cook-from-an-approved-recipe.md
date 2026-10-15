# T20: Cook from an approved recipe

Status: not started
Type: engineering
Phase: Cooking
Depends on: T13, T14
Assignee: unassigned

## Outcome

Deliver readable cooking, deterministic scaling and optional device narration.

## Dependencies

[T13: Review and save a recipe in the app](t13-review-and-save-a-recipe-in-the-app.md), [T14: Browse the household cookbook](t14-browse-the-household-cookbook.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/app/recipe.tsx`
- `apps/app/src/recipes/cooking-mode.tsx`
- `packages/domain/src/portions.ts`
- `packages/domain/tests/portions.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Known servings scale quantities correctly; unknown servings disable scaling and unknown amounts never become zero.
- [ ] Large steps, source links, visible controls and keep-awake behavior where supported work without voice.
- [ ] Device speech is optional with an available-voice fallback; no cloud TTS fee or universal offline voice availability is promised.

## Verification

- [ ] Run portion arithmetic unit tests for fractions, incompatible conversions and unknowns.
- [ ] Check cooking mode, text scaling and device playback on native and web.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t20.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
