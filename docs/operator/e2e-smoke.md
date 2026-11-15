# e2e smoke checks

The deterministic Chromium smoke suite complements the existing Playwright
checks. It verifies email OTP sign-in with a session surviving navigation,
and household creation with the creator assigned administrator and payer roles.
It uses the existing local T07 proof harness, synthetic email accounts, and
the local mailbox. No model calls, provider keys, external email, or deployed
environment are required. The optional ChatGPT agent configuration is retained
for local agent work; these smoke tests never request that fixture.

## Run locally

Use the repository's pnpm version and a supported Node version (Node 24.8+
on the Node 24 line).

```sh
pnpm install --frozen-lockfile
pnpm exec e2e-web install chromium --with-deps
pnpm typecheck:e2e
pnpm test:e2e
```

The runner builds the Expo web export, applies local D1 migrations, starts
`pnpm serve:auth-proof`, waits for `http://127.0.0.1:8789/sign-in`, and stops
the process at the end. Port 8789 must be free. Do not run this suite alongside
the authentication or household Playwright suites: they share the harness
port and local D1 state. Tests run with one worker because each test resets
that state. Retries are disabled so a smoke regression remains visible.

`pnpm typecheck` includes `typecheck:e2e`. The dedicated TypeScript config
covers `e2e.config.ts`, both smoke tests and their helper, using ESM bundler
resolution to match the e2e loader. Existing Playwright configuration and test
selection remain unchanged.

## GitHub Actions

The independent `e2e-smoke` job in `.github/workflows/check.yml` runs on the
existing push and pull request triggers. It installs dependencies from the
lockfile and Chromium through the e2e engine, typechecks the suite, and runs
`pnpm test:e2e`. It uses read-only repository permissions and no secrets.

After success or failure, unless cancelled, the job publishes the Markdown
summary and uploads `e2e-smoke-results` for seven days:

- `.e2e/report.json`, `.e2e/junit.xml`, and `.e2e/summary.md`;
- `.e2e/results/`, including failure traces, screenshots and video;
- `.e2e/logs/`, including harness startup output.

Hidden-file upload is enabled for these explicit paths. Session and replay
cache directories are excluded. A failed test or failed harness startup keeps
the job failed; report publication does not suppress the runner's exit code.

## Verification and limits

The initial local verification on 2026-11-15 passed both smoke tests with
`CI=1`. Temporarily replacing the authentication assertion with an impossible
expected status produced exit code 1, JSON and JUnit reports, a trace page,
a screenshot and a WebM video. The assertion was restored afterward.
The final smoke rerun passed both tests. The full `pnpm check` also passed:
123 API tests, 13 app tests, workspace and test typechecks, build checks,
and all 32 existing Playwright cases across Chromium and WebKit. The workflow
YAML parsed successfully. These runs used local macOS with Node 26.13.0;
the configured GitHub job uses Ubuntu and Node 24.

These checks cover the local proof harness, not production, native devices,
real email delivery or either readiness gate. GitHub-hosted execution requires
the changes to be pushed and the workflow to run; local verification alone
does not prove a passing GitHub run.
