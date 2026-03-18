import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as p from '@clack/prompts';
import { agents } from './agents.js';
import type { Skill, InstallOptions } from './types.js';
import { mkdirp, rmrf, cpr } from './fs-utils.js';
import { discoverSkills as _discoverSkills } from './skill-source.js';
import { resolveProfile } from '../profiles.js';
import pkg from '../../package.json' with { type: 'json' };

export const discoverSkills = _discoverSkills;

// Check if an installed skill was installed by us
async function isOurSkill(skillPath: string): Promise<boolean> {
  const skillMdPath = join(skillPath, 'SKILL.md');
  if (!existsSync(skillMdPath)) return false;
  try {
    const content = await Bun.file(skillMdPath).text();
    return content.includes('installer: nat-oracle-skills-practice');
  } catch {
    return false;
  }
}

export async function listSkills(): Promise<void> {
  const skills = await discoverSkills();

  if (skills.length === 0) {
    p.log.warn('No skills found');
    return;
  }

  p.log.info(`Found ${skills.length} skills:\n`);

  for (const skill of skills) {
    console.log(`  ${skill.name}`);
    if (skill.description) {
      console.log(`    ${skill.description}\n`);
    }
  }
}

export async function installSkills(
  targetAgents: string[],
  options: InstallOptions
): Promise<void> {
  const allSkills = await discoverSkills();

  if (allSkills.length === 0) {
    p.log.error('No skills found to install');
    return;
  }

  // Resolve profile → skill list
  let skillsToInstall = allSkills;
  if (options.profile) {
    const allNames = allSkills.map((s) => s.name);
    const profileSkillNames = resolveProfile(options.profile, allNames);
    if (profileSkillNames) {
      const extras = options.skills || [];
      const allowed = new Set([...profileSkillNames, ...extras]);
      skillsToInstall = allSkills.filter((s) => allowed.has(s.name));
    }
  } else if (options.skills && options.skills.length > 0) {
    skillsToInstall = allSkills.filter((s) => options.skills!.includes(s.name));
  }

  if (skillsToInstall.length === 0) {
    p.log.error(`No matching skills found. Available: ${allSkills.map((s) => s.name).join(', ')}`);
    return;
  }

  // Confirm
  if (!options.yes) {
    const agentList = targetAgents.map((a) => agents[a as keyof typeof agents]?.displayName || a).join(', ');
    const confirmed = await p.confirm({
      message: `Install ${skillsToInstall.length} skills to ${agentList}?`,
    });

    if (p.isCancel(confirmed) || !confirmed) {
      p.log.info('Installation cancelled');
      return;
    }
  }

  const spinner = p.spinner();
  spinner.start('Installing skills');

  for (const agentName of targetAgents) {
    const agent = agents[agentName as keyof typeof agents];
    if (!agent) {
      p.log.warn(`Unknown agent: ${agentName}`);
      continue;
    }

    const targetDir = options.global ? agent.globalSkillsDir : join(process.cwd(), agent.skillsDir);
    const scope = options.global ? 'Global' : 'Local';

    await mkdirp(targetDir);

    for (const skill of skillsToInstall) {
      const destPath = join(targetDir, skill.name);

      // Remove existing
      if (existsSync(destPath)) {
        await rmrf(destPath);
      }

      // Copy skill folder
      await cpr(skill.path, destPath);

      // Inject version into SKILL.md frontmatter
      const skillMdPath = join(destPath, 'SKILL.md');
      if (existsSync(skillMdPath)) {
        let content = await Bun.file(skillMdPath).text();
        if (content.startsWith('---')) {
          content = content.replace(
            /^---\n/,
            `---\ninstaller: nat-oracle-skills-practice v${pkg.version}\n`
          );
          const scopeChar = scope === 'Global' ? 'G' : 'L';
          content = content.replace(
            /^(description:\s*)(.+?)(\n)/m,
            `$1v${pkg.version} ${scopeChar}-SKLL | $2$3`
          );
          await Bun.write(skillMdPath, content);
        }
      }
    }

    // Write manifest
    const manifest = {
      version: pkg.version,
      installedAt: new Date().toISOString(),
      skills: skillsToInstall.map((s) => s.name),
      agent: agentName,
    };
    await Bun.write(join(targetDir, '.oracle-skills.json'), JSON.stringify(manifest, null, 2));

    // Install command stubs
    if (agent.commandsDir) {
      const commandsDir = options.global ? agent.globalCommandsDir! : join(process.cwd(), agent.commandsDir);
      await mkdirp(commandsDir);

      const scopeChar = scope === 'Global' ? 'G' : 'L';
      const skillsPath = options.global ? agent.globalSkillsDir : join(process.cwd(), agent.skillsDir);

      for (const skill of skillsToInstall) {
        if (agent.commandFormat === 'toml') {
          const desc = skill.description.replace(/"/g, '\\"');
          const tomlContent = `description = "v${pkg.version} ${scopeChar}-CMD | ${desc}"
prompt = """
You are running the /${skill.name} skill.

Read the skill file at ${skillsPath}/${skill.name}/SKILL.md and follow ALL instructions in it.

Arguments: {{args}}

---
nat-oracle-skills-practice v${pkg.version}
"""
`;
          await Bun.write(join(commandsDir, `${skill.name}.toml`), tomlContent);
        } else {
          const stubContent = `---
description: v${pkg.version} ${scopeChar}-CMD | ${skill.description}
---

# /${skill.name}

Execute the \`${skill.name}\` skill with args: \`$ARGUMENTS\`

**If you have a Skill tool available**: Use it directly with \`skill: "${skill.name}"\` instead of reading the file manually.

**Otherwise**: Read the skill file at \`${skillsPath}/${skill.name}/SKILL.md\` and follow ALL instructions in it.

---
*nat-oracle-skills-practice v${pkg.version}*
`;
          await Bun.write(join(commandsDir, `${skill.name}.md`), stubContent);
        }
      }
      p.log.success(`${agent.displayName} commands: ${commandsDir}`);
    }

    p.log.success(`${agent.displayName}: ${targetDir}`);
  }

  spinner.stop(`Installed ${skillsToInstall.length} skills to ${targetAgents.length} agent(s)`);
}

export async function uninstallSkills(
  targetAgents: string[],
  options: { global: boolean; skills?: string[]; yes?: boolean }
): Promise<{ removed: number; agents: number }> {
  let totalRemoved = 0;
  let agentsProcessed = 0;

  for (const agentName of targetAgents) {
    const agent = agents[agentName as keyof typeof agents];
    if (!agent) continue;

    const targetDir = options.global ? agent.globalSkillsDir : join(process.cwd(), agent.skillsDir);
    if (!existsSync(targetDir)) continue;

    const installed = readdirSync(targetDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
      .map((d) => d.name);

    const toRemove = options.skills
      ? installed.filter((s) => options.skills!.includes(s))
      : installed;

    if (toRemove.length === 0) continue;

    for (const skill of toRemove) {
      await rmrf(join(targetDir, skill));

      // Clean up command stubs
      if (agent.commandsDir) {
        const commandsDir = options.global ? agent.globalCommandsDir! : join(process.cwd(), agent.commandsDir);
        const ext = agent.commandFormat === 'toml' ? 'toml' : 'md';
        const flatFile = join(commandsDir, `${skill}.${ext}`);
        if (existsSync(flatFile)) {
          const { rmf } = await import('./fs-utils.js');
          await rmf(flatFile);
        }
      }

      totalRemoved++;
    }

    agentsProcessed++;
    p.log.success(`${agent.displayName}: removed ${toRemove.length} skills`);
  }

  return { removed: totalRemoved, agents: agentsProcessed };
}
