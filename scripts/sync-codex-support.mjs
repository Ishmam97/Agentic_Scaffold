#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const managedSkills = [
  "obsidian",
  "systematic-debugging",
  "test-driven-development",
  "agentic-swe-workflows",
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function remove(file) {
  fs.rmSync(path.join(root, file), { recursive: true, force: true });
}

function walk(dir) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return [];

  return fs.readdirSync(fullDir, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(rel) : [rel];
  });
}

function parseFrontmatter(text) {
  if (!text.startsWith("---\n")) return [{}, text];
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) return [{}, text];

  const raw = text.slice(4, end);
  const body = text.slice(end + 5);
  const frontmatter = {};

  for (const line of raw.split("\n")) {
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    frontmatter[match[1]] = value;
  }

  return [frontmatter, body];
}

function adaptForCodex(text) {
  return text
    .replaceAll("`.mcp.json`", "__CODEX_MCP_CONFIG_REFERENCE__")
    .replaceAll(".claude/checkpoints.log", ".agents/checkpoints.log")
    .replaceAll("Claude Code", "Codex")
    .replaceAll("Claude", "Codex")
    .replaceAll("CLAUDE.md", "AGENTS.md")
    .replaceAll(".claude/agents/", ".codex/agents/")
    .replaceAll(".claude/commands/", ".agents/skills/agentic-swe-workflows/resources/commands/")
    .replaceAll(".claude/skills/", ".agents/skills/")
    .replaceAll(".claude/hooks/", ".codex/hooks/")
    .replaceAll(".claude/INDEX.md", ".codex/INDEX.md")
    .replaceAll(".claude/settings.json", ".codex/config.toml and .codex/hooks.json")
    .replaceAll(".mcp.json", ".codex/config.toml (Codex) or .mcp.json (Claude Code)")
    .replaceAll(
      "Co-Authored-By: Codex Haiku 4.5 <noreply@anthropic.com>",
      "Co-Authored-By: AI Agent <noreply@example.com>"
    )
    .replaceAll(
      "__CODEX_MCP_CONFIG_REFERENCE__",
      "`.codex/config.toml` for Codex or `.mcp.json` for Claude Code"
    );
}

function syncAgents() {
  remove(".codex/agents");
  for (const file of walk(".claude/agents").filter((name) => name.endsWith(".md"))) {
    const [frontmatter, body] = parseFrontmatter(read(file));
    const name = frontmatter.name || path.basename(file, ".md");
    const description = frontmatter.description || `agentic_swe ${name} agent.`;
    const instructions = [
      `You are the Codex custom agent equivalent of \`${file}\`.`,
      "Follow the role prompt below. When it references Claude-specific surfaces, use the Codex equivalents: AGENTS.md for persistent repo guidance, .agents/skills for skills, .codex/agents for custom agents, and .codex/config.toml for MCP configuration.",
      "",
      adaptForCodex(body).trim(),
      "",
    ].join("\n");

    write(
      `.codex/agents/${name}.toml`,
      [
        `name = ${JSON.stringify(name)}`,
        `description = ${JSON.stringify(adaptForCodex(description))}`,
        `developer_instructions = ${JSON.stringify(instructions)}`,
        "",
      ].join("\n")
    );
  }
}

function copySkill(name) {
  const source = `.claude/skills/${name}`;
  const dest = `.agents/skills/${name}`;
  remove(dest);

  for (const file of walk(source)) {
    const rel = path.relative(source, file);
    const content = read(file);
    const copied = file.endsWith(".md") ? adaptForCodex(content) : content;
    write(path.join(dest, rel), copied);
  }
}

function commandName(file) {
  const rel = path.relative(".claude/commands", file).replace(/\.md$/, "");
  return rel.replaceAll(path.sep, ":");
}

function syncWorkflowSkill() {
  const skillDir = ".agents/skills/agentic-swe-workflows";
  remove(skillDir);

  const commandFiles = walk(".claude/commands")
    .filter((file) => file.endsWith(".md"))
    .sort();

  const rows = [];
  for (const file of commandFiles) {
    const rel = path.relative(".claude/commands", file);
    const dest = path.join(skillDir, "resources/commands", rel);
    const [frontmatter] = parseFrontmatter(read(file));
    const name = commandName(file);
    rows.push({
      name,
      description: adaptForCodex(frontmatter.description || ""),
      resource: `resources/commands/${rel}`,
    });
    write(dest, adaptForCodex(read(file)));
  }

  const routing = rows
    .map((row) => `| \`${row.name}\` | ${row.description} | \`${row.resource}\` |`)
    .join("\n");

  write(
    `${skillDir}/SKILL.md`,
    `---\nname: agentic-swe-workflows\ndescription: Run agentic_swe Codex workflows for brainstorm, greenfield, brownfield, implement, review, ship, learn, challenge, ADRs, migrations, releases, postmortems, checkpoints, and stories. Use when the user names an agentic_swe slash-command-style workflow such as "/implement", "brownfield:onboard", or "ship". Do NOT use for ordinary coding tasks that do not need the scaffold workflow.\n---\n\n# agentic_swe Workflows for Codex\n\nThis skill is the Codex bridge for the scaffold's Claude slash-command workflows. Codex repository prompts are modeled as skills, so each workflow lives as a resource file under \`resources/commands/\`.\n\n## How to run a workflow\n\n1. Resolve the requested workflow name. Treat a leading slash as optional: \`/implement\`, \`implement\`, and \`agentic_swe implement\` all mean the same workflow.\n2. Treat the remaining user text as \`$ARGUMENTS\` for the selected resource.\n3. Read only the matching resource file and follow it as the workflow prompt.\n4. When a resource says to invoke a subagent, spawn the matching Codex custom agent from \`.codex/agents/<name>.toml\` when subagents are available. If the current Codex surface cannot spawn agents, perform the role inline and state that fallback.\n5. When a resource refers to another slash command, route to that workflow through this same skill.\n6. Keep generated artifacts in \`docs/\`, \`REPOMAP.md\`, and \`memory/\` exactly as the resource specifies.\n\n## Workflow Routing\n\n| Workflow | Purpose | Resource |\n|---|---|---|\n${routing}\n\n## Codex surface mapping\n\n| Claude scaffold term | Codex equivalent |\n|---|---|\n| \`CLAUDE.md\` | \`AGENTS.md\` |\n| \`.claude/agents/*.md\` | \`.codex/agents/*.toml\` |\n| \`.claude/skills/*/SKILL.md\` | \`.agents/skills/*/SKILL.md\` |\n| \`.claude/commands/**/*.md\` | this skill's \`resources/commands/**/*.md\` |\n| \`.mcp.json\` | \`.codex/config.toml\` for Codex, \`.mcp.json\` for Claude Code |\n\n## Maintenance\n\nThe Codex mirrors are generated from the Claude scaffold sources. After editing \`.claude/agents/\`, \`.claude/commands/\`, or \`.claude/skills/\`, run:\n\n\`\`\`bash\nnode scripts/sync-codex-support.mjs\n\`\`\`\n`
  );
}

for (const skill of managedSkills) {
  remove(`.agents/skills/${skill}`);
}

syncAgents();
for (const skill of managedSkills.filter((name) => name !== "agentic-swe-workflows")) {
  copySkill(skill);
}
syncWorkflowSkill();

console.log("Synced Codex agents and skills from Claude scaffold sources.");
