# Static visual review

Date: 2026-10-16. Status: inspected and corrected as static artwork; awaiting user review and approval.

## Bounded review

A fresh independent general-purpose reviewer inspected all 28 screen PNGs individually, four overview sheets, two preceding onboarding references, the brief, scenario and Impeccable craft floor in one initial batch. The specialized Impeccable reviewer role was unavailable, so a generic agent substituted explicitly. The main agent inspected all overview sheets and the individual subscription, Archive, checkout, cancellation, payer-change and recovery alternatives in the same round.

Two findings were collected before a single correction batch. One confirmation round then checked only those changes. The independent reviewer accepted both corrections for this static review; the main agent confirmed the revised overview sheets and artifact geometry. No clipping or overlap was observed at the exported sizes. This is an internal artifact review, not user approval or a release gate.

| Finding | Correction | Confirmation |
| --- | --- | --- |
| Small selected iPad navigation labels had 4.30:1 contrast on the tinted surface | Changed only the selected label from `#0e7c70` to `#0b7469`, retaining `#e2efeb` background | All five iPad screens use the revised pair, measured at 4.78:1 |
| General Sample usage wording could imply that stored recipes and files were permanently consumed units | Changed desktop web, mobile web and Android copy to explicitly name Sample AI allowances | Revised copy separates one-time processing totals from current capacity; no wrapping regression observed |

The initial independent review measured a minimum of 4.84:1 against the rendered background adjacent to the white labels on four tinted Apple glass buttons. This check includes the composed material rather than only its base color. Those controls were unchanged by the correction. Other checked flat text pairs on white were 16.71:1 for ink, 6.10:1 for muted text, 5.08:1 for the accent and 6.59:1 for warning text. These focused measurements do not establish WCAG conformance or contrast over every possible native backdrop.

## Artifact checks

- Twenty-eight SVG artboards parse as XML; every corresponding PNG has twice the SVG's logical dimensions.
- Four overview sheets arrange existing artboards and introduce no additional product states.
- All 174 annotated targets remain inside their artboards, with at least 44 x 44 logical units on web/Apple and 48 x 48 on Android. An annotation is not implemented touch behavior.
- All four drawing modules pass Node syntax checks. They generate design artifacts only.
- The rendered asset inventory contains four SF Symbol variants and four Material Symbols, with no unused copied symbol assets.
- All 36 raster files have embedded origin metadata; the final scan found zero missing records.
- The SHA-256 records for 496 files across the seven preceding Smakopas packets still match. Earlier artwork was not altered.
- The final inventory is recorded in [manifest.json](manifest.json); the gallery links to PNG/SVG files and supporting records.

## Product checks

Web presents one Family plan with monthly or annual billing. Both displayed prices are clearly pilot references, not live Polar offers. The review before checkout identifies the designated payer and permanent household binding; it is an application-owned handoff drawing, not a cloned provider form. It belongs to a separate eligible Sample scenario and does not offer a second purchase alongside active coverage.

The return from checkout keeps Sample access while verification is pending. Cancellation confirmation, verified renewal-off, verified expiry, temporary grace and failed refresh are separate states. Renewal-off keeps the paid period; a refresh failure does not prove expiry. The grace screen invents no duration or ending timestamp. Payer replacement transfers no subscription or card, creates no automatic charge, resets no allowance and remains blocked until prior coverage is verified to have ended.

Native screens contain no prices, checkout links, commercial Polar actions, QR codes, store restore or purchase promotion. They show neutral status, current allowances, expiry/reset information and access refresh. Native distribution eligibility still requires the later release work.

Consumed units and reservations are separate. The next usage reset is independent from billing renewal; annual billing does not imply annual usage windows. Sample AI totals are distinguished from capacity. The image-limit alternative pauses only image processing and preserves other available actions. Archive retains every member and saved recipe, with reading, search, cooking, downloads, export and existing shopping checks. It does not promise indefinite hosting. The brief records the inactivity policy and remaining design states.

## Limits and process record

This continues the established Smakopas direction in Operate mode. The Impeccable context launcher was attempted earlier in this session but unavailable; existing PRODUCT.md, design records, supplied Smakopas reference and the approved specification provided the manual context fallback. No concept tournament, new DESIGN.md or implied design approval was introduced. Documentation used the documented generic-agent fallback because the specialized documenter was unavailable.

No application views, routes, checkout, provider operations, quota logic, access refresh, account changes or payer-change behavior were implemented. No real payment, cancellation or secret access was needed. Application tests were not run for static drawings. Responsive reflow, keyboard focus, screen readers, dynamic text, Polish localization, native system insets and reduced-transparency/motion behavior remain future implementation checks. Fixed PNGs do not prove those properties.

Reusable prevention guidance is recorded in the brief: measure text on its actual selected/composited surface and distinguish AI totals from stored capacity in copy. The earlier nonrecursive glass-scene guard remains intact. T03 and T09 retain their existing blockers; neither readiness gate changes.
