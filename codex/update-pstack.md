---
name: update-pstack
description: Update the local pstack-codex adaptation from Cursor upstream, review compatibility changes, validate, and refresh globally installed skills. Use when asked to update or maintain pstack.
---

# Update pstack for Codex

Resolve this skill's real path through its symlink; the adaptation repository is three directories above its containing directory (dist/skills/update-pstack). Read the repository AGENTS.md and README.md before changing anything. Do not work in the user's current unrelated project.

1. Inspect Git status. Preserve existing work; stop before overlapping changes. Record the current repository commit and upstream.lock.json revision.
2. Run `./scripts/run sync` from the adaptation repository. It stages .candidate only. Use an explicit upstream ref if requested. Network permission may be required.
3. Run `git diff --no-index upstream/pstack .candidate/pstack`; exit 1 means differences. Review every changed file, including added/removed skills, reference links, model/tool calls, scripts, and licenses. Read the Codex runtime contract and adaptations. Do not merely refresh hashes to silence a failure.
4. Adapt codex/runtime.md, codex/overrides.json and transform rules as necessary. Preserve the upstream engineering workflows and reference/playbook corpus; document intentional semantic differences. New native dependencies must be available or have an explicit fallback. Keep explicit invocation policy.
5. Once reviewed, replace upstream/pstack with the candidate snapshot and upstream.lock.json with its candidate counterpart. Update codex/reviewed.json with the matching commit, treeSha256, and a substantive review note. The upstream directory must remain byte-identical to that revision. Remove .candidate only after successful promotion and verification.
6. Run `./scripts/run build`, `./scripts/run check`, and `./scripts/run test`. Perform read-only behavioral exercises for any affected workflows; record limitations when an integration cannot be exercised. A static pass is not proof of workflow quality.
7. Run `./scripts/run install` after the checks pass. Install promotes candidate-dist to dist; existing skill links then point to the validated output. Confirm the links resolve, report removed-skill links if any, and never remove unrelated skills.
8. Inspect the final diff, commit the reviewed update when the work is isolated, and report old/new upstream revisions, semantic changes, checks, and remaining limitations. Push only if publishing has been authorized. Do not enable an unattended schedule unless requested.

If review or checks fail, preserve the last working dist and installation. Build in an isolated worktree when experimenting with changes that could affect the installed output. Roll back with a new revert commit in the same adaptation repository, preserving unrelated work, then build, check, test and install. The installer intentionally refuses links owned by a different checkout.
