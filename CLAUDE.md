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

## Conventions

- Artifacts live in `docs/<type>/<slug>.md` (e.g. `docs/prd/payments-redesign.md`).
- Stories are named `docs/stories/<NNN>-<slug>.md` (zero-padded, sequential).
- ADRs are numbered: `docs/adrs/<NNNN>-<slug>.md`.
- Postmortems: `docs/postmortems/<YYYY-MM-DD>-<slug>.md`.
- Agents are role nouns (`architect.md`); commands are verbs or namespaced (`/implement`, `/greenfield:prd`).

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

## What not to do

- Don't skip the story file for non-trivial work — it's the context container.
- Don't manually copy template content; commands handle template instantiation.
- Don't write code in the architect step or design in the implementer step — keep the split clean.
- Don't bypass `/brownfield:onboard` for an unfamiliar repo. The repo map is cheap and other agents lean on it.
