#!/usr/bin/env bash
# PreCompact hook — fires just before context is summarized/discarded. This is
# the "periodically over a long session" checkpoint: a reminder to push any
# durable decision, learning, or fact out of context and into the vault
# (memory/) before compaction throws the detail away. No hard dependency on jq.

set -euo pipefail

message="Context is about to be compacted. Before it is: if this session surfaced a durable decision, a lesson (bug root cause, gotcha, prior-art finding), or a fact about the project worth keeping past this conversation, write or update the corresponding note in the memory/ vault now via the obsidian skill's MCP tools (mcp__obsidian__write_note / mcp__obsidian__patch_note). Skip this if nothing durable happened yet — don't manufacture a note for its own sake."

escape_for_json() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\r'/\\r}"
  s="${s//$'\t'/\\t}"
  printf '%s' "$s"
}

if command -v jq >/dev/null 2>&1; then
  jq -cn --arg ctx "$message" \
    '{hookSpecificOutput: {hookEventName: "PreCompact", additionalContext: $ctx}}'
else
  escaped="$(escape_for_json "$message")"
  printf '{"hookSpecificOutput":{"hookEventName":"PreCompact","additionalContext":"%s"}}\n' "$escaped"
fi

exit 0
