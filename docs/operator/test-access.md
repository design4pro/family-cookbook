# Test-access prerequisite inventory

Repository: `/Users/rafalwolak/dev/cloudflare/family-cookbook`
Working name: Family Cookbook
Status: T01/T05/T06/T07/T08 access and T09 inference verified on 2026-10-15; O01 remains incomplete for other tasks. See [O01 evidence](../evidence/o01.md).

| Prerequisite | Status | Evidence or next action |
| --- | --- | --- |
| Application repository location | Established | This local repository; see root README and AGENTS.md |
| Application harness and packages | T01 established | pnpm workspace, workerd integration tests, TypeScript and build dry-run |
| Isolated Cloudflare resources | D1/Workers/Queues/R2 verified for T01/T05/T06 | Owner: developer / DESIGN4PRO; dedicated EU database `family-cookbook-t01-proof`, ID `bb45490f-7369-438f-af78-f55202ba5448`; T05 resources listed below; T06 resources listed below; T09 AI inference, photo consent and two audio consents verified; further audio pending |
| Cloudflare authentication | Verified connector access | Connector-managed credentials; no secrets copied to files or CI |
| Verified test email sender | T07 verified | Developer-owned `staging.planned.travel`; only `kontakt@design4.pro` receives actual OTP; all other proof mail stays synthetic. See [T07 evidence](../evidence/t07.md) |
| iOS and Android devices/build access | Local toolchains verified; physical trials blocked | Owner: developer; Xcode 27, valid local Apple Development identity, EAS Owner access, Android SDK/JBR 21; user confirmed only simulators/emulators available. See [T03 evidence](../evidence/t03.md). No physical provisioning or distribution verified |
| Polar sandbox access | T08 verified | DESIGN4PRO organization; approved test customer, completed sandbox checkout and immutable identity verified. Renewal disabled and product archived; see T08 below |
| Hosted Git remote | Not configured | Requires a separate request specifying the hosting destination |

The developer authorized T01 resource setup through the Cloudflare connector. Account `6cfdf3b5143cddc631383a4c14736c3a` was verified and the isolated database was created for synthetic proof fixtures only. Local configuration cannot target it by default. Keep credentials outside this inventory. Email, devices and billing are not prerequisites for T01 and remain unverified.

## T05 verification resources

The developer requested T05 and its required remote proof. Owner: developer / DESIGN4PRO, account `6cfdf3b5143cddc631383a4c14736c3a`. Connector credentials remain managed by the connector.

- EU D1: `family-cookbook-t05-proof`, `7bfd0285-35e1-41ea-a78a-013d90c203c8`.
- EU Queue: `family-cookbook-t05-proof`, `a6ff17e10b07451da948d4252ab9736e`.
- Worker: `family-cookbook-t05-proof`; Queue consumer `037c582adfc34d068b76f8943df2e6f1`.
- Worker exports only Queue/scheduled handlers. Public workers.dev and preview URLs are disabled; no recurring cron is installed. Only the named test D1 and Queue are bound.
- Remote create/publish/consume/read access was exercised successfully, with only synthetic fixtures. See [T05 evidence](../evidence/t05.md).

T03 still awaits physical iOS/Android tests. AI, email and billing sandboxes remain unverified; T05 does not require them. Retained T05 resources are test-only and do not authorize a pilot or production deployment.

## T06 recovery resources

Owner: developer / DESIGN4PRO, same verified account. Connector access exercised creation, queries, actual Time Travel, private R2 read/write/delete/list and settings, Worker deployment and serial maintenance Queue consumption.

- Application D1: `family-cookbook-t06-restore`, `2f2238b6-1d77-4b63-8667-7486e05c725c`.
- Independent journal D1: `family-cookbook-t06-journal`, `5deb5202-3e65-4dec-9139-4ef91f158584`. Both D1 databases use EU jurisdiction/EEUR primary with replication disabled.
- R2: `family-cookbook-t06-active`, `family-cookbook-t06-recovery`; EEUR placement, **default jurisdiction**, private managed/custom access, no locks. Recovery copies have a 29-day age-expiry fallback, not a hard deletion SLA.
- Worker/Queue: `family-cookbook-t06-proof`; Queue ID `cfb93f90f3d84abf93b5ad16ad59f06a`, consumer `dfbfadb4dbfb42f0be678912bb34400d`. No public/preview URLs, HTTP handler, recurring cron, application job producer or external processor.
- Account subscription lookup was denied (`10000 Authentication error`); exact D1 billing tier remains unverified. Provider physical retention acceptance remains with T38/Gate 1.

