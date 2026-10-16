# Shared shopping study

Date: 2026-10-16. Status: static proposals awaiting review. This packet continues the Smakopas v4 direction across desktop web, mobile web, iPhone, iPad and Android phone. It covers one shared shopping list and the confirmation of recipe additions. It does not approve a complete visual system or authorize application implementation. The [MVP specification](../../family-cookbook-mvp/spec.md), especially sections 4 and 5, remains authoritative.

## Deliverables and visual continuity

Fourteen artboards comprise five main list views, five confirmation views, three offline views and one updated-item view. Main views and supplemental states belong in separate galleries so alternatives are not mistaken for one sequential flow. Every artboard has an SVG and a PNG exported at 2x.

| Surface | States | Logical size | PNG size |
| --- | --- | --- | --- |
| Desktop web | Main list, confirmation, updated item | 1440 x 1000 each | 2880 x 2000 each |
| Mobile web | Main list | 390 x 1000 | 780 x 2000 |
| Mobile web | Confirmation, offline | 390 x 1100 each | 780 x 2200 each |
| iPhone | Main list, confirmation, offline | 393 x 852 each | 786 x 1704 each |
| iPad landscape | Main list, confirmation | 1194 x 834 each | 2388 x 1668 each |
| Android phone | Main list, confirmation, offline | 412 x 915 each | 824 x 1830 each |

Shopping is an Operate surface: readable quantities, clear checks, compact origin information and restrained rules take priority over imagery. There are no dish photographs in this packet. Archivo, white surfaces, ink, muted text and the restrained teal accent preserve the preceding studies. The existing [web](../smakopas-web-v4/design-brief.md), [Apple](../smakopas-native-v4/design-brief.md) and [Android](../smakopas-android-v4/design-brief.md) briefs document that continuity.

Archivo supplies content across platforms and web controls. SF Pro Text supplies Apple chrome and controls; Roboto Variable supplies Android chrome and controls. Apple glass is a static projection restricted to navigation and controls, above opaque list content. Android uses opaque Material surfaces and recognizable checkboxes. The iPad receives an explicit landscape composition rather than an enlarged phone view.

Cookbook, Assistant and Shopping remain the three destinations. Shopping is selected in the main list. Confirming ingredients is a focused subflow, not a fourth destination. Native controls and navigation are intended platform behavior represented by drawings, not implemented components.

## Single scenario and source material

[scenario.json](source/scenario.json) is the source of truth for quantities, contributions, selection counts and state relationships. The artwork is labeled `Synthetic shopping demo`. Manual entries and exclusion choices are authored scenario data; they are not evidence of real household use or actual pantry stock.

Family pancakes continues the [synthetic capture source](../smakopas-web-v4/capture-brief.md): `2½ cups flour`, `2 eggs`, `250 ml milk` and `salt`. The serving count and salt amount remain unknown. The recipe is assumed to have been explicitly reviewed and saved before this shopping flow. It uses its original quantities without scaling. Anna remains the fictional recipe author in the source record; no new attribution, cooking time, temperature or family history is introduced.

Shakshuka continues the existing [web recipe fixture](../smakopas-web-v4/source/render-artboards.cjs), with 2 servings, 4 eggs and 400 g chopped tomatoes. Its other eight ingredients were excluded in an earlier synthetic confirmation. These existing demo-recipe facts do not become facts about Family pancakes. The manual entries are 500 ml milk, 250 g flour and 1 loaf of bread.

## Main list and arithmetic

The main list follows explicit confirmation of the Family pancakes addition. It contains six rows: five to buy and one checked. Known equivalents with compatible units merge; the two flour measurements remain separate without an unsupported cups-to-grams conversion.

| Item | Displayed amount | Preserved contributions | State |
| --- | --- | --- | --- |
| Eggs | 6 | Shakshuka, 2 servings: 4; Family pancakes, original quantities: 2 | To buy |
| Milk | 750 ml | Family pancakes: 250 ml; manual item: 500 ml | To buy |
| Flour | 2½ cups | Family pancakes | To buy |
| Flour | 250 g | Manual item | To buy |
| Bread | 1 loaf | Manual item | To buy |
| Chopped tomatoes | 400 g | Shakshuka, 2 servings | Checked |

Origins describe recipe and manual contributions to each shopping row. They are distinct from original photographs or audio sources. Expanded contribution information must preserve the amounts and selected servings behind an aggregate. A confirmed recipe addition snapshots the recipe and serving count; later recipe edits do not alter that addition. Changing portions requires removal of the relevant recipe contribution and a new confirmed addition. Removing a contribution preserves the other recipe and manual contributions.

Replaying the same confirmation must not duplicate its results. A deliberate new addition represents another cooking occasion. These are product requirements, not behavior demonstrated by the static artwork.

