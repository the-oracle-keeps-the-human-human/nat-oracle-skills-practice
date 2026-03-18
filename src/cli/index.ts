#!/usr/bin/env bun

import { program } from 'commander';
import pkg from '../../package.json' with { type: 'json' };

import { registerInstall } from './commands/install.js';
import { registerUninstall } from './commands/uninstall.js';
import { registerList } from './commands/list.js';
import { registerAgents } from './commands/agents.js';
import { registerProfiles } from './commands/profiles.js';
import { registerAbout } from './commands/about.js';
import { registerSelect } from './commands/select.js';

const VERSION = pkg.version;

program
  .name('nat-oracle-skills')
  .description('Practice building Oracle skills — learn by doing')
  .version(VERSION);

registerAgents(program);
registerInstall(program, VERSION);
registerUninstall(program, VERSION);
registerSelect(program, VERSION);
registerList(program);
registerProfiles(program);
registerAbout(program, VERSION);

program.parse();
