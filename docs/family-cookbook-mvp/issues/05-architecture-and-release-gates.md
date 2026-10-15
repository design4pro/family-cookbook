# Choose the architecture and release gates

Id: 05
Parent: ../map.md
Label: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: Codex
Blocked by: 03, 04

## Question

Which minimal architecture satisfies the accepted user journeys and payment contract, and what measurable authorization, AI accuracy, accessibility and cross-platform acceptance gates are required?

## Context

[MVP specification](../spec.md). Earlier evidence: [AI research](../../cookbook-ai-features-cloudflare-research.md) and [opportunity research](../../family-cookbook-opportunity-research.md).

## Comments

Claimed after explicit closure of the payment decision. This ticket also owns release evidence for contribution-aware deletion, active/backup purge targets, recovery without resurrecting deleted content, and the scope/basis/schedule of minimal retained billing references. Accepted product rules must not be silently weakened to simplify implementation.

Prepared [Architecture and pilot readiness proposal](../architecture-and-pilot.md), with [verified constraints](../architecture-evidence.md). Proposed two evidence gates: invited real-data use, then real payment. Three human choices are being presented: pilot size/duration, a paid web phase, and the backup-retention amendment.

New fact: seven-day active deletion plus D1 Paid's thirty-day Time Travel can retain recoverable rows up to thirty-seven days from request. The earlier thirty-day-from-request target is not silently amended; user choice is required here. No architecture choice or readiness test has been treated as accepted/completed.


## Answer

The user accepted the architecture and criteria and selected 1A/2A/3A, then explicitly requested closure and a final implementation handoff.

Accepted architecture: one Expo application and modular Workers backend, D1, private R2, Queues, Workers AI, Better Auth/email delivery and RevenueCat with the specified channels. Native SQLite and web IndexedDB implement the narrow offline contract. The accepted evidence gates distinguish real-data readiness from real-payment readiness.

Accepted pilot: ten Polish-speaking households over six weeks, initially using the card-free sample; a real web purchase phase follows the payment gate, with native sandbox QA kept separate. Accepted backup amendment: immediate access revocation, active-system purge within seven days, backup expiry within thirty days after active deletion and no more than thirty-seven days from the request. This supersedes the earlier thirty-day-from-request wording in the payment continuity discussion.

Detailed accepted contract: [Architecture and pilot readiness](../architecture-and-pilot.md). The [final MVP specification](../spec.md) consolidates all resolved decisions. Implementation proofs, real-device tests, provider configuration and the justified scope/retention of billing records remain explicit launch prerequisites. They are not certified by closing the planning decision.
