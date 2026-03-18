---
name: quote
description: Save and recall inspirational quotes. Use when user says "quote", "save quote", "random quote", "inspire me".
argument-hint: "[quote text] or empty for random"
---

# /quote — Quote Keeper

Save quotes and recall them later. Demonstrates file I/O in a skill.

## Step 0: Timestamp

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
```

## Behavior Matrix

| Input | Action |
|-------|--------|
| `/quote` (no args) | Show a random saved quote |
| `/quote [text]` | Save the quote |
| `/quote list` | List all saved quotes |

---

## Mode 1: No Arguments → Random Quote

### Step 1: Read quotes file

Read `ψ/memory/logs/quotes.log`. If it doesn't exist, show a default:

> "คำถามสร้างความจริง — Questions create reality."

### Step 2: Pick random line and display

```markdown
## 💬 Random Quote

> "[quote text]"

— Saved on [date]

📚 You have [N] quotes saved.
```

---

## Mode 2: Save Quote

### Step 1: Append to quotes file

Write to `ψ/memory/logs/quotes.log` (create if needed):

```
YYYY-MM-DD HH:MM | [quote text]
```

### Step 2: Confirm

```markdown
## 💬 Quote Saved

> "[quote text]"

📚 Total quotes: [N]
```

---

## Mode 3: List All

### Step 1: Read and display all quotes

```markdown
## 💬 All Quotes ([N] total)

| # | Date | Quote |
|---|------|-------|
| 1 | Jan 11 | "..." |
| 2 | Jan 12 | "..." |
```

---

## Philosophy

> "Words that resonate deserve to be kept." — Nothing is Deleted

---

ARGUMENTS: $ARGUMENTS
