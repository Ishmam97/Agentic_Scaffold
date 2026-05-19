# Story <NNN>: <Title>

**Status:** Draft | Ready | In Progress | Done
**PRD:** [link]
**Architecture:** [link to section]
**Estimate:** <hours/days>
**Depends on:** <story numbers, or none>

## Goal
One sentence. What ships.

## Architectural context
Quoted slice of the architecture doc relevant to this story. Include the relevant components, the data flow segment, and any contracts this story implements. (This makes the story survive `/clear`.)

## Affected files
From `REPOMAP.md` (for brownfield) or the scaffold plan (for greenfield). One line per file describing the kind of change.

- `path/to/file.ext` — <add | modify | delete>: <one-line description>

## Acceptance criteria
- [ ] ...
- [ ] ...
- [ ] ...

## Test plan
- **Happy path:** ...
- **Edge cases:** ...
- **Error paths:** ...
- **Regression:** if fixing a bug, the test that fails on old code and passes on new.

## Out of scope
Things adjacent to this story that aren't part of it.

## Notes for implementer
Subtle constraints, prior decisions, or "watch out for X" that an implementer wouldn't derive from the files alone.
