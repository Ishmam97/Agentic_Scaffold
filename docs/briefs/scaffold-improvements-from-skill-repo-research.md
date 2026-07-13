# Brief: Scaffold Improvements from External Skill-Repo Research

**Date:** 2026-07-12
**Sources analyzed:** `examples/ponytail` (DietrichGebert/ponytail), `examples/caveman` (JuliusBrussee/caveman), `examples/skills` (mattpocock/skills)
**Method:** Two Sonnet (xhigh) agents independently analyzed the three cloned repos for patterns transferable to agentic_swe's `.claude/` scaffold (agents, commands, skills).

## Summary

All three repos are, in one form or another, collections of Claude Code (and multi-agent-platform) **skills** — self-contained behavioral or workflow units with YAML frontmatter. None target a PRD→architecture→stories pipeline like agentic_swe; they're narrower (behavior modifiers, personal engineering toolkits). But each has mature conventions around skill *authoring discipline*, *invocation semantics*, and *review/eval methodology* that agentic_swe's current skill format (one-line frontmatter rule in CLAUDE.md) doesn't yet formalize.

## Recommendations, ranked by leverage

### 1. Formalize model-invoked vs. user-invoked skills (from mattpocock/skills)
Add an explicit axis to the skill frontmatter convention: skills that should only ever be reached by literal invocation (`/command`) vs. skills discoverable by the model via rich trigger-phrase descriptions. Document the rule that a user-invoked skill cannot itself invoke another user-invoked skill (only a human or a model-invoked skill can). This clarifies which of agentic_swe's skills (e.g. `test-driven-development`, `systematic-debugging` — meant to be picked up implicitly) vs. commands (`/review`, `/ship` — meant to be invoked explicitly) actually need the router-disambiguating "Use when X, do NOT use for Y" treatment, and which don't.

**Action:** Add a line to CLAUDE.md's frontmatter rule and `.claude/INDEX.md` documenting this distinction.

### 2. Adopt a "writing good skills" failure-mode checklist (from mattpocock/skills)
`writing-great-skills/SKILL.md` names concrete failure modes: premature completion, duplication, sediment (stale instructions nobody prunes), sprawl, no-op instructions, and negation (telling the model NOT to do X makes X more salient — state the positive target instead). agentic_swe has no equivalent QA lens when authoring or pruning skills.

**Action:** Add a short checklist to the `obsidian`/`test-driven-development`/`systematic-debugging` skill authoring convention, or a new lightweight `skill-authoring` note in `.claude/INDEX.md`, referencing these named pitfalls.

### 3. Self-tagging deferred-debt convention + harvesting check (from ponytail)
Ponytail's skill instructs the agent to leave `# ponytail: <ceiling>, <upgrade trigger>` marker comments wherever it deliberately cuts a corner, then a companion skill greps these into a ledger. agentic_swe has `docs/learnings/` and ADRs for durable decisions, but no equivalent for "I simplified X here, revisit if Y" in-flight notes that are cheaper than a full ADR.

**Action:** Consider a marker convention (e.g. `# scope: <what was deferred>, <trigger to revisit>`) plus a check in `/review` or `/ship` that greps for them and surfaces unresolved ones before a PR.

### 4. Two-axis review mode: Standards vs. Spec (from mattpocock/skills)
mattpocock's `code-review` skill runs two parallel sub-agents on the same diff along different axes — code-quality/smell-baseline (Standards) vs. does-the-diff-match-the-issue/PRD (Spec) — deliberately never merged, since a change can pass one and fail the other. agentic_swe's `/review` currently fans out by *reviewer role* (code/security/perf), which is a different and complementary cut.

**Action:** Consider a `/review --spec` mode or addition to the `review` skill for story-based work: verify the diff against the story's acceptance criteria as an independent axis, alongside the existing role-based reviewers.

### 5. Auto-clarity-style override clause for any format-constraining skill (from caveman)
Caveman's terseness skill has an explicit "Auto-Clarity" escape hatch: drop the compressed style for security warnings, irreversible actions, or ambiguous sequences, then resume. Any agentic_swe skill/rule that constrains output format or behavior tightly should state its own bypass conditions explicitly, the way Rule 12 ("Fail loud") already implicitly demands.

**Action:** Low priority; note as a pattern to apply if a new terseness/format-constraint skill is ever added.

### 6. Behavior-gate tests for graded skill output (from ponytail)
Before trusting an eval or a review skill's output format, ship a unit test that feeds known-good/known-bad sample outputs through the checker and asserts it discriminates correctly. Relevant to any agentic_swe skill whose output is graded downstream (`code-reviewer`, `security-auditor`, `perf-auditor` findings feeding into `/ship`'s gate).

**Action:** Low priority, no immediate gap identified; worth remembering if a scoring/gating mechanism is added to `/ship` or `/review`.

### 7. `.out-of-scope/` knowledge base for rejected requests (from mattpocock/skills)
mattpocock's `triage` skill checks a `.out-of-scope/` directory of previously-rejected feature asks before triaging something as new, avoiding re-litigation.

**Action:** Applicable to `/brownfield:bugfix` and `/brownfield:feature` — consider a `docs/out-of-scope/` convention for rejected proposals, checked by `analyst`/`pm` before drafting a new brief/PRD.

## Explicitly NOT adopting

- **Multi-platform adapter export** (ponytail/caveman ship to 10-30+ agent platforms with per-platform mirrored configs and one test file per adapter). agentic_swe is a single-platform (Claude Code) scaffold; this is pure maintenance tax with no payoff here.
- **Token-compression/terseness skill itself** (caveman's core value prop). Orthogonal to agentic_swe's goal of structured, high-fidelity multi-agent SWE workflows — compressing agent output isn't a felt need in this scaffold.
- **Personal/solo-workflow skills** (mattpocock's `in-progress/`, `deprecated/`, `personal/`, `misc/` buckets, and the interview-style "grilling" flow) — narrower and less battle-tested than the promoted `engineering/` skills; not worth porting wholesale.

## Honesty/rigor precedent worth noting culturally (not a scaffold change)

Both ponytail and caveman document benchmark methodology candidly, including retracting earlier inflated claims once a flaw in their own eval was found (ponytail's `2026-06-16-correctness-gate-fix.md`, caveman's skill-vs-terse rather than skill-vs-baseline comparison). Good precedent for how agentic_swe's own `/postmortem` and `docs/learnings` entries should read when a prior measurement turns out flawed.

## Source detail

Full per-repo findings (file paths, quoted excerpts) are preserved in the two research-agent transcripts from this session; not duplicated here to keep this brief actionable. Ping the session if the underlying detail is needed again.
