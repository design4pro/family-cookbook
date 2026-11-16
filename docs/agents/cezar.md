# Cezar skill updates

Open Mercato skills are installed locally for Codex and discovered by Cezar.
The running desktop Cezar uses its existing project-only updater. This checkout
is explicitly enrolled through `.agents/skills-updates.json` and the machine-local
project registry. It checks at startup and every six hours while Cezar is running.

Updates run `scripts/agents/sync-skills.mjs --ref <exact-upstream-commit>` in a
staged copy, validate the recorded inventory, and publish with a recovery journal
and backup. Local edits or active skill readers defer publication. Impeccable
is an approved separate tool and is preserved by Open Mercato synchronization.

The machine-local updater implementation currently lives in
`~/.local/lib/codex-project/skills-auto-update.py`; desktop Cezar carries its
runtime copy. On another machine, installing these files alone does not enroll
this checkout. The existing project updater must be installed and enrollment
must be performed there as well.

Manual checks on this machine:

```sh
python3 ~/.local/lib/codex-project/skills-auto-update.py check --repo "$PWD"
```

The native Cezar updater's `skills check` exit-code handling is fixed in the local
Cezar source checkout. The desktop's project-only updater uses its own pinned
commit comparison and does not depend on that CLI check.

<!-- om-skills-version:start -->
Installed Open Mercato commit: `a90b091d27141a6cd12f363e94ebd0f5f84ba615` (74 skills).
<!-- om-skills-version:end -->
