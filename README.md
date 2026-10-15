# Family Cookbook

Working name for a private family recipe book on Expo and Cloudflare. This is a temporary project name, not a final brand, domain selection or trademark clearance.

Preserve family recipes from photos, dictation and text, review them before use, then support cooking, grounded cookbook questions and a shared shopping list with offline checking.

## Project status

Planning baseline approved. This repository currently contains documentation only. Application implementation, infrastructure provisioning, model/device/payment verification and rollout have not started. Neither readiness gate has passed.

The repository uses `main` as its initial branch. No remote repository has been configured.

## Start here

1. Read [AGENTS.md](AGENTS.md) for collaboration and implementation rules.
2. Read the [approved MVP specification](docs/family-cookbook-mvp/spec.md).
3. Follow the [implementation plan](docs/family-cookbook-mvp/implementation/plan.md) and [task register](docs/family-cookbook-mvp/implementation/todo.md).
4. Use the [coverage matrix](docs/family-cookbook-mvp/implementation/coverage.md) to assess evidence completeness.

There are 51 open implementation/operator/milestone tasks. Begin with the relevant O01 test-access prerequisites, then T01-T09 architecture proofs before broad feature work. Repository location is now established; the remaining access prerequisites are recorded in [the access inventory](docs/operator/test-access.md).

## Decisions and research

- [Resolved Wayfinder map](docs/family-cookbook-mvp/map.md)
- [Domain context](docs/family-cookbook-mvp/CONTEXT.md)
- [Recipe-book opportunity research](docs/family-cookbook-opportunity-research.md)
- [Cloudflare AI feature research](docs/cookbook-ai-features-cloudflare-research.md)
- [Initial market research](docs/app-market-trends-research.md)

The relative documentation layout has been preserved during migration. Earlier alternatives in research or decision history do not override the approved specification.

## Planned stack and release boundaries

Expo for web, iOS and Android; a modular Cloudflare Worker backend with D1, private R2, Queues and Workers AI. See the specification for authentication, billing providers and platform-specific persistence.

Gate 1 is required before invited real-family-data use. Gate 2 is required before real charges. The implementation plan separately identifies the live-payment evidence question that must be resolved before claiming Gate 2 passes. Public store release and production rollout are separate actions.

There is no application package manifest or test command yet. Commands in task cards describe the future harness to establish, not commands already available in this repository.
