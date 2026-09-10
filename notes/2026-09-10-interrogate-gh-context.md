# Interrogate GitHub context update

The update prefers authenticated `gh` for GitHub PR context and retains a connector fallback. Every reviewer receives the same recorded commits, diff, checks, and relevant discussion. Local-only review still works when GitHub context is unavailable.

The change adds a reference from `codex/` to the generated `interrogate` skill. The upstream workflow and its review references remain intact. The upstream pin remains `93b00b89ef425a9c1bac0d0b317dfc49c930ac99`, with digest `09e9dd92777bbcedff5758e9c69f0db935e95eed00371137c6bce91c2b1240eb`. The adaptation started from commit `8cb405f`.

## Validation

The following checks passed in an isolated worktree:

- `./scripts/run build`
- `./scripts/run check`
- `./scripts/run test`, with all 12 tests passing
- Installation into a temporary skill directory through `PSTACK_SKILLS_DIR`, including resolution of the new reference
- `git diff --check`

An independent read-only reviewer exercised three scenarios: a moving PR with a non-main base and user edits, partial connector access, and local-only fallback. The reviewer found ambiguous routing in the local-only case. The final reference explicitly skips GitHub retrieval in that case and identifies the local revision.

This exercise used the parent model. It was an independent pass, not cross-provider validation. Missing authentication and connector failures were simulated. A live `gh pr list` request succeeded against the adaptation repository and returned no existing PRs.

The writing pass applied `unslop` and `technical-writing`. No private PR contents or credentials were stored in this repository. The installed global skills were not promoted from the review worktree.
