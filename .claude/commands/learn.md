---
description: Capture a lesson from this session as a typed learning artifact in docs/learnings/.
argument-hint: "<one-line topic>"
---

Learning topic:

> $ARGUMENTS

## How to handle this

1. **Decide what's worth saving.** A learning is worth capturing only if it's:
   - Non-obvious (a senior engineer encountering this codebase cold wouldn't know it), AND
   - Reusable (will save time or prevent a mistake in a future session), AND
   - Not already documented in `CLAUDE.md`, an ADR, a story, or an architecture doc.

   If it fails any of these, say so and stop. **Don't manufacture a learning to justify the command.**

2. **Instantiate** `templates/learning.tmpl.md` at `docs/learnings/<YYYY-MM-DD>-<kebab-slug>.md`. Slug from the topic.

3. **Fill the template** from this session's actual events — what you tried, what didn't work, what did, and the principle to extract. Quote real file paths, real error messages, real commit refs. Keep it tight: under 100 lines is the target.

4. **Cross-link.** If the learning suggests an update to `CLAUDE.md`, an agent prompt, a template, or a command, name those explicitly under "Suggested updates" in the artifact. **Don't make those edits in the same command** — the user decides which suggestions become real changes.

5. **Report:** path to the new file, the one-line takeaway, and the suggested updates (if any).

## What not to do

- Don't write a learning that is really just a session log. The artifact is for transferable insight, not narration.
- Don't write a learning that's already in `CLAUDE.md` or another doc — link to the existing doc instead.
- Don't auto-apply the suggested updates. Surface them, don't enact them.
