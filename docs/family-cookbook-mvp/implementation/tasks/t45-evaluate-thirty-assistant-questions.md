# T45: Evaluate thirty assistant questions

Status: not started
Type: engineering
Phase: Readiness
Depends on: T25, T26, T27
Assignee: unassigned

## Outcome

Run the fixed grounding/advice/mutation evaluation against the integrated assistant.

## Dependencies

[T25: Answer only with authorized recipe context](t25-answer-only-with-authorized-recipe-context.md), [T26: Use the text cookbook assistant](t26-use-the-text-cookbook-assistant.md), [T27: Suggest meals then confirm shopping](t27-suggest-meals-then-confirm-shopping.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `scripts/evaluation/assistant-gate.ts`
- `tests/fixtures/assistant/questions.json`
- `docs/evidence/assistant-gate.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Thirty questions include ten unanswerable cases, whole-book/selected-recipe scope, explicit advice and malicious-looking recipe text.
- [ ] There are no fabricated source IDs or cross-household facts; missing facts are explicit and all proposed mutations require confirmation.
- [ ] Report failures and general-advice separation per case with model/context metadata; do not hide defects in an aggregate score.

## Verification

- [ ] Run assistant-gate against the authorized synthetic/consented evaluation book.
- [ ] Inspect source references and persistent data to confirm no unapproved mutation occurred.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t45.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
