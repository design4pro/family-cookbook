# Asset provenance

Date: 2026-10-16. This record covers the static Android phone study. The primary visual reference is the developer-supplied Smakopas project at `/Users/rafalwolak/dev/cloudflare/smakopas.pl-old/apps/review/`, documented in the [reference analysis](../smakopas-reference-analysis.md). The packet continues [web v4](../smakopas-web-v4/credits.md) and the [native capture brief](../smakopas-native-v4/design-brief.md).

## Typography

[Archivo](assets/archivo-latin.woff2) and its [SIL Open Font License](assets/archivo-license.txt) are byte-identical copies of the web v4 assets. The original font came from the supplied Smakopas build; its detailed origin is recorded in [web v4 credits](../smakopas-web-v4/credits.md). Only the Latin subset is included for these English artwork files; this is not a production Polish font bundle.

[Roboto Variable](assets/roboto-variable.ttf) was downloaded from the official [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/roboto). Its [SIL Open Font License](assets/roboto-license.txt) is included. The exact font and license download URLs and SHA-256 checksums are recorded in [downloads.json](source/downloads.json).

Archivo supplies reading titles and recipe content; Roboto supplies Android chrome, controls and supporting labels. The SVGs embed both font files. The PNG renderer loads the same local assets. No SF Pro font is used.

## Material Symbols

The icon assets are actual Material Symbols Outlined SVGs from Google's [material-design-icons repository](https://github.com/google/material-design-icons). The downloaded files are the `materialsymbolsoutlined/*_24px.svg` variants. The renderer scales them for their depicted roles, including smaller system-status glyphs. They are not hand-drawn substitutes or SF Symbols.

The [Apache 2.0 license](assets/material-symbols-license.txt) is included. [downloads.json](source/downloads.json) records each retained downloaded asset's exact URL and SHA-256 checksum; [used-icons.json](source/used-icons.json) records the 21 icons used by the renderer. Unused downloaded icon variants were removed. Refer to the [official Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols) for the asset family and formats.

## Public demonstration photographs

| Asset | Attribution inherited from web v4 | Original source page |
| --- | --- | --- |
| [Shakshuka](assets/shakshuka.jpg) | Alex Bayev | [Unsplash](https://unsplash.com/photos/aDccXHMCH2c) |
| [Greek salad](assets/greek-salad.jpg) | william wallace | [Unsplash](https://unsplash.com/photos/Dk4RNTHXlAA) |

Both files are byte-identical copies of web v4, including their existing JPEG source comments. The [web asset record](../smakopas-web-v4/credits.md) documents the public image retrieval and attribution limits: Shakshuka's source page was verified there, while Greek salad's attribution came from the supplied recipe fixture and its photo page was not independently fetched. Those limits remain unchanged. This Android task did not retrieve new dish photographs.

The photographs and associated demo-recipe durations belong only to the initial cookbook examples. They do not depict the imported Family pancakes recipe or its original source.

## Synthetic original pages

[Page 1](assets/sample-page-01.png) and [page 2](assets/sample-page-02.png) are byte-identical copies of the authored web v4 originals. Each is a 600 x 760 PNG visibly labeled as a synthetic sample. The source SVGs and origin notes remain in [web v4](../smakopas-web-v4/credits.md). Both source PNGs retain their existing metadata.

The pages contain the fictional Family pancakes recipe by Anna; Alex is the separate fictional uploader/editor. Salt quantity, servings, cooking time and temperature are intentionally absent. The artwork scales complete pages proportionally without rewriting or cropping their contents. These are authored demonstration documents, not private family photographs, AI extraction results or evidence of model accuracy.

## Artwork and provenance checks

[render.cjs](source/render.cjs) and [artboards.cjs](source/artboards.cjs) compose the static SVG geometry, real font and icon assets, existing public photographs and synthetic source pages. PNGs are vector renders; the contact sheet arranges the four main renders. No image-generation model or private source photograph/audio was used for this Android packet.

The copy comparison confirmed identical bytes for Archivo and its license, both photographs and both source pages against web v4. All 24 retained entries in the download record matched their recorded SHA-256 checksums when checked on 2026-10-16. These checks establish local asset consistency, not visual approval, accessibility compliance or native-device validation.
