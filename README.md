# agentic_swe

A Claude Code-native scaffold for full-lifecycle software engineering. Brings opinionated multi-agent workflows — borrowing the best ideas from BMAD-METHOD, MetaGPT, ChatDev, SuperClaude, OpenHands, and Aider — into a flat, composable toolkit you can drop into any project.

## What you get

- **18 specialist subagents** (`.claude/agents/`) — analyst, pm, architect, tech-researcher, planner, implementer, test-author, code-reviewer, security-auditor, perf-auditor, debugger, refactorer, docs-writer, repo-mapper, migration-planner, release-manager, data-modeler, devils-advocate.
- **21 slash commands** (`.claude/commands/`) for greenfield (`/greenfield:kickoff`, `/greenfield:prd`, …), brownfield (`/brownfield:onboard`, `/brownfield:feature`, …), everyday operations (`/implement`, `/review`, `/ship`, `/adr`, `/migrate`, `/release`, `/postmortem`, `/story`), and session utilities (`/aside`, `/checkpoint`, `/learn`, `/challenge`).
- **15 typed artifact templates** (`templates/`) — PRDs, architecture docs, stories, ADRs, migrations, changelogs, postmortems, data models, briefs, repo maps, PR bodies, plus incident reports, runbooks, learnings, and a stack-mappings reference.
- **4 mode contexts** (`contexts/`) — `dev`, `review`, `research`, `debug`. Layer on top of `CLAUDE.md` via `claude --system-prompt "$(cat contexts/<mode>.md)"` when the same project needs a different stance.
- **A `REPOMAP.md` workflow** for brownfield grounding — agents reference it instead of re-deriving structure each session.

## Quick start

1. Clone as a starter:
   ```bash
   git clone <this-repo-url> my-project
   cd my-project
   rm -rf .git && git init
   ```

2. Open in Claude Code. Verify slash commands appear: type `/` and look for the `greenfield:` and `brownfield:` groups.

3. Pick your starting point:
   - **New project:** `/greenfield:kickoff "build a real-time pair-coding app"`
   - **Existing repo:** `/brownfield:onboard`

4. Read the **Claude Code tips** — open [`tips.html`](./tips.html) in a browser for the styled version, or [`tips.txt`](./tips.txt) for plain text. Context-economy tips that make this scaffold's typed-artifact workflow pay off.

## Design principles

Full discussion in [CLAUDE.md](./CLAUDE.md). In short:

1. **Typed artifacts beat chat.** PRDs, architectures, stories, ADRs as files — not chat history.
2. **Architect → Editor split.** Plan with a heavy model; edit with a cheaper one.
3. **Stories are self-contained context units.** Survive `/clear`.
4. **Brownfield starts with the repo map.**
5. **Reviews fan out in parallel.**

## File layout

```
.claude/agents/      # 18 role-based subagents
.claude/commands/    # 21 slash commands (greenfield/, brownfield/, root)
.claude/settings.json
templates/           # 15 artifact templates (+ stack-mappings.json)
contexts/            # 4 mode prompts for --system-prompt layering
docs/                # Generated artifacts land here (briefs/, prd/, ...)
examples/            # Worked examples (placeholder)
CLAUDE.md            # Operating principles
tips.html / tips.txt # Claude Code usage tips (styled / plain)
```

## Customizing

- **Add an agent:** drop a markdown file in `.claude/agents/` with frontmatter (`name:`, `description:`, optional `tools:`/`model:`) and a system prompt body. See `architect.md` for a reference shape.
- **Add a command:** drop a markdown file in `.claude/commands/`. Use `$ARGUMENTS`, `!`-prefixed bash, and `@`-prefixed file refs. Namespace via subdirs (`.claude/commands/foo/bar.md` → `/foo:bar`).
- **Add a template:** drop a `*.tmpl.md` in `templates/` and reference it from a command or agent.
- **Add hooks:** wire shell commands to events (PreToolUse, PostToolUse, Stop, etc.) in `.claude/settings.json`. Useful for auto-format, auto-test, blocking risky commands.

**Add Pulgins:** Add custom plugins like superpowers https://github.com/obra/superpowers , https://github.com/colbymchenry/codegraph etc.

## Credits

Patterns borrowed from:

- [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) — story files as context units, typed planning artifacts, two-phase planning/dev cycle.
- [MetaGPT](https://github.com/geekan/MetaGPT) — typed artifact handoffs, SOPs, documents as the medium of inter-agent communication.
- [ChatDev](https://github.com/OpenBMB/ChatDev) — declarative phase pipelines, paired instructor/assistant dialogues.
- [SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework) — Claude Code-native layering, persona auto-activation, flag systems.
- [OpenHands](https://github.com/All-Hands-AI/OpenHands) — microagent trigger pattern (condition-activated context injection).
- [Aider](https://github.com/Aider-AI/aider) — repo map as grounding artifact, architect/editor split.

## License

Add your preferred license. MIT is a reasonable default for a template like this.
