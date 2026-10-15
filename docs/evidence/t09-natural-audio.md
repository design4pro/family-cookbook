# T09 first human audio recordings

Date: 2026-10-15. Two human recordings were supplied and explicitly authorized for Cloudflare processing, including speaker consent. This replaces the earlier missing-all-audio checkpoint with a partial corpus. A third short recipe and a continuous five-minute narration are still missing. Photo fidelity remains unresolved and physical-device evidence remains independently blocked in T03.

## Inputs and access

| Private fixture ID | Duration | Container / codec | Sample rate | Channels | Bytes | Full decode |
| --- | ---: | --- | ---: | ---: | ---: | --- |
| natural-audio-1 | 37.483 s | M4A / AAC | 48,000 Hz | 1 | 323,041 | Pass |
| natural-audio-2 | 45.141 s | M4A / AAC | 48,000 Hz | 1 | 385,946 | Pass |

Original files remain unchanged under ignored `tests/assets/`. Their private filename mapping, hashes and consent record are in `test-results/t09-audio/intake.json`; the public evidence uses neutral IDs because recorder filenames may contain location information. Full decode was checked using FFmpeg, not inferred from metadata alone. Recording device, acoustic conditions, spontaneous/scripted status and complete source reference remain unverified. Ingredient facts were subsequently confirmed by the developer; the scope is recorded below.

Both recordings are shorter than 60 seconds and were sent as their original M4A bytes in one ASR call each. There is no re-encoding, concatenation, padding, looping or manufactured five-minute input. Their durations are usable for short-speech diagnostics; they do not establish cross-chunk correction behavior or the long-recording criterion.

Existing Wrangler authorization ran `@cf/openai/whisper-large-v3-turbo` with Polish transcription and VAD, followed by `@cf/qwen/qwen3-30b-a3b-fp8` with the existing extraction prompt, JSON output and temperature zero. The initial text stage uses its existing 1800-token budget. No scenario, expected answer or manually corrected transcript was supplied to either stage. A bounded second-stage comparison uses `@cf/moonshotai/kimi-k2.6`, reasoning disabled, temperature zero and 4096 completion tokens, with exactly the same saved Whisper text and chunk wrapper. It makes no new ASR call.

## Initial findings

- **natural-audio-1:** Whisper retains the milk correction to 250 ml but produces a corrupted salt-unit word. Qwen's ingredient list uses 250 ml, while its active mixing instruction still contains 300 ml and repeats the correction utterance. It also omits oil from the ingredient list despite retaining it in the steps. Numeric temperature and frying duration remain null. These are observable transcript-to-draft failures independently of whether every ASR word matches the recording.
- **natural-audio-2:** Whisper includes the corrections to sugar, oven temperature and baking duration. Qwen retains superseded sugar at 100 g, despite the transcript's correction to 80 g. It updates top-level temperature/time to 170 and 25 but omits the baking instruction from the steps. The quarter packet of butter remains a packet; no packet weight is invented.

The supplied speech resembles scenarios R01/R02, but the script is not ground truth. The developer subsequently confirmed the ingredient facts from the actual recordings, including half a tablespoon of salt rather than the scenario's half teaspoon. No full-transcript word error rate or whole-recording acceptance is inferred from a matching scenario.

## Harness verification

A failing regression exposed that a missing reference caused an exception rather than an explicit pending assessment. The minimal change makes references optional during intake: schema/truncation failures still fail, while schema-valid output without an independent source reference receives `pass: null` and requires review. A missing reference never produces factual acceptance. All 18 focused tests and the affected TypeScript check pass. Raw initial assessments are preserved separately from subsequent source/semantic review.

## Reproduction

The consented private manifests and all raw responses are under ignored `test-results/t09-audio/`:

