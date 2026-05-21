# docs/

Generated artifacts from the agent workflows land here. These are the project's persistent memory — checked in by default so they're available to future sessions and other contributors.

| Folder | What lives here | Produced by |
|---|---|---|
| `briefs/` | Project briefs | `analyst` |
| `prd/` | Product requirements docs | `pm` |
| `architecture/` | System architecture docs | `architect` |
| `stories/` | Self-contained implementation stories | `planner` |
| `adrs/` | Architecture Decision Records | `architect` |
| `postmortems/` | Incident postmortems (retrospective) | `debugger` + user |
| `migrations/` | Migration plans | `migration-planner` |
| `data-models/` | Data model designs | `data-modeler` |
| `incidents/` | Live incident artifacts (contemporaneous record) | on-call + user |
| `runbooks/` | Operational procedures | `docs-writer` or owner team |
| `learnings/` | Transferable lessons captured mid-flight | `/learn` |

## Naming conventions

- Briefs, PRDs, architectures, migrations, data models, runbooks: `<slug>.md` (kebab-case).
- Stories: `<NNN>-<slug>.md` (zero-padded sequential, starting at `001`).
- ADRs: `<NNNN>-<slug>.md` (zero-padded sequential, starting at `0001`).
- Postmortems, incidents, learnings: `<YYYY-MM-DD>-<slug>.md`.

## If you don't want these in git

Uncomment the relevant lines in the root `.gitignore`.
