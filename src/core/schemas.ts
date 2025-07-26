import { z } from "zod";

// Re-export existing schemas for backward compatibility
export const llmCliSchema = z.enum(["claude", "gemini"]);
export const outputFormatSchema = z.array(z.enum(["claude", "gemini"])).min(1);
export const outputFileNamesSchema = z.object({
  claude: z.literal("CLAUDE.md"),
  gemini: z.literal("GEMINI.md")
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
  type: z.enum(["string", "number", "boolean"]).default("string"),
  alias: z.string().optional()
});

export const commandConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  arguments: z.array(commandArgumentSchema).default([])
});

export const commandHandlerArgsSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));

export const commandModuleSchema = z.object({
  config: commandConfigSchema,
  argsSchema: z.any(), // Schema validation happens at runtime
  handler: z.function(),
  proomptContent: z.string()
});

// Base schema for proompt arguments (used in execution)
export const proomptArgumentsSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));