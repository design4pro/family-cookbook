# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

Responsive web, iOS and Android. Shared product behavior, with platform-appropriate navigation, controls, text scaling and input. Desktop review compares source and fields side by side; mobile switches between them.

## Users

Polish-speaking households, initially ten pilot families. The primary user organizes family recipes and uses them for everyday cooking. Each household has up to five people with individual accounts. Administrator, payer, contributor and family attribution are distinct concepts.

## Product Purpose

Preserve recipes from photographs, spoken explanations and text, then make human-reviewed recipes useful for cooking and shared shopping. Successful capture ends with explicit human approval of a recipe compared against its unchanged original.

## Positioning

The original source, machine-generated draft and approved family recipe stay distinct. Assistance must preserve original wording and measurements, expose uncertainty, and never silently add missing facts or rewrite the family original.

## Operating Context

Recipes are collected at home, checked against photographs or recordings, read while cooking and used to prepare a shared shopping list. Offline behavior is deliberately limited: shopping checks can queue locally; downloaded native recipes can be read. New uploads, edits and AI need connectivity. No background-sync promise.

## Capabilities and Constraints

The authoritative product contract is [the MVP specification](docs/family-cookbook-mvp/spec.md); [the task register](docs/family-cookbook-mvp/implementation/todo.md) owns execution status. Do not duplicate quota or billing tables here.

- Main destinations: Cookbook, Assistant, Shopping. Add Recipe is an action inside Cookbook; profile leads to household/account settings.
- One import creates one draft from up to five ordered images. No automatic multi-recipe page splitting or bulk notebook import.
- Human review can retain explicitly unknown quantities or servings. Unflagged fields are not guaranteed correct. Unknown servings prevent scaling.
- All members may review and edit with revision conflict protection. Sources remain unchanged.
- Polar is the sole purchase channel on web; native consumes backend-verified access without checkout promotion.
- Existing implementation and proof code are preserved. Current authorization covers design preparation, not further feature implementation.
- T03 physical-device durability and T09 capture-fidelity/evaluation gaps remain open. Neither readiness gate has passed. Mockups cannot close them.

## Brand Commitments

Family Cookbook is a working name. No approved logo, final brand, domain or store identifier. The current proof interfaces are functional test surfaces, not an approved visual identity. Repository artifacts and design-file contents use English; the pilot product requires Polish localization, including layout validation with Polish labels.

## Evidence on Hand

The specification, resolved Wayfinder decisions and [proof reports](docs/evidence/) are available. Private consented source photos and audio live in ignored `tests/assets/`; the recorded consent covers Cloudflare processing and does not authorize passing these files to image-generation services. Design mockups should use clearly labeled synthetic sample material. Do not invent testimonials, usage metrics, model accuracy or real-family evidence.

## Product Principles

- Keep the family source available and unaltered.
- Separate proposed interpretation from human approval.
- Make missing information and pending work understandable.
- Keep cooking and shopping practical across devices.
- Preserve independent contributions and distinguish administration from payment.

## Accessibility & Inclusion

WCAG 2.2 accessibility is required. Plan keyboard and screen-reader operation on web; native text scaling, OS navigation and reduced-motion preferences; sufficient contrast; labeled uncertainty beyond color; and reachable touch controls. Core tasks must not require voice. Visual mockups express intended behavior but do not establish accessibility compliance.
