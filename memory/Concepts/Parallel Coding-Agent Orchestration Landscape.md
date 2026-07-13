---
type: concept
status: active
created: '2026-06-26'
updated: '2026-06-26'
tags:
  - concept
  - competitive
  - multi-agent
  - mcp
related:
  - '[[Cross-Agent Collaboration MCP]]'
  - '[[MCP Long-Running Tool Call Activation Problem]]'
---
# Parallel Coding-Agent Orchestration Landscape

Competitive map for the [[Cross-Agent Collaboration MCP]] space, as of H1 2026. Captures *where the field sits and the precise gap*, so later stages don't re-derive it. Full cited write-up: [`docs/briefs/cross-agent-collaboration-mcp.md`](../../docs/briefs/cross-agent-collaboration-mcp.md) § Competitive landscape.

## The wedge (the axis competitors are measured against)

**Local-first, heterogeneous *CLI coding agents*, sharing one authoritative board + per-task git-worktree isolation, coordinating over MCP, vendor-neutral, human-gated merge.** No single competitor occupies all of it.

## Who occupies what

- **BridgeMind** (BridgeMCP + BridgeSwarm + BridgeSpace) — **closest comparator on the board-over-MCP axis.** BridgeMCP = MCP server with a shared task board (`todo→in-progress→in-review→complete`) + knowledge graph for Cursor/Claude Code/Codex/Windsurf. BridgeSwarm = Coordinator/Builder/Scout/Reviewer roles + **file-ownership** + pre-merge quality gate. BridgeSpace = Kanban UI launching up to 16 parallel terminals. Owns nearly our whole concept — **but cloud-hosted SaaS** (~$16–$80/mo, credit-metered, cloud sandboxes, code/context → BridgeMind servers, account required). **Gap = our wedge:** local-first / zero-cloud / privacy; git-worktree (not file-ownership) isolation; thin neutral substrate vs. integrated product. Proves the pattern is commercializable → concept is *not* the differentiator; local-first + worktree + no-cloud is.
- **ReverbCode** — the true incumbent (local). Go daemon + CLI + Electron supervisor, ~23 agent adapters, worktree-per-session, routes CI/review/conflict feedback back to the owning agent. Already heterogeneous + local-first. **Gap:** coordinates via an SCM-observer that *nudges* agents, not a shared agent-readable **board** they claim from and message through; heavier product, not a thin MCP substrate. Strongest evidence the problem is real → differentiation must be crisp.
- **Augment "Intent"** (macOS) — worktree-per-space + a Coordinator that sequences merges after verification. Almost our model, polished, but vendor/product-bound + closed.
- **ccswarm** — agent pools in worktree-isolated envs; Claude-/single-stack-leaning, pool-coordinated not board+MCP.
- **Composio agent-orchestrator** — plans/spawns agents, *autonomously* handles merge conflicts. Diverges: we **rejected** autonomous LLM conflict resolution (block + alert human instead).
- **Dagger container-use** — MCP server, per-agent *containerized* env + git branch, great visibility. Isolates environments, does **not** coordinate (no board/messaging/claims). Best candidate as a future isolation backend *under* our board, not a substitute.
- **gwq / agentree / worktree-cli** — isolation plumbing, not coordination. Complements.
- **CrewAI / AutoGen(AG2, now MS maintenance mode) / LangGraph / OpenAI Agents SDK** — frameworks to *build* agents in one process; wrong altitude — they don't coordinate independently-launched vendor CLIs sharing a repo.
- **MCP / A2A / ACP / ANP** — protocols, not products. MCP = our agent↔core transport; A2A = horizontal inter-agent delegation at enterprise scale (possible topology-B interop surface, not the local MVP substrate).
- **Claude Code subagents / Agent Teams** — the "why not just use the built-in" answer. Shared task list exists, but **single-vendor**, intra-harness filesystem, and per its own docs subagents "report results back in isolation… can't coordinate directly — hit a wall." Homogeneous + report-back-only vs. our heterogeneous + cross-process + board-with-messaging.

## Net gap we fill

A **local-first, vendor-neutral coordination substrate** (authoritative board + inter-agent messaging + claim/lease + core-mediated *git-worktree* isolation + human live-supervision) for **independently-launched heterogeneous CLI coding agents** over MCP — **no cloud, no account, no recurring cost, code/state never leaves the machine.** The concept is no longer novel (**BridgeMind** commercializes a near-identical board-over-MCP + roles + pre-merge-gate shape, but in the cloud), so the defensible wedge is the *conjunction*: **(1) local-first/zero-cloud/privacy + (2) git-worktree isolation + (3) thin neutral substrate**. Frameworks = wrong altitude; protocols = pieces; isolation tools don't coordinate; native subagents = single-vendor/report-back-only; ReverbCode nudges rather than boards (and avoided the blocking-poll activation this design bets on — see [[MCP Long-Running Tool Call Activation Problem]]); BridgeMind owns the concept but only hosted. **PRD must answer "why not just use BridgeMind / ReverbCode."**

## Related

- [[Cross-Agent Collaboration MCP]] · [[MCP Long-Running Tool Call Activation Problem]] · [[Concepts MOC]]
