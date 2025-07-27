import { Command } from 'commander';

import { getCommandModules } from '@/commands';
import { setupCompletion } from '@/completion/shell';
import { registerCommandModule } from '@/core/command-utils';

/**
 * Change working directory if cwd option is provided
 */
const changeWorkingDirectory = (cwd?: string): void => {
  if (cwd) {
    try {
      process.chdir(cwd);
      console.log(`Changed working directory to: ${process.cwd()}`);
    } catch (error) {
      console.error(
        `Failed to change directory to ${cwd}: ${(error as Error).message}`
      );
      process.exit(1);
    }
  }
};

/**
 * Handle the main CLI options (list, set-llm-cli, completion, etc.)
 */
export const handleMainOptions = (
  options: Record<string, unknown>,
  complete: unknown
): void => {
  // Change working directory first if specified
  changeWorkingDirectory(options.cwd as string);

  if (options.completion) {
    return;
  }

  if (options.setupCompletion) {
    try {
      (complete as { setupShellInitFile: () => void }).setupShellInitFile();
      console.log(
        'Shell completion has been set up! Please restart your shell or run:'
      );
      console.log('  source ~/.bashrc   # for bash');
      console.log('  source ~/.zshrc    # for zsh');
    } catch (error) {
      console.error('Failed to setup completion:', (error as Error).message);
      console.log('You can manually add this to your shell config:');
      console.log('eval "$(proompt --completion)"');
      process.exit(1);
    }
    return;
  }

  if (options.list) {
    const commandModules = getCommandModules();
    console.log('Available proompts:');
    for (const module of commandModules) {
      console.log(
        `  ${module.config.name.padEnd(20)} → ${module.config.description}`
      );
    }
    return;
  }
};

/**
 * Set up the main CLI program with all options and commands
 */
export const setupCli = (): Command => {
  const program = new Command();
  const complete = setupCompletion();

  program
    .name('proompt')
    .description(
      'CLI tool for running AI prompts with structure and repeatability'
    )
    .version('1.0.0');

  program
    .option('--completion', 'output completion script for shell')
    .option('--setup-completion', 'setup shell completion')
    .option('-l, --list', 'list all available proompts')
    .option(
      '-C, --cwd <directory>',
      'change working directory before running command'
    )
    .action((options) => handleMainOptions(options, complete));

  // Register all command modules automatically
  const commandModules = getCommandModules();
  for (const commandModule of commandModules) {
    registerCommandModule(program, commandModule);
  }

  program.on('command:*', () => {
    console.error(
      'Invalid command: %s\nSee --help for a list of available commands.',
      program.args.join(' ')
    );
    process.exit(1);
  });

  return program;
};
