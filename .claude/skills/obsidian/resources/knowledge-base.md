# Knowledge-base convention

How agents and commands build up the `memory/` vault as work happens. This is the **single source of truth** for vault structure — agents reference it instead of each restating the layout.

## The split (read this first)

- **`docs/`** = formal, per-task artifacts (PRD, architecture, stories, ADRs, postmortems). The handoff medium between agents. Versioned, structured, one file per task.
- **The vault** = durable, cross-task memory. The connective tissue: *why* we chose things, how concepts relate, how the codebase actually works, what we learned. Its value is the **graph**, not any single note.

Rule of thumb: if it's a deliverable for one task, it goes in `docs/`. If it's knowledge you'd want surfaced six tasks from now, it goes in the vault. **Never copy a `docs/` artifact into the vault** — instead write a short note that links to it (`[[...]]` to vault notes, relative paths to `docs/`) and captures the durable insight.

## Structure

```
memory/
  Home.md            # MOC / dashboard — entry point, links to everything live
  Concepts/          # one note per domain or technical concept (the glossary + ideas)
  Decisions/         # decision-in-context notes — the narrative "why"; link to the ADR
  Features/          # per-feature running note; links to its PRD/architecture/stories
  Codebase/          # how subsystems actually work; gotchas; "where things live"
  Daily/             # YYYY-MM-DD.md session logs (append-only, optional)
```

Folders are light scaffolding; links and tags do the real work. A note can live anywhere as long as it's linked and tagged.

## Note shape

Every note carries frontmatter:

```yaml
---
type: concept | decision | feature | codebase | daily
status: seed | active | stable | superseded
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [topic, area]
related: ["[[Other Note]]"]
---
```

Body conventions:

- **First line answers "what is this".** No preamble.
- **Link generously.** Every note links to at least one other note. Unresolved `[[links]]` are fine — they mark notes worth writing later.
- **Atomic.** One concept per note. If a note grows two topics, split it and link them.
- **Link out to `docs/`** with relative paths when a formal artifact exists: `See ../../docs/architecture/payments.md`.

## Tags

`#concept` `#decision` `#feature` `#codebase` `#daily` `#open-question` `#gotcha`

Add area tags freely (`#auth`, `#billing`). `list_all_tags` shows what's in use — reuse before inventing.

## Write discipline

- **Search before writing.** `search_notes` for the concept/area first; update the existing note rather than creating a near-duplicate.
- **Update, don't append-spam.** Use `patch_note` / `update_frontmatter` to evolve a note; bump `updated`. Reserve `write_note` append mode for logs (Daily) and running lists.
- **Capture the why, not the what.** The diff shows what changed; the vault explains why it mattered.
- **If nothing durable emerged, write nothing.** A task that produced only a routine `docs/` artifact doesn't need a vault note. Don't manufacture knowledge.
- **Keep `Home.md` current.** When you open a new feature or area, add it to the relevant MOC. The librarian role (`docs-writer`) reconciles drift.

## Tool quick-reference

Prefer the MCP tools (frontmatter-safe, sandboxed to the vault):

- Find: `mcp__obsidian__search_notes`, `mcp__obsidian__list_all_tags`, `mcp__obsidian__list_directory`
- Read: `mcp__obsidian__read_note`, `mcp__obsidian__read_multiple_notes`, `mcp__obsidian__get_frontmatter`
- Write: `mcp__obsidian__write_note` (auto-creates folders), `mcp__obsidian__patch_note`, `mcp__obsidian__update_frontmatter`, `mcp__obsidian__manage_tags`

See `tool-patterns.md` for response shapes and the `patch_note` multi-match gotcha.
