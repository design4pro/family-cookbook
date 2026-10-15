# O01: Prepare isolated verification access

Status: not started
Type: operator
Phase: Prerequisites
Depends on: none
Assignee: unassigned

## Outcome

Record the application repository location and available synthetic-data test resources before remote proofs. This is operator preparation, not production deployment.

## Dependencies

None

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `docs/operator/test-access.md`

Estimated scope: S (operator/evidence artifact). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] A concrete application repository path and its applicable instructions are recorded; this planning folder is not silently turned into the application repository.
- [ ] Cloudflare test resources, verified test email sender, iOS/Android test devices and store/RevenueCat/Stripe sandbox access have named owners; secrets stay in approved secret storage.
- [ ] Tests cannot reach live purchase resources or real family data; missing access blocks only its dependent tasks and is recorded explicitly.

## Verification

- [ ] Review the access inventory with the operator and verify test resource identity without printing secrets.
- [ ] Record availability for Cloudflare, email, iOS, Android and billing separately.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/o01.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
