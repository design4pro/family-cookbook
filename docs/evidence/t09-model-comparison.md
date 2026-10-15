# T09 alternative vision model comparison

Date: 2026-10-15. **No tested configuration meets the complete faithful-extraction criterion.** Kimi K2.6 and GLM 5.3 Flash correctly read the three human-confirmed fractions, but still introduced other factual errors. This follows the [Scout failure](t09-photos.md) on the same seven consented photographs. Natural recordings remain a T09 blocker. Physical iOS/Android devices remain a separate T03 blocker. Neither readiness gate is open.

## Method and access

The authenticated Workers AI catalog and each shortlisted model's input schema were checked before inference. The [catalog snapshot](t09-model-catalog.json) records model IDs, capabilities and prices. All selected entries were marked Cloudflare-hosted (`source=1`), including the paid-tier Kimi and GLM entries; actual inference access succeeded. Requests used the existing AI-only Wrangler proxy in the DESIGN4PRO account. No production application, storage or purchase configuration changed.

Every run uses the existing normalized JPEG bytes, checked by SHA-256 against the original photo evaluation. No cropping, enhancement, reference answers or human corrections were supplied to the models. Temperature is zero. The same extraction and unrelated-recipe instructions are used across candidates. Image detail, reasoning settings and token limits are recorded separately, because their APIs differ. `high` is a requested detail level, not proof that the backend encoded more pixels.

The initial screen uses photos 2730, 2731 and 2732, covering all human-confirmed fractions and the absent chilling duration. A known substantive failure eliminates a configuration; it need not spend inference on all remaining photos to establish failure. GLM receives all seven photos at both default and high detail; Kimi receives all seven with high detail and reasoning. This is an adaptive investigation on a fixed small corpus, not a held-out benchmark, an exhaustive catalog search or a general reliability claim.

Complete inputs, manifests and outputs remain private in ignored `test-results/t09-photos/`. The [sanitized comparison](t09-model-comparison.json) records parameters, source hashes, latency, metering and findings without full recipe transcriptions. Raw `assessment.pass` uses exact ingredient spelling/order and is not a semantic accuracy score. Findings below come from source comparison; four critical facts have developer confirmation, while the remaining references still need human review.

## Findings

| Configuration | Observed result |
| --- | --- |
| Gemma 4, default thinking, 4096 tokens | Empty final answers for 2730 and 2732 after exhausting the completion budget. 2731 retained the unknown chilling duration and substantially correct ingredients. Incomplete output cannot pass. |
| Gemma 4, thinking disabled, 4096 tokens | Correct 2.5 cups flour, but changed icing sugar to half a cup, corrupted yolks and misread topping margarine as 0.5 instead of 0.25. |
| Gemma 4, thinking enabled, high image detail, 8192 tokens | The larger budget still produced no final draft for 2730 and 2732. This does not establish a fraction reading; 2731 returned a substantially faithful draft. |
| Qwen 3.8, low reasoning, 4096 tokens | Correct flour fraction, but changed six yolks into six tablespoons of orange peel and read topping margarine as 0.5. |
| Mistral Small 3.1, 1800 tokens | Changed flour into milk, half packets into two packets, invented dough proportions and omitted the topping. |
| Moondream 3.1, query, reasoning enabled, 4096 tokens | Invented 60 degrees Celsius, corrupted ingredient text and failed the requested schema. One response exhausted the output budget. |
| Kimi K2.6, reasoning disabled, 4096 tokens | Read 2.5, 0.5 and 0.25 correctly and did not invent chilling time. However, 2731 introduced an unsupported two-package ingredient and lost source ingredients. |
| Kimi K2.6, high reasoning, high image detail, 8192 tokens | Correct fractions and all three multi-recipe recovery responses. Photo 2730 retained the source facts without observed additions, including the heaped-cup wording with null numeric sugar quantity. However, 2732 changed the topping instruction from mixing to boiling; 2731 and 2735 exhausted the budget without a final draft. |
| Kimi K2.6, bounded retry with 16384 tokens | Retried only the two truncated images. 2731 returned a substantially faithful draft with no invented chilling duration. 2735 instead invented two teaspoons of brandy, added butter and changed reduction by half to evaporation of the liquid. Larger output budgets recover availability, not necessarily accuracy. |
| GLM 5.3 Flash, low reasoning, 4096 tokens | Read the three confirmed fractions correctly and left chilling time unstated. An ingredient spelling remains uncertain; this alone is not the basis for rejection. The additional default-detail layout run selected one recipe from all three multi-recipe pages and changed flour to ginger on 2735, also turning the word meaning "from" into a numeric chicken quantity. |
| GLM 5.3 Flash, high image detail | Fractions remained correct, but 2732 invented a numeric orange-peel amount. On all three multi-recipe pages it selected one recipe despite the instruction to request a closer image. On 2735 it changed flour to ginger and damaged preparation instructions. |

