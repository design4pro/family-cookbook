# Static artifact review

Date: 2026-10-16. This review covers exported artwork only. It does not approve the visual direction on the developer's behalf or establish native behavior.

## Inspection

The primary agent inspected all eight main PNGs and both supplementary iPhone states. An independent reviewer inspected the same ten PNGs, compared them with three web v4 reference images and checked drawing sources for apparent preview artifacts.

One concrete defect was found: the Ingredients heading in `iphone-review-lower` was partly clipped under the Source / Draft control. One correction batch changed the depicted scroll offset from 390 to 370 and tightened the spacing of the lower footer so the full heading and household-save explanation remain visible. The same batch replaced the iPhone cookbook's underline filters with a segmented control consistent with the iPad study.

The primary agent inspected the corrected lower form and both complete-flow contact sheets. The independent confirmation pass inspected the corrected lower form and cookbook, confirming that the heading and footer are visible and the segmented control introduces no text or spacing collision. No further visual iteration was made. Internal review is not user approval.

## Content and integrity checks

- All four screens exist on both devices, plus the two iPhone review states. Device artboards export at 2x; contact sheets use proportionally scaled copies.
- Both synthetic original PNGs match the web capture assets byte for byte. The source renderer contains each whole page with its original aspect ratio.
- Review and saved recipe retain `2½ cups flour`, `2 eggs`, `250 ml milk`, salt without an amount and both original steps. Unknown servings prevent portion scaling. No time, temperature, dish photo or family story is invented.
- Anna remains the fictional recipe author; Alex remains the uploader/editor. The pre-import cookbook does not already contain the newly imported recipe.
- Actual Archivo, locally rendered SF Pro Text and actual SF Symbols are used. Form and reading surfaces remain opaque; the material treatment is restricted to navigation and controls.
- SVG XML parses, the drawing modules pass syntax checks, local document links resolve, all raster assets carry origin metadata, and existing web v4 files still match their previous manifest hashes.
- The final manifest records the exported dimensions, sizes and SHA-256 hashes. No application source, native build, database, provider configuration or task evidence was changed.

## Limits

The proposal covers light appearance and standard-size English text. Liquid Glass blur, edge and tint are static approximations. Dark appearance, Dynamic Type, longer Polish labels, VoiceOver, Reduce Transparency, Reduce Motion, keyboard behavior, live source zoom, form focus and real touch-target behavior remain to be validated with native controls when implementation is requested.

The packet presents the primary flow, not a complete error-state specification. Upload interruption, denied permissions, quota/storage limits, unreadable source material and conflicting revisions remain requirements in the authoritative product contract. T03 physical-device evidence, T09 capture-evaluation gaps and both readiness gates remain unchanged.
