import { z } from 'zod';

import {
  commandArgumentSchema,
  commandConfigSchema,
  commandHandlerArgsSchema,
  llmCliSchema,
  outputFileNamesSchema,
  outputFormatSchema,
  proomptArgumentsSchema,
  settingsSchema,
} from './schemas';

// Re-export existing types for backward compatibility
export type LlmCli = z.infer<typeof llmCliSchema>;
export type OutputFormat = z.infer<typeof outputFormatSchema>;
export type OutputFileNames = z.infer<typeof outputFileNamesSchema>;
export type Settings = z.infer<typeof settingsSchema>;

// New command module types
export type CommandArgument = z.infer<typeof commandArgumentSchema>;
export type CommandConfig = z.infer<typeof commandConfigSchema>;
export type CommandHandlerArgs = z.infer<typeof commandHandlerArgsSchema>;
export type ProomptArguments = z.infer<typeof proomptArgumentsSchema>;

// Command handler function type
export type CommandHandler = (args: CommandHandlerArgs) => Promise<void>;

// Complete command module type
export type CommandModule = {
  config: CommandConfig;
  argsSchema: z.ZodSchema;
  handler: CommandHandler;
  proomptContent: string;
};
