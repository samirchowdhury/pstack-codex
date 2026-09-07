# Maintaining pstack-codex

This repository is a Codex adaptation of cursor/plugins/pstack, not a React library. Read README.md, upstream.lock.json, codex/runtime.md, and codex/reviewed.json before editing.

- Keep upstream/pstack byte-identical to its pinned upstream commit. Adapt in codex/ and scripts/; dist and candidate-dist are generated.
- Updates stage in .candidate. Review changed upstream files before approving their digest. Do not refresh hashes merely to make a build pass.
- Preserve complete workflows, principles, playbooks, references and upstream attribution. Record intentional semantic deviations.
- Use Node built-ins; no package installation is needed. Run build, check, and ./scripts/run test after changes.
- Global skills are explicit-only, installed via individual symlinks. Never overwrite existing unrelated skills or write project files during installation.
- Parent-model inheritance is the default. Independent same-model reviews are not cross-provider reviews. Never invent tool names or model availability.
- Test an affected skill on a realistic bounded request. An independent read-only subagent exercise is appropriate for orchestration changes when tools are available. Do not run publishing, merges, message sends, or unattended schedules as tests.
- Preserve user edits. Use an isolated branch/worktree for competing writers. Do not reset, stash, clean, rebase, or overwrite other work.
- Record validation in notes/ with a unique filename; no private session records or credentials. Commit coherent updates. Publishing requires the user's authorization.
