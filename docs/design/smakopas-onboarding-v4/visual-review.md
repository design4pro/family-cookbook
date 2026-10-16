# Static visual review

Date: 2026-10-16. Status: inspected and corrected as static artwork; awaiting user review and approval.

## Bounded review

A fresh independent general-purpose reviewer inspected all 25 screen PNGs individually, the four overview sheets, two preceding household overview sheets, the brief, scenario and Impeccable craft floor in one initial batch. The specialized Impeccable reviewer role was unavailable, so a generic agent substituted explicitly. The main agent inspected the overviews, verification and recovery states, invitation context and all ready states in the same round.

The independent review identified one material blocker: white labels on tinted Apple glass controls measured as low as 4.18:1. The main review added field-boundary contrast, account/flow exits and consistent sample-limit disclosure. One consolidated correction batch addressed all findings. A single confirmation round followed, restricted to those changes. The independent reviewer confirmed **SHIP for the named static contrast correction**, with a minimum measured ratio of 4.91:1. The main agent confirmed the other corrections visually and checked geometry. This is an internal artifact review, not user approval of the complete visual system.

| Finding | Correction | Confirmation |
| --- | --- | --- |
| White Apple CTA labels lost contrast after glass composition | Darkened the underlying tint to `#08695e` while retaining the highlight and glass edge | All seven tinted CTA labels exceed 4.5:1 in the measured rendered background region |
| Active white fields were difficult to distinguish from their background | Changed web and Apple field outlines from the separator color to `#5b636b`; decorative rules remain light | Email and Code boundaries are visible; the chosen flat outline color has 6.10:1 contrast on white |
| Creation did not expose account recovery consistently; some ready screens forced adding or inviting | Added `Sign out` to web creation and Apple creation/ready screens; added `Open cookbook` to web/Apple ready screens | The verified account can be changed before creation; onboarding can finish with an empty cookbook |
| The limited free sample was disclosed only on Android | Added usage-limit copy, including ten recipes, to web/Apple creation and ready; added the limits entry before creation | All five creation surfaces disclose limited access; the full limits view remains future design work |

No material clipping or text collision was observed in the inspected exports. Archivo, white surfaces, strong hierarchy and thin rules continue Smakopas. Apple glass remains on controls/navigation over opaque content; Android uses opaque Material surfaces. The iPad has a dedicated landscape layout. Mobile web artboards are full-page compositions, not fixed viewport promises.

## Rendered CTA contrast confirmation

The reviewer read the composed PNG background across each white label's vertical region with a two-pixel margin. This includes the gradient treatment rather than checking only the underlying tint. Antialiased glyph-edge pixels are not a substitute for the intended foreground/background contrast calculation.

| Artboard | Minimum measured ratio |
| --- | --- |
| iPhone Email | 4.92:1 |
| iPhone Create | 5.06:1 |
| iPhone Ready | 4.91:1 |
| iPhone Code recovery | 4.91:1 |
| iPad Email | 4.92:1 |
| iPad Create | 5.13:1 |
| iPad Ready | 4.92:1 |

These focused measurements do not establish WCAG conformance, contrast over every possible native backdrop or platform accessibility behavior.

## Artifact checks

- All 25 SVG documents parse, and all screen PNGs match their declared logical dimensions at 2x.
- Four overview sheets arrange existing screens without adding product states.
- All 101 declared control regions are within their artboards and meet intended minimums of 44 logical units on web/Apple and 48 on Android. They are annotations, not working hit areas.
- All four CJS drawing sources pass `node --check`.
- Four used SF Symbol variants and four Material Symbols remain after pruning unused working copies.
- All 33 raster files carry embedded origin metadata; the final scan reports zero missing entries.
- All 414 files listed in the six preceding Smakopas manifests retain their SHA-256 hashes.

## Behavior and remaining obligations

Request acknowledgement never claims inbox delivery. New and returning users share one sign-in path. The empty main code field avoids invented codes, cooldowns or remaining-attempt counters; only the mobile-web error alternative contains a fictional sample entry. No real message is sent and no identity is created.

Authentication, household creation and invitation acceptance remain separate operations. The invited alternative retains private link context without showing inaccessible household data. Creation follows online membership verification and explicitly assigns administrator/payer responsibilities without starting a subscription. The sample has usage limits, no card requirement, no countdown and no automatic renewal. Existing membership returns to the current cookbook.

These are SVG/PNG drawings, not browser screens, native views, accessible hierarchies or running forms. No application build, provider call, authentication operation, account mutation or functional test was performed. An HTML/CSS detector is not applicable to these artifacts. Static inspection cannot verify delivery, sessions, keyboard/paste/autofill, membership races or allowance enforcement.

Keyboard-open layouts, focus/error announcements, screen readers, Dynamic Type, zoom/reflow, longer addresses, Polish localization, Dark Mode and reduced transparency/motion still require design and implementation validation. The English artifact copy follows repository instructions. The detailed limits view and remaining recovery states are listed in the [brief](design-brief.md).

Reusable prevention rules are recorded in the brief and renderer comments: measure contrast after compositing, separate field outlines from decorative rules, provide account/flow exits and disclose sample limits consistently. The prior nonrecursive glass-scene rule remains intact. T03 and T09 retain their existing blockers; neither readiness gate changes.
