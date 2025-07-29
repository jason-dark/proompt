import { z } from 'zod';

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

// LLM-only command options (for interactive commands like execute-plan, lyra)
export const llmCommandOptionsSchema = z.object({
  llmCli: llmCliSchema.optional(),
});

// Planning command options (for commands that can create output files with custom paths)
export const planningCommandOptionsSchema = z.object({
  llmCli: llmCliSchema.optional(),
  outputFilePath: z.string(),
});

// Documentation command options (for commands that create output files)
export const documentationCommandOptionsSchema = z.object({
  llmCli: llmCliSchema.optional(),
  outputFormat: z.string().optional(),
});

export const resolvedSettingsSchema = z.object({
  llmCli: llmCliSchema,
  outputFormat: outputFormatSchema,
});

// Settings with metadata schema
export const settingsWithMetaSchema = z.object({
  settings: settingsSchema.nullable(),
  fileExists: z.boolean(),
  filePath: z.string(),
});

// Documentation metadata schemas
export const docMetadataEntrySchema = z.object({
  commitHash: z.string(),
  timestamp: z.string(),
});

export const docMetadataSchema = z.object({
  project: docMetadataEntrySchema.optional(),
  directories: z.record(z.string(), docMetadataEntrySchema).optional(),
});

// Config command schema - requires either global or project scope
export const configArgsSchema = z
  .object({
    global: z.boolean().optional(),
    project: z.boolean().optional(),
    setLlmCli: llmCliSchema.optional(),
    setOutputFormat: z.string().optional(),
  })
  .refine(
    (data) => (data.global && !data.project) || (!data.global && data.project),
    {
      message: 'Exactly one of --global or --project must be specified',
      path: ['global', 'project'],
    }
  );
