#!/usr/bin/env bash
# PreCompact hook for Codex — mirrors .claude/hooks/pre-compact-memory-sync.sh.
# Fires before context is summarized; reminds the agent to push durable
# decisions/learnings into the memory/ vault before that detail is discarded.

set -euo pipefail

cat <<EOF
Context is about to be compacted. Before it is: if this session surfaced a durable decision, a lesson (bug root cause, gotcha, prior-art finding), or a fact about the project worth keeping past this conversation, write or update the corresponding note in the memory/ vault now via the obsidian skill. Skip this if nothing durable happened yet.
EOF
