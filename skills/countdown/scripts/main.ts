#!/usr/bin/env bun

const args = Bun.argv.slice(2).join(" ");
const num = Math.min(parseInt(args) || 5, 10);
const label = args.replace(/^\d+\s*/, "") || "Countdown";

console.log(`## ⏳ ${label}`);
console.log("");

for (let i = num; i > 0; i--) {
  const bar = "█".repeat(i) + "░".repeat(num - i);
  console.log(`${i} [${bar}]`);
}

console.log("");
console.log("🎉 **Done!**");
