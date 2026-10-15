# Capture flow design discovery

Status: scope confirmed; visual direction pending. Design preparation only.

## Confirmed scope

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

Select a visual direction before preparing the complete flow. This discovery record is not the final confirmed shape brief or a direction contract. No feature code, production assets, final DESIGN.md or task completion is authorized by a mockup choice.

## First direction round

The Impeccable context launcher initially failed because its engine cache was not writable. Product context was read directly. The concept command subsequently ran with a temporary writable engine location; context was not rerun. Seed `1be86054` assigned grounded candidate 7, Woven table setting. The [decision payload](../../.impeccable/mocks/decision/options.json) records the assigned Woven work surface, the Archive register pick, all six declined challengers with explicit reasons and retained disciplines, and the conventional Familiar recipe app alternative. No direction has been approved.

Three generated portrait review-screen proposals are stored with exact prompts, embedded prompt metadata and unapproved sidecars:

- [Woven work surface](../../.impeccable/mocks/decision/assigned.png)
- [Archive register](../../.impeccable/mocks/decision/model-pick.png)
- [Familiar recipe app](../../.impeccable/mocks/decision/canon.png)

Visual inspection confirms the intended review task, preserved fractions, source access, missing-amount message and explicit Save action in all three. These are direction studies, not complete screen specifications: attribution, servings, notes, title editing, the expanded source view, keyboard behavior, enlarged text, dark appearance and error/conflict states remain part of the full-flow work after selection. The source thumbnails and recipe are synthetic. No private photo or audio was passed to the image generator. Generated pixels do not establish contrast, target size, accessibility or native-runtime conformance.

The local decision page uses Impeccable's stock `Build this` label; in this project, selecting it approves only the visual direction for further mockups. It does not authorize application implementation. The final shape brief still requires confirmation. Both mobile OS adaptations and the desktop comparison remain to be designed after the direction choice.
