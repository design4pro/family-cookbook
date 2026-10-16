# Asset and scenario provenance

Date: 2026-10-16. This record covers the static shopping study for web, iPhone, iPad and Android phone. The primary visual reference remains the developer-supplied Smakopas project at `/Users/rafalwolak/dev/cloudflare/smakopas.pl-old/apps/review/`, documented in the [reference analysis](../smakopas-reference-analysis.md). This packet continues the [web](../smakopas-web-v4/credits.md), [Apple](../smakopas-native-v4/credits.md) and [Android](../smakopas-android-v4/credits.md) v4 studies.

## Typography

[Archivo](assets/archivo-latin.woff2) and its [SIL Open Font License](assets/archivo-license.txt) continue the web v4 assets. The original font was copied from the supplied Smakopas build and its license from the corresponding installed font package, as recorded in [web v4 credits](../smakopas-web-v4/credits.md). Archivo supplies the shopping content across platforms and web controls. Only the Latin subset is included for these English artwork files; this is not a complete Polish production font bundle.

SF Pro Text supplies Apple navigation, controls and supporting labels using the locally installed font under `/Library/Fonts`. Its font files are not bundled or embedded. SVG labels require the local font when rendered; exported PNGs preserve the rendered appearance. SF Pro Text is not used as Android chrome.

[Roboto Variable](assets/roboto-variable.ttf) and its [SIL Open Font License](assets/roboto-license.txt) are copied from the Android v4 packet for Android navigation, controls and supporting labels. The original download came from the official [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/roboto). Exact upstream download URLs and checksums remain in the [Android v4 download record](../smakopas-android-v4/source/downloads.json).

## Platform symbols

Apple icons are actual SF Symbols exported through AppKit's `NSImage(systemSymbolName:)` by [export-symbols.swift](source/export-symbols.swift). The export script defines 27 symbols in four color variants, producing a 108-variant working set; this packet retains only the 10 variants used by its artboards, listed in [used-assets.json](source/used-assets.json). These assets belong to the static Apple-platform proposal; they are not a cross-platform icon library or proof of native controls.

Android icons are actual Material Symbols Outlined SVGs copied from the 21-icon Android v4 inventory. Their original source is Google's [material-design-icons repository](https://github.com/google/material-design-icons), with the included [Apache 2.0 license](assets/material-symbols-license.txt). The [Android v4 download record](../smakopas-android-v4/source/downloads.json) retains exact upstream URLs and checksums, and its [used-icon record](../smakopas-android-v4/source/used-icons.json) identifies that source set. The shopping packet retains the 10 Material Symbols used by its artboards, listed in [used-assets.json](source/used-assets.json).

Checkbox outlines, selection indicators, separators and interface surfaces are static drawing geometry. Platform icon assets do not provide interaction or accessibility semantics by themselves. The Apple glass treatment is an illustration, not operating-system material rendering.

## Recipe and shopping data

[scenario.json](source/scenario.json) is authored synthetic scenario data and the single source of truth for this packet. The six-row shopping list, confirmation choices, manual entries and offline/updated alternatives are demonstrations, not real family data, pantry observations, product metrics or synchronization evidence.

Family pancakes inherits the existing [synthetic source pages](../smakopas-web-v4/capture-brief.md): 2½ cups flour, 2 eggs, 250 ml milk and salt. The salt quantity and serving count remain unspecified. Anna is the fictional source author; Alex is the separate fictional uploader/editor in the preceding capture study. This shopping packet introduces no additional source facts or family history.

Shakshuka inherits the [web v4 recipe fixture](../smakopas-web-v4/source/render-artboards.cjs): 2 servings, including 4 eggs and 400 g chopped tomatoes. The original demo-recipe text derives from `apps/web/dist/server/assets/recipes-CH5gWcyu.js` in the supplied Smakopas reference, as documented in [web v4 credits](../smakopas-web-v4/credits.md). The shopping scenario explicitly excludes its other eight ingredients in an earlier synthetic confirmation.

The manual 500 ml milk, 250 g flour and 1 loaf of bread are newly authored scenario entries. Excluding salt as already at home is also a synthetic user choice. These additions are not attributed to either recipe source. The Milk 750 ml to 500 ml update is an alternative scenario in which the 250 ml recipe contribution was removed, leaving the manual contribution intact.

## Research and artwork limits

Navigation and material rationale reuse the earlier [Apple](../smakopas-native-v4/apple-reference.md) and [Android](../smakopas-android-v4/material-reference.md) reference records. Google's [Checkbox documentation](https://developer.android.com/develop/ui/compose/components/checkbox) was read on 2026-10-16 to verify selection-state terminology. No new claim is based on inaccessible Apple guideline content.

The packet contains no food photography, new recipe-source imagery or private photograph/audio. No image-generation model was used for these authored interface drawings or data. Static SVG geometry, local fonts and platform symbol assets are composed into artwork; they do not create application screens, network operations, native controls or an interactive prototype.

The [visual review](visual-review.md) records the bounded static inspection. Asset provenance does not establish design approval, accessibility compliance, functional synchronization, native-device persistence or capture accuracy. T03, T09 and both readiness gates retain their existing status.
