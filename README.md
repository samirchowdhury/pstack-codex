# pstack-codex

A personal, agent-maintained Codex adaptation of [pstack](https://github.com/cursor/plugins/tree/main/pstack), by Lauren Tan / Cursor. MIT licensed; upstream attribution is retained.

This is an adaptation repository, not a fork of the entire Cursor plugin marketplace. `upstream/pstack` is a byte-for-byte pinned snapshot. `codex/` contains the runtime contract and native replacements; `scripts/pstack.mjs` makes deterministic mechanical translations. `dist/` is generated and ignored by Git.

## Use

Install with `./scripts/run build` then `./scripts/run test` and `./scripts/run install`. This creates individual symlinks under `~/.codex/skills` (override with `PSTACK_SKILLS_DIR`). The current local Codex host loads this user directory across projects. Hosts using the newer `~/.agents/skills` discovery path can install there instead; avoid installing duplicate names in both roots for a host scanning both.

Invoke `$poteto-mode`, `$architect`, `$how`, `$interrogate`, or any other bundled skill. Use `$update-pstack` for maintenance. Skill-picker presentation depends on the host; this does not register new literal slash commands. Restart Codex or start a new conversation if new skills do not appear. These are local skills; remote machines need their own installation.

All 45 upstream skills retain their names. The upstream reference/playbook corpus is preserved and translated mechanically. Native replacements exist for setup-pstack, recall, and no-comments. Every skill receives a Codex runtime contract that takes precedence over inherited host details. Skills are explicit-only as requested; a selected workflow can still read and invoke its dependencies.

## Intentional differences

- Codex collaboration APIs replace Cursor delegation. Role labels describe prompts rather than registered agent types. Tool schemas and concurrency limits are authoritative.
- All model defaults inherit the parent; four independent passes do not imply four providers. Optional verified role overrides live in `~/.codex/pstack-models.md`.
- Setup configures Codex role preferences, not Cursor rules. Recall discovers available history rather than assuming Cursor's session schema.
- Comment review preserves unresolved constraints instead of deleting ambiguous comments. Legal notices and public contracts remain protected.
- Interrogate prefers authenticated `gh` for GitHub PR context, with a connector fallback. Reviewers receive the same recorded commits, diff, checks, and relevant discussion.
- Missing control tools, integrations, and model families are reported. Built-in skill creation maps to skill-creator; deslop maps to scoped diff cleanup.
- Upstream Git and automation instructions cannot override the current user's scope or repository rules. This package creates no schedule, enables no external provider, and authorizes no merging or messaging.

## Update

`./scripts/run sync [ref]` downloads upstream into `.candidate`. It leaves the installed version intact. Review the diff, update adaptations, promote the candidate, then record approval in `codex/reviewed.json`. The build requires both the pin and review digest to match. Follow `$update-pstack` for the full procedure.

Run `./scripts/run build`, `./scripts/run check`, and `./scripts/run test`. Checks cover skill coverage, metadata, explicit invocation, unsupported runtime tokens, local Markdown links, repeatable builds, review gating, and installation collisions. They do not establish model behavior or external service compatibility.

The build validates a temporary tree and writes candidate-dist; the installed dist remains untouched. Run checks and tests before install promotes candidate-dist to dist. Individual skill links follow the promoted output. Commit each reviewed version for recovery. Keep experiments in a separate worktree so a failed behavioral experiment cannot replace installed output.

## Layout

- `upstream.lock.json`: origin, exact commit and snapshot digest
- `upstream/pstack/`: original source, license, docs and assets
- `codex/`: maintained runtime contract, replacements and update skill
- `scripts/`: build, check, staged sync and global installer
- `notes/`: validation records and limitations
- `dist/`: generated output (never hand-edit)

A Git remote named upstream points to cursor/plugins for discovery. Do not merge its root into this repository; use staged sync to import only pstack. Add an origin remote when publishing this adaptation repository.

The scripts/run launcher uses a working Node on PATH, or VS Code’s bundled Node runtime in ELECTRON_RUN_AS_NODE mode. This avoids changing Homebrew packages on this machine.
