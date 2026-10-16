# Editorial web and native Apple design direction

Prepared 2026-10-15. Status: proposed, awaiting design review. Scope: research and visual design only. The developer rejected the earlier green compositions and requested an editorial recipe website plus Liquid Glass on iPhone and iPad. That request supersedes the earlier composition direction; green remains a restrained accent.

## What failed in the previous proposal

The previous screenshots were inspected, including the mobile cookbook and desktop saved recipe. This is a visual assessment of raster artifacts, not an audit of running components.

- Repeated rounded containers, green panels and oversized headings made different tasks look alike. The screens communicated form structure before recipe content.
- The saved recipe resembled an editor. Ingredients need readable alignment and rhythm, not the appearance of disabled inputs.
- Desktop inherited a mobile application's visual structure instead of using editorial composition and reading columns.
- An iOS-like phone did not establish a tablet design. There was no distinct iPad workspace.
- The visual concept depended too much on color and too little on typography, imagery, composition and platform behavior.

Process correction: choose the mode per surface before choosing components. Cookbook browsing and saved recipes are **Read**; import and verification are **Operate**. Review each platform separately, include the no-food-photo case, and check generated imagery for invented source content before presenting it as a handoff.

## Research and evidence

Sources were checked on 2026-10-15. This is a curated comparison, not a statistically ranked list of the most popular designs. Award evidence establishes recognition, not usability for our households. Recommendations below are our synthesis.

