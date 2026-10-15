# Define the family cookbook MVP

Label: wayfinder:map
Status: resolved

## Destination

Reach a reviewable, implementation-ready MVP specification for a private family cookbook on Expo and Cloudflare, covering screens, photo and voice capture, grounded cookbook conversation, shared shopping, architecture, and household billing.

## Notes

Planning is complete. The [final implementation specification](spec.md) consolidates the accepted contract; resolutions and their reasoning live in child tickets. The [completeness audit](completion-audit.md) distinguishes completed decisions from unpassed release gates. Future material scope changes require a new explicit decision; implementation is separate work.

The user requests photo capture, dictation, cookbook conversation, and shopping. Expo and Cloudflare are constraints. Earlier user preferences delegate market selection to research. Family size and pilot scope have been accepted in the linked household decision. Capture/cooking flows and offline shopping conflict behavior have also been accepted. Payment and account-continuity product choices are accepted in the resolved payment ticket. Architecture, pilot gates and the backup-retention amendment are accepted. No decision frontier remains. Implementation evidence is still required before real-data use and real charges.

Tracker: local Markdown, adapted from the skill's local tracker. User-facing artifacts live here under outputs rather than .scratch, following workspace instructions. Child issues use Type, Status, Assignee, Parent and Blocked by fields; answers append under Answer. Scan child files by number for open, unassigned issues whose blockers are resolved. Open decisions are not duplicated in this index.

This workspace has no Git repository. Research findings will use local file context pointers instead of throwaway Git branches; do not initialize or publish a repository solely for planning.

## Decisions so far

- [Choose the household and first-release boundary](issues/01-household-and-release-boundary.md): shared cookbook for up to five people with one payer; web, iOS and Android start in a closed pilot.

- [Verify cross-platform subscription feasibility](issues/02-billing-platform-feasibility.md): native IAP and Stripe can feed a unified billing status; household access remains an application responsibility. Provider feasibility is researched; offer acceptance and sandbox validation remain separate.

- [Choose the capture and cooking experience](issues/03-capture-and-cooking-contract.md): reviewed photo/voice capture, recipe-grounded assistance and shared shopping; offline checks preserve already-accepted server changes on conflict.

- [Choose the household payment and continuity contract](issues/04-household-payment-contract.md): one Family offer, Archive access, explicit deletion, separate administrator/payer roles and payer replacement after expiry; verification gates carry forward to architecture.

- [Choose the architecture and release gates](issues/05-architecture-and-release-gates.md): modular Expo/Workers implementation, two evidence gates, ten-household six-week pilot with a paid web phase, and a maximum thirty-seven-day backup deadline.

## Not yet specified

None within this planning destination. All five child decisions are resolved. Verification, provider setup and operating-entity retention evidence are explicit implementation/launch prerequisites in the final specification, not hidden claims of readiness.

## Out of scope

Implementation execution, production deployment, store submission, branding and visual design. Product exclusions are fixed in the final specification. Public rollout is outside this closed-pilot planning effort.
