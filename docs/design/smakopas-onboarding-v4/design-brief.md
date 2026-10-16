# Email sign-in and household creation

Date: 2026-10-16. Status: static proposals visually inspected and corrected; awaiting user review. This Operate-mode packet continues Smakopas v4, with Apple Liquid Glass and Android Material adaptations. It does not approve a new DESIGN.md or authorize implementation. The [MVP specification](../../family-cookbook-mvp/spec.md), [T07 evidence](../../evidence/t07.md), [session contract](../../runbooks/auth-session-proof.md) and [T10 evidence](../../evidence/t10.md) define its boundaries.

## Deliverables and visual continuity

Twenty-five artboards comprise Email, Code, Create household and Household created on desktop web, mobile web, iPhone, iPad and Android phone, plus five alternatives: mobile-web Code error and Retained invitation, iPhone Code expired, Android Request error and Existing household. Each has a static SVG and a PNG export at 2x. Four overview sheets arrange existing artboards: two for sign-in and two for creation. Supplemental states are alternatives rather than one continuous sequence.

The composition continues the [Smakopas reference](../smakopas-reference-analysis.md) and [household study](../smakopas-household-v4/design-brief.md): Archivo, strong type hierarchy, white surfaces, restrained rules and the established teal accent. SF Pro Text supplies Apple chrome, with a static glass projection on navigation and controls. Roboto supplies Android chrome with opaque Material surfaces. Form content remains opaque and legible. The iPad receives an explicit landscape layout rather than a stretched phone form.

## Main scenario

[scenario.json](source/scenario.json) is the authored source of truth. Alex and Jordan label synthetic addresses, not real accounts or editable profiles. The main path uses `alex@example.com`:

1. **Email:** Alex is unauthenticated and requests a code. New and existing users use the same flow; the response does not reveal whether an account exists.
2. **Code:** the request is acknowledged without claiming inbox delivery. One empty `Six-digit code` field replaces fragmented digit boxes. `Verify and continue` is disabled until six digits are entered and while a request is running. All main Code screens have an empty field. Only the separate mobile-web code-error alternative shows the fictional entry `104928`; it is authored sample text, never a real OTP.
3. **Create household:** Alex has a verified session and an online membership result showing no household. The screen explains the action before explicit `Create household`. It does not collect a household name, avatar, profile name, card or chosen role. `Use an invitation` is a separate path.
4. **Household created:** the fixture has one of five possible members and zero recipes. Alex is both administrator and designated payer. `Card-free sample` and `No subscription started` distinguish this state from a paid purchase.

`Sign out` lets a verified person change account before creation. After creation, `Open cookbook` ends onboarding without forcing a recipe upload or an invitation. Signing in does not create a household automatically. Creation does not start a subscription or authorize a charge. The sample has no card requirement, time countdown or automatic renewal; it is application access rather than a provider trial. Creation discloses that usage limits apply, including ten saved recipes, and exposes `View sample limits`. The accepted sample also permits five members, 100 MB of originals, five image pages, ten audio minutes and twenty assistant answers in total. The detailed limits view remains separate future design work. The artwork does not establish T28 allowance implementation or promise lifetime hosting. No prices or native external-checkout promotions appear.

## OTP and request boundaries

The current [auth configuration](../../../apps/api/src/auth/auth.ts) uses six-digit codes with a 300-second lifetime, three wrong attempts and a configured send limit of ten requests per 60 seconds. A code is single-use. Requesting another code generates a new one; `Send a new code` and `Use the latest code` communicate that behavior. No fixed resend cooldown or countdown is invented. Rate limiting must be represented using the actual response, not a fabricated remaining time or remaining-attempt count.

`Code requested` and `Check your inbox` do not assert receipt. A successful send response is identical for existing, new and unapproved proof recipients; the test allowlist and test sender are not the final onboarding policy. The present adapter boundary also does not reliably expose provider delivery failures to the screen. A dedicated delivery-failure contract and monitoring remain future work; artwork cannot claim that gap is resolved. The Android request-error example therefore represents transport/request uncertainty, not a diagnosed failure to deliver email.

Correct OTP verification creates a session and, for a new user, their account. A valid session is distinct from household membership. The current generic failure copy is `Invalid or expired code. Request a new code.` The code-error and code-expired alternatives retain that distinction without claiming the UI knows a more specific cause. The Android request failure preserves Alex's entered address and offers retry without reporting success.

`Change email` returns to requesting a code for the selected address; an earlier address's code does not transfer. The intended single field supports paste and platform one-time-code assistance, but T07 did not prove native OS autofill. Keyboard and assistive-technology behavior require implementation testing.

## Invitations and existing membership

The mobile-web invited alternative uses `jordan@example.com` and retains private invitation context through authentication. It shows no real token or domain, issuer, other members, expiry or capacity. The current API provides no pre-membership lookup exposing those household facts. Process rule: never move member-only data onto a pre-authentication or pre-membership screen.

After OTP, refresh membership and continue to a separate explicit join review, as established in the [household packet](../smakopas-household-v4/design-brief.md). Sign-in neither accepts the invitation nor creates a competing household. The verified address must match the invitation, and validity, issuer authority, existing membership and capacity are rechecked when Join is submitted. A pending link is context, not proof that acceptance will succeed.

The Android existing-household alternative follows an online membership refresh revealing an existing membership, either for a returning user or after a competing creation. `Open cookbook` returns to that household. It does not create a second one or expose other members' details in this study. Its state is independent of the main new-household fixture.

## Remaining states and verification

The packet does not complete malformed-email validation, rate-limit recovery, exhausted attempts, concurrent resend/verification, lost responses, reconnect/session recovery, rejected invitation or every membership race. Detailed provider-delivery reporting remains a contract gap. No social sign-in, password, passkey, final sender/domain, legal checkbox, purchase flow or unrequested profile field is introduced.

The prior [Apple reference](../smakopas-native-v4/apple-reference.md) and [Android reference](../smakopas-android-v4/material-reference.md) supply reused platform research; no claim is based on inaccessible guideline pages. Future checks must cover keyboard-open layouts, actual keyboard/system insets, single-field paste and autofill, error announcements, focus order, screen readers, text scaling, responsive reflow and Polish localization. Dark Mode and reduced transparency/motion also need validation. Drawings establish neither working controls nor accessibility compliance.

The bounded visual inspection and correction are recorded in [visual-review.md](visual-review.md). User approval remains separate. No real email, session, account, household or purchase is created. T03 and T09 retain their existing blockers, and both readiness gates remain unchanged.

## Prevention rules

Measure text contrast after composing translucent controls; a passing base tint alone is insufficient. Keep active field boundaries distinguishable from decorative separators. Before a one-household creation, expose a route to change the verified account, and provide a non-destructive exit after completion. When presenting the sample, disclose its usage limits consistently across surfaces.
