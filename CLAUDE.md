# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Claude Code-native scaffold for full-lifecycle software engineering. Specialist subagents (`.claude/agents/`), composable slash commands (`.claude/commands/`), and typed artifact templates (`templates/`) for both greenfield and brownfield work.

Treat it as a **toolkit**, not a pipeline — invoke what you need, when you need it. There's no enforced order; the commands compose.

## Operating principles

1. **Typed artifacts beat chat.** Planning outputs go in `docs/<type>/<slug>.md`, generated from `templates/`. Artifacts are the handoff medium between agents and survive context resets.

2. **Architect → Editor split.** Non-trivial implementation uses a high-reasoning architect to plan against a story, then an implementer to apply diffs. `/implement` orchestrates this.

3. **Stories are self-contained.** Each story file embeds its slice of architecture, acceptance criteria, and relevant repo-map references — enough that any agent can pick it up cold.

4. **Brownfield starts with the repo map.** Run `/brownfield:onboard` once per repo to seed `REPOMAP.md`. Other agents reference it instead of re-deriving structure.

5. **Reviews fan out in parallel.** `/review` invokes `code-reviewer`, `security-auditor`, `perf-auditor` concurrently. Aggregate findings by severity, not by reviewer.

6. **Right-size the work.** Match artifact depth to scope. Use the tier table below — skip phases on small work, gate on large work. The complexity determines the depth, not a fixed pipeline.

   | Scope | Use | Example |
   |---|---|---|
   | **Small** (≤3 files, ≤1 hour, one clear change) | Skip PRD/architect. `/brownfield:bugfix` or direct edit. | Fix a null-pointer in `parseConfig`. |
   | **Medium** (one story file, half-day to two days) | `/story` then `/implement`. | Add an endpoint and its tests. |
   | **Large** (multiple stories, requires design) | Full PRD → architecture → stories → `/implement` per story. | New feature surface. |
   | **Complex** (cross-system, high uncertainty) | Add `/challenge` between architecture and stories. Spike if novel. | Migration touching writers and readers; new auth model. |

   **Safety valve:** If a "small" task reveals more than 5 atomic steps during implementation, STOP and create a formal story file. Don't keep pushing on an under-sized plan.

## Conventions

- Artifacts live in `docs/<type>/<slug>.md` (e.g. `docs/prd/payments-redesign.md`).
- Stories are named `docs/stories/<NNN>-<slug>.md` (zero-padded, sequential).
- ADRs are numbered: `docs/adrs/<NNNN>-<slug>.md`.
- Postmortems: `docs/postmortems/<YYYY-MM-DD>-<slug>.md`.
- Agents are role nouns (`architect.md`); commands are verbs or namespaced (`/implement`, `/greenfield:prd`).
- **Frontmatter `description:` must follow** `[What it does] + [Use when "<trigger phrase>"] + [Do NOT use for X]`. Negative triggers prevent agent overlap; without them, auto-selection blurs.

## Memory vault

An Obsidian vault at `memory/agentic swe/` is the project's durable memory, reachable via the `obsidian` MCP server (`.mcp.json`) and the `.claude/skills/obsidian/` skill. Use it for cross-session, cross-task knowledge: running notes, linked concepts, decisions-in-context, daily logs. Use `docs/` for formal per-task artifacts (PRD, architecture, stories, ADRs). Rule of thumb: **`docs/` is the handoff medium; the vault is the long-term memory.** Prefer the MCP tools for vault reads/writes (frontmatter-safe); they're sandboxed to the vault.

## When to invoke what