| Reference | Evidence and observation | Applicable lesson |
| --- | --- | --- |
| [Apple Materials HIG](https://developer.apple.com/design/human-interface-guidelines/materials) | Official guidance distinguishes Liquid Glass navigation/control layers from content. The web page requires JavaScript; the available official text informed this review. | Put glass in native chrome. Keep recipe text and editable fields on opaque, readable surfaces. |
| [Apple Design Awards 2026](https://www.apple.com/newsroom/2026/06/apple-reveals-winners-of-the-2026-apple-design-awards/) | Published June 2, 2026. Moonlitt won Interaction; Tide Guide won Visuals and Graphics. Apple explicitly praised their Liquid Glass integration. Award descriptions were reviewed; their apps were not installed or tested. | Contemporary native polish comes from integrated behavior and coherent content, not translucent cards everywhere. |
| [Mela](https://mela.recipes/) and its [official recipe screenshot](https://mela.recipes/images/recipe.png) | Website text and the recipe screenshot were inspected. The screenshot uses a strong recipe title, unboxed method text, ingredient column and discrete actions. The site describes side-by-side browsing on larger devices. | Separate reading from editing. Let tablet width support meaningful parallel content. Mela is an established reference, not a newly discovered 2026 trend. |
| [Ottolenghi recipes](https://ottolenghi.co.uk/pages/recipes) | Live content, navigation and a browser screenshot were inspected. Image-led recipes and culinary filters support browsing. Promotional overlays partly obscured the screenshot. | Borrow editorial hierarchy and culinary imagery; do not borrow promotional interruptions or assume the full site was usability-tested. |
| [King Arthur recipe collections](https://www.kingarthurbaking.com/recipes/collections) | Published collection structure was reviewed as text; no full visual inspection was completed. | Familiar culinary groupings can help scanning. Use existing tags, not a new collection-management feature. |
| [Crouton developer story](https://developer.apple.com/news/?id=9x75y43e) | Apple's November 2024 story describes the 2024 Interaction award and recipe collection use cases. This is historical recognition. | Native cooking utilities are a relevant behavior benchmark. Do not import its meal-planning scope into this MVP. |

The supported current signal is platform-integrated Liquid Glass in Apple's 2026 awards. Editorial food presentation is a durable category pattern, not evidence that every successful 2026 website must use a serif font or oversized photography.

## Proposed visual system

One product identity, distinct platform compositions. The working name remains Family Cookbook; no logo or final branding decision is introduced.

| Dimension | Web | iPhone | iPad |
| --- | --- | --- | --- |
| Character | Private recipe journal and cookbook | Native personal cookbook | Native reading and comparison workspace |
| Navigation | Masthead and compact text links | System navigation and floating tab bar | Adaptive sidebar and compact toolbar |
| Typography | Literary serif titles, readable body, quiet sans controls | System text styles and Dynamic Type | System text styles with useful reading columns |
| Material | Opaque near-white surfaces and thin rules | Liquid Glass navigation/control layer | Liquid Glass toolbar/sidebar layer |
| Content | Editorial image rhythm or intentional typography-only entries | Recipe-first scroll, reachable actions | Ingredients and method, or source and draft, side by side |
| Green | Small actions and selected states | Selection/action tint | Selection/action tint |

Starting palette proposal: ink `#202721`, deep green `#234D3C`, paper `#FAFAF6`, secondary text `#516159`, warning text `#855000` on `#FFF7E8`. These are intended tokens, not measured values extracted from generated pixels. Select and license actual web fonts during a later approved design-system task; raster lettering is not a font specification.

Web reading text should start around 18px with comfortable leading and a bounded measure; controls must not become tiny editorial footnotes. Native uses scalable platform text styles, rather than copying pixel sizes from the images. Use consistent spacing and a single icon family per platform. No card border around every piece of content.

## Platform behavior

**Web.** The cookbook feels like a private culinary publication. A larger lead entry gives the index rhythm; it does not imply algorithmic recommendations or public popularity. Filtering is compact and uses existing recipe tags. The masthead is prominent on the index and compact on focused work pages. Saved recipes read as articles, with immediate access to ingredients, method and original source. Optional family notes appear only when supplied by a person; no generated stories. Capture/review uses conventional accessible fields within the same editorial shell. The blog character does not introduce public publishing, ratings, comments, newsletters or a marketing funnel.

**iPhone.** Keep Cookbook, Assistant and Shopping as primary destinations. Add recipe is an action; profile opens household/account settings. Focused import/review uses native Back and an explicit save boundary. Source/Draft switching preserves the current unsaved input and view position while the screen remains active. It does not promise crash-safe draft persistence. The glass tab bar floats over real scrolling content with safe-area clearance. Static headings must not be drawn as glass buttons.

**iPad.** The sidebar supports navigation while reading. Review uses the available space for the full source and draft, with zoom controls near the source. In narrow windows or with enlarged text, collapse to sequential views instead of squeezing two columns. Keyboard and pointer interactions supplement touch. This is an independent tablet composition, not a scaled phone.

**Android.** Product behavior remains shared, but this proposal does not authorize copying Apple glass to Android. Preserve Android navigation and platform controls. The new packet contains Apple native and desktop web mockups; it does not claim a revised Android visual design.

## Full flow and adaptation

| Stage | Web | iPhone | iPad |
| --- | --- | --- | --- |
| Cookbook | Editorial index, search, tags, separate drafts | Native recipe feed, search, glass tab bar | Sidebar plus recipe index/detail; reading detail is illustrated |
| Add photos | Large original preview and file selection | Camera/library entry and source preview | Wider preview with ordered thumbnails and adjacent import controls; described, not separately illustrated |
| Review | Source and draft in readable columns | Draft/Original switch | Source and draft side by side with source zoom |
| Saved recipe | Recipe article, unboxed ingredients and method | Single readable column and source access | Two-column recipe with contextual sidebar |

The packet contains four web screens, four iPhone screens and two iPad screens. iPad index/import layouts are specified here, not claimed as additional completed images. Mobile web follows the editorial identity: single-column recipes and a compact web header, not native tab-bar imitation. A separate narrow-web composition remains future design work.

## Imagery and product scope

The cookbook index studies deliberately explore editorial dish photography. All photographs, handwriting and recipe facts in these mockups are synthetic. No private source asset was passed to image generation. All index photography is illustrative, including entries without an individual caption.

The current contract centers on original recipe sources and does not establish a separate dish-cover workflow. Therefore dish covers are an **optional visual proposal**, not an approved new upload or AI-generation feature. Until that scope is explicitly decided, use the typography-only or original-source treatment. A photo must never imply it depicts the cooked result of the uploaded recipe when it does not.

The saved-recipe screens intentionally work without a dish photo. A source thumbnail opens the original; it is not silently promoted to a decorative dish cover. The synthetic paper is independently rendered across the studies and is not pixel-identical. This is a mockup limitation, not proposed image rewriting: the real workflow must display the same immutable uploaded asset throughout. No quotation, family story or ingredient may be invented to fill whitespace.

## Interaction and content invariants

The [existing transition matrix](../green-flow/README.md#transition-and-edge-state-matrix) remains applicable for upload, processing, conflicts, authorization and failure states. Only its superseded visual direction is replaced.

- One import creates one draft from up to five ordered photos. Preserve preview, remove and accessible reorder controls when there is more than one photo. No crop editor or automatic recipe splitting is introduced.
- Quota copy must use the contract's unit: **1 photo = 1 page**. The illustrated single-photo label "1 extraction" is shorthand in a concept image; final UI copy should say "Uses 1 page from your image allowance" and reflect the actual selected count. Never charge one unit per model call or assume every multi-photo draft costs one page.
- Upload acceptance precedes background processing. Saving is explicit human approval. A polished screen does not imply accurate extraction.
- Every field needs review, even if unflagged. Unknown quantities, times and servings may remain unknown. Do not infer them from the illustrative photography.
- Family attribution is editable; uploader identity is read-only metadata. Disabled-looking uploader boxes in generated review studies are a rendering limitation; the eventual design should use plain metadata text.
- Save success appears only after confirmation. Add to shopping opens ingredient confirmation, not an immediate shared-list mutation. Unknown servings have no scaling action.
- Keep long text and form state through view switching. Unsaved departure/conflict handling must remain explicit. Do not infer durable offline editing from the mockups.

## Accessibility, responsive behavior and motion

Liquid Glass needs native evaluation under varied backgrounds, Reduce Transparency, Increase Contrast and Reduce Motion. Use the platform material behavior with an opaque fallback where required. Never recreate a custom blur everywhere solely to match these pixels. Keep scrolling content clear of overlays, keyboard and safe areas.

Web needs semantic headings, real labels, visible keyboard focus, source zoom without drag-only gestures and logical reading order after columns stack. Native needs screen-reader labels and Dynamic Type. Target at least 44pt Apple controls and 48dp Android controls; meet WCAG 2.2 on web. Measure contrast in implemented components rather than declaring a raster compliant. Unknown values must have text as well as color. The light gray ancillary text and glass edges in these studies are not approved contrast values.

When implementation is later authorized, verify Polish labels, long recipe titles, no-photo and empty books, narrow web, iPad window resizing, large text, dark appearance, keyboard, reduced transparency and motion. These are acceptance checks, not completed tests. Motion should explain source/view transitions; decorative parallax, continuous shimmer and animated recipe backgrounds are unnecessary.

## Review result and remaining decisions

All ten generated images were inspected. One bounded correction batch removed invented source prose and an ornamental iPad quote, removed glass from a static iPhone title, and distinguished selected-photo count from the maximum. Final corrected images were inspected. No implementation or runtime test was performed.

These artifacts are suitable for reviewing platform character and composition. They are not a pixel-exact component library: font metrics, source-thumbnail appearance, toolbar dimensions and secondary-label contrast still vary. The proposal needs the developer's design review before it becomes visual authority. No implementation follows automatically.

T03 retains its physical-device evidence block. T09 retains its existing capture-fidelity and representative audio/reference gaps. Both readiness gates remain closed. No task status or production access changed.

Tooling note: the browser helper reported an available update; no upgrade was performed. The Impeccable launcher also created local GitHub helper files while embedding prompts. Those new helper files were moved out of the repository because they were unrelated to the design-only scope. Future artifact work should inspect the diff after launcher operations rather than assume metadata commands are side-effect free.
