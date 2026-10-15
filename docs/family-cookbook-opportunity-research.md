# Private family cookbook: opportunity, evidence and MVP

Research date: 2026-10-15. Decision memo for an Expo iOS/Android/web product with a Cloudflare backend. Prepared from current vendor documentation and original user reviews/discussions. No apps were installed, no OCR benchmark was run, no customers were interviewed, and no payment experiment was conducted.

## Decision

Proceed to a small paid validation, not an unrestricted build. A private family cookbook is a more focused product hypothesis than a generic AI meal planner, but the combination already exists. Recipes We Share closely matches preservation plus planning, and Minsuri advertises matching a family's own recipes to available ingredients. The appendices document the competitive evidence. Neither vendor's existence establishes commercial success.

Proposed promise: preserve the original family recipe, resolve what is unclear with the people who know it, and make it easy to cook again using today's ingredients. This is a proposed standard of execution, not an assertion of a unique feature or an underserved market.

The initial customer hypothesis is the adult who organizes a family's scattered recipes and also cooks from them. That person can pay for the shared book; an older relative does not need to operate the app to contribute an explanation. Test two distinct jobs:

1. Preservation: turn deteriorating notebooks/cards into a portable, readable family archive. This may justify a one-time purchase and then little ongoing usage.
2. Weekly use: find familiar dishes, plan several dinners and coordinate shopping. This may justify a subscription if repeated use is observed.

A collection consisting mostly of holiday cakes may have strong emotional value but poor weekly-planning fit. Do not force the second job onto the first audience.

## Evidence strength and concrete gaps

The qualitative sample contains 12 observations across five named apps and household workflows, plus supporting discussions. It is purposive, mostly English-language, and not representative. Historic complaints illustrate failure modes rather than the current prevalence of defects. Vendor feature claims are not hands-on quality measurements. Full sources and dates appear in the appendices.

| Finding | Confidence and boundary | Product decision |
| --- | --- | --- |
| Some people value digitizing family handwriting and explicitly report paying for it | Direct user testimony, including older reviews; no market size or conversion estimate | Measure time to a correctly captured family recipe |
| Transcription errors and omitted cooking steps can make a saved recipe unusable | First-person reports; no model accuracy estimate | Preserve source, require human review, ask for missing information |
| Shared credentials and platform purchases can cause family friction | Product-specific documentation and reviews, not a universal competitor weakness | One household plan, separate accounts, browser access |
| Export may not produce a self-contained archive | CookBook explicitly warns that exports can reference hosted images; not all competitors have this issue | ZIP with actual source assets plus structured data and readable HTML |
| Exact pantry maintenance can become more work than planning | Anecdotal original discussion; no abandonment rate | Short-lived list of ingredients to use, not an inventory database |
| Subscription preferences are mixed | Both paying advocates and one-time-purchase preferences appear | Test actual offers; do not infer payment from positive feedback |

