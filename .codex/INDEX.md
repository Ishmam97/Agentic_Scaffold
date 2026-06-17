# Codex Scaffold Index

The Codex-native map of what this scaffold ships. One line each. Full behavior lives in each file's own metadata and body.

> Codex reads `AGENTS.md`, repo skills from `.agents/skills/`, custom agents from `.codex/agents/`, and project config from `.codex/config.toml` after the project is trusted.

## When to invoke what

| You want to... | Run in Codex |
|---|---|
| Explore a rough idea before committing | `agentic_swe brainstorm "<idea>"` |
| Start a new project from an idea | `agentic_swe greenfield:kickoff "<idea>"` |
| Understand an unfamiliar repo | `agentic_swe brownfield:onboard` |
| Capture requirements | `agentic_swe greenfield:prd` |
| Design a system | Spawn `architect`, or run `agentic_swe greenfield:architect` |
| Break work into stories | Spawn `planner`, or run `agentic_swe story` |
| Build a story | `agentic_swe implement <story>` |
| Add or improve tests | Spawn `test-author` |
| Fix a bug | `agentic_swe brownfield:bugfix "<bug>"` |
| Refactor an area | `agentic_swe brownfield:refactor "<area>"` |
| Self-review before PR | `agentic_swe review` |
| Finalize PR | `agentic_swe ship` |
| Record a decision | `agentic_swe adr "<title>"` |
| Plan a schema/data migration | `agentic_swe migrate` |
| Cut a release | `agentic_swe release` |
| Investigate an incident | `agentic_swe postmortem` |
| Answer a side question without losing your place | `agentic_swe aside "<question>"` |
| Save a named restore point before risky work | `agentic_swe checkpoint create <label>` |
| Capture a lesson from this session | `agentic_swe learn "<topic>"` |
| Stress-test a plan or architecture | `agentic_swe challenge <doc>` |

## Agents - `.codex/agents/`

Specialists. Spawn them for context-heavy or parallelizable work; keep judgment in the main thread.

| Agent | Does |
|---|---|
| `analyst` | Discovery and requirements elicitation from a vague idea to a project brief. |
| `architect` | System/feature design, tech choices, and ADRs. |
| `code-reviewer` | Correctness, clarity, conventions, error handling, obvious bugs. |
| `committer` | Working tree to clean atomic commits. |
| `data-modeler` | Relational, document, event, and API-shape schemas. |
| `debugger` | Root-cause analysis before a fix. |
| `devils-advocate` | Steelman then stress-test a plan, PRD, or architecture. |
| `docs-writer` | READMEs, API docs, runbooks, onboarding guides, ADRs. |
| `implementer` | Editor half of architect -> editor: applies diffs against a story and plan. |
| `learnings-researcher` | Searches `docs/learnings/` and the memory vault for prior lessons. |
| `migration-planner` | Staged DB migrations, backfills, API version transitions. |
| `perf-auditor` | N+1, allocations, blocking I/O, missing indexes, O(n^2). |
| `planner` | PRD/feature to self-contained story files. |
| `pm` | Brief or clear request to PRD. |
| `refactorer` | Behavior-preserving cleanup. |
| `release-manager` | Version bump, changelog, release notes, pre-release checklist. |
| `repo-mapper` | Build or refresh `REPOMAP.md`. |
| `security-auditor` | Injection, auth/authz, secrets, unsafe deserialization, dependency vulnerabilities. |
| `tech-researcher` | Compare libraries/frameworks/patterns to shortlist and tradeoffs. |
| `test-author` | Add/improve tests and edge-case coverage. |

## Workflows - `.agents/skills/agentic-swe-workflows/`

Codex does not use repo-local Claude slash commands directly. The `agentic-swe-workflows` skill maps slash-command-style names to resource prompts under `resources/commands/`.

Use any of these names with or without a leading slash:

`adr` · `aside` · `brainstorm` · `challenge` · `checkpoint` · `implement` · `learn` · `migrate` · `postmortem` · `release` · `review` · `ship` · `story` · `greenfield:brief` · `greenfield:prd` · `greenfield:architect` · `greenfield:kickoff` · `greenfield:scaffold` · `brownfield:onboard` · `brownfield:feature` · `brownfield:bugfix` · `brownfield:refactor`

## Skills - `.agents/skills/`

| Skill | Does |
|---|---|
| `agentic-swe-workflows` | Routes the scaffold workflows formerly expressed as Claude slash commands. |
| `obsidian` | Drives the `memory/` vault via MCP, Obsidian CLI/app actions, and git sync. |
| `test-driven-development` | RED -> GREEN -> REFACTOR discipline. |
| `systematic-debugging` | Reproduce -> hypothesize -> falsify -> root cause -> fix and regression. |

## Hooks - `.codex/hooks/`

| Hook | Event | Does |
|---|---|---|
| `session-start.sh` | `SessionStart` | Emits a compact scaffold orientation. `AGENTS.md` remains the authoritative instruction source. |

## MCP

Codex uses `.codex/config.toml` to start the `obsidian` MCP server from `vendor/mcpvault/dist/server.js` against the `memory/` vault. Claude Code still uses `.mcp.json`.

## Templates - `templates/`

Typed artifact skeletons. Workflows instantiate them into `docs/<type>/<slug>.md`; do not copy by hand.

`adr` · `architecture` · `brief` · `changelog` · `data-model` · `incident` · `learning` · `migration-plan` · `postmortem` · `pr-body` · `prd` · `repomap` · `runbook` · `story` · `stack-mappings.json`

## Contexts - `contexts/`

Mode prompt files: `dev`, `review`, `research`, `debug`. In Codex, mention the relevant file in your prompt, for example: "Use `contexts/review.md` for this review."
