---
name: countdown
description: Countdown timer with optional label. Use when user says "countdown", "timer", "count down from".
argument-hint: "<number> [label]"
---

# /countdown — Visual Countdown

A skill with a script component. Counts down with visual output.

## Step 0: Timestamp

```bash
date "+🕐 %H:%M %Z (%A %d %B %Y)"
```

## Step 1: Parse Input

Extract from ARGUMENTS:
- `number`: The count (default: 5, max: 10)
- `label`: Optional label (default: "Countdown")

## Step 2: Run Script

```bash
bun scripts/main.ts "$ARGUMENTS"
```

Or if Bun unavailable:
```bash
node -e "
const args = process.argv.slice(1).join(' ');
const num = parseInt(args) || 5;
const label = args.replace(/^\d+\s*/, '') || 'Countdown';
console.log('## ⏳ ' + label);
console.log('');
for (let i = num; i > 0; i--) {
  const bar = '█'.repeat(i) + '░'.repeat(num - i);
  console.log(i + ' [' + bar + ']');
}
console.log('');
console.log('🎉 **Done!**');
" "$ARGUMENTS"
```

## Step 3: Display Output

Show the script output directly.

---

ARGUMENTS: $ARGUMENTS
