---
type: decision
status: active
created: '2026-06-26'
updated: '2026-06-26'
tags:
  - decision
  - mcp
  - multi-agent
  - collaboration
  - review
related:
  - '[[Cross-Agent Collaboration MCP]]'
  - '[[Cross-Agent MCP - Agent-Agnostic by Design]]'
---
# Cross-Agent MCP — Multi-Agent Review Consensus

Consensus from a multi-reviewer pass over the [[Cross-Agent Collaboration MCP]] brainstorm. Records what the reviewers defended, the dangerous assumptions they exposed, and the agreed pivots — the "why" behind the locked decisions in the feature note.

## 1. Architectural non-negotiables (do not compromise)

- **Core-as-source-of-truth** — the SQLite/HTTP daemon stays the single source of truth; UI + MCP adapter are strictly sibling clients. Keeps the UI unconstrained by the MCP spec and future multi-user cheap.
- **Worktree-per-task isolation** — correct primitive for parallel file clobbering; delegates the hardest part of parallel coding to Git, which humans and LLMs already understand.
- **Lead-and-delegate** — a primary agent decomposes work; specialist agents pull scoped tasks.

## 2. Critical corrections to the MVP

- **The merge bottleneck.** Worktrees *defer* conflicts, they don't solve them; LLMs can't reliably resolve complex Git conflicts. MVP: the Lead enforces a strict sequential dependency graph or strictly orthogonal file sets. Merge is a first-class board step; any conflict immediately **blocks** the task and **alerts the human**.
- **Worktree mediation — core owns it.** Agents must not create their own worktrees. Flow: agent claims task → core runs `git worktree add` → core returns the absolute path via the tool response. Prevents hallucinated paths and filesystem collisions.
- **Activation & the "push" problem.** Manual nudging defeats the automation. Instead of a wake daemon, expose a **blocking** MCP tool `wait_for_my_next_task()`: the agent parks on it; the server holds the connection open until the board has work. Event-driven handoff without harness-native server push.
- **Atomic claims & leases.** Claiming is a race — use an atomic compare-and-swap. Every claim gets a lease (~15 min); a missed heartbeat expires the lease and reverts the task to Unclaimed.

## 3. State management & data model

Model the core less like a mutable Kanban board and more like an **append-only event log** (auditing, context limits, reliable state).

| Component | Consensus implementation |
|---|---|
| Agent identity | env/args configure transport/process, but require a first-call `register_agent_session` handshake to establish durable logical identity in the DB. |
| Daemon lifecycle | Ship explicit `agentbus serve` for the MVP. Auto-spawn via lockfiles/sockets = too much debugging friction for v1. |
| Context bloat | Never expose a "get full board" tool. Use granular `get_my_assigned_tasks`, `get_task_context(id)`. |
| Token ledger | Collect via a self-reporting tool to prove the schema; build **no** hard routing/budgeting on it yet — too inaccurate this phase. |
| Target agents | MVP proving set: Claude Code (Lead) + Codex (Worker). Drop OpenCode for the MVP to avoid combinatorial complexity. **⚠ See reconciliation below.** |

## 4. Naming

"AgentBus" implies a message-transport layer, but the architecture's true strength is *shared state + isolated workspaces*. Candidates that reflect the data substrate: **WorktreeHub**, **RepoCrew**, **DevBoard**, **WorkBus**.

## 5. Revised MVP success criteria

The canonical 8-step vertical slice lives in [[Cross-Agent Collaboration MCP]] § *MVP success criteria*. In short: daemon up → both agents register → Lead creates 2 disjoint tasks → human watches live → Worker blocking-polls + atomic-claims + gets a core-generated worktree path → Worker changes code, posts progress, marks `merge_ready` with tests → Lead reviews/approves → UI reflects everything with zero human copy-paste.

## Reconciliation — "Target Agents" vs. agent-agnostic design

The review's "strictly limit to Claude Code + Codex / drop OpenCode" is a **test-surface** decision (bound combinatorial complexity for v1), **not** an architectural one. Per project direction the design must stay **agent-agnostic and role-pluggable**: any MCP-capable agent (OpenCode, Kimi, …) can fill any role, and the user picks the agent per role. So: build the role/agent boundary as pluggable config; *exercise* only Claude Code + Codex in the MVP. See [[Cross-Agent MCP - Agent-Agnostic by Design]].

## Related

- [[Cross-Agent Collaboration MCP]] · [[Cross-Agent MCP - Agent-Agnostic by Design]] · [[Decisions Log]]
