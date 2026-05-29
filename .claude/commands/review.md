---
description: Multi-agent review of the current branch — code, security, performance — in parallel.
---

Run a fan-out review of the current branch.

In **parallel** (single message, multiple Agent tool calls), invoke these subagents on the local diff (`git diff <base>...HEAD`):
- `code-reviewer` — correctness, clarity, conventions, error handling.
- `security-auditor` — OWASP-style vulnerabilities, auth/authz, secret handling.
- `perf-auditor` — N+1, hot-path issues, missing indexes.
- `learnings-researcher` — prior lessons/gotchas on the changed files (read-only; surfaces what we've already learned in this area).

When all three return, **aggregate findings into one report grouped by severity**, not by reviewer:

- **[BLOCKER]** / **[CRITICAL]** — must fix before merge.
- **[SHOULD]** / **[HIGH]** — fix or justify.
- **[NIT]** / **[MEDIUM]** / **[LOW]** / **[INFO]** — author discretion.

Cite specific lines for every finding. Note which reviewer surfaced each finding in parentheses (e.g. "(security)"). If `learnings-researcher` surfaced Critical prior lessons, lead the report with a short **Prior lessons** note so they inform the fix.

End with a one-line verdict: ready for PR, or N blockers remaining.
