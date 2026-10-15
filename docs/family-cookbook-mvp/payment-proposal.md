# Household payment and continuity

Status: choices 1A/2A/3A/4A accepted. Prices, sample, published allowances and Archive/inactivity policy are accepted for the MVP pilot. Account deletion, administrative transfer and payer change are also accepted in [Choose the household payment and continuity contract](issues/04-household-payment-contract.md). Prices are pilot hypotheses, not validated market demand, tax advice or uniform store pricing.

## Accepted offer

One Family plan covers one household with up to five people total and one payer across web, iOS and Android. Accepted: two billing periods for the same features, EUR 4.99/month or EUR 39/year. The monthly option lowers the commitment needed to test the product; the annual option suits ongoing family use. No lifetime promise, advertising, per-device fee or additional paid tier.

These are EUR reference offers. Choose the launch-market price and localized store amounts before checkout configuration; a quoted reference is not a currency-conversion promise. Show the actual renewal amount and billing period. Payment-provider and store fees, taxes, support, storage and acquisition are separate from inference costs. Prior technical feasibility and citations: [billing evidence](billing-evidence.md).

## Card-free sample

Use a quota-limited sample without a 14-day countdown and without automatic renewal. It includes all five household members, ten saved recipes, five image pages, ten recorded minutes, twenty assistant answers, 100 MB of sources, and the shared shopping workflow. Allow manual recipes within the recipe/storage cap. These allowances are one-time per household and do not reset on logout, reinstall, inviting a different member, or moving from paid access back to an expired state.

This changes the earlier proposed two-person sample to five people so the sample demonstrates the already-accepted family product. Paid-plan capacity remains higher. After an allowance runs out, retain access to existing content; require an explicit purchase only for additional paid capability. The fourteen-day alternative was not selected.

## Paid allowances

| Resource | Accepted Family allowance |
| --- | --- |
| Members | Five total, including the payer |
| Saved recipes | 500 |
| Original assets | 1 GB total, including photographs and recordings |
| Image extraction | 200 pages in the first paid usage month, then 50 per usage month |
| Recipe dictation | 60 recorded minutes per usage month |
| Assistant answers | 200 completed answers per usage month |
| Manual edits, cooking and shared shopping | Included, not metered as AI |
| Full export | Included and available without active payment |

The 200-page welcome allowance addresses initial notebook capture; it is available once per household, not on every renewal or reactivation. This is an allowance for successive single-recipe imports, not a promise of automatic bulk scanning. The fifty-pages-from-start alternative was not selected.

Use monthly usage windows anchored to first paid activation, using the same documented calendar-day anchor for annual and monthly buyers; clamp short months to their last day and compute boundaries from the original anchor. Show the next reset date. This replaces the earlier draft UTC calendar-month reset proposal. Provider renewal timing and usage allowance timing are separate; changing billing period or reactivating an expired household must not mint another welcome allowance or reset consumed usage within a current window. No rollover. Both billing periods have identical allowances.

Counts are household-wide. One page is one submitted image. Audio is metered by accepted recording duration, not repeated processing attempts. Count one assistant answer per completed user-requested response, not internal calls. Failed imports and automatic retries do not charge another user unit; deliberately reprocessing edited source material is a new requested job and shows its cost before submission. Persist quota reservations to prevent concurrent requests exceeding the limit. System-level abuse controls remain separate from the user offer.

When a limit is reached, explain the exact resource and reset date. Stop only the affected action. Do not lock recipes or shared shopping because AI usage is exhausted. No paid top-up packs in MVP. Storage overflow blocks new uploads, not access or export; previously uploaded originals are not silently recompressed or removed to make room.

## Cancellation and expiry

Canceling renewal leaves paid access until verified expiry. Failed payment, provider grace, refunds and restored purchases follow the verified entitlement state; a stale client clock or cached date alone must not remove access. Restore Purchases and subscription management remain tied to the original purchase channel. The backend grants household access from the payer's verified state. [Billing lifecycle evidence](billing-evidence.md)

Accepted Archive state after expiry:

- All existing family members retain access to all saved recipes, original images and retained recordings, including search, ordinary cooking view, downloads and full export.
- Do not reduce an expired paid book to the ten-recipe sample or remove excess members.
- New recipes/uploads, edits, AI and new shopping additions require renewed payment. Privacy-related deletion and export do not require payment.
- Existing shopping items can still be checked or unchecked, including synchronization of offline changes. This lets a family finish its current shopping and avoids losing pending work at expiry. Existing deletions, membership checks and conflict rules still apply; expiry itself is not a conflict.
- Payment renewal re-enables the household without reimporting recipes. It does not reset usage already consumed in the current usage window.

This accepted policy replaces the earlier unaccepted 90-day post-expiry cloud-removal model. It charges for active creation and assistance while keeping the family collection usable. It has a real ongoing storage and delivery cost that must be included in the business model.

## Inactivity is separate from payment

Retain an expired archive while the household remains active, subject to the service continuing to operate. Do not market this as guaranteed lifetime storage. After twelve consecutive months with no explicit authenticated online use by any member, the household may be scheduled for deletion, with notifications thirty and seven days beforehand. Opening the book online or requesting an export cancels the scheduled deletion. Background polling does not count as activity. Offline use alone cannot report activity to the server and must not be presented as extending server retention.

Apply the same disclosed inactivity policy to never-paid sample households. Do not infer activity merely from a billing failure or remove data because an invoice failed. An active paid subscription prevents inactivity deletion. Voluntary deletion is a separate explicit user action.

This accepted retention duration is a product policy, not a statement of legal requirements. Account continuity and backup timing are specified in the accepted continuity and architecture decisions. Notification delivery and purge behavior must be verified before release. Downloaded self-contained exports remain independent of cloud retention. A cached app copy is not a substitute for a full export of all sources.

## Accepted opening round

The user selected 1A, 2A, 3A, 4A: both billing periods, quota-based sample without a countdown, welcome image allowance, and Archive access with independent inactivity cleanup. The annual-only, timed-trial, fifty-pages-from-start and fixed post-expiry-deletion alternatives are not selected.

## Continuity resolution and implementation gates

Account deletion, cookbook administration transfer and payer replacement are accepted in [Account and billing continuity](account-continuity.md). The payment decision is closed. Notification handling, active/backup purge proof and billing-record retention evidence are assigned to the architecture/pilot readiness gates. Usage-window rules above were accepted with the architecture contract and require boundary tests during implementation.
