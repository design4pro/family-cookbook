# Asset and scenario provenance

Date: 2026-10-16. This record covers the static Household and Account study across desktop web, mobile web, iPhone, iPad and Android phone. Its primary visual reference remains the developer-supplied Smakopas project at `/Users/rafalwolak/dev/cloudflare/smakopas.pl-old/apps/review/`, documented in the [reference analysis](../smakopas-reference-analysis.md). It continues the [assistant v4 asset record](../smakopas-assistant-v4/credits.md) and preceding web/native studies.

## Typography and symbols

[Archivo](assets/archivo-latin.woff2) and its [SIL Open Font License](assets/archivo-license.txt) continue the established assets. The font originated in the supplied Smakopas build; license provenance is recorded in [web v4 credits](../smakopas-web-v4/credits.md). Archivo supplies content and web controls. This Latin subset supports the English artwork and is not a complete Polish production font bundle.

SF Pro Text supplies Apple chrome from the locally installed font under `/Library/Fonts`; its font files are neither copied nor embedded. SVG labels depend on that font at render time, while PNG exports retain the rendered result. [Roboto Variable](assets/roboto-variable.ttf), with its [SIL Open Font License](assets/roboto-license.txt), supplies Android chrome. Its original source is the official Google Fonts repository, recorded with exact URLs and checksums in the [Android download record](../smakopas-android-v4/source/downloads.json).

Apple icons are actual SF Symbols exported through AppKit's `NSImage(systemSymbolName:)` using [export-symbols.swift](source/export-symbols.swift). The working export contains 27 symbols in four color variants; the packet retains the 13 used variants listed in [used-assets.json](source/used-assets.json). These assets belong to a static Apple-platform proposal, not a cross-platform icon library or working native control set.

Android uses Material Symbols Outlined SVGs copied from the established Android inventory. Google's [material-design-icons repository](https://github.com/google/material-design-icons) is the original source, with the included [Apache 2.0 license](assets/material-symbols-license.txt). Exact upstream URLs/checksums and the source inventory remain in the [download record](../smakopas-android-v4/source/downloads.json) and [used-icon record](../smakopas-android-v4/source/used-icons.json). The packet retains the five used Material Symbols listed in [used-assets.json](source/used-assets.json).

Rules, rows, surfaces and control outlines are authored static geometry. Apple glass is an illustration of intended material placement, not an operating-system rendering. Android Material treatment does not establish native components, dynamic color or accessibility semantics.

## Synthetic identities and state

[scenario.json](source/scenario.json) is authored fixture data. Alex, Anna, Sam and Jordan are aliases for synthetic `example.com` addresses. These labels do not identify real people or introduce editable names, photographs, family relationships or new source attribution. No real invitation recipient or account data was used.

The main fixture has three members, separate administrator Alex and payer Anna, and one pending invitation for Jordan. Pending invitations are not membership or reserved places. The invitation-created view uses the placeholder `Private invitation link`; it contains no real bearer token or application domain. No message is sent or delivered by these drawings.

Family Active is a synthetic verified-access state, not an observed payment. Join, invitation creation, pending handover, unavailable invitation and removal confirmation are authored states, not records of executed operations. The invitation form precedes Jordan's invitation in the same three-member household; it does not depict household creation. No account, member, purchase or contribution was changed to generate the artwork. Four overview sheets arrange the existing artboards: two Household overviews and two Account overviews; they add no new product state.

The behavior comes from the [canonical specification](../../family-cookbook-mvp/spec.md), [T10 evidence](../../evidence/t10.md), [T11 evidence](../../evidence/t11.md) and current [household contract](../../../apps/api/src/households/contract.ts). Older continuity documents mentioning superseded purchase providers do not override the current Polar-only specification.

## Research and artwork limits

The packet reuses the established [Apple reference](../smakopas-native-v4/apple-reference.md) and [Android reference](../smakopas-android-v4/material-reference.md). No new claim is based on inaccessible platform guideline content.

There are no photographs, private source pages, recordings, generated portraits or recipe images. No image-generation model was used. Static SVG geometry, local fonts and platform symbols are composed into artwork; they do not create an application, interactive prototype, network request or native test.

Static inspection and its bounded correction pass are recorded in [visual-review.md](visual-review.md). User approval remains pending. Provenance establishes the origin of assets and fixtures; it does not establish visual approval, accessibility compliance, correct authorization or functional behavior. T03, T09 and both readiness gates retain their existing status.
