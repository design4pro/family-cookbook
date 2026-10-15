# T35: Purge contributions and all owned copies

Status: not started
Type: engineering
Phase: Continuity
Depends on: T02, T05, T15, T34
Assignee: unassigned

## Outcome

Connect the validated contribution purge to active stores, recovery objects, exports, history and processor deletion.

## Dependencies

[T02: Prove contribution-aware recipe deletion](t02-prove-contribution-aware-recipe-deletion.md), [T05: Prove queued-job allowance settlement](t05-prove-queued-job-allowance-settlement.md), [T15: Upload private sources with recoverable copies](t15-upload-private-sources-with-recoverable-copies.md), [T34: Request account deletion with a precise preview](t34-request-account-deletion-with-a-precise-preview.md)

## Scope and files

Integrate the [T06 independent journal and recovery gate](../../../evidence/t06.md). Persist the deletion outside application restore history before acknowledging revocation; preserve original request/purge deadlines, verify every copy deletion, and fence future Queue envelopes with the independent recovery epoch.

Integrate the [T02 purge-plan contract](../../../evidence/t02.md). Its fixture executor is test-only: real access revocation, concurrent/late-write suppression, stale-preview checks, object/processor acknowledgments and deadlines still require this task's evidence.

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/deletion/purge.ts`
- `apps/api/src/deletion/processors.ts`
- `apps/api/tests/deletion/purge.test.ts`
- `docs/evidence/data-copy-inventory.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Associated text/sources/history and derived copies are removed; surviving incomplete recipes become review-required and unavailable to assistant retrieval.
- [ ] Late imports/uploads/exports cannot republish removed content, and retries complete one deletion workflow safely.
- [ ] Every copy has a recorded retention/deletion route; deadline failures alert; minimal retained records are separated from deleted content rather than hidden in a surviving profile.

## Verification

- [ ] Run purge integration tests with an in-flight model response and jointly edited fixtures.
- [ ] Inspect active/recovery object inventories and processor confirmations; record unresolved provider blockers.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t35.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.

## T07 session handoff

Account deletion must revoke canonical authentication sessions as part of its blocking boundary. D1 user deletion cascades auth sessions and stale cookies are denied; the full deletion workflow still belongs to this task. See the [proven session contract](../../../runbooks/auth-session-proof.md) and [T07 evidence](../../../evidence/t07.md). T03 physical-device acceptance remains blocked.
