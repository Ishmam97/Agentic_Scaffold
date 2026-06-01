# Forge ~ agentic swe scaffold

A Claude Code-native scaffold for full-lifecycle software engineering. Brings opinionated multi-agent workflows — borrowing the best ideas from BMAD-METHOD, MetaGPT, ChatDev, SuperClaude, OpenHands, and Aider — into a flat, composable toolkit you can drop into any project.

## What you get

- **20 specialist subagents** (`.claude/agents/`) — analyst, pm, architect, tech-researcher, planner, implementer, test-author, code-reviewer, security-auditor, perf-auditor, debugger, refactorer, docs-writer, repo-mapper, migration-planner, release-manager, committer, data-modeler, devils-advocate, learnings-researcher.
- **22 slash commands** (`.claude/commands/`) for ideation (`/brainstorm`), greenfield (`/greenfield:kickoff`, `/greenfield:prd`, …), brownfield (`/brownfield:onboard`, `/brownfield:feature`, …), everyday operations (`/implement`, `/review`, `/ship`, `/adr`, `/migrate`, `/release`, `/postmortem`, `/story`), and session utilities (`/aside`, `/checkpoint`, `/learn`, `/challenge`).
- **3 skills** (`.claude/skills/`) — `test-driven-development` and `systematic-debugging` are disciplines that load on trigger and back the implementer/test-author/debugger; `obsidian` drives the memory vault.
- **A `SessionStart` hook** (`.claude/hooks/`) — injects a scaffold orientation into every session, so commands and skills are discoverable from turn one. No setup required.
- **15 typed artifact templates** (`templates/`) — PRDs, architecture docs, stories, ADRs, migrations, changelogs, postmortems, data models, briefs, repo maps, PR bodies, plus incident reports, runbooks, learnings (typed two-track), and a stack-mappings reference.
- **4 mode contexts** (`contexts/`) — `dev`, `review`, `research`, `debug`. Layer on top of `CLAUDE.md` via `claude --system-prompt "$(cat contexts/<mode>.md)"` when the same project needs a different stance.
- **A scaffold index** (`.claude/INDEX.md`) — the one-line map of every agent, command, skill, hook, and template; the place to look when picking a tool.
- **A `REPOMAP.md` workflow** for brownfield grounding — agents reference it instead of re-deriving structure each session.

## Quick start

1. **Clone as a starter:**
   ```bash
   git clone <this-repo-url> my-project
   cd my-project
   rm -rf .git && git init
   ```

2. **Open in Claude Code.** The `SessionStart` hook injects a scaffold orientation automatically. Type `/` to confirm the `greenfield:` and `brownfield:` command groups appear. The full tool map is **[`.claude/INDEX.md`](./.claude/INDEX.md)** — start there to pick a tool.

3. **Pick your starting point:**
   - **Rough idea, scope still fuzzy:** `/brainstorm "real-time pair-coding app"` — explores it one question at a time, then hands off to a brief/PRD.
   - **New project:** `/greenfield:kickoff "build a real-time pair-coding app"`
   - **Existing repo:** `/brownfield:onboard`