See [T06 evidence](../evidence/t06.md) and [runbook](../runbooks/recovery.md). Synthetic resources remain available for inspection. No pilot or production rollout is authorized; T03 physical-device blocker remains unchanged.

## T07 authentication access

Owner: developer. Existing Resend credential source: `EMAIL_API_KEY` in `/Users/rafalwolak/dev/cloudflare/planned.travel/.dev.vars`; no credential value belongs in this inventory. Authenticated domain lookup and actual sends/delivery passed for `staging.planned.travel` (EU West), using `cookbook-t07@staging.planned.travel` and the sole approved recipient `kontakt@design4.pro`. This is a borrowed test sender, not cookbook branding. No new provider key, public endpoint or production resource was created.

Local D1, Chromium/WebKit, iOS 27 Simulator and the isolated Android API 35 Emulator passed T07 session checks with embedded Release builds. iOS simulator ad hoc signing supplies the required Keychain identity; physical provisioning/distribution is still unverified. T03 remains blocked on physical-device acceptance. See [T07 evidence](../evidence/t07.md) and [reproduction](../runbooks/auth-session-proof.md). Earlier unverified-email statements above describe earlier task checkpoints.

## T08 Polar sandbox access

The developer explicitly selected Polar as the sole purchase channel, including removal of native IAP scope. See [ADR 0001](../decisions/0001-polar-only-purchases.md) and [T08 evidence](../evidence/t08.md). Polar Sandbox MCP independently authenticates to DESIGN4PRO (`0cad0d45-3b92-4144-ad4c-1438ec9cd6d3`). Product/link creation and read access work; a temporary HTTP 502 recovered. Local reference-project tokens returned 401 and were not copied. No production connector was used.

The isolated private product is `0c5576c5-d32e-4a6c-a64e-7d03f4f702c4`; checkout link ID is `a2e19483-183f-4d2d-9989-283033d038ea`. The developer explicitly approved the test alias and completed sandbox checkout after a required user handoff. Subscription `6d5424e6-3ef2-444e-9b82-ac10a39fcef6` was verified through MCP; renewal is disabled and the product archived. **Permission to send OTP through Resend does not authorize transferring that address to a different provider.** Destination-specific consent was recorded before the successful test customer creation.

Apple/Google/RevenueCat billing sandbox credentials are no longer required by the accepted scope. Native signing/distribution credentials and an accepted distribution route remain release prerequisites. T03 still needs physical devices.

## T09 model evaluation access

Owner: developer / DESIGN4PRO, same account. Cloudflare MCP model catalog reads and actual Qwen/Scout calls succeeded. Existing local Wrangler OAuth with `ai:write` ran Whisper and Qwen through a temporary AI-only remote proxy; no credentials were copied, no public product endpoint or storage resource was deployed. WAV/PCM, M4A/AAC and WebM/Opus synthetic inputs worked. Provider token/neuron metering is recorded; actual invoice charge and account-wide remaining free allocation are unverified. The developer supplied seven photographs in `tests/assets` and explicitly approved Cloudflare processing. Photo evaluation failed quality checks. Two human recordings now have explicit processing/speaker consent and successful Whisper/Qwen/Kimi access, with quality failures; further audio and full human references remain pending. Raw private photo results remain ignored by Git; see [photo follow-up](../evidence/t09-photos.md). The [alternative vision comparison](../evidence/t09-model-comparison.md) verifies access to six additional catalog models, including paid-tier Kimi and GLM. See [capture evidence](../evidence/capture-feasibility.md). The [two-stage proof](../evidence/t09-two-stage-photos.md) verified transcript-only structuring and replay access. The [crop comparison](../evidence/t09-cropped-photos.md) also verifies PNG transcription access using the same photo consent, with exact pixel-preservation checks. The [first human-audio proof](../evidence/t09-natural-audio.md) records the explicit new consent and two evaluated files; remaining scenarios and source references are pending. Earlier AI-unverified statements describe historical checkpoints. T03 physical-device access remains blocked.
