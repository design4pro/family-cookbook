# Choose the household payment and continuity contract

Id: 04
Parent: ../map.md
Label: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: Codex
Blocked by: 01, 02

## Question

What one paid offer, trial, usage allowances, cancellation behavior and archive access should the MVP promise? Validate the proposed price and quota units as hypotheses rather than market facts.

## Context

[MVP specification](../spec.md). Earlier evidence: [AI research](../../cookbook-ai-features-cloudflare-research.md) and [opportunity research](../../family-cookbook-opportunity-research.md).

## Comments

Opened after user acceptance of offline synchronization policy A. Prepared [Household payment and continuity: proposal](../payment-proposal.md). Four opening choices: one plan with annual/monthly billing versus annual only; quota-based sample versus timed trial; first-month image allowance; and archive access versus fixed post-expiry deletion. Proposed behavior explicitly preserves offline check synchronization for the existing shopping list after expiry. Price, limits and retention are not accepted yet.

User response: accepted choices 1A, 2A, 3A, 4A. The accepted offer is one Family plan at EUR 4.99/month or EUR 39/year, a quota-limited card-free sample without a countdown, the stated household capacities including 200 image pages in the first paid usage month then 50/month, and Archive access after expiry with separate twelve-month inactivity cleanup and advance notices. These remain pilot price assumptions rather than evidence of willingness to pay. Account deletion, cookbook administration transfer and payer change are the next live round; the ticket remains claimed.

Second round: prepared [Account, cookbook and payer continuity](../account-continuity.md), grounded in [primary-source evidence](../continuity-evidence.md). Proposals separate administrator and payer, preserve a non-blocking account-deletion path, identify shared-content deletion impact, require recipient acceptance for normal handover, allow explicit successor claim by an existing member after administrator deletion, and defer new-payer checkout until current entitlement expiry. No new product choices have been inferred as accepted. Contributor-data purge and justified minimal billing-record retention must be accounted for before paid release.


## Answer

The user accepted the deletion rules and choices 1A/2A/3A and explicitly requested closure. This completes the product payment/continuity contract together with the earlier accepted offer and Archive policy.

Accepted: one Family plan at EUR 4.99/month or EUR 39/year; quota-based card-free sample; the published household capacities and one-time welcome page allowance; Archive access on expiry; twelve-month inactivity cleanup with advance notices. Cookbook administrator and payer may differ. Normal administrator transfer needs recipient acceptance. If the administrator deletes their account, the first verified existing member who explicitly accepts may claim administration. Replacing the payer waits for verified current entitlement expiry and requires the new payer's explicit purchase.

Account deletion remains available without a successor or waiting for subscription expiry. It removes associated contributions/sources as described in the accepted continuity contract, without automatically deleting unrelated members' work. Active-system and backup purge targets require technical proof. Minimal retained billing references require a defined basis, scope and retention schedule before real charges.

Canonical detail: [Household payment and continuity](../payment-proposal.md) and [Account, cookbook and payer continuity](../account-continuity.md). Implementation validation, provider sandbox checks, deletion feasibility, and the remaining billing-record retention evidence are assigned to [Choose the architecture and release gates](05-architecture-and-release-gates.md). They are release gates, not claims of already completed work or unconditional compliance.
