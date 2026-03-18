import type { Command } from 'commander';
import * as p from '@clack/prompts';
import { agents, detectInstalledAgents } from '../agents.js';
import { installSkills, discoverSkills } from '../installer.js';
import { profiles } from '../../profiles.js';

export function registerSelect(program: Command, version: string) {
  program
    .command('select')
    .description('Interactively select skills to install')
    .option('-g, --global', 'Install to user directory instead of project')
    .option('-a, --agent <agents...>', 'Target specific agents')
    .action(async (options) => {
      p.intro(`🔮 Oracle Skills Selector v${version}`);

      try {
        const allSkills = await discoverSkills();
        if (allSkills.length === 0) {
          p.log.error('No skills found');
          return;
        }

        const detected = detectInstalledAgents();
        let targetAgents: string[] = options.agent || detected;

        if (targetAgents.length === 0) {
          p.log.error('No agents detected. Use --agent to specify.');
          return;
        }

        const selected = await p.multiselect({
          message: `Select skills to install (${allSkills.length} available):`,
          options: allSkills
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((s) => ({
              value: s.name,
              label: s.name,
              hint: s.description.split('.')[0].substring(0, 50),
            })),
          required: true,
        });

        if (p.isCancel(selected)) {
          p.log.info('Cancelled');
          return;
        }

        const selectedSkills = selected as string[];

        await installSkills(targetAgents, {
          global: options.global,
          skills: selectedSkills,
          yes: true,
        });

        p.outro(`✨ Installed ${selectedSkills.length} skills! Restart your agent to activate.`);
      } catch (error) {
        p.log.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}
