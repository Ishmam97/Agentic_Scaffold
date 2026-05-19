---
description: Write an Architecture Decision Record for a specific decision.
argument-hint: "<decision title>"
---

Decision to record:

> $ARGUMENTS

Invoke the `architect` subagent to write an ADR. The ADR will be written to `docs/adrs/<NNNN>-<slug>.md` using `templates/adr.tmpl.md`.

The architect will determine the next ADR number by reading existing files in `docs/adrs/`.

The ADR captures: context, decision, alternatives considered (with reasons each was rejected), consequences (positive, negative, neutral), status.

After the ADR is written, link it from the relevant architecture doc if one exists.
