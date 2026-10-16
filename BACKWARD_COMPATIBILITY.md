# Backward compatibility

The product is pre-release (no pilot, store build or live charge yet), but several surfaces already bind other code, stored data or deployed clients. A change to one of them follows the path below. Review skills check diffs against this file; implementation skills warn when a change violates it.

## Protected surfaces

| Surface | Where | Breaking change | Required path |
|---|---|---|---|
| HTTP API | `/api/auth/*` (Better Auth) and `/api/household*` routes in `apps/api/src/index.ts`, `households/routes.ts` | Removing or renaming a route, changing method, request or response shape, status codes or error semantics | Additive change first; keep the old shape until the native app and web client in the repo are updated and a release without the old shape is acceptable; document in the PR |
| D1 schema | `apps/api/migrations/0001…0006-*.sql` | Editing a merged migration; dropping or retyping a column; tightening constraints on existing rows | New numbered migration only; additive or expand/contract; up/down test and rollback plan in the PR body |
| Billing identity | `docs/decisions/0001-polar-only-purchases.md`, `apps/api/src/billing/` | Changing the customer `external_id` binding, intent-to-subscription binding, or granting entitlement from unverified data | New ADR superseding the old one, approved by the developer |
| Recovery / deletion contracts | `apps/api/src/recovery/`, `deletion/`, `docs/runbooks/recovery.md` | Changing queue envelope fields (recovery epoch), job generation semantics, purge ordering | Version the envelope, accept old and new during rollout, update the runbook |
| Household contract | `apps/api/src/households/contract.ts` and its consumers in `apps/app/src/households` | Changing shared types, invitation or handover semantics, invitation URL fragment format | Update producer and consumer in one PR; keep old links working or state the cutover |
| Local persisted client state | Pending-check store (SQLite native, IndexedDB web) in `apps/app/src/shopping` | Changing stored schema, outbox or tombstone format | Migrate stored data on open; never drop unsynced user intent |
| Wrangler / environment contract | `apps/api/wrangler*.jsonc`, bindings `DB`, `AUTH_BASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `.env.example` | Renaming or removing a binding or variable | Add the new name, support both, document in `docs/operator/` |
| Approved product contract | `docs/family-cookbook-mvp/spec.md`, resolved Wayfinder decisions | Changing prices, allowances, payer succession, deletion rules or readiness gates | Explicit developer decision recorded as an ADR in `docs/decisions/` |

Temporary proof surfaces (`/__proof/*`, `apps/api/src/proofs/`, `wrangler.t0*-proof.jsonc`, the app proof route and `pro.design4.cookbook.t03proof` identifiers) are not protected and may be removed once the production path exists.

## Handling a breaking change

1. State the break and the affected consumers in the PR description.
2. Prefer expand/contract: add the new form, migrate consumers, remove the old form in a later PR.
3. Provide a migration note (`docs/runbooks/` or the ADR) for data or operator-facing changes.
4. A change that cannot avoid the break needs explicit developer approval before merge.
