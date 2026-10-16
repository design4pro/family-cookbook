# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

Responsive web, iOS and Android. Shared product behavior, with platform-appropriate navigation, controls, text scaling and input. Desktop review compares source and fields side by side; mobile switches between them.

## Users

Polish-speaking households, initially ten pilot families. The primary user organizes family recipes and uses them for everyday cooking. Each household has one private cookbook and up to five people with individual accounts. Each user belongs to only one active household in MVP. Administrator, payer, contributor and family attribution are distinct concepts.

## Product Purpose

Preserve recipes from photographs, spoken explanations and text, then make human-reviewed recipes useful for cooking and shared shopping. Successful capture ends with explicit human approval of a recipe compared against its unchanged original.

## Positioning

The original source, machine-generated draft and approved family recipe stay distinct. Assistance must preserve original wording and measurements, expose uncertainty, and never silently add missing facts or rewrite the family original.

## Operating Context

Recipes are collected at home, checked against photographs or recordings, read while cooking and used to prepare a shared shopping list. Offline behavior is deliberately limited: shopping checks can queue locally; downloaded native recipes can be read. New uploads, edits and AI need connectivity. No background-sync promise.

Native downloads and pending shopping checks must survive restart. Web offline checks are limited to the already-loaded app; web cold-start offline is excluded. Pending checks remain visibly distinct from confirmed synchronization; stale changes must not silently overwrite newer shared data.

## Capabilities and Constraints

The authoritative product contract is [the MVP specification](docs/family-cookbook-mvp/spec.md); [the task register](docs/family-cookbook-mvp/implementation/todo.md) owns execution status. Do not duplicate quota or billing tables here.

This root product record is shared by `apps/app` across web, iOS and Android; it is not a separate product contract for each platform.

- Main destinations: Cookbook, Assistant, Shopping. Add Recipe is an action inside Cookbook; profile leads to household/account settings.
- One import creates one draft from up to five ordered images. No automatic multi-recipe page splitting or bulk notebook import.
- Upload and processing are separate states. After upload, processing may continue while the user leaves the screen; extraction failure retains the source and offers retry or manual editing.
- Dictation is a separate capture flow: Record, Stop, Listen/re-record, Submit, Review, Save. Recordings are limited to five minutes; no background recording or continuous conversation.
- Human review can retain explicitly unknown quantities or servings. Unflagged fields are not guaranteed correct. Unknown servings prevent scaling.
- All members may review and edit with revision conflict protection. Sources remain unchanged.
- Assistant accepts typed questions about the cookbook or a visibly selected recipe. Factual answers cite authorized, approved recipes; absent facts stay explicit. General advice requires an explicit request and an AI-suggestion label. No microphone input to Assistant; personal conversations are not automatically shared.
- One shared active shopping list combines recipe contributions and manual items. Suggested additions require review and explicit confirmation. Quantities use deterministic arithmetic; unknown quantities and incompatible units are not silently merged. Added recipe contributions snapshot the recipe and servings rather than changing with later recipe edits.
- The card-free sample has quotas, no countdown and no automatic renewal. Manual corrections, cooking and shopping consume no AI allowance; exhaustion blocks only the affected function.
- Polar is the sole purchase channel on web; native consumes backend-verified access without checkout promotion.
- At verified subscription expiry, Archive preserves existing recipes, sources, search, cooking, downloads, export and shopping checks. New recipes/uploads, edits, AI and shopping additions require renewal. Deletion and export never require payment; hosting is not promised indefinitely.
- Leaving a household, deleting an account, transferring administration and replacing the payer are separate flows. Account deletion needs a precise contribution-aware preview; administration does not confer authorship of other members' content. The self-contained export includes originals, JSON and offline-readable HTML; a device cache is not an archival export.
- Existing implementation and proof code are preserved. Current authorization covers design preparation, not further feature implementation.
- T03 physical-device durability and T09 capture-fidelity/evaluation gaps remain open. Neither readiness gate has passed. Mockups cannot close them.

## Brand Commitments

Family Cookbook is a working name. No approved logo, final brand, domain or store identifier. The current proof interfaces are functional test surfaces, not an approved visual identity. Repository artifacts and design-file contents use English; the pilot product requires Polish localization, including layout validation with Polish labels.

On 2026-10-15 the developer initially selected the green Familiar recipe app direction, then rejected the first compositions, editorial/native v2 and editorial web v3 as amateurish. Web must feel like an editorial recipe blog/cookbook; iPhone/iPad must use native Liquid Glass elements. After the KUKBUK, Kulinarna Stolica Polski and Awwwards reference study, the developer supplied local Smakopas screenshots as the next concrete reference. The [Smakopas analysis](docs/design/smakopas-reference-analysis.md) records the inspected screens, verified build measurements and the correction in approach. Smakopas is a calibration reference, not approval of its branding, features or an implementation. `.impeccable/mocks/decision/canon.png`, [v2](docs/design/editorial-native-v2/README.md) and [v3](docs/design/editorial-web-v3/README.md) are rejected historical proposals, not current visual authority. Derive future studies from inspected geometry and explicit type roles; internal review does not establish visual approval.

The [Smakopas web v4 proposal](docs/design/smakopas-web-v4/README.md) contains four static Cookbook and Recipe mockups for desktop and mobile and awaits user review. It does not approve a visual system or authorize implementation.