```sh
WRANGLER_LOG_PATH=/tmp/family-cookbook-t09-audio-wrangler.log node scripts/evaluation/capture-smoke.ts --run test-results/t09-audio/manifest.json test-results/t09-audio/initial-results.json
WRANGLER_LOG_PATH=/tmp/family-cookbook-t09-audio-kimi-wrangler.log node scripts/evaluation/capture-smoke.ts --run test-results/t09-audio/kimi-replay-manifest.json test-results/t09-audio/kimi-replay-results.json
```

Choose fresh result filenames for repeats. The second manifest points to byte-for-byte preserved initial text-stage inputs; it is a text-only diagnostic, not a second complete audio pipeline. Full pipeline cost includes the original ASR call once. No model, prompt or deployment decision is approved by this evidence.

## Unchanged-transcript Kimi comparison

Kimi uses 250 ml consistently in both ingredients and active steps for audio 1, removes the superseded quantity/correction utterance and includes oil with unknown amount. It still copies the invalid salt-unit token into the ingredient and instruction, without flagging that unit. For audio 2 it applies the sugar correction to 80 g, retains 170°C and 25 minutes, and preserves the quarter packet without inventing its mass. It still omits the baking action from the instructions.

This is a useful correction-handling improvement over Qwen, not a complete audio pass. A correct top-level temperature/time does not compensate for a missing cooking instruction. The developer confirmed that the source says half a tablespoon of salt. The raw ASR/draft unit is therefore a spelling corruption, not evidence that the speaker said half a teaspoon. Kimi's first ingredient list matches the confirmed quantities and coverage when that misspelling is interpreted by the reviewer; the raw result still needs the unit spelling corrected. No model output was edited. Full transcript/method/time confirmation remains pending, so no whole-source accuracy score is claimed. Full transcript source review is saved privately in `test-results/t09-audio/reference-review.md`.

## Human confirmation scope

The developer confirmed the ingredient facts for both recordings: audio 1 uses 2.5 cups flour, 2 eggs, final milk 250 ml, salt 0.5 tablespoon and an unspecified amount of oil; audio 2 uses 200 g flour, final sugar 80 g, 1 egg and 0.25 packet butter with no packet mass. This confirms Qwen's superseded sugar and missing-oil errors and the actual salt-unit spelling issue. The reply concerned ingredients, so it is not recorded as approval of the full transcript, cooking actions, temperatures or durations. These remain separate review items. The private confirmation record preserves the scenario deviation and never enters model input.

## Metering and timing

[Sanitized measurements](t09-natural-audio.json) account for all six actual calls:

| Stage | Calls | Returned neurons | Individual call seconds |
| --- | ---: | ---: | --- |
| Whisper ASR | 2 | 64.144555 | 4.985; 7.393 |
| Qwen structure | 2 | 15.963329 | 2.120; 1.492 |
| Kimi structure replay | 2 | 204.827271 | 6.562; 5.054 |
| Total | 6 | 284.935155 | Not an end-to-end latency |

The original two-stage harness durations were 7.312 and 9.028 seconds, including local decode checks after proxy startup. Kimi values are text-only replay times, not audio-to-draft timings. This small sample is not p95, a device benchmark or the ten-run release timing criterion. Actual invoice charges remain unverified. All originals and text-stage inputs match their recorded hashes after execution; source audio and transcript text were not corrected between models.

## Remaining blockers

Two short human samples are now present and evaluated. To complete the input set, supply the third short recipe (unknowns/incomplete method) and a genuine continuous five-minute narration with delayed corrections, following the [recording scenarios](../../tests/fixtures/capture/recording-scenarios.md). Confirm actual spoken facts and any scenario deviations. Short recordings cannot be concatenated, stretched or looped to substitute for the long sample.

T09 remains blocked on demonstrated photo/audio fidelity problems, the missing inputs and independent human references. C3 and dependent capture work remain open. T03 still requires physical iOS/Android trials; receiving audio does not demonstrate native persistence or permissions. Both readiness gates remain closed.
