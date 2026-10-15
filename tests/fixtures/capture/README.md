# Capture smoke fixtures

`manifest.json` contains synthetic technical probes, not the representative T09 acceptance corpus. Generate media with `node scripts/evaluation/prepare-synthetic-audio.mjs` on macOS with Zosia, FFmpeg and FFprobe installed. Generated binaries are ignored. The Polish utterances are quoted test data; no actual family recipe, voice or personal information is used.

To complete T09, supply an explicitly consented local manifest containing three legible recipe photographs, three difficult photographs (including handwriting), three natural spoken recipes and one natural five-minute recording. Include spoken corrections, unknown quantities/units/temperature/time and incomplete instructions. Record provenance, consent, device/container/codec and independently checked reference facts. Human reference review remains pending.

Each fixture has `id`, `kind` (`image`, `audio`, `text`), `path` relative to the manifest, `mime`, `consent`, `synthetic` and `reference`. A reference has `ingredients` with `name`, `quantity` and `unit`, `temperatureC`, `minutes`, `steps`, and `uncertainties`. Use JSON null for missing values. `forbiddenStepPatterns` optionally detects superseded facts in steps. The harness checks exact ingredient facts and numeric fields; names/unit variants may need manual adjudication. It does not semantically verify every instruction. Every result requires a human source comparison, even if automated assertions pass.

Do not check private fixtures or output into Git. Keep them outside the repository and pass an absolute manifest path. `consent: true` records an actual permission or authored synthetic provenance; it must never be set speculatively. All listed source bytes are sent to Cloudflare Workers AI when the harness runs. No external inference provider is used.

```sh
node --test scripts/evaluation/capture-smoke.test.ts
node scripts/evaluation/prepare-synthetic-audio.mjs
WRANGLER_LOG_PATH=/tmp/family-cookbook-t09-wrangler.log node scripts/evaluation/capture-smoke.ts --run tests/fixtures/capture/manifest.json test-results/capture-smoke.json
pnpm exec tsc --noEmit --target es2023 --module nodenext --moduleResolution nodenext --types node --allowImportingTsExtensions --skipLibCheck scripts/evaluation/capture-smoke.ts scripts/evaluation/capture-smoke.test.ts
```

The explicit remote run requires Wrangler login with Workers AI access to DESIGN4PRO. Its isolated configuration binds only AI, creates a temporary remote proxy session, disposes it at the end and has no database, bucket, queue or public product route. Inference consumes the account's usage allowance. Results record model IDs, SHA-256, media sizes/codecs, latency and provider-reported usage. Usage is not a verified invoice charge.

Audio over 60 seconds is decoded and re-encoded as mono 16 kHz PCM/WAV in 60-second chunks with two-second overlap. Every chunk is decode-checked before inference. This is a desktop evaluation tool, not a proposed FFmpeg-in-Workers production implementation. Native/browser recording and production transcoding feasibility remain separate obligations. Overlap consumes provider audio usage, while T05 user allowance settlement still counts only the original accepted duration.

On schema, inference or factual failure retain the source, reject automatic saving and offer retry/manual entry in the owning capture tasks. This harness reports the fallback; it does not implement a capture UI. Do not add external-model fallback or relax unknown/correction semantics to obtain a passing score.

## Consented photograph follow-up

Seven private source images in ignored `tests/assets/` were authorized for Cloudflare processing. Normalized JPEGs, manifests, provisional visual references and complete responses are under ignored `test-results/t09-photos/`; see the sanitized [evidence report](../../../docs/evidence/t09-photos.md). Keep originals and their full transcriptions out of Git. Verify actual decoding and orientation after conversion; an exit status alone did not catch an invalid sandbox-generated JPEG. Direct HEIC failed on the evaluated Scout endpoint.

`reference.requiredUncertainties` can require an exact review reason, such as `multiple_recipes`. A response carrying this warning with a populated draft is rejected even if its other fields match. Test ingredient facts and instructions separately: valid JSON, correct top-level time and generic uncertainty text did not prevent wrong fractions, invented chilling times or merged recipes. The flat proof schema does not establish component/alternative/per-step-time fidelity; human source comparison is mandatory.

## Alternative vision configurations

The private manifest can set `imageModel` to one of the reviewed Cloudflare-hosted candidates in `capture-smoke.ts`; omission retains Scout. See the [comparison](../../../docs/evidence/t09-model-comparison.md) and [catalog snapshot](../../../docs/evidence/t09-model-catalog.json). `imageDetail: "high"` requests supported high-detail image input without altering source bytes. `gemmaThinking: true` or `kimiThinking: true` enables that model's reasoning variant with an 8192-token completion budget; their comparison defaults disable thinking with a 4096-token budget. Qwen 3.8 and GLM use low reasoning with 4096 tokens. Mistral retains 1800 tokens. Moondream uses its query API with explicit `stream: false`, reasoning enabled and 4096 tokens. Settings are evaluation variants, not product model decisions.

For Kimi, `kimiTokenBudget: 16384` records the explicitly tested larger-budget retry; it is not an unbounded retry policy. For example, copy the private three-photo screening manifest, change only `imageModel`/the supported variant fields, and run:

