import { z } from 'zod';

export const documentDeepArgsSchema = z.object({
  directoryPath: z.string(),
  skipExisting: z.boolean().default(false),
});

export type DocumentDeepArgs = z.infer<typeof documentDeepArgsSchema>;