Do not infer that any generic uncertainty warning makes a wrong numeric value safe. The GLM high-detail result simultaneously supplied a numeric value and claimed uncertainty. An unknown source quantity must stay null. Likewise, a selected or merged recipe does not satisfy the required multi-recipe recovery path.

The best candidate's complete coverage is therefore: 2729/2733/2734 correctly request a new source; 2730 has no observed added facts but retains a heaped-cup measure as text with null numeric quantity; 2731 becomes faithful only after the larger-budget retry; 2732 changes a cooking operation; 2735 adds an unsupported amount and changes a reduction instruction. Safe refusals are not successful recipe extractions. This is not a seven-photo pass.

## Harness and measurement limitations

The harness now accepts an allowlisted image-model override, supported image-detail/reasoning variants and model-specific response envelopes. The original Scout default remains unchanged. Moondream's initial binding result serialized as an empty object; those attempts have unknown metering and establish no image-quality result. Explicit non-streaming input and JSON-byte-stream decoding exposed its `result.answer` envelope. Preserved raw answers were reviewed even when the earlier extractor did not populate `draft`. No answer was repaired or rewritten before judging it.

Eleven regression tests and the focused TypeScript check pass. New checks cover JSON byte-stream decoding, the original answer in each response envelope, and rejection of a truncated completion even if its partial JSON happens to match the reference. Never interpret `{}` in a saved provider response as a verified empty model answer or zero usage without checking the transport. Private raw responses can contain provider reasoning; the sanitized report intentionally excludes it.

Returned usage is metering, not an invoice. Price equivalents use the checked catalog or reported neurons; unknown usage is excluded, not assumed zero. Timings are individual attempts, not p95 or production latency guarantees. Direct HEIC and maximum-size inputs were not revalidated for these candidates; this comparison uses the known decodable JPEG path.

This follow-up made **48 image attempts and one text-only endpoint diagnostic** across six additional model IDs. Forty-six attempts returned usage; three initial Moondream transport attempts have unknown usage. Total reported usage was **29,401.390187 neurons**, equivalent to **USD 0.32341529** at USD 0.011 per 1,000 neurons before shared free allocation and adjustments. This excludes earlier Scout and synthetic/audio runs. The per-call JSON retains all measured attempts, including truncations, integration failures and retries; no failed run was replaced by a successful repeat.

Kimi's high-reasoning recipe attempts took 165.796-217.770 seconds each; the three correct multi-recipe recovery responses took 21.615-33.725 seconds. Including the failed first attempt, the two larger-budget retries consumed 374.622 and 399.771 seconds of inference respectively, excluding local orchestration/waiting. The nine Kimi high-reasoning attempts reported 22,039.127563 neurons (USD 0.24243040 list-price equivalent). These measured tradeoffs rule out presenting a larger token budget as a free accuracy improvement.

## Decision

Kimi with high reasoning is the most promising continuation candidate for this corpus because it combines correct fractions with safe handling of all three multi-recipe pages. It is **not an approved faithful-draft variant**: changing a preparation operation is a material source error, and empty budget-exhausted answers are extraction failures. More reasoning also increases latency substantially. Correcting the fraction regression alone does not close photo feasibility.

Any eventual candidate must retain source media, require source-side human review, and route unreadable/multiple-recipe input to a closer image or manual entry. Do not repair systematic OCR errors with recipe-specific substitutions or values copied from the reference set. A separate transcription/structuring design would be a new experiment requiring the same source checks, not evidence already established here.

T09 still needs three natural spoken recipes, one natural five-minute recording, the remaining human reference review and passing photo evidence. Synthetic audio does not replace those recordings. T03 remains blocked on physical devices. C3 and dependent capture work remain open.
