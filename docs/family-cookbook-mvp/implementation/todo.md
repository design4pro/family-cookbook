# Implementation task register

Status: 0 of 51 tasks complete. Both readiness gates are closed.

Read [the plan](plan.md) first. The IDs are stable references, not strict execution order. Complete dependencies before starting a card. In particular, T28 must run before T15/T25 even though it is listed under Billing. Checkboxes report implementation evidence, not planning completion.

Every card has an outcome, direct dependencies, scope, acceptance criteria and verification. When execution starts, assign an owner and record blockers/evidence on the card. Update this register only after the card passes. Perform a contract/test review after every two or three completed engineering tasks in a workstream; the proof checkpoints below are explicit.

## Initial execution checkpoints

- [ ] C1: Review passing T01-T03 - mutation, provenance and native pending-state contracts.
- [ ] C2: Review passing T04-T06 - web persistence, queue settlement and restore suppression.
- [ ] C3: Review passing T07-T09 - sessions, purchase identity and capture feasibility. T10 stays blocked until all proofs pass.

These checkpoints review existing evidence and are not additional product decisions. Dependency-ready proofs can proceed while an unrelated proof awaits a device/provider result.

## Prerequisites

- [ ] [O01: Prepare isolated verification access](tasks/o01-prepare-isolated-verification-access.md) - depends on: none.
- [ ] [O02: Prepare operator retention and commercial records](tasks/o02-prepare-operator-retention-and-commercial-records.md) - depends on: O01.

## Architecture proofs

- [ ] [T01: Prove atomic shopping mutations in D1](tasks/t01-prove-atomic-shopping-mutations-in-d1.md) - depends on: O01.
- [ ] [T02: Prove contribution-aware recipe deletion](tasks/t02-prove-contribution-aware-recipe-deletion.md) - depends on: T01.
- [ ] [T03: Prove native pending-check persistence](tasks/t03-prove-native-pending-check-persistence.md) - depends on: T01.
- [ ] [T04: Prove web pending-check persistence](tasks/t04-prove-web-pending-check-persistence.md) - depends on: T03.
- [ ] [T05: Prove queued-job allowance settlement](tasks/t05-prove-queued-job-allowance-settlement.md) - depends on: T01.
- [ ] [T06: Prove restore without deleted-data resurrection](tasks/t06-prove-restore-without-deleted-data-resurrection.md) - depends on: T02, T05.
- [ ] [T07: Prove authenticated sessions across platforms](tasks/t07-prove-authenticated-sessions-across-platforms.md) - depends on: T03, O01.
- [ ] [T08: Prove purchase identity cannot cross households](tasks/t08-prove-purchase-identity-cannot-cross-households.md) - depends on: T07, O01.
- [ ] [T09: Verify capture models on representative fixtures](tasks/t09-verify-capture-models-on-representative-fixtures.md) - depends on: T05, O01.

## Core identity

- [ ] [T10: Create and join a private household](tasks/t10-create-and-join-a-private-household.md) - depends on: T07, T02, T04, T06, T08, T09.
- [ ] [T11: Transfer cookbook administration](tasks/t11-transfer-cookbook-administration.md) - depends on: T10.

## Recipes

- [ ] [T12: Persist reviewable recipe revisions](tasks/t12-persist-reviewable-recipe-revisions.md) - depends on: T02, T10.
- [ ] [T13: Review and save a recipe in the app](tasks/t13-review-and-save-a-recipe-in-the-app.md) - depends on: T12, T03, T04.
- [ ] [T14: Browse the household cookbook](tasks/t14-browse-the-household-cookbook.md) - depends on: T12, T13.

## Capture

- [ ] [T15: Upload private sources with recoverable copies](tasks/t15-upload-private-sources-with-recoverable-copies.md) - depends on: T06, T10, T28.
- [ ] [T16: Process photographed recipes in the queue](tasks/t16-process-photographed-recipes-in-the-queue.md) - depends on: T05, T09, T12, T15.
- [ ] [T17: Capture and order recipe images](tasks/t17-capture-and-order-recipe-images.md) - depends on: T13, T15, T16.
- [ ] [T18: Record and review spoken input](tasks/t18-record-and-review-spoken-input.md) - depends on: T15, T03.
- [ ] [T19: Transcribe recordings into reviewable drafts](tasks/t19-transcribe-recordings-into-reviewable-drafts.md) - depends on: T05, T09, T12, T15, T18.

## Cooking

- [ ] [T20: Cook from an approved recipe](tasks/t20-cook-from-an-approved-recipe.md) - depends on: T13, T14.
- [ ] [T21: Download recipes for native offline reading](tasks/t21-download-recipes-for-native-offline-reading.md) - depends on: T15, T20, T03.

## Shopping

