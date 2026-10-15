# T38: Rehearse production-shaped deletion and recovery

Status: not started
Type: engineering
Phase: Continuity
Depends on: T06, T29, T35, T36, T37
Assignee: unassigned

## Outcome

Rerun the early recovery proof against the full data graph and selected provider configuration.

## Dependencies

[T06: Prove restore without deleted-data resurrection](t06-prove-restore-without-deleted-data-resurrection.md), [T29: Reconcile provider entitlements](t29-reconcile-provider-entitlements.md), [T35: Purge contributions and all owned copies](t35-purge-contributions-and-all-owned-copies.md), [T36: Schedule inactivity notices and cleanup](t36-schedule-inactivity-notices-and-cleanup.md), [T37: Export a self-contained family archive](t37-export-a-self-contained-family-archive.md)

## Scope and files

Extend the [passing T06 architecture proof](../../../evidence/t06.md) and [runbook](../../../runbooks/recovery.md). Resolve exact provider tier/retention, R2 lifecycle timing, real processor copies and history created by restoring old data. Replay suppression is not physical erasure; the original 30/37-day deadline must remain valid. Reconcile billing and the full production graph before enabling access. These are Gate 1 obligations, not closed by T06.

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `scripts/recovery/rehearse.ts`
- `docs/evidence/deletion-deadlines.md`
- `docs/evidence/recovery-rehearsal.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Restore synthetic pre-deletion data in isolation, replay removals, revoke old sessions, reconcile billing and keep outbound jobs disabled until verification completes.
- [ ] Demonstrate active cleanup <=7 days and configured backup expiry <=30 days after deletion/max37 from request, including processor/copy inventory; simulated clocks are distinguished from provider guarantees.
- [ ] Recovery restores retained source assets while removed accounts/contributions/exports stay inaccessible and eventually expire as promised; unexplained copies block Gate 1.

## Verification

- [ ] Run the isolated recovery rehearsal and inspect its post-restore queries and object manifests.
- [ ] Review actual retention settings/documentation and deletion confirmations separately from accelerated test results.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t38.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
