# Scaffold Index

The map of what this scaffold ships. One line each. Authoritative source for "what exists and when to reach for it." Full behavior lives in each file's own frontmatter and body.

> Agents are invoked via the Agent/Task tool (auto-selected by `description`, or named). Commands are `/verbs`. Skills load on trigger-match. Hooks fire on lifecycle events.

## When to invoke what (quick routing)

| You want to… | Run |
|---|---|
| Explore a rough idea before committing | `/brainstorm "<idea>"` |
| Start a new project from an idea | `/greenfield:kickoff "<idea>"` |
| Understand an unfamiliar repo | `/brownfield:onboard` |
| Capture requirements | `/greenfield:prd` |
| Design a system | `architect` agent (or `/greenfield:architect`) |
| Break work into stories | `planner` agent (or `/story`) |
| Build a story | `/implement <story>` |
| Add or improve tests | `test-author` agent |
| Fix a bug | `/brownfield:bugfix "<bug>"` |
| Refactor an area | `/brownfield:refactor "<area>"` |
| Self-review before PR | `/review` |
| Finalize PR | `/ship` |
| Record a decision | `/adr "<title>"` |
| Plan a schema/data migration | `/migrate` |
| Cut a release | `/release` |
| Investigate an incident | `/postmortem` |
| Answer a side question without losing your place | `/aside "<question>"` |
| Save a named restore point before risky work | `/checkpoint <label>` |
| Capture a lesson from this session | `/learn "<topic>"` |
| Stress-test a plan or architecture | `/challenge <doc>` |

## Agents — `.claude/agents/`

Specialists. Delegate context-heavy or parallelizable work to them; keep judgment in main context (see CLAUDE.md § delegation matrix).

| Agent | Does |
|---|---|
| `analyst` | Discovery + requirements elicitation from a vague idea → project brief. |
| `architect` | System/feature design, tech choices, single-decision ADRs. |
| `code-reviewer` | Correctness, clarity, conventions, error handling, obvious bugs. |
| `committer` | Working tree → clean series of atomic commits. |
| `data-modeler` | Relational / document / event / API-shape schemas. |
| `debugger` | Root-cause analysis before a fix. Follows the `systematic-debugging` skill. |
| `devils-advocate` | Steelman then stress-test a plan/PRD/architecture (pre-mortem + assumption audit). |
| `docs-writer` | READMEs, API docs, runbooks, onboarding guides, ADRs. |
| `implementer` | Editor half of architect→editor: applies diffs against a story + plan. Follows `test-driven-development`. |
| `learnings-researcher` | Grep-first search of `docs/learnings/` + the memory vault; returns ranked prior lessons before planning/review. |
| `migration-planner` | Staged DB migrations, backfills, API version transitions. |
| `perf-auditor` | N+1, allocations, blocking I/O on hot paths, missing indexes, O(n²). |
| `planner` | PRD/feature → sequence of self-contained story files. |
| `pm` | Brief (or clear request) → PRD. |
| `refactorer` | Behavior-preserving cleanup: extract, rename, dedupe, remove dead code. |
| `release-manager` | Version bump, changelog, release notes, pre-release checklist. |
| `repo-mapper` | Build/refresh `REPOMAP.md`. |
| `security-auditor` | Injection, auth/authz, secrets, unsafe deserialization, dep vulns. |
| `tech-researcher` | Compare libraries/frameworks/patterns → shortlist + tradeoffs. |
| `test-author` | Add/improve tests; owns the edge-case taxonomy. |

## Commands — `.claude/commands/`

| Command | Does |
|---|---|
| `/brainstorm` | Interactive, one-question-at-a-time exploration of a rough idea; hands off to `/greenfield:brief`/`prd`. |
| `/adr` | Write an Architecture Decision Record (with a "when to create one" trigger matrix). |
| `/aside` | Answer a side question without losing your place. Never modifies files. |
| `/challenge` | Run `devils-advocate` against a plan/PRD/architecture. |
| `/checkpoint` | Create/list/restore a named checkpoint (git stash + log). |
| `/implement` | Architect→editor build of a story (readiness gate → plan → implement → test → self-review). |
| `/learn` | Capture a lesson → typed `docs/learnings/` artifact + linked vault note + discoverability check. |
| `/migrate` | Plan a DB migration / backfill / API version transition. |
| `/postmortem` | Blameless postmortem for an incident or significant bug. |
| `/release` | Cut a release. |
| `/review` | Parallel fan-out: `code-reviewer` + `security-auditor` + `perf-auditor`. |
| `/ship` | Pre-PR gate: verification gate, stub scan, story acceptance, docs, PR body. |
| `/story` | Create one fully-contextual story file. |
| `/greenfield:kickoff` | New project: analyst → PM → architect → planner → scaffold, with checkpoints. |
| `/greenfield:brief` | Idea → project brief (via `analyst`). |
| `/greenfield:prd` | Brief (or clear request) → PRD. |
| `/greenfield:architect` | Architecture document for a feature/project. |
| `/greenfield:scaffold` | Initial project skeleton from an architecture doc. |
| `/brownfield:onboard` | Build `REPOMAP.md` + first-impressions summary. |
| `/brownfield:feature` | Add a feature: PRD → architecture delta → stories. |
| `/brownfield:bugfix` | Triage + fix a bug (debugger first, minimum change, regression test). |
| `/brownfield:refactor` | Propose + apply a behavior-preserving refactor. |

## Skills — `.claude/skills/`

All model-invoked: loaded on trigger-match against `description`, never called by name. (Agents and commands, above, are user-invoked — reached only by explicit reference. See `skill-authoring` for the full distinction.)

| Skill | Does |
|---|---|
| `obsidian` | Drive the `memory/` vault via MCP / CLI / git sync. |
| `test-driven-development` | RED→GREEN→REFACTOR discipline; operationalizes Rule 9. Referenced by `implementer`, `test-author`, `/implement`. |
| `systematic-debugging` | Reproduce → hypothesize → falsify → root cause → fix + regression. Referenced by `debugger`, `/brownfield:bugfix`. |
| `skill-authoring` | Invocation-scope check + failure-mode pass (premature completion, sediment, negation, …) for anything added under `.claude/agents/`, `.claude/commands/`, `.claude/skills/`. |

## Hooks — `.claude/hooks/` (wired in `.claude/settings.json`)

| Hook | Event | Does |
|---|---|---|
| `session-start.sh` | `SessionStart` | Injects a compact scaffold orientation (routing table + skills table) plus a reminder to check the memory vault for relevant prior context. |
| `pre-compact-memory-sync.sh` | `PreCompact` | Reminds the agent to persist durable decisions/learnings to the memory vault before context is compacted away. |
| `task-completed-memory-sync.sh` | `TaskCompleted` | Reminds the agent to capture a vault note when a completed task produced something durable (not every task). |

## Templates — `templates/`

Typed artifact skeletons. Commands instantiate them into `docs/<type>/<slug>.md`; don't copy by hand.

`adr` · `architecture` · `brief` · `changelog` · `data-model` · `incident` · `learning` (two-track: bug/knowledge) · `migration-plan` · `postmortem` · `pr-body` (incl. Post-Deploy Validation) · `prd` · `repomap` · `runbook` · `story` · `stack-mappings.json`

## Contexts — `contexts/`

System-prompt mode files for `claude --system-prompt "$(cat contexts/<mode>.md)"`.

`dev` · `review` · `research` · `debug`