- [ ] [T22: Build deterministic shopping contributions](tasks/t22-build-deterministic-shopping-contributions.md) - depends on: T12, T20, T01.
- [ ] [T23: Use one shared shopping list](tasks/t23-use-one-shared-shopping-list.md) - depends on: T22, T10.
- [ ] [T24: Connect durable offline checks to the shared list](tasks/t24-connect-durable-offline-checks-to-the-shared-list.md) - depends on: T01, T03, T04, T23.

## Assistant

- [ ] [T25: Answer only with authorized recipe context](tasks/t25-answer-only-with-authorized-recipe-context.md) - depends on: T12, T14, T09, T28.
- [ ] [T26: Use the text cookbook assistant](tasks/t26-use-the-text-cookbook-assistant.md) - depends on: T25, T14.
- [ ] [T27: Suggest meals then confirm shopping](tasks/t27-suggest-meals-then-confirm-shopping.md) - depends on: T22, T23, T26.

## Billing

- [ ] [T28: Enforce sample and paid usage windows](tasks/t28-enforce-sample-and-paid-usage-windows.md) - depends on: T05, T10, T12.
- [ ] [T29: Reconcile provider entitlements](tasks/t29-reconcile-provider-entitlements.md) - depends on: T08, T28.
- [ ] [T30: Purchase and manage the plan on web](tasks/t30-purchase-and-manage-the-plan-on-web.md) - depends on: T29, T07.
- [ ] [T31: Purchase and restore on native](tasks/t31-purchase-and-restore-on-native.md) - depends on: T29, T07.
- [ ] [T32: Apply Archive without losing shopping checks](tasks/t32-apply-archive-without-losing-shopping-checks.md) - depends on: T24, T28, T29, T20, T26.
- [ ] [T33: Replace the household payer after expiry](tasks/t33-replace-the-household-payer-after-expiry.md) - depends on: T11, T29, T30, T31, T32.

## Continuity

- [ ] [T34: Request account deletion with a precise preview](tasks/t34-request-account-deletion-with-a-precise-preview.md) - depends on: T02, T10, T11, T29.
- [ ] [T35: Purge contributions and all owned copies](tasks/t35-purge-contributions-and-all-owned-copies.md) - depends on: T02, T05, T15, T34.
- [ ] [T36: Schedule inactivity notices and cleanup](tasks/t36-schedule-inactivity-notices-and-cleanup.md) - depends on: T10, T29, T35.
- [ ] [T37: Export a self-contained family archive](tasks/t37-export-a-self-contained-family-archive.md) - depends on: T05, T12, T15, T35.
- [ ] [T38: Rehearse production-shaped deletion and recovery](tasks/t38-rehearse-production-shaped-deletion-and-recovery.md) - depends on: T06, T29, T35, T36, T37.

## Operations

- [ ] [T39: Instrument failures without logging family content](tasks/t39-instrument-failures-without-logging-family-content.md) - depends on: T05, T24, T29, T35.

## Readiness

- [ ] [T40: Verify accessible web journeys](tasks/t40-verify-accessible-web-journeys.md) - depends on: T13, T17, T19, T20, T23, T26, T34, T37, T11, T30, T33.
- [ ] [T41: Verify accessible native journeys](tasks/t41-verify-accessible-native-journeys.md) - depends on: T13, T17, T19, T20, T21, T24, T26, T34, T11, T31, T33, T37.
- [ ] [T42: Run complete web and isolation journeys](tasks/t42-run-complete-web-and-isolation-journeys.md) - depends on: T10, T11, T17, T19, T24, T27, T32, T34, T37.
- [ ] [T43: Run complete native interruption journeys](tasks/t43-run-complete-native-interruption-journeys.md) - depends on: T17, T19, T21, T24, T27, T32, T34.
- [ ] [T44: Evaluate fifty capture examples with human correction](tasks/t44-evaluate-fifty-capture-examples-with-human-correction.md) - depends on: T17, T19, T13.
- [ ] [T45: Evaluate thirty assistant questions](tasks/t45-evaluate-thirty-assistant-questions.md) - depends on: T25, T26, T27.
- [ ] [T46: Measure response and import latency](tasks/t46-measure-response-and-import-latency.md) - depends on: T16, T19, T25, T39.
- [ ] [T48: Run the cross-channel billing acceptance matrix](tasks/t48-run-the-cross-channel-billing-acceptance-matrix.md) - depends on: T30, T31, T32, T33, T34, T35.

## Milestones

- [ ] [T47: Record Gate 1 readiness evidence](tasks/t47-record-gate-1-readiness-evidence.md) - depends on: T38, T39, T40, T41, T42, T43, T44, T45, T46, O01.
- [ ] [T49: Record Gate 2 readiness for real charges](tasks/t49-record-gate-2-readiness-for-real-charges.md) - depends on: T47, T48, O02, T39.

## Completion handoff

- [ ] Each completed task links an execution report with environment/build identity.
- [ ] No unresolved architecture, data-loss, isolation or core-flow defect is hidden by a checked item.
- [ ] Gate 1 and Gate 2 have separate recorded decisions and the pilot owner understands their boundaries.

No implementation or provider/device validation has been performed by creating this register.
