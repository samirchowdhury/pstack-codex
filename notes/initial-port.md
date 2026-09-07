# Initial port validation

Upstream: cursor/plugins 93b00b89ef425a9c1bac0d0b317dfc49c930ac99, pstack subtree. Local adaptation retains all 45 skills and adds update-pstack.

Commands: ./scripts/run build; ./scripts/run check; ./scripts/run test; ./scripts/run install (local destination and final global installation). Check final handoff for final command outcomes.

Independent read-only review exercised architect with a Python JSON-to-CSV CLI design request and explicit checkpoint. The reviewer respected the checkpoint and did not implement. This was instruction simulation, not an end-to-end model orchestration benchmark.

Reviewer findings fixed: binary copying; candidate build separated from installed dist; obsolete link reporting; ownership-consistent rollback instructions. Runtime contract explicitly distinguishes parent-model passes from provider diversity.

Tests cover deterministic builds, upstream/review gates, failed-reference preservation, idempotent installation, collision preflight, dangling foreign links, installed-output isolation, binary resources and obsolete-link reporting.

Limits: no live external-service, UI, cloud-fleet, overnight scheduler, model-provider diversity, merge or messaging exercise. Those require actual host capabilities and task authorization. New skill discovery must be confirmed in a fresh Codex session; the current session's skill catalog is already loaded. The existing Homebrew Node cannot start due to a missing llhttp dylib; the launcher uses VS Code's self-contained Node runtime. GitHub CLI is unavailable; no origin repository has been published.

Next validation: invoke $poteto-mode on a small read-only real project investigation in a fresh Codex conversation, then exercise $update-pstack when upstream changes.

Final integrated verification: build, check, all 11 tests and global install passed. Installed helper permissions are preserved and its actual invocation is tested. All 46 links installed; no robotics project files changed. Sync's upstream clone operation was exercised during source acquisition; the complete future candidate-promotion workflow has not yet been exercised against a newer upstream revision.
