# Culinary assistant study

Date: 2026-10-16. Status: static proposals visually inspected and awaiting user review. This packet extends the Smakopas v4 studies to Assistant on desktop web, mobile web, iPhone, iPad and Android phone. It does not approve a complete visual system or authorize application implementation. The [MVP specification](../../family-cookbook-mvp/spec.md), especially sections 2, 4 and 5, and [PRODUCT.md](../../../PRODUCT.md) remain authoritative.

## Deliverables and visual continuity

Eighteen static artboards comprise three primary states on five surfaces and three supplemental states. Each artboard is an editable SVG with a PNG export at 2x. Supplemental states are alternatives, not consecutive steps in one conversation.

| Surface | Primary states | Supplemental state | Logical size |
| --- | --- | --- | --- |
| Desktop web | Start, sourced answer, meal suggestion | None | 1440 x 1000 |
| Mobile web | Start, sourced answer, meal suggestion | No match | 390 wide, 1000-1200 high |
| iPhone | Start, sourced answer, meal suggestion | Assistant allowance reached | 393 x 852 |
| iPad landscape | Start, sourced answer, meal suggestion | None | 1194 x 834 |
| Android phone | Start, sourced answer, meal suggestion | Answer request failed | 412 x 915 |

The visual basis is the inspected [Smakopas reference](../smakopas-reference-analysis.md) and preceding [web](../smakopas-web-v4/design-brief.md), [Apple](../smakopas-native-v4/design-brief.md), [Android](../smakopas-android-v4/design-brief.md) and [shopping](../smakopas-shopping-v4/design-brief.md) studies. Archivo, white reading surfaces, strong headings, restrained rules and the teal accent continue that direction. Content and its sources take priority over decorative chatbot imagery or invented recipe photography.

Archivo supplies content and web controls. SF Pro Text supplies Apple chrome; Roboto Variable supplies Android chrome. Apple Liquid Glass is a static visual projection restricted to navigation and controls. Answers, recipe facts and source references remain on opaque reading surfaces. Android uses opaque Material surfaces and recognizable controls rather than Apple glass. The iPad has a landscape composition designed for its available space, not a scaled phone screen.

Cookbook, Assistant and Shopping remain the three main destinations. Assistant is selected in this packet. Recipe scope and ingredient input are controls within that destination, not new global tabs.

## Shared scenario and evidence boundary

[scenario.json](source/scenario.json) is the authored source of truth. The artwork is labeled `Synthetic assistant demo` or `Synthetic demo`. Questions, assistant responses, retrieval outcomes and entitlement/error states are synthetic fixtures, not outputs from a live model or evidence of retrieval accuracy.

Family pancakes continues the two [synthetic capture pages](../smakopas-web-v4/capture-brief.md): `2½ cups flour`, `2 eggs`, `250 ml milk` and `salt`; the method is `Mix the ingredients.` followed by `Cook in a pan.` The recipe is assumed to have been explicitly approved and saved before these conversations. That is a scenario precondition, not a claim that an actual household approved the source. Anna is the fictional source author; the earlier capture flow identifies Alex separately as uploader/editor.

Salt quantity, servings, cooking time and temperature remain unspecified. This packet supplies no additional recipe facts, family history or author attribution. Unknown servings prevent automatic portion scaling.

## Start and conversation scope

Start visibly identifies `Whole cookbook`, offers typed questions and distinguishes asking about a recipe from cooking with a short list of ingredients. The selected-recipe answer visibly identifies `Family pancakes`. Scope must remain apparent when entering or continuing a question; switching scope must not silently make facts from another recipe appear relevant.

Personal conversations are not automatically shared with the household. `Not shared with your household` describes the depicted personal conversation, not a claim that the selected recipe is private from other authorized household members. Recipe facts are retrieved only from a bounded set of approved recipes the current user may access.

Assistant has no microphone in MVP. Dictating a recipe is a separate capture flow. These screens neither offer voice conversation nor imply offline AI, background answer delivery or a persistent pantry.

