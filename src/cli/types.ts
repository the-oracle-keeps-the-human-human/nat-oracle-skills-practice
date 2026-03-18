export interface AgentConfig {
  name: string;
  displayName: string;
  skillsDir: string;
  globalSkillsDir: string;
  commandsDir?: string;
  globalCommandsDir?: string;
  useFlatFiles?: boolean;
  commandsOptIn?: boolean;
  commandFormat?: 'md' | 'toml';
  detectInstalled: () => boolean;
}

export type AgentType =
  | 'claude-code'
  | 'opencode'
  | 'codex'
  | 'cursor'
  | 'gemini';

export interface Skill {
  name: string;
  description: string;
  path: string;
}

export interface InstallOptions {
  global?: boolean;
  skills?: string[];
  profile?: string;
  yes?: boolean;
}
