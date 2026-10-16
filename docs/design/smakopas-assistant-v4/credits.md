# Asset and scenario provenance

Date: 2026-10-16. This record covers the static assistant study for desktop web, mobile web, iPhone, iPad and Android phone. The visual reference remains the developer-supplied Smakopas project at `/Users/rafalwolak/dev/cloudflare/smakopas.pl-old/apps/review/`, documented in the [reference analysis](../smakopas-reference-analysis.md). The packet continues the preceding [web](../smakopas-web-v4/credits.md), [Apple](../smakopas-native-v4/credits.md), [Android](../smakopas-android-v4/credits.md) and [shopping](../smakopas-shopping-v4/credits.md) studies.

## Typography

[Archivo](assets/archivo-latin.woff2) and its [SIL Open Font License](assets/archivo-license.txt) continue the shopping/web assets. The original font was copied from the supplied Smakopas build; its license came from the corresponding installed font package, as recorded in [web v4 credits](../smakopas-web-v4/credits.md). Archivo supplies reading content across platforms and web controls. The included Latin subset is sufficient for these English design artifacts; it is not a complete production font bundle for Polish localization.

SF Pro Text supplies Apple chrome from the locally installed font under `/Library/Fonts`. Its font files are not copied or embedded. SVG labels depend on the local font at rendering time; PNG exports preserve the rendered appearance. SF Pro Text is not used for Android chrome.

[Roboto Variable](assets/roboto-variable.ttf) and its [SIL Open Font License](assets/roboto-license.txt) continue the shopping/Android assets and supply Android chrome. The original download came from the official [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/roboto). Exact upstream URLs and checksums remain in the [Android download record](../smakopas-android-v4/source/downloads.json).

## Platform symbols and surfaces

Apple icons are actual SF Symbols exported through AppKit's `NSImage(systemSymbolName:)` by [export-symbols.swift](source/export-symbols.swift). The exporter defines 27 symbols in four color variants, a 108-variant working set. The packet retains the 12 used variants listed in [used-assets.json](source/used-assets.json); the retained set belongs only to this static Apple-platform proposal. The symbols do not implement native interaction or constitute a cross-platform icon library.

Android icons are Material Symbols Outlined SVGs copied from the Android v4 inventory. Their original source is Google's [material-design-icons repository](https://github.com/google/material-design-icons), with the included [Apache 2.0 license](assets/material-symbols-license.txt). The [Android download record](../smakopas-android-v4/source/downloads.json) preserves upstream URLs and checksums, and its [used-icon record](../smakopas-android-v4/source/used-icons.json) identifies that source set. The packet retains the 11 used icons listed in [used-assets.json](source/used-assets.json).

Interface surfaces, rules, input outlines and selection treatments are authored static geometry. The Apple glass treatment illustrates intended material placement; it is not operating-system Liquid Glass rendering. Android surfaces illustrate the intended Material treatment rather than proving native components, dynamic color or accessibility semantics.

## Recipe and assistant data

[scenario.json](source/scenario.json) is authored synthetic scenario data. Its questions, assistant responses, source reference, meal suggestion, no-match result, allowance state and request error are illustrative fixtures. These answers were not retrieved from a running application or evaluated assistant model, and they are not evaluation evidence.

Family pancakes inherits the existing [synthetic capture source](../smakopas-web-v4/capture-brief.md): 2½ cups flour, 2 eggs, 250 ml milk and salt; `Mix the ingredients.` and `Cook in a pan.` The salt quantity, serving count, cooking duration and temperature are unspecified. Anna is the fictional recipe author. Alex is the separate fictional uploader/editor established in the capture study. This packet adds no new source facts or family history.

The scenario assumes this fictional recipe was explicitly approved and saved. The cited recipe is therefore available as an approved fixture, not evidence of actual human approval, authorization enforcement or a real household conversation. The source references point to the demonstrated recipe and its stated sections; they are not fabricated external publications.

Flour, Eggs and Milk form the temporary ingredient list. That list records neither inventory quantities nor durable pantry ownership. Salt being absent from it does not establish actual stock. The no-match example with Chickpeas, Coconut milk and Rice is a separate synthetic retrieval outcome; no exhaustive analysis of all earlier demo recipes was performed or implied.

## Research and artwork limits

Navigation, material and control rationale reuse the existing [Apple reference](../smakopas-native-v4/apple-reference.md) and [Android reference](../smakopas-android-v4/material-reference.md). These are prior research records. This packet makes no newly verified claim from inaccessible Apple or Material guideline pages.

No food photography, private recipe photograph, recording or new source-page imagery is included. No image-generation model was used. Assistant responses are authored fixture copy rather than results from the proposed application's model. Static SVG geometry, fonts and platform symbols are composed into drawings; they do not create an application, interactive prototype, native controls, model requests or shopping writes.

The [visual review](visual-review.md) records static inspection; user approval remains pending. Provenance establishes where assets and authored examples came from; it does not establish visual approval, accessibility compliance, factual-retrieval quality, authorization correctness or functional behavior. T03, T09 and both readiness gates retain their existing status.
