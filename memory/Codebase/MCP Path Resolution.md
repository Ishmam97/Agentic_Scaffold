---
type: gotcha
status: active
created: '2026-06-17'
updated: '2026-06-17'
tags:
  - codebase
  - gotcha
  - mcp
  - config
  - codex
---
# MCP Path Resolution

MCP server args and `cwd` resolve relative to the **process launch directory**, not the config file location.

## The gotcha

Two failure modes, same root cause:

- `cwd = ".."` in `.codex/config.toml` means *one level above the repo root* (not one level above `.codex/`). Node can't find `vendor/mcpvault/dist/server.js`, crashes before the MCP handshake, session starts with `⚠ MCP startup incomplete`.
- Stripping `${CLAUDE_PROJECT_DIR:-.}` from `.mcp.json` args removes the portability guard. Commit `4617e94` added it deliberately; `a07d0a5` removed it silently.

## The rules

- `.codex/config.toml` MCP block: use `cwd = "."` to anchor to repo root.
- `.mcp.json` args: keep `${CLAUDE_PROJECT_DIR:-.}/vendor/...` and `${CLAUDE_PROJECT_DIR:-.}/memory` — do not strip.
- Diagnosis signal: "connection closed: initialize response" with no other output = node crashed before MCP handshake = path resolution failure.

## Related

- Learning artifact: `../../docs/learnings/2026-06-17-mcp-path-resolution.md`
- Commits: [[4617e94]] (original intent), [[a07d0a5]] (regression), 2026-06-17 session (fix)

[[Codebase Map]]
"
