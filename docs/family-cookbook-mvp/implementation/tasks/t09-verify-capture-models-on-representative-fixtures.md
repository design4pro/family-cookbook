# T09: Verify capture models on representative fixtures

Status: blocked - photo/audio fidelity unresolved; partial audio corpus and human references pending
Type: engineering
Phase: Architecture proofs
Depends on: T05, O01
Assignee: Codex (technical probes); developer (consented media and human references)

## Outcome

Use a small consented evaluation sample to detect codec, handwriting and structured-output failures before committing to capture UI. This is not the final fifty-example gate.

## Execution result

Cloudflare model catalog and actual Whisper/Scout/Qwen inference access are verified. A reproducible harness, four synthetic audio probes, a blank-image control and eighteen harness regression tests are complete. The initial long-audio result retained a superseded quantity in a step; a prompt revision corrected it in one repeat. This is not the required representative evaluation. The developer subsequently supplied and authorized seven photographs. Three legible and four difficult cases failed provisional source comparison; direct HEIC was rejected and four targeted prompt retries did not resolve the quality failures. See [photo results](../../../evidence/t09-photos.md) and the [alternative vision comparison](../../../evidence/t09-model-comparison.md). Six additional Cloudflare-hosted models were tested. Kimi and GLM read the confirmed fractions correctly, but other factual errors remained; high-reasoning Kimi also safely rejected all three multi-recipe pages. No complete faithful-photo variant was established. The developer confirmed the critical fraction references in photos 2730/2732 and the absence of chilling duration in photo 2731, confirming those model errors. The [two-stage experiment](../../../evidence/t09-two-stage-photos.md) preserves the same corpus and logs transcription/structuring separately; it still has source-fidelity failures. [Human recording scenarios](../../../../tests/fixtures/capture/recording-scenarios.md) are ready for three short takes and one continuous five-minute take. Eighteen harness tests pass. Two consented short human recordings are evaluated; the third short take, five-minute narration and remaining human source-reference review are still missing. See [capture feasibility evidence](../../../evidence/capture-feasibility.md). T09 and C3 remain open; dependent capture work stays blocked. T03 still requires physical devices and both readiness gates remain closed.

The [single-recipe crop comparison](../../../evidence/t09-cropped-photos.md) uses seven full-page PNG controls and ten lossless crops, with exact source-pixel verification and the same GLM transcription prompt/settings. Some word/unit errors improve, but new fraction, ingredient and quantity-like errors appear. Cropping does not establish a faithful-photo variant; no structuring or production-model change is included. The remaining audio inputs and T03 physical devices remain separate blockers.

The [first human-audio experiment](../../../evidence/t09-natural-audio.md) uses two original AAC/M4A files (37.483 and 45.141 seconds), Whisper transcription and Qwen structuring, plus unchanged-transcript Kimi replay. Qwen retains superseded quantities; Kimi improves corrections but still carries an invalid salt unit and omits the baking action. Ingredient facts are developer-confirmed, including half a tablespoon of salt in audio 1; full transcript/method/time reference review remains pending. These short samples do not exercise long-audio chunk boundaries.

## Dependencies

[T05: Prove queued-job allowance settlement](t05-prove-queued-job-allowance-settlement.md), [O01: Prepare isolated verification access](o01-prepare-isolated-verification-access.md)

## Scope and files

Proposed paths relative to the future application repository, not files that already exist in this planning workspace. Create the minimal harness/config required by the first owning task; later tasks modify its proven code rather than rebuild it.

- `scripts/evaluation/capture-smoke.ts`
- `tests/fixtures/capture/manifest.json`
- `docs/evidence/capture-feasibility.md`

Estimated scope: M (one focused implementation or verification slice; normally 2-4 primary files). No wall-clock commitment. If a slice grows beyond one focused session, split the remaining work without widening scope.

## Acceptance criteria

- [ ] Evaluate at least three legible images, three difficult images, three spoken recipes and one five-minute recording with reference facts; preserve spoken corrections and unknown values.
- [ ] Record chosen model IDs, codec/size behavior, decodable chunking, billed usage and latency; validate structured output without treating JSON validity as accuracy.
- [ ] Failures have a manual-entry/retry path; unacceptable quality is reported before feature expansion and does not silently switch to an external model.

## Verification

- [ ] Run the smoke evaluation in the isolated test environment with consented fixtures.
- [ ] Compare quantities, units, temperatures and missing instructions to human references; publish pass/fail by input class.

## Execution checklist

- [x] Read [the final specification](../../spec.md), [the plan](../plan.md) and the dependency results.
- [x] Establish the failing behavior or explicit evidence gap using the cases above; use synthetic or consented isolated fixtures.
- [ ] Implement only this outcome, or collect the operator/milestone evidence for this item.
- [x] Run focused harness regression tests and type checks (representative acceptance checks remain blocked).
- [x] Record evidence, limitations and pass/fail in `docs/evidence/t09.md` or link the named report already produced by this task.
- [ ] Review the diff/results, update dependent contracts if necessary, then mark this task complete. No completion without all acceptance criteria.

## Failure rule

A failed architectural proof blocks dependent work. A failed release criterion keeps its gate closed. A proposed change to accepted product behavior returns to an explicit decision; do not silently relax the specification. Operator access delays are recorded as blockers, not replaced with fabricated test results.
