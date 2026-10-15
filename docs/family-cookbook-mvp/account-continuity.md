# Account, cookbook and payer continuity

Status: accepted account-deletion rules and choices 1A/2A/3A. Canonical resolution: [Choose the household payment and continuity contract](issues/04-household-payment-contract.md). Implementation, provider behavior tests and deletion/retention evidence remain release gates. Verified constraints and sources: [Account deletion and billing continuity evidence](continuity-evidence.md).

## Separate responsibilities

Use one cookbook administrator and one payer, initially the creating user. They may later be different people. Administrator means authority over membership and administrative succession, not legal authorship or ownership of every recipe. The payer controls the subscription they purchased. All ordinary members retain the already-accepted recipe-editing permissions.

Changing administrator does not change contributor attribution, move a store subscription, reset allowances or grant access to the previous administrator's payment method. Changing payer does not itself grant administrator authority.

## Leaving a household versus deleting an account

Leaving removes membership and future server access while preserving the account and its shared contributions. Explain this before confirmation. It does not cancel a subscription; the payer sees the separate billing consequences. Unsent household changes must not upload after membership is revoked. Locally exported copies cannot be remotely recalled.

Account deletion is a distinct, accessible in-app and web flow. Reauthenticate, show the affected data and active subscription, offer export and voluntary administrator handover, then allow confirmation without requiring another person's response or subscription expiry. An export or handover is optional and cannot block deletion.

### Data consequences

- Revoke sessions and pending invitations immediately, stop further user actions, and prevent queued jobs from recreating deleted content.
- Delete profile data, private conversations, uploaded sources, and account-associated contributions, including copies held by processors. A creator's recipes and sources appear explicitly in the deletion preview.
- Do not automatically delete recipes independently created by other members merely because the departing person was administrator or payer.
- Editing somebody else's recipe does not make the entire recipe the editor's creation. Remove the deleting person's associated text/source contributions and affected historical versions; mark the resulting recipe as requiring review if removing those contributions makes its current instructions incomplete.
- Store sufficient contribution provenance to identify this scope. Removing an account ID or relabeling a contributor does not remove personal data embedded in text, scans or recordings. If a jointly edited record cannot yet be purged correctly, the implementation is not ready for paid release; do not silently keep the data.
- Do not offer “keep my content by transferring it to another account” as an established exception to account deletion. The reviewed Apple guidance does not establish such an exception. An administrator handover does not change this.
- A family may have independently downloaded an archive before deletion. Do not claim the app can delete those copies or encourage copying as an automatic workaround for the deletion request.

Apple explicitly includes shared user-generated content in account deletion and requires the immediate-deletion option even where expiry-aligned deletion is offered. This is why the proposal cannot simply keep all recipes under an “ex-member” label. [Apple account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/)

### Timing and retained records

Accepted operational targets, subject to technical proof before user-facing promises: immediately revoke access and remove the affected content from ordinary product reads; finish the active-system and processor deletion workflow within seven days; expire inaccessible backup copies within thirty days after active deletion and no more than thirty-seven days from the request, as amended by the accepted architecture decision. These are requirements to validate against the selected infrastructure before promising them in product copy, not claimed provider guarantees or legal deadlines.

Keep only separately justified, minimized billing/security records under an explicit retention basis and schedule. Disclose any retained data; do not advertise complete erasure while retaining an undisclosed billing identity. Record deletion markers in the operational recovery procedure so restoring a backup does not re-expose deleted content. Notification delivery failures must be retried and monitored, not treated as successful delivery.

For subscription expiry/inactivity, the already-accepted Archive and twelve-month inactivity policy applies. Explicit account deletion is independent and does not wait twelve months. Whole-household deletion is also separate: do not conflate one member's account deletion with erasing everyone else's material.

## Normal administrator handover

1. The current administrator selects an existing verified household member and reauthenticates.
2. Show that administration changes while payment and content attribution remain unchanged.
3. The recipient explicitly accepts within seven days. The current administrator may cancel a pending request; only one request may be pending.
4. Recheck membership and current administrator at acceptance, then switch the role atomically. The previous administrator becomes an ordinary member and may leave separately.
5. Notify both parties. No new cookbook, copy, quota reset or subscription is created.

