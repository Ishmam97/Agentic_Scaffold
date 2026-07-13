#!/usr/bin/env bash
# SessionStart hook for Codex. AGENTS.md remains the reliable instruction
# surface; this emits a compact orientation for hook-aware clients.

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
INDEX="${ROOT}/.codex/INDEX.md"

routing=""
skills=""
if [ -f "$INDEX" ]; then
  routing="$(awk '/^## When to invoke what/{f=1;print;next} f&&/^## /{exit} f{print}' "$INDEX" 2>/dev/null || true)"
  skills="$(awk '/^## Skills -/{f=1;print;next} f&&/^## /{exit} f{print}' "$INDEX" 2>/dev/null || true)"
fi

cat <<EOF
agentic_swe scaffold active for Codex.
- Operating contract: AGENTS.md
- Full tool map: .codex/INDEX.md
- Workflow bridge skill: .agents/skills/agentic-swe-workflows
- Memory vault at memory/, driven by the obsidian skill

Before assuming this is a cold start, check the vault for context relevant to what the user is about to ask (prior decisions, features, gotchas touching this area) instead of waiting for the user to mention it.

${routing}

${skills}
EOF
