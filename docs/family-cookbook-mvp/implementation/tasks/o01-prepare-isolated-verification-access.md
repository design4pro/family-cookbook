# O01: Prepare isolated verification access

Status: in progress (T01/T05/T06/T07 access verified; T03 physical-device access blocked)
Type: operator
Phase: Prerequisites
Depends on: none
Assignee: Developer (operator), Codex (verification)

## Execution result

The application repository, isolated D1 access required by T01, and D1/Worker/Queue access required by T05 are verified. See [T05 evidence](../../../evidence/t05.md). T06 verified private R2 access and D1 Time Travel with an independent journal; see [T06 evidence](../../../evidence/t06.md). Exact billing tier remains unverified. See [O01 evidence](../../../evidence/o01.md) and the [access inventory](../../../operator/test-access.md). T03 local build tools and signing identity are verified; T07 verified restricted Resend sender/recipient access and native simulator/emulator builds; physical devices, distribution and billing sandboxes remain unverified; O01 is not complete. Missing access blocks only its dependent tasks.

## Outcome

Record the application repository location and available synthetic-data test resources before remote proofs. This is operator preparation, not production deployment.

## Dependencies

None

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `docs/operator/test-access.md`

Estimated scope: S (operator/evidence artifact). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [x] A concrete application repository path and its applicable instructions are recorded; this planning folder is not silently turned into the application repository.
- [ ] Cloudflare test resources, verified test email sender, iOS/Android test devices and Polar sandbox access and native distribution credentials have named owners; secrets stay in approved secret storage.
- [ ] Tests cannot reach live purchase resources or real family data; missing access blocks only its dependent tasks and is recorded explicitly.

## Verification

- [ ] Review the access inventory with the operator and verify test resource identity without printing secrets.
- [x] Record availability for Cloudflare, email, iOS, Android and billing separately (D1/Workers/Queues/R2 and restricted test email verified; remaining access explicitly unverified).

## Execution checklist

- [ ] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [ ] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [ ] Run the focused checks above and the affected build/type checks established by the harness.
- [ ] Record evidence, limitations and pass/fail in `docs/evidence/o01.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.

T08 Polar sandbox access and purchase-identity verification passed through MCP; see [T08 evidence](../../../evidence/t08.md). The developer approved the test address and completed the hosted test checkout. Native IAP credentials are superseded by [ADR 0001](../../../decisions/0001-polar-only-purchases.md); physical devices and native distribution acceptance remain outstanding.

T09 update: Workers AI inference access is verified for synthetic Whisper/Scout/Qwen probes. Photo access and Cloudflare consent are now verified for seven developer-supplied images. Natural recordings and full human reference review remain pending. See [T09 evidence](../../../evidence/capture-feasibility.md). T03 physical-device access is unchanged.
