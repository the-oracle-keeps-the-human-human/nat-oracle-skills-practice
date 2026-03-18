---
name: hello
description: Say hello in a random language. Use when user says "hello skill", "greet me", "say hello".
argument-hint: "[name]"
---

# /hello — Say Hello

The simplest possible skill. Greets the user in a random language.

## Step 0: Timestamp

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
```

## Step 1: Parse Input

- If ARGUMENTS has a name → use it
- If empty → use "friend"

## Step 2: Pick a Language

Choose randomly from this table:

| Language | Greeting | Script |
|----------|----------|--------|
| Thai | สวัสดี | sawasdee |
| Japanese | こんにちは | konnichiwa |
| Spanish | ¡Hola! | hola |
| French | Bonjour | bonjour |
| Korean | 안녕하세요 | annyeonghaseyo |
| Arabic | مرحبا | marhaba |
| Swahili | Jambo | jambo |
| Hawaiian | Aloha | aloha |

## Step 3: Output

Display:

```markdown
## 👋 [Greeting], [name]!

**Language**: [language]
**Pronunciation**: [script]

> "Every greeting is a small act of connection."
```

---

ARGUMENTS: $ARGUMENTS
