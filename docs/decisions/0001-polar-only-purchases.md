# ADR 0001: Polar is the only purchase channel

Date: 2026-10-15
Status: accepted by the developer during T08

## Decision

Use Polar as Merchant of Record and the sole purchase provider. Purchase and subscription management take place on the authenticated web experience. iOS and Android consume household entitlements from the backend after sign-in and explicit refresh. Remove Apple/Google in-app purchases and RevenueCat from implementation scope. Native clients do not advertise or link to external checkout in the baseline.

This explicitly supersedes the provider and native-purchase choices in the original Wayfinder billing research. Other resolved product decisions remain unchanged, including prices, allowances, payer succession, deletion and the two readiness gates. Stable task filenames remain unchanged for existing links; T31 now owns native entitlement consumption.

## Identity contract

Polar customer `external_id` is the canonical personal Better Auth user ID, never email, household ID or a shared login. A server-created purchase intent pins the payer, household, environment and organization before checkout. The server supplies its ID in `cookbook_purchase_intent_id` metadata. A verified subscription is permanently bound to that intent and household. Profile edits, account deletion, membership changes, restore/refresh and payer replacement cannot reassign it.

Verify subscriptions server-side against the selected environment, organization and product allowlist. Client callbacks and unverified webhook bodies cannot grant access. T29 implements authenticated, deduplicated webhook handling and reconciliation; T30 implements authenticated Checkout API sessions, cancellation, portal access and prevention of concurrent charges. Public checkout links used for isolated provider feasibility are not the production integration.

Minimal retained references are environment, organization, subscription, customer, product, intent, opaque payer and household IDs plus the verified entitlement period. Profile deletion removes the ordinary user link; it does not reassign billing ownership. O02 must define the legal basis, access controls and retention duration before live charges.

## Consequences and unresolved release conditions

The simpler single-provider integration removes native receipt restoration. Native refresh means querying the backend using the current authenticated identity. Real iOS/Android builds must still prove account switching, revocation, expiry and household isolation in T31/T48. This does not remove T03's physical-device blocker.

Store eligibility for this particular paid-web/free-companion product is not proven. Apple section 3.1.3(f) describes a limited companion-app exception; it must not be assumed to cover this cookbook. T31 and release review must document an accepted distribution route under current Apple and Google rules before native distribution or Gate 2 approval. If it cannot be supported, return to an explicit product decision. No early store submission, production rollout or charge is authorized.

## Sources checked

- [Polar sandbox](https://polar.sh/docs/integrate/sandbox): isolated environment and test payments.
- [Polar customer identity](https://polar.sh/docs/features/customer-management): external customer identity.
- [Polar Checkout API](https://polar.sh/docs/features/checkout/api): backend-created checkout sessions.
- [Polar checkout links](https://polar.sh/docs/features/checkout/links): link metadata propagates to sessions and subscriptions.
- [Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/): distribution constraints, including sections 3.1.3(b) and 3.1.3(f).
- [Google Play payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en): distribution review remains required.
