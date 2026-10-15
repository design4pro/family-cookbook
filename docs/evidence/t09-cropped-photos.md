# T09 source-preserving recipe crops

Date: 2026-10-15. **Cropping improves selected words/units but also introduces factual errors; no consistently faithful GLM variant is established.** This experiment compares literal transcription of the same seven consented photographs with ten manually selected single-recipe crops. Natural recordings remain a T09 blocker; physical iOS/Android evidence remains a separate T03 blocker. Neither readiness gate is opened.

## Method and integrity

The original HEIC files and existing normalized JPEGs are unchanged and checked against their prior SHA-256 values. The preparation script decodes each JPEG to RGB24 once, copies exact rectangular pixel rows and encodes lossless PNG. Each output is decoded and compared byte for byte against the selected source pixels. Seven full-page PNG controls undergo the same conversion. All 17 pixel comparisons pass. No scaling, sharpening, contrast adjustment, perspective correction, masking, text repair or generative image editing is used.

Ten crops cover all main-page recipes: two each on 2729, 2733 and 2734, and one each on 2730, 2731, 2732 and 2735. Related topping/sauce sections remain with their recipe; the two columns on 2731 and final instructions are retained. Every crop was visually inspected before inference. Regions were selected manually from the photographs, not by an automatic detector. Their coordinates, hashes and dimensions are recorded in the sanitized measurements. This does not prove automatic recipe selection or recover text outside the original frame.

The model is `@cf/zai-org/glm-5.3-flash`, with `imageDetail: high`, `reasoning_effort: low`, temperature zero and 4096 completion tokens. It completed all seven transcriptions in the previous two-stage comparison, making it a useful controlled baseline. The exact previous transcription system/user prompts are reused, without recipe-specific hints, reference values or intermediate corrections. Only the image differs within each pair. Both arms use PNG, so lossy crop recompression is not a confound. Model-side preprocessing remains opaque; cropping changes layout and effective attention as well as context.

The initial run submits a full page followed by its crop(s). A follow-up repeats three pairs with crop first: the 2729 drink fraction regression, the 2730 bag-word improvement and the previously difficult dense 2735 recipe. All responses are retained. These targeted repeats are not an independent held-out evaluation or a statistical reliability estimate. No structuring calls or product model changes are part of this experiment.

The existing AI-only Wrangler proxy uses the developer's Cloudflare account and previously approved photo consent. PNG data URI inputs succeeded in actual calls; this is observed support for these fixtures, not a general size limit. Original photos, PNGs, complete transcripts and provider responses remain in ignored local directories. No private recipe transcription is added to Git.

## Reproduction

Run from the repository root with the existing consented private corpus and authenticated Wrangler environment:

```sh
node scripts/evaluation/prepare-photo-crops.mjs
WRANGLER_LOG_PATH=/tmp/family-cookbook-t09-crop-wrangler.log node scripts/evaluation/capture-smoke.ts --run test-results/t09-photos/crops/manifest.json test-results/t09-photos/crops/glm-results.json
```

Use a new output filename for a repeat. The preparation script writes source-preserving fixtures; the harness's `transcribe-only` mode makes one model call per image and records factual acceptance as pending, not passed. Empty or truncated output fails. A successful process exit confirms call completion only. Source comparisons below remain necessary.

## Initial paired findings

Compare the same retained recipe text in each pair. Transcribing another recipe on a full page is expected at this stage; it is not itself a transcription error. Excluding that other recipe is a scope change, not an OCR accuracy score.

| Source / crop | Full-page control | Single-recipe crop | Observation |
| --- | --- | --- | --- |
| 2729 / 1 | Removal from heat becomes a two-hour-like phrase. | The hour word disappears, but the letter remains a false digit; other word errors remain. | Partial improvement, still inaccurate. |
| 2729 / 2 | Spirit fraction is correctly one quarter. | Fraction becomes one half. | Numeric regression. |
| 2730 / 1 | Confirmed 2.5 cups and half packets are correct; the bag word is corrupted. | Fractions remain correct and the bag word improves; pudding is misspelled and an abbreviation is expanded. | Mixed; not a fully literal transcript. |
| 2731 / 1 | No chilling duration is added; flavoring has no invented quantity; teaspoon spelling is corrupted. | Chilling remains unspecified and teaspoon improves, but flavoring becomes a digit-bearing phrase. | Mixed, with a new quantity-like corruption. Both retain an incorrect dried-fruit/nuts spelling. |
| 2732 / 1 | Both confirmed fractions, mixing and orange-peel wording are retained. | Fractions and mixing remain correct, but orange peel is corrupted and a letter becomes the number two. | Regression despite correct critical fractions. The topping remains in scope. |
| 2733 / 1 | Vodka is incorrectly one half instead of one quarter; coconut liqueur remains liqueur with no invented volume unit. | Vodka is still wrong; liqueur becomes coconut milk, a litre unit is added and the crossed-out text disappears. | Additional ingredient/unit errors. |
| 2733 / 2 | Mint-sauce quantities and absent method are retained. | The same facts are retained, including half a teaspoon of chili; no preparation method is invented. | No material factual improvement observed. |
| 2734 / 1 | The related sauce's wine measure is misread as a teaspoon. | It is correctly read as a small glass/shot; the sauce remains with the patties. | Material unit improvement. |
| 2734 / 2 | Three quarters of a litre and 15 minutes are retained. | Both remain; the source's unusual diminutive spoon word is normalized to tablespoon wording. | No demonstrated numeric improvement; literal unit wording is less faithful. |
| 2735 / 1 | Flour becomes ginger in ingredients; letters become chicken quantities, but the coating instruction still says flour. | Ingredient and false-number errors remain; the coating instruction also changes to ginger. | Word recognition improves in places, but factual corruption spreads into the method. |

