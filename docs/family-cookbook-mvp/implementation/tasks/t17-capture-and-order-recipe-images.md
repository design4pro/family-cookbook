# T17: Capture and order recipe images

Status: not started
Type: engineering
Phase: Capture
Depends on: T13, T15, T16
Assignee: unassigned

## Outcome

Deliver camera/gallery upload on native and browser with the one-recipe/five-image contract.

## Dependencies

[T13: Review and save a recipe in the app](t13-review-and-save-a-recipe-in-the-app.md), [T15: Upload private sources with recoverable copies](t15-upload-private-sources-with-recoverable-copies.md), [T16: Process photographed recipes in the queue](t16-process-photographed-recipes-in-the-queue.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/app/app/capture-photo.tsx`
- `apps/app/src/capture/image-selection.ts`
- `tests/web/photo-capture.spec.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Preview, remove and reorder up to five images; ask for a closer image/manual entry for unrelated recipes instead of promising automatic splitting.
- [ ] Camera denial, invalid media, upload interruption and storage/allowance limits produce recoverable states.
- [ ] Navigation after upload returns to the persisted job/draft without resubmitting or losing originals.

## Verification

- [ ] Run tests/web/photo-capture.spec.ts with file fixtures.
- [ ] Verify camera/gallery permission denial and interruption on iOS/Android.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t17.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