## Confirmation before the main list

The confirmation state precedes the main list. The existing list has five rows: Shakshuka eggs and checked tomatoes, plus the three manual entries. It reviews Family pancakes alone, using original quantities because servings are not specified.

| Ingredient | Choice | Effect after confirmation |
| --- | --- | --- |
| Flour, 2½ cups | Selected | Add one separate row; retain the manual 250 g flour row |
| Eggs, 2 | Selected | Update 4 to 6 |
| Milk, 250 ml | Selected | Update 500 ml to 750 ml |
| Salt, Not specified | Excluded: already at home | No shopping change; amount remains unknown |

Three selected ingredients create one row and update two rows, producing six total rows. The exclusion of salt is an explicit synthetic user choice, not an inferred pantry fact. Salt must remain visibly unknown in this review; exclusion does not resolve its quantity. Unknown servings keep scaling unavailable. Only the final confirmation applies the proposed additions; entering the flow or changing a checkbox does not write to the shared list.

## Offline and updated-item alternatives

The offline view is an alternative state after the main list. Eggs and Bread have been checked locally and are pending. Chopped tomatoes was already checked. The result is three to buy, three checked and two changes waiting to sync. Pending labels distinguish locally saved intent from confirmed synchronization; checkbox appearance alone does not communicate that difference.

Only check and uncheck of existing cached items works offline. Creation, deletion, quantity edits, recipe additions, clearing checked items and AI require connectivity. Pending status follows durable local storage, with storage failure exposed rather than claimed as success. Native pending state must survive restart. Web offline use is limited to the already-loaded app; offline first loading and cold start are excluded.

Sync occurs on connectivity return while active, list focus or manual retry. There is no promise of background sync while the app is closed. Operations preserve their identity and observed item revision; pending intent cannot silently overwrite a newer accepted change. Expiry alone does not reject pending checks: Archive still permits checking existing items, while additions and edits require renewed access.

The desktop updated-item view is a separate online alternative, not a continuation of the depicted offline example. The server has removed the Family pancakes milk contribution of 250 ml, leaving the manual 500 ml contribution unchecked. A pending check based on the previous 750 ml item is rejected. The non-blocking notice explains: `Milk changed to 500 ml. Your pending check was not applied. Review the updated item.` The refreshed server value remains, and the user may act again. The rejected intention is not automatically reapplied.

Deleted items and operations against a replaced list must not recreate removed data. A deleted-item view is not separately illustrated in this packet. Same-state results with unchanged content may refresh quietly. Revoked membership or account deletion prevents further uploads. Static artboards do not verify these protocol rules.

## Affordances and incomplete flows

Adding a manual item remains distinct from adding recipe ingredients. The visible `From recipes` action enters recipe selection and then the depicted confirmation; the intermediate picker is not separately drawn. Manual input, quantity editing, contribution removal and the complete deleted-item flow are not fully mocked. Their presence as an affordance does not imply a completed interaction design or implementation.

Clearing checked items is explicit and online. The list affordance opens a confirmation before removal; it does not automatically clear items when pressed, when they are checked or when synchronization completes. The confirmation dialog for that action is outside the depicted states.

Loading, empty-list, request-failure, durable-storage-failure, lost-response and revoked-access states still require design and functional validation. Failed mutations must never appear as confirmed success. No task or acceptance gate is completed by drawing these states.

## Reference use and validation boundary

The [previous Apple reference](../smakopas-native-v4/apple-reference.md) supplies the established navigation, materials and accessibility rationale. The [previous Android reference](../smakopas-android-v4/material-reference.md) supplies Material navigation, typography, insets and touch-target rationale. These are reused research records; this brief does not assert newly verified content from JavaScript-only Apple guideline pages.

Google's [Checkbox documentation](https://developer.android.com/develop/ui/compose/components/checkbox), checked on 2026-10-16, describes unselected, selected and indeterminate states and the use of checkboxes for independent selections. This study uses selected and unselected item states; synchronization pending is separate supporting information, not an indeterminate checkbox state. This is a design application of the documentation, not evidence of native Compose controls.

The renderer creates static SVG and PNG artwork only. The [visual review](visual-review.md) records static inspection; user approval remains pending. Intended control sizes and drawn materials establish neither working hit areas nor accessible semantics. Validate keyboard use, focus, labels, status announcements, zoom and responsive reflow on web; Dynamic Type, VoiceOver, TalkBack, font/display scaling, real insets and navigation on native devices. Polish localization, longer labels, Dark Mode and reduced-transparency/motion preferences require later checks.

T03 physical-device durability and T09 capture-fidelity/evaluation gaps remain open and unchanged. Neither readiness gate has passed. No feature development, production resource provisioning or release is authorized by this packet.
