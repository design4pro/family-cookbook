# T09 capture feasibility evidence

Date: 2026-10-15. **Status: incomplete / photo and audio quality unresolved; partial audio corpus and full human references pending.** Access and synthetic technical checks succeeded. A later [seven-photo evaluation](t09-photos.md) failed source accuracy despite valid JSON; neither the ten-input architecture proof nor the fifty-example release gate is passed. T03 remains blocked on physical iOS/Android devices. Both readiness gates remain closed.

## Latest human-audio follow-up

Two consented original human recordings (37.483 and 45.141 seconds) have now been decoded and evaluated in Cloudflare. [The audio report](t09-natural-audio.md) records Qwen correction failures and remaining Kimi unit/step failures. The third short recipe, continuous five-minute recording and human-confirmed actual references remain outstanding. Historical missing-all-audio statements below describe earlier checkpoints. Photo fidelity remains unresolved; T03 still lacks physical-device evidence.

## Photograph follow-up

The developer supplied seven HEIC photographs and explicitly authorized Cloudflare processing. Three legible and four difficult cases were evaluated as normalized JPEG; none passed provisional visual source comparison. Direct HEIC failed. Four targeted repeats with a revised prompt also failed. See [the photo report](t09-photos.md) and [sanitized measurements](t09-photo-summary.json). Photo access is no longer missing. Natural audio and full human reference review remain outstanding. A subsequent [alternative-model comparison](t09-model-comparison.md) tests six additional Cloudflare-hosted vision models on the same corpus: Kimi/GLM improve the confirmed fractions, but other factual errors remain and no complete photo variant passes. The [two-stage photo experiment](t09-two-stage-photos.md) also leaves source fidelity unresolved; [recording scenarios](../../tests/fixtures/capture/recording-scenarios.md) now prepare the missing human audio but are not recordings or acceptance evidence. The subsequent [single-recipe crop comparison](t09-cropped-photos.md) verifies unchanged source pixels but finds mixed OCR improvements and new factual errors in GLM; it does not resolve photo feasibility. The sections below preserve the earlier synthetic checkpoint unless explicitly updated.

## Access and scope

T05's local/remote Queue allowance proof is complete. Cloudflare MCP and local Wrangler OAuth authenticate to DESIGN4PRO, account `6cfdf3b5143cddc631383a4c14736c3a`. Wrangler has `ai:write`; its initial sandbox network failure was resolved by running the authorized network check outside that restriction. No new credential was copied. Model catalog reads and actual inference succeeded for all three candidates:

| Purpose | Exact model ID | Evidence |
| --- | --- | --- |
| Transcription | `@cf/openai/whisper-large-v3-turbo` | Two runs of WAV, AAC/M4A, Opus/WebM and chunked five-minute AAC |
| Image extraction | `@cf/meta/llama-4-scout-17b-16e-instruct` | One synthetic blank-PNG negative control only; no recipe accuracy claim |
| Structure | `@cf/qwen/qwen3-30b-a3b-fp8` | Text access probe plus eight transcript structuring calls |

The harness uses a temporary remote AI binding with no application D1/R2/Queue bindings or public product route. Calls use the shared account's real AI meter, not an isolated billing allowance. At this earlier synthetic checkpoint, no family data, third-party voice or external inference provider was used. Source speech was locally generated macOS Zosia TTS from agent-authored Polish recipe utterances. The five-minute source loops the correction utterance; it is a load/boundary probe, not a representative narration. Media generation, manifest and reproduction instructions are in [the fixture README](../../tests/fixtures/capture/README.md).

## Required input-class results

| Required class | Required | Representative examples evaluated | Result |
| --- | ---: | ---: | --- |
| Legible recipe photographs | 3 | 3 | FAIL: factual errors; human reference confirmation pending |
| Difficult photographs, including handwriting | 3 | 4 | FAIL: unrelated recipes merged or facts invented; human reference confirmation pending |
| Natural spoken recipes | 3 | 2 | FAIL / PARTIAL: correction, missing-step and unit-spelling findings; one short sample and full source review still missing |
| Natural five-minute recording | 1 | 0 | BLOCKED: synthetic repeated speech cannot establish natural narration quality |

The developer subsequently supplied `tests/assets` and explicitly authorized Cloudflare processing; full human reference approval is still pending. The synthetic inputs are not counted as ten representative cases. C3 model-feasibility review and T10/T16/T19 remain blocked by the unfinished proof; other independently ready work may continue.

## Observed technical results

| Synthetic input | Bytes | Duration | Container/codec | First / revised job latency | Findings |
| --- | ---: | ---: | --- | --- | --- |
| Quantity correction | 423,808 | 13.242 s | WAV / PCM s16le, 16 kHz mono | 4.905 / 3.479 s | 200 corrected to 250; milk 100; unknown temperature/time preserved |
| Temperature and time | 91,348 | 9.724 s | M4A / AAC, 16 kHz mono | 2.637 / 4.052 s | 2 eggs, 50 sugar, 180 C and 25 minutes preserved |
| Unknown amounts | 80,862 | 8.578 s | WebM / Opus, 48 kHz mono | 3.782 / 2.042 s | Potato/salt amounts and absent time remain null |
| Repeated correction load | 2,796,908 | 300.000 s | M4A / AAC, 16 kHz mono | 38.159 / 55.774 s | Initial stale amount in steps; revised prompt removed it in this repeat |