The previously human-confirmed checks are satisfied in both initial arms: flour 2.5 cups in 2730, butter 0.5 packet and topping margarine 0.25 packet in 2732, and no chilling duration in 2731. They therefore do not establish a crop benefit. All other detailed source comparisons are agent visual readings pending full human confirmation. The ambiguous final serving phrase in 2735 is excluded from the judgment. No character/word error rate or whole-recipe pass rate is claimed without a complete adjudicated transcript.

## Repeats and decision

- **2729 drink:** both full-page attempts retain one quarter; both crop attempts produce one half. The numeric regression repeats.
- **2730:** the crop's improved bag word fails to repeat and becomes a word for a small roll. The flour fraction remains correct. The full-page repeat also changes unspecified flavoring into a pinch-like phrase. Temperature zero did not make the transcript stable.
- **2735:** the repeated crop recovers flour in both the ingredient list and coating instruction, but changes the broth unit and retains false numeric chicken wording. Both full-page attempts retain the false ginger ingredient. Neither arm yields a faithful transcript.

**Decision: cropping is useful for selecting one complete recipe, but this GLM configuration does not demonstrate consistently better or trustworthy transcription.** It improves selected words/units and removes adjacent content, while introducing or retaining unsupported fractions, ingredients and number-like text. Even the apparent bag-word improvement is unstable. This conclusion is limited to these regions, this model, prompt and corpus; it is not a claim that cropping can never help another model or a new photograph.

Keep crop selection as a possible source-preparation aid requiring a completeness check, and keep source review/manual correction mandatory. Do not promote the crop pipeline as a passing T09 photo variant, automatically save its output, repair it from the expected answers, or count the cropped source selection as an automatic detector. Full human reference review and natural audio remain outstanding. T03's physical-device blocker and both closed readiness gates are unchanged.

## Measurements and verification

[Sanitized measurements](t09-cropped-photos.json) preserve all 23 calls, source/transcript hashes, ROI coordinates, model parameters, metering and repeat classifications. Private raw evidence is under `test-results/t09-photos/crops/`. All 23 calls completed with nonempty, nontruncated text; completion is not factual acceptance. PNG files range from 3,155,482 to 13,088,303 bytes.

| Group | Calls | Returned neurons | Median call seconds | Observed range, seconds |
| --- | ---: | ---: | ---: | ---: |
| Initial full-page controls | 7 | 581.160889 | 11.164 | 7.908-54.040 |
| Initial single-recipe crops | 10 | 732.017250 | 11.055 | 4.317-46.885 |
| Three paired repeats | 6 | 474.386349 | 11.150 | 7.529-65.694 |
| Total | 23 | 1,787.564487 | 11.164 | 4.317-65.694 |

These are individual AI proxy calls including transfer, not queue latency, device measurements, p95 or full capture-to-review timings. Actual invoice charge remains unverified. The ten crops cover the same main-page recipes as seven full pages, but require more calls and more total returned neurons in the initial run. Cropping did not establish an aggregate cost or latency improvement. Some repeat calls report cached prompt tokens; timings are not a benchmark under controlled service load.

Seventeen focused harness tests pass, as do the affected TypeScript check and crop-script syntax check. All seven original HEIC and seven normalized JPEG hashes are verified; all 17 PNGs pass exact RGB equality, and all 23 submitted-image hashes match their manifests. The transcription-only test verifies a single call with the unchanged prompt and image. Existing tests continue to reject empty/truncated transcripts and verify the exact two-stage boundary. `git diff --check` passes. Originals, derived images, manifests and transcripts remain ignored by Git.

Process lesson: preserve pixels and compare matching source scope; report improvements, regressions and failed repeats together. A clearer-looking crop or successful JSON/text response is not evidence of factual fidelity. The reproduction guide records these constraints for subsequent evaluations.
