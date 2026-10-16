# Asset and scenario provenance

Date: 2026-10-16. This record covers static email-code sign-in and household-creation artwork for desktop web, mobile web, iPhone, iPad and Android phone. It continues the [household asset record](../smakopas-household-v4/credits.md) and the developer-supplied Smakopas reference documented in the [reference analysis](../smakopas-reference-analysis.md).

## Typography and symbols

[Archivo](assets/archivo-latin.woff2) and its [SIL Open Font License](assets/archivo-license.txt) continue the established Smakopas assets. The original font was copied from the supplied reference build, with license provenance recorded in [web v4 credits](../smakopas-web-v4/credits.md). Archivo supplies content and web controls. The Latin subset supports these English artifacts; it is not a complete Polish production font bundle.

SF Pro Text supplies Apple chrome from the locally installed font under `/Library/Fonts`. Font files are not copied or embedded. SVG labels require the local font at rendering time; PNG exports preserve its rendered appearance. [Roboto Variable](assets/roboto-variable.ttf), with its [SIL Open Font License](assets/roboto-license.txt), supplies Android chrome. Its official Google Fonts source URLs and checksums remain in the [Android download record](../smakopas-android-v4/source/downloads.json).

Apple icons are actual SF Symbols exported through AppKit's `NSImage(systemSymbolName:)` using [export-symbols.swift](source/export-symbols.swift). The exporter supports 27 symbols in four color variants. Only the four used variants are retained in this packet. They are assets for a static Apple proposal, not proof of native controls or a cross-platform icon library.

Android uses Material Symbols Outlined SVGs from the established Android inventory, originally from Google's [material-design-icons repository](https://github.com/google/material-design-icons), with the included [Apache 2.0 license](assets/material-symbols-license.txt). Exact source URLs/checksums and the source inventory remain in the [download record](../smakopas-android-v4/source/downloads.json) and [used-icon record](../smakopas-android-v4/source/used-icons.json). Only the four used Material Symbols are retained in this packet.

Surfaces, fields, separators and control outlines are authored static geometry. The Apple glass treatment is an illustration, not operating-system rendering. Material styling does not establish native component behavior, dynamic color or accessibility semantics.

## Authored identities and states

[scenario.json](source/scenario.json) is synthetic fixture data. Alex and Jordan label `example.com` addresses; they are not real recipients, user profiles or account records. Main code fields are empty. The mobile-web error alternative alone contains the fictional sample entry `104928`; it is never a real OTP. No invitation token, sender address, application domain, API key or private data is included.

The request, verification, household-creation and error states are authored illustrations rather than network observations. `Code requested` does not mean delivered. The main ready fixture has one member, zero recipes, Alex as administrator/designated payer and no started subscription. Its card-free sample copy comes from the approved specification, not an executed allowance or purchase test.

The invited alternative retains only private-link context and the user's own address. It does not expose a household preview or prove invitation validity. The existing-household alternative is a separate online-membership fixture, not a second creation in the main sequence. Four overview sheets arrange existing artboards: two for sign-in and two for creation; they add no product states.

Behavior is grounded in the [specification](../../family-cookbook-mvp/spec.md), [T07 evidence](../../evidence/t07.md), [session contract](../../runbooks/auth-session-proof.md), [T10 evidence](../../evidence/t10.md), current [auth configuration](../../../apps/api/src/auth/auth.ts) and [membership implementation](../../../apps/api/src/households/membership.ts). Existing proof restrictions do not define a new production sender, public recipient policy or released onboarding flow.

## Research and artwork limits

The established [Apple reference](../smakopas-native-v4/apple-reference.md) and [Android reference](../smakopas-android-v4/material-reference.md) are reused. No new claim is based on inaccessible guideline content.

No photographs, private source pages, recordings, portraits or recipe imagery are included. No image-generation model was used. Static SVG geometry, fonts and platform symbols produce artwork, not an application, interactive prototype, email send, account mutation or native test.

The bounded static inspection is recorded in [visual-review.md](visual-review.md); user approval remains pending. Provenance does not establish approval, accessibility compliance, delivery, authentication correctness, autofill or functional behavior. T03, T09 and both readiness gates retain their existing status.
