---
description: Capture a lesson as a typed artifact in docs/learnings/ AND a linked note in the memory vault. Use when "save this lesson", "/learn", "remember this for next time". Do NOT use for routine session logs or anything already in AGENTS.md / an ADR.
argument-hint: "<one-line topic>"
---

Learning topic:

> $ARGUMENTS

## How to handle this

1. **Decide what's worth saving.** Capture it only if it's **non-obvious** AND **reusable** AND **not already** in `AGENTS.md`, an ADR, a story, or an architecture doc. Fails any one → say so and stop. **Don't manufacture a learning to justify the command.**

2. **Check for overlap first.** Grep `docs/learnings/` for the same `component:` / `tags:`, and `mcp__obsidian__search_notes` the vault for the topic. If a strong match exists, **update that artifact and its vault note** (bump `date`) instead of creating a near-duplicate. If it's ambiguous, ask the user: update or new?

3. **Pick the track and write the typed artifact.** `bug` (a defect diagnosed and fixed) or `knowledge` (a pattern, convention, or decision). Instantiate `templates/learning.tmpl.md` at `docs/learnings/<YYYY-MM-DD>-<kebab-slug>.md`, filling the frontmatter — `track`, `component`, `tags`, `severity`, and the track-specific fields — from this session's real events: real paths, error messages, commit refs. Under 100 lines.

4. **Dual-write to the vault** (follow `.agents/skills/obsidian/resources/knowledge-base.md`). Write a **short linked note — not a copy**:
   - **bug track →** `Codebase/<subsystem>.md`: the durable gotcha ("X fails when Y because Z"), tag `#gotcha` + the area. Update the note if it already exists rather than appending a duplicate.
   - **knowledge track →** `Concepts/` (or the relevant area note), tag `#concept` + the area.
   - Use the vault frontmatter convention; first line answers "what is this"; link back to the artifact with a relative path (`../../docs/learnings/<file>`); add at least one `[[wikilink]]`. Set the artifact's `vault_note:` field to this note's title. If the area is new, add it to the right MOC / `Home.md`.

5. **Discoverability check.** Confirm the project's `AGENTS.md` surfaces `docs/learnings/` (the scaffold's does, via § Memory vault + the Knowledge Verification Chain). If a project's doesn't, propose the smallest addition so a fresh session knows the store exists — informational, not imperative ("relevant when working in documented areas", not "always search first", which causes redundant reads).

6. **Cross-link, don't enact.** If the learning implies scaffold edits, list them under "Suggested updates" in the artifact. **Don't make those edits here** — the user decides which become real.

7. **Report:** artifact path, vault note title, the one-line takeaway, and any suggested updates.

## What not to do

- Don't write a session log dressed as a learning — the artifact is for transferable insight, not narration.
- Don't copy the artifact into the vault — write a short linked note; the graph is the value.
- Don't duplicate an existing learning — update it.
- Don't auto-apply the suggested scaffold updates. Surface them; the user decides.
