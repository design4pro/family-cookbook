# Native cookbook and capture study

Date: 2026-10-16. Status: static proposals for review. The developer requested the Cookbook -> Add photos -> Review -> Recipe flow on iPhone and iPad, continuing the Smakopas v4 visual language with native Apple navigation and controls. This request does not approve a complete design system or authorize application implementation. The [MVP specification](../../family-cookbook-mvp/spec.md) remains authoritative.

## Deliverables

Eight main artboards show the four surfaces on each device. Two additional iPhone states make the original and the lower review fields visible. Each artboard has an SVG source and a PNG rendered at 2x.

| Main artboard | Logical size | PNG size |
| --- | --- | --- |
| `iphone-01-cookbook` | 393 x 852 | 786 x 1704 |
| `iphone-02-add-photos` | 393 x 852 | 786 x 1704 |
| `iphone-03-review` | 393 x 852 | 786 x 1704 |
| `iphone-04-recipe` | 393 x 852 | 786 x 1704 |
| `ipad-01-cookbook` | 1194 x 834 landscape | 2388 x 1668 |
| `ipad-02-add-photos` | 1194 x 834 landscape | 2388 x 1668 |
| `ipad-03-review` | 1194 x 834 landscape | 2388 x 1668 |
| `ipad-04-recipe` | 1194 x 834 landscape | 2388 x 1668 |

`iphone-review-source` and `iphone-review-lower` use the same 393 x 852 logical size and 786 x 1704 PNG size. They depict a tab selection and a scroll position of the same review, not additional product steps or an implemented interaction.

## Visual and asset choices

Archivo supplies the distinctive titles and reading content from [web v4](../smakopas-web-v4/design-brief.md). SF Pro Text supplies system chrome, controls and labels. The renderer uses the locally installed SF font; the font file is not bundled or embedded in this packet. SVG text therefore depends on that local font when rendered again; the PNGs preserve the exported appearance.

The palette retains white, ink `#1c1e21`, muted text `#5b636b`, rules `#dde3e6`, surface `#eef1f2` and accent `#0e7c70`. Amber `#855119` identifies a missing amount alongside explicit text. Original pages, recipe text and form fields use opaque reading surfaces.

Liquid Glass is a static projection in navigation, toolbar controls and tab bars: backdrop blur, a light edge and a tinted primary control. It does not reproduce the operating system's rendering or adaptive behavior. A future application must obtain the material from native system controls, rather than reproduce this drawing filter as its interface implementation. The [Apple reference](apple-reference.md) records the design rationale.

The icons are actual SF Symbols exported as PNGs through AppKit. [export-symbols.swift](source/export-symbols.swift) is an asset exporter only. [render.cjs](source/render.cjs), [iphone.cjs](source/iphone.cjs) and [ipad.cjs](source/ipad.cjs) draw static artwork; none creates an application, native view hierarchy or interactive prototype.

## Navigation and device layouts

On iPhone, Cookbook, Assistant and Shopping occupy the bottom tab bar in browsing and recipe views. Add recipe remains an action, not a fourth tab. Add photos and Review are focused modal flows that cover the destination navigation and provide a close control. Review retains a top Save action and a Source / Draft control.

On iPad, the same three destinations occupy a compact top tab bar. With only three sections, the study follows Apple's preference for tabs rather than imposing a permanent sidebar. Add photos and Review cover the destination navigation and use the available width for two substantive columns. This is an explicit tablet layout, not an enlarged phone composition. [Apple tab-bar guidance](https://developer.apple.com/design/human-interface-guidelines/tab-bars)