```sh
WRANGLER_LOG_PATH=/tmp/family-cookbook-t09-wrangler.log node scripts/evaluation/capture-smoke.ts --run test-results/t09-photos/kimi-high-manifest.json test-results/t09-photos/kimi-high-repeat.json
```

Do not supply reference answers in prompts or overwrite a previous result. Compare hashes and all source facts, not just schema success or the previously failing fractions. A completion that consumes its entire budget without a final draft fails extraction. A `high` detail flag does not prove greater effective resolution; record the returned usage as well. Transport responses must be decoded before interpreting an empty serialized object as model output. Moondream uses a nested `result.answer`; unknown metering stays unknown. These response shapes have focused regression coverage.

## Two-stage photo proof

Set `imagePipeline: "transcribe-then-structure"` on an image-only private manifest. Stage one requests a literal plain-text transcript using the selected chat-compatible image model. Stage two receives that exact text, with no image or references, and returns the draft. Empty or truncated transcription stops the pipeline. The defaults use Qwen3 30B A3B FP8 for stage two; `structureModel: "@cf/moonshotai/kimi-k2.6"` selects the reviewed alternative. For Kimi, `structureReasoning: "high"` uses 8192 completion tokens instead of 4096 with reasoning disabled.

For an isolated second-stage comparison, set `transcriptionsFrom` to the prior private two-stage result file, relative to the manifest directory. The harness verifies both the original image hash and the unchanged transcription hash before replaying it. Do not edit the transcript to match the reference. Replay makes only structure calls; account for the original transcription cost when comparing complete pipelines, without double-counting it as a new call.

```sh
node --test scripts/evaluation/capture-smoke.test.ts scripts/evaluation/photo-pipeline.test.ts
WRANGLER_LOG_PATH=/tmp/family-cookbook-t09-wrangler.log node scripts/evaluation/capture-smoke.ts --run test-results/t09-photos/two-stage-glm-manifest.json test-results/t09-photos/two-stage-glm-repeat.json
```

See [two-stage findings](../../../docs/evidence/t09-two-stage-photos.md). The output validator now rejects undeclared top-level fields and populated drafts with a `multiple_recipes` uncertainty prefix, including explanatory text. These checks were added after provider responses exposed gaps; they do not prove source fidelity. Keep historical raw assessments and current-validator reassessments distinct.

## Human audio collection

Use the [recording scenarios](recording-scenarios.md) for three short human recordings and one continuous five-minute narration. The Polish quoted text is authored evaluation material; human speech may be scripted, but must not be described as spontaneous or synthesized. Missing recordings, consent and human-checked actual references remain gaps until the files are received and evaluated. No T03 physical-device result is implied by recording on a laptop.

## Source-preserving crop comparison

`node scripts/evaluation/prepare-photo-crops.mjs` reads the seven existing consented normalized JPEGs and their private provenance manifest. It verifies original HEIC/JPEG hashes, decodes RGB pixels once, copies manually selected rectangular regions and writes lossless PNGs under ignored `test-results/t09-photos/crops/`. It also writes seven full-page PNG controls and verifies every decoded output pixel against its source region. No scaling, sharpening, masking, perspective correction or generative repair is performed. Inspect each crop before inference: a recipe includes its related sauce/topping, both columns and its final instruction. This is an assisted-region experiment, not automatic recipe detection.

The generated manifest uses `imagePipeline: "transcribe-only"`. This reuses the two-stage proof's exact transcription prompt and model settings, makes no structuring call and leaves factual acceptance pending (`assessment.pass: null`). Exit zero means calls completed, not that OCR is correct. References are unnecessary in this mode and are never supplied to the model. Empty/truncated transcripts still fail. Full and cropped images use the same PNG encoding so JPEG recompression cannot explain a difference.

```sh
node scripts/evaluation/prepare-photo-crops.mjs
WRANGLER_LOG_PATH=/tmp/family-cookbook-t09-crop-wrangler.log node scripts/evaluation/capture-smoke.ts --run test-results/t09-photos/crops/manifest.json test-results/t09-photos/crops/glm-results.json
```

Use a fresh output name for subsequent runs; retain all failures and compare only the text belonging to each crop against the corresponding full-page transcript. Excluding an unrelated recipe is a scope improvement, not proof that retained handwriting is more accurate. See [crop findings](../../../docs/evidence/t09-cropped-photos.md).

## Human audio intake without an approved reference

Two consented short recordings are evaluated in the [first human-audio report](../../../docs/evidence/t09-natural-audio.md). Private originals and the intake filename mapping stay ignored; public reports use neutral IDs because recorder filenames can contain locations. Record actual speaker/processing consent and verify full decoding before inference. Do not promote the written recording scenario or the model's own transcript to ground truth.

A fixture may omit `reference` while waiting for independent source review. `assessResponse` then checks schema and truncation, but leaves factual acceptance pending (`pass: null`) for otherwise valid output. An exit status of zero means processing completed, not that the source was transcribed accurately. Preserve raw results and record subsequent semantic review separately. Compare corrections in ingredients and active steps, ensure every cooking action is present, and flag corrupted units rather than assuming that a valid JSON string is a usable unit.
