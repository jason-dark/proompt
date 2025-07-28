import { z } from 'zod';

// Re-export existing schemas for backward compatibility
export const llmCliSchema = z.enum(['claude', 'gemini']);

export const outputFormatSchema = z.array(z.enum(['claude', 'gemini'])).min(1);

export const outputFileNamesSchema = z.object({
  claude: z.literal('CLAUDE.md'),
  gemini: z.literal('GEMINI.md'),
});

export const settingsSchema = z.object({
  llmCli: llmCliSchema,
  outputFormat: outputFormatSchema.optional(),
});

// New command module schemas
export const commandArgumentSchema = z.object({
  name: z.string(),
  description: z.string(),
  required: z.boolean().default(false),
  type: z.enum(['string', 'number', 'boolean']).default('string'),
  alias: z.string().optional(),
  positional: z.boolean().optional(),
});

export const commandConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  arguments: z.array(commandArgumentSchema).default([]),
});

export const commandHandlerArgsSchema = z
  .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
  .and(
    z.object({
      llmCli: llmCliSchema.optional(),
      outputFormat: z.string().optional(),
    })
  );

export const commandModuleSchema = z.object({
  config: commandConfigSchema,
  argsSchema: z.any(), // Schema validation happens at runtime
  handler: z.function(),
  proomptContent: z.string(),
});

// Base schema for proompt arguments (used in execution)
export const proomptArgumentsSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()])
);

// Settings resolver schemas
export const settingsOverrideSchema = z.object({
  llmCli: llmCliSchema.optional(),
  outputFormat: z.string().optional(), // Comma-separated string that gets parsed
});

// Global command options schema (for extending command-specific schemas)
export const globalCommandOptionsSchema = z.object({
  llmCli: llmCliSchema.optional(),
  outputFormat: z.string().optional(),
});

export const resolvedSettingsSchema = z.object({
  llmCli: llmCliSchema,
  outputFormat: outputFormatSchema,
});

// Config command schema
export const configArgsSchema = z.object({
  setLlmCli: llmCliSchema.optional(),
  setOutputFormat: z.string().optional(),
});
