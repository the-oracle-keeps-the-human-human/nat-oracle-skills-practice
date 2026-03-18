import type { Command } from 'commander';
import * as p from '@clack/prompts';
import { agents, detectInstalledAgents } from '../agents.js';
import { uninstallSkills } from '../installer.js';

export function registerUninstall(program: Command, version: string) {
  program
    .command('uninstall')
    .description('Remove installed practice skills')
    .option('-g, --global', 'Uninstall from user directory')
    .option('-a, --agent <agents...>', 'Target specific agents')
    .option('-s, --skill <skills...>', 'Remove specific skills only')
    .option('-y, --yes', 'Skip confirmation prompts')
    .action(async (options) => {
      p.intro(`🔮 Nat Oracle Skills Uninstaller v${version}`);

      try {
        let targetAgents: string[] = options.agent ? [...options.agent] : [];

        if (targetAgents.length === 0) {
          const detected = detectInstalledAgents();
          if (detected.length > 0) {
            p.log.info(`Detected agents: ${detected.map((a) => agents[a as keyof typeof agents]?.displayName).join(', ')}`);
            targetAgents = detected;
          }
        }

        if (targetAgents.length === 0) {
          p.log.error('No agents detected. Use --agent to specify.');
          return;
        }

        if (!options.yes) {
          const skillInfo = options.skill ? `skills: ${options.skill.join(', ')}` : 'all practice skills';
          const confirmed = await p.confirm({
            message: `Remove ${skillInfo} from ${targetAgents.length} agent(s)?`,
          });

          if (p.isCancel(confirmed) || !confirmed) {
            p.log.info('Cancelled');
            return;
          }
        }

        const spinner = p.spinner();
        spinner.start('Removing skills');

        const result = await uninstallSkills(targetAgents, {
          global: options.global || false,
          skills: options.skill,
          yes: options.yes,
        });

        spinner.stop(`Removed ${result.removed} skills from ${result.agents} agent(s)`);
        p.outro('✨ Skills removed. Restart your agent to apply changes.');
      } catch (error) {
        p.log.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}
