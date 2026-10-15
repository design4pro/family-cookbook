# Household subscription feasibility

Research date: 2026-10-15. Documentation research only; no sandbox purchase, account configuration, tax assessment or store approval was performed. Product decisions below are recommendations, not validated willingness to pay.

## Recommended integration

Use one RevenueCat project and one `family_plus` entitlement, with annual products in Apple App Store, Google Play and Stripe Billing. Use `react-native-purchases` in Expo development builds, and RevenueCat Web SDK with its Stripe Billing integration on the website. Expo Go cannot exercise real native purchases. RevenueCat currently supports Stripe checkout through its web flows and unlocking mobile entitlements. This avoids implementing three receipt-validation systems. [Expo IAP](https://docs.expo.dev/guides/in-app-purchases/), [RevenueCat Stripe Billing](https://www.revenuecat.com/docs/web/integrations/stripe)

Require sign-in before purchase. Use the payer's immutable application user UUID as RevenueCat App User ID on every platform. Custom identifiers enable cross-device entitlement access; anonymous identities do not reliably provide this. Never use an email address or a shared family login as the billing identity. [Customer identity](https://www.revenuecat.com/docs/customers/identifying-customers)

The household is our own domain model: one owner/payer and four invited members, five people total. D1 associates `billing_owner_user_id` with a household, then authorizes members against that household's paid status. RevenueCat validates the payer's subscription; it does not implement our invitations, roles or membership cap. This is application-level household access, not Apple Family Sharing. Only the owner purchases, and checkout is suppressed while a subscription already exists on another channel. An active subscription and ownership transfer cannot be silently moved to another member in MVP; account recovery handles exceptions.

## Store constraints

Offer native IAP for the digital subscription inside iOS and Android. Apple permits access to purchases made on another platform when equivalent items are available through IAP. Google generally requires Play Billing for in-app digital sales, with specified exceptions. Do not depend on regional external-payment exceptions or classify an interactive cookbook as a reader app without review. Website checkout remains available on the website; mobile purchase UI uses its native store. [Apple review guidelines, 3.1](https://developer.apple.com/app-store/review/guidelines/#payments), [Google Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en)

Provide Restore purchases and an authenticated account recovery path. Recommend RevenueCat's Keep with original App User ID setting because household ownership is strict and login precedes checkout. This prevents a shared device from moving a subscription between unrelated application accounts. The tradeoff is support for forgotten accounts and receipt ownership conflicts; RevenueCat explicitly warns about this behavior. Verify server-notification identity settings in sandbox. [Restore behavior](https://www.revenuecat.com/docs/projects/restore-behavior)

## Lifecycle and consistency

Authenticate RevenueCat webhooks, persist their event IDs, and refresh the affected subscriber through the server API before updating D1. RevenueCat recommends this refresh pattern; webhooks can be duplicated or delayed. After checkout/restore, the backend also refreshes status so users need not wait for notification delivery. Periodic reconciliation repairs missed events. The app never treats a success redirect or client boolean as payment proof. [Webhook handling](https://www.revenuecat.com/docs/integrations/webhooks)

Cancellation normally disables renewal while access remains through the paid period. Billing issues can retain access during grace. Refunds do not universally disable auto-renewal or revoke access: read current entitlement status. Handle expiration and refund reversals through the same refresh path. For Stripe renewal gaps, re-check RevenueCat before revoking access solely because a cached expiration passed. Subscription management stays with its original store; Stripe uses its Customer Portal. [Event semantics](https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields), [Stripe integration](https://www.revenuecat.com/docs/web/integrations/stripe)

On expiry, our recommended product policy retains reading and export of existing family data; stop new premium operations and AI usage. Never delete recipes because payment fails.

## Trial and price

EUR 39/year is a pricing hypothesis, not evidence of market willingness to pay. Show localized store prices; taxes, store commissions, Stripe and RevenueCat charges are additional commercial considerations.

A card-free preview can technically use `preview_started_at`, `preview_ends_at` and server-enforced quotas in D1, without creating a subscription or promising automatic renewal. Describe this as temporary free access, not a purchased store trial. The eventual subscription requires explicit checkout. This is an architectural recommendation, not a guarantee of store approval; disclose the flow in review notes. Stripe also supports actual trials without a payment method, but that introduces another subscription state and is unnecessary for the proposed preview. [Stripe trial behavior](https://docs.stripe.com/billing/subscriptions/trials)

Acceptance evidence before launch: real sandbox purchase and restore on both mobile stores, web purchase visible on mobile, invited-member access, duplicate checkout prevention, cancellation, expiration, refund, delayed/duplicate notifications, and no purchase transfer to a different household.
