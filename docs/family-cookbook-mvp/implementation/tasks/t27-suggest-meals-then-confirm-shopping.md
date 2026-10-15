# T27: Suggest meals then confirm shopping

Status: not started
Type: engineering
Phase: Assistant
Depends on: T22, T23, T26
Assignee: unassigned

## Outcome

Connect a temporary ingredient list to at most three saved recipes and the existing shopping confirmation flow.

## Dependencies

[T22: Build deterministic shopping contributions](t22-build-deterministic-shopping-contributions.md), [T23: Use one shared shopping list](t23-use-one-shared-shopping-list.md), [T26: Use the text cookbook assistant](t26-use-the-text-cookbook-assistant.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/assistant/suggest-meals.ts`
- `apps/app/src/assistant/meal-selection.tsx`
- `tests/web/meal-to-shopping.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Suggestions use saved approved recipes and show missing ingredients; available does not imply enough stock.
- [ ] No match offers browse/add paths instead of inventing a family recipe; substitutions never rewrite originals.
- [ ] Servings and exclusions are reviewed before an explicit add command; no assistant message silently writes the shared list.

## Verification

- [ ] Run meal-to-shopping tests with no matches, unknown quantities and duplicate confirmation.
- [ ] Check one multi-recipe selection end-to-end with two household members.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t27.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
