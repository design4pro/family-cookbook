# Code review rules

Applied automatically by `om-code-review` (and therefore `om-auto-review-pr`). Derived from this repository: a pnpm workspace with a Cloudflare Worker API (`apps/api`, D1, Better Auth, Vitest in workerd), an Expo / React Native app (`apps/app`, Expo Router, web export) and Playwright web tests (`tests/`). Product scope lives in `docs/family-cookbook-mvp/spec.md`; engineering guidance in `AGENTS.md`, `apps/api/AGENTS.md` and `apps/app/AGENTS.md`.

## Review priorities

1. **Correctness and data safety** - household isolation, authorization, idempotency, concurrency fencing.
2. **Security and privacy** - authentication, sessions, billing identity, deletion and recovery.
3. **Contracts** - anything listed in `BACKWARD_COMPATIBILITY.md`.
4. **Evidence** - tests and recorded results that prove the acceptance criteria.
5. **Maintainability** - DRY, KISS, SOLID, surgical diffs, accessibility (WCAG 2.2), responsive layout.

## Repo-specific checks

- **Scope**: the change matches an approved task in `docs/family-cookbook-mvp/implementation/plan.md` or an explicit request. Planning or design approval is not permission to start feature work; production provisioning, charging, store publication and pilots stay behind the two readiness gates.
- **Tenancy**: every household-scoped read and write checks membership server-side. A client-side check or an aborted request never substitutes for it. A test must prove that one household cannot read or mutate another's data.
- **D1 / SQL**: tests run on real D1 in workerd (`pnpm test:api`), never a SQLite mock. Conditional UPDATE and its outcome INSERT stay adjacent in one batch (`applyCheck`). For statements with triggers, detect the affected entity with `RETURNING`, not `meta.changes`. Check that a conditional write actually succeeded before treating it as applied.
- **Migrations** (`apps/api/migrations/*.sql`): numbered, additive, never edited after merge; destructive changes need a rollback plan and an up/down test.
- **Fencing and recovery**: job generations start at 0; stale-token tests assert a real claim succeeded first. Recovery envelopes carry the independent recovery epoch; purge completion is recorded after object verification.
- **Billing**: Polar is the only purchase channel (`docs/decisions/0001-polar-only-purchases.md`). Entitlement is granted only from server-verified provider data bound to the purchase intent. Customer `external_id` is the Better Auth user id, never email or household id. No native in-app purchase code.
- **Auth**: server-side session checks on every `/api/` route; no secrets, OTP codes or tokens in logs, responses or fixtures. Env access goes through the configured bindings (`DB`, `AUTH_BASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`).
- **Contribution lineage** is server-controlled and inherited; a UI relabel must not reset it. Recipe manifests define fragment order and every reference must resolve.
- **App platform boundaries**: no shared module with the same basename as a `.native.ts` adapter; platform-specific proof screens stay outside `app/` behind thin route files; verify native, iOS and web exports after touching the boundary. Invitation links use URL fragments (subscribe to `hashchange` on web).
- **Offline storage**: a check counts as saved only after the storage transaction commits; keep tombstones until the cache is discarded.
- **Evidence honesty**: browser or simulator results must not be presented as physical-device acceptance. Results and limitations are recorded; a gate is never claimed without its required results.
- **Branding**: "Family Cookbook" is a working name; flag any new final branding, domain or store identifier.
- **Accessibility and responsive UI**: labels, focus order, contrast, touch target size, keyboard operation and narrow viewports are checked for every UI change.
- **Tests**: new behavior has unit/integration tests; web behavior has Playwright coverage. Tests must not set `GIT_DIR` or otherwise touch the real repository.
- **Git hygiene**: pushes use an explicit destination (`git push origin HEAD:refs/heads/<branch>`); a push response mentioning bypassed rule violations is reported, not accepted.

## Validation gate

`pnpm test:api`, `pnpm test:app`, `pnpm typecheck`, `pnpm build`, `pnpm test:web`, `pnpm test:auth:web`, `pnpm test:household:web` (same as `pnpm check` and CI). A failing gate is a blocker.

## Severity

- **Blocker** - data leak across households, auth bypass, billing grant without verified provider data, destructive or non-reversible migration without a plan, broken contract in `BACKWARD_COMPATIBILITY.md`, failing gate, claimed evidence that was not produced.
- **Major** - missing isolation or denied-path test, race or idempotency hole, wrong platform boundary, accessibility regression, scope outside the approved task.
- **Minor** - naming, duplication, comments, small style drift matching neither the surrounding code nor `AGENTS.md`.
- **Nit** - optional polish; never blocks.
