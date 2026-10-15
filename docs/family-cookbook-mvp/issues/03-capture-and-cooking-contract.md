# Choose the capture and cooking experience

Id: 03
Parent: ../map.md
Label: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: Codex
Blocked by: 01

## Question

Which screens and transitions make photo and voice capture, review, grounded questions and shared shopping a coherent MVP? Decide ambiguity handling, original preservation, offline scope and collaboration boundaries.

## Context

[MVP specification](../spec.md). Earlier evidence: [AI research](../../cookbook-ai-features-cloudflare-research.md) and [opportunity research](../../family-cookbook-opportunity-research.md).

## Comments

Opening round: prepared [Capture and cooking experience: decision proposal](../experience-proposal.md). Proposed one shared review flow for photo and recorded recipes, explicit source preservation, recipe-grounded answers and confirmed shopping additions. Four independent choices are being presented: editing/approval permissions, audio retention default, assistant advice boundary and offline shopping behavior. Baseline flow acceptance is also requested. No answers or resolution have been inferred. This ticket remains claimed while awaiting the live exchange.

User response: accepted the presented flows and selected 1A, 2A, 3A, 4B. All members may edit and approve; recipe recordings are retained by default with an opt-out; explicitly requested general cooking advice is allowed when separated from source facts; shopping check/uncheck must work offline.

The remaining question is the conflict policy for offline shopping. Proposed policy: persist explicit desired states locally; accept a server update only against the item revision observed by the client; on a stale revision, retain the current server item and inform the client without a blocking conflict dialog. Deleted items are not recreated. Detailed proposal: [Offline shopping synchronization](../experience-proposal.md#offline-shopping-synchronization-proposal). This policy awaits the user's answer, so the ticket remains claimed.


## Answer

Resolution comment: the user accepted the presented capture/cooking flows and choices 1A, 2A, 3A, 4B, then explicitly accepted synchronization policy A and requested closure.

All members may edit and approve recipes. Photo and voice capture converge on human review; unknown values remain explicit and originals are not overwritten. Recordings are retained by default with an opt-out. The assistant may offer explicitly requested general advice, clearly separated from recipe sources; writes require confirmation. Shopping uses confirmed recipe snapshots and supports offline check/uncheck.

Offline states persist locally with visible pending status. Synchronization uses explicit desired states, stable operation IDs and item revisions. Changes already accepted by the server win over conflicting stale offline operations; notify without a blocking choice dialog. Deletions do not resurrect items, different items synchronize independently, and retries do not apply the same operation twice. Users can act again after refresh.

Detailed behavior and implementation acceptance cases: [Capture and cooking experience](../experience-proposal.md). This resolves the experience contract, not implementation or completed device tests. Payment expiry interactions with pending changes belong to the payment/continuity decision.
