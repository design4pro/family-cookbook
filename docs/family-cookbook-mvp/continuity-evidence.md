# Account deletion and billing continuity evidence

Research date: 2026-10-15. Documentation review only; no store-account, restore, or payment tests. Product recommendations below are not approved policy decisions.

## Verified platform constraints

- Apple requires an accessible account-deletion path, deletion of associated personal data and shared user-generated content, and an immediate deletion option even if scheduled deletion at subscription expiry is offered. Active subscriptions require a clear billing warning and cancellation route; they cannot justify withholding the immediate option. Merely anonymizing uploaded recipes, photographs, or recordings is not established as sufficient by this guidance. [Apple account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- Google requires both an in-app deletion path and an external web resource. Associated data and processor copies are in scope. Legitimate retention exceptions must be disclosed; Google does not grant blanket permission to retain all billing-linked records indefinitely. [Google account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
- Deleting a RevenueCat customer does not cancel Apple, Google, or Stripe subscriptions. Its separate RevenueCat Billing product behaves differently: deletion cancels those subscriptions immediately. Do not confuse Stripe integration with RevenueCat Billing. [RevenueCat customer deletion](https://www.revenuecat.com/docs/dashboard-and-metrics/customer-history/active-entitlements)
- Google permits developer-triggered cancellation, while preserving access through the applicable paid period. Stripe supports `cancel_at_period_end=true`. Apple cancellation must be initiated by the customer through their store subscription controls. [Google lifecycle](https://developer.android.com/google/play/billing/lifecycle/subscriptions#cancellations), [Stripe cancellation](https://docs.stripe.com/billing/subscriptions/cancel), [RevenueCat subscription management](https://www.revenuecat.com/docs/subscription-guidance/managing-subscriptions)
- RevenueCat can transfer purchase associations between App User IDs. Default restore behavior can revoke access from the previous ID when another ID restores. That is an application identity reassignment, not evidence of changing the underlying store subscriber or payment instrument. [Restore behavior](https://www.revenuecat.com/docs/projects/restore-behavior)

## Recommended minimum product behavior

Keep cookbook administration, content contribution, and billing responsibility separate. An accepted administrator handover changes permissions only; it does not change a subscription. Require recipient acceptance before a normal handover takes effect.

For payer replacement, stop the existing subscription's renewal through its originating provider, preserve the family's verified paid period, and let the replacement payer buy after confirmed expiry. Do not promise an automatic future charge, transfer the original payer's card, or reset introductory allowances. Show the expiry date and whether renewal cancellation is confirmed. Reconcile provider state immediately before checkout; handle refunds, revocations, late renewals, and restored purchases instead of relying solely on a cached date. A RevenueCat restore must never silently attach one purchase to two families.

Account deletion must remain possible without a replacement administrator. Offer a separate handover flow, but do not require another person's acceptance to release the deleting user. Reauthenticate, explain content and billing consequences, revoke sessions, and delete scoped data across processors. Removing the administrator must not automatically delete other members' contributions. Resolve administrator succession separately.

For shared recipes, administrator handover does not transfer authorship or establish an exception to deletion. The conservative baseline deletes recipes created by the departing account and its uploaded sources, after offering a preview and export. Editing another member's recipe does not make the editor owner of that entire recipe. Track contribution provenance so the departing user's text, recordings, personal data, and historical versions can be removed without deleting unrelated contributions. A retention checkbox or copying content to another account is not an established exception in the reviewed guidance.

## Paid access after payer deletion

Preserving household access until the verified expiry is technically feasible as an application entitlement independent of a public profile. However, an opaque transaction identifier can still be personal data. The reviewed documents do not establish a blanket legal basis for retaining a pseudonymous payer link merely to operate this design.

Retain only necessary, access-restricted billing records under an identified retention basis and schedule, with refund/revocation reconciliation. Remove unnecessary names, emails, analytics attributes, and authentication links. Document this exception honestly; do not claim complete erasure while secretly retaining a re-identifiable billing profile. Validate retention and deletion interactions before paid launch, including return-and-restore after account deletion.
