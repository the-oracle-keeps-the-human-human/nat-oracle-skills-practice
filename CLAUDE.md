# Nat Oracle Skills Practice

> เรียนรู้การสร้าง Oracle Skills — Learn by doing

## What This Is

A practice repo for learning how to create Oracle Skills — modular markdown workflows that extend Claude Code (and 17+ AI agents).

## How Skills Work

1. A skill = a folder with `SKILL.md` inside
2. `SKILL.md` has YAML frontmatter (name, description) + markdown workflow
3. Claude reads the markdown and follows the steps
4. No compilation needed — markdown IS the code

## Structure

```
skills/           # Your practice skills go here
├── _template/    # Copy this to start a new skill
├── hello/        # Example: simplest possible skill
├── quote/        # Example: skill with file I/O
└── countdown/    # Example: skill with script
docs/
└── guide.md      # Step-by-step skill creation guide
```

## Quick Start

1. Copy `skills/_template/` to `skills/your-skill-name/`
2. Edit `SKILL.md` — change frontmatter + write your workflow
3. Test: install to `~/.claude/skills/` or `.claude/skills/`
4. Invoke: `/your-skill-name [args]`

## Skill Frontmatter

```yaml
---
name: your-skill-name
description: What it does. Use when user says "X", "Y", or "Z".
argument-hint: "[optional args hint]"
---
```

The `description` is the trigger — it tells Claude WHEN to invoke your skill.
