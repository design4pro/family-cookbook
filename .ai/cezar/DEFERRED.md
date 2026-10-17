# Cezar graph workflows: INERT until the bootstrap is done

The seven `version: 2` graph workflows in `.ai/cezar/workflows/*.yaml` were ported from
`design4pro/network` (Cezar 0.15.2) with their structure, loops, verdict names and port wiring unchanged. Only
network-specific wording and paths were made generic. They have been validated with the Cezar loader
(`loadWorkflows`) and never run end to end.

**They do nothing useful in this repo yet.** This repo has only `AGENTS.md`: no `SDLC.md`, no
`CODE_REVIEW.md`, no `.ai/agentic.config.json`, no `om-*` skills, no specs directory configured for the
pipeline. This port deliberately did not invent any of them: they are process decisions for the owner.
Until they exist the workflows fail closed instead of passing silently:

| Missing | What happens |
|---|---|
| `.ai/agentic.config.json` or empty `validation.commands` | The `gate` check (`issue-to-merge`, `pr-to-merge`, `scheduled-scan`) and the `detect` check (`scheduled-scan`) exit 1 with `GATE NOT CONFIGURED` / `NOT READY` and the run escalates. |
| `SDLC.md`, config, or specs directory (`paths.specs`) | Intake agents end with their not-ready verdict: `issue-to-merge` `triage` -> `needsinfo`, `idea-to-spec` `intake` -> `incomplete`, `spec-to-backlog` `intake` -> `notready`. `pr-to-merge`, `maintain-to-intent` and `housekeeping` start with a `prereq` check that exits 1 and ends the run as `needshuman`. |
| `paths.specs` unset | The deterministic `specgate` / `finalcheck` (`idea-to-spec`) and `bgate` (`spec-to-backlog`) exit 1. |

## Bootstrap checklist (owner)

- [ ] Run the interactive `om-setup-agent-pipeline` skill. It creates `.ai/agentic.config.json`, the tracker
      descriptor, `SDLC.md` and `CODE_REVIEW.md`. Set `baseBranch` to `develop` explicitly: `origin/HEAD` points
      to `main` here, so `"auto"` would pick the wrong base.
