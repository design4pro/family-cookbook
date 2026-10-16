# Capture flow design discovery

Status: visual redesign remains open on 2026-10-15. The developer rejected green-flow, [v2](editorial-native-v2/README.md) and [v3](editorial-web-v3/README.md) as amateurish, then supplied local Smakopas designs for inspection. The [Smakopas reference analysis](smakopas-reference-analysis.md) records the latest calibration evidence and correction in approach. No replacement direction is approved. Editorial web and native Liquid Glass on iPhone/iPad remain the brief. Read mode applies to browsing/saved recipes; Operate mode applies to import/review. Earlier exploration remains as history. No implementation is authorized by this checkpoint.

The [Smakopas web v4 proposal](smakopas-web-v4/README.md) contains four static Cookbook and Recipe mockups for desktop and mobile and awaits user review. It does not approve a visual system or authorize implementation; green-flow, v2 and v3 remain rejected.

On 2026-10-16 the developer requested continuation in the same style for Add photos and Review recipe. The [capture and review brief](smakopas-web-v4/capture-brief.md) records four main static desktop/mobile studies plus an additional mobile Source-tab state. The Operate-mode studies use two labeled synthetic pages, distinguish author from uploader/editor and retain unknown salt quantity and servings. They do not approve the complete visual system, implement interactions or change T03/T09 status.

The developer then requested Cookbook -> Add photos -> Review -> Recipe on iPhone and iPad. The [Smakopas native v4 packet](smakopas-native-v4/README.md) contains eight main static mockups and two additional iPhone Review states, retaining Smakopas typography with intended native controls and a static Liquid Glass projection. It awaits user review and does not approve the complete visual system, implement application behavior or change T03/T09 status.

## Confirmed scope

The 2026-10-16 [Android phone study](smakopas-android-v4/README.md) adds four main static screens and two Review states. It preserves Smakopas typography and content while translating navigation and controls to Material Design. It is a phone proposal pending user feedback, not an implementation, native-device test or change to T03/T09.

The subsequent [Smakopas shopping v4 study](smakopas-shopping-v4/README.md) adds 14 static mockups across desktop web, mobile web, iPhone, iPad and Android phone: five main lists, five recipe-addition confirmations, three offline states and one updated-item state. Its shared synthetic scenario retains recipe/manual contributions, explicit confirmation, unknown servings and visible pending checks. The packet awaits user review; it does not implement application behavior or approve the complete visual system. T03/T09 and both readiness gates remain unchanged.

The [Smakopas assistant v4 study](smakopas-assistant-v4/README.md) continues the established visual world with 18 static mockups across the same five surfaces: Start, a sourced answer and an ingredient-based saved-recipe suggestion on each, plus mobile-web no-match, iPhone allowance and Android request-error alternatives. Typed questions retain visible cookbook or recipe scope; the synthetic responses cite Family pancakes, preserve unknown cooking time and servings, and treat ingredient input as temporary rather than pantry inventory. Shopping remains a proposal requiring separate confirmation. The study retains Apple Liquid Glass and Android Material adaptations, awaits user review and neither creates a new DESIGN.md nor approves a complete visual system or implementation. T03/T09 and both readiness gates remain unchanged.

The [Smakopas household v4 study](smakopas-household-v4/README.md) adds 24 static proposals across desktop web, mobile web, iPhone, iPad and Android phone: Household, Invitation created, Account and Join household on each, plus mobile-web Create invitation and Invitation unavailable, iPad Pending handover and Android Remove member confirmation. Alex, Anna and Sam form the synthetic three-member household, with separate administrator and payer responsibilities; Jordan's pending invitation grants no membership or reserved place. Invitation creation exposes a link for manual sharing without sending email. Account deletion is a separate entry point whose full preview still requires design. The packet retains the existing Smakopas, Apple Liquid Glass and Android Material direction, awaits user review and neither creates a new DESIGN.md nor approves a complete visual system or implementation. T03/T09 and both readiness gates remain unchanged.

The [Smakopas onboarding v4 study](smakopas-onboarding-v4/README.md) adds 25 static screens and four overview sheets across the same five surfaces: Email, Code, Create household and Household created, plus mobile-web Code error and Retained invitation, iPhone Code expired, Android Request error and Existing household. The synthetic flow separates code-request acknowledgement from delivery, authentication from membership, and payer designation from a subscription. Invitation context stays private and requires a separate explicit join after sign-in. The card-free sample has no countdown or automatic renewal. The packet continues the current Smakopas, Apple Liquid Glass and Android Material direction, awaits user review and remains design only; it changes neither DESIGN.md nor T03/T09 or either readiness gate.

The [Smakopas billing v4 study](smakopas-billing-v4/README.md) adds 28 static screens and four overview sheets across desktop web, mobile web, iPhone, iPad and Android phone. Plan/Sample, Usage, Subscription and Archive are accompanied by checkout verification, renewal cancellation, payer change, resource-limit, grace and refresh-error alternatives. Polar purchase and management are confined to web; native shows status, limits and access refresh without external-checkout promotion. The study preserves the documented Smakopas typography and Apple Liquid Glass/Android Material treatment, awaits user review and remains design only. It does not create DESIGN.md, approve implementation or change T03/T09 or either readiness gate.

Cookbook -> Add photo -> Review against source -> Approved recipe. Mobile and desktop visual mockups before code, with iOS/Android navigation and control adaptations. Mode: Operate. The developer confirmed this sequence and comp-first delivery on 2026-10-15. [PRODUCT.md](../../PRODUCT.md) records durable product truth; the [specification](../family-cookbook-mvp/spec.md) remains authoritative.

