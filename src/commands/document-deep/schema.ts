import { z } from 'zod';

export const documentDeepArgsSchema = z.object({
  startPath: z.string(),
  skipExisting: z.boolean().default(false),
});

export type DocumentDeepArgs = z.infer<typeof documentDeepArgsSchema>;
