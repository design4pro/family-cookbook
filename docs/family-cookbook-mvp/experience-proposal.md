# Capture and cooking experience: decision proposal

Status: accepted experience contract. The user accepted the presented flows, choices 1A/2A/3A/4B and synchronization policy A. Canonical resolution: [Choose the capture and cooking experience](issues/03-capture-and-cooking-contract.md). Implementation and device validation have not been performed.

## Proposed common contract

One capture creates one recipe draft. Photo and voice inputs converge on the same review screen. An uploaded source and an AI draft are distinct from a human-approved recipe. The source is not overwritten by corrections. An explicit Save recipe action publishes the reviewed content to the shared cookbook and makes it eligible for assistant retrieval.

Unknown quantities, times and temperatures may remain explicitly unknown after review. Do not require artificial precision, and do not invent missing facts. Unresolved values retain a visible reminder. All fields are editable and reviewable; model-generated warnings do not guarantee that other fields are correct. Missing servings disable automatic scaling; unknown ingredient quantities stay unscaled and visible.

Drafts are shared within the household and distinguishable from approved recipes. Attribution identifies the family cook, whereas review/edit attribution identifies the app member; these are different people in many families. All household members may edit and approve, with edit attribution and revision conflict protection (accepted choice 1A).

## Photo flow

1. Choose camera or existing images, up to five images for one recipe.
2. Preview, remove and reorder pages, then submit explicitly. Do not split multiple recipes automatically or support PDF/bulk notebook import in MVP.
3. After successful upload, processing continues in the background. Show a persistent task and failure/retry path. Upload completion must be clearly distinguished from capture or processing completion.
4. Review images alongside the extracted title, ingredients, servings, steps and attribution. On mobile, switch between source and fields; on desktop, use side-by-side views.
5. Save a reviewed recipe. Preserve images as attached originals. If extraction fails, keep the uploaded images available for retry or manual entry.

A photograph containing several unrelated recipes is outside automatic extraction scope; ask the user to provide a closer photograph or enter the desired recipe manually. Repeated submission of the same pending operation must not duplicate it. Sophisticated visual duplicate detection is not included.

## Dictation flow

1. Explicit Record -> Stop, up to five minutes per recording as a product limit.
2. Listen, discard/re-record or submit. No continuous listening, speaker recognition or conversational interruption handling.
3. Transcribe and structure, then use the same review screen as photographs. Preserve spoken corrections and family wording; do not manufacture missing instructions.
4. Save the reviewed recipe. Keep the recording as a playable family source by default, with an explicit save toggle and later deletion (accepted choice 2A). Do not delete audio while the draft still needs review or processing has failed.

No recording-in-the-background promise. An interrupted recording should be presented as incomplete if a playable segment survives. Text entry remains the fallback. Voice input to assistant questions is optional scope, separate from required recipe dictation, and is deferred in this minimum recommendation. Spoken cooking steps use device playback with visible buttons.

## Cookbook conversation flow

Open Assistant for a question over the whole cookbook, or Ask about this recipe from a recipe detail screen. The selected scope is visible and can be changed. Start with typed questions; do not build a second microphone flow merely because recipe capture has recording.

Retrieve only approved recipes accessible to the current member. Link factual answers to recipe cards and explicitly identify absent information. Clearly labeled general cooking advice and substitutions are allowed when explicitly requested; originals are never changed implicitly (accepted choice 3A). Personal conversation history is not automatically shared with other household members.

For ingredients-to-meals: accept a short, temporary list of available ingredients, suggest up to three matching saved recipes, and show missing ingredients. Do not claim to know pantry quantities. Selecting recipes and servings creates a proposed shopping addition; only an explicit confirmation changes the shared list. Ingredient arithmetic is deterministic.

No match means explain that the book lacks a match, with a path to browse or add a recipe. Do not silently invent a family recipe. No calendar or automatic weekly meal plan in MVP.

## Shopping flow

One active shared list, with generated ingredients and manually entered items. Before adding a recipe, choose portions and exclude ingredients already available. Preserve original wording and recipe provenance. Merge only known compatible ingredient/unit combinations; leave unknown quantities and incompatible units separate.

Treat each confirmed addition as a snapshot. Later recipe edits do not silently change an existing shopping list. Changing already-added portions is deferred: remove that recipe's contribution and add it again with the new serving count. Replaying one confirmation does not duplicate items; a deliberate new addition represents another cooking occasion and requires clear intent.

Members can add items, change quantities and check purchased items. Clear checked items through an explicit action. Refresh on screen focus and periodically while open; show unsynchronized states rather than pretending the list is instantly consistent. Checking and unchecking cached items must work offline (accepted choice 4B). Offline item creation, quantity edits and deletion remain out of scope.

## Opening round: historical alternatives