On 2026-10-16 the developer requested Add photos and Review recipe studies in the same style. The [capture and review brief](docs/design/smakopas-web-v4/capture-brief.md) adds four main static desktop/mobile studies and an additional mobile Source-tab state, using labeled synthetic originals. This continues design preparation in Operate mode without approving the complete visual system or authorizing feature implementation.

The developer then requested the four-screen flow on iPhone and iPad. The [Smakopas native v4 packet](docs/design/smakopas-native-v4/README.md) contains eight main static mockups and two additional iPhone Review states, combining Smakopas typography with intended native controls and a static Liquid Glass projection. It awaits user review; no complete visual system or implementation is approved, and T03/T09 remain unchanged.

The subsequent [Android phone packet](docs/design/smakopas-android-v4/README.md) adapts the same four-screen flow to Material navigation, a creation FAB, tabs and outlined fields while retaining Archivo and the Smakopas composition. Two additional Review states expose the source and lower form. These static proposals await user review; feature implementation remains paused and T03/T09 are unchanged.

The [Smakopas shopping v4 packet](docs/design/smakopas-shopping-v4/README.md) extends the study to desktop web, mobile web, iPhone, iPad and Android phone with 14 static mockups: five main lists, five recipe-addition confirmations, three offline states and one updated-item state. A shared synthetic scenario preserves quantities, recipe/manual contributions, unknown servings and pending checks. The proposals await user review; no application behavior or complete visual system is approved. Feature implementation remains paused, and T03/T09 and both readiness gates are unchanged.

The [Smakopas assistant v4 packet](docs/design/smakopas-assistant-v4/README.md) continues the same visual world across desktop web, mobile web, iPhone, iPad and Android phone with 18 static mockups: Start, a sourced answer and an ingredient-based saved-recipe suggestion on each surface, plus no-match, allowance and request-error alternatives. The shared synthetic scenario keeps recipe scope visible, cites the saved recipe, preserves missing facts and distinguishes temporary ingredients from pantry stock. Shopping proposals require separate review and confirmation. The packet awaits user review; it creates no new DESIGN.md, approves no complete visual system and implements no application behavior. T03/T09 and both readiness gates remain unchanged.

The [Smakopas household v4 packet](docs/design/smakopas-household-v4/README.md) adds 24 static proposals across the same five surfaces: Household, Invitation created, Account and Join household on each, plus invitation creation, unavailable invitation, pending administration handover and member-removal confirmation. Its synthetic scenario separates administrator and payer, preserves the five-member limit and treats pending invitations as unreserved places. Invitation links are shared manually; account deletion remains a separate future preview flow. The packet continues the established style with Apple Liquid Glass and Android Material adaptations, awaits user review and introduces neither a new DESIGN.md nor implementation approval. T03/T09 and both readiness gates remain unchanged.

The [Smakopas onboarding v4 packet](docs/design/smakopas-onboarding-v4/README.md) adds 25 static screens and four overview sheets across desktop web, mobile web, iPhone, iPad and Android phone. It covers email entry, code verification, explicit household creation and the empty ready state, plus code errors, retained invitation context, request uncertainty and existing membership. The synthetic flow distinguishes authentication from membership and a card-free sample from a subscription; requesting a code does not prove delivery. It continues the established Smakopas, Apple Liquid Glass and Android Material direction, awaits user review and remains design only. No new DESIGN.md or implementation is approved; T03/T09 and both readiness gates remain unchanged.

The [Smakopas billing v4 packet](docs/design/smakopas-billing-v4/README.md) adds 28 static screens and four overview sheets for plans, allowances, subscriptions and Archive across the same five surfaces. Synthetic states distinguish consumed and reserved units, quota resets from billing dates, and renewal cancellation from expiry. Polar purchase and management remain web-only; native screens show status, limits and access refresh without checkout promotion. The packet retains the documented Smakopas typography and Apple Liquid Glass/Android Material adaptations, awaits user review and remains design only. No DESIGN.md or implementation approval is introduced; T03/T09 and both readiness gates remain unchanged.

Keep reading surfaces distinct from import/review work surfaces. Use glass for Apple navigation and controls, not recipe text or form content. Design iPad explicitly rather than scaling a phone layout. Editorial dish photography is a proposed option, not an approved new cover-upload or AI-image feature; designs must work with only original sources and typography. No decorative family stories or source facts may be invented to improve a composition.

## Evidence on Hand

The specification, resolved Wayfinder decisions and [proof reports](docs/evidence/) are available. Private consented source photos and audio live in ignored `tests/assets/`; the recorded consent covers Cloudflare processing and does not authorize passing these files to image-generation services. Design mockups should use clearly labeled synthetic sample material. Do not invent testimonials, usage metrics, model accuracy or real-family evidence.

## Product Principles

- Keep the family source available and unaltered.
- Separate proposed interpretation from human approval.
- Make missing information and pending work understandable.
- Keep cooking and shopping practical across devices.
- Preserve independent contributions and distinguish administration from payment.

## Accessibility & Inclusion

Core web journeys target WCAG 2.2 AA, verified through automated and manual checks. Plan keyboard and screen-reader operation on web; native text scaling, OS navigation and reduced-motion preferences; sufficient contrast; labeled uncertainty beyond color; and reachable touch controls. VoiceOver, TalkBack and large-text core flows must have no blocking issue. Core tasks must not require voice. Visual mockups express intended behavior but do not establish accessibility compliance.
