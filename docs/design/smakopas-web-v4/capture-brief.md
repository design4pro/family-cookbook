# Web photo capture and review study

Date: 2026-10-16. Status: static proposals for review. Surface mode: Operate. The developer requested continuation in the same Smakopas web v4 style; this does not approve the complete visual system or authorize feature implementation. The [MVP specification](../../family-cookbook-mvp/spec.md) remains authoritative.

## Scope and visual continuity

The four main studies show Add photos and Review recipe at desktop and mobile widths. A fifth study shows the mobile Source tab, complementing the main mobile Draft view. Each artboard has PNG and SVG exports.

| Artboard | Size | Depicted state |
| --- | --- | --- |
| `desktop-add-photos` | 1440 x 1070 | Two selected photos, not uploaded; source preview beside the ordered selection |
| `mobile-add-photos` | 390 x 1465 | Two selected photos, not uploaded; selection, upload action and source preview |
| `desktop-review` | 1440 x 1610 | Original beside the editable draft; unknown salt amount and servings |
| `mobile-review` | 390 x 1900 | Draft tab with editable fields and explicit Save recipe action |
| `mobile-review-source` | 390 x 1190 | Additional Source-tab state with original preview and Back to draft action |

The [reading study](design-brief.md) supplies Archivo, white backgrounds, ink `#1c1e21`, muted text `#5b636b`, rules `#dde3e6`, surface `#eef1f2` and accent `#0e7c70`. Desktop content retains the 112px outer margin at 1440px; mobile retains 16px gutters at 390px. Titles are 48px desktop and 36px mobile. Form boundaries and an amber `#855119` warning distinguish the work surface without adding a new brand direction, decorative dish imagery or timer controls.

## Demonstration source

The two originals are locally generated, explicitly labeled synthetic recipe pages. Each PNG is 600 x 760 pixels, with a corresponding SVG and embedded provenance metadata. The artboard renderer reads these existing PNGs and embeds their complete bytes, scaling the full page proportionally without cropping or editing it. Neither is a private family document or evidence of extraction accuracy.

[Page 1](assets/sample-page-01.png) contains:

```text
Family pancakes
Recipe by Anna

Ingredients
2½ cups flour
2 eggs
250 ml milk
salt

Synthetic sample · Page 1 of 2
```

[Page 2](assets/sample-page-02.png) contains:

```text
Family pancakes
Recipe by Anna

Method
1. Mix the ingredients.
2. Cook in a pan.

Synthetic sample · Page 2 of 2
```

Anna is a fictional recipe author named in both source pages. Alex is the fictional source uploader and application editor. These roles remain separately labeled. No salt quantity, serving count, temperature, cooking duration or additional family history is supplied. The draft preserves the fraction, wording and units; the salt amount and servings remain `Not specified`. `Add a note` is an empty optional-field placeholder, not source content.

## Depicted capture state

Both Add photos studies say `2 of 5 photos · Not uploaded`, show the ordered files and offer `Move down`, `Move up`, `Remove`, `Choose photos` and `Enter manually`. The mobile study also offers `Take photo`. The original preview is labeled `Photo 1 of 2` with `Open original`.

The primary action is `Upload & transcribe`. `Uses 2 image pages` describes the selected operation, without inventing an account balance. Copy before the upload action explains that the draft is reviewed before saving and that the page must remain open until upload finishes. The mobile study also explains there that processing can finish after the user leaves. These are intended behaviors represented by artwork, not working uploads or background jobs.

## Depicted review state

The header says `AI draft · Not yet in your cookbook` and asks the user to check every field, including fields without a warning. Desktop displays Original and the form side by side. Mobile uses `Source / Draft`; the additional Source study shows `Next photo`, `Open original`, uploader attribution, the preservation message and `Back to draft`.

The form includes Recipe title, Recipe by, Servings, Family note (optional), ingredient amounts and names, and numbered Method fields. It also shows Add ingredient, Add step and a removal icon beside each ingredient and method row. The artwork reserves a 44px column for the removal controls; this is intended geometry, not a tested interactive target. Salt has a text warning as well as a distinct field border. The missing serving count is explained, with portion scaling remaining off. The method explicitly points to photo 2.

`Uploaded by Alex` is attached to the original; `Last edited by Alex` is attached to the draft. Source copy states that editing the recipe does not change the originals. `Save recipe` represents deliberate human approval, accompanied by `Saving makes this recipe available to your household.` The artwork does not claim that transcription, a warning-free field or opening the review has approved the recipe.

## Future behavior and validation

The following remain requirements for subsequent interaction design and implementation, not capabilities of these static exports:

- Distinguish selected files, an unfinished upload, accepted upload and processing. Permit leaving only after upload completion; retain a persistent job state for return.
- Retain uploaded originals after extraction failure and offer retry or manual editing. Recovery must not duplicate a recipe or consume the allowance twice. Handle denied permissions, invalid files, interrupted transfers and quota/storage limits explicitly.
- Preserve source order within a single recipe draft, with at most five images. Unrelated recipes require a closer image or manual entry; no automatic page splitting, bulk notebook import or PDF support is implied.
- Allow explicitly unknown values after approval. Missing amounts are not zero; missing servings disable scaling. Unreadable text needs an explicit state. Do not silently infer quantities, times, temperatures or unit conversions.
- Check revisions before saving and expose concurrent edit conflicts instead of silently overwriting changes. Keep the original files unchanged and preserve the required history.
- Make Source/Draft switching preserve edit position. Validate keyboard order, visible focus, labels, screen-reader announcements, source navigation, enlarged text, zoom, touch targets and responsive reflow. Painted inputs and buttons are not accessible controls.
- Validate Polish translations and longer labels against the layout. These artifact contents remain English under repository rules.

No application routes, upload jobs, extraction calls, storage resources or native interfaces are implemented by this packet. T03 and T09, their existing blockers and both readiness gates are unchanged. The [gallery](README.md) presents the artboards; [capture-artboards.cjs](source/capture-artboards.cjs) is the static drawing source.
