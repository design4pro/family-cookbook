# Architecture and pilot constraints

Research date: 2026-10-15. Official documentation and Context7 were checked. No deployment, recovery drill, payment configuration, or device test was performed. Recommendations below are engineering proposals, not established implementation results or legal advice.

## Database and asynchronous work

D1 supports predefined prepared statements executed through `batch()` as one SQL transaction; a failed statement rolls back the batch. This is not evidence for an interactive transaction spanning separate Worker requests or external API calls. Use a conditional update containing the expected item version and inspect affected rows. An update affecting zero rows is a business conflict, not automatically a SQL error that aborts the batch. Test operation deduplication and mutation together; do not acknowledge success before both are durably recorded. [D1 batch](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch), [result metadata](https://developers.cloudflare.com/d1/worker-api/return-object/)

Queues delivers at least once, so duplicated imports, notifications, and retries are expected design cases. Use stable job and operation identifiers, conditional state transitions, and unique constraints. Recheck membership and deletion state before publishing results. D1 persistence and queue publication are not a shared transaction: a persisted pending-job record plus a scheduled reconciliation pass can recover a failed enqueue without requiring another service. [Delivery guarantees](https://developers.cloudflare.com/queues/reference/delivery-guarantees/)

Recommendation: one Worker codebase with HTTP, queue, and scheduled handlers, one shared D1 database per environment, private R2 storage, and Workers AI. Every domain query must enforce family membership. This is a deliberately small architecture, not a claim that database tenancy itself enforces authorization.

## Offline storage

Expo SQLite persists across native app restarts. Its current web implementation remains alpha and requires WebAssembly and cross-origin isolation headers. Recommendation: SQLite on iOS/Android and an IndexedDB adapter on web, sharing synchronization rules rather than assuming identical storage implementations. Test browser reload, storage failure, stale membership, and queued changes after logout. Browser storage is not an independent backup. [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)

## Deletion and restore gates

D1 Time Travel is always enabled and retains up to 30 days on Workers Paid or seven days on Free. Restoring does not remove older restore points. Therefore deleting active data within seven days and waiting another 30 days for history to age out can mean **up to 37 days from the request**. The proposed 30-day promise needs an explicit starting point; it is not verified by adopting D1. [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/)

R2 object deletion is irreversible through the documented object interface. Storage durability must not be described as an automatic recoverable backup. If recoverable media copies are needed, explicitly define their retention and deletion process. Cached public-domain copies can remain available after origin deletion; use private access and include cache handling in the deletion inventory. [R2 deletion](https://developers.cloudflare.com/r2/objects/delete-objects/), [consistency and caching](https://developers.cloudflare.com/r2/reference/consistency/)

Required drill before real family data:

- Record deletion identifiers outside the database rollback boundary, with bounded retention and no recipe content.
- Restore historical data in a restricted environment; reapply all later deletions before enabling access or workers.
- Revoke restored sessions and reconcile jobs, media, exports, usage, and billing events. Old queue messages and in-flight uploads must not resurrect deleted records.
- Verify account contributions and revision history, not only the current account row. Verify actual copy retention and deletion deadlines, including processors and operational logs.

The seven-day active-system target is an operational requirement, not a platform guarantee. Remote deletion also cannot retract exports already downloaded by family members.

## Pilot distribution and payments

Expo in-app purchases require a development/native build; Expo Go is insufficient. TestFlight purchases run in sandbox with accelerated renewals. Google Play test-track users can incur real charges unless configured as license testers. Stripe testing uses test environments rather than real money. [Expo purchases](https://docs.expo.dev/guides/in-app-purchases/), [TestFlight](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testing-subscriptions-and-in-app-purchases-in-testflight/), [Google testing](https://developer.android.com/google/play/billing/test), [Stripe testing](https://docs.stripe.com/testing)

Recommendation: separate functional pilot access from billing QA accounts and environments. Sandbox transactions must never grant production entitlement. If validating willingness to pay during the pilot, use a separately reviewed live web purchase flow; sandbox success proves integration behavior, not demand.

## Risks affecting the plan

1. Define deletion-clock semantics before publishing retention promises, and rehearse recovery without resurrection.
2. Budget separate native/web offline storage adapters and real-device verification.
3. Exercise duplicates and crash boundaries for jobs, shopping mutations, quotas, and payment events.
4. Keep sandbox billing isolated from real family access; complete auth, purchase restoration, and family-entitlement integration tests before charging.
