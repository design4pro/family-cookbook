# T02: Prove contribution-aware recipe deletion

Status: not started
Type: engineering
Phase: Architecture proofs
Depends on: T01
Assignee: unassigned

## Outcome

Find a bounded provenance representation that can remove one account's contribution without destroying independent work. This is a feasibility proof before the full recipe schema.

## Dependencies

[T01: Prove atomic shopping mutations in D1](t01-prove-atomic-shopping-mutations-in-d1.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/recipes/contributions.ts`
- `apps/api/src/deletion/plan-contributor-purge.ts`
- `apps/api/tests/deletion/contributions.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Synthetic fixtures cover A creating a recipe, B editing it, C editing after B, and AI text derived from B's source; deleting B removes B-associated source/text/history without deleting A's independent recipe.
- [ ] A resulting incomplete recipe becomes review-required and cannot be retrieved by the assistant; creator deletion lists its affected recipes explicitly.
- [ ] The purge plan names affected rows/assets/exports and proves that merely changing author labels or keeping tainted historical snapshots cannot pass. If this cannot be demonstrated, downstream recipe work stops.

## Verification

- [ ] Run pnpm test:api -- apps/api/tests/deletion/contributions.test.ts.
- [ ] Inspect the post-purge fixture database and source inventory, including derived content and historical versions.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t02.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
