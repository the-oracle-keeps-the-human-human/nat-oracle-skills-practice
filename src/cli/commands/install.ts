import type { Command } from 'commander';
import * as p from '@clack/prompts';
import { agents, detectInstalledAgents, getAgentNames } from '../agents.js';
import { listSkills, installSkills } from '../installer.js';
import { profiles } from '../../profiles.js';

export function registerInstall(program: Command, version: string) {
  program
    .command('install', { isDefault: true })
    .description('Install practice skills to agents')
    .option('-g, --global', 'Install to user directory instead of project')
    .option('-a, --agent <agents...>', 'Target specific agents')
    .option('-s, --skill <skills...>', 'Install specific skills by name')
    .option('-p, --profile <name>', 'Install a skill profile (minimal, standard, full)')
    .option('-l, --list', 'List available skills without installing')
    .option('-y, --yes', 'Skip confirmation prompts')
    .action(async (options) => {
      p.intro(`🔮 Nat Oracle Skills Practice v${version}`);

      try {
        if (options.list) {
          await listSkills();
          p.outro('Use --skill <name> to install specific skills');
          return;
        }

        let targetAgents: string[] = options.agent || [];

        if (targetAgents.length === 0) {
          const detected = detectInstalledAgents();

          if (detected.length > 0) {
            p.log.info(`Detected agents: ${detected.map((a) => agents[a as keyof typeof agents]?.displayName).join(', ')}`);

            if (!options.yes) {
              const useDetected = await p.confirm({
                message: 'Install to detected agents?',
              });

              if (p.isCancel(useDetected)) {
                p.log.info('Cancelled');
                return;
              }

              if (useDetected) {
                targetAgents = detected;
              }
            } else {
              targetAgents = detected;
            }
          }

          if (targetAgents.length === 0) {
            const selected = await p.multiselect({
              message: 'Select agents to install to:',
              options: Object.entries(agents).map(([key, config]) => ({
                value: key,
                label: config.displayName,
                hint: options.global ? config.globalSkillsDir : config.skillsDir,
              })),
              required: true,
            });

            if (p.isCancel(selected)) {
              p.log.info('Cancelled');
              return;
            }

            targetAgents = selected as string[];
          }
        }

        const validAgents = getAgentNames();
        const invalidAgents = targetAgents.filter((a) => !validAgents.includes(a));
        if (invalidAgents.length > 0) {
          p.log.error(`Unknown agents: ${invalidAgents.join(', ')}`);
          p.log.info(`Valid agents: ${validAgents.join(', ')}`);
          return;
        }

        if (options.profile && !profiles[options.profile]) {
          p.log.error(`Unknown profile: ${options.profile}`);
          p.log.info(`Available profiles: ${Object.keys(profiles).join(', ')}`);
          return;
        }

        await installSkills(targetAgents, {
          global: options.global,
          skills: options.skill,
          profile: options.profile,
          yes: options.yes,
        });

        p.outro('✨ Practice skills installed!');

        console.log(`
  🔮 Nat Oracle Skills Practice v${version}

  CLI Commands:
    nat-oracle-skills agents          # list supported agents
    nat-oracle-skills about           # system status
    nat-oracle-skills list -g         # show installed skills
    nat-oracle-skills profiles        # list profiles
    nat-oracle-skills select -g       # interactive picker
    nat-oracle-skills install -g -y   # reinstall all
    nat-oracle-skills uninstall -g -y # remove all

  Restart your agent to activate skills.
`);
      } catch (error) {
        p.log.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}