4. **(Recommended) Set up the memory vault** for durable cross-session knowledge — one `npm install`, then reload Claude Code. See [Memory vault](#memory-vault-obsidian) below. Everything else (agents, commands, skills, the hook) works with no setup.

5. **Get oriented:** the operating contract is [CLAUDE.md](./CLAUDE.md) (add your project's facts under its `§ Project context`). Read the Claude Code tips — [`tips.html`](./tips.html) (styled) or [`tips.txt`](./tips.txt) (plain).

## Adding to an existing project (brownfield)

Don't clone the scaffold *as* your project — drop its pieces **into** your existing repo, then let it map your codebase. Everything you copy is additive; none of it contains your source.

1. **Copy the scaffold in.** Clone this repo alongside yours (`../agentic_swe`), then from your project root:
   ```bash
   rsync -a --ignore-existing ../agentic_swe/.claude/    .claude/     # agents, commands, skills, hooks, INDEX
   rsync -a --ignore-existing ../agentic_swe/templates/  templates/
   rsync -a --ignore-existing ../agentic_swe/contexts/   contexts/
   # optional — durable memory vault:
   cp    -n  ../agentic_swe/.mcp.json  .
   rsync -a --ignore-existing ../agentic_swe/vendor/  vendor/
   rsync -a --ignore-existing ../agentic_swe/memory/  memory/
   ```
   `--ignore-existing` / `cp -n` are **no-clobber** — they never overwrite files you already have. (No `rsync`? Copy the folders by hand; just don't replace your own files.)

2. **Merge `CLAUDE.md`, don't overwrite it.** Already have one? Keep your project facts and paste in the scaffold's *Operating principles*, *Conventions*, *Knowledge verification chain*, *Delegation matrix*, and *Rules* — or adopt the scaffold's `CLAUDE.md` and move your existing notes under its `§ Project context`. No `CLAUDE.md` yet? Use the scaffold's as-is.

3. **Merge `.gitignore`.** Add the scaffold's entries (`.claude/settings.local.json`, `throwaway/`, `vendor/**/node_modules/`, the `memory/**/.obsidian/` cruft).

4. **Reload Claude Code, then map the repo:**
   ```
   /brownfield:onboard
   ```
   This builds `REPOMAP.md` — the living index every agent leans on — and hands back a first-impressions summary. Run it once; refresh it when the codebase shifts.

5. **Fill `CLAUDE.md` § Project context** — stack, build/test/lint commands, key domains, hard constraints. (`/brownfield:onboard` proposes most of this for you.)

6. **Work the repo:**
   - New capability → `/brownfield:feature "..."` → PRD → architecture delta → stories → `/implement <story>`.
   - Bug → `/brownfield:bugfix "..."` → debugger (via the `systematic-debugging` skill) → minimum fix → regression test.
   - Cleanup → `/brownfield:refactor "<area>"` (behavior-preserving).
   - Close with `/review` (parallel code+security+perf) then `/ship` (verification-gated pre-PR check).

> **Already using Claude Code in this repo?** The scaffold is purely additive — your existing settings, MCP servers, and `CLAUDE.md` stay; you're adding agents, commands, skills, templates, and one SessionStart hook beside them. Skip the `.mcp.json` / `vendor` / `memory` lines if you don't want the vault.

## Design principles

Full discussion in [CLAUDE.md](./CLAUDE.md). In short:

1. **Typed artifacts beat chat.** PRDs, architectures, stories, ADRs as files — not chat history.
2. **Architect → Editor split.** Plan with a heavy model; edit with a cheaper one.
3. **Stories are self-contained context units.** Survive `/clear`.
4. **Brownfield starts with the repo map.**
5. **Reviews fan out in parallel.**
6. **Disciplines are skills.** TDD and systematic debugging load on trigger; agents reference them instead of restating the method.

## File layout

```
.claude/agents/      # 20 role-based subagents
.claude/commands/    # 22 slash commands (greenfield/, brownfield/, root)
.claude/skills/      # 3 skills: test-driven-development, systematic-debugging, obsidian
.claude/hooks/       # SessionStart orientation hook
.claude/INDEX.md     # one-line map of agents/commands/skills/hooks/templates
.claude/settings.json
.mcp.json            # project MCP servers (obsidian memory vault)
templates/           # 15 artifact templates (+ stack-mappings.json)
contexts/            # 4 mode prompts for --system-prompt layering
docs/                # Generated artifacts land here (briefs/, prd/, learnings/, ...)
memory/              # Obsidian memory vault (durable, cross-session notes)
vendor/mcpvault/     # vendored Obsidian MCP server (MIT, bitbonsai)
examples/            # Worked examples (placeholder)
CLAUDE.md            # Operating contract (objective rules + § Project context)
tips.html / tips.txt # Claude Code usage tips (styled / plain)
```

## Customizing

- **Add an agent:** drop a markdown file in `.claude/agents/` with frontmatter (`name:`, `description:`, optional `tools:`/`model:`) and a system prompt body. See `architect.md` for a reference shape.
- **Add a command:** drop a markdown file in `.claude/commands/`. Use `$ARGUMENTS`, `!`-prefixed bash, and `@`-prefixed file refs. Namespace via subdirs (`.claude/commands/foo/bar.md` → `/foo:bar`).
- **Add a template:** drop a `*.tmpl.md` in `templates/` and reference it from a command or agent.
- **Add a skill:** create `.claude/skills/<name>/SKILL.md` with frontmatter (`name:`, `description:`); put long references in a `resources/` subdir, loaded on demand. See `systematic-debugging/` for a reference shape.
- **Add hooks:** wire shell commands to events (PreToolUse, PostToolUse, Stop, SessionStart, …) in `.claude/settings.json`. The scaffold already ships one as a working example — `.claude/hooks/session-start.sh` (SessionStart orientation). Useful for auto-format, auto-test, blocking risky commands.

After adding any agent/command/skill/hook, add a one-line entry to `.claude/INDEX.md` so it stays the source of truth.

**Add plugins:** Add custom plugins like [superpowers](https://github.com/obra/superpowers), [codegraph](https://github.com/colbymchenry/codegraph), etc.

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

**Reference repositories studied** — analyzed in depth (see the round reports in `throwaway/`) to harden the agents, commands, skills, and hooks:

- [obra/superpowers](https://github.com/obra/superpowers) — the SessionStart-hook pattern, `verification-before-completion` gate, TDD & systematic-debugging disciplines, rationalization tables.
- [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — the compounding learning loop (typed learnings → researcher → recall), script-first architecture.
- [shinpr/claude-code-workflows](https://github.com/shinpr/claude-code-workflows) — evidence-gated workflows, stub detection, `runnableCheck` strictness, document scope walls, ADR triggers.
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — Doubt-Driven Development, anti-rationalization tables, "NOTICED BUT NOT TOUCHING" scope discipline, working hooks.
- [tech-leads-club/agent-skills](https://github.com/tech-leads-club/agent-skills) — right-sizing tiers, the knowledge-verification chain, the sub-agent delegation matrix, the description standard.
- [snarktank/ai-dev-tasks](https://github.com/snarktank/ai-dev-tasks) — lettered-options clarifying questions, two-phase plan-then-expand.
- [cpjet64/vibecoding](https://github.com/cpjet64/vibecoding) — the AI-code-failure taxonomy, incident/runbook templates, MoSCoW prioritization.
- [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) — the surgical-change discipline (Karpathy's principles).
- [affaan-m/ECC](https://github.com/affaan-m/ECC) — reviewer anti-slop guardrails, `/aside` & `/checkpoint`, the `contexts/` mode-file pattern.

Memory vault powered by [bitbonsai/mcpvault](https://github.com/bitbonsai/mcpvault) (MIT), vendored at `vendor/mcpvault/`.

## License

Add your preferred license. MIT is a reasonable default for a template like this.
