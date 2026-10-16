# Household and account study

Date: 2026-10-16. Status: static proposals visually inspected and awaiting user review. This Operate-mode packet continues the established Smakopas v4 direction, with Apple Liquid Glass and Android Material adaptations. It neither creates a new visual system nor authorizes implementation. The [MVP specification](../../family-cookbook-mvp/spec.md), [T10 membership evidence](../../evidence/t10.md) and [T11 administration evidence](../../evidence/t11.md) define the behavior; [PRODUCT.md](../../../PRODUCT.md) retains product authority.

## Deliverables and composition

Twenty-four artboards comprise Household, Invitation created, Account and Join household on desktop web, mobile web, iPhone, iPad and Android phone, plus four supplemental alternatives: mobile-web Create invitation, mobile-web Invitation unavailable, iPad Pending handover and Android Remove member confirmation. Each is a static SVG with a PNG export at 2x. Four overview sheets arrange existing artboards: two for Household and two for Account. Alternatives do not represent one consecutive sequence of mutations.

Archivo, white reading surfaces, restrained rules, clear proportions and the existing teal accent continue the [Smakopas reference](../smakopas-reference-analysis.md) and [assistant study](../smakopas-assistant-v4/design-brief.md). SF Pro Text supplies Apple chrome and Roboto supplies Android chrome. Glass remains on Apple navigation and controls; member details and consequential actions remain on opaque surfaces. Android uses opaque Material treatments. The iPad receives an explicit landscape composition.

Household and Account are profile subflows. Cookbook, Assistant and Shopping remain the only main destinations; settings do not become a fourth tab. The design introduces no editable display name, profile photograph, household rename, custom role or multiple-household switcher.

## Shared synthetic household

[scenario.json](source/scenario.json) is the shared fixture. Alex (`alex@example.com`) is administrator, Anna (`anna@example.com`) is a member and payer, and Sam (`sam@example.com`) is a member. The household has three of five permitted members. Jordan (`jordan@example.com`) has a pending invitation, not membership. These names are synthetic address aliases, not a new editable-profile feature, family relationships or recipe-author attribution.

Administrator and payer are separate responsibilities. Administration manages membership and succession; the payer controls their own purchase. Every member retains the accepted recipe-editing permissions. Alex's administrative status does not authorize managing Anna's payment method or purchase. A pending invitee has no household access and consumes no member place.

The Account state assumes backend-verified `Family · Active` access with Anna as payer. It is a synthetic entitlement fixture, not a purchase observation. It includes no price, balance, reset date or fabricated allowance usage. Allowances are a navigation destination rather than an invented quota table.

## Invitation creation and acceptance

The administrator creates an invitation for a specific email address. The fresh success state offers copying a private link, displays seven-day validity and explains that no email has been sent. The sender must share the link with the named recipient. `Private invitation link` is an intentional visual placeholder: no real token, working domain or final branding is included.

An invitation is single-use and requires the recipient's verified session email to match the normalized invited address. A user cannot join while already holding an active household membership. Invitations do not reserve seats; capacity is checked again atomically on acceptance. The household remains at three members until an explicit successful join, after which Jordan would become an ordinary fourth member.

Only the administrator sees the pending invitation list and can revoke a pending invitation. Its metadata contains the email and expiry, not a recoverable raw token. The immediate creation result may show `Copy link`; an old pending row must not imply that its link can be recovered or that an email can be resent. No delivery or read receipt is claimed. When administration actually changes, invitations issued by the previous administrator are invalidated.

Join is a separate recipient view. It shows Jordan's own signed-in email and verified account status, a masked pasted `Invitation link or code`, and the explicit Join action. It does not expose other members, their email addresses, the issuer, invitation expiry or household capacity before acceptance. The current API has no pre-membership lookup returning those fields. Matching email, valid invitation, existing membership and capacity are checked at Join; the screen must not claim those checks have already passed. Internally the fixture has three members, Jordan has no existing household and the invited email matches, but those assumptions are not an invitation-preview response.

Opening the link alone does not create membership. Successful explicit acceptance joins as `Member`. Native clients may accept a pasted link/code; this packet introduces no universal-link domain or automatic app-opening promise. Process rule: verify each depicted field against the data available at that authorization boundary; never move member-only information onto a pre-membership screen. This correction precedes rendering and does not introduce a new API capability.