| Question | Recommendation A | Alternative B |
| --- | --- | --- |
| Who may approve and edit shared recipes? | Every household member, with last-editor attribution and revision conflict protection | All may contribute drafts, but only the owner approves and edits shared recipes |
| What happens to a recipe recording after approval? | Keep it as a playable original by default; clear save toggle and later deletion | Keep only the text by default; delete audio after approval unless the user opts to retain it |
| How broad is the assistant's help? | Answer from the cookbook; permit clearly labeled general tips/substitutions when explicitly requested, without changing originals | Only answer from the cookbook; decline advice absent from saved recipes |
| What works offline in shopping? | Read the cached list; modifications require a connection | Also allow checking/unchecking cached items and reconcile after reconnection; no offline item creation or quantity edits |

## Accepted opening-round choices

The user accepted the presented flows and chose A for shared editing, A for retaining recordings, A for explicitly requested general advice, and B for offline check/uncheck. The earlier read-only offline recommendation was rejected and is superseded. Offline conflict policy A was subsequently accepted: server-accepted changes prevail over conflicting stale offline operations.

## Offline shopping synchronization proposal

Accepted as policy A; the heading is retained for existing links.

### User-facing contract

Checking or unchecking a cached item changes its local display immediately. Persist the pending desired state on the device before reporting success. Show a small pending indicator and a list-level status such as “3 changes waiting to sync.” Closing and reopening the native app must not lose pending changes.

Retry synchronization when the application is active and connectivity returns, on list focus, or through a manual retry. Do not promise synchronization while the app is closed. The browser can check cached items while the loaded app is offline and persist pending changes; first-time loading and offline cold-start of the website are not part of this proposal. Native launches can reopen the cached list. Storage failure must be shown rather than claiming a change is saved.

Only check/uncheck is available offline. Adding, deleting, changing amounts, clearing purchased items and changing recipes require connectivity. These online mutations still participate in item revision checks.

### Minimal conflict policy

1. Each item has an immutable ID and a server revision. Queue an explicit desired state, not a toggle: for example, checked=true against revision 7. Do not use device timestamps to decide winners.
2. The server applies the change atomically only if the item still has the submitted revision, then increments that revision. Every accepted change to the item, including its quantity or ingredient identity, advances its revision.
3. If another accepted change has advanced the revision, keep the current server item. Drop the rejected stale pending state, refresh the item and display a non-blocking summary. Do not silently rebase and reapply the old command.
4. If the item was deleted or belongs to an old/replaced list, do not recreate it. Discard its pending state and show that it was removed from the shared list. Stable IDs are never reused.
5. Different item IDs synchronize independently. A conflict on milk must not prevent checking bread.
6. The user may act again on the refreshed item. That is a new operation based on the newly observed revision; it is not an automatic retry of the stale intent.

This policy prefers changes already accepted by the server over an older offline intention. It does not claim to identify the last human action in wall-clock time. The first valid concurrent server update wins against a particular revision. There is no modal conflict resolver in MVP.

### Retry and local-order requirements

Give each submitted operation a stable ID; repeating it must return its recorded outcome without applying it again. Check operation identity before testing revisions. Persist the server mutation and its operation outcome atomically, so a lost response does not turn an already-successful update into a false conflict.

Serialize submissions per item. Unsent local clicks can be collapsed to their latest desired state. Never discard or change an operation after sending it while its outcome is unknown. Keep any later local intent separately until acknowledgment; if the earlier operation succeeds, submit the newer intent against its returned revision. If it conflicts, do not automatically rebase newer local intent either: show the refreshed item and require a fresh action. Include a monotonically increasing local intent sequence so an older response cannot clear a newer pending change.

When refreshing a list, preserve the local overlay for pending operations until they receive a terminal result. Do not replace pending device state merely because a fetched snapshot differs. Re-check membership on every synchronization request; losing access stops upload and hides household data rather than looping retries forever.

### Concrete cases

| Situation | Accepted result |
| --- | --- |
| One person checks milk offline; nobody else changes milk | Mark milk checked when that device reconnects |
| Two people check the same milk item from the same revision | First operation applies; the other refreshes to the same checked state without a distracting status-only conflict warning |
| Another member checks and later unchecks milk while the first device is offline | Reject the stale offline check; show milk as unchecked with a short update notice |
| Another member changes milk from 1 L to 2 L | Reject the old check; show the current quantity and ask the user to inspect the updated item through a non-blocking notice |
| Another member deletes milk, or clears a checked milk item | Do not resurrect milk when the offline operation arrives |
| User checks, unchecks and checks again before any send | Send only the final checked state with the original observed revision |
| Server applies a check but the response is lost | Retry the same operation ID and receive the original outcome, without another mutation |
| One device changes bread and another changes milk | Both apply independently |

If a stale operation has the same resulting checked state and unchanged shopping content, refresh quietly; a changed quantity or ingredient still deserves a notice. Do not bypass revision checks just because the booleans happen to match.

### Acceptance evidence required during implementation

Test duplicate delivery after a lost acknowledgment; persisted pending state after restart; rapid local clicks while a request is in flight; conflicting checked states; quantity changes; deletion and list replacement; unrelated-item independence; membership removal; local storage failure; and refreshes that arrive before acknowledgment. These are release requirements, not tests already executed.

## Resolution

Policy A accepted. No manual conflict chooser in MVP. The decision is closed; payment expiry interactions are handled in the separate payment/continuity contract.
