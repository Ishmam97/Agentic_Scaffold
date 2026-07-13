---
type: feature
status: active
created: '2026-06-26'
updated: '2026-06-26'
tags:
  - feature
  - mcp
  - multi-agent
  - collaboration
  - open-question
related:
  - '[[Cross-Agent MCP - Multi-Agent Review Consensus]]'
  - '[[Cross-Agent MCP - Agent-Agnostic by Design]]'
---
# Cross-Agent Collaboration MCP

A local-first coordination substrate that lets heterogeneous coding agents (Claude Code, Codex, OpenCode, Kimi, …) share a task board, message each other, and collaborate on one repo without a human relaying state between terminals. Brainstormed 2026-06-26; sharpened by a multi-agent review (see [[Cross-Agent MCP - Multi-Agent Review Consensus]]). Pre-PRD.

**Working name:** unresolved. `AgentBus` (provisional) reads as a message-transport layer, but the architecture's real strength is *shared state + isolated workspaces* — candidates: `WorktreeHub`, `RepoCrew`, `DevBoard`, `WorkBus`.

## Problem

A developer running several coding agents at once has no way for them to see each other's work or coordinate. Each is a siloed session with its own context, so **the human is the manual message bus** — copy-pasting state between terminals, relaying "X is done, now do Y", running agents sequentially because parallel edits clobber the same files. No shared board, no inter-agent messaging, no teams, no record of who's doing what or what it costs.

## Who it's for

A **single developer on one machine** orchestrating multiple agent CLIs locally and supervising (topology A). The substrate is designed so the same core later serves cross-machine agents (B), multiple humans (C), and autonomous swarms (D) — those are out of MVP scope but must not require a rewrite.

## Approach

A **shared local core service** (SQLite + HTTP/WebSocket daemon) is the single source of truth for a task board, messages, teams, an agent registry, and a usage ledger. Two thin clients sit on top:

- an **MCP adapter** exposing board operations as tools so *any MCP-capable agent* can participate, and
- a **UI** (thin live dashboard, web/TUI over WebSocket) so the human watches the board and reassigns.

The UI does **not** route through MCP — both MCP and UI are sibling clients of the core. Workflow is **lead-and-delegate**: a lead agent decomposes a goal into tasks, posts them, assigns to specialists; the human can override the agent↔role binding. Parallel work happens in **isolated git worktrees per task** (the core creates them), with shared context/artifacts read-only and merge as an explicit, first-class board step.

```
        ┌────────────────┐
        │  Core service   │  SQLite + HTTP/WS · append-only event log
        │ (agentbus serve)│  board · tasks · messages · teams · registry · usage ledger
        └───────┬─────────┘
        ┌───────┴─────────┐
   ┌────▼──────┐    ┌─────▼──────┐
   │MCP adapter │    │     UI     │
   │(for agents)│    │ (for human)│
   └────┬───────┘    └─────┬──────┘
   stdio│ tools           HTTP/WS│ live
   Claude Code,           dashboard
   Codex, …               + reassign
```

## Key decisions (locked)

Architectural non-negotiables (defended by every reviewer):

- **Core-as-source-of-truth.** The SQLite/HTTP daemon is the single truth; UI + MCP adapter are strictly sibling clients. Keeps the UI off the MCP spec and future multi-user cheap.
- **Worktree-per-task isolation.** The right primitive against parallel file clobbering — delegates the hard part to Git, which humans and LLMs already understand.
- **Lead-and-delegate.** A primary agent decomposes; specialists pull scoped tasks; the human can override assignment.
- **Agent-agnostic / role-pluggable.** Roles (Lead, Worker, Reviewer) are abstract; *any* agent fills *any* role; the user binds agents to roles as config. The MVP proving set (Claude Code + Codex) is a test-surface limit, **not** a design constraint. See [[Cross-Agent MCP - Agent-Agnostic by Design]].

Review-driven corrections (fold into the design):

