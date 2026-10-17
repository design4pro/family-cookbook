# Rewrite the approved Family Cookbook MVP spec into the om-spec-writing format under .ai/specs

- Date: 2026-10-17
- Category: documentation
- Priority signal: medium - pipeline workflows cannot consume the product spec yet, but implementation is paused and nothing is blocked
- Risk signal: medium - touches a protected shared contract (the approved MVP spec); no code changes
- Routing: Next: om-spec-writing "Rewrite the approved Family Cookbook MVP spec into the om-spec-writing format under .ai/specs, with a rule-equivalence table - brief: .ai/specs/briefs/2026-10-17-mvp-spec-pipeline-format.md"

## Problem

The approved MVP contract lives in `docs/family-cookbook-mvp/spec.md` (v1.0, 14 sections, 247 lines) in a bespoke structure. The agent pipeline (`idea-to-spec`, `om-backlog`, `om-spec-writing`) expects the product specification under `.ai/specs` in the om-spec-writing structure (phases, steps, Decisions in play, Open Questions). Changing `paths.specs` or adding a pointer would give the pipeline a location but not that structure, which is the stated reason for the migration.

## Agreed direction

Step 1 of two (this brief): author the MVP spec in `.ai/specs` in the om-spec-writing format, co-designed with the user, and ending at the user's acceptance. The rewrite must be provably equivalent: a mapping table "rule in spec.md v1.0 -> section in the new spec, or an explicit entry for an intentional change" is an acceptance condition. Every number, quota, gate and deletion/continuity rule from spec.md and its linked contract docs must appear in the table.

Rejected: build nothing / change `paths.specs` (gives location, not format); thin pointer spec; verbatim move with a stub; autonomous `om-auto-write-spec` (the rewrite can change the meaning of rules, so the user stays in the loop). Accepted risk: a rewrite can alter meaning; the equivalence table and user acceptance are the mitigation.

## Resolved unknowns

| Question | Answer (from the conversation) |
|----------|--------------------------------|
| Which "idea" is specified? | The existing MVP in pipeline format; not a new idea, not gap-filling |
| Why migrate? | Format for the pipeline workflows, not only location |
| Migration variant | Full migration, with content rewritten into om-spec-writing sections |
| Split | Two steps: spec first (this brief); links and source-of-truth change after the user accepts the spec |
| Equivalence | Required: rule-mapping table old -> new as an acceptance condition |
| Old address in step 2 | Rewrite all links, no redirect stub (decided for step 2, restated there) |
| Routing | Ramp 4, co-design, confirmed by the user |

## Non-goals

- No new product rules, decisions or scope; the resolved Wayfinder decisions in `docs/family-cookbook-mvp` are preserved.
- No `om-discover` run and no new `product-brief.md`; "Decisions in play" is derived from the existing resolved decisions only.
- No edits to `docs/`, `AGENTS.md`, `PRODUCT.md` or `BACKWARD_COMPATIBILITY.md` in this step.
- No link rewrite (81 files reference spec.md) and no source-of-truth change in this step; those are step 2, after the user accepts the spec. Step 2 must also decide whether `.ai/cezar/runs` folders are in scope.
- No resumption of feature implementation, no gate (Gate 1/Gate 2, T03, T09) status changes.

## Affected areas (if known)

- Source: `docs/family-cookbook-mvp/spec.md`, `CONTEXT.md`, `implementation/plan.md`, `implementation/todo.md` (51 tasks T01-T51 and O01-O02, task cards link to spec sections, so section anchors matter in step 2).
- Target: `.ai/specs/` (currently only `research/.gitkeep`); `paths.specs` in `.ai/agentic.config.json`.
- Protected contract: `AGENTS.md` names spec.md the source of truth; SDLC.md treats Non-goals, Business rules and Decisions as protected.
