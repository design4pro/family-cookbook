# Editorial web v3: reference analysis

Prepared 2026-10-15. Status: design-only proposal, not approved. This document informs the next visual studies; it does not authorize feature implementation or change the product contract. Family Cookbook remains a working name. T03, T09 and both readiness gates are unchanged.

## Evidence and scope

The lead reviewer visually inspected the live [Kulinarna Stolica Polski map](https://kulinarnastolicapolski.wp.pl/mapa) at a 1440px desktop viewport, the live [KUKBUK index](https://kukbuk.pl/) and its “Pistacjowa owsianka” recipe page. The observations below describe those inspected surfaces, not a complete usability audit.

An independent reviewer verified three award records directly on Awwwards and visually inspected their official gallery images. Live-site screenshot capture failed. The Awwwards observations therefore concern published gallery material from the award period, not verified current layouts or interactions. These are awards from 2024-2025, checked now; they are not a ranking of the best websites of 2026. Awards do not establish accessibility, performance or suitability for this product.

## Reference findings

### Kulinarna Stolica Polski

The inspected map page places a large sage-green map on the left and a strong, compact serif heading on the right. Cream, olive, lime and yellow form a deliberate palette. Rounded controls and small white labels follow a consistent visual language. Its character comes from the relationship between scale, color and typography rather than isolated decorative components.

**Transfer:** confident green accents, a distinct heading voice, purposeful asymmetry and consistent control treatment.

**Do not transfer:** the map, voting, decorative patterns or campaign mechanics. They do not belong to the approved private-cookbook scope.

### KUKBUK

The inspected index uses a strong geometric sans; DOM-backed style inspection reported `neulis-sans, sans-serif` for sampled navigation/body text. Turquoise bands, asymmetric photo and editorial-text areas, thin rules and a restrained number of container treatments create recognizable publication design. On the inspected [recipe page](https://kukbuk.pl/przepisy/pistacjowa-owsianka/), a large photo occupies roughly the left half while the title and ingredients occupy the right. A prominent newsletter section obstructs direct access to useful content.

**Transfer:** strong geometric headings, clear editorial hierarchy, thin rules, purposeful alignment and a small, consistent set of surface treatments. Give recipe content a deliberate composition rather than arranging generic application cards.

**Do not transfer:** the newsletter interruption, promotional content or dependence on a large dish photograph. A private family cookbook must remain useful and visually complete when no dish photograph exists.

### Agency Eats

- [Award record](https://www.awwwards.com/sites/agency-eats): Honorable Mention, 2024-12-20.
- [Realization](https://agencyeats.isadoradigitalagency.com/).
- [Visually inspected official gallery view](https://www.awwwards.com/inspiration/recipe-page-agency-eats): Recipe Page.

The published recipe view combines condensed, heavy sans typography, a distinct contributor label, illustrated food and a consistent set of visual marks. It has a recognizable voice without relying on conventional rectangular dish photography.

**Transfer:** a deliberate typographic identity and clearly separated human attribution.

**Do not transfer:** the oversized recipe opening, badges, tilted artwork or illustrated-cover requirement. Commissioning or generating an illustration for every recipe would introduce an unapproved content workflow. Illustrations are not the fallback for missing photographs.

### Seasoned

- [Award record](https://www.awwwards.com/sites/seasoned): Site of the Day, 2025-03-21, score 7.47/10; the detail page also lists a Developer Award.
- [Realization](https://seasoned.koto.studio/).
- [Visually inspected official gallery view](https://www.awwwards.com/inspiration/thumbnail-submission-67a493adacad4360104797): Desktop, plus the award submission image.

This educational publication uses a culinary metaphor. The inspected images contrast heavy, compact lettering with script, composing type as a graphic element within a consistent printed-publication aesthetic. Its visual identity does not require a photograph of each individual recipe.

**Transfer:** intentional typographic contrast and headings that participate in a coherent layout.

**Do not transfer:** overlapping script, retro television framing, theatrical transitions, saturated gradients or ornamental reading text. The reference supports art direction, not a ready-made recipe-reading interface.

### Siena Film Foundation

- [Award record](https://www.awwwards.com/sites/siena-film-foundation): Site of the Day, 2025-03-18, score 7.9/10.
- [Realization](https://siena.film/).
- [Visually inspected official gallery material](https://www.awwwards.com/inspiration/about-us-siena-film-foundation): a static About Us preview, plus the award submission image. Motion was not evaluated.

The About Us preview uses a central typographic column, narrow images on both sides, precise rules and strong scale contrast. Film, poster and ticket references belong to one coherent visual language.

**Transfer:** grid discipline and a visual language grounded in the medium. For this product, that medium is a usable family cookbook: an index, readable recipe pages and clearly identified originals.

**Do not transfer:** cinematic framing, black backgrounds, image masks, promotional quotations or animated transitions. Original family sources must not be altered to serve an editorial effect.

## Proposed v3 direction

- Use a light paper-colored background without aging, stains, simulated handwriting or decorative archival texture.
- Pair forest green with celery as deliberate accents. Keep reading surfaces quiet and opaque; color must not carry meaning alone. Exact tokens and contrast remain to be validated.
- Use strong geometric sans headings, with a restrained serif accent where it adds hierarchy. Do not repeat the v2 approach of making navigation, controls, metadata and body text share one literary voice. Font selection and licensing remain open.
- Build the default cookbook index without dish photographs. Text-only entries must be complete editorial elements, with intentional type, spacing and rules rather than empty image placeholders or oversized bordered boxes.
- Use original-source thumbnails only when they help identify or access the source. Preserve the complete immutable asset, label its role and provide access to the full source. A thumbnail is not an invented dish cover.
- Make the recipe title, ingredients, method and useful actions the hierarchy. Attribution and source access support reading; they must not inflate the opening and push the recipe below the fold.
- Use asymmetry to establish relationships between content areas, not to fill space. Keep the source-and-draft comparison a distinct work surface with recognizable editable fields.
- Show only supplied recipe facts and human attribution. Do not invent family stories, quotations, provenance, ingredients or dish images to improve the composition.

## Review criteria for the next studies

1. The index and recipe remain visually complete with no dish photographs, including short entries and long Polish titles.
2. A clear type hierarchy and consistent grid carry the design before any decorative asset is added.
3. The recipe reaches useful cooking content promptly; metadata, source previews and status messages do not dominate it.
4. The same unchanged original appears wherever the source is shown. Its presentation remains distinct from approved recipe content.
5. The studies demonstrate a coherent reading surface and a usable review surface without introducing features outside the MVP contract.

Mockups can support composition review. They cannot establish WCAG 2.2 compliance, responsive behavior, native durability, extraction fidelity or either readiness gate.
