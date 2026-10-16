# Plans, allowances and subscription states

Date: 2026-10-16. Status: inspected static proposals awaiting user review. This Operate-mode packet continues Smakopas v4 with Apple Liquid Glass and Android Material adaptations. It does not approve a new DESIGN.md or implement billing. The [specification](../../family-cookbook-mvp/spec.md), [accepted payment contract](../../family-cookbook-mvp/payment-proposal.md) and superseding [Polar-only decision](../../decisions/0001-polar-only-purchases.md) remain authoritative.

## Deliverables and continuity

Twenty-eight artboards comprise Plan/Sample, Usage, Subscription and Archive on desktop web, mobile web, iPhone, iPad and Android phone, plus eight alternatives: desktop-web Checkout and Payer change; mobile-web Checking access, Cancel renewal confirmation and Renewal off; iPhone Image limit; iPad Grace; Android Refresh error. Four overview sheets arrange existing artboards: `phone-overview`, `wide-overview`, `usage-phone-overview` and `usage-wide-overview`. Each artboard has a static SVG and a PNG export at 2x.

The visual basis remains the inspected [Smakopas reference](../smakopas-reference-analysis.md) and [onboarding study](../smakopas-onboarding-v4/design-brief.md): Archivo, white content surfaces, restrained rules, clear type hierarchy and the existing teal accent. SF Pro Text supplies Apple chrome; Roboto supplies Android chrome. Static glass is restricted to Apple navigation and controls. Material surfaces remain opaque on Android. Wide layouts use their space explicitly rather than scaling phone forms. Plan settings remain a profile subflow, not another main destination.

## Shared fixture and separate states

[scenario.json](source/scenario.json) is the authored source of truth. Alex is administrator, Anna is payer and Sam is a member; the household has three of five members. The viewer is Anna, signed in as the synthetic `anna@example.com`. Aliases introduce no real people, family history or editable-profile feature.

The Sample screen is an earlier independent alternative for the same household: 8/10 recipes, 34/100 MB originals, 4/5 image pages, 7/10 dictation minutes and 12/20 assistant answers. Sample AI allowances are one-time household totals, not monthly grants; saved recipes and original storage are current capacity limits. No card, time countdown, subscription trial or automatic renewal is implied.

The main Family fixture is active beyond its welcome month. First paid activation is 15 July 2026. Its usage window runs from 15 October to 15 November 2026, with next reset at **15 November, 00:00 UTC**. Billing renewal and the separately verified entitlement-through date are **20 October 2026**. These are deliberately distinct from the allowance reset; no precise provider timestamp is invented for the date-only billing fixture.

| Resource | Consumed or stored | Reserved | Limit | Available for new work |
| --- | --- | --- | --- | --- |
| Saved recipes | 42 | Not applicable | 500 | 458 recipe places |
| Original assets | 164 MB | Not depicted | 1 GB | No storage-unit conversion inferred |
| Image pages | 14 | 2 | 50 | 34 |
| Dictation minutes | 18 | 0 | 60 | 42 |
| Assistant answers | 37 | 1 | 200 | 162 |

The overview and alternatives are not one continuous transaction history. Sample, eligible checkout, active coverage, renewal-off, Archive, grace and failed refresh are separate fixtures. The artwork proves no provider state or T28 allowance implementation.

## Allowance policy

Family has one feature set for monthly and annual billing: five people, 500 recipes, 1 GB originals, 200 image pages in the first paid usage month then 50 per usage month, 60 dictation minutes and 200 assistant answers per usage month. The 200-page welcome allowance replaces 50 for its first window; it is not 250 pages. Annual billing still uses monthly allowance windows and does not grant a year's units at once.

Windows follow the original paid-activation anchor, clamping short months from that original day. Display the server-provided next reset. There is no rollover. Reinstalling, changing payer, refreshing access, switching billing period or reactivating does not reset sample/welcome allowances or consumed units within the current window.

Available capacity subtracts both consumed and reserved units. Reservations identify pending work rather than completed usage. A failed job releases its reservation once; automatic technical retries do not charge another unit. An explicit retry of a failed job reacquires available capacity for the same logical operation and may remain blocked if another job used the released space. Deliberate new processing is a new requested operation with its cost shown beforehand. Releasing a quota reservation is not a monetary refund. [T05 evidence](../../evidence/t05.md) records the settlement core; [T28](../../family-cookbook-mvp/implementation/tasks/t28-enforce-sample-and-paid-usage-windows.md) still owns actual allowance categories and windows.

One image equals one page, audio uses accepted recording duration and an assistant answer is one completed user-requested response. Internal model calls and recovery copies do not inflate user units/storage. Manual corrections, cooking and shopping do not consume AI allowances. A limit blocks only its affected action. Storage overflow blocks additional uploads, not reads or export, and never silently removes originals.

## Web offer, checkout and management

