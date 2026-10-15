# T09 two-stage photograph extraction

Date: 2026-10-15. **Two stages make error attribution possible, but do not yet establish faithful automatic extraction.** This experiment uses the same seven consented JPEGs as the [direct-model comparison](t09-model-comparison.md). Natural recordings remain absent and block T09; physical-device acceptance remains separately blocked in T03. Both readiness gates remain closed.

## Design and controls

1. **Photograph to literal transcript.** Kimi K2.6 with reasoning disabled, or GLM 5.3 Flash with low reasoning, receives the unchanged JPEG and a plain-text transcription instruction. Both use high image detail, temperature zero and a 4096-token completion budget. The prompt preserves headings, fractions, lines, corrections and uncertainty, and separates the adjacent-page fragment. There is no recipe schema or answer key at this stage.
2. **Transcript to draft.** Qwen3 30B A3B FP8 receives only that exact transcript, an extraction instruction and a JSON-object response request, with temperature zero and 3000 output tokens. It never receives the image or reference facts. A subsequent replay sends GLM's saved transcripts to Kimi K2.6 with reasoning disabled and 4096 completion tokens. A targeted replay tests Kimi high reasoning with 8192 tokens on 2729, 2732 and 2735: unrelated recipes, a largely faithful transcript and a corrupted transcript respectively.

The replay is an intervention on the second stage only. Both the image hash and transcript hash must match the saved run; edited transcripts are rejected. No transcription is manually corrected between stages, and no expected quantity is included in any model prompt. No cross-model voting or selection of the best field from different responses is performed. The high-reasoning replay is a three-case diagnostic, not a complete seven-photo configuration pass.

All models run through the existing AI-only Cloudflare Workers AI proxy. Current [Qwen model documentation](https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/) and the earlier authenticated catalog/schema checks ground the calls. No external inference endpoint, database, storage bucket or production app was added. Private originals, transcripts, prompts and provider responses remain ignored under `tests/assets/` and `test-results/t09-photos/`. The [sanitized measurements](t09-two-stage-photos.json) contain hashes, settings, timing, metering and classifications, not recipe transcriptions.

## Findings by stage

| Photo | Transcription evidence | Structuring evidence |
| --- | --- | --- |
| 2729 | Both models retain two unrelated recipe headings. They corrupt the removal-from-heat phrase, including reading a letter as a digit. | Qwen and non-reasoning Kimi select the first recipe instead of requesting a closer image. Kimi with high reasoning returns an empty draft and exact `multiple_recipes` warning. |
| 2730 | GLM retains 2.5 cups and half-packet fractions, but corrupts the word for a bag. Kimi exhausts 4096 tokens; no second call is made for that incomplete transcript. | Qwen attaches cup units to eggs/yolks and invents an amount for flavoring. Non-reasoning Kimi preserves the fractions, but turns the corrupted bag word into an instruction to form the dough into a shape. |
| 2731 | GLM preserves the absent chilling duration and quantities, with an uncertain ingredient spelling. Kimi turns flavoring into a two-package-like phrase and collapses columns. | Qwen drops the sponge preparation/baking instruction from the GLM transcript, despite retaining the top-level baking duration. Non-reasoning Kimi preserves the steps and unknown chilling duration; its draft still inherits the uncertain ingredient spelling. |
| 2732 | Both transcripts retain 0.5 packet butter, 0.25 packet topping margarine and the mixing instruction. The related topping remains visible. | Qwen drops the topping from the Kimi transcript and falsely flags multiple recipes in the GLM transcript because of the adjacent fragment. Non-reasoning Kimi preserves both fractions, the topping, instruction-only ingredients and mixing, with unknown amounts left unknown. High-reasoning Kimi instead exhausts 8192 tokens without a final draft after 216.409 seconds. |
| 2733 | Both retain the unrelated drink and sauce. GLM additionally misreads a drink fraction; this page should be rejected as multi-recipe regardless. | Qwen and non-reasoning Kimi merge the recipes. A free-form warning does not make the merged draft acceptable. |
| 2734 | Both retain the unrelated patties and fish recipes; GLM includes a page number among recipe text. | Qwen and non-reasoning Kimi merge the recipes; Qwen additionally invents quantities and imports fragment text. The fish brine's timing must not become a shared cooking time. |
| 2735 | Kimi invents a brandy amount and butter; GLM changes flour to ginger and reads a word as a chicken quantity. Neither transcript is faithful. | Qwen introduces further quantity/unit reassignment. Non-reasoning Kimi preserves more transcript structure, but passes its false ingredients/counts downstream. High-reasoning Kimi exhausts 8192 tokens without a final draft after 164.027 seconds. A structurally faithful transformation of inaccurate OCR remains wrong against the photograph. |

