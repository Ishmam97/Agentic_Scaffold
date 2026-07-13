# AGENTS.md

Operating contract for this scaffold when used from Codex. The full Codex map of agents, workflows, skills, hooks, and templates is in **`.codex/INDEX.md`**. Claude Code users use **`CLAUDE.md`** and **`.claude/INDEX.md`**; keep both surfaces aligned when changing scaffold behavior.

Toolkit, not pipeline: invoke what the work needs. The pieces compose; there is no enforced order.

## Project context

<!-- Populated per project by the greenfield or brownfield workflows.
     Keep it factual and objective: project name, stack, build/test/lint commands, key domains, hard constraints,
     links to REPOMAP.md and the live architecture docs. Everything below this section is the stable scaffold core. -->

_Unconfigured scaffold - no project bound yet. Run the `greenfield:kickoff` or `brownfield:onboard` workflow to populate this section._

## Codex surfaces

- Repo instructions: `AGENTS.md`.
- Custom agents: `.codex/agents/*.toml`.
- Repo skills: `.agents/skills/*/SKILL.md`.
- Workflow bridge: `.agents/skills/agentic-swe-workflows/SKILL.md`.
- Project config, MCP, and hooks: `.codex/config.toml` and `.codex/hooks.json`.
- Claude Code equivalents remain in `.claude/` and `CLAUDE.md`.

## Operating principles

1. **Typed artifacts beat chat.** Planning outputs go in `docs/<type>/<slug>.md`, generated from `templates/`. Artifacts are the handoff medium between agents and survive context resets.
2. **Architect -> editor split.** Non-trivial implementation uses an architect to plan against a story, then an implementer to apply diffs. The `implement` workflow orchestrates this.
3. **Stories are self-contained.** Each story embeds its slice of architecture, acceptance criteria, and relevant repo-map references.
4. **Brownfield starts with the repo map.** Run `brownfield:onboard` once per repo to seed `REPOMAP.md`.
5. **Reviews fan out in parallel.** The `review` workflow asks `code-reviewer`, `security-auditor`, `perf-auditor`, and `learnings-researcher` to inspect the diff, then aggregates by severity.
6. **Right-size the work.** Small changes can be direct edits; medium work gets a story; large work gets PRD -> architecture -> stories; complex work adds a challenge pass.
7. **Disciplines are skills.** TDD, systematic debugging, the Obsidian memory vault, skill authoring, and workflow routing live under `.agents/skills/`.

## Conventions

- Artifacts live in `docs/<type>/<slug>.md`.
- Stories: `docs/stories/<NNN>-<slug>.md`. ADRs: `docs/adrs/<NNNN>-<slug>.md`. Postmortems: `docs/postmortems/<YYYY-MM-DD>-<slug>.md`. Learnings: `docs/learnings/<YYYY-MM-DD>-<slug>.md`.
- Agents are role nouns (`architect`); workflows are verbs or namespaced (`implement`, `greenfield:prd`); skills are disciplines.
- Custom agent descriptions should be specific enough that Codex can choose or spawn the right agent only when the role fits.
- **Model-invoked vs. user-invoked.** A skill is model-invoked — reached by trigger-match, never called by name. A workflow or agent is user-invoked — reached only by explicit reference. A user-invoked surface never triggers another user-invoked surface by pattern-matching; it can only name it explicitly. See the `skill-authoring` skill before adding or editing any of the three.
- **Deferred-corner marker.** When you deliberately cut a corner mid-implementation, leave `# scope: <what was deferred>, <trigger to revisit>` at the site. The `review` and `ship` workflows grep for these and surface any left unresolved before a PR.
- **Rejected-request ledger.** `docs/out-of-scope/<slug>.md` holds asks that were deliberately descoped or rejected (one file per ask, one-line reason + date). `analyst` and `pm` check it before drafting a new brief/PRD.

## Memory vault

The Obsidian vault at `memory/` is durable cross-session memory, reached through the `obsidian` MCP server configured in `.codex/config.toml` for Codex and `.mcp.json` for Claude Code. `docs/` is the per-task handoff medium; the vault is long-term memory. Prefer MCP tools for vault reads/writes when available.

The vault is used proactively, not just when the user mentions it: `SessionStart` prompts a vault check before assuming a cold start, `PreCompact` prompts a save of anything durable before context is discarded, and `TaskCompleted` prompts a save when a completed task produced something durable. See `.codex/hooks/` / `.codex/INDEX.md` § Hooks.

## Knowledge verification chain

When a question cannot be answered from the current thread alone, consult sources in this order and stop at the first that resolves it:

1. Codebase: read files and search for symbols or strings.
2. Project docs: `docs/architecture/`, `docs/adrs/`, `REPOMAP.md`, story files, `docs/learnings/`.
3. MCP documentation tools for library/framework docs when available.
4. Web search or fetch for recent activity, breaking changes, or community signal.
5. Flag uncertainty and ask the user.

## Subagent delegation

Delegate context-heavy or parallelizable work; keep judgment in the main thread.

| Delegate to a subagent | Keep in main context |
|---|---|
| Research or library comparison | Planning, sequencing, prioritization |
| Implementation against a fixed plan | Task creation and story decomposition |
| Parallel reviews | Validation of findings against intent |
| Repo mapping | Architectural decisions based on the map |
| Debugging spike | Fix decision and test design |

When spawning a Codex custom agent, state the goal, constraints, inputs, expected output shape, and where to write artifacts.

## Rules

1. Think before coding. State assumptions and ask rather than guess when blocked.
2. Simplicity first. Minimum code that solves the problem; no speculative abstraction.
3. Surgical changes. Touch only what the request requires and match existing style.
4. Goal-driven execution. Define success criteria and verify them.
5. Use the model for judgment, not deterministic transforms that code can handle.
6. Respect token budgets. Summarize and restart rather than silently overrunning.
7. Surface conflicts; do not average contradictory instructions.
8. Read before writing. Inspect exports, callers, and neighboring patterns first.
9. Tests verify intent. Skipped, vacuous, placeholder, or zero-case tests do not count as passing.
10. Checkpoint and plan before multi-step work.
11. Match the codebase's conventions, even when you disagree.
12. Fail loud. Do not claim completion or green tests without fresh evidence.
