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
.claude/skills/      # skills (e.g. obsidian — drives the memory vault)
.claude/settings.json
.mcp.json            # project MCP servers (obsidian memory vault)
templates/           # 15 artifact templates (+ stack-mappings.json)
contexts/            # 4 mode prompts for --system-prompt layering
docs/                # Generated artifacts land here (briefs/, prd/, ...)
memory/              # Obsidian memory vault (durable, cross-session notes)
vendor/mcpvault/     # vendored Obsidian MCP server (MIT, bitbonsai)
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

## Memory vault (Obsidian)

The scaffold ships with an Obsidian-backed **memory vault** for durable, cross-session knowledge — running notes, linked concepts, and the "why" that spans tasks. It complements the per-task typed artifacts in `docs/` (it doesn't replace them).

**How it's wired:**

- **Vault:** `memory/` — a normal Obsidian vault (`.md` files + `.obsidian/` config). Open it in Obsidian directly.
- **MCP server:** [`@bitbonsai/mcpvault`](https://github.com/bitbonsai/mcpvault) (MIT), vendored at `vendor/mcpvault/`. Exposes 15 tools (`read_note`, `write_note`, `patch_note`, `search_notes`, `manage_tags`, …) with frontmatter-safe writes.
- **Config:** committed `.mcp.json` launches the server via `node vendor/mcpvault/dist/server.js` against the vault. Paths use `${CLAUDE_PROJECT_DIR:-.}` so the config is portable.
- **Skill:** `.claude/skills/obsidian/` routes vault operations across MCP, the Obsidian CLI, and git sync.

**One-time setup after cloning:**

1. **Install Obsidian** (free desktop app — needed to view/edit the vault as a human; the MCP server itself runs headless and works without it).

   - **macOS:** `brew install --cask obsidian` — or download the `.dmg` from [obsidian.md/download](https://obsidian.md/download).
   - **Windows:** `winget install Obsidian.Obsidian` — or grab the installer from [obsidian.md/download](https://obsidian.md/download).
   - **Linux:** AppImage / `.deb` / `.rpm` from [obsidian.md/download](https://obsidian.md/download), or `flatpak install flathub md.obsidian.Obsidian`, or `snap install obsidian --classic`.

2. **Install MCP server deps:**

   ```bash
   cd vendor/mcpvault && npm install   # installs runtime deps (node_modules is gitignored)
   # dist/ is committed, so no build needed; to rebuild: npm run build
   ```

3. **Open the vault in Obsidian:** launch Obsidian → *Open folder as vault* → pick this repo's `memory/` directory. The `.obsidian/` config is already committed, so workspace and plugin settings come along.

4. **Reload Claude Code** so it picks up `.mcp.json`. Verify with `/mcp` — you should see the `obsidian` server connected.

**Pointing at your own vault:** edit the vault path in `.mcp.json` (the second `args` entry). The default points at `memory/` itself; change it if you keep your vault elsewhere.

> The contents of `memory/` are left untracked by default — your notes are yours. If you want them in git, the `obsidian` skill has a git-sync mode (commit/pull/push, no force) that can manage the vault as its own synced store.

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
