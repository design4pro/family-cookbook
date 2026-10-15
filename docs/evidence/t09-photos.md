# T09 consented photograph follow-up

Date: 2026-10-15. **Result: FAIL for the evaluated Scout configuration.** Seven supplied recipe photographs were evaluated after the developer explicitly confirmed permission to process them in Cloudflare. This replaces the earlier missing-photo access blocker. It does not close T09: the image quality proof failed, natural recordings are still absent, and full human reference confirmation is pending. T03 physical-device acceptance and both readiness gates remain blocked/closed.

## Corpus and privacy

Sources: `tests/assets/IMG_2729.HEIC` through `IMG_2735.HEIC`. Three legible handwritten single-recipe pages (2730, 2731, 2732); four difficult layout/handwriting cases (2729, 2733, 2734, 2735). Three difficult pages contain unrelated recipes; their correct outcome is a closer-image/manual-entry request, not a merged recipe. A topping/sauce belonging to the same recipe is not a second unrelated recipe. The fourth difficult case has dense text and part of the adjacent page. All seven come from the same notebook/handwriting; this is not a broad handwriting benchmark or a noisy-photo cohort.

The agent read the images and saved provisional facts **before** Scout inference. Those are independent of the evaluated Scout output, but they are still agent-authored, not human ground truth. Full private references are in `test-results/t09-photos/reference-review.md` and `manifest.json`. On 2026-10-15 the developer explicitly confirmed: photo 2730 has 2 1/2 cups of flour; photo 2732 has 1/2 packet of vegetable butter and 1/4 packet of margarine in the topping; photo 2731 specifies no chilling duration. These facts now have human confirmation and establish the corresponding model errors. The confirmation does not approve all other reference facts or the complete corpus.

Private originals, normalized images, references and full model responses stay in ignored `tests/assets/` and `test-results/t09-photos/`. Consent to Cloudflare processing is not permission to publish those materials. The committed-ready [summary](t09-photo-summary.json) contains hashes, sizes, measurements and failure classifications, not full recipe transcriptions. Nothing was committed or pushed.

## Transport and measurements

Model: `@cf/meta/llama-4-scout-17b-16e-instruct`, through the existing T09 AI-only Wrangler proxy. Temperature 0, 1,800 maximum output tokens, JSON-object response mode. No other model or inference provider was called during this follow-up.

- Original HEIC files: 1,060,168-1,219,609 bytes, 4032x3024 storage dimensions with orientation metadata.
- Local copies: macOS `sips` JPEG conversion, then FFmpeg autorotation and metadata removal; 3024x4032 JPEG, 1,082,885-1,319,934 bytes. No crop, enhancement or invented content. Original files remain unchanged. These preprocessing tools are evaluation tooling, not a deployed production conversion service.
- `sips` inside the execution sandbox initially emitted invalid 3,544-byte JPEG files despite success status. Visual decoding caught this; conversion outside the restriction produced valid images. **Do not accept converter exit status as proof of a decodable image.** Orientation was visually checked after normalization.
- All seven normalized JPEGs were accepted. Direct HEIC submission of photo 2731 failed with `8006: Invalid data for image - reason unrecognized image format`. This establishes a failure for this model/input path; Cloudflare Images HEIC support is a different service and does not establish Workers AI support.
- Baseline seven JPEG jobs: 8.550-21.266 seconds. Revised four jobs: 8.065-19.142 seconds. These are individual job measurements, not p95 or maximum-size tests.
- Twelve inference attempts: eleven successful provider responses plus one rejected HEIC request. Baseline reported 593.178185 neurons; revised reported 355.930916; total reported usage **949.109100 neurons**, list-price equivalent **USD 0.01044020** before shared free allocation. The rejected call returned no usage; its usage is unknown, not proven zero. Actual invoice charge is unverified. See the per-call summary and [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/).

## Results against provisional visual references