The mobile-web unavailable alternative is named `web-mobile-expired` in the artifact set but displays `Invitation unavailable`. Its generic UI reflects the current API boundary: the failure may involve email, expiry, revocation, prior use, capacity, existing membership or issuer authority. The artwork does not present a precise expiry diagnosis supplied by the API. Failed acceptance shows no successful membership change.

## Account boundaries and consequential actions

Account shows Alex's read-only email, verified household plan state and payer, navigation to allowances/export, separate leave/delete-account entry points and sign-out. It does not offer edits to unsupported profile fields. Native screens contain no external-checkout promotion. Polar is the sole purchase channel on web; an administrator cannot manage another person's purchase merely by holding that role.

Leaving removes membership and server access while preserving the account, contributions and purchase obligations. Because Alex is administrator and other members remain, leave requires a completed, recipient-accepted handover. A pending handover is insufficient. Previously downloaded exports cannot be remotely recalled.

Deleting the account is a separate flow. Its entry point must open reauthentication and a precise preview of affected content and billing, followed by explicit confirmation. It never means immediate deletion on entry. Export and administration handover are optional; account deletion must not wait for another member's acceptance or subscription expiry. The full deletion preview, retained-billing disclosures, processing/failure states and completion experience are not depicted and require further design before implementation. No whole-household erase action is introduced.

## Supplemental alternatives

Create invitation shows the same three-member household before Jordan's invitation exists. Alex remains administrator, Anna remains payer and Sam remains a member. The email field contains `jordan@example.com`; `Create invitation` creates the email-bound, single-use link with seven-day validity and no automatic email delivery. The `web-mobile-create` filename always denotes invitation creation in this packet. Household creation is outside its scope; artifact suffixes must not be used to infer an additional flow.

Pending handover shows Sam nominated after Alex's reauthentication. One request awaits acceptance for up to seven days; Alex remains administrator and may cancel. No acceptance means no role change. Acceptance would leave Alex as a member and preserve Anna's payer status, authorship, purchases and allowance history. The existing contract uses in-app notices; no handover email or push delivery is promised. Recipient acceptance, expired requests and administrator-deletion succession are not fully illustrated here.

Remove member is an Android confirmation for Sam, initiated by Alex. Before confirmation all three memberships remain. Confirming removes Sam's household access immediately, preserves Sam's account and contributions and does not cancel or transfer a purchase. Already downloaded exports cannot be recalled. The cancel action preserves membership. The drawing is not evidence of an executed removal or access-revocation test.

## Remaining states and validation boundary

The packet does not complete capacity-full, network failure, revoked-session, stale-member-list, duplicate/competing acceptance, member-only/payer-only settings, administrator-claim, handover verification/acceptance, export, complete account deletion or payer-replacement flows. Creating invitations and changing membership require connectivity; offline editing is not introduced. Future errors must preserve useful input without claiming success or presenting a stale privilege as authority.

The prior [Apple reference](../smakopas-native-v4/apple-reference.md) and [Android reference](../smakopas-android-v4/material-reference.md) supply the reused platform research. No new claim is based on inaccessible guideline pages. The [visual review](visual-review.md) records one inspection, one correction batch and one confirmation pass; it does not establish user approval. Actual keyboard/focus order, screen-reader labels, text scaling, responsive reflow, system/keyboard insets, Polish localization, Dark Mode and reduced transparency/motion require later verification. Drawn controls establish neither native behavior nor WCAG compliance.

T03 and T09 remain open with their existing blockers, and both readiness gates are unchanged. No application feature, provider setup, real invitation, account mutation, purchase, production release or store submission is authorized by this packet.

## Reusable authoring rules

Check each visible field against the viewer’s access before drawing invitation or account screens. Do not infer a new flow from an artifact filename suffix. State that a newly created invitation link must be copied before leaving on every platform. In SVG artwork, never sample a group from a glass control contained inside that same group; only the separate chrome layer may reference the completed scene. These rules prevent pre-membership disclosure, scope drift, lost-link confusion and recursive rendering defects.
