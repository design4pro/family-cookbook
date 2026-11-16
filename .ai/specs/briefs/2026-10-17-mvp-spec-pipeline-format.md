# Rewrite the approved Family Cookbook MVP spec into the om-spec-writing format under .ai/specs

- Date: 2026-10-17
- Category: documentation
- Priority signal: medium - graph-ready spec formatting is planned work; implementation remains paused and this brief does not unblock it
- Risk signal: medium - touches a protected shared contract (the approved MVP spec); no code changes
- Routing (interactive, not an instruction to start drafting in this PR): Next: om-spec-writing "Rewrite the approved Family Cookbook MVP spec into the om-spec-writing format under .ai/specs, with a rule-equivalence table - brief: .ai/specs/briefs/2026-10-17-mvp-spec-pipeline-format.md"

## Problem

The approved MVP contract lives in `docs/family-cookbook-mvp/spec.md` (v1.0, 14 sections, 247 lines at the recorded baseline) in a bespoke structure. The requested outcome is a full, equivalent rewrite under `.ai/specs` using the relevant `om-spec-writing` sections, including phases and steps, existing decisions and explicit open questions. Changing `paths.specs` or adding a pointer would give a location but not the requested structure.

The dated counts and conversation routing below record the 2026-10-17 brief, not a permanent readiness claim. Before drafting, recheck the current source revision, linked contracts and installed skill/workflow rules. `paths.specs` currently selects `.ai/specs`. The Cezar `idea-to-spec` graph requires a direct child spec there and its own Open Questions and Resolved assumptions structure gates; `spec-to-backlog` consumes an accepted spec with Phasing or Implementation Plan and existing backlog prerequisites. The standalone `om-backlog` skill accepts a repository-relative source path; it does not itself require every product spec to move. These mechanics explain the chosen format without making migration the only technically possible route.

## Agreed direction

Step 1 of two (this brief): author the MVP spec in `.ai/specs` in the om-spec-writing format, co-designed with the user, and ending at the user's acceptance. The rewrite must be provably equivalent: a mapping table "rule in spec.md v1.0 -> section in the new spec, or an explicit entry for an intentional change" is an acceptance condition. Every number, quota, gate and deletion/continuity rule from spec.md and its linked contract docs must appear in the table. For this format-only step, mappings must preserve normative behavior. An "intentional change" entry records a proposed deviation, not permission to apply it: protected product changes require a separate explicit developer decision recorded as an ADR under `docs/decisions/`, per `BACKWARD_COMPATIBILITY.md`. Unresolved contradictions or ambiguity stay visible for the user; do not resolve them by silently weakening a rule.

Rejected: build nothing / change `paths.specs` (gives location, not format); thin pointer spec; verbatim move with a stub; autonomous `om-auto-write-spec` (the rewrite can change the meaning of rules, so the user stays in the loop). Accepted risk: a rewrite can alter meaning; the equivalence table and user acceptance are the mitigation.

This PR records the brief only. It does not start step 1, run the autonomous graph, create a replacement spec or backlog, or claim user acceptance of a rewritten contract. Future drafting uses interactive `om-spec-writing` and stops at its Open Questions and final acceptance gates.

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
- No link rewrite (the original inventory reported 81 referencing files; refresh it before step 2) and no source-of-truth change in this step; those are step 2, after the user accepts the spec. Step 2 must also decide whether `.ai/cezar/runs` folders are in scope.
- No resumption of feature implementation, no gate (Gate 1/Gate 2, T03, T09) status changes.

## Affected areas (if known)

- Source: `docs/family-cookbook-mvp/spec.md`, `docs/family-cookbook-mvp/CONTEXT.md`, `docs/family-cookbook-mvp/implementation/plan.md` and `docs/family-cookbook-mvp/implementation/todo.md` (51 tasks in total: T01-T49 and O01-O02; task cards link to spec sections, so section anchors matter in step 2).
- Target: `.ai/specs/` (scaffolding and this brief, with no accepted replacement product spec); `paths.specs` in `.ai/agentic.config.json`.
- Protected contract: `AGENTS.md` names spec.md the source of truth; SDLC.md treats Non-goals, Business rules and Decisions as protected.
