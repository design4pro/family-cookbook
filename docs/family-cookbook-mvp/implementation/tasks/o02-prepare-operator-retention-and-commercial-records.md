# O02: Prepare operator retention and commercial records

Status: not started
Type: operator
Phase: Prerequisites
Depends on: O01
Assignee: unassigned

## Outcome

Resolve operating-entity facts in parallel with development. An engineer cannot invent a lawful billing retention basis or store-tax configuration.

## Dependencies

[O01: Prepare isolated verification access](o01-prepare-isolated-verification-access.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `docs/operator/billing-retention.md`
- `docs/operator/launch-disclosures.md`

Estimated scope: S (operator/evidence artifact). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] A named operator records actual billing record categories, necessary purpose/basis, access and deletion schedule after account deletion; exceptions are explicit and reviewed by the responsible party.
- [ ] Localized offer configuration, renewal wording, taxes, sender/domain ownership and support contact have responsible owners and completion evidence.
- [ ] The record distinguishes what is required before real-data participation from what is required before real charges; missing facts keep the relevant gate closed.

## Verification

- [ ] Review the evidence register with the operating entity; check notices against actual provider configuration.
- [ ] No charges or real-user upload approval is inferred from a drafted document.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/o02.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
