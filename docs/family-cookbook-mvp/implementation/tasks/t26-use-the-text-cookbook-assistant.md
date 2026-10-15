# T26: Use the text cookbook assistant

Status: not started
Type: engineering
Phase: Assistant
Depends on: T25, T14
Assignee: unassigned

## Outcome

Deliver typed questions with whole-book or selected-recipe scope and private conversation history.

## Dependencies

[T25: Answer only with authorized recipe context](t25-answer-only-with-authorized-recipe-context.md), [T14: Browse the household cookbook](t14-browse-the-household-cookbook.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/app/(tabs)/assistant.tsx`
- `apps/app/src/assistant/source-card.tsx`
- `tests/web/assistant.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Scope is visible and changeable; recipe links open the actual authorized recipe, and no microphone is added.
- [ ] Empty book, no match, unknown fact, exhausted allowance and model/network failure have distinct useful states.
- [ ] One member cannot read another member's private conversation; failed responses are not displayed as completed answers.

## Verification

- [ ] Run tests/web/assistant.spec.ts including conversation isolation.
- [ ] Check keyboard, screen-reader reading order and narrow-screen source cards.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t26.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
