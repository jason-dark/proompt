import { z } from 'zod';

export const documentCodebaseArgsSchema = z.object({
  startPath: z.string(),
  skipExisting: z.boolean().default(false),
});

export type DocumentCodebaseArgs = z.infer<typeof documentCodebaseArgsSchema>;
