# Asset provenance

## Design and type reference

The developer supplied `/Users/rafalwolak/dev/cloudflare/smakopas.pl-old/apps/review/`. Desktop and mobile home/recipe screenshots were inspected together with matching build artifacts. Their relationship and evidence limits are recorded in the [reference analysis](../smakopas-reference-analysis.md).

Archivo was copied from `apps/web/dist/client/assets/archivo-latin-wdth-normal-DY7AcnAa.woff2` in that reference repository. The accompanying [SIL Open Font License](assets/archivo-license.txt) was copied from its installed `@fontsource-variable/archivo` package. Only the Latin subset is bundled for these English artwork files; this is not a production localization font bundle.

## Demonstration photography

| Asset | Attribution | Source |
| --- | --- | --- |
| [Shakshuka](assets/shakshuka.jpg) | Alex Bayev | [Unsplash photo](https://unsplash.com/photos/aDccXHMCH2c) |
| [Greek salad](assets/greek-salad.jpg) | william wallace | [Unsplash photo](https://unsplash.com/photos/Dk4RNTHXlAA) |
| [Tomato soup](assets/tomato-soup.jpg) | Ella Olsson | [Unsplash photo](https://unsplash.com/photos/fxJTl_gDh28) |

These are the photographs selected by the supplied Smakopas recipe fixture. The Shakshuka page was verified as available under the Unsplash License. The other two attributions come from the fixture; their image endpoints were accessible, while the photo pages could not be independently fetched during this session. This record is provenance for the local design study, not a production rights audit.

Each image was retrieved from the public Unsplash image endpoint at 1280 x 960 on 2026-10-15. Exact URLs are stored in `source/*-origin.txt` and embedded in JPEG comments. No private material was uploaded or substituted for these photographs.

## Recipe text and illustration

The Shakshuka ingredients, preparation and cooking times, serving count and five steps follow `apps/web/dist/server/assets/recipes-CH5gWcyu.js` in the supplied reference repository. Greek salad and Tomato soup descriptions and durations use the same fixture. Family pancakes is synthetic demo content with no assigned cooking duration. Member labels are fictional.

SVG geometry and icons were drawn for this study. No image-generation model was used. PNG metadata identifies the static vector export rather than presenting a fictional generation prompt.

## Synthetic capture sources, 2026-10-16

[Page 1](assets/sample-page-01.png) and [page 2](assets/sample-page-02.png) are authored 600 x 760 demonstration documents with editable SVG counterparts. Page 1 contains Family pancakes, fictional Recipe by Anna, 2½ cups flour, 2 eggs, 250 ml milk and salt. Page 2 contains the same title/attribution and two steps: Mix the ingredients; Cook in a pan. The document deliberately omits servings, salt quantity, time and temperature.

Each page is visibly labeled Synthetic sample. They are rendered from vector text using Archivo; they are not real photographs, AI extraction results or private family sources. Add photos and Review embed the same complete PNG bytes with their aspect ratio preserved. Alex is the fictional uploader/editor, distinct from Anna. Exact origin notes are embedded in the source PNGs and all new artboard PNGs. No external service received private material.
