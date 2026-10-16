# Static visual review

Date: 2026-10-16. Status: inspected and corrected as static artwork; awaiting developer feedback and approval.

## Bounded review

A fresh independent general-purpose reviewer inspected all 24 screen PNGs, the two preceding shopping overview sheets, the design brief, scenario and Impeccable craft floor in one batched round. The specialized Impeccable finish-reviewer role was unavailable, so this general reviewer substituted for it. The main agent inspected the household/account overview sheets and invitation, joining and supplemental screens in the same initial round.

The initial disposition was `fix`, with three material findings. One consolidated correction batch addressed them. A single confirmation round covered the seven named affected PNGs. The independent final disposition was **`ship` for the static packet**, with all three findings resolved. This is an internal artifact review, not user approval of the complete visual system.

| Finding | Correction | Confirmation |
| --- | --- | --- |
| Some iPad buttons and later content disappeared | The SVG glass helper no longer samples its own containing scene. Only the separate chrome layer may sample the completed scene. | Household invitation CTA and administration link, Invite copy CTA and conditions, Account allowance action, and the Handover right column are visible. |
| Unavailable invitation named an inaccessible sender and asserted a new link was necessary | The screen shows only the recipient's own email, explains the generic failure, offers reviewing the link/retrying or returning to Account, and makes a replacement link conditional. | No sender identity is disclosed; recovery matches the available information. |
| Native fresh-link screens omitted its one-time availability | iPhone, iPad and Android explicitly tell the administrator to copy before leaving because the link cannot be recovered later. | The warning appears below Copy invitation link on all three native surfaces. |

The same batch standardized the export entry to `Export cookbook`, changed web `Decline` to `Not now` to avoid implying an unsupported rejection state, and exposed Anna's membership-removal entry on web consistently with native. Main-thread confirmation inspected these changes. The existing confirmation requirement still applies before any membership removal.

No material text overflow was observed in the reviewed exports. Archivo, white surfaces, strong headings and thin rules continue Smakopas. Apple glass is restricted to controls and navigation over opaque content; Android uses opaque Material treatments. The iPad uses a dedicated landscape layout. Synthetic labels remain visible on standalone screens.

## Content boundaries

Alex is administrator, Anna is payer and Sam is an ordinary member. Three members occupy three of five places. Pending Jordan does not reserve a place. The fresh invitation state says no email was sent; copying and sharing are explicit. The older pending row offers revocation, not recovery of its secret token.

Before acceptance, Join shows only Jordan's verified account and a pasted masked link/code. Member data, issuer, expiry and live occupancy are not exposed. This privacy boundary was corrected against the authenticated API before the first render. Invitation failure likewise does not disclose those fields or pretend to know its precise cause.

Handover remains pending until Sam accepts and does not change payment or recipe attribution. Removing Sam ends membership but preserves the account, contributions and purchase obligations. Account deletion remains a separate future review flow; no single-click deletion or whole-household erasure is depicted. Native screens contain no checkout promotion.

## Artifact checks

- All 24 SVG documents parse and their PNG exports match the declared logical dimensions at 2x.
- Four overview sheets arrange the household and account artboards; individual files remain the full-resolution reference.
- All 164 declared control regions are inside their artboards and meet the intended minimum of 44 logical units on web/Apple and 48 on Android. These annotations are not working hit areas.
- All four CJS drawing sources pass `node --check`.
- Thirteen used SF Symbol variants and five Material Symbols remain after pruning. All 41 raster files carry embedded origin metadata; the scan reports zero missing entries.
- The 50 web, 67 Apple, 56 Android, 70 shopping and 81 assistant files listed in the preceding manifests retain their SHA-256 hashes.

Flat foreground/background contrast checks: ink on white 16.71:1, muted on white 6.10:1, teal on white 5.08:1 and amber on white 6.59:1. These do not evaluate every blended glass pixel, field boundary or state, and are not a WCAG conformance claim.

## Limits and handoff

These are SVG/PNG drawings, not browser screens, native views, live household records or accessible view hierarchies. No application build, provider call, invitation delivery, account mutation or functional test was performed for this design request. An HTML/CSS detector is not applicable to these artifacts.

Keyboard-open layouts, focus order, VoiceOver/TalkBack, Dynamic Type, zoom/reflow, Polish localization, long email addresses, Dark Mode and reduced transparency/motion remain implementation-time validation obligations. The English copy follows repository artifact rules. Mobile web files are full-page compositions rather than fixed viewport promises.

Full deletion/export review, member-only and payer-specific settings, capacity/network failures, administrator claims and the remaining states are documented in [design-brief.md](design-brief.md). The package does not claim exhaustive interaction coverage. T03 and T09 retain their existing blockers; neither readiness gate changes.

Reusable prevention rules are recorded in the brief and the glass helper's source comment. Future authors must preserve pre-membership data boundaries, fresh-link recovery limits and nonrecursive scene composition.
