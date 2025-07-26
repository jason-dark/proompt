import { readdirSync, statSync } from 'fs';
import * as path from 'path';

import { CommandModule } from '../core/types';

/**
 * Automatically discover and load all command modules
 */
export const discoverCommandModules = (): Map<string, CommandModule> => {
  const commands = new Map<string, CommandModule>();
  const commandsDir = __dirname;

  try {
    // Get all directories in the commands folder
    const entries = readdirSync(commandsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        const commandPath = path.join(commandsDir, entry.name);

        try {
          // Try to load the command module
          const indexPath = path.join(commandPath, 'index.js');

          // Check if index.js exists
          if (statSync(indexPath).isFile()) {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const moduleExports = require(indexPath);

            // Look for command export (convention: {commandName}Command)
            const commandKey = Object.keys(moduleExports).find((key) =>
              key.endsWith('Command')
            );

            if (commandKey) {
              const commandModule = moduleExports[commandKey];

              // Basic validation - we trust that our command modules are properly typed
              if (
                commandModule &&
                commandModule.config &&
                commandModule.config.name
              ) {
                commands.set(
                  commandModule.config.name,
                  commandModule as CommandModule
                );
              }
            }
          }
        } catch (error) {
          console.warn(
            `Warning: Could not load command module ${entry.name}: ${
              (error as Error).message
            }`
          );
        }
      }
    }
  } catch (error) {
    console.warn(
      `Warning: Could not scan commands directory: ${(error as Error).message}`
    );
  }

  return commands;
};

/**
 * Get all available command modules
 */
export const getCommandModules = (): CommandModule[] => {
  const commandMap = discoverCommandModules();
  return Array.from(commandMap.values());
};

/**
 * Get a specific command module by name
 */
export const getCommandModule = (name: string): CommandModule | null => {
  const commandMap = discoverCommandModules();
  return commandMap.get(name) || null;
};
