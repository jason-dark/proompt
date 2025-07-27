import {
  outputFormatSchema,
  resolvedSettingsSchema,
  settingsOverrideSchema,
} from '../schemas';
import { ResolvedSettings, SettingsOverride } from '../types';
import { readSettings } from './settings';

/**
 * Resolve settings using the hierarchy: command args > user settings > program defaults
 */
export const resolveSettings = (
  commandArgs: SettingsOverride
): ResolvedSettings => {
  // Validate command args first
  const validatedArgs = settingsOverrideSchema.parse(commandArgs);

  // Get user settings from file (with fallback to defaults)
  const userSettings = readSettings();

  // Start with user settings as base
  let resolvedLlmCli = userSettings.llmCli;
  let resolvedOutputFormat = userSettings.outputFormat || [userSettings.llmCli];

  // Override with command arguments if provided
  if (validatedArgs.llmCli) {
    resolvedLlmCli = validatedArgs.llmCli;
  }

  if (validatedArgs.outputFormat) {
    // Parse comma-separated format list and validate
    const formatList = validatedArgs.outputFormat
      .split(',')
      .map((f: string) => f.trim());
    resolvedOutputFormat = outputFormatSchema.parse(formatList);
  }

  // Validate final resolved settings
  return resolvedSettingsSchema.parse({
    llmCli: resolvedLlmCli,
    outputFormat: resolvedOutputFormat,
  });
};