- **Activation = blocking long-poll, not human-nudge.** Expose `wait_for_my_next_task()`; the agent parks on it and the server holds the connection open until work exists. Simulates event-driven handoff without harness-level server push. (Supersedes the earlier human-nudge MVP plan.)
- **Core owns worktrees.** Flow: agent claims task → core runs `git worktree add` → core returns the absolute path in the tool response. Agents never create their own (prevents hallucinated paths / FS collisions).
- **Merge is first-class, and worktrees only *defer* conflicts.** LLMs can't reliably resolve complex Git conflicts. MVP: the Lead enforces a sequential dependency graph or strictly orthogonal file sets. Any conflict immediately **blocks** the task and **alerts the human**.
- **Atomic claims + leases.** Claiming is a race — use compare-and-swap. Every claim gets a ~15-min lease + heartbeat; if the agent dies, the lease expires and the task reverts to Unclaimed.
- **Append-only event log**, not a mutable Kanban — for auditing, context limits, reliable state.
- **Durable identity via handshake.** env/args configure the transport/process; a first-call `register_agent_session` establishes a durable logical identity in the DB.
- **Explicit `agentbus serve`** for MVP. No auto-spawn via lockfiles/sockets (too much debugging friction for v1).
- **No "get full board" tool** (context bloat). Granular endpoints only: `get_my_assigned_tasks`, `get_task_context(id)`.

## Token handling

Collect-now, optimize-later. A **self-reporting** usage tool bookends each task (checkpoint at claim, checkpoint at done; the delta ≈ task cost) purely to prove the schema. Registry carries capability tags + cost tier + human-declared budget/limit as *schema*. **No** hard routing/budgeting logic yet — cross-agent telemetry is too inaccurate this phase. `suggest_assignee` (deterministic, over registry data) is designed-for, deferred.

## MVP success criteria (revised, post-review)

The testable vertical slice:

1. Start the core daemon in a repo (`agentbus serve`).
2. Start Claude Code (Lead) + Codex (Worker); both register via MCP handshake.
3. Lead decomposes a goal into **2 disjoint tasks**.
4. Human watches them appear live in the thin UI.
5. Worker blocking-polls, **atomic-claims** a task, receives a **core-generated worktree path**.
6. Worker makes a code change, posts a progress message, marks the task `merge_ready` with test results attached.
7. Lead picks up the review state and approves.
8. UI reflects all status changes, rough token usage, and live event logs — **no human copy-paste of context or terminal commands**.

## Open questions

- Working name (candidates above). #open-question
- Token-checkpoint accuracy: self-report (rough) vs. a harness hook reading real transcript usage (accurate, per-agent). Which agents get the accurate path first.
- Merge-conflict UX beyond "block + alert": does the human resolve in the worktree, or hand back to an agent with the conflict markers as context?
- Heartbeat mechanism for the blocking long-poll vs. lease-expiry interplay.
- How role→agent binding is declared (config file? UI? lead-agent proposal?) and overridden mid-session.

## Non-goals (MVP)

- Cross-machine, multi-user, auth/access control (topologies B/C) — *design for, don't build*.
- Fully autonomous, human-out-of-loop swarm (D).
- Accurate cross-agent token telemetry + token-optimized auto-routing.
- Concurrent editing of one working tree — avoided by worktrees.
- Full drag-drop Kanban UI — thin live dashboard + basic actions only.
- OpenCode / Kimi / other agents in the MVP **test matrix** (architecture supports them; proving set is Claude Code + Codex only).

## Sizing & next step

Large→Complex by the scaffold's sizing (new cross-system architecture; real uncertainty in activation, merge, telemetry). Natural path: brief → PRD → architecture → `/challenge` → stories → `/implement`. Brief artifact now exists (see below); PRD blocked on the activation spike.

## Artifacts

- Project brief: [`docs/briefs/cross-agent-collaboration-mcp.md`](../../docs/briefs/cross-agent-collaboration-mcp.md) — synthesized 2026-06-26. Adds competitive landscape, JTBD, value hypothesis, quantified success metrics. **Verdict: not yet PRD-ready** — blocked on an activation-model feasibility spike (below); the brief content itself is complete.

## Net-new from the brief (2026-06-26)

- **Competitive landscape mapped** → [[Parallel Coding-Agent Orchestration Landscape]]. Closest incumbent: **ReverbCode** (23-adapter daemon, worktree-per-session, SCM-observer *nudges* agents — not a shared board). Native **Claude Code Agent Teams** is the "why not built-in" answer: single-vendor, report-back-only.
- **Activation model at serious risk** → [[MCP Long-Running Tool Call Activation Problem]]. Current MCP clients hard-timeout held-open tool calls (Claude Code keepalive bug #58687 closed "not planned"); MCP's sanctioned long-running pattern is the **poll-based Tasks** primitive, not a blocking call. **Spike before architecture locks** — the PRD-blocking item. May force pivoting the locked blocking-long-poll decision to short-poll or MCP Tasks. #open-question

## Related

- [[Cross-Agent MCP - Multi-Agent Review Consensus]] — the review that sharpened this
- [[Cross-Agent MCP - Agent-Agnostic by Design]] — the role-pluggability principle
- [[Features MOC]] · [[Decisions Log]] · [[Home]]
