# T07 authenticated-session proof

This is an isolated architecture harness, not a deployable authentication service or a production app. Keep `src/proofs/t07-worker.ts`, its mailbox/control endpoints and the native `proof-auth` route out of production. The default Worker does not expose them. Never deploy `wrangler.t07-proof.jsonc`.

## Local checks

```sh
pnpm install --frozen-lockfile
pnpm test:api tests/auth/session-boundaries.test.ts
pnpm test:auth:web
pnpm check
```

The web suite uses Chromium and WebKit with persistent profiles, a local D1 database and in-memory synthetic mail. Traces, video and screenshots are disabled for OTP entry. It checks process restart, HttpOnly cookies, logout with a copied stale cookie, recoverable incorrect-code UI and origin rejection.

`pnpm serve:auth-proof` exports web assets, applies migrations to the local-only D1 binding and listens on `127.0.0.1:8789`. Do not run resetting web tests concurrently with native proof steps.

## Actual test mail

The developer approved `kontakt@design4.pro` and supplied access to the existing verified `staging.planned.travel` sender. No other real recipient is permitted. `planned.travel` is an access source, not the cookbook's brand or production domain.

```sh
T07_EMAIL_ENV_FILE=/Users/rafalwolak/dev/cloudflare/planned.travel/.dev.vars pnpm serve:auth-proof
# In another terminal:
T07_EMAIL_ENV_FILE=/Users/rafalwolak/dev/cloudflare/planned.travel/.dev.vars node apps/api/scripts/t07-email-proof.mjs
```

The runner reads only `EMAIL_API_KEY` (or `RESEND_API_KEY`) from that explicitly selected file, writes Wrangler's secret environment into a private temporary directory with mode 0600 and removes it when the child exits. Never print the environment, copy the key into the repository, or pass it through command arguments. Each server start generates a new proof-only signing secret; client restart tests keep the same running server. A deployed service requires a stable managed secret.

The adapter sends actual mail through Resend, then retains the same code in memory for automated entry. This proves provider acceptance/delivery and code verification; it does not claim manual inbox reading or native OS OTP autofill. Reports contain provider IDs and delivery status, never the code or cookie. Existing/new/unallowlisted recipients receive the same public send response; only approved addresses invoke the mail adapter. Synthetic `.test` addresses stay inside the harness.

## Native release builds

Use the existing temporary T03 application ID and scheme; neither is a final store identity. Prebuild and install pods after changing native dependencies. Use an embedded Release bundle, not Expo Go or a Metro-dependent launch.

On this host:

```sh
cd apps/app
PATH='/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin' xcodebuild \
  -workspace ios/CookbookT03Proof.xcworkspace -scheme CookbookT03Proof \
  -configuration Release -sdk iphonesimulator \
  -destination 'id=0BCA0106-2995-478E-A7E0-0625DD00734B' \
  -derivedDataPath .expo/native-build ONLY_ACTIVE_ARCH=YES \
  CODE_SIGNING_ALLOWED=YES CODE_SIGN_IDENTITY=- build
cd android
PATH='/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin' \
  JAVA_HOME='/Applications/Android Studio.app/Contents/jbr/Contents/Home' \
  ANDROID_HOME='/Users/rafalwolak/Library/Android/sdk' \
  ./gradlew --no-daemon :app:assembleRelease
```

Keep standard simulator signing enabled: disabling signing removes the simulated application identifier and SecureStore fails with Keychain error -34018. This is a build issue, not a reason to replace Keychain with plain storage. Android's local proof enables cleartext traffic for `10.0.2.2:8789`; replace this with HTTPS and remove that exception before production. iOS uses loopback `127.0.0.1:8789`. No TLS validation is disabled.

Install the resulting `.app`/APK on the named simulator/emulator. Open `cookbook-t03-proof://proof-auth?run=signin`; optional `email=kontakt%40design4.pro` exercises actual mail. A code is consumed through the same Better Auth native client used by the sign-in screen. The default platform-specific `.test` address avoids sending more mail.

For each platform, run the following serially and check `/__proof/audit` using header `x-t07-proof: local-harness`:

1. `signin`: private request returns 200.
2. Kill the app process (`SIGKILL` on the observed iOS app PID, `adb shell am force-stop` on Android). Open the `restore` phase; it only reads SecureStore and requests protected data, without sending/verifying another code. Expect 200.
3. `logout`: expect 200 before sign-out and 401 after it.
4. `signin`, then `revoke`: populate the real native session cache, revoke D1 sessions through the isolated control endpoint and expect 401 with the still-cached client cookie.

`revoke` affects all sessions in this isolated database, so finish one platform's sequence before revoking the other. Save audit JSON and screenshots of results only. Stop the local server and the emulator created for the proof after collecting evidence. Physical device acceptance remains tracked separately in T03/T43.

## Contract for downstream tasks

- Better Auth owns `user`, `account`, `session`, `verification` and `rateLimit` tables from `0003-auth-session-proof.sql`. Do not invent parallel user/session identities.
- Every protected operation resolves the canonical D1 session. Native cached session data is presentation only. Cookies cannot authorize requests after session expiry, sign-out, user deletion or server revocation.
- T10 adds household membership authorization on top of session verification; T08 binds provider identity to the authenticated user, not an email supplied in the request.
- T24 captures identity/credentials with each outbox generation and handles 401 by stopping replay. Secure persistence does not authorize another household or user.
- T35 must delete/revoke authentication sessions during account deletion. The FK and rejection behavior are tested here; the full deletion workflow remains T34/T35.
- T39 supplies production-safe diagnostics and delivery failure monitoring; keep OTP, cookie and session token values out of logs and traces. T42/T43 own full journey, physical-device, accessibility and production-origin verification.
