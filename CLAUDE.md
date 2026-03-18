# Nat Oracle Skills Practice

> เรียนรู้การสร้าง Oracle Skills — Learn by doing

## What This Is

A practice repo for learning how to build an Oracle Skills CLI — same structure as [oracle-skills-cli](https://github.com/Soul-Brews-Studio/oracle-skills-cli).

## Structure

```
src/
├── cli/              # CLI tool (Commander + Clack)
│   ├── index.ts      # Entry point
│   ├── agents.ts     # Agent configs (Claude Code, Cursor, etc.)
│   ├── installer.ts  # Install/uninstall logic
│   ├── skill-source.ts # Skill discovery
│   ├── fs-utils.ts   # Cross-platform file ops
│   ├── types.ts      # TypeScript types
│   └── commands/     # CLI subcommands
│       ├── install.ts
│       ├── uninstall.ts
│       ├── select.ts
│       ├── list.ts
│       ├── agents.ts
│       ├── about.ts
│       └── profiles.ts
├── skills/           # Practice skills (SKILL.md format)
│   ├── _template/
│   ├── hello/
│   ├── quote/
│   └── countdown/
├── commands/         # Auto-generated command stubs (bun run compile)
└── profiles.ts       # Skill profiles (minimal, standard, full)
scripts/
└── compile.ts        # Compile skills → command stubs
```

## Commands

```bash
bun run dev install -g -y      # Install all skills globally
bun run dev install -g -s hello -y  # Install specific skill
bun run dev uninstall -g -y    # Remove all
bun run dev list -g            # Show installed
bun run dev agents             # Show supported agents
bun run dev profiles           # Show profiles
bun run dev about              # System status
bun run dev select -g          # Interactive picker
bun run compile                # Generate command stubs
```

## Creating New Skills

1. Copy `src/skills/_template/` → `src/skills/your-skill/`
2. Edit `SKILL.md` — frontmatter + workflow steps
3. Run `bun run compile` to generate command stubs
4. Run `bun run dev install -g -s your-skill -y` to install

## Commands are Auto-Generated

**DO NOT manually edit `src/commands/*.md`** — they are auto-generated!

```
src/skills/         →  bun run compile  →  src/commands/
(SKILL.md files)                          (auto-generated stubs)
```

## Skill Frontmatter

```yaml
---
name: your-skill-name
description: What it does. Use when user says "X", "Y", or "Z".
argument-hint: "[optional args hint]"
---
```

The `description` is the trigger — it tells the AI agent WHEN to invoke your skill.
