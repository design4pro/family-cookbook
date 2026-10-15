# Family cookbook

Execution amendment, 2026-10-15: the developer accepted [Polar as the sole purchase channel](../decisions/0001-polar-only-purchases.md), with web checkout and native backend-entitlement consumption. Earlier Stripe/RevenueCat/Apple/Google purchase recommendations below are historical and superseded; native distribution feasibility remains a release prerequisite. Other resolved decisions are preserved.

A private shared collection of family recipes used by people with separate accounts. This glossary records vocabulary from the accepted household, experience and payment contracts. The final implementation specification defines the behavior.

## Language

**Household**:
The group sharing a private family cookbook, comprising up to five people in total.
_Avoid_: Shared account

**Cookbook**:
The private collection of recipes shared within a household.
_Avoid_: Public recipe catalog

**Member**:
A person participating in the household through their own account; the payer also counts toward the household size.
_Avoid_: Device, seat purchase

**Payer**:
The single person paying for the household's shared service.
_Avoid_: Every member as a separate subscriber

**Source**:
An original recipe photograph or recording retained separately from editable recipe instructions.
_Avoid_: AI reconstruction

**Recipe draft**:
A candidate recipe awaiting a household member's review and explicit save; it is not yet a source for cookbook answers.
_Avoid_: Approved recipe

**Approved recipe**:
A recipe explicitly reviewed and saved by a household member; approval may preserve marked unknown quantities or times.
_Avoid_: AI-verified recipe

**Shopping list**:
The household's shared active list of recipe-derived and manually entered shopping items.
_Avoid_: Pantry inventory

**Purchased state**:
Whether a shopping item is marked as bought; members can change this state without an internet connection.
_Avoid_: Stock quantity

**Pending shopping change**:
A member's locally saved purchased-state change that has not yet received a final synchronization outcome. It remains visibly pending until accepted or reconciled with the shared list.
_Avoid_: Shared purchase confirmation

**Family plan**:
The paid household service shared by up to five people, with one payer and the same feature set under monthly or annual billing.
_Avoid_: Per-member subscription

**Sample**:
One-time quota-limited access used to try the household service without a payment card or trial countdown.
_Avoid_: Automatically renewing trial

**Archive**:
The household's access state after paid service expires, preserving existing recipes, sources, reading, cooking and export while restricting new creation and AI. Existing shopping items remain checkable.
_Avoid_: Deleted cookbook

**Cookbook administrator**:
The household member responsible for membership and administrative succession. This role does not imply authorship of all recipes or payment responsibility.
_Avoid_: Owner of all family content

**Administrator handover**:
An explicit transfer of cookbook administration accepted by an existing member; it leaves content attribution and subscriptions unchanged.
_Avoid_: Subscription transfer

**Payer replacement**:
A new member's explicit purchase for the same household after the old payer's entitlement expires, preserving the book and existing allowance history.
_Avoid_: Card transfer

## T09 capture proof checkpoint

Workers AI access and synthetic codec/chunk/schema probes are verified. Seven consented photographs were subsequently evaluated: photo source accuracy failed, including after a targeted prompt revision and a six-model comparison. Kimi/GLM improved the confirmed fractions, but no tested variant preserved all source facts. Two consented short human recordings have now been evaluated; the third short recipe, five-minute narration and full human references remain missing, while photo/audio fidelity remains unresolved. T09/C3 stay open and capture-dependent work is blocked; the explicit T10-only sequencing exception permits household implementation. See [evidence](../evidence/capture-feasibility.md) and the [alternative vision comparison](../evidence/t09-model-comparison.md). The [two-stage photo experiment](../evidence/t09-two-stage-photos.md) separates OCR errors from structuring errors but does not establish complete source fidelity. The [source-preserving crop comparison](../evidence/t09-cropped-photos.md) improves some words/units but also introduces fraction and ingredient errors; GLM cropping does not establish a faithful variant. [Human recording scenarios](../../tests/fixtures/capture/recording-scenarios.md) are prepared. The [first human-audio evidence](../evidence/t09-natural-audio.md) records correction failures in Qwen and remaining ASR-unit/missing-step failures after Kimi replay. T03 remains blocked on physical devices; both readiness gates remain closed.

## T10 household implementation checkpoint

T10 passes under the explicit developer-authorized sequencing exception: atomic household/membership creation, separate administrator/payer responsibilities, five-member capacity, email-bound single-use seven-day invitation links, revocation, voluntary leave and administrator removal. Membership removal fences queued work without deleting contributions or altering billing. Private reads require current membership; future resource endpoints must use the tested guard. Administrators cannot abandon remaining members before T11 handover; empty households close. See [T10 evidence](../evidence/t10.md). T03/T09 and both gates remain open with unchanged blockers.

## T11 administration implementation checkpoint

T11 passes: a fresh one-time email verification grants one nomination for five minutes, scoped to the session and household. One current member may be nominated for seven days; recipient acceptance atomically switches administration while retaining membership, payer identity and provenance. Cancellation, expiry and member departure invalidate requests. Profile deletion snapshots eligible remaining members; only a verified member still in that snapshot can explicitly claim, with one concurrent winner. Role-change and deletion notifications are durable in-app records committed with the transition. See [T11 evidence and the T10-T11 contract review](../evidence/t11.md). T03/T09 and both gates remain open with unchanged blockers.

## Design preparation checkpoint (2026-10-15)

The developer clarified that specification and task preparation precede a separate implementation phase. Preserve all existing implementation and evidence in a local checkpoint; do not erase completed work or resume feature development. The next phase uses Impeccable to prepare visual mockups before code for Cookbook -> Add photo -> Review against source -> Approved recipe on mobile and desktop. Product scope remains web, iOS and Android for Polish-speaking households. T03/T09 retain their recorded blockers and both readiness gates remain closed. Process lesson: a task register is not an instruction to continue implementation after the developer changes the active phase; record the phase boundary before handing off.
