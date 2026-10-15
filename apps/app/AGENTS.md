# Native application rules

- Follow root instructions and the approved task dependencies.
- `pending-state.ts` owns shared state transitions; `pending-store.ts` adapts SQL and `pending.native.ts` opens Expo SQLite. `pending.web.ts` adapts IndexedDB. Never give the shared module the same basename as a `.native.ts` adapter: Metro would resolve the adapter's import back to itself.
- A check is saved only after the storage transaction commits (SQLite commit or IndexedDB `complete`). Keep in-flight commands immutable, persist later intent separately and fence every dispatch/acknowledgment with the captured identity generation.
- Transports must use credentials bound to the captured identity. Server-side membership checks remain mandatory; aborting a client request cannot undo an already accepted server mutation.
- The proof route and `pro.design4.cookbook.t03proof` identifiers are temporary. Remove the route when the production list is connected. Do not adopt these as final branding or store identifiers.
- Desktop SQLite tests and native simulator results do not close the physical-device acceptance gate. Expo Go and a Metro-dependent offline launch are insufficient evidence.
- Use an embedded JavaScript bundle for force-close/offline relaunch tests. Native build tools launched from a subdirectory may need an explicit Node.js PATH; record the environment instead of changing global shell settings.
- Expo SDK 57 builds targeting iOS 27 require the official `expo-build-properties` `ios.enableSceneSupport` option. Verify native launch after compilation; the default template can compile and then terminate before JavaScript.
- iOS simulator authentication builds must retain normal ad hoc signing and application-identifier entitlements. `CODE_SIGNING_ALLOWED=NO` can launch successfully but makes SecureStore fail with Keychain error -34018; do not replace secure storage to work around a build-signing error.
- Keep unavailable-item tombstones until the corresponding cache is discarded. Deleting only the outbox row lets an old cached item be checked again.
- Keep platform-specific proof screens outside `app/`, with a thin route importing their shared basename. Expo Router enumerates base route modules during web export; a native-only import in a base route can pull Expo SQLite/WASM into the web bundle even when a `.web.tsx` route exists. Verify all platform exports after changing this boundary.

- Invitation links use URL fragments. On web, read the current location and subscribe to `hashchange`; React Native Web `Linking.getInitialURL()` is only a startup snapshot. Preserve the fragment through sign-in and test both fresh navigation and an already-open route.

- Browser helpers for repeated asynchronous actions must wait for a new result (for example a changed invitation link), not just a success message that may remain from the preceding action.