## Sourced answer and missing information

The user asks: `How much flour, and how long do I cook them?` The response preserves the source fraction: `Use 2½ cups of flour. [1]` It then states that the recipe provides no cooking time and quotes its method: `Cook in a pan.` The reference resolves visibly to `Family pancakes · Ingredients and method`.

The source link opens the saved recipe and its provenance path; it is not a fabricated external citation or a confidence score. The composition separates the user question, factual response, absent information and cited recipe. It does not treat missing source information as a failed request or silently estimate a duration, heat setting or temperature.

`Ask for general guidance` starts a separate explicit request. General advice or substitutions would need an `AI suggestion` label and must not be attributed to the original cook or saved into the recipe automatically. This packet does not depict a general-advice response.

## Meal suggestion and shopping boundary

The temporary ingredient list contains Flour, Eggs and Milk. The question is `What can I make with flour, eggs and milk?` One matching saved recipe, Family pancakes, is shown. The contract allows up to three suggestions; this study does not invent additional recipes to fill a quota.

The recipe retains its original amounts: 2½ cups flour, 2 eggs and 250 ml milk. Salt is identified as absent from the temporary list and its amount remains unspecified. Absence from this list does not prove that the household lacks salt. Presence of flour, eggs or milk does not prove adequate stock. The quantity reminder makes this distinction explicit, and `Original amounts · Servings not specified` prevents an invented portion count.

`Review shopping additions` prepares a proposal. It does not directly mutate the household list or automatically exclude listed ingredients from purchases. A separate review allows the user to inspect ingredients, exclude products they already have and explicitly confirm additions, continuing the [shopping study](../smakopas-shopping-v4/design-brief.md). Known compatible quantities use deterministic arithmetic; unknown amounts stay unknown. No shopping confirmation behavior is implemented here.

## Supplemental states

The mobile-web no-match alternative uses Chickpeas, Coconut milk and Rice. It reports no matching saved recipe and offers changing the ingredients, browsing the cookbook and adding a recipe. This is an independent synthetic retrieval result, not a claim that every recipe in earlier artwork was exhaustively evaluated. No invented family recipe or unsolicited general cooking advice replaces the absent result.

The iPhone allowance state reports `Assistant allowance reached` while preserving access to the cookbook and shopping. It invents no remaining balance, reset date or checkout entitlement. It does not promote a native purchase. Exhaustion of the assistant allowance must not disable unrelated available functions.

The Android error alternative retains the typed question in Family pancakes scope and offers retry. A failed request is not shown as a successful answer or a missing fact in the recipe. This image does not demonstrate retry accounting, persistence or network recovery.

## Remaining states and validation

Empty cookbook, loading and cancellation still require detailed design. The single quota and request-failure examples do not complete quota recovery or every model/network failure. Offline behavior must explain that AI needs connectivity while preserving permitted reading and shopping functions. Scope selection, keyboard-open composition, source opening, conversation navigation and transitions between states are not fully specified by these static images.

The established [Apple reference](../smakopas-native-v4/apple-reference.md) and [Android reference](../smakopas-android-v4/material-reference.md) supply the prior navigation, materials, typography and accessibility research. No new claim is based on inaccessible guideline pages. The proposed geometry and symbol assets are not evidence of native controls or platform behavior.

The [visual review](visual-review.md) records the bounded inspection and correction verdict. Later implementation must validate focus and keyboard order, labeled inputs and source links, status announcements, readable line lengths, responsive reflow and zoom on web; Dynamic Type, VoiceOver, TalkBack, real keyboard/system insets and navigation on native devices. Polish labels, larger text, Dark Mode and reduced transparency/motion need separate validation. Static images do not establish WCAG compliance or accessible hit areas.

T03 physical-device durability and T09 capture-fidelity/evaluation gaps remain open with their existing blockers. Neither readiness gate changes. This packet authorizes no feature development, resource provisioning, model request, production release or store submission.
