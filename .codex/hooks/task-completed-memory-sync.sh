#!/usr/bin/env bash
# TaskCompleted hook for Codex — mirrors .claude/hooks/task-completed-memory-sync.sh.
# Fires when a tracked task is marked done; reminds the agent to capture
# anything durable it produced in the memory/ vault. Narrow on purpose.

set -euo pipefail

cat <<EOF
A tracked task just completed. If it produced a durable decision, a reusable lesson, or a fact about the project (not just routine progress), capture it in the memory/ vault now via the obsidian skill — otherwise skip silently. Most completed tasks don't need a note.
EOF
