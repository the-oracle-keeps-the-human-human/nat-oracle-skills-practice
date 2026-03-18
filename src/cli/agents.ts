import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';
import type { AgentConfig, AgentType } from './types.js';

const home = homedir();

export const agents: Record<AgentType, AgentConfig> = {
  'claude-code': {
    name: 'claude-code',
    displayName: 'Claude Code',
    skillsDir: '.claude/skills',
    globalSkillsDir: join(home, '.claude/skills'),
    commandsDir: '.claude/commands',
    globalCommandsDir: join(home, '.claude/commands'),
    useFlatFiles: true,
    commandsOptIn: true,
    detectInstalled: () => existsSync(join(home, '.claude')),
  },
  opencode: {
    name: 'opencode',
    displayName: 'OpenCode',
    skillsDir: '.opencode/skills',
    globalSkillsDir: join(home, '.config/opencode/skills'),
    commandsDir: '.opencode/commands',
    globalCommandsDir: join(home, '.config/opencode/commands'),
    useFlatFiles: true,
    detectInstalled: () => existsSync(join(home, '.config/opencode')),
  },
  codex: {
    name: 'codex',
    displayName: 'Codex',
    skillsDir: '.codex/skills',
    globalSkillsDir: join(home, '.codex/skills'),
    commandsDir: '.codex/prompts',
    globalCommandsDir: join(home, '.codex/prompts'),
    useFlatFiles: true,
    detectInstalled: () => existsSync(join(home, '.codex')),
  },
  cursor: {
    name: 'cursor',
    displayName: 'Cursor',
    skillsDir: '.cursor/skills',
    globalSkillsDir: join(home, '.cursor/skills'),
    detectInstalled: () => existsSync(join(home, '.cursor')),
  },
  gemini: {
    name: 'gemini',
    displayName: 'Gemini CLI',
    skillsDir: '.gemini/skills',
    globalSkillsDir: join(home, '.gemini/skills'),
    commandsDir: '.gemini/commands',
    globalCommandsDir: join(home, '.gemini/commands'),
    useFlatFiles: true,
    commandFormat: 'toml',
    detectInstalled: () => existsSync(join(home, '.gemini')),
  },
};

export function detectInstalledAgents(): string[] {
  return Object.entries(agents)
    .filter(([_, config]) => config.detectInstalled())
    .map(([name]) => name);
}

export function getAgentNames(): string[] {
  return Object.keys(agents);
}