| Surface | iPhone composition | iPad composition |
| --- | --- | --- |
| Cookbook, Read mode | Search, All recipes / Favorites / Drafts, editorial recipe photography and concise rows, with Add recipe in the top controls | Search and recipe rows beside a larger demonstration recipe; top destination tabs remain distinct from collection filters |
| Add photos, Operate mode | Two full-page thumbnails, source-order and removal controls, library/camera actions, upload instructions and primary action | A large full-page source preview beside the ordered selection, photo/manual-entry actions and upload instructions |
| Review, Operate mode | Source / Draft switch; the main and lower states expose the full form without shrinking it into one viewport | Original on the left; title and metadata above ingredient and method fields on the right; all fields remain visible in the landscape composition |
| Saved recipe, Read mode | A text-led recipe with source access, explicit missing servings, ingredients, both steps and cooking/shopping actions | Ingredients and method arranged side by side, with source thumbnails and separate recipe actions |

## Content continuity

The initial cookbook contains existing public demonstration recipes: Shakshuka, Greek salad and Tomato soup. Family pancakes is absent before import. Photographs on those existing records do not become the original source or a cover for the new recipe, and the study does not authorize a new cover-image feature.

The capture flow uses the same two 600 x 760 synthetic originals as [the web capture study](../smakopas-web-v4/capture-brief.md): [page 1](assets/sample-page-01.png) and [page 2](assets/sample-page-02.png). The renderer embeds each complete PNG and scales it proportionally without cropping or changing its contents.

- Both pages are titled `Family pancakes` and say `Recipe by Anna`.
- Page 1 contains `2½ cups flour`, `2 eggs`, `250 ml milk` and `salt`.
- Page 2 contains `Mix the ingredients.` and `Cook in a pan.`
- Both pages identify themselves as synthetic samples. Anna is the fictional recipe author; Alex is the fictional source uploader and application editor. These identities remain separately labeled.
- Salt quantity and servings are absent and remain `Not specified`. Portion scaling remains unavailable. No temperature, preparation time, cooking time, serving count or family history is invented.
- The optional family note stays empty. The saved recipe has no dish photograph, time badge or serving-count stepper; its two original pages remain accessible.

## Depicted flow and intended behavior

Add photos depicts two selected files that have not been uploaded. Library/camera selection, reordering, removal, source inspection and manual entry are represented as controls. `Uses 2 image pages` describes the selected operation without inventing an account balance. The upload instruction appears before `Upload & transcribe`: keep the screen open until upload finishes; processing can continue after leaving once upload is complete.

Review labels the record as an AI draft that is not yet in the cookbook. It asks the user to check every field, including fields without warnings. The form contains title, recipe attribution, servings, optional note, ingredient amounts and names, and numbered steps, with add/remove affordances. The salt warning and missing-servings explanation remain visible in the appropriate review states. The source view names Alex as uploader and states that originals remain unchanged; the lower form names Alex as editor.

The top `Save` action on iPhone and `Save recipe` on iPad represent deliberate human approval. The lower review copy explains that saving makes the recipe available to the household. Transcription, navigating between source and draft, or an unflagged field does not constitute approval. Unknown values may remain unknown after saving.

Cooking and recipe questions use the approved content. Add ingredients represents entry to review and confirmation of proposed shopping additions, not an immediate write to the shared list. Painted camera, source, save, download and other controls do not perform these operations.

## Future validation and limits

No simulator tests, native application build or physical-device tests are provided by these exports. Static pixels do not establish native material conformance, accessible semantics or behavior.

- Validate Dark Mode and system appearance changes with the actual native materials.
- Validate Dynamic Type, large accessibility sizes, longer Polish translations, wrapping, scrolling and preservation of edit position when switching Source / Draft.
- Validate Reduce Transparency and Reduce Motion, contrast across real backgrounds and states, visible focus, keyboard access, VoiceOver labels/order/announcements and actual control target sizes.
- Keep unfinished upload, accepted upload, processing and terminal failure distinct. Retain originals and provide retry/manual editing after failure; recovery must not duplicate a recipe or charge the same operation twice.
- Design and verify denied permissions, invalid media, quota/storage limits, unreadable source text and revision conflicts. Never silently overwrite newer edits or infer missing source facts.
- Verify real-device navigation, inputs, source viewing, persistence and restart behavior when implementation is explicitly authorized. T03 physical-device evidence and T09 capture evaluation remain open with their existing blockers; neither readiness gate is changed by these studies.
