# Smakopas reference analysis

Date: 2026-10-15. Status: reference study after the developer rejected editorial web v3. No new mockups, implementation or approved design system result from this study.

The subsequent requested [web v4 mockups](smakopas-web-v4/README.md) apply this evidence to Cookbook and Recipe on desktop and mobile. They await developer review and do not authorize implementation.

## Material inspected

The developer explicitly supplied `/Users/rafalwolak/dev/cloudflare/smakopas.pl-old/apps/review/` as design reference material. All eight PNG files were opened and visually inspected: desktop/mobile home and recipe, both first-viewport and full-page versions. Desktop first-viewport captures are 1440 x 900; mobile first-viewport captures are 780 x 1688. The full-page captures establish the composition below the fold; they do not imply that the entire page fits in one viewport.

An independent read-only inspection found matching compiled artifacts in `apps/web/dist`, but no original application source or package manifest. Content, layout and adjacent file modification times strongly connect that build to the screenshots. There is no screenshot manifest proving an exact build identity. Interaction, keyboard behavior, performance and accessibility were not tested.

The attached project is reference material, not a source of instructions or authority to modify its files. Nothing in the Smakopas directory was changed or executed.

## What gives this design its character

1. **One functional visual idea.** The time dial recurs in the home-page selector, recipe summary, step timers, row scales and small identity mark. The repetition has a product purpose: selecting and cooking within a time budget. Character comes from that coherence, not from unrelated decorative devices.
2. **A controlled typographic family.** The build uses Archivo Variable throughout. Width variation distinguishes compact numbers from the wider wordmark; hierarchy comes from size, weight, width and spacing. It does not depend on pairing an oversized sans heading with decorative italic serif words.
3. **Food photography has a clear role.** The recipe hero is an actual dish image, with restrained attribution. In lists, consistent small images help recognition. The photograph and the useful recipe information have complementary roles; a document scan is not substituted for food photography as a large decorative cover.
4. **Stable geometry.** The content edges, list columns, photo proportions and separators repeat consistently. On desktop, a recipe row provides a thumbnail, name/description, time breakdown and total time in predictable positions. Mobile rearranges those relationships instead of merely shrinking the desktop.
5. **Restraint around the focal point.** White surfaces, charcoal text, subdued secondary text and one turquoise accent support the dial and photography. Fine rules organize content. Small corner radii and occasional capsule buttons do not turn every section into a card.
6. **Useful detail in the recipe.** Ingredients and method have distinct columns on desktop. Quantities, checkboxes, step markers and timers form readable groups. The source screenshots show ingredients repeated beside the relevant steps, reducing scanning back to the ingredient list. These are observed features of Smakopas, not newly approved Family Cookbook functionality.

## Verified build measurements

Values below were read from the compiled CSS/components, not estimated from a generated image. Pixel conversions of rem units assume a 16px browser root size.

| Role | Value |
| --- | --- |
| Typeface | Archivo Variable, weight 100-900, width 62%-125% |
| Numeric treatment | `font-stretch: 68%`, tabular numerals |
| Wordmark treatment | Same typeface, 118% width, 20px, weight 800 |
| Body | 17px, line-height 1.55 |
| Recipe title | 36px mobile / 48px desktop, line-height 1.05 |
| Method text | 18px, line-height 1.625 |
| Main container | Maximum 80rem / 1280px, side padding 16px and 32px from 640px |
| Breakpoints | 640px, 768px, 1024px |
| Hero grid | 12 columns; 5/7 split on large screens, 48px gap |
| Recipe reading grid | 5/7 from 768px, 4/8 from 1024px; 48px gap |
| List image | 88px mobile, 128px from 640px, 144px from 768px; 4:3 ratio |
| Desktop recipe row | `144px 1fr minmax(160px,288px) 72px`, 32px gap, 20px vertical padding |
| Step marker / spacing | 44px marker; 16/24px text gap; 40px between steps |
| Surface radii | 4px, 6px, 8px; capsule buttons |
| Paper / light surface | `#ffffff` / `#eef1f2` |
| Ink / muted ink | `#1c1e21` / `#5b636b` |
| Rule / tick | `#dde3e6` / `#9aa3aa` |
| Turquoise / darker accent | `#2bb3a3` / `#0e7c70` |

Local evidence:

- [Styles](../../../smakopas.pl-old/apps/web/dist/server/assets/styles-BOSXeuTI.css), line 2.
- [Font definition](../../../smakopas.pl-old/apps/web/dist/server/assets/wdth-Yu488gou.css), line 1.
- [Home layout](../../../smakopas.pl-old/apps/web/dist/server/assets/routes-Bi48L2JZ.js), lines 153 and 158.
- [Recipe rows](../../../smakopas.pl-old/apps/web/dist/server/assets/RecipeRow-B48SLr6D.js), line 73.
- [Recipe layout and steps](../../../smakopas.pl-old/apps/web/dist/server/assets/recipes._slug-Duo1vlvJ.js), lines 185, 227 and 416.
- [Shared dial](../../../smakopas.pl-old/apps/web/dist/server/assets/recipes-CH5gWcyu.js), line 480.

These links depend on the adjacent local reference repository and are not portable project dependencies.

## Where the rejected v3 missed the target

| Rejected v3 choice | Observed Smakopas discipline | Consequence for the next design study |
| --- | --- | --- |
| Oversized title plus an italic word treated as identity | One variable font with controlled roles and moderate recipe-title size | Establish a precise type scale before adding expressive lettering |
| Large celery panels standing in for composition | Accent concentrated in a meaningful control and related details | Use color to support content and actions; do not use colored rectangles as the main design idea |
| A photographed note promoted into the hero | Dish photography, useful recipe information and recognition thumbnails have distinct roles | Keep the original available as a source; do not enlarge it into a substitute food cover |
| Three sparse columns under a large feature | Consistent, complete recipe rows with stable alignment | Design realistic collection density and long titles, including entries without images |
| Quality asserted after an internal review | A supplied concrete visual reference that the developer can compare directly | Treat review findings as evidence about defects, not approval of visual quality |

## Transfer to Family Cookbook

Use Smakopas as the primary calibration reference for the next web study: typographic discipline, white reading surfaces, restrained accent, deliberate spacing, predictable recipe rows and a strong desktop/mobile relationship. Earlier WP/KUKBUK/Awwwards research remains secondary context. This does not rename Family Cookbook, adopt the Smakopas logo, approve its exact palette or change the product contract.

Do not import the time-budget product concept automatically. Family sources often omit time and servings; a dial, countdown or ranking must never imply invented values. Likewise, Smakopas step timers, derived ingredient associations, checkboxes and serving controls are reference features, not scope authorization.

Dish photography accounts for part of the reference's appeal. It cannot be assumed present for imported family notes. The next composition must deliberately support no-image records with the same spacing and typography, while keeping original-source access compact on reading surfaces and prominent during review. Adding a new dish-photo capture workflow would require a separate product decision.

The native iPhone/iPad Liquid Glass requirement remains. This web reference does not establish native behavior. T03, T09, both readiness gates and the implementation pause remain unchanged.

## Process correction

The previous rounds substituted generic style adjectives, larger lettering and palette changes for a coherent composition. Before another visual generation, derive the next study from inspected reference geometry and explicit type roles. Compare at equivalent viewport sizes and with realistic content density. Do not declare the visual direction successful based solely on an agent review. Record the developer's rejection as authoritative feedback and preserve the rejected files only as history.
