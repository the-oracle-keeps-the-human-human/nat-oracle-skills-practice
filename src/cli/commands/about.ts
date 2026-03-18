import type { Command } from 'commander';
import { agents, detectInstalledAgents } from '../agents.js';

export function registerAbout(program: Command, version: string) {
  program
    .command('about')
    .description('Show version, check prerequisites, and system status')
    .action(async () => {
      const { existsSync, readdirSync } = await import('fs');
      const { execSync } = await import('child_process');

      console.log(`\n  nat-oracle-skills-practice v${version}`);
      console.log(`  Practice building Oracle skills — learn by doing\n`);

      // Check prereqs
      console.log('  Prerequisites:\n');

      const checks: { name: string; ok: boolean; detail: string }[] = [];

      try {
        const bunVersion = execSync('bun --version', { encoding: 'utf-8' }).trim();
        checks.push({ name: 'Bun', ok: true, detail: `v${bunVersion}` });
      } catch {
        checks.push({ name: 'Bun', ok: false, detail: 'not installed (curl -fsSL https://bun.sh/install | bash)' });
      }

      try {
        const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim().replace('git version ', '');
        checks.push({ name: 'Git', ok: true, detail: `v${gitVersion}` });
      } catch {
        checks.push({ name: 'Git', ok: false, detail: 'not installed' });
      }

      for (const check of checks) {
        const icon = check.ok ? '✓' : '✗';
        console.log(`  ${icon} ${check.name.padEnd(15)} ${check.detail}`);
      }

      // Detected agents
      console.log('\n  Agents:\n');
      const detected = detectInstalledAgents();
      for (const [key, config] of Object.entries(agents)) {
        const isDetected = detected.includes(key);
        if (!isDetected) continue;

        const skillsDir = config.globalSkillsDir;
        let skillCount = 0;
        if (existsSync(skillsDir)) {
          skillCount = readdirSync(skillsDir, { withFileTypes: true })
            .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
            .length;
        }

        const status = skillCount > 0 ? `${skillCount} skills installed` : 'no skills';
        console.log(`  ✓ ${config.displayName.padEnd(18)} ${status}`);
      }

      console.log('');
    });
}
