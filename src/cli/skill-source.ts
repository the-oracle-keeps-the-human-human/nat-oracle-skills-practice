/**
 * Skill Source — discovers skills from src/skills/ directory
 */

import { existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import type { Skill } from './types.js';

function getSkillsDir(): string {
  return join(dirname(import.meta.path), '..', 'skills');
}

/** Discover all available skills */
export async function discoverSkills(): Promise<Skill[]> {
  const skillsPath = getSkillsDir();
  if (!existsSync(skillsPath)) return [];

  const skillDirs = readdirSync(skillsPath, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== '_template')
    .map((d) => d.name);

  const skills: Skill[] = [];
  for (const name of skillDirs) {
    const skillMdPath = join(skillsPath, name, 'SKILL.md');
    if (existsSync(skillMdPath)) {
      const content = await Bun.file(skillMdPath).text();
      const descMatch = content.match(/description:\s*(.+)/);
      skills.push({
        name,
        description: descMatch?.[1]?.trim() || '',
        path: join(skillsPath, name),
      });
    }
  }
  return skills;
}

/** Check if a skill has hooks */
export async function skillHasHooks(skillName: string): Promise<boolean> {
  return existsSync(join(getSkillsDir(), skillName, 'hooks', 'hooks.json'));
}