## Outcome

An organizer finds an existing family recipe or adds one, distinguishes upload from processing, checks a draft against its original, corrects or explicitly retains unknown facts, then saves a recipe for the household. The visual focal point is the source-to-draft comparison, not an AI confidence score.

## Visual authority

No PRODUCT.md or DESIGN.md existed at discovery. Existing Expo proof routes use system buttons, plain form fields and inline layout values; the root route is a shopping proof. These establish behavior and accessibility starting points, not a coherent approved visual world. No existing product visual system is being replaced.

## Direction exploration material

The distinctive mechanism is a preserved source beside a reviewable interpretation. The audience moves between collecting family material, cooking and shopping. Predictable category defaults are beige handwritten recipe cards with food photography, and their equally predictable opposite, a dark AI dashboard. Neither defines the candidate list.

Seven distinct grounded candidates, ordered by task fit before the concept seed:

1. **Archive register:** library accession records and personal document archives; clear provenance columns, date/author labels and paired source records make preservation and verification legible.
2. **Enamel worktop:** cobalt-and-white kitchen enamel with sturdy utility labels; a clear work surface foregrounds the current recipe and large preparation controls.
3. **Community recipe circular:** local community publications and shared typed recipe sheets; generous sans-serif titles and contributor-led rows make the collection feel collectively maintained.
4. **Kitchen timer:** appliance displays and tactile kitchen controls; one task at a time, large numerals and explicit state changes suit cooking but must avoid implying timed import accuracy.
5. **Produce crate index:** greengrocer labels and sorted produce bins; bold labels, grouped ingredients and compact index navigation prioritize retrieval without implying pantry stock.
6. **Family contact sheet:** annotated family-album contact sheets; source thumbnails and attribution support recognition without turning recipes into a social feed.
7. **Woven table setting:** restrained textile grids and contrasting edge bands; spatial grouping creates stable places for source, fields and action without decorative notebook imitation.

All candidates must preserve native controls, clear task state and accessible reading. They are proposals, not approved branding or design tokens.

## Required states and ranges

- Cookbook: empty; a few recipes; dense collection up to the plan limit; long titles; no dish photograph; favorites/search; drafts visibly separate from approved results; load failure and stale cache.
- Photo selection: 1-5 ordered images; preview/remove/reorder; permission denied; invalid media; quota/storage limit; unrelated recipes on one page requiring a closer source/manual entry.
- Upload: unfinished transfer remains distinct from accepted upload; interruption; processing; safe leave/return only after upload; failed processing retains source and offers retry/manual editing.
- Review: visible source and editable fields; unknown quantities and servings; unreadable text; attribution separate from uploader/editor; concurrent edit conflict; explicit Save recipe. No inferred temperature, time or unit conversion.
- Approved recipe: clear saved state, source access, portions only when known, ingredients, steps and cooking/shopping actions. Do not add invented food photography or numerical model confidence.

## Constraints

Desktop comparison uses two panes; compact screens provide a reachable Source/Draft switch while retaining edit position. Keyboard order follows the task. Status and uncertainty use text and iconography as well as color. iOS uses native navigation and 44pt targets; Android uses Material navigation and 48dp targets. Enlarged text must reflow. Mockup text is English under project artifact rules; eventual Polish localization must be checked explicitly. Synthetic content must be labeled. Do not transmit the private evaluation sources to image generation.

## Pending

The developer selected the green Familiar recipe app direction and requested the four-screen flow on mobile and desktop, explicitly without implementation. The [review packet](green-flow/README.md) contains eight proposals and the interaction/state brief. Final composition approval remains separate from direction approval. No feature code, production assets, final DESIGN.md or task completion is authorized by a mockup choice.

## First direction round

The Impeccable context launcher initially failed because its engine cache was not writable. Product context was read directly. The concept command subsequently ran with a temporary writable engine location; context was not rerun. Seed `1be86054` assigned grounded candidate 7, Woven table setting. The [decision payload](../../.impeccable/mocks/decision/options.json) records the assigned Woven work surface, the Archive register pick, all six declined challengers with explicit reasons and retained disciplines, and the conventional Familiar recipe app alternative. The developer subsequently selected the green Familiar recipe app direction in chat.

Three generated portrait review-screen proposals are stored with exact prompts, embedded prompt metadata and unapproved sidecars:

- [Woven work surface](../../.impeccable/mocks/decision/assigned.png)
- [Archive register](../../.impeccable/mocks/decision/model-pick.png)
- [Familiar recipe app](../../.impeccable/mocks/decision/canon.png)

Visual inspection confirms the intended review task, preserved fractions, source access, missing-amount message and explicit Save action in all three. These are direction studies, not complete screen specifications: attribution, servings, notes, title editing, the expanded source view, keyboard behavior, enlarged text, dark appearance and error/conflict states remain part of the full-flow work after selection. The source thumbnails and recipe are synthetic. No private photo or audio was passed to the image generator. Generated pixels do not establish contrast, target size, accessibility or native-runtime conformance.

The local decision page uses Impeccable's stock `Build this` label; in this project, selecting it approves only the visual direction for further mockups. It does not authorize application implementation. The final shape brief still requires confirmation. Both mobile OS adaptations and the desktop comparison remain to be designed after the direction choice.
