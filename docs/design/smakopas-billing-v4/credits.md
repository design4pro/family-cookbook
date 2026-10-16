# Asset and scenario provenance

Date: 2026-10-16. This record covers static plan, allowance and subscription-state artwork for desktop web, mobile web, iPhone, iPad and Android phone. It continues the [onboarding asset record](../smakopas-onboarding-v4/credits.md) and the developer-supplied Smakopas direction documented in the [reference analysis](../smakopas-reference-analysis.md).

## Typography and platform assets

[Archivo](assets/archivo-latin.woff2) and its [SIL Open Font License](assets/archivo-license.txt) continue the established assets. The font originated in the supplied Smakopas build; [web v4 credits](../smakopas-web-v4/credits.md) record its license provenance. Archivo supplies content and web controls. The Latin subset supports these English artifacts, not a complete Polish production font bundle.

SF Pro Text supplies Apple chrome from the local `/Library/Fonts` installation. Its files are not copied or embedded. SVG labels require it at render time; PNG exports preserve the result. [Roboto Variable](assets/roboto-variable.ttf), with its [SIL Open Font License](assets/roboto-license.txt), supplies Android chrome. Original official Google Fonts URLs and checksums remain in the [Android download record](../smakopas-android-v4/source/downloads.json).

The retained icon set contains four SF Symbol variants and four Material Symbols, all used by the rendered artwork and recorded in [used-assets.json](source/used-assets.json). They were copied from onboarding v4. SF Symbols originate from AppKit's `NSImage(systemSymbolName:)`, with the existing [export script](source/export-symbols.swift) retained for provenance rather than rerun for this packet. They belong to the static Apple proposal rather than a cross-platform icon library.

Material Symbols Outlined originate in Google's [material-design-icons repository](https://github.com/google/material-design-icons), with the included [Apache 2.0 license](assets/material-symbols-license.txt). The [Android download record](../smakopas-android-v4/source/downloads.json) and [used-icon record](../smakopas-android-v4/source/used-icons.json) retain upstream URLs, checksums and source inventory.

Surfaces, rows, indicators and control outlines are authored static geometry. Apple glass is an illustration of intended material placement; Android Material treatment is not a native component implementation. Neither establishes touch semantics, dynamic color or accessibility behavior.

## Synthetic household, usage and billing states

[scenario.json](source/scenario.json) contains authored fixtures. Alex, Anna and Sam identify synthetic `example.com` accounts, not real people or billing customers. The viewer is Anna, designated payer; Alex is administrator. No private account or payment details, actual provider IDs, tokens or working checkout URLs are included.

Sample counts, Family usage, in-flight reservations and lifecycle dates are synthetic. The current paid window is 15 October to 15 November 2026, anchored to a fictional first activation on 15 July; the separate billing renewal and verified-through date is 20 October. Archive on 21 October is a future scenario, not an observation of the current clock or an executed expiry. Reservation release is an allowance event, not a financial refund.

The EUR 4.99 monthly and EUR 39 annual amounts are accepted pilot references from the [specification](../../family-cookbook-mvp/spec.md). They are not live Polar quotes, local tax calculations or finalized renewal terms. The annual checkout is an independent eligible Sample-state attempt, not a second subscription alongside the active monthly fixture. All payment and verification states are authored illustrations; no provider call, payment or cancellation was executed.

The contract is grounded in the [payment proposal](../../family-cookbook-mvp/payment-proposal.md), superseding [Polar-only decision](../../decisions/0001-polar-only-purchases.md), [T05 settlement evidence](../../evidence/t05.md), [T08 identity evidence](../../evidence/t08.md) and [T28](../../family-cookbook-mvp/implementation/tasks/t28-enforce-sample-and-paid-usage-windows.md), [T29](../../family-cookbook-mvp/implementation/tasks/t29-reconcile-provider-entitlements.md), [T30](../../family-cookbook-mvp/implementation/tasks/t30-purchase-and-manage-the-plan-on-web.md), [T31](../../family-cookbook-mvp/implementation/tasks/t31-purchase-and-restore-on-native.md), [T32](../../family-cookbook-mvp/implementation/tasks/t32-apply-archive-without-losing-shopping-checks.md) and [T33](../../family-cookbook-mvp/implementation/tasks/t33-replace-the-household-payer-after-expiry.md) task contracts. Historical store-purchase wording does not override Polar-only web purchase and native entitlement consumption.

Four overview sheets arrange the existing artboards: `phone-overview`, `wide-overview`, `usage-phone-overview` and `usage-wide-overview`. They add no product states.

## Research and evidence limits

The [Apple reference](../smakopas-native-v4/apple-reference.md) and [Android reference](../smakopas-android-v4/material-reference.md) are reused. No new claim is based on inaccessible guideline pages, and no current provider information was requested for this static packet.

No photographs, private recipe sources, recordings, portraits or generated imagery are used. No image-generation model was used. Static SVG geometry, fonts and platform symbols produce drawings, not an application, interactive checkout or native test. No application tests, secret reads or provider operations are part of creating this packet.

All 36 raster files carry embedded origin metadata: 28 artboards, four overview sheets and four SF Symbol assets. The final metadata scan found no missing entries. SVG sources, source modules and the artifact inventory preserve reproducibility.

The bounded static inspection is recorded in [visual-review.md](visual-review.md); user approval remains pending. Provenance does not establish visual approval, accessibility compliance, provider lifecycle correctness, allowance enforcement or native distribution eligibility. T03, T09 and both readiness gates retain their existing status.
