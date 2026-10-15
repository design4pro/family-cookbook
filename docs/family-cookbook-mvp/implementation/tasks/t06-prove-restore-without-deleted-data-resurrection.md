# T06: Prove restore without deleted-data resurrection

Status: not started
Type: engineering
Phase: Architecture proofs
Depends on: T02, T05
Assignee: unassigned

## Outcome

Prove the recovery boundary using D1 history, private R2 source copies and a minimized deletion journal outside the restored database.

## Dependencies

[T02: Prove contribution-aware recipe deletion](t02-prove-contribution-aware-recipe-deletion.md), [T05: Prove queued-job allowance settlement](t05-prove-queued-job-allowance-settlement.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/deletion/journal.ts`
- `scripts/proofs/restore-household.ts`
- `tests/recovery/restore-household.test.ts`
- `docs/runbooks/recovery.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] An isolated historical restore re-applies later deletions before reads/workers are enabled, including source files, derived versions, session revocation and pending jobs.
- [ ] A retained household can recover its source assets; D1 restoration alone is not presented as media recovery and export/cached objects are inventoried.
- [ ] Evidence distinguishes immediate access revocation, active purge within 7 days and backup expiry within 30 days after purge/max 37 days after request; restoration suppression is not falsely called physical erasure.

## Verification

- [ ] Run tests/recovery/restore-household.test.ts against disposable resources, never a live pilot database.
- [ ] Record restore points, asset counts, deletion replay, disabled outbound effects and the actual provider retention inventory.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t06.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