| You want to... | Run |
|---|---|
| Start a new project from an idea | `/greenfield:kickoff "<idea>"` |
| Understand an unfamiliar repo | `/brownfield:onboard` |
| Capture requirements | `/greenfield:prd` |
| Design a system | invoke `architect` agent (or `/greenfield:architect`) |
| Break work into stories | invoke `planner` agent (or `/story`) |
| Build a story | `/implement <story>` |
| Add or improve tests | invoke `test-author` agent |
| Self-review before PR | `/review` |
| Finalize PR | `/ship` |
| Record a decision | `/adr "<title>"` |
| Plan a schema/data migration | `/migrate` |
| Cut a release | `/release` |
| Investigate an incident | `/postmortem` |
| Fix a bug | `/brownfield:bugfix "<bug>"` |
| Refactor an area | `/brownfield:refactor "<area>"` |
| Answer a side question without losing your place | `/aside "<question>"` |
| Save a named restore point before risky work | `/checkpoint <label>` |
| Capture a lesson from this session | `/learn "<topic>"` |
| Stress-test a plan or architecture | `/challenge <doc>` |

## What not to do

- Don't skip the story file for non-trivial work — it's the context container.
- Don't manually copy template content; commands handle template instantiation.
- Don't write code in the architect step or design in the implementer step — keep the split clean.
- Don't bypass `/brownfield:onboard` for an unfamiliar repo. The repo map is cheap and other agents lean on it.

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work.

## Knowledge verification chain

When a question can't be answered from this conversation alone, consult sources in this order. Stop at the first one that resolves the question — don't pile on.

1. **Codebase.** Read the actual files. Grep for the symbol or string.
2. **Project docs.** `docs/architecture/`, `docs/adrs/`, `REPOMAP.md`, story files.
3. **Context7 MCP** (`mcp__plugin_context7_context7__*`) for library/framework docs. Prefer this over guessing from training data — knowledge cutoffs are real.
4. **Web search / fetch.** For recent activity, community signal, breaking changes.
5. **Flag as uncertain and ask the user.** This is always an option. Uncertainty is preferable to fabrication.

Applies especially to `analyst`, `tech-researcher`, `architect`, and `debugger`.

## Sub-agent delegation matrix

The architect→editor split is one instance of a broader rule: delegate context-heavy or parallelizable work; keep judgment in main context.

| Delegate to a sub-agent | Keep in main context |
|---|---|
| Research / library comparison (returns: shortlist + tradeoff) | Planning, sequencing, prioritization |
| Implementation against a fixed plan (returns: diff) | Task creation, story decomposition |
| Parallel reviews (returns: tagged findings) | Validation of those findings against original intent |
| Repo mapping (returns: REPOMAP.md) | Architectural decisions that depend on it |
| Debugging spike (returns: reproduction + root cause) | The fix decision and the test design |

Sub-agents get their full prompt in the invocation — they can't see this conversation. State the goal, the constraints, the inputs, the expected output shape, and where to write artifacts.

## Rule 1 — Think Before Coding
State assumptions explicitly. Ask rather than guess.
Push back when a simpler approach exists. Stop when confused.

## Rule 2 — Simplicity First
Minimum code that solves the problem. Nothing speculative.
No abstractions for single-use code.

## Rule 3 — Surgical Changes
Touch only what you must. Don't improve adjacent code.
Match existing style. Don't refactor what isn't broken.
Remove imports/variables/functions YOUR changes orphaned.
Don't delete pre-existing dead code unless asked.
Every changed line should trace to the user's request.

## Rule 4 — Goal-Driven Execution
Define success criteria. Loop until verified.
Strong success criteria let Claude loop independently.

## Rule 5 — Use the model only for judgment calls
Use for: classification, drafting, summarization, extraction.
Do NOT use for: routing, retries, deterministic transforms.
If code can answer, code answers.

## Rule 6 — Token budgets are not advisory
Per-task: 4,000 tokens. Per-session: 30,000 tokens.
If approaching budget, summarize and start fresh.
Surface the breach. Do not silently overrun.

## Rule 7 — Surface conflicts, don't average them
If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.

## Rule 8 — Read before you write
Before adding code, read exports, immediate callers, shared utilities.
If unsure why existing code is structured a certain way, ask.

## Rule 9 — Tests verify intent, not just behavior
Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 10 — Checkpoint after every significant step
Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.

## Rule 11 — Match the codebase's conventions, even if you disagree
Conformance > taste inside the codebase.
If you think a convention is harmful, surface it. Don't fork silently.

## Rule 12 — Fail loud
"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.