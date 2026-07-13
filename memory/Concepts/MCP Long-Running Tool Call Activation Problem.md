---
type: concept
status: active
created: '2026-06-26'
updated: '2026-06-26'
tags:
  - concept
  - mcp
  - feasibility-risk
  - open-question
related:
  - '[[Cross-Agent Collaboration MCP]]'
  - '[[Cross-Agent MCP - Multi-Agent Review Consensus]]'
  - '[[Parallel Coding-Agent Orchestration Landscape]]'
---
# MCP Long-Running Tool Call Activation Problem

The riskiest assumption in [[Cross-Agent Collaboration MCP]]: its **blocking long-poll activation** (`wait_for_my_next_task()` — agent parks on a held-open MCP tool call until work exists) is **contradicted by current MCP-client behavior**. Surfaced during the brief's feasibility research (2026-06-26). #open-question

## Why it's a problem

Real MCP clients enforce hard tool-call timeouts a held-open call will hit:

- **Cursor** times out `tools/call` at ~60s, no config.
- **Claude Code** times out long-running MCP calls *even when the server sends progress notifications* — it doesn't pass `progressToken` / `resetTimeoutOnProgress`, so server keepalive can't reset the idle timer. Filed as Claude Code issue **#58687** and **closed as "not planned," no client-side workaround.** `MCP_TOOL_TIMEOUT` is idle-between-progress, not a wall-clock cap, and moot if progress isn't wired through.

→ An agent parking for minutes is likely killed by **its own client**, not the server. Plus an unproven *behavioral* question: will a general coding-agent CLI actually sit on the call and then act on the returned task, vs. ending its turn / asking the human?

## The standards-track signal

MCP's own answer to long-running work is **not** a held-open call — it's the **Tasks** primitive: `tools/call` returns a *task handle*, client drives `tasks/get` polling ("call-now, fetch-later"). Experimental in spec `2025-11-25`, moving to an **extension** in the `2026-07-28` release candidate. So the protocol direction is poll-based; client support (esp. Codex) is still unproven.

## Pivots (decide via spike, before architecture locks)

1. **Short-poll** — fast-returning `get_my_next_task()` looped with a brief sleep. What the incumbent ReverbCode effectively does (nudges). Simplest, works today.
2. **MCP Tasks extension** — sanctioned, but unreleased/unproven across Claude Code + Codex.
3. **Held-open long-poll** — only if a client is *confirmed* to tolerate it; currently none does cleanly.

Codex MCP-client maturity itself is **adequate** (STDIO + Streamable HTTP via `~/.codex/config.toml` / `codex mcp`); the open question is timeout/keepalive parity and long-call behavior.

**Action:** spike activation across Claude Code + Codex *before* the architecture locks the model. This is the PRD-blocking item.

## Related

- [[Cross-Agent Collaboration MCP]] · [[Cross-Agent MCP - Multi-Agent Review Consensus]] · [[Concepts MOC]]
