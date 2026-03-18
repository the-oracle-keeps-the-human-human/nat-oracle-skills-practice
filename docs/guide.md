# Oracle Skills Creation Guide

> เรียนรู้การสร้าง Oracle Skills — จาก zero ถึง deploy

## What is a Skill?

A skill is a **markdown file** that teaches Claude (or any AI agent) a new workflow. No compilation, no build step — markdown IS the code.

```
my-skill/
├── SKILL.md          ← Required: the workflow
└── scripts/          ← Optional: helper scripts
    └── main.ts
```

## Anatomy of SKILL.md

### 1. Frontmatter (Required)

```yaml
---
name: my-skill
description: What it does. Use when user says "X", "Y", "Z".
argument-hint: "[args]"
---
```

| Field | Required | Purpose |
|-------|----------|---------|
| `name` | Yes | Lowercase, hyphenated identifier |
| `description` | Yes | **Trigger signal** — tells Claude WHEN to invoke |
| `argument-hint` | No | Shows usage hint to user |

**The description is everything.** It's how Claude decides to invoke your skill. Include:
- Action words ("Log", "Find", "Create")
- Trigger phrases ("Use when user says...")
- Keywords users might say

### 2. Steps (The Workflow)

```markdown
## Step 0: Timestamp
## Step 1: Parse Input
## Step 2: Do Something
## Step 3: Output
```

Each step = an instruction for Claude to follow. Use:
- **Bash code blocks** for commands Claude should run
- **Tables** for decision matrices
- **Markdown templates** for output format

### 3. Behavior Matrix

```markdown
| Input | Action |
|-------|--------|
| no args | List mode |
| with args | Create mode |
| `--flag` | Special mode |
```

This tells Claude how to branch based on input.

### 4. ARGUMENTS Placeholder

Always end with:

```
ARGUMENTS: $ARGUMENTS
```

This gets replaced with whatever the user typed after `/skill-name`.

## Skill Complexity Levels

### Level 1: Pure Markdown (no scripts)

Like `/hello` — Claude follows the markdown directly.

```
skills/hello/
└── SKILL.md
```

Best for: simple workflows, lookups, formatting

### Level 2: File I/O

Like `/quote` — reads/writes to `ψ/` directories.

```
skills/quote/
└── SKILL.md     (references ψ/memory/logs/)
```

Best for: logging, tracking, accumulating data

### Level 3: With Scripts

Like `/countdown` — calls external scripts for complex logic.

```
skills/countdown/
├── SKILL.md
└── scripts/
    └── main.ts
```

Best for: data processing, API calls, complex computation

## How to Test

### Option A: Project-local install

```bash
# From your project repo
mkdir -p .claude/skills/my-skill
cp skills/my-skill/SKILL.md .claude/skills/my-skill/
# Now /my-skill works in this project
```

### Option B: Global install

```bash
# Available everywhere
mkdir -p ~/.claude/skills/my-skill
cp skills/my-skill/SKILL.md ~/.claude/skills/my-skill/
cp -r skills/my-skill/scripts ~/.claude/skills/my-skill/ 2>/dev/null
# Now /my-skill works in all projects
```

### Option C: Test inline

Just paste the SKILL.md content into a Claude conversation and ask it to follow the workflow.

## Tips

1. **Start simple** — A SKILL.md with just frontmatter + 2 steps works
2. **Description = discoverability** — If Claude can't find your skill, improve the description
3. **Tables > prose** — Claude follows tables more reliably than paragraphs
4. **Code blocks = actions** — Bash blocks tell Claude "run this"
5. **ψ/ for persistence** — Use `ψ/memory/` for data that should survive sessions

## Exercise Ideas

1. **`/weather`** — Display weather for a city (use `curl wttr.in`)
2. **`/pomodoro`** — Log work sessions with start/stop times
3. **`/vocab`** — Save and quiz vocabulary words (Thai/English)
4. **`/standup-mini`** — Quick daily standup (what did, what doing, blockers)
5. **`/bookmark`** — Save and categorize URLs

## Resources

- [oracle-skills-cli](https://github.com/Soul-Brews-Studio/oracle-skills-cli) — The official 29 skills
- [Oracle Philosophy](https://github.com/Soul-Brews-Studio/opensource-nat-brain-oracle) — The 5 Principles
