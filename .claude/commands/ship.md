---
description: Final pre-PR check — tests, lint, docs, story acceptance, PR body draft.
---

Run the final pre-PR checklist:

1. **Tests green.** Run the project's test command (from `REPOMAP.md`). If anything fails, stop and report.
2. **Linter / formatter clean.** Run them. Fix or report.
3. **Story acceptance.** For each story being shipped, walk its acceptance criteria checklist. Confirm each is met — cite the code or test that satisfies it.
4. **Docs.** If APIs, CLIs, or user-visible config changed, check README/docs/CHANGELOG were updated. If not, invoke the `docs-writer` subagent.
5. **PR body draft.** Use `templates/pr-body.tmpl.md`:
   - Summary (1-3 bullets).
   - What changed and why.
   - Test plan.
   - Risk + rollback.
   - Linked story / issue.

Output the PR body to stdout. **Do NOT push or open the PR** — the user does that after review.
