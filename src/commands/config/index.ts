import { createCommandModule } from '@/core/command-utils';
import {
  getGlobalSettingsPath,
  getProjectSettingsPath,
  readGlobalSettings,
  readProjectSettings,
  writeGlobalSettings,
  writeProjectSettings,
} from '@/core/config/settings';
import { configArgsSchema } from '@/core/schemas';
import { CommandHandlerArgs, Settings } from '@/core/types';

// Custom handler for config command (no proompt template needed)
const configHandler = async (args: CommandHandlerArgs): Promise<void> => {
  const validatedArgs = configArgsSchema.parse(args);

  const isGlobal = validatedArgs.global;
  const isProject = validatedArgs.project;

  if (!validatedArgs.setLlmCli && !validatedArgs.setOutputFormat) {
    // Show current configuration with clear messaging
    if (isGlobal) {
      const globalMeta = readGlobalSettings();
      if (globalMeta.fileExists && globalMeta.settings) {
        console.log(`Global configuration (from ${globalMeta.filePath}):`);
        console.log(`  LLM CLI: ${globalMeta.settings.llmCli}`);
        console.log(
          `  Output format: ${globalMeta.settings.outputFormat ? globalMeta.settings.outputFormat.join(', ') : globalMeta.settings.llmCli}`
        );
      } else {
        console.log('No global configuration file found.');
        console.log('Using built-in defaults:');
        console.log('  LLM CLI: claude (default)');
        console.log('  Output format: claude (default)');
        console.log('');
        console.log(
          'Create global settings: proompt config --global --set-llm-cli <value>'
        );
      }
    } else if (isProject) {
      const projectMeta = readProjectSettings();
      const globalMeta = readGlobalSettings();

      if (projectMeta.fileExists && projectMeta.settings) {
        console.log(`Project configuration (from ${projectMeta.filePath}):`);
        console.log(`  LLM CLI: ${projectMeta.settings.llmCli}`);
        console.log(
          `  Output format: ${projectMeta.settings.outputFormat ? projectMeta.settings.outputFormat.join(', ') : projectMeta.settings.llmCli}`
        );
      } else {
        console.log('No project configuration file found.');
        console.log('Effective settings for this project:');

        if (globalMeta.fileExists && globalMeta.settings) {
          console.log(
            `  LLM CLI: ${globalMeta.settings.llmCli} (from global settings)`
          );
          console.log(
            `  Output format: ${globalMeta.settings.outputFormat ? globalMeta.settings.outputFormat.join(', ') : globalMeta.settings.llmCli} (from global settings)`
          );
        } else {
          console.log('  LLM CLI: claude (built-in default)');
          console.log('  Output format: claude (built-in default)');
        }
        console.log('');
        console.log(
          'Create project settings: proompt config --project --set-llm-cli <value>'
        );
      }
    }
    return;
  }

  // Determine which settings to read/write
  const currentMeta = isGlobal ? readGlobalSettings() : readProjectSettings();
  const currentSettings = currentMeta.settings || { llmCli: 'claude' as const };
  const newSettings: Settings = { ...currentSettings };

  if (validatedArgs.setLlmCli) {
    newSettings.llmCli = validatedArgs.setLlmCli;
    console.log(`✓ LLM CLI set to: ${validatedArgs.setLlmCli}`);
  }

  if (validatedArgs.setOutputFormat) {
    // Parse comma-separated format list and validate
    const { outputFormatSchema } = await import('@/core/schemas');
    const formatList = validatedArgs.setOutputFormat
      .split(',')
      .map((f: string) => f.trim());
    const validatedFormats = outputFormatSchema.parse(formatList);
    newSettings.outputFormat = validatedFormats;
    console.log(`✓ Output format set to: ${validatedFormats.join(', ')}`);
  }

  // Write to appropriate settings file
  if (isGlobal) {
    writeGlobalSettings(newSettings);
    console.log(`✓ Global settings saved to: ${getGlobalSettingsPath()}`);
  } else if (isProject) {
    writeProjectSettings(newSettings);
    console.log(`✓ Project settings saved to: ${getProjectSettingsPath()}`);
  }
};

// Create and export the command module
export const configCommand = createCommandModule(
  {
    name: 'config',
    description: 'Configure proompt settings (view or update)',
    arguments: [
      {
        name: 'global',
        description: 'Manage global settings (stored in home directory)',
        required: false,
        type: 'boolean',
        alias: 'g',
      },
      {
        name: 'project',
        description: 'Manage project settings (stored in current directory)',
        required: false,
        type: 'boolean',
        alias: 'p',
      },
      {
        name: 'set-llm-cli',
        description: 'Set the LLM CLI (claude|gemini)',
        required: false,
        type: 'string',
        alias: 'L',
      },
      {
        name: 'set-output-format',
        description: 'Set output format (claude,gemini or any combination)',
        required: false,
        type: 'string',
        alias: 'F',
      },
    ],
  },
  configArgsSchema,
  '', // No proompt content needed
  configHandler
);
