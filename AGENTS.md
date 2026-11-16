# Project instructions

## Communication and artifacts

- Communicate with the developer in Polish, including progress, questions and final reports. In Polish prose use a hyphen, not an em dash.
- Write code, code comments, filenames, file contents, documentation, drafts, commit messages, branch names, pull request titles and all GitHub content in English. Preserve identifiers, technical terms and quoted output.
- Family Cookbook is a working name. Do not introduce final branding, domains or store identifiers without a project decision.

## Isolated Codex in Cezar

`.ai/cezar/config.json` selects Codex and the `develop` base branch. On the
configured host, `CEZ_CODEX_BIN=~/.local/bin/codex-project` and
`CEZ_DESKTOP_NODE=~/.local/bin/cezar-project-node` select the installed isolation
wrappers. Each Git repository has a separate HOME and CODEX_HOME; its worktrees
share that profile. The main Codex profile and credentials are not imported.

The local skill collection is versioned under `.agents/skills/`, with provenance
in `skills-lock.json`, so fresh worktrees receive it. Only checkout-local skills
are discovered; global skills, plugins, memories and escaping links are excluded.
Run `~/.local/bin/codex-project login --device-auth` from the checkout once, then
start a new Codex task. Old conversations keep their prior context, and old
worktrees with external skill links are rejected. Cloning the repository does not
install the host wrappers or enroll it in automatic skill updates.

## Scope and source of truth

- The approved product contract is `docs/family-cookbook-mvp/spec.md`.
- When implementation is explicitly in scope, execute `docs/family-cookbook-mvp/implementation/plan.md` using its task dependencies and acceptance criteria. Preserve the resolved Wayfinder decisions.
- Current phase: UX/UI design preparation after specification and task breakdown. Preserve existing implementation and evidence, but do not resume feature development from the task register without an explicit implementation request. Planning approval and design approval do not start implementation.
- Do not treat planning approval as permission to provision production, charge customers, publish a store build or start a pilot. Respect the two readiness gates.
- State assumptions and tradeoffs. If a material ambiguity prevents correct implementation, name it and ask; do not silently invent behavior.

## Engineering principles

- Follow DRY, KISS and SOLID. Favor clean code, maintainability, performance, scalability, responsive design and WCAG 2.2 accessibility.
- Implement the minimum code required by the task. Avoid speculative features, abstractions, configuration and impossible-scenario error handling.
- Keep changes surgical: match existing style, avoid unrelated cleanup and remove only dead code introduced by your own changes. Report unrelated issues without modifying them.
- Explain architectural choices and viable alternatives. Comment complex logic where the reason would otherwise be unclear.
- Use meaningful unit and integration tests; use Playwright for web end-to-end behavior and actual native-device evidence where required. Do not substitute browser results for native behavior.

## Execution and evidence

- For multi-step work, state a short plan with verification for each step.
- Convert requirements into observable acceptance criteria before implementation. Establish a failing test or explicit evidence gap, implement the smallest change, then verify it.
- Run focused tests and affected build/type checks; broader verification follows meaningful shared changes or unresolved failures.
- Record evidence and limitations. Never claim a task or gate passed without its required results.
- When a mistake exposes a reusable process gap, document the lesson and update the relevant local guidance to prevent repetition.

## Git safety

- When a push is explicitly authorized, always use an explicit destination refspec: `git push origin HEAD:refs/heads/<branch>`.
- Never use the ambiguous shorthand `git push -u origin <branch>`.
- Inspect upstream tracking when creating branches/worktrees; a new branch can inherit the base branch's upstream.
- Read the push response. If it reports bypassed branch-rule violations, stop and report the incident.
- Creating this local repository does not authorize creating a hosted repository or pushing it.

## Project skills and tools

- Keep all Open Mercato skills installed for Codex in `.agents/skills`, with provenance in `skills-lock.json` and the exact upstream inventory in `scripts/agents/skills-upstream.json`.
- Keep `open-mercato/skills` on `main` as the only Cezar team skills source in `.ai/cezar/config.json`. Local installed skills take precedence over its remote cache.
- This checkout is enrolled in the desktop Cezar project-only updater with `.agents/skills-updates.json`. It checks at startup and every six hours while Cezar is running; local edits or active readers defer publication. Follow `docs/agents/cezar.md` for the machine-local enrollment requirement and checks.
- Let the updater run `scripts/agents/sync-skills.mjs --ref <exact-upstream-commit>` in its staged copy. Do not replace tracked skill files or installation metadata manually: the updater preserves local edits and will defer when its recorded inventory differs.
- Impeccable is the explicitly approved exception to the Open Mercato-only rule. It is installed for Codex in `.agents/skills/impeccable`, including its bundled engine and `.codex/hooks.json`. Update it with `npx --yes impeccable update --scope=project --yes`; Open Mercato updates preserve it.
- Do not recreate `.claude` or `CLAUDE.md`. Global agent skills are managed separately.
