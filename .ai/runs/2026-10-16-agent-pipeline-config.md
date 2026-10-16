# Land the agent pipeline configuration on main

## Goal
Bring the agent PR pipeline setup (delivery layer + product layer) onto `main` through a reviewed PR.

## Scope
- `.ai/agentic.config.json`, tracker and browser descriptors, `.ai/*/.gitkeep`
- `SDLC.md`, `CODE_REVIEW.md`, `BACKWARD_COMPATIBILITY.md`
- `.gitignore` entries for QA working state

Non-goals: installed skill copies and `skills-lock.json` (installed per task, kept out of the PR), any application code.

## Implementation Plan
Docs/config only. The content was produced and reviewed in the setup session; this run carries it to `main` and verifies it applies cleanly on the current tip.

## Risks
- `baseBranch` is `main`; the remote also has `develop`.
- Label taxonomy coexists with the older `type:`/`status:`/`priority:` labels already on the repo.
- Docs-only: no code gate applies; `pnpm check` was not run.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Land configuration

- [x] 1.1 Delivery pipeline config, descriptors, SDLC/CODE_REVIEW/BACKWARD_COMPATIBILITY — d0af799
- [x] 1.2 Product layer (discovery block, SDLC blocks, research dir) — a74a47b
