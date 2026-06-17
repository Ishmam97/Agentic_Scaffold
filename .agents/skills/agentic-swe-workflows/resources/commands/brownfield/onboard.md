---
description: Onboard to an existing repo — build REPOMAP.md and produce a first-impressions summary.
---

Invoke the `repo-mapper` subagent. It will:
1. Survey repo structure, language(s), build/test/run commands.
2. Identify the architectural pattern.
3. Identify load-bearing files.
4. Write `REPOMAP.md` at repo root using `templates/repomap.tmpl.md`.

After the map is written, give the user a 5-line "first-impressions" summary:
- What this codebase is.
- Primary language(s) and framework(s).
- How to build/test/run locally.
- The architectural pattern in one sentence.
- The single most important thing to know before touching it.

## Seed the memory vault

`repo-mapper` produces the structural index (`REPOMAP.md`); now mirror the **durable understanding** into the vault. Do this yourself in the main context — `repo-mapper` has restricted tools and can't reach the `obsidian` MCP server. Per `.agents/skills/obsidian/resources/knowledge-base.md`:

1. Confirm the `obsidian` server is connected (`mcp__obsidian__list_directory` on `Codebase`). If not, tell the user to reload / check `/mcp` and skip the vault step.
2. Write/refresh `Codebase/<subsystem>.md` notes for the load-bearing areas — how each works, where things live, and any gotcha worth a `#gotcha` tag. This is the hard-won understanding, not a re-list of files (that's `REPOMAP.md`'s job — link to it).
3. Update `Codebase Map.md` and `Home.md` to link the new notes.

Keep it to the few subsystems that actually matter. Don't transcribe the whole repo.

Offer next steps: `/brownfield:feature`, `/brownfield:bugfix`, or `/brownfield:refactor`.