Two concrete comparison targets: CookBook documents no linked family profiles and advises sharing a login; it also warns about externally hosted image references in exports. These are specific limitations, not proof that our entire product will outperform it. [Family sharing](https://help.cookbookmanager.com/en/category/sharing-printing-exporting-4puto5/), [export/access terms](https://cookbookmanager.com/pricing).

## Differentiation to test

The main screen should show the family's recipes and their origins, with planning one step away. AI should be a tool inside capture and planning, not the identity of the product.

Use three clearly separated records: the untouched source image, the human-approved recipe, and any optional cooking adaptation. A relative's correction must not erase the original. Preserve phrases such as "one glass" until somebody specifies its size. Do not invent baking time, temperature, ingredient quantities, or authorship.

A useful quality test is whether a family can photograph a real page, resolve two ambiguous details, cook the dish successfully, and later reopen all material without the service. Several competitors already preserve originals and review extraction; beat their observed task completion, not an imagined lack of those features.

For a first pilot, choose one language and measurement context. Polish-speaking families and metric measurements are a reasonable bounded test if ten such families can be recruited. This is a feasibility choice, not evidence that Poland is less competitive or more profitable. CookBook already supports Polish. The English-language evidence collected here does not establish Polish OCR accuracy or willingness to pay. Recruit actual families before committing to a country launch.

## Smallest paid MVP

Build one complete flow: capture -> verify -> save -> choose three meals -> confirm missing ingredients -> shop -> cook.

| Capability | Included | Deliberately deferred |
| --- | --- | --- |
| Capture | Photograph/upload one recipe with multiple source images; paste/type text; preserve source and cook attribution | Bulk notebook scanning, video/social import, audio recording and transcription |
| Verification | Editable extracted ingredients/steps alongside the original, unresolved fields, simple clarification notes and explicit approval | Autonomous reconstruction, certainty percentages generated by the model, recipe lineage graph |
| Private cookbook | One shared household book, separate invited accounts, owner/member permissions, search, tags, cooking view | Public feeds, discovery community, multiple overlapping family organizations |
| Plan from today's food | Enter a few ingredients to use; rank approved own recipes; select up to three dinners and servings | Full stock accounting, expiry tracking, barcode/receipt/fridge recognition, nutrition optimization |
| Shopping | Merge compatible ingredient quantities, show recipe provenance, manually confirm stock, share and check items | Supermarket integration, real-time price comparison, automatic stock deductions |
| Exit and continuity | Download ZIP containing actual originals, JSON and standalone readable HTML; print through browser; mobile downloaded recipes readable offline | Designed gift-book production, print fulfillment, full offline collaborative editing |

Six product areas suffice: cookbook; capture/review; recipe/cook view; three-meal plan; shopping list; household/export. Search and invitations are small flows within these areas.

One short narrative note per recipe is enough initially. Voice can be valuable for oral traditions, but recording, transcription, consent, large uploads and playback add a second capture workflow. Test whether users prefer it before including it in the first paid release.

### The ingredient-based planner

The input is "use mushrooms and cream today", not an assertion that the entire kitchen inventory is known. Rank saved, approved recipes by confirmed ingredient overlap; show missing ingredients explicitly. If quantities are unknown, ask the user to check them. If the cookbook contains no suitable recipe, say so and offer manual selection or adding a recipe. Do not invent a family recipe to fill the gap.

Start with deterministic matching and arithmetic. AI can propose ingredient aliases and explain suggestions, subject to validation. Quantities, unit conversions and list aggregation are ordinary tested code. Do not combine grams with milliliters without an explicit ingredient-specific conversion, or collapse materially different ingredients. Missing quantities remain missing; they are not zero. Presence of an ingredient does not imply sufficient stock.

This is enough AI value for an MVP: extracting a page into a reviewable draft. A generative planner is optional until it beats simple ranking in user tests.

## Payment hypothesis and distribution

Do not build several billing tiers before validation. Compare two concrete offers:

- Preservation pack: EUR 19 once for automated processing of up to 100 source pages and a complete downloadable archive, with corrections performed by the customer. This is not unlimited human transcription, lifetime cloud hosting or unlimited future AI.
- Family service: EUR 39/year for five family members, up to 500 recipes, 1 GB of original assets, 100 AI page imports/year, shared planning and shopping. These are proposed test limits, not final commercial commitments. Additional scanning can be a later prepaid add-on.

A small free trial can allow ten recipes and five scans without a card. The price is for a household across web/iOS/Android, not each device. Separate one-time intent from recurring intent in the results. If buyers mainly want preservation and stop using the planner, choose the archive business instead of disguising it as a subscription.

Cancellation policy must be explicit before charging: preserve downloaded material, allow full export independently of paid status, and do not use existing recipes as leverage to force renewal. Cloud retention still needs a disclosed period; do not promise indefinite free hosting. Loss of paid functionality must not corrupt a local archive.

Illustrative arithmetic: 300 families at EUR 39/year generate EUR 11,700 annual revenue, equivalent to EUR 975/month before taxes, payment/store fees, acquisition, refunds, support and infrastructure. This is not a forecast. Ten one-time preservation sales are not evidence of subscription retention.

First acquisition tests: a hands-on digitization session for families who already have paper recipes; a before/after demonstration using the creator's own or consented material; relevant cooking communities where research participation is permitted. An invite from one family member to another is product activation, not proof of new paying-customer acquisition. Start with families preserving everyday meals as well as special-occasion recipes. Do not spend on broad paid acquisition until retention and contribution margin are measured.

## Expo and Cloudflare implementation proposal

This is a design recommendation, not code, a finished system or a performance benchmark.

- Expo Router provides shared navigation/components for iOS, Android and web. Use mobile for capture/cooking and responsive web for comparing a scan with an editable recipe. [Expo Router](https://docs.expo.dev/router/introduction/).
- One Worker API serves authentication integration, household authorization, recipes, planning, shopping and export. D1 stores household membership, approved recipe data, source metadata and shopping items. R2 stores private originals and generated export files. [Workers bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/), [D1](https://developers.cloudflare.com/d1/), [R2](https://developers.cloudflare.com/r2/).
- Queue extraction/export jobs so a slow model does not hold the capture screen open. Persist an import job and idempotency key; retries must not charge the allowance twice or duplicate a recipe. Skip Durable Objects, Vectorize, CRDTs and an agent framework in this scope. [Queues](https://developers.cloudflare.com/queues/).
- Use a Cloudflare-hosted vision model behind Workers AI for an initial extraction benchmark. Llama 4 Scout is documented as multimodal with image input. This proves interface availability, not acceptable handwriting recognition. If available Cloudflare models fail the benchmark, preserve manual editing and reconsider the model requirement instead of promising reliable OCR. [Model documentation](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/).
- Native downloaded recipes can use expo-sqlite and device files. Expo documents persistence across app restarts; web support requires special setup and is marked alpha in the inspected docs. Keep web online in the first release and provide standalone export for offline reading. Local storage is not automatic synchronization. Use server revision checks to prevent silent overwrites. [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/).
- Use reviewed authentication integration and separate household permissions. Every recipe and object request checks membership; guessing an object key must not grant access. Configure private storage and avoid logging source images or full recipes. "Private" means access-controlled; do not claim end-to-end encryption while doing server-side AI processing. Cloudflare says it does not use Workers AI Customer Content for model training or service improvement without explicit consent. [Workers AI data policy](https://developers.cloudflare.com/workers-ai/platform/data-usage/).
- Payments and native store entitlements remain external integrations. Server-side verified entitlements must apply to every family device; Cloudflare is not a payment processor. [Expo in-app purchase guidance](https://docs.expo.dev/guides/in-app-purchases/).

Storage illustration: 1,000 families x 100 images x 2 MB/image is approximately 200 GB. R2 Standard storage at USD 0.015/GB-month, less the 10 GB free allowance, is approximately USD 2.85/month for those stored originals alone. This excludes derivatives, export copies, requests, backups, database, AI and other services. It is not a total operating-cost estimate. Image-token use, retries and human support must be measured; low storage cost does not prove a viable business. [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

## Verification and go/no-go gates

These thresholds are proposed internal decision rules, not published industry benchmarks.

1. **Problem and buying test:** recruit ten families with actual inherited recipes. Ask each to bring five pages and describe how they last cooked from them. Offer the clearly scoped paid options. Continue only if at least three pay; record which job and price they buy.
2. **Capture quality:** assemble 100 consented pages with human reference transcriptions, including difficult handwriting, fractions, multi-page recipes and missing steps. Compare the proposed flow with two available competitors. Aim for median correction time under two minutes per page. Review every quantity, unit, temperature and ingredient in the pilot; measure error rate before and after review and report sample size. A clean sample is not a general guarantee.
3. **Repeated use:** run a six-week pilot with ten families. For the subscription thesis, aim for at least five households cooking/planning from the book in at least three of weeks 3-6, and at least three purchasing a further paid service period. Annual auto-renew is not a meaningful six-week retention test.
4. **Technical acceptance:** originals remain unchanged; duplicate jobs do not duplicate charges; nonmembers cannot read recipes/images; shopping calculations preserve units and uncertainty; exported HTML works with networking disabled and contains all originals; native downloaded recipes remain readable offline. Unit/integration tests cover these rules, Playwright covers web journeys, and native device tests cover camera and local persistence.
5. **Accessibility:** verify web keyboard navigation, screen-reader labels, large text, adequate contrast and touch targets, readable cooking mode, and non-color-only indicators. Treat WCAG 2.2 AA as the web target; neither Expo nor a component library automatically supplies compliance.

Stop or reshape the product if digitization is attractive but cooking usage does not repeat, people prefer existing free archives, correction is slower than typing, or the tested competitors already complete the workflow just as well. The defensible next investment is learning from real family materials and purchases.

## Evidence appendices

The following two evidence registers contain detailed dated sources. They intentionally separate vendor claims, direct user testimony and research inference.


## Private family cookbook: competitor evidence

Research date: 2026-10-15. Public, primary vendor documentation and US App Store listings. This is desk research, not hands-on testing. Feature claims do not establish reliability, user adoption, retention, or willingness to pay. A feature not found in reviewed documentation is unverified, not necessarily absent. Prices are illustrative advertised prices, not Polish checkout quotes.

### Main conclusion

The proposed combination is already being sold: handwritten recipe capture, preserved originals and family stories, private collaboration, planning from saved recipes, and grocery lists. Recipes We Share is especially close. Minsuri also advertises ingredient-based recommendations from the family's own cookbook. Novelty must therefore come from demonstrably better execution for a focused customer segment, not from combining these checkboxes.

### Established competitors

#### Paprika 3 and Paprika 4 beta

Paprika supports iOS, Android, Mac, and Windows; the official product page does not advertise a browser application. Current features include recipe collection, high-resolution photos, scaled servings, merged grocery ingredients, reusable menus, and meal planning. Separate platform purchases remain the Paprika 3 model. [Product page](https://www.paprikaapp.com/)

The September 28 open beta adds scanning cards/cookbook pages, social and clipboard imports, shared cookbooks, separate family logins, barcode pantry entry, additional pantry locations, and calendar feeds. These are beta features, not a finalized general release. [Beta announcement](https://paprikaapp.com/news/2026/09/28/paprika-4-is-now-in-open-beta/)

Paprika says new features will require a subscription after release, covering all platforms; the exact price was not finalized in its July FAQ. Existing users can retain their existing functionality without subscribing. Therefore comparisons saying Paprika has no family logins are outdated relative to beta. [Subscription FAQ](https://paprikaapp.zendesk.com/hc/en-us/articles/41887059110167-Will-Paprika-4-have-a-recurring-subscription-fee)

HTML and native-format bulk exports exist. Voice storytelling, lineage, and automatic pantry-aware planning were not verified. [Windows guide](https://www.paprikaapp.com/help/windows/)

#### Recipe Keeper by Tudorspan

The established product is recipekeeperonline.com, not similarly named recipekeeper.org. It advertises handwritten/photo/PDF OCR, iOS/Android/Windows/Mac, offline use, ingredient search, shared meal plans, grocery lists, and designed PDF cookbooks with chapters and custom text pages. Thus scanning grandma's notebook and producing a gift cookbook are established capabilities. Web application, distinct family roles, voice history, and inventory-driven automatic planning were not verified. [Official product](https://www.recipekeeperonline.com/)

The developer's Mac App Store response says purchases are separate by platform/account; one Mac purchase covers Macs using that store account. Do not present an unverified universal one-time price. [Mac listing](https://apps.apple.com/us/app/recipe-keeper/id1315583175?mt=12)

A concrete privacy distinction: scanning sends images/PDF pages to a third-party OCR service; scanned images/text may be retained temporarily to improve that service. Ordinary recipe data remains local unless the user enables an account/sync. [Privacy policy](https://www.recipekeeperonline.com/privacy)

#### CookBook

iOS, Android, and web; advertised USD guide prices $6.99/month or $39.99/year. Free includes 20 recipes and 20 smart imports. Polish is already a supported UI language. Bulk exports remain available on free, but exported files can reference hosted images; the vendor recommends retaining originals separately. After subscription expiry only 20 most recent recipes remain viewable, although all can still be exported. [Pricing and access FAQ](https://cookbookmanager.com/pricing)

Handwritten OCR, retaining original photos, review/correction, tags, stories/notes, planning and shopping are documented. The vendor specifically warns against inventing missing times/temperatures and advises asking the original cook. Therefore “keep the original and review AI” is also not an untouched market gap. [Scanner](https://cookbookmanager.com/features/recipe-scanner)

AI can propose dishes from ingredients, adapt recipes, translate and tidy instructions. This is not evidence of a deterministic inventory planner. [AI features](https://cookbookmanager.com/features/ai-cooking-assistant)

A verified collaboration gap: no account-linking/family profiles yet; families share login credentials or exchange individual recipes. Separate accounts require separate subscriptions beyond free limits. [Sharing help](https://help.cookbookmanager.com/en/category/sharing-printing-exporting-4puto5/)

#### ReciMe

Available on iOS, Android and web. Supports social/web imports and handwritten photos, meal plans and aisle-sorted grocery lists. The homepage states five free imports weekly, with grocery/planning/cookbook functionality still usable without subscribing. [Official product](https://www.recime.app/)

The August pricing help gives US $39.99/year as an example and says price depends on plan and region. The US App Store also lists $29.99/$39.99/$59.99 purchases without identifying all billing periods; do not infer a $59.99 annual plan from that listing alone. [Pricing help](https://recime.app/help/en/articles/11630592-wie-viel-kostet-das-recime-abo), [US store](https://apps.apple.com/us/app/recime-recipes-meal-planner/id1593779280)

Multi-device collaboration is documented through using the same account. Individual PDF export/printing is offered; full independent archival export with original assets was not verified. [Account sync](https://recime.app/help/en/articles/11626072-can-you-share-your-recime-account-across-multiple-devices), [Plus features](https://recime.app/help/en/articles/11630603-what-are-the-benefits-of-recime-plus)

#### Samsung Food+

Advertises $6.99/month or $59.99/year, with regional differences; subscription purchase is mobile-only. iOS/Android purchasing and a web app are documented. Features include custom seven-day meal plans, saved plans, AI adaptations and shopping. [Pricing](https://samsungfood.com/food-plus/)

Food+ explicitly includes ingredient scanning with a phone, a Food List, grocery/pantry transfers, and “Use It Up” searches from available ingredients. Pantry-based AI recommendations cannot be claimed as a new idea. Archival handwritten originals, family provenance, and portable preservation export were not verified. [Feature documentation](https://support.samsungfood.com/hc/en-us/articles/32709269852052-What-s-Included-in-Your-Samsung-Food-Subscription)

#### AnyList

Complete costs $9.99/year individual or $14.99/year household on its public site. Provides recipe importing, shared recipes and meal planning, consolidated lists, and web access. This is a strong low-price anchor for the ordinary utility portion of the proposed product. [Complete](https://www.anylist.com/complete), [Feature comparison](https://www.anylist.com/features)

Supports iPhone/iPad/Android; Mac and browser access require Complete. Handwriting OCR, source lineage, voice preservation and pantry AI were not verified in reviewed sources. [Platforms](https://www.anylist.com/apps)

### Direct family-preservation competitors

#### Recipes We Share: closest full-workflow comparison

Offers iPhone and web, separate family logins under one subscription, handwritten front/back capture, retained original card images, cook attribution, stories, family adaptations, and private-by-default access. It also advertises automatic weekly dinner filling from owned recipes and one grocery list. Its competitive table incorrectly labels Paprika family logins as absent relative to Paprika 4 beta; use each vendor's own evidence. [Product](https://recipesweshare.com/)

Advertised annual prices: Starter $39 for 150 recipes/10 members; Family $79 for 200 recipes/20 members plus memory galleries and annual-plan PDF export; Legacy $129 for 500 recipes/50 members and printed book ordering. Free supports 20 recipes/3 members. Cancellation returns access to free-plan limits. Currency displayed as dollars on the US company's site; Polish checkout not tested. [Pricing](https://recipesweshare.com/pricing)

#### Heirloom Recipe Box: direct emotional positioning

iPhone/iPad app with handwritten capture, voice, private sharing, original attribution and recipe lineage. Current copy explicitly says it is not a meal planner; older launch notes mention dinner-party planning, so do not treat that as a current weekly planner. US store prices: $6.99/month, $39.99/year, $149.99 lifetime. It has only two US ratings in the inspected listing: existence is not traction. [App Store](https://apps.apple.com/us/app/heirloom-recipe-box/id6759019723)

Vendor says voice transcription runs on-device, audio stays there unless shared, no public feeds/profiles, and PDF export exists. Free core recipe capture/sharing and premium voice/scanning are advertised. No Android or browser editor verified. [Family product page](https://heirloomrecipebox.app/family-recipe-app)

#### Minsuri: direct challenge to the combined idea

Advertises photo/voice/manual capture, family stories and contribution, ingredient-based search of the user's cookbook or generated recipes, and PDF export. Website pricing: Family $5.99/month or $59/year (100 recipes, six members, 20 fridge suggestions/month); Heritage $12.99/month or $109/year (unlimited recipes/members, voice creation, videos and printing). Free includes 15 recipes, two members and five suggestions/month. Native app availability, active customer count and functional quality were not verified. [Official site](https://minsuri.com/)

#### Additional saturation checks

Passed Down advertises handwritten scans, planning, lists and My Circle sharing. US iOS price $4.99/month, $29.99/year or $99.99 lifetime; five ratings only. [Store](https://apps.apple.com/us/app/passed-down-digital-dish/id6761967566)

Heritage Table advertises cards, voices, stories and family versions but invites “Founding Families”; treat maturity as unproven. [Site](https://myheritagetable.com/)

Old Family Recipe now leads with a publishing business and printed heirlooms from $29; older community claims about its app should not establish current capabilities. [Current site](https://oldfamilyrecipe.com/)

### Implications and testable positioning

These are recommendations, not proven unmet demand:

1. Start with the adult family archivist who already owns physical cards, wants relatives involved, and also cooks those dishes weekly. A general recipe collector has excellent alternatives.
2. Test the complete outcome: digitize ten real recipes accurately, resolve ambiguous amounts with the relative, retain the originals, and cook one dish using available ingredients. Measure correction time, successful cooking, and family contribution.
3. Offer visibly separate original, corrected transcription and cooking adaptation. Preserve uncertainties such as “one glass” instead of silently converting to an invented milliliter value.
4. Make complete portable export of structured recipes and original assets a trust guarantee. CookBook's documented hosted-image caveat gives a concrete comparison target. This is execution differentiation, not a claim that no competitor supports export.
5. Avoid a full inventory system initially. Let users name three to five products to use this week, rank verified family recipes and list missing ingredients. Do not generate counterfeit family recipes.
6. Subscription pricing must beat a credible choice set: $14.99/year AnyList household utility, $29.99/year Passed Down, $39/year Recipes We Share and $39.99/year CookBook/Heirloom. A larger price requires evidence of superior digitization/service or retention, not merely AI branding.

## Private recipe books: first-person review evidence

Research date: 2026-10-15. This is a qualitative, purposive sample of publicly accessible original reviews and posts, not a representative survey. Review authors' identities and purchase claims were not independently verified. App Store review versions are not exposed in the retrieved pages unless explicitly stated below. Historic bugs are evidence of failure modes, not evidence that current versions still contain them. Review page ordering can privilege old, helpful reviews. Product facts should be checked against official documentation.

### Twelve concrete observations across five products and household workflows

| # | Product / source, date and version | First-person observation | Evidence classification and implication |
|---|---|---|---|
| 1 | Recipe Keeper, US App Store, Tairn831, 2025-01-06; version unspecified | The reviewer liked consolidated recipes and meal planning but objected to buying again on Windows after paying on iPhone. The developer confirms separate purchases for other platforms or Apple IDs. | Confirmed commercial friction. The review incorrectly describes cross-platform sync as impossible: syncing is supported, but additional purchases are required. Transparent household-wide pricing could reduce friction. [Original review and developer response](https://apps.apple.com/us/app/recipe-keeper/id974683711?see-all=reviews). |
| 2 | Recipe Keeper, US App Store, Butterflies and Sunshine, 2020-04-26; version unspecified | A reviewer digitized old family recipes, found handwriting capture worth the price, and still had to correct the results. | Old but direct positive evidence for paid preservation. Handwriting OCR is an existing feature, not a gap to claim; correction speed is a quality criterion. [Original review](https://apps.apple.com/us/app/recipe-keeper/id974683711). |
| 3 | CookBook, US App Store, anticipateu, 2023-05-11; version unspecified | The user preserved recipes from a mother's deteriorating cookbooks. OCR required marking title, ingredients and instructions; after learning it, the user found it valuable and accepted paying again after years. | Preservation and willing payment coexist with learning cost. Test time to first verified family recipe, not just whether OCR runs. [Original review](https://apps.apple.com/us/app/cookbook-recipe-keeper/id1073341917?see-all=reviews). |
| 4 | CookBook, US App Store, SomethingSomethingDarkSide_, 2023-09-24; version unspecified | A user with over 300 recipes reported prompts to subscribe or delete recipes when trying to view the collection after commercial changes. They believed their prior purchase was lifetime; the developer disputes that classification, says lifetime plans began with v2 in 2021, and offers help. | Historic, disputed entitlement complaint, not proof of a current paywall policy. It demonstrates the importance of explicit ownership terms and readable exports. [Original review and response](https://apps.apple.com/us/app/cookbook-recipe-keeper/id1073341917?see-all=reviews). |
| 5 | ReciMe, US App Store, ameliah, 2025-10-02; version unspecified | A subscriber had accumulated recipes across many services but rarely revisited them. Reliable extraction, usable formatting, original links and audio extraction made the app frequently used and worth paying for after a trial. | Direct willingness-to-pay statement, not a conversion statistic. Reliable capture and retrieval matter more than simply collecting more recipes. [Original review](https://apps.apple.com/us/app/recime-recipes-meal-planner/id1593779280?see-all=reviews). |
| 6 | ReciMe, US App Store, Dannnnneeeeeelllllleee, 2025-01-13; version unspecified | A paying user praised English/Portuguese imports and reported that some accents, slang and recipes with listed ingredients still produced import errors. The developer acknowledged improving AI accuracy. | Historic reliability complaint. Preserve source material and require correction/approval when extraction is uncertain. Do not infer current failure rate. [Original review and response](https://apps.apple.com/us/app/recime-recipes-meal-planner/id1593779280?see-all=reviews). |
| 7 | ReciMe, Canadian App Store, jake-443, 2025-02-23, and Farisrk, 2024-10-11; versions unspecified | One user thought eight imports would renew monthly, then discovered the free allowance was exhausted. Another abandoned the app over unexpected payment requirements and preferred OneNote. | Pricing clarity and a real free substitute. These are self-reports of the offer seen at the time, not verified current limits. [Original reviews](https://apps.apple.com/ca/app/recime-recipe-manager/id1593779280?platform=iphone&see-all=reviews). |
| 8 | AnyList, US App Store, jdeangelo82, 2019-11-11; version unspecified | The user preferred a higher one-time payment but paid yearly because recipes, planning, family lists and reliability became part of everyday life. They worried about dependence on the developer's continuing operation. | Old positive and negative payment evidence in the same review. Retention can come from the weekly workflow; preservation needs an exit path. [Original review](https://apps.apple.com/us/app/anylist-grocery-shopping-list/id522167641). |
| 9 | Paprika 4 beta discussion, r/PaprikaApp, retrieved 2026-10-15; page displays relative hours while search labels it three days old, so exact publication day is unresolved | The original poster says the beta now delivers most requested features and would pay a subscription. Other commenters reject another subscription or dislike basic organizational features becoming premium; a separate exchange confuses Apple Family Sharing with Paprika's new account sharing. | Mixed sentiment and confusing terminology, not a vote-count or pricing conclusion. Do not quote precise date or treat commenters' assertions as licensing facts. [Original discussion](https://www.reddit.com/r/PaprikaApp/comments/1x37ah4/paprika_4_features/). |
| 10 | Pantry workflow including Paprika, r/Cooking, 2026-02-17 post / 2026-02-18 reply; version unspecified | The requester wants own recipes plus pantry/freezer stock and a missing-ingredient list. A respondent found maintaining inventory cumbersome: an app could say an ingredient exists although too little remains or it has spoiled. They prefer checking the kitchen before planning. | Concrete maintenance failure mode. Start with an ephemeral “use these ingredients first” list and a final purchase checklist; do not require a perpetual exact inventory. [Original post and replies](https://www.reddit.com/r/Cooking/comments/1r7l6ao/looking_for_a_digital_recipe_solution_that/). |
| 11 | Family handwriting preservation, r/Cursive, 2026-07-26 post and replies; not an app review | The author is trying to decipher hundreds of grandmother's recipe cards, some deteriorating. In a reply, a reader reports ChatGPT substituting onion for cajun while flagging uncertainty. | Fresh, direct problem evidence, not a model benchmark. Keep originals, distinguish unknown text from guesses, and make uncertain ingredient review explicit. [Original post and discussion](https://www.reddit.com/r/Cursive/comments/1v6sa0n/need_help_deciphering_like_grandmothers_family/). |
| 12 | Family recipe reconstruction, r/Old_Recipes, 2023-01-03/04; not an app review | A commenter who made a grandmother's cookbook says many recipes recorded ingredients and temperatures but omitted steps; they sought clarification from relatives before producing family copies. | OCR alone cannot recover missing tacit knowledge. A short structured clarification step could be meaningful; it must ask the family rather than invent an authoritative reconstruction. [Original discussion](https://www.reddit.com/r/Old_Recipes/comments/102czmr). |

### Supporting evidence and current-feature corrections

- **Original handwriting has emotional value.** In a 2025-05-20 post, the author describes recovering a grandmother's banana-bread card and preserving it in a photo book. This supports retaining the source image, but does not establish willingness to pay for an app. [Original r/Baking post](https://www.reddit.com/r/Baking/comments/1krinw6).
- **Simple household archives face strong free substitutes.** A family-sharing request, displayed as eight months old on retrieval, attracted descriptions of shared Notes folders, Drive, Dropbox and Word documents. One commenter had scanned a mother's cookie recipes into Notes and shared them with a sister, explicitly valuing the handwriting. The thread also includes product promotion, which is excluded from conclusions. [Original request and replies](https://www.reddit.com/r/FoodTech/comments/1r2w6ci/does_anyone_know_of_an_app_where_i_could_share_my/).
- **Recipe capture without a cooking habit is not necessarily enough.** A 2026-06-07 requester wanted both saved web/social recipes and suggestions using kitchen contents, and found products did not combine these as expected. Their clarification wanted discovery beyond already-saved recipes, so this is not direct validation of a private-library-only product. Numerous founder replies were excluded. [Original request](https://www.reddit.com/r/PaprikaApp/comments/1tz2k55/trying_to_find_a_good_recipe_app/).
- **Paprika 3 limitations are not automatically Paprika 4 opportunities.** The official 2026-09-28 open-beta announcement lists recipe-card scanning, social and clipboard imports, shared cookbooks, family accounts, extra pantry locations and barcode scanning. Premium features will require subscription after beta. Historical complaints about missing OCR, shared collections or multiple pantry locations are being addressed. Beta availability does not prove production quality or adoption. [Official announcement](https://www.paprikaapp.com/news/2026/09/28/paprika-4-is-now-in-open-beta/).
- **Export is already available in incumbents.** AnyList documents importing exported Paprika recipes, printing recipes, and sharing a common household library and meal calendar. “Export” or “family sharing” alone are not novel differentiators. Verify exact formats, image inclusion and cancellation behavior for each product rather than implying none offers portability. [Paprika import](https://help.anylist.com/articles/paprika-import/), [print](https://help.anylist.com/articles/print-recipe/), [household sharing](https://help.anylist.com/articles/share-recipes-meal-plan/).

### Product interpretation, explicitly hypotheses

The strongest positioning to test is a **private family cookbook that turns imperfect inherited material into verified, usable recipes and helps the household cook from them**. The candidate distinction is the complete preservation-to-use workflow, not a novel checklist of OCR, sharing, planning and AI capabilities.

The initial user may be the person organizing family material; the paying customer may be that same person funding the household. Evidence here does not prove those people will maintain a subscription after the digitization project ends. A one-time digitization/export purchase may fit episodic preservation better; a recurring plan needs observed recurring planning, cooking and collaboration value. Both remain pricing hypotheses.

The main testable quality promises are:

1. A photographed recipe becomes a verified usable recipe quickly, while retaining the original image and author attribution.
2. Missing quantities or steps remain visibly unresolved until a person clarifies them. AI never silently changes a family original.
3. Relatives can contribute or correct a recipe without every person buying a separate platform license.
4. A household can plan a few dinners from its own library after naming a handful of ingredients to use first, without maintaining exact stock counts.
5. Access and export remain understandable even after payment ends. Do not promise indefinite free hosting; provide a readable local archive and explicit service terms.

Suggested interview tasks: bring five real family pages; try one difficult page; compare original and corrected recipe; invite a relative; plan three actual dinners; create and edit the resulting shopping list; download the complete archive. Observe completed actions and offer a real paid pilot. Do not treat favorable opinions as demand.

### Research limits

No app was installed or tested, and no interviews were conducted. The sample is English-language and mostly North American App Store/Reddit material. It cannot establish Polish OCR quality, local willingness to pay, complaint prevalence, competitor retention, or market size. Several useful product reviews are old and should be used as design failure cases only. No Samsung Food conclusion is drawn: an attempted direct review page fetch failed, and secondary summaries were not used as a substitute. A parent report should combine this qualitative evidence with current official competitor documentation and direct product testing.
