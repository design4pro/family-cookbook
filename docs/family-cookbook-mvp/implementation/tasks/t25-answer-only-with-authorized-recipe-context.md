# T25: Answer only with authorized recipe context

Status: not started
Type: engineering
Phase: Assistant
Depends on: T12, T14, T09, T28
Assignee: unassigned

## Outcome

Implement bounded approved-recipe retrieval, validated source references and clearly separated optional general advice.

## Dependencies

[T12: Persist reviewable recipe revisions](t12-persist-reviewable-recipe-revisions.md), [T14: Browse the household cookbook](t14-browse-the-household-cookbook.md), [T09: Verify capture models on representative fixtures](t09-verify-capture-models-on-representative-fixtures.md), [T28: Enforce sample and paid usage windows](t28-enforce-sample-and-paid-usage-windows.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/assistant/retrieve.ts`
- `apps/api/src/assistant/answer.ts`
- `apps/api/tests/assistant/grounding.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Drafts, review-required/deleted recipes and other households never enter context or returned source cards.
- [ ] Missing facts produce explicit uncertainty; recipe text cannot redirect tools, reveal other data or authorize mutations.
- [ ] Explicitly requested general advice is labeled separately; invalid source IDs or malformed output are rejected/repaired without invented attribution. Reserve and settle one answer through the shared usage policy; failed requests release it.

## Verification

- [ ] Run grounding tests including prompt-like recipe text, missing facts and fake source IDs.
- [ ] Inspect a small live model sample alongside the exact authorized context.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t25.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