Web may show **EUR 4.99/month** and **EUR 39/year** only as clearly labeled pilot reference prices. They are not a current localized quote, validated demand, tax calculation or final renewal disclosure. Actual price, taxes, period and renewal terms must be confirmed in Polar before purchase. There is one Family plan, no lifetime offer, top-up pack, per-device charge or extra paid tier.

Only the authenticated designated payer may start or manage their purchase. A server-created intent binds personal payer identity, household and provider environment before checkout. Active, grace or late-renewed coverage blocks a competing purchase. Administration alone does not grant access to payment details or another person's subscription controls.

The annual Checkout board is an independent eligible attempt from the Sample alternative, with Anna as payer and no active/grace coverage. It is not an annual upgrade purchase added on top of the main active monthly fixture. No real provider session or URL exists in the artwork. The checking-access board does not treat a success redirect as payment proof: existing Sample access remains until backend verification. Failed or canceled checkout preserves existing access and must not encourage a duplicate payment.

Cancel renewal is a confirmation before mutation; renewal is still enabled in that screen. Renewal off is a separate backend-verified alternative with active access through 20 October. Cancellation does not revoke the paid period immediately. Management and cancellation stay on authenticated web. [T30](../../family-cookbook-mvp/implementation/tasks/t30-purchase-and-manage-the-plan-on-web.md) defines the later checkout/portal behavior; this packet implements none of it.

## Native status and lifecycle alternatives

Native Plan is a neutral view of the current Sample and its limits, not a Family upsell. Native screens contain no prices, checkout links, commercial Polar action, QR codes, store-restore controls or purchase promotion. They consume verified backend status and offer `Refresh access`. [ADR 0001](../../decisions/0001-polar-only-purchases.md) supersedes older store-purchase wording; native distribution eligibility is still a separate release condition.

Archive is an independent future fixture dated 21 October after verified expiry. It retains all three members, all 42 recipes and sources, search, reading/cooking, downloads, export and check/uncheck of the eight existing shopping items, including permitted offline checks. New recipes, uploads, edits, AI and new shopping additions require renewed access. Export and privacy deletion never require payment. Do not reduce the collection to ten recipes or erase pending shopping checks. The prior usage history survives renewal.

The iPhone limit alternative has 50/50 image pages consumed and no image reservation. Only further extraction is blocked; other allowances and permitted functions remain available. The reset remains 15 November, 00:00 UTC, without an upsell on native.

The iPad grace alternative explicitly assumes backend-verified temporary access but invents no grace duration or ending timestamp. It offers refresh, not commercial management. The Android error has an unknown fresh status and clearly labeled last-known Active access verified on 16 October. Failure to refresh does not establish expiry, newly verified access or an automatic transition to Archive.

## Payer change and remaining work

The payer-change alternative shows Anna as current payer, Sam as the accepted nominee and renewal off, while the old entitlement is still active. Sam's acceptance is not authorization for an automatic future charge. New checkout stays blocked during active/grace/late-renewed coverage; only its verified end permits Sam's explicit new purchase. Do not promise a fixed purchase-start time. The same household and usage history survive without transferring subscriptions/cards, prorating or granting welcome again. [T33](../../family-cookbook-mvp/implementation/tasks/t33-replace-the-household-payer-after-expiry.md) owns the later execution.

The main boards are payer views. The existing [non-payer account views](../smakopas-household-v4/README.md) show payer identity without purchase management. A complete non-payer version of these detailed subscription screens remains future design work; it must keep limits/reset and payer information while hiding payment details and management actions. Storage-full, welcome-month, exact provider refund/revocation transitions, failed cancellation, portal return, missed-event recovery, offline/stale state and full payer nomination are not completely depicted. Grace duration and refund effects must come from a verified lifecycle contract, not guessed policy. [T08](../../evidence/t08.md) proves identity isolation and sandbox evidence, not the complete checkout/lifecycle; T28-T33 remain unimplemented planning tasks.

The packet reuses the [Apple](../smakopas-native-v4/apple-reference.md) and [Android](../smakopas-android-v4/material-reference.md) platform research. The bounded static inspection is recorded in [visual-review.md](visual-review.md). No application tests or provider operations were performed. Keyboard/focus order, accessible usage announcements, non-color status cues, screen readers, text scaling, responsive reflow, Polish localization, system insets and reduced-transparency/motion preferences need later validation. Static geometry is not accessibility or native-runtime evidence.

## Reusable review checks

Check text against its actual surface, including selected navigation backgrounds and composited glass. A token that passes on white may fail on a tinted selection. The iPad selected label uses `#0b7469` on `#e2efeb`; the default accent remains appropriate on white. Preserve the renderer's nonrecursive glass-scene guard.

Use “Sample AI allowances” for one-time image, audio and assistant totals. Recipe places, original-file storage and household places are current capacity limits, not permanently consumed sample units. Keep these categories distinct in copy as well as in data.

T03 and T09 retain their existing blockers, and both readiness gates remain unchanged. This study authorizes no production resources, real purchase, account mutation, implementation or new visual-system approval.
