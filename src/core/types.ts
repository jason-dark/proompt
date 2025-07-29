import { z } from 'zod';

import {
  commandArgumentSchema,
  commandConfigSchema,
  commandHandlerArgsSchema,
  llmCliSchema,
  outputFileNamesSchema,
  proomptArgumentsSchema,
  resolvedSettingsSchema,
  settingsOverrideSchema,
  settingsSchema,
  settingsWithMetaSchema,
} from './schemas';

export type OutputFileNames = z.infer<typeof outputFileNamesSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type LlmCli = z.infer<typeof llmCliSchema>;

// Command module types
export type CommandArgument = z.infer<typeof commandArgumentSchema>;
export type CommandHandlerArgs = z.infer<typeof commandHandlerArgsSchema>;
export type ProomptArguments = z.infer<typeof proomptArgumentsSchema>;

// Command handler function type
export type CommandHandler = (args: CommandHandlerArgs) => Promise<void>;

// Complete command module type
export type CommandModule = {
  config: z.infer<typeof commandConfigSchema>;
  argsSchema: z.ZodSchema;
  handler: CommandHandler;
  proomptContent: string;
};

// Settings resolver types
export type SettingsOverride = z.infer<typeof settingsOverrideSchema>;
export type ResolvedSettings = z.infer<typeof resolvedSettingsSchema>;
export type SettingsWithMeta = z.infer<typeof settingsWithMetaSchema>;
