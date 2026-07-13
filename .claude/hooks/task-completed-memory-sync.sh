#!/usr/bin/env bash
# TaskCompleted hook — fires when a tracked task is marked done. Reminds the
# agent to capture anything durable the task produced in the memory/ vault.
# Deliberately narrow (task completion, not every tool call or turn) to avoid
# nagging on trivial tasks. No hard dependency on jq.

set -euo pipefail

message="A tracked task just completed. If it produced a durable decision, a reusable lesson, or a fact about the project (not just routine progress), capture it in the memory/ vault now via the obsidian skill's MCP tools — otherwise skip silently. Most completed tasks don't need a note; only write one when future sessions would benefit from remembering this."

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
    '{hookSpecificOutput: {hookEventName: "TaskCompleted", additionalContext: $ctx}}'
else
  escaped="$(escape_for_json "$message")"
  printf '{"hookSpecificOutput":{"hookEventName":"TaskCompleted","additionalContext":"%s"}}\n' "$escaped"
fi

exit 0
