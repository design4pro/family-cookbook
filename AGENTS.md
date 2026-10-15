# Project instructions

## Communication and artifacts

- Communicate with the developer in Polish, including progress, questions and final reports. In Polish prose use a hyphen, not an em dash.
- Write code, code comments, filenames, file contents, documentation, drafts, commit messages, branch names, pull request titles and all GitHub content in English. Preserve identifiers, technical terms and quoted output.
- Family Cookbook is a working name. Do not introduce final branding, domains or store identifiers without a project decision.

## Scope and source of truth

- The approved product contract is `docs/family-cookbook-mvp/spec.md`.
- Execute `docs/family-cookbook-mvp/implementation/plan.md` using its task dependencies and acceptance criteria. Preserve the resolved Wayfinder decisions.
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
