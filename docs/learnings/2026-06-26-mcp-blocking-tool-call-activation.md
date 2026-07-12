---
track: knowledge
title: MCP held-open tool calls survive ≥130s on current Claude Code + Codex — bounded long-poll is viable
date: 2026-06-26
component: mcp
tags: [mcp, activation, long-poll, tool-timeout, agent-coordination]
severity: high
applies_when: [designing MCP-server activation/handoff for coding-agent CLIs, "an agent must wait for work over MCP", choosing long-poll vs short-poll vs MCP Tasks]
vault_note: "[[MCP Long-Running Tool Call Activation Problem]]"
---

# MCP held-open tool calls survive ≥130s on current Claude Code + Codex — bounded long-poll is viable

## What happened
The [cross-agent collaboration MCP brief](../briefs/cross-agent-collaboration-mcp.md) flagged its **blocking long-poll** activation (an agent parks on a held-open MCP tool call until work arrives) as the single PRD-blocking risk, citing Cursor's ~60s `tools/call` cap and Claude Code issue #58687 (closed "not planned"). A spike built a probe MCP server — `block_for(seconds, emit_progress)`, instrumented with the request `AbortSignal` to log the exact moment a client gives up — and drove both clients headlessly (`claude -p --mcp-config …`, `codex exec -c mcp_servers.probe.* …`) against a 130s call. **All four combinations** (each client × {default / progress + raised `MCP_TOOL_TIMEOUT`}) **returned cleanly at ~130.16s**, and both agents *parked on the call and waited* — no progress notifications required. The documented timeout risk did **not** reproduce on Claude Code 2.1.193 / Codex 0.142.0. (Caveats: the ceiling beyond 130s was not bisected; behavioral parking is proven for a single explicit instruction, not yet a full multi-task loop; OpenCode/Kimi untested; result is version-specific.) Spike artifacts: `scratchpad/activation-spike/` (`probe-server.mjs`, `run-tests.sh`).

## What I learned
Don't treat an MCP client's timeout behavior as known from an issue tracker or a *different* client — measure the actual CLIs you target. On current Claude Code + Codex a held-open MCP tool call survives well past the feared 60s (≥130s proven, no progress needed), so **bounded long-poll** — the server holds the call and returns work-or-empty at a conservative bound (under the most restrictive target client, for portability), and the agent immediately re-calls — is a viable, event-driven activation model, and strictly cheaper than tight short-polling because a blocked call burns zero tokens until it returns.

## Signals — how to spot this next time
- A design assumes or forbids long-running MCP tool calls based on docs / another client's known limit, without testing the target client.
- You're choosing an agent "wait for work" mechanism: long-poll vs short-poll vs MCP Tasks.
- A "closed: not planned" upstream bug is cited as proof a capability is unavailable — verify against the installed build.

## Suggested updates (do not auto-apply)
- `docs/briefs/cross-agent-collaboration-mcp.md` — flip the activation risk to resolved; adopt bounded long-poll. (done)
- Architecture (when written) — specify the long-poll bound + held-call ceiling as tunables; keep MCP Tasks (`tasks/*`, in SDK 1.29) as a documented fallback.
- `CLAUDE.md` — knowledge-verification chain: add "verify runtime/client limits empirically against the installed version, not from issue trackers."

## Related
- Vault note: `[[MCP Long-Running Tool Call Activation Problem]]`
- Brief: `../briefs/cross-agent-collaboration-mcp.md`
- Feature: `[[Cross-Agent Collaboration MCP]]`