Pending requests expire if the recipient leaves or is removed. A failed transfer leaves the current administrator in place. The recipient must be a current member, so handover cannot be used to bypass the five-person limit or the invitation flow.

### Administrator deletes their account before handover

Do not block account deletion or automatically select somebody without their consent. Remaining pre-existing members see a Take responsibility action; the first verified member to explicitly accept becomes administrator through an atomic claim. Pending invitations cannot claim the book. Notify all remaining members. Until claimed, existing member access and the verified plan continue, but invitations and other administrator-only actions are unavailable.

If there are no remaining members, there is nobody to claim the household. Close the empty household after handling the deleting user's content and subscription consequences. Preserve only justified records, not an indefinitely discoverable orphan book. Account recreation does not resurrect deleted recipes or create a fresh welcome allowance.

The support-assisted-only recovery alternative was not selected. Do not offer takeover merely because an administrator has been inactive; that is a different problem and remains outside this flow.

## Replacing the payer

Replace the payer at the end of the currently verified paid period; do not transfer a live purchase.

1. The administrator designates a willing current member as the next payer. That member accepts responsibility to make a later purchase; this is not authorization for an automatic future charge.
2. The existing payer disables renewal through the purchase channel. Show whether cancellation is confirmed and the verified paid-through date. The administrator cannot cancel another person's Apple purchase merely by changing app roles.
3. Continue the household's current benefits through verified expiry. Keep the incoming payer's checkout disabled while an old entitlement is active or in a valid grace period.
4. At confirmed expiry, the incoming payer signs in and explicitly buys the same Family plan using their own store/web identity. Until purchase, Archive applies.
5. Attach verified new access to the existing household. Preserve recipes, membership and consumed allowances; do not create a second household or award the introductory pages again.

Changing the billing period is not a payer change. Updating a card within the same buyer's provider account is also not a payer change. RevenueCat restore/transfer behavior must not silently reassign a purchase between people or households. A competing late renewal must be reconciled before opening checkout; if a provider race still produces overlap, surface it for cancellation/refund handling rather than silently double-charge.

If the old payer refuses or fails to cancel renewal, do not promise a timed handover or create another subscription. The household can change administrator independently, but the payer transition waits for a verified end of the current entitlement. An immediate paid switch with credit/proration is outside MVP.

## Payer deletes their account

Do not block deletion. Display the provider-specific billing status and cancellation route first. In the implementation, schedule cancellation at period end for Stripe and Google purchases using the supported provider APIs, report failures honestly, and retain a user-accessible cancellation route. For Apple, the user must initiate cancellation through their subscription controls; deleting the app account does not itself stop renewal. Do not describe deleting a RevenueCat customer as cancellation. [Billing evidence](continuity-evidence.md)

Aim to preserve the surviving household's verified paid period independently of the public payer profile. Doing so requires minimized purchase references sufficient for refunds/revocation reconciliation, with a documented retention basis and duration; the reviewed vendor documentation alone does not establish that basis. This must be resolved before charging users. If there are no remaining members, there is no household access to preserve, but the provider cancellation/deletion obligations still apply.

A new payer can purchase after verified expiry under the normal replacement flow. If account deletion removes recipes or source material, preserving a paid entitlement does not preserve that deleted content. These are separate operations.

## Resolution and verification handoff

The user accepted the deletion rules and 1A/2A/3A: administrator and payer may differ; an existing verified member may explicitly claim administration after administrator deletion; payer replacement occurs only after verified expiry. The product decision is closed.

The architecture/pilot decision owns proof of contribution-aware deletion, seven-day active-system purge, backup expiry within thirty days after active deletion (at most thirty-seven days from request) and restoration suppression, provider cancellation/restore behavior, and the documented basis and schedule for any retained billing records. No paid release may treat these as already validated merely because the product policy was accepted.
