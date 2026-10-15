# Monetizable web and mobile app opportunities

Research date: 2026-10-15. Primary-source research for a small team building a web app and an Expo mobile app, with a Cloudflare backend.

## Scope and recommendation

Assumptions: an English-language launch, initially targeting one reachable niche in a developed market; a small product team; no existing distribution advantage; revenue rather than venture-scale growth as the objective. The user has not specified B2B versus consumer, target income, budget, or geography. Prices below are proposed experiments, not observed market prices or revenue forecasts. Category sketches use USD; the final competitive-review shortlist uses EUR price experiments for a possible European launch. These are independent tests, not currency conversions.

My recommendation is to validate a narrow professional workflow first: job-completion evidence and customer reports for one trade. For a consumer product, test a niche nutrition/planning workflow or occupation-specific speaking practice. General AI assistants, general task managers, and full fitness social networks have visible demand but an unfavorable initial scope and differentiation burden.

The strongest evidence is for growing spending, not for easy customer acquisition. A successful incumbent demonstrates willingness to pay somewhere in a category; it does not prove demand for a new substitute.

## What is actually growing

| Signal | Observed period and evidence | What it supports |
|---|---|---|
| Spending on non-game apps | Sensor Tower estimates non-game IAP revenue grew 21% in 2025. Total mobile downloads grew only 0.8%. [Sensor Tower, January 2026](https://sensortower.com/blog/state-of-mobile-2026) | Monetization is growing faster than acquisition volume. |
| Generative AI usage and spending | In 2025, GenAI app downloads doubled to 3.8 billion; IAP revenue almost tripled to over $5 billion. [Sensor Tower](https://sensortower.com/blog/state-of-mobile-2026) | Strong category momentum, but not a case for an undifferentiated AI wrapper. |
| Fitness and nutrition monetization | Health & Fitness IAP revenue grew 13% to $4.5 billion in 2025; installs increased only 0.8%. Running/cycling and AI nutrition were highlighted as strong subgenres. [Sensor Tower, February 2026](https://sensortower.com/blog/health-and-fitness-apps-ai) | Evidence for paid outcomes and repeated use, rather than a download boom. |
| Offline sports communities | Strava reported running clubs grew 3.5x and hiking clubs 5.8x in 2025; club-organized events grew 1.5x. These are Strava platform metrics. [Strava, December 2025](https://press.strava.com/en-gb/articles/strava-releases-12th-annual-year-in-sport-trend-report-2025) | A possible opportunity in club operations; not proof of organizer software demand. |
| Paid mobile learning | Duolingo reported 12.7 million paid subscribers in Q2 2026, up 17%, and 58.7 million DAUs, up 23%. [Q2 2026 shareholder letter, page 3](https://investors.duolingo.com/static-files/3c8277ee-bc94-4f5d-9b77-0db3e46f88b8) | Current willingness to pay for learning, with strong incumbent competition. |
| Digital focus | In a May 2026 founder interview, Opal reported surpassing one million DAUs and $10 million ARR after changing its free tier. This is company self-reporting in an original interview, not an audited category estimate. [RevenueCat interview](https://www.revenuecat.com/blog/growth/kenneth-schlenker-sub-club-podcast-2026) | Evidence of an established paid need, but only one company's trajectory. |

## Subscription economics and limits of the evidence

RevenueCat's 2026 dataset covers over 115,000 apps and $16 billion in tracked revenue. Among newly launched apps, 17.3% reached $1,000 monthly revenue and 4.6% reached $10,000 within two years. Its AI cohort had median first-year realized value per payer of $30.16 versus $21.37 for non-AI, but annual-plan retention after 12 months was 21.1% versus 30.7%. New monthly subscription-app launches rose from about 2,000 in January 2022 to over 14,700 in January 2026. These are observational platform benchmarks, not the probability that an arbitrary new app succeeds. [RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps)

Do not confuse active renewal rate with first-year subscriber retention. The report presents both, with very different denominators. Likewise, monthly revenue milestones should not automatically be renamed MRR: the source labels them monthly revenue.

Interpretation: charge for a recurring outcome, keep variable AI costs bounded, and validate retention before scaling acquisition. Neither a higher price nor an annual plan creates value by itself. Profit must be calculated after payment/store fees, refunds, inference, hosting, support, acquisition, and taxes; revenue alone is insufficient.

## Seven opportunity categories

All proposed product gaps, prices, risks, and validation criteria in this section are research hypotheses or design judgments unless explicitly attributed to a source. A proposed improvement is not a claim that every competitor lacks that feature.

### 1. Job-completion evidence for one service trade

**Evidence:** Jobber surveyed 1,050 US home-service owners in December 2025. Respondents named jobsite management (48%), customer communication (40%), and quoting (37%) as major time-consuming tasks; 58% reported increased customer demand over the previous year. This is survey evidence, with selection and self-reporting limits, not measured demand for a new app. [Jobber 2026 report](https://www.getjobber.com/home-service-trends-report/)

**Product hypothesis:** a cleaning or maintenance crew turns before/after photos, a short dictated note, and a checklist into a customer-ready completion report. The owner reviews work from the web; workers capture it on phones. A specific workflow, such as recurring commercial cleaning, offers a more coherent scope than all trades.

**Comparable products:** CompanyCam, Jobber, SafetyCulture. The competitive review below checks CompanyCam and Jobber feature presence and pricing; these are mature products, not empty categories.

**Initial scope:** jobs, offline photo capture, required evidence checklist, review, shareable report, searchable history. Exclude dispatch optimization, payroll, accounting, and a general CRM.

**Monetization test:** $19-49 per business monthly. At $29, 100 paying businesses produce $2,900 monthly gross revenue; this is arithmetic, not a forecast.

**Why it might win:** a trade-specific setup and report can eliminate configuration and reduce repetitive customer questions. **Risk:** owners may prefer existing WhatsApp/photo folders, or require the full suite before paying. **Validation:** five businesses use it on real jobs and three pay; measure report preparation time before and after, then repeat usage over four weeks.

### 2. Household nutrition planning with a narrow constraint

**Evidence:** Sensor Tower specifically identifies Cal AI, MacroFactor, and YAZIO among growing AI nutrition/diet-tracking players in its February 2026 analysis. [Sensor Tower](https://sensortower.com/blog/health-and-fitness-apps-ai)

**Product hypothesis:** a planner for two adults with different portion requirements but shared meals, a shopping list, leftovers, and repeatable weekly choices. Alternatively, target one dietary preference and local grocery habits. Avoid making disease-treatment or diagnostic claims.

**Comparable products:** MyFitnessPal, YAZIO, MacroFactor, Paprika, and Meals Hub. Mealime officially closes on October 21, 2026, moving users toward free Meals Hub, available on web/mobile even without a nearby Albertsons store. This creates a possible migration moment, not evidence of paid demand; a free successor also increases competition. [Mealime announcement](https://www.mealime.com/closing)

Paprika 4 entered open beta on September 28, 2026 with social recipe import, scanning, family logins, shared lists/plans, nutrition analysis, and pantry enhancements. Therefore, “shared lists plus AI import” is already insufficient differentiation. [Paprika announcement](https://www.paprikaapp.com/news/2026/09/28/paprika-4-is-now-in-open-beta/)

**Initial scope:** curated meals, portion adjustment, reusable weekly plan, shared list, and simple substitutions. An optional AI import should reduce typing; automatic calorie estimation from a photo should not be the product's only value.

**Monetization test:** $5-9 monthly per household or a transparent annual option. **Why it might win:** fewer decisions and a usable shopping routine. **Risk:** crowded market, food-data maintenance, inaccurate imports, and churn after initial motivation. **Validation:** ten households execute three weekly plans; at least four pay to continue and five still use the shared list in week four.

### 3. Speaking practice for one occupation or recurring situation

**Evidence:** Duolingo's Q2 2026 paid-subscriber growth demonstrates continued demand; its $298.5 million quarterly revenue grew 18%. These are company-wide figures, not speaking-only results. [Duolingo shareholder letter](https://investors.duolingo.com/static-files/3c8277ee-bc94-4f5d-9b77-0db3e46f88b8)

**Product hypothesis:** English for service workers, developers interviewing internationally, or hospitality staff. One target group gets relevant conversations, a replay, precise corrections, and spaced practice of its own mistakes.

**Comparable products:** Duolingo, Speak, ELSA Speak. The opportunity is a narrow curriculum and measurable competence, not generic conversation with an LLM.

**Initial scope:** 20 reviewed scenarios, turn-based voice, transcript, focused feedback, mistake review. Avoid real-time video avatars and a full course catalog.

**Monetization test:** $9-15 monthly with explicit voice allowances; assess a fixed-price interview preparation package if usage is episodic. **Risk:** speech/inference costs, inaccurate corrections, competition, and churn after an interview or trip. **Validation:** ten users complete three sessions each; an independent rubric measures whether the targeted conversation improved, and at least three buy the next module.

### 4. Operations for small running or hiking clubs

**Evidence:** Strava's 2025 report gives direct growth evidence for clubs and organized events, but does not measure club-organizer software budgets. [Strava](https://press.strava.com/en-gb/articles/strava-releases-12th-annual-year-in-sport-trend-report-2025)

**Product hypothesis:** recurring sessions, pace/ability groups, RSVP limits, waitlists, leader assignments, and last-minute updates. Members enter through a shared link; organizers manage the series on the web.

**Comparable products:** Strava Clubs, Meetup, Spond. Start with workflow assistance for an existing community rather than building a discovery marketplace.

**Monetization test:** $10-25 per organizer monthly or a club annual fee. **Why it might win:** replace repeated spreadsheet/chat administration. **Risk:** volunteer groups may have no budget; established free tools may already suffice; seasonality. **Validation:** three organizers run four events each, and two choose to pay after the test.

### 5. Digital focus for a specific work/study routine

**Evidence:** The original Opal founder interview documents a monetized focus product, while one sec's official Android instructions require platform permissions such as accessibility and app overlays. [Opal interview](https://www.revenuecat.com/blog/growth/kenneth-schlenker-sub-club-podcast-2026), [one sec setup](https://tutorials.one-sec.app/en/articles/3034754)

**Product hypothesis:** a planned work session links the task, focus interval, and end-of-session review across devices. This is a potentially stronger outcome than another generic Pomodoro timer.

**Comparable products:** Opal, one sec, Freedom, Forest.

**Monetization test:** $4-8 monthly. **Why it might win:** a particular routine, accountability mechanism, or distribution community. **Risk:** effective blocking requires platform-specific engineering and support; a browser/mobile timer without blocking may be too weak. This is not the simplest first Expo project. **Validation:** first test the actual permission/blocking flow on target devices, then verify voluntary recurring use before building a full dashboard.

### 6. Daily planning for a narrowly defined scheduling problem

**Evidence:** Structured's April 2025 anniversary post reports reaching nearly nine million users in the prior year. This is ambiguous about active versus acquired users and provides no revenue or comparable prior-year baseline, so it supports popularity, not a reliable growth rate. [Structured](https://structured.app/blog/structuredfive)

**Product hypothesis:** planning around shift work, irregular availability, or a specific caregiver routine. Focus on fast capture, realistic capacity, automatic rescheduling with user control, and gentle recovery after a missed day.

**Comparable products:** Structured, Todoist, TickTick. Do not promise clinical ADHD outcomes.

**Monetization test:** $4-7 monthly or an annual option. **Why it might win:** a better model of the chosen routine than a generic task list. **Risk:** switching costs, free alternatives, calendar integration maintenance, and superficial differentiation. **Validation:** users import actual routines, use the planner for four weeks, and pay for the precise scheduling feature; attractive screens alone do not count.

### 7. Product-listing preparation for one resale niche

**Evidence:** Photoroom reported over 150 million cumulative downloads in October 2025. Its official material describes batch editing, web/mobile access, and team collaboration, so those features alone are not whitespace. A named customer case reports reducing monthly image-processing work from 800 to 200 hours; that is a selected customer example, not a general expected result. [Photoroom introduction](https://help.photoroom.com/en/articles/9626719-what-is-photoroom), [Valuence customer case, August 2025](https://www.photoroom.com/ko/customer-stories/valuence)

**Product hypothesis:** capture item photos plus dictated condition notes, then produce a verified listing packet for one resale category: consistent photos, measurements, visible flaws, inventory status, and channel-ready exports.

**Comparable products:** Photoroom, Canva, marketplace-native listing tools.

**Monetization test:** $9-19 monthly with an image allowance or prepaid credits. **Why it might win:** a complete niche workflow rather than another background remover. **Risk:** expensive image generation, marketplace integration constraints, fabricated condition details, and rapid incumbent copying. **Validation:** five sellers prepare 20 real listings each, measure time saved, and secure three paid continuations.

## Selection and next decision

The most attractive opportunities depend on distribution access. A modest field-service tool sold to people the founder can interview is a better initial bet than a larger consumer category without a reachable audience. Conversely, an existing fitness or language community can reverse that ranking.

Suggested order of experiments after competitive review: (1) trade-specific job reports; (2) constrained household meal planning; (3) a narrow coach-client review workflow. Occupation-specific speaking is a further candidate with stronger content and audio-quality requirements. Run interviews and a small paid concierge prototype for two ideas before building shared infrastructure. Require recurring use, an explicit payment, and a concrete improvement in time or outcome. Treat compliments, waitlist signups, and competitor download counts as weak evidence.

No source here establishes that any proposed niche is currently underserved. The feature review below establishes existing functionality; direct user interviews and paid pilots are still necessary to establish an underserved need. No full-year 2026 market results are implied: the broad market figures cover 2025, while selected company results and surveys were published in 2026.


## Competitive review and recommended entry points

This is a desk-research comparison, not a hands-on usability audit. Proposed advantages are hypotheses to test; vendor documentation establishes existing functionality, not user dissatisfaction. Priority below reflects suitability for a small team, repeat use, a reachable buyer, and restricted scope, rather than the size of a market headline. Prices are proposed experiments in EUR, not observed willingness to pay or revenue forecasts.

| Priority | Product hypothesis | Existing reference products | Initial scope | Price experiment | First distribution channel | Main reason it might fail |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Proof-of-work reports for small commercial cleaning teams | CompanyCam, Jobber | Job, before/after photos, checklist, approved report, client link | EUR 19-39 per business/month | Owner interviews and pilots through local cleaning-industry contacts | Teams may find messaging apps sufficient; onboarding and offline reliability can erase savings |
| 2 | Household meal planner independent of a grocery chain | Mealime/Meals Hub, Paprika | User-owned recipes, weekly plan, portions, consolidated grocery list, household sharing | EUR 4-7/month or EUR 39-59/year | Meal-planning communities and transparent migration guides | Free Meals Hub and strong existing planners may leave little willingness to pay |
| 3 | Weekly client review tool for a narrow type of fitness coach | Trainerize, Hevy Coach | Coach templates, client log, weekly check-in, adherence summary | EUR 19-39 per coach/month | Five coaches bringing their existing clients | Established products already cover the workflow; replacing them may not be worth migration |
| 4 | Work-specific spoken English practice | Speak, Duolingo | One profession, vetted scenarios, recorded responses, feedback and spaced review | EUR 9-15/month with explicit audio limits | One professional association or specialist educator | Generic tutors may already be good enough; content and audio quality drive cost |
| 5 | Administration for an existing local activity club | Strava clubs and messaging groups | Events, attendance, capacity, reminders and simple membership status | EUR 10-25 per organizer/month | Existing clubs rather than a new consumer network | Organizers may refuse another paid tool and members may resist installing it |

### What the incumbents already do

- CompanyCam already advertises offline capture, automatic synchronization, reports, client updates, and voice/photo proposals. Its official documentation now includes a solo/small-team tier. Neither "offline" nor "AI reports" is an unmet feature by itself. The potential entry point is a tested cleaning-specific flow, faster setup, and a useful package for a very small team. Its pricing/help pages contain inconsistent details, so no precise current CompanyCam price is used as the business case. [CompanyCam pricing](https://companycam.com/pricing), [plan explanation](https://help.companycam.com/en/articles/14477655-companycam-plans-explained).
- Jobber Core currently lists USD 49/month without commitment, or USD 29/month billed annually for one user, including scheduling, quotes and invoicing. Follow-ups and checklists appear in Connect. Competing with its complete suite would destroy the small-MVP assumption. [Jobber pricing](https://www.getjobber.com/pricing/).
- Paprika 4's open beta, announced September 28, 2026, already includes social-media recipe import, photo scanning, separate family logins, pantry enhancements and nutritional analysis. These are competitive baseline features, not novel differentiators. A proposed planner should prove a more useful weekly decision process, such as reusing ingredients across three dinners and adjusting portions for leftovers. [Paprika release announcement](https://www.paprikaapp.com/news/2026/09/28/paprika-4-is-now-in-open-beta/).
- Trainerize already offers workout, nutrition, habit and communication features; its pricing starts with a free one-client option and a USD 10/month Grow option. A generic cheaper clone has a weak case. Validate a narrower review workflow with real coaches first. [Trainerize pricing](https://www.trainerize.com/pricing/).
- Speak already supports situational roleplay, pronunciation coaching, custom lessons and personalized study plans. A profession-specific app needs expert-reviewed curriculum and a demonstrated learning result beyond another AI conversation screen. [Speak plan comparison](https://help.speak.com/en/articles/5358417-what-s-the-difference-between-premium-and-premium-plus).

## Minimal Expo and Cloudflare implementation proposal

This is an architecture recommendation, not an implemented or benchmarked system.

- Expo Router for iOS, Android and responsive web; adapt layouts and input behavior by platform. Expo officially supports shared routing and components across these targets. [Expo Router](https://docs.expo.dev/router/introduction/).
- One Cloudflare Worker API; D1 for users, memberships, jobs and report metadata; private R2 objects for photos and generated reports. D1 is a managed SQL database, and R2 provides object storage. [D1](https://developers.cloudflare.com/d1/), [R2](https://developers.cloudflare.com/r2/).
- Add Queues only when report generation or uploads require asynchronous processing. Add Workers AI only after the deterministic workflow is useful; quality and unit cost need a representative input benchmark. [Queues](https://developers.cloudflare.com/queues/), [Workers AI](https://developers.cloudflare.com/workers-ai/).
- Authentication, access control and subscription entitlements are explicit implementation work. Cloudflare infrastructure does not remove payment-provider or mobile-store integration. Expo documents native purchase integrations that require development builds. [Expo purchases](https://docs.expo.dev/guides/in-app-purchases/).
- Treat offline capture/upload retries as an explicit product feature. Neither Expo routing nor D1 automatically provides application-data synchronization or conflict resolution. Start with single-author reports and queued uploads; defer collaborative editing.
- Definition of quality for the report MVP: no lost photo after reconnect, no duplicate report after retry, no cross-business data access, accessible keyboard/screen-reader flows, and a readable report on phone and desktop. These are proposed acceptance criteria, not verified behavior. Test domain rules and authorization, use Playwright for web journeys, and test device-only camera/offline flows on real native builds.

Workers Paid starts at USD 5/month. This is a platform minimum, not the complete application operating cost. R2 Standard storage is USD 0.015/GB-month, with a 10 GB-month free allowance and separate operation pricing; direct egress is free. Include authentication/email, AI/audio, monitoring, builds, payment/store costs and support in the actual model. [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

## Proposed validation gates before a full build

1. Interview 10 owners in one chosen cleaning niche and inspect their last three actual job reports. Continue only if at least five describe a repeated problem with a concrete cost. This threshold is a decision heuristic, not an industry benchmark.
2. Manually deliver the proposed report workflow for three businesses for two weeks. Ask them to buy a clearly scoped EUR 29/month pilot. Three paid pilots is an initial willingness-to-pay signal, not product-market fit.
3. Build only the capture-to-approved-report path. Aim for at least two of the three businesses to use it on most eligible jobs and renew for a second month. Measure reporting time before/after and support time per business. Stop or revise if usage depends on repeated reminders from the founder.

Illustrative arithmetic: 100 businesses at EUR 29/month produce EUR 2,900 monthly subscription revenue; 600 consumers at EUR 5/month produce EUR 3,000. Neither is profit or a forecast. Acquisition, churn, taxes, fees, variable costs, refunds and founder labor determine viability.
