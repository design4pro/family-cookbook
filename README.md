# Family Cookbook

Working name for a private family recipe book on Expo and Cloudflare. This is a temporary project name, not a final brand, domain selection or trademark clearance.

Preserve family recipes from photos, dictation and text, review them before use, then support cooking, grounded cookbook questions and a shared shopping list with offline checking.

## Project status

Planning baseline approved. T01's atomic D1 shopping-mutation proof and T02's contribution-aware deletion proof pass their required checks; the minimal Worker test harness is implemented. T04 passes its loaded-web persistence proof and T05 passes its local/remote queued-job settlement proof. T06 passes its isolated D1/R2 recovery proof and deletion replay; physical retention acceptance remains open. T07 passes web/native session checks and restricted actual email delivery; see [T07 evidence](docs/evidence/t07.md). Native T07 trials used Release builds on simulator/emulator. T08 passes local purchase-identity checks and actual Polar sandbox identity verification with recorded-response replay. See [T08 evidence](docs/evidence/t08.md) and the [Polar-only scope decision](docs/decisions/0001-polar-only-purchases.md). Physical-device, model and payment verification remain open; rollout has not started. Neither readiness gate has passed. See [T01 evidence](docs/evidence/t01.md) and [T02 evidence](docs/evidence/t02.md).

The repository uses `main` as its initial branch. No remote repository has been configured.

## Start here

1. Read [AGENTS.md](AGENTS.md) for collaboration and implementation rules.
2. Read the [approved MVP specification](docs/family-cookbook-mvp/spec.md).
3. Follow the [implementation plan](docs/family-cookbook-mvp/implementation/plan.md) and [task register](docs/family-cookbook-mvp/implementation/todo.md).
4. Use the [coverage matrix](docs/family-cookbook-mvp/implementation/coverage.md) to assess evidence completeness.

There are 42 open implementation/operator/milestone tasks. T01, T02, T04, T05, T06, T07, T08, T10 and T11 are complete. [T11 evidence](docs/evidence/t11.md) covers reauthenticated administration handover and explicit successor claims. T10 uses the explicit limited sequencing exception; see [household evidence](docs/evidence/t10.md). T03 is implemented with local verification but awaits physical iOS/Android evidence; see [T03 evidence](docs/evidence/t03.md). Prepare remaining physical-device/model/provider access. T03/T09 remain open; the plan records the T10-only exception to the original architecture-proof sequence. Other dependent behavior and both gates remain blocked as specified. Remaining access prerequisites are recorded in [the access inventory](docs/operator/test-access.md).

## Decisions and research

- [Resolved Wayfinder map](docs/family-cookbook-mvp/map.md)
- [Domain context](docs/family-cookbook-mvp/CONTEXT.md)
- [Recipe-book opportunity research](docs/family-cookbook-opportunity-research.md)
- [Cloudflare AI feature research](docs/cookbook-ai-features-cloudflare-research.md)
- [Initial market research](docs/app-market-trends-research.md)

The relative documentation layout has been preserved during migration. Earlier alternatives in research or decision history do not override the approved specification.

## Planned stack and release boundaries

Expo for web, iOS and Android; a modular Cloudflare Worker backend with D1, private R2, Queues and Workers AI. See the specification for authentication, billing providers and platform-specific persistence.

Gate 1 is required before invited real-family-data use. Gate 2 is required before real charges. The implementation plan separately identifies the live-payment evidence question that must be resolved before claiming Gate 2 passes. Public store release and production rollout are separate actions.

## Local verification

Use Node 24 or a compatible newer runtime and pnpm 10.15.0:

```sh
pnpm install --frozen-lockfile
pnpm test:api tests/shopping/apply-check.test.ts
pnpm test:app tests/shopping/pending.test.ts
pnpm exec playwright install --with-deps chromium webkit
pnpm test:web
pnpm check
```

`pnpm check` runs workerd, SQLite and IndexedDB tests, generates Worker types, checks application/test types, builds the Worker dry-run and all three Expo platform bundles, then runs Chromium/WebKit proofs through local Worker assets. It does not deploy. The default D1 binding is local-only. Remote proof reproduction is documented in [T01 evidence](docs/evidence/t01.md), [T05 evidence](docs/evidence/t05.md) and [T06 recovery evidence](docs/evidence/t06.md). The isolated T05 Queue Worker is deployed without public HTTP access; verification builds are dry-runs. The Expo harness is in `apps/app`; web proof reproduction and limitations are in [T04 evidence](docs/evidence/t04.md). Native device reproduction is in [T03 evidence](docs/evidence/t03.md).

Authentication proof commands, credential handling and native reproduction are in the [T07 runbook](docs/runbooks/auth-session-proof.md). The T07 mailbox/control Worker is local-only and must never be deployed.

Household and administration verification: `pnpm test:household:web` runs Chromium/WebKit against the local authentication harness. Use `pnpm serve:auth-proof` and open `/sign-in`, then `/household-start`, to inspect the screen. Invitation links are copied by the administrator; no invitation email is sent. Synthetic test mailbox/reset controls must never be deployed. The main Worker requires its auth URL/secret and existing restricted Resend configuration before serving authenticated routes; missing configuration fails closed.