These are individual local-to-remote job measurements, including local media work after the remote proxy was established. They are not percentiles, queue latency, mobile measurements, maximum supported sizes or the ten-run three-minute release criterion. AAC/Opus files were generated by FFmpeg, not captured by actual device/browser recording APIs. No five-minute unchunked provider limit was inferred.

Audio ranges are `[0,60]`, `[58,60]`, `[116,60]`, `[174,60]`, `[232,60]`, `[290,10]` as start/duration seconds. FFmpeg decodes the source and re-encodes every range into an independently decode-checked 16 kHz mono WAV. Never split compressed bytes. Two-second overlap yields 310 provider audio seconds for a 300-second source. T05 user allowance must remain 300 accepted seconds, regardless of chunks or retries. Desktop FFmpeg is evaluation tooling; production transcoding/runtime placement and native/browser capture remain unproven.

## Accuracy, failures and mitigation

1. Initial Qwen five-minute result correctly used 250 g in ingredients but still said `Dodaj 200 g mąki.` in a cooking step. This is a factual failure despite valid JSON and a correct ingredients array. A regression assertion now rejects superseded amounts in steps. The smallest prompt revision applies corrections to every field and forbids quoting superseded numbers/correction utterances in steps. One actual repeat removed the stale amount. This is a regression result, not proof of reliability on natural speech.
2. Scout's negative-control response contained no invented recipe, but returned `ingredients: null` and `steps: null` despite requested arrays. The validator rejects it. A blank-image prompt explicitly disclosed that it was a negative control; this proves endpoint/schema handling only, not independent image understanding or recipe extraction.
3. Exact ingredient comparison flags `mąka` versus `mąki`, `cukier` versus `cukru` and `gramów` versus `g`/`mililitrów` versus `ml`. Manual inspection finds the intended values in these synthetic cases; those string differences must not be described as quantity errors. The strict comparator deliberately does not infer semantic equivalence. In both runs, 1/4 synthetic cases passes the exact automated comparison. That score is not an accuracy estimate.
4. Automated validation checks schema, exact ingredient facts, temperature/time, completely missing/invented steps, and fixture-specific forbidden step patterns. It does **not** establish full semantic completeness of instructions or uncertainty. Every output is marked for human source comparison, including a passing output. References here are agent-authored and not human approved.

On any schema/inference/factual failure, preserve the source, prevent automatic publication and offer retry/manual entry when T16/T19 implement the UI. Ordinary review is also mandatory for apparently successful results. No automatic external-model fallback was added. The harness reports the recovery path; it does not claim a completed capture screen.

## Metering and cost

[Raw first run](t09-synthetic-initial.json), [raw revised run](t09-synthetic-revised.json), [access/blank-image probes](t09-access-probes.json), and [usage totals](t09-usage.json) retain responses, per-stage latency and returned usage. Reports include prompt versions and hashes of source media. Original assessment results remain intact; `regressionAssessment` applies the added stale-step check to recorded outputs without another inference call.

- First run: 13 calls, 288.879163 neurons; revised run: 13 calls, 288.176820 neurons.
- Two access/negative-control calls: 10.020218 neurons.
- Total: **28 calls, 587.076202 provider-reported neurons**, equivalent to **USD 0.00645784** at the current USD 0.011/1,000 neurons list rate before account-wide free allocation. This is an estimate from metering, not a verified invoice charge. Do not add token-price and neuron-price estimates together.
- Whisper reports zero text tokens while reporting nonzero neurons. Zero tokens do not mean zero usage. Every overlap and repeated evaluation is included in these totals.

The provider documents a shared 10,000-neuron daily free allocation and paid overage pricing. Remaining account allocation, billing tier and actual invoice deduction were not established by these runs. [Cloudflare pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), [Whisper](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/), [Scout](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/), [Qwen](https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/) were checked on 2026-10-15.

## Verification and remaining acceptance

Six focused Node tests pass, covering wrong quantities, unknowns, units, missing steps, invalid schema, chunk coverage, obsolete quantities in steps and null vision arrays. The focused TypeScript check passes. The initial test run failed because the harness did not yet exist. No application code or dependency was changed, so unrelated API/native suites were not rerun.

To close T09, evaluate the ten required representative inputs with human-checked references, including real handwriting, spoken corrections and missing facts; adjudicate semantic differences; record image/codec limits encountered, latency and provider metering; and decide whether resulting quality meets the unchanged review contract. The revised prompt and local validation do not substitute for this missing evidence. Keep T03's physical-device blocker separate and unchanged.
