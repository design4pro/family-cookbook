# Isolated recovery and deletion replay

Scope: T06 synthetic architecture proof. This runbook does not authorize a production restore or a pilot. Full-graph recovery, entitlements and provider retention acceptance belong to T38/Gate 1. See [T06 evidence](../evidence/t06.md).

## Boundary and prerequisites

- The application D1 database, active R2 bucket and recovery R2 bucket are separate resources. D1 Time Travel restores database rows, not object bytes.
- The deletion journal and recovery control live in a separate D1 database. Never restore them with application data. The journal contains opaque account IDs, sequence numbers and original request/purge times. `proof_audits` is a synthetic evidence table, not part of the production journal contract.
- Verify exact account/resource IDs, fresh journal availability, private bucket settings, retained-source checksums and the complete copy inventory before touching history. Missing journal data is a stop condition, not an empty deletion list.
- Permit only one recovery operator. Stop application reads, uploads, job consumers, reconciliation, cron and other outbound effects; drain/quiesce in-flight handlers before restoring. An epoch comparison is not a distributed lock and cannot stop an already running external processor. The proof Worker has one serial maintenance consumer and no application routes, scheduled handler or producer.

## Procedure

1. Record the current independent journal sequence and close `recovery_control` before invoking the provider restore. Keep the service isolated even when application D1 is unavailable. Obtain and save the chosen bookmark and the provider's undo bookmark.
2. Restore only the disposable application D1. Historical sessions, membership and jobs are untrusted. Inspect them privately to demonstrate the negative control; never expose restored rows before replay.
3. Run `restoreHousehold` from `apps/api/src/recovery/restore-household.ts`. For an in-process provider adapter, pass the restore operation as its callback so the gate closes first. For the remote proof, the operator already closed the external gate, invoked Time Travel, then sent the `replay` maintenance action; its callback is intentionally empty.
4. Replay every independent deletion through the T02 contribution planner. Revoke all restored sessions, remove deleted membership, tombstone affected sources, cancel invalid jobs, remove their results and release only reserved allowance. Keep independent content; incomplete recipes remain review-required. Delete source/recovery/processor/cache/export objects before dropping their manifest entries so interrupted deletion is retryable.
5. Recover missing retained sources from the private R2 recovery bucket. Compare SHA-256 before upload and after reading the restored object. Enumerate both buckets under the isolated prefix and compare exact inventories. Unknown copies, missing originals/backups, bad checksums or an incomplete mapping keep recovery closed.
6. Record active purge completion only after object verification. Preserve original request and confirmed purge timestamps on every later replay. Atomically verify the external epoch and journal high-water sequence before changing the gate to `verified`. A new deletion closes the gate and requires replay again.
7. Keep application traffic paused until remaining release-specific checks pass. A future consumer must check `assertRecoveryVerified(JOURNAL, message.recoveryEpoch)` before claiming a job. Old envelopes without an epoch are rejected. The job generation alone is insufficient because Time Travel can rewind it to a value present in surviving Queue messages. Resume only newly dispatched envelopes carrying the current external epoch; never bulk-replay an old queue blindly. Retained users must sign in again; T38 must refresh provider entitlements before access.

Any error leaves the gate closed. Retry purge/recovery without resetting deadlines. If a copy has no known owner or deletion route, investigate it before reopening. A missing external journal cannot be repaired by restoring an older journal snapshot together with application D1.

## Deadline and retention rules

| Obligation | Evidence required |
| --- | --- |
| Immediate access revocation | Successful durable deletion request closes the external gate; authenticated routes/consumers must honor it. T06 verifies the guard, not the future production authentication UI. |
| Active purge within 7 days | Original request time plus seven days; successful object deletion/head/list verification and database cleanup acknowledgments. A procedure start timestamp is not completion. |
| Backup expiry within 30 days after purge, at most 37 days after request | Deadline is the earlier of those two limits. Provider history, recovery copies, processor copies and exports need independent evidence; do not reset the deadline after recovery. |

D1 documents seven days of Time Travel on Free and 30 on Paid. The proof account's exact billing tier was not visible to the connector. Provider history is not erased by deleting active rows or replaying the journal. Restoring old rows may introduce a new history segment: **suppression does not prove physical expiry**. T38 must establish a recovery/retention strategy that still meets the original deadline, including any temporary restore workspace, or keep Gate 1 closed.

The proof recovery bucket has a 29-day object-age expiry rule and both buckets abort incomplete multipart uploads after one day. R2 lifecycle work is asynchronous and may take longer than 24 hours; it cannot certify the strict deadline by itself. Explicit deletion and verification are primary. Age expiry is a synthetic-fixture fallback, not a production backup-rotation design: retained originals need maintained recoverable copies, while deleted data must never be recopied or get a new deadline.

Retain minimal journal entries until all eligible restore points and copies are no longer capable of resurrecting the account, under the operator's documented retention policy. No automated journal expiry is introduced by this proof. Downloaded user-owned exports cannot be recalled; application-managed exports and caches must be included in the purge inventory. External processor retention is not exercised by synthetic R2 stand-ins.

## Reproduce the proof

```sh
pnpm test:api tests/recovery/restore-household.test.ts
pnpm test:api
pnpm typecheck
pnpm --filter @family-cookbook/api build
```

Remote resource IDs and the captured bookmark are in `docs/evidence/t06-remote.json`. A fresh full run requires empty disposable resources with the same roles, not a reset of the retained evidence. Apply API migrations `0001`/`0002` plus `tests/recovery/application-schema.sql` to application D1; apply only `tests/recovery/journal-schema.sql` to the independent journal.

Build `build:proof:t06`. Upload `dist/t06/t06-worker.js` with exactly `DB`, `JOURNAL`, `ACTIVE`, `RECOVERY` bindings through the authenticated connector. Keep public/preview URLs disabled and install only a serial maintenance Queue consumer (`batch_size=1`, `max_concurrency=1`). Do not bind application queues, billing, email or model services.

Send each JSON action through the maintenance Queue and wait for its successful `proof_audits` row before proceeding:

1. `{"action":"seed"}`; save the current D1 Time Travel bookmark.
2. `{"action":"delete"}`; verify B removal and A retention.
3. `{"action":"disaster"}`; verify the gate is closed and A's active source is missing.
4. Invoke `POST /accounts/{account_id}/d1/database/{database_id}/time_travel/restore?bookmark=...` for the exact disposable application database only.
5. For the abandoned-job fault case, set the retained A job to `running`, `attempts=3`, a synthetic token and an unexpired lease after restoring. Send `{"action":"inspect-restored"}`; require restored B text/sessions/jobs, unchanged journal, missing A source and denied read guard.
6. `{"action":"replay"}`; require one recovered A source with the original hash, no B-derived inventory, revoked sessions, canceled B job, released B reservation, unchanged deletion dates and zero stale processing/results. Public traffic and outbound effects remain disabled in this proof.

Control actions are one-shot per isolated fixture; completed actions are acknowledged on redelivery. This is a test driver, not a crash-safe provisioning/orchestration service. Inspect failed audits and create a fresh fixture when setup failed; never interpret a prior audit as a new rehearsal.

Provider references: [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/), [R2 lifecycle execution](https://developers.cloudflare.com/r2/buckets/object-lifecycles/), [R2 consistency](https://developers.cloudflare.com/r2/reference/consistency/).
