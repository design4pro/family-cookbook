# Verify cross-platform subscription feasibility

Id: 02
Parent: ../map.md
Label: wayfinder:research
Type: research
Status: resolved
Assignee: research agent
Blocked by: none

## Question

What current Expo, Apple, Google and billing-provider constraints apply to one household entitlement purchased on web, iOS or Android? Recommend the smallest technically viable integration, with primary sources and limitations.

## Context

[MVP specification](../spec.md). Earlier evidence: [AI research](../../cookbook-ai-features-cloudflare-research.md) and [opportunity research](../../family-cookbook-opportunity-research.md).

## Answer

Resolution comment, 2026-10-15: RevenueCat plus native Apple/Google purchases and Stripe Billing on web is a technically viable recommendation. Keep one personal payer identity across channels and implement household access in D1. Require login before purchase, restore to the original account, refresh entitlements server-side, and distinguish cancellation, billing issues, refunds and expiration. A card-free backend preview is technically possible without creating a payment subscription; store approval remains untested. EUR 39/year is an unvalidated price hypothesis. Sandbox acceptance tests remain execution work, not unresolved architecture research.

Evidence and limitations: [Household subscription feasibility](../billing-evidence.md). This local evidence pointer replaces a research branch because the workspace is not a Git repository.
