import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import pkg from '../package.json' with { type: 'json' };

const SKILLS_DIR = join(process.cwd(), 'src', 'skills');
const COMMANDS_DIR = join(process.cwd(), 'src', 'commands');

async function compile() {
  console.log(`🔮 Compiling skills to commands (v${pkg.version})...`);

  if (!existsSync(COMMANDS_DIR)) {
    await mkdir(COMMANDS_DIR);
  }

  const skills = await readdir(SKILLS_DIR, { withFileTypes: true });

  let count = 0;

  for (const dirent of skills) {
    if (!dirent.isDirectory() || dirent.name.startsWith('.') || dirent.name === '_template') continue;

    const skillName = dirent.name;
    const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');

    if (existsSync(skillPath)) {
      const content = await readFile(skillPath, 'utf-8');

      // Parse frontmatter
      const parts = content.split(/^---\s*$/m);

      if (parts.length >= 3) {
        const frontmatter = parts[1];

        const descMatch = frontmatter.match(/description:\s*(.+)$/m);
        const rawDescription = descMatch ? descMatch[1].trim() : `${skillName} skill`;

        const hintMatch = frontmatter.match(/argument-hint:\s*"(.+)"$/m);
        const argumentHint = hintMatch ? hintMatch[1] : null;

        const description = `v${pkg.version} | ${rawDescription}`;

        const hintLine = argumentHint ? `\nargument-hint: "${argumentHint}"` : '';
        const commandContent = `---
description: ${description}${hintLine}
---

# /${skillName}

Execute the \`${skillName}\` skill with the provided arguments.

## Instructions

**If you have a Skill tool available**: Use it directly with \`skill: "${skillName}"\` instead of reading the file manually.

**Otherwise**:
1. Read the skill file at this exact path: \`~/.claude/skills/${skillName}/SKILL.md\`
2. Follow all instructions in the skill file
3. Pass these arguments to the skill: \`$ARGUMENTS\`

---
*nat-oracle-skills-practice v${pkg.version}*
`;

        await writeFile(join(COMMANDS_DIR, `${skillName}.md`), commandContent);
        console.log(`✓ ${skillName} (v${pkg.version})`);
        count++;
      }
    }
  }

  console.log(`\n✨ Compiled ${count} skill stubs to ${COMMANDS_DIR}`);
}

compile().catch(console.error);