These are source comparisons, not exact-string scores. The three critical fractions and the absence of chilling duration have prior developer confirmation. Remaining detailed source readings are provisional agent references and still need human confirmation. An uncertain spelling is recorded separately from invented numeric facts or changed cooking operations; no configuration is rejected solely because of different ingredient order or grammatical inflection.

The strongest demonstrated local improvement is photo 2732: separating a faithful transcript from Kimi structuring preserves the fractions and mixing instruction that direct high-reasoning image extraction previously changed. This does not establish general reliability or a complete photo proof. Safe multi-recipe rejection also counts separately from successful recipe extraction.

## Usage and timing

This experiment made **37 actual inference calls: 14 image-transcription calls and 23 text-structuring calls**. One Kimi transcription exhausted its budget and correctly skipped structuring. The second-stage comparisons replayed existing transcripts; they did not incur another image call. All 37 attempts returned usage, totaling **13,618.723289 neurons**, a list-price equivalent of **USD 0.14980596** at USD 0.011 per 1,000 neurons before shared allocation and adjustments. Actual invoice charge remains unverified; earlier direct-model and audio experiments are excluded.

Initial Kimi/Qwen individual calls took 1.573-84.556 seconds; GLM/Qwen calls took 1.738-42.871 seconds. Kimi's non-reasoning text replay took 7.696-26.604 seconds per photo; its three high-reasoning text calls took 32.329-216.409 seconds, with two budget-exhausted failures. These are individual observed timings, not p95. To estimate a complete replayed pipeline's latency/cost, add its original transcription stage once to the replayed structuring stage; do not report the text-only replay as the full pipeline.

## Harness verification and lessons

The existing harness gained an opt-in two-stage mode and transcript replay; its direct-mode default remains unchanged. Incomplete, empty or non-text transcription stops the pipeline. A second-stage error cannot cause a fallback that silently invokes direct image extraction. Every real inference attempt is separately logged with a stage name and returned usage.

Sixteen focused tests and the affected TypeScript check pass. New tests check the exact text-only stage boundary, no image/reference leakage, refusal to structure incomplete transcripts, replay hash integrity, rejection of unexpected output fields, and multi-recipe warnings containing explanatory text. The last two checks close observed validator gaps: models returned undeclared `multiple_recipes`/`reason` fields, or embedded the warning as a prefix in a free-form uncertainty. Historical raw evaluations remain unchanged; current-schema assessments are recorded separately in the sanitized report.

The validator still cannot discover every invented ingredient or instruction without source evidence. Passing JSON validation is not factual acceptance. Do not silently repair OCR using expected fixture values, remove failed attempts from totals, or count a source-preserving copy of incorrect OCR as successful extraction.

## Audio preparation and remaining work

The [human recording scenarios](../../tests/fixtures/capture/recording-scenarios.md) provide three short Polish recipes and one approximately 558-word continuous five-minute narration. They exercise fractions, explicit corrections, delayed cross-chunk corrections, unknown quantities, absent temperatures/times and incomplete methods. References are preparation checklists, not verified recordings. Speaker consent, actual files, decode/duration checks, human confirmation against the recorded words and actual inference are still required.

A laptop microphone can provide this model-evaluation audio. It does not satisfy native permissions, interruptions or physical-device persistence. Keep T09's missing recordings and unresolved photo quality separate from T03's missing physical iOS/Android trials. C3 and dependent capture work remain blocked; no product model or readiness gate is approved by this experiment.
