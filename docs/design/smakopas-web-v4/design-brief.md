# Web cookbook and recipe study

Status: proposed, awaiting developer review. Surface mode: Read. Scope: two web surfaces, each at desktop and mobile widths. Reference: [inspected Smakopas material](../smakopas-reference-analysis.md).

The 2026-10-16 [capture extension](capture-brief.md) applies the same visual language to Add photos and Review in Operate mode. This brief continues to describe only the reading studies.

## Retained visual structure

| Element | Study decision |
| --- | --- |
| Typography | Actual Archivo from the supplied build; one family for headings, reading and controls |
| Recipe title | 48px desktop, 36px mobile; weight 700, tight tracking |
| Reading | 17px summary and ingredient names; 18px method text with 29px line spacing |
| Desktop container | Content from x=112 to x=1328 in a 1440px artboard |
| Mobile gutter | 16px in a 390px artboard |
| Hero image | 4:3, 8px radius; 688px desktop width, 358px mobile width |
| Recipe list | 144px desktop / 88px mobile thumbnail width; aligned text, source and time |
| Recipe body | Ingredients and method side by side on desktop, sequential on mobile |
| Palette | White, ink #1c1e21, muted #5b636b, rules #dde3e6, surface #eef1f2, accent #0e7c70 |

The reference's custom wide wordmark and condensed numeric dial are not reproduced. Family Cookbook keeps a text working-name label. Time appears as ordinary recipe information, without introducing Smakopas's time-budget selector or per-step timers.

## Product mapping

- The cookbook includes search, favorites, drafts and Add recipe, following the product contract. The featured recipe position is a composition study; it does not approve a new curation feature or sorting rule.
- Start cooking leads to the specified cooking mode. Add ingredients represents the entry to review and confirmation of shopping additions, never an immediate list mutation.
- Known servings allow portion adjustment. Unknown servings must disable scaling in later functional designs. The example has a known base of two servings.
- Edit, Favorite, Ask about this recipe and Original text retain familiar text labels and restrained icons. Original sources remain distinct from dish photography and recipe revisions.
- Family pancakes demonstrates a record with no dish photo and unknown time. It remains a complete list entry, with source access and explicit uncertainty.

## Content and scope limits

Shakshuka, Greek salad and Tomato soup use public demonstration material from the supplied fixture. Alex is a fictional member label, distinct from the photographer attribution. No record claims to be a real household import or a human-approved AI extraction.

Dish imagery is a visual option in this study, not authorization for a new photo-upload or generated-cover feature. Production must remain usable with only text and original sources. No private evaluation photo or audio was used here.

The static artboards do not prove keyboard access, screen-reader semantics, contrast in every state, zoom, touch-target behavior or responsive reflow. Mobile action and serving-control geometry is drawn at 44px, but implementation must validate actual target areas and spacing. Longer Polish text, missing-data recipe detail and loading/error states are subsequent design work.

Neither this packet nor the capture extension implements application features, native iPhone/iPad Liquid Glass or any outstanding proof. T03 and T09 remain open with their existing blockers.

## Reproduction

Use Node.js with Sharp available on NODE_PATH and run `node source/render-artboards.cjs` from this directory. The exporter registers the supplied font through a temporary Fontconfig configuration and writes self-contained SVG plus PNG files. Re-embed the origin notes and refresh the manifest after any export. This tooling is confined to static design artifacts.
