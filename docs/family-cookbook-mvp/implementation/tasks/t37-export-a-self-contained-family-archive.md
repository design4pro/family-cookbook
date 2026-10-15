# T37: Export a self-contained family archive

Status: not started
Type: engineering
Phase: Continuity
Depends on: T05, T12, T15, T35
Assignee: unassigned

## Outcome

Deliver authorized asynchronous ZIP export with JSON, standalone readable HTML and real source files.

## Dependencies

[T05: Prove queued-job allowance settlement](t05-prove-queued-job-allowance-settlement.md), [T12: Persist reviewable recipe revisions](t12-persist-reviewable-recipe-revisions.md), [T15: Upload private sources with recoverable copies](t15-upload-private-sources-with-recoverable-copies.md), [T35: Purge contributions and all owned copies](t35-purge-contributions-and-all-owned-copies.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/exports/create.ts`
- `apps/api/src/exports/render.ts`
- `apps/app/app/export.tsx`
- `tests/exports/offline-archive.test.ts`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Export remains available in sample and Archive; member authorization is rechecked before generation and download.
- [ ] ZIP contains originals (images/retained recordings), structured JSON and standalone readable HTML, not hosted links; it opens with networking disabled and handles escaped user text safely.
- [ ] Deletion during export invalidates/removes affected artifacts; download links expire and temporary exports have bounded cleanup.

## Verification

- [ ] Run offline-archive tests with networking disabled and hostile markup in recipe text.
- [ ] Manually open a representative archive including images, audio and unknown quantities.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t37.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