Every successful baseline response was parseable and matched the structural schema. None passed substantive source comparison. These failures are not merely spelling/order differences from the exact automated comparator.

| Photo | Class | Baseline result | Concrete failure |
| --- | --- | --- | --- |
| 2729 | Difficult, two unrelated recipes | FAIL | Merged both recipes. Turned removal from heat into a two-hour wait; misread a half-kilogram quantity as one kilogram. |
| 2730 | Legible | FAIL | Read 2 1/2 cups as 2.33, omitted the separate egg, and changed roughly an hour in the freezer to 30 minutes. Baking time 45 minutes and missing temperature were preserved. |
| 2731 | Legible | FAIL | Invented a one-hour chilling step. Several ingredient/unit names were corrupted. Missing margarine amount remained null and 20-minute baking time was preserved. |
| 2732 | Legible | FAIL | Read both 1/2 pack and 1/4 pack as 4 packs, corrupted steps and omitted instruction-only ingredients. Approximate 35-minute bake appeared, with temperature null. |
| 2733 | Difficult, unrelated recipes/correction | FAIL | Merged drink and mint sauce, introduced a numeric mint amount where none was specified. |
| 2734 | Difficult, dense unrelated recipes | FAIL | Mixed patties and fish ingredients; attached the fish brine's 15 minutes to the combined output. |
| 2735 | Difficult, dense/adjacent fragment | FAIL | Invented 100 g oil, changed broth/sherry amounts and omitted or corrupted major instructions; did not reliably isolate the complete recipe from the adjacent page. |

Baseline class results: **legible 0/3 pass; difficult 0/4 pass**. No photograph states a numeric cooking temperature; leaving temperature null is correct here but does not prove recognition of handwritten temperatures. The fraction errors in photos 2730/2732 and invented chilling time in photo 2731 are supported by human-confirmed references. The other findings remain provisional; no human correction-time score was measured.

## Smallest revision and regression checks

The photo-specific instruction was tightened to forbid merging unrelated recipes, request empty draft fields plus `multiple_recipes`, distinguish a related topping, ignore adjacent-page fragments and mark uncertain fractions instead of guessing. Four targeted cases were rerun: 2729, 2732, 2733 and 2734. **0/4 passed.** All four returned the warning while retaining a populated draft. Photo 2732 was also incorrectly flagged as multiple unrelated recipes even though the topping belongs to its cake; its incorrect fractions persisted.

The evaluation validator now rejects a `multiple_recipes` warning combined with populated ingredients/steps/time/temperature and requires the explicit warning for the known multi-recipe references. Two tests first failed, then passed after these checks were added. All eight harness tests and the focused TypeScript check pass. Earlier synthetic/audio tests remain unchanged. No application API/native code was modified.

The validator cannot detect every wrong fact without references. A stricter prompt or a generic uncertainty warning is not a reliable quality boundary. When implementing the product, a multi-recipe warning must route to a closer-image/manual-entry action and never expose a merged draft as a successful extraction. Preserve the original source. Even apparently clean drafts require human review.

## Alternative-model follow-up

A subsequent [six-model comparison](t09-model-comparison.md) evaluates the same JPEG corpus with additional Cloudflare-hosted models and reasoning/detail variants. The Scout findings above remain historical evidence, not a score for the other models.

## Decision and remaining work

Do not approve this model/configuration for T16 photo processing. Keep T09 and C3 open and their dependent work blocked. The useful next technical investigation is a different Cloudflare-hosted vision configuration/model or a staged extraction design, measured on this same fixed corpus. Do not silently switch to an external provider or weaken the no-invented-facts/no-merged-recipes contract. A successful future run must still receive human reference review.

Three natural spoken recipes and one natural five-minute recording remain missing. Synthetic TTS does not fill that gap. Physical iOS/Android trials remain solely the existing T03 blocker; these phone-originated files do not prove the app's native capture/persistence behavior.
