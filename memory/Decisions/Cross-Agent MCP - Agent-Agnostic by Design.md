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
  - architecture
related:
  - '[[Cross-Agent Collaboration MCP]]'
  - '[[Cross-Agent MCP - Multi-Agent Review Consensus]]'
---
# Cross-Agent MCP — Agent-Agnostic by Design

The [[Cross-Agent Collaboration MCP]] must be modular at the agent boundary: **any** coding agent can fill **any** role, and the user binds agents to roles. A hard design principle, not a preference.

## The principle

- **Roles are abstract.** Lead / Worker / Reviewer (and future roles) are defined by the tools they call and the task types they handle — never by a specific vendor.
- **Agents are pluggable.** Claude Code, Codex, OpenCode, Kimi, or anything MCP-capable can occupy a role. Adding an agent is configuration, not a code change.
- **The user picks the agent per role.** Role→agent binding is explicit config the human controls and can override mid-session. The lead may *propose* a binding; the human decides.
- **No vendor assumptions in the core.** The core service, board schema, and MCP tool contracts must not encode "Claude is the lead." "Lead" is a role another agent could hold tomorrow.

## Why it matters

The whole value proposition is a *neutral* collaboration substrate for heterogeneous agents. Baking in a specific agent (e.g. Claude-as-lead) collapses it into a single-vendor orchestrator and kills the differentiator. Later token/cost optimization also depends on being able to swap a role onto a cheaper or less rate-limited agent freely.

## Relationship to the review's "Target Agents = Claude Code + Codex"

That limit (see [[Cross-Agent MCP - Multi-Agent Review Consensus]]) is purely about **bounding the MVP test matrix** — fewer agent pairings to validate. It does **not** license vendor-specific shortcuts in the architecture. Build the boundary pluggable; ship the MVP exercising only the Claude Code + Codex pairing.

## Implications for the build

- Per-agent specifics live behind a thin **adapter/profile** (how the agent is launched, how it reports usage, any quirks) — the core talks to a uniform interface.
- Role definitions and tool contracts stay vendor-neutral in the schema.
- Onboarding a new agent = add a profile + bind it to a role. No core changes.

## Related

- [[Cross-Agent Collaboration MCP]] · [[Cross-Agent MCP - Multi-Agent Review Consensus]] · [[Decisions Log]]