- [ ] Install the `om-*` skills listed below (installing skills is the owner's decision).
- [ ] Define the specs directory and set it as `paths.specs` in `.ai/agentic.config.json`. Every spec path in
      the workflows resolves from it; nothing is hard-coded.
- [ ] Define the backlog location. The workflows expect `<paths.specs>/backlog.md` with the table header
      `| Id | Issue | Title | Epic | Depends on | Adopted |` (checked by `bgate`). If the owner wants a
      different location or no backlog file, adapt `spec-to-backlog` and `issue-to-merge` triage first.
- [ ] Fill `validation.commands` (see the suggestions below) and confirm the gate passes on a clean `develop`.
- [ ] Resolve the "Deferred items" table, at least the project-phase conflict and the dry run.

## Skills each workflow needs

None are installed in this repo today. A workflow that reaches a missing skill fails at that agent node and
ends in `escalate`.

| Workflow | Skills |
|---|---|
| `issue-to-merge` | `om-verify-in-repo`, `om-root-cause`, `om-fix`, `om-approve-merge-pr`, `om-close-fixed-issues`; the housekeeping prompt also names `om-followup-issue-from-pr` |
| `idea-to-spec` | `om-spec-writing`; `om-brainstorm` is run by a person before the graph, not inside it |
| `spec-to-backlog` | `om-backlog`, `om-auto-manage-issues`; `om-backlog` files issues through `om-prepare-issue` |
| `pr-to-merge` | `om-verify-in-repo`, `om-fix`, `om-auto-qa-pr`, `om-approve-merge-pr`, `om-close-fixed-issues`; prompt also names `om-followup-issue-from-pr` |
| `maintain-to-intent` | `om-root-cause`, `om-prepare-issue` |
| `housekeeping` | `om-auto-manage-issues`, `om-close-fixed-issues`, `om-auto-update-changelog` (only runs when `CHANGELOG.md` exists), `om-pipeline-retro`; prompt also names `om-followup-issue-from-pr` |
| `scheduled-scan` | `om-fix`, `om-approve-merge-pr`, `om-prepare-issue` |

## Suggestions for `validation.commands` (not config)

Read from `package.json`, `.github/workflows/check.yml` and `AGENTS.md`; the owner decides.

CI runs `pnpm install --frozen-lockfile`, `pnpm exec playwright install --with-deps chromium webkit`, then
`pnpm check`. The root `pnpm check` is `test:api && test:app && typecheck && build && test:web &&
test:auth:web && test:household:web`. A gate that mirrors CI would probably be:

```json
"validation": {
  "commands": [
    "pnpm install --frozen-lockfile",
    "pnpm test:api",
    "pnpm test:app",
    "pnpm typecheck",
    "pnpm build"
  ]
}
```

Open choices:

- Add `pnpm test:web`, `pnpm test:auth:web`, `pnpm test:household:web` (Playwright) or just use `pnpm check`.
  They need Playwright browsers (`pnpm exec playwright install chromium webkit`) and are slow, so they may
  fit CI better than the per-fix-round gate.
- There is no `lint` script in this repo. Do not list one until it exists.
- Node `>=24` and `pnpm@10.15.0` are required (`package.json`).
- AGENTS.md requires native-device evidence where needed. Browser results do not replace it, so `needs-qa`
  rules in `SDLC.md` must say how native evidence is attached.

## Deferred items

| Item | Where | Trigger | What to do |
|---|---|---|---|
| Project phase conflict | `issue-to-merge`, `pr-to-merge`, `scheduled-scan` | Before any launch | `AGENTS.md`: current phase is UX/UI design preparation and feature work must not resume without an explicit implementation request; the two readiness gates must be respected. Do not launch the implementing workflows until the owner opens that phase. |
| Spec location | `paths.specs` | Bootstrap | `AGENTS.md` names `docs/family-cookbook-mvp/spec.md` as the approved contract and `docs/family-cookbook-mvp/implementation/plan.md` as the task register (also `docs/family-cookbook-mvp/issues/`, `docs/decisions/`). Decide whether `paths.specs` becomes `docs/family-cookbook-mvp` or a new directory. `idea-to-spec` requires specs to sit directly in that directory and rejects edits outside it. |
| Overlap with the existing task register | `spec-to-backlog`, `issue-to-merge` | Bootstrap | Tasks already live in `implementation/plan.md` and `implementation/tasks/`. Decide whether GitHub issues plus `backlog.md` replace or mirror them before filing any issue. |
| Fail-closed risk list | prompts mentioning "money" | Owner decision | The `risk-high` areas (auth, sessions, data scoping, money, schema migrations, shared contracts) are inherited from the source. Align them with `SDLC.md` once written (billing exists here: see `docs/decisions/0001-polar-only-purchases.md`). |
| UI verifier | `issue-to-merge`, after `ci` is green | UI paths and a Playwright provider exist | Add an `if` on UI globs, then an `om-auto-qa-pr` agent in a fresh context (as `pr-to-merge` does). |
| Deterministic risk routing | `issue-to-merge`, after `labels` | Auth, billing, migration and contract paths are stable | Add `if paths-changed` checks before `humanmerge`; today the `labels` agent emits `standard\|riskhigh`. |
| `budgetUsd` on panel branches | `council` / `panel` branches | A few real runs give cost data | Set budgets from observed cost, not a guess. |
| Test-edit hook | `.claude/settings.json` (PreToolUse) | Owner decides; it is a security setting | Block edits to test files during fix tasks. Needs explicit approval. |
| Panel sees uncommitted changes? | review panels | First dry run | Confirm `review: true` branches see the uncommitted worktree; if not, commit before the panel. |
| Dry run of every workflow | all files | Before first real use | The loader checks the schema only. Run each with `CEZ_DRY_RUN=1` (`npx cezar-run@0.15.2`). |
| Scheduled launch | `housekeeping`, `scheduled-scan`, `maintain-to-intent` | Bootstrap done and CI trusted | Create the Cezar Automation triggers; the workflows do not create them. |
| Local Cezar version | developer machines | Any | Homebrew `cezar` may be 0.11.1, which does not understand `version: 2`. Use `npx cezar-run@0.15.2`. |
