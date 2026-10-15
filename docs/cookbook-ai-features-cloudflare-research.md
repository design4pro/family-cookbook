# AI features for a private family cookbook

Research date: 2026-10-15. Stack: Expo for mobile/web, Cloudflare for backend and hosted inference. This report uses primary documentation and first-party product pages. Prices are USD list prices. No model-quality, handwriting, latency, production-billing or ChatGPT account-eligibility test was performed. Product priorities and workload assumptions are recommendations, not measured market demand.

## Recommendation

Ship three connected capabilities: turn a recording or photograph into a reviewed recipe; answer questions using the household's saved recipes; suggest meals from those recipes and explicitly declared ingredients. Preserve the original source and distinguish family knowledge from AI suggestions. Add device speech playback for cooking. Defer continuous voice conversation and public ChatGPT distribution until users demonstrate demand.

The strongest product promise is: **Capture how your family cooks, then make those recipes useful every week.** Cheap inference makes this feasible but does not prove willingness to pay. Test payment for the combined family library and recurring cooking workflow, not for a generic chatbot alone.

## What is currently visible in the market

CookBook already offers cooking questions, substitutions, meal ideas and recipe-specific help through [Ask CookBook](https://help.cookbookmanager.com/en/article/what-can-i-do-with-ask-cookbook-vrgfu0/). Its [Cooking Mode](https://cookbookmanager.com/features/cooking-mode) includes spoken instructions and supported voice controls. These establish competitive availability, not feature adoption or a growth rate.

Cloudflare introduced experimental `@cloudflare/voice` tooling in April 2026, including conversation and dictation modes. This supports the direction toward voice interfaces, but an experimental developer release is not evidence of consumer willingness to pay. [Cloudflare announcement](https://blog.cloudflare.com/voice-agents/)

For this product, rank opportunities by user benefit and implementation cost:

| Priority | Feature | Concrete outcome | Main uncertainty |
| --- | --- | --- | --- |
| 1 | Dictated recipe to editable draft | A parent explains a recipe without typing | Corrections, quantities, kitchen noise |
| 1 | Photograph to editable draft | An inherited notebook becomes searchable while the original remains available | Handwriting accuracy and image token usage |
| 1 | Questions grounded in saved recipes | Find a family recipe and answer questions with a source link | Retrieval quality and unsupported claims |
| 2 | Meal suggestions from saved recipes and available ingredients | Select three dinners and produce a draft shopping list | Ingredient normalization and stale pantry information |
| 2 | Spoken cooking steps | Hear the next instruction while cooking | Device voices, language and permissions |
| 3 | ChatGPT integration | Access an existing cookbook from ChatGPT | Review, authentication, demand and distribution restrictions |
| Later | Continuous voice assistant | Interruptible, hands-free conversation | Turn-taking, mobile integration and speech-output costs |

## Minimal feature behavior

### Dictation and photographed recipes

Use one draft-and-review workflow for audio, images and pasted text. Keep source material separate from the structured recipe. Extract title, servings, ingredients, quantities, steps and unresolved questions. A phrase such as “two, actually three tablespoons” must resolve to the corrected amount or be flagged for review. “Bake until ready” must not silently become an invented temperature and duration.

Recorded audio goes through Whisper, then a text model structures the transcript. A vision model handles photographs. Validate the output schema, but remember that valid JSON does not establish factual accuracy. Let the user compare the draft with the recording or image before saving.

For Polish, upstream Whisper lists `pl` and Cloudflare exposes a language parameter. Actual recognition of family vocabulary, measures and spontaneous corrections still requires testing. [Whisper model](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/), [upstream languages](https://github.com/openai/whisper/blob/main/whisper/tokenizer.py)

No unambiguous maximum recording duration was established from the reviewed Cloudflare documentation. Cloudflare provides a [chunking tutorial](https://developers.cloudflare.com/workers-ai/guides/tutorials/build-a-workers-ai-whisper-with-chunking/). Production chunks must be independently decodable; do not blindly split compressed audio bytes.

### Conversation with the cookbook

Start with bounded questions such as “Which of our soups use lentils?” or “How much flour does Mum's recipe use?” Retrieve authorized recipes, pass a small selection to the model, and link answers to those recipes. Say when the book does not contain the answer. Label substitutions and other model-generated advice separately from the original recipe.

Use normal database search first; add semantic retrieval only if real queries reveal a gap. The backend, not the model, authorizes household access. Calculate serving multipliers and shopping-list totals in deterministic code. Ask for confirmation before persisting edits or adding a generated plan. Treat imported recipe content as data, not executable assistant instructions.

### Voice during cooking

Start with record-and-send input and device speech playback. Expo's [Speech API](https://docs.expo.dev/versions/latest/sdk/speech/) exposes available voices and language options; this avoids Cloudflare TTS inference charges, although quality and offline availability depend on the device, engine and browser.

Cloudflare's experimental voice package supplies `withVoice`, `withVoiceInput`, web hooks and a generic client. Its React web hooks are not evidence of a ready-made native Expo integration. Continuous conversation additionally needs interruption handling, playback cancellation, reconnection and language validation. [Voice announcement](https://blog.cloudflare.com/voice-agents/)

## Hosted models and current prices

These are candidate models, not a quality ranking. All listed model endpoints are Cloudflare-hosted; a Partner label does not automatically mean external hosting.

| Task | Model | Published inference price |
| --- | --- | --- |
| Recorded speech | [`@cf/openai/whisper-large-v3-turbo`](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) | $0.000513 per audio minute |
| Extraction and grounded answers | [`@cf/qwen/qwen3-30b-a3b-fp8`](https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/) | $0.0509/M input tokens; $0.335/M output tokens |
| Photographed recipes | [`@cf/meta/llama-4-scout-17b-16e-instruct`](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/) | $0.27/M input tokens; $0.85/M output tokens |
| Optional semantic retrieval | [`@cf/baai/bge-m3`](https://developers.cloudflare.com/workers-ai/models/bge-m3/) | $0.012/M input tokens; vector storage/query fees are additional |
| Alternative transcription | [`@cf/deepgram/nova-3`](https://developers.cloudflare.com/workers-ai/models/nova-3/) | HTTP $0.0052/min; WebSocket $0.0092/min |
| Natural English speech | [`@cf/deepgram/aura-2-en`](https://developers.cloudflare.com/workers-ai/models/aura-2-en/) | $0.03/1,000 input characters |

Nova-3 lists Polish upstream, but Cloudflare cautions that language support depends on model and endpoint. Test the deployed endpoint before promising support. [Deepgram language matrix](https://developers.deepgram.com/docs/models-languages-overview/)

Cloudflare also offers inexpensive [MeloTTS](https://developers.cloudflare.com/workers-ai/models/melotts/) at $0.000205 per generated minute, but its [upstream language list](https://github.com/myshell-ai/MeloTTS) does not include Polish. Aura's documented English and Spanish endpoints are not a Polish TTS solution either.

### Illustrative cost for 1,000 active households

Assume each household uses 20 minutes of dictation, 100 text answers, and 10 scan extractions per month. Each answer budgets 2,000 input and 300 total billable output tokens. Each scan budgets 2,000 billable input tokens, including the image, and 800 output tokens. Four five-minute recordings per household each require a separate structuring call with 2,000 input and 800 output tokens.

| Item | Monthly usage across households | Inference cost |
| --- | --- | ---: |
| Whisper transcription | 20,000 audio minutes | $10.26 |
| Qwen answers | 200M input + 30M output tokens | $20.23 |
| Scout scan extraction | 20M input + 8M output tokens | $12.20 |
| Qwen transcript structuring | 8M input + 3.2M output tokens | $1.48 |
| **Total** | **Specified calls only** | **$44.17** |

The scan assumption has not been measured against actual image tokenization. All context, system instructions and reasoning tokens must fit the stated budgets; longer context, reasoning, retries and fallback models increase costs. Excludes Workers, D1, R2, queues, authentication, payments, support, taxes and other operational costs. This is not a total application budget.

For comparison, speaking all 100 monthly answers per household with Aura at 900 characters each adds $2,700 across 1,000 households. This is a particular model and workload, not a claim that all cloud speech is expensive. Device speech synthesis is the simpler initial choice.

The free allocation is 10,000 neurons per day **per Cloudflare account**, not per household. Estimates above intentionally exclude it. Token/minute and neuron prices describe the same inference, not two additive charges. [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)

## ChatGPT integration: useful, but separate from in-app chat

The [Apps SDK entry point](https://developers.openai.com/apps-sdk/) currently redirects to Plugins. Current guidance uses MCP Apps for optional embedded web UI, while compatibility aliases remain available. This does not mean existing Apps SDK integrations all stopped working. [OpenAI UI guide](https://developers.openai.com/plugins/build/chatgpt-ui)

| Route | What the user experiences | Architectural implication |
| --- | --- | --- |
| Chat inside Expo/web | Our own cookbook assistant | Our backend calls Workers AI and pays inference costs |
| Cookbook inside ChatGPT | ChatGPT searches the connected cookbook and displays recipes | Host MCP tools on Workers; ordinary database tools need no additional LLM call |
| Sign in with ChatGPT plan usage | Eligible users authorize qualifying app requests against their plan | A separate restricted program; do not assume commercial eligibility |

Cloudflare documents [hosting ChatGPT integrations](https://developers.cloudflare.com/workers/demos/chatgpt-app/). Its current [remote MCP guide](https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/) recommends stateless `createMcpHandler`; `McpAgent` is deprecated. A cookbook search tool does not inherently need Durable Objects.

Proposed initial tools are `search_recipes`, `get_recipe`, `find_recipes_by_ingredients` and `draft_shopping_list`. Reuse the same authorization and recipe logic as the app. A custom card is a separate HTML/web surface, not a native Expo screen. Private access needs OAuth and authorization checks on every request. [OpenAI authentication](https://developers.openai.com/plugins/build/auth)

Current plugin rules allow existing paid-account access but prohibit digital-subscription sales and upsells through the integration. Public distribution also involves publisher verification and review. Treat ChatGPT as an additional access channel, not the initial subscription checkout funnel. [Plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines), [submission](https://developers.openai.com/plugins/deploy/submission)

No guaranteed free or unlimited inference allowance was established. A tool that reads D1 need not call a paid model API itself, but hosting costs and ChatGPT availability still apply. Recipe excerpts passed to ChatGPT are processed outside Cloudflare, which must be reflected in the product's privacy explanation.

Sign in with ChatGPT plan usage has limited commercial availability. A remotely hosted paid application cannot assume eligibility through the open-source route. Its preview also excludes audio and transcription, so it is not a basis for free dictation. [Quickstart](https://developers.openai.com/siwc/quickstart), [OSS route](https://developers.openai.com/siwc/token-sharing-open-source), [preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)

Do not promise that the integration works in every mobile ChatGPT voice session without testing the actual supported environment. Host voice, embedded UI microphone access and Expo speech recognition are separate capabilities. [ChatGPT Voice](https://learn.chatgpt.com/docs/features/voice)

## Minimal architecture and validation

Proposed design: Expo records audio or captures an image; Workers receives authenticated requests; private R2 stores source assets; D1 stores reviewed recipes, ingredient data and household membership; Workers AI produces drafts and answers. Add Queues for asynchronous imports when needed. Use the same domain functions behind HTTP routes and later MCP tools. Do not introduce a separate agent framework, vector database or real-time speech stack before a demonstrated requirement.

Before selecting models permanently, evaluate 30-50 consented examples across Polish and English, including noisy dictation, spoken corrections, handwritten quantities and incomplete instructions. Measure quantity/unit errors, unsupported additions, time needed to correct a draft, response latency and actual billed tokens. Test cross-household access independently of model quality.

For grounded chat, use a small set of known-answer and missing-answer questions. Require correct recipe attribution and explicit abstention when the book lacks the requested fact. For ingredient planning, verify quantity arithmetic in code and let users review the resulting list.

For commercial validation, test whether households pay after capturing several real recipes and whether they return to cook or plan meals. A technically impressive transcription demo does not establish subscription retention. Keep original recipes readable and exportable even when paid AI features are unavailable; price ongoing convenience and collaboration rather than access to family memories.
