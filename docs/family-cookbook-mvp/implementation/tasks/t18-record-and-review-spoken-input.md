# T18: Record and review spoken input

Status: not started
Type: engineering
Phase: Capture
Depends on: T15, T03
Assignee: unassigned

## Outcome

Deliver explicit record/stop/listen/re-record with a five-minute product limit.

## Dependencies

[T15: Upload private sources with recoverable copies](t15-upload-private-sources-with-recoverable-copies.md), [T03: Prove native pending-check persistence](t03-prove-native-pending-check-persistence.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/app/capture-audio.tsx`
- `apps/app/src/capture/recording.ts`
- `apps/app/tests/capture/recording.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Permissions and interruption states are visible; no background-recording or continuous-listening promise is made.
- [ ] Users can listen, discard or upload a supported playable recording; incomplete recording is not mislabeled complete.
- [ ] Retain-audio defaults on with an explicit toggle; a draft/processing failure does not prematurely delete the source.

## Verification

- [ ] Run recording-state tests, including the five-minute boundary.
- [ ] Record and play files on iOS, Android and browser; test a phone interruption and denied microphone.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t18.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
