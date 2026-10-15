# T02: Prove contribution-aware recipe deletion

Status: complete (2026-10-15)
Type: engineering
Phase: Architecture proofs
Depends on: T01
Assignee: Codex

## Execution result

[Execution evidence](../../../evidence/t02.md) records 16 T02 tests, inspected post-purge D1 rows and synthetic object inventory, the negative history-retention control, typecheck and build dry-run. T01 passes. This proves the representation; production storage/write integration belongs to T12 and real copy deletion to T35. Neither readiness gate has passed.

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

- [x] Synthetic fixtures cover A creating a recipe, B editing it, C editing after B, and AI text derived from B's source; deleting B removes B-associated source/text/history without deleting A's independent recipe.
- [x] A resulting incomplete recipe becomes review-required and cannot be retrieved by the assistant; creator deletion lists its affected recipes explicitly.
- [x] The purge plan names affected rows/assets/exports and proves that merely changing author labels or keeping tainted historical snapshots cannot pass. If this cannot be demonstrated, downstream recipe work stops.

## Verification

- [x] Run `pnpm test:api tests/deletion/contributions.test.ts` (the workspace script forwards the path relative to `apps/api`).
- [x] Inspect the post-purge fixture database and source inventory, including derived content and historical versions.

## Execution checklist

- [x] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [x] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [x] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [x] Run the focused checks above and the affected build/type checks established by the harness.
- [x] Record evidence, limitations and pass/fail in `docs/evidence/t02.md` or link the named report already produced by this task.
- [x] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
