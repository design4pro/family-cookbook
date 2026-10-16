# Static visual review

Date: 2026-10-16. Status: reviewed as static artwork; awaiting developer feedback and approval.

## Bounded review

The first inspection covered all 14 screen PNGs together. An independent reviewer inspected the same 14 files, the shared scenario and one existing reference screen from each of the web, Apple and Android v4 packets. This was followed by one consolidated correction batch and one confirmation inspection of the corrected compositions and both overview sheets. No application UI was implemented or exercised.

The independent review found one material labeling issue: the iPad confirmation showed only the three related existing items under `Current list`. The heading now says `Related items on your list`, accurately identifying the subset without adding unrelated rows. The review confirmed scenario quantities, selection counts, compatible aggregation, separate flour units and the offline/updated alternatives, with no observed clipping or overlapping text.

The consolidated batch also removed redundant all-caps eyebrow labels and the decorative vertical selection stripe, preserving the plain Smakopas composition. Main online lists now expose `From recipes` consistently; iPad's manual Milk contribution has an explicit edit affordance. Confirmation inspection found the corrected labels and controls readable within their allotted regions. The unrelated capture-flow packets were not edited.

## Artifact checks

- 14 SVG documents parse successfully; all 14 screen PNGs match their declared dimensions at 2x.
- Two overview PNGs show the five main list surfaces without altering their content.
- All 193 declared control regions are within their artboards and meet the intended minimum of 44 logical units on web/Apple and 48 on Android. These are drawing annotations, not actual hit regions.
- All four CJS drawing sources pass `node --check`.
- The main scenario has six rows, five to buy and one checked. Eggs are 4 + 2 = 6; Milk is 500 ml + 250 ml = 750 ml. The confirmation selects three ingredients, excludes one, creates one row and updates two. Cups and grams remain separate. Offline shows two pending checks and three checked rows.
- The updated-Milk alternative preserves the server's 500 ml and explains the rejected local check. It is intentionally separate from the illustrated offline example.
- The 50 web, 67 Apple and 56 Android files listed in the preceding packet manifests retain their original SHA-256 hashes.

Computed contrast for flat palette pairs: ink on white 16.71:1; muted on white 6.10:1; teal on white 5.08:1; pending amber on white 6.59:1; muted on the selected row 5.17:1; amber on the neutral status surface 5.80:1; selected Android navigation text on its container 8.21:1. These checks do not measure every blended glass pixel or establish WCAG conformance.

## Limits and follow-up

The Apple treatment illustrates Liquid Glass above opaque content. It is not a native system-material capture. Android controls likewise remain static Material-style drawings with genuine Material Symbols. Glyphs, target annotations and contrast calculations do not prove keyboard support, accessibility labels, focus order, VoiceOver/TalkBack operation or enlarged-text reflow.

Mockup copy is English under project artifact rules. Verify Polish localization, longer ingredient names, large lists, Dynamic Type/font scaling, dark appearance, reduced transparency and motion preferences during a separately authorized implementation. Web pages are full-page compositions; their varying heights do not assert a common browser viewport.

The intermediate recipe picker, manual-add/edit forms, removal confirmation, clearing confirmation, loading/empty/error/storage-failure/deleted-item states and every tablet/phone orientation are not all illustrated. The brief records the required behavior and distinguishes visible entry points from complete interaction designs.

T03 still requires physical-device durability evidence. Existing T09 capture-fidelity/evaluation gaps remain unchanged. The drawings do not complete those tasks or either readiness gate.

## Reusable review rule

When a confirmation shows only related existing shopping items, label it explicitly as a subset. Do not use a heading that implies the complete current list. Preserve unknown source quantities and separate incompatible units in every platform variant.
