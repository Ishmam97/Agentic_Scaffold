#!/usr/bin/env bash
# SessionStart hook — inject a compact orientation to the agentic_swe scaffold
# so every session starts knowing the toolkit exists and where the map is.
# Sourced from .claude/INDEX.md (single source of truth). No hard dependency on jq.

set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-.}"
INDEX="${ROOT}/.claude/INDEX.md"

# Pull the quick-routing table and the skills table from the index: from each
# heading to the next H2. Keeps the full skill index in context every session
# instead of relying on the model to open .claude/INDEX.md itself.
routing=""
skills=""
if [ -f "$INDEX" ]; then
  routing="$(awk '/^## When to invoke what/{f=1;print;next} f&&/^## /{exit} f{print}' "$INDEX" 2>/dev/null || true)"
  skills="$(awk '/^## Skills —/{f=1;print;next} f&&/^## /{exit} f{print}' "$INDEX" 2>/dev/null || true)"
fi

message="agentic_swe scaffold active. Operating contract: CLAUDE.md (read its § Project context for project facts). Full tool map: .claude/INDEX.md. Memory vault at memory/, driven by the obsidian skill.

Before assuming this is a cold start, check the vault for context relevant to what the user is about to ask — run mcp__obsidian__search_notes (or read Home.md / the relevant MOC) for prior decisions, features, or gotchas touching this area. Don't wait for the user to mention the vault explicitly.

${routing}

${skills}"

# Escape a string for embedding in JSON without requiring jq.
# Each ${s//old/new} is one C-level pass — fast and dependency-free.
escape_for_json() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\r'/\\r}"
  s="${s//$'\t'/\\t}"
  printf '%s' "$s"
}

# Prefer jq when present (guaranteed-valid JSON); fall back to the bash escaper.
if command -v jq >/dev/null 2>&1; then
  jq -cn --arg ctx "$message" \
    '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $ctx}}'
else
  escaped="$(escape_for_json "$message")"
  # printf (not heredoc) avoids a bash 5.3+ heredoc hang.
  printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$escaped"
fi

exit 0
