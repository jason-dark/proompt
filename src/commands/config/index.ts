import { createCommandModule } from '@/core/command-utils';
import {
  getSettingsPath,
  readSettings,
  writeSettings,
} from '@/core/config/settings';
import { configArgsSchema } from '@/core/schemas';
import { CommandHandlerArgs, Settings } from '@/core/types';

// Custom handler for config command (no proompt template needed)
const configHandler = async (args: CommandHandlerArgs): Promise<void> => {
  const validatedArgs = configArgsSchema.parse(args);

  if (!validatedArgs.setLlmCli && !validatedArgs.setOutputFormat) {
    // Show current configuration
    const currentSettings = readSettings();
    console.log('Current configuration:');
    console.log(`  LLM CLI: ${currentSettings.llmCli}`);
    console.log(
      `  Output format: ${currentSettings.outputFormat ? currentSettings.outputFormat.join(', ') : currentSettings.llmCli}`
    );
    console.log(`  Settings file: ${getSettingsPath()}`);
    return;
  }

  const currentSettings = readSettings();
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

  writeSettings(newSettings);
  console.log(`✓ Settings saved to: ${getSettingsPath()}`);
};

// Create and export the command module
export const configCommand = createCommandModule(
  {
    name: 'config',
    description: 'Configure proompt settings (view or update)',
    arguments: [
      {
        name: 'set-llm-cli',
        description: 'Set the default LLM CLI (claude|gemini)',
        required: false,
        type: 'string',
        alias: 'L',
      },
      {
        name: 'set-output-format',
        description:
          'Set default output format (claude,gemini or any combination)',
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
