# T39: Instrument failures without logging family content

Status: not started
Type: engineering
Phase: Operations
Depends on: T05, T24, T29, T35
Assignee: unassigned

## Outcome

Provide operation-level diagnostics, actionable alerts and a support/pause procedure.

## Dependencies

[T05: Prove queued-job allowance settlement](t05-prove-queued-job-allowance-settlement.md), [T24: Connect durable offline checks to the shared list](t24-connect-durable-offline-checks-to-the-shared-list.md), [T29: Reconcile provider entitlements](t29-reconcile-provider-entitlements.md), [T35: Purge contributions and all owned copies](t35-purge-contributions-and-all-owned-copies.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `apps/api/src/observability/events.ts`
- `apps/api/src/observability/alerts.ts`
- `apps/api/tests/observability/redaction.test.ts`
- `docs/runbooks/incidents.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Metrics cover job failure, sync conflicts, quota consumption, answer latency, reconciliation lag and deletion deadlines without raw recipes/audio/prompts/conversations. Content-free events also support the accepted first-recipe, repeat-use and verified-purchase pilot measures.
- [ ] Synthetic deletion/queue/billing failures reach a named responder and support route; retry exhaustion is visible.
- [ ] Incident pause can stop unsafe imports/charges without deleting data; restoration steps and responsibilities are written and exercised.

## Verification

- [ ] Run redaction tests with deliberately sensitive fixture strings.
- [ ] Inject each critical failure and verify the actual test alert destination and pause procedure.

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/t39.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
