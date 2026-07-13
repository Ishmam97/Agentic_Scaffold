---
track: bug
title: MCP server paths must be anchored to repo root — cwd shifts and prefix stripping both break resolution
date: 2026-06-17
component: mcp
tags: [mcp, config, codex, path-resolution, obsidian]
severity: high
problem_type: config
symptoms: "MCP client for `obsidian` failed to start: handshaking with MCP server failed: connection closed: initialize response"
root_cause: Two related config mistakes both resolve relative paths against the wrong cwd — (1) `cwd = ".."` in `.codex/config.toml` shifted the working directory one level above the repo root, so `vendor/mcpvault/dist/server.js` could not be found and node exited before the MCP handshake completed; (2) commit `a07d0a5` stripped the `${CLAUDE_PROJECT_DIR:-.}` prefix from `.mcp.json` args that commit `4617e94` had deliberately added for portability, leaving bare relative paths that break if Claude Code ever launches from a non-root cwd.
resolution: "Removed `cwd = \"..\"` from `.codex/config.toml` and added `cwd = \".\"` with an explanatory comment; restored `${CLAUDE_PROJECT_DIR:-.}/vendor/...` and `${CLAUDE_PROJECT_DIR:-.}/memory` in `.mcp.json`."
vault_note: "[[MCP Path Resolution]]"
---

# MCP server paths must be anchored to repo root — cwd shifts and prefix stripping both break resolution

## What happened

Two separate bugs in the same session, same root cause. First: `.codex/config.toml` had `cwd = ".."` in the `[mcp_servers.obsidian]` block — interpreted as relative to the repo root, this moved the working directory to the *parent* directory, so `vendor/mcpvault/dist/server.js` didn't exist at that path, node crashed before the MCP initialize handshake, and the Codex session started with `⚠ MCP startup incomplete (failed: obsidian)`.

Second: commit `a07d0a5` (feat: add Codex scaffold mirrors) silently stripped the `${CLAUDE_PROJECT_DIR:-.}` prefix from `.mcp.json` args. Commit `4617e94` had added it explicitly with the message *"Paths use `${CLAUDE_PROJECT_DIR:-.}` so the committed config stays portable across clones."* The removal left bare `vendor/mcpvault/dist/server.js` and `memory` — correct for Claude Code (which launches from repo root), but fragile and inconsistent with the documented intent.

## What I learned

Both MCP server args (`command` path and vault path) and `cwd` in `.codex/config.toml` are resolved relative to wherever the runtime launches the process — **not** relative to the config file. `cwd = ".."` does not mean "repo root relative to the config file in `.codex/`"; it means "one level above wherever Codex is running from." Use `cwd = "."` to explicitly anchor to the repo root, and use `${CLAUDE_PROJECT_DIR:-.}` in `.mcp.json` args as the portable guard against cwd variation.

## Signals — how to spot this next time

- "connection closed: initialize response" with no other error — node crashed before completing the MCP handshake, almost always a path resolution failure.
- A `cwd` field in a server config that looks like it's pointing at the repo root but is actually relative to cwd, not the config file.
- A diff that removes a `${CLAUDE_PROJECT_DIR:-.}` or `${REPO_ROOT}` prefix from args without an explanation — check the original commit message for deliberate intent.

## Suggested updates (do not auto-apply)

- `.codex/config.toml` — add an inline comment on `cwd = "."` explaining that `".."` would resolve to the parent of the repo root, not the parent of `.codex/`. *(done this session)*
- `.mcp.json` — keep the `${CLAUDE_PROJECT_DIR:-.}` prefix; treat removal as a regression trigger. *(done this session)*
- `AGENTS.md` / `CLAUDE.md` — consider a one-liner under § Memory vault: *"MCP server paths in `.mcp.json` use `${CLAUDE_PROJECT_DIR:-.}` for portability; do not strip the prefix."*

## Related

- Vault note: `[[MCP Path Resolution]]`
- Commits: `4617e94` (original wiring with portability intent), `a07d0a5` (stripped prefix), this session (fix applied)
