import { DEFAULT_LLM_CLI } from '../constants';
import {
  outputFormatSchema,
  resolvedSettingsSchema,
  settingsOverrideSchema,
} from '../schemas';
import { ResolvedSettings, SettingsOverride } from '../types';
import { readGlobalSettings, readProjectSettings } from './settings';

/**
 * Resolve settings using the hierarchy: command args > project settings > global settings > program defaults
 */
export const resolveSettings = (
  commandArgs: SettingsOverride
): ResolvedSettings => {
  // Validate command args first
  const validatedArgs = settingsOverrideSchema.parse(commandArgs);

  // Get settings with metadata from hierarchy
  const globalMeta = readGlobalSettings();
  const projectMeta = readProjectSettings();

  // Start with program defaults
  let resolvedLlmCli = DEFAULT_LLM_CLI;
  let resolvedOutputFormat = [DEFAULT_LLM_CLI];

  // Apply global settings if they exist
  if (globalMeta.settings) {
    resolvedLlmCli = globalMeta.settings.llmCli;
    resolvedOutputFormat = globalMeta.settings.outputFormat || [
      globalMeta.settings.llmCli,
    ];
  }

  // Apply project settings if they exist (override global)
  if (projectMeta.settings) {
    resolvedLlmCli = projectMeta.settings.llmCli;
    resolvedOutputFormat = projectMeta.settings.outputFormat || [
      projectMeta.settings.llmCli,
    ];
  }

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
