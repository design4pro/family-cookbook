# API implementation guidance

- Follow the root instructions and the current task's acceptance criteria.
- Run tests in workerd with `pnpm test:api`; do not replace D1 behavior with a SQLite mock.
- `pnpm typecheck` generates ignored `worker-configuration.d.ts` before checking source and tests. Do not edit generated declarations.
- Test-only bindings augment `Cloudflare.Env` in `tests/setup.ts`. Import `D1Migration` from `cloudflare:test`; it is not a global type. This prevents repeating the initial harness typecheck failure.
- Keep the outcome INSERT immediately after the conditional UPDATE in `applyCheck`: `changes()` must describe that UPDATE inside the same batch.
- Default Wrangler configuration is local-only. Remote T01 checks use the dedicated database identity recorded in `docs/operator/test-access.md`; never substitute another project's database.
- Contribution lineage is server-controlled and inherited from previous fragments and every AI/copy input. Relabeling an editor must never reset it. Use the T02 evidence contract when implementing T12/T35.
- Recipe manifests define fragment order. Resolve every reference before treating a manifest as complete; filtering stored rows can silently reorder steps or hide missing content.
- Job generations start at 0. Fencing tests must assert a real claim succeeded before testing rejection of its stale token or delivery.
- Recovery queue envelopes must carry the independent recovery epoch. Incrementing a generation in a restored database alone can collide with messages emitted after its restore point. Record purge completion after object verification, never at procedure entry.
- Billing refresh must check that its own conditional entitlement write succeeded. An older grant for the same subscription does not prove the current provider snapshot matched its immutable intent/customer/product binding.

- For mutations with triggers, use `RETURNING` rows to detect the affected top-level entity. D1 `meta.changes` can include trigger writes; equality to one can misreport a successful membership removal.
