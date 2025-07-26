#!/usr/bin/env node

import 'module-alias/register';
import { setupCli } from "./cli/setup";

const program = setupCli();

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
