# Asset provenance

The primary visual reference is the developer-supplied Smakopas design at `/Users/rafalwolak/dev/cloudflare/smakopas.pl-old/apps/review/`, documented in the [reference analysis](../smakopas-reference-analysis.md). This native study continues [web v4](../smakopas-web-v4/README.md).

## Typography and symbols

Archivo and its [SIL Open Font License](assets/archivo-license.txt) are copied unchanged from web v4. Archivo supplies titles and recipe content. Only the Latin subset is included for these English design artifacts.

SF Pro Text is rendered from the locally installed font under `/Library/Fonts`. Its font files are neither copied nor embedded. SVG labels require the font at render time; PNGs retain the actual rendered result.

The monochrome icons are actual SF Symbols, exported using AppKit's `NSImage(systemSymbolName:)` through [export-symbols.swift](source/export-symbols.swift). Only variants used by these Apple-platform studies are retained. The [symbol inventory](source/used-symbols.json) and [origin note](source/symbols-origin.txt) document these assets. They are part of the static Apple interface proposal, not a general cross-platform icon library.

## Photography

The existing-recipe photographs are copied unchanged from the [web asset record](../smakopas-web-v4/credits.md): Shakshuka by Alex Bayev, Greek salad by william wallace and Tomato soup by Ella Olsson. That record links to the source pages and describes its attribution-verification limits. Existing source notes remain embedded in each JPEG. These public demo images do not become covers for the imported recipe.

## Synthetic originals

[Page 1](assets/sample-page-01.png) and [page 2](assets/sample-page-02.png) are byte-identical copies of the web study's authored synthetic originals. They are visibly labeled, retain their full proportions and are not private photographs or model outputs. The original editable vectors and origin note remain in [web v4](../smakopas-web-v4/credits.md).

The fictional author Anna is distinct from the fictional uploader/editor Alex. No private source photograph or audio recording was used or transmitted. No image-generation model was used for the artwork, symbols or original pages.

## Export metadata

The [native origin note](source/native-origin.txt) is embedded in each artboard PNG. The [overview origin note](source/overview-origin.txt) identifies the two contact sheets as arrangements of the same artboards. The manifest records hashes and dimensions after metadata embedding.
