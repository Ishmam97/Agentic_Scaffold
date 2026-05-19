# agentic_swe

A Claude Code-native scaffold for full-lifecycle software engineering. Brings opinionated multi-agent workflows — borrowing the best ideas from BMAD-METHOD, MetaGPT, ChatDev, SuperClaude, OpenHands, and Aider — into a flat, composable toolkit you can drop into any project.

## What you get

- **17 specialist subagents** (`.claude/agents/`) — analyst, pm, architect, tech-researcher, planner, implementer, test-author, code-reviewer, security-auditor, perf-auditor, debugger, refactorer, docs-writer, repo-mapper, migration-planner, release-manager, data-modeler.
- **17 slash commands** (`.claude/commands/`) for greenfield (`/greenfield:kickoff`, `/greenfield:prd`, …), brownfield (`/brownfield:onboard`, `/brownfield:feature`, …), and everyday operations (`/implement`, `/review`, `/ship`, `/adr`, `/migrate`, `/release`, `/postmortem`, `/story`).
- **11 typed artifact templates** (`templates/`) so PRDs, architecture docs, stories, ADRs, migrations, changelogs, postmortems, data models, briefs, repo maps, and PR bodies all have a consistent shape.
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

## Design principles

Full discussion in [CLAUDE.md](./CLAUDE.md). In short:

1. **Typed artifacts beat chat.** PRDs, architectures, stories, ADRs as files — not chat history.
2. **Architect → Editor split.** Plan with a heavy model; edit with a cheaper one.
3. **Stories are self-contained context units.** Survive `/clear`.
4. **Brownfield starts with the repo map.**
5. **Reviews fan out in parallel.**

## File layout

```
.claude/agents/      # 17 role-based subagents
.claude/commands/    # 17 slash commands (greenfield/, brownfield/, root)
.claude/settings.json
templates/           # 11 artifact templates
docs/                # Generated artifacts land here (briefs/, prd/, architecture/, ...)
examples/            # Worked examples (placeholder)
CLAUDE.md            # Operating principles
```

## Customizing

- **Add an agent:** drop a markdown file in `.claude/agents/` with frontmatter (`name:`, `description:`, optional `tools:`/`model:`) and a system prompt body. See `architect.md` for a reference shape.
- **Add a command:** drop a markdown file in `.claude/commands/`. Use `$ARGUMENTS`, `!`-prefixed bash, and `@`-prefixed file refs. Namespace via subdirs (`.claude/commands/foo/bar.md` → `/foo:bar`).
- **Add a template:** drop a `*.tmpl.md` in `templates/` and reference it from a command or agent.
- **Add hooks:** wire shell commands to events (PreToolUse, PostToolUse, Stop, etc.) in `.claude/settings.json`. Useful for auto-format, auto-test, blocking risky commands.

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
