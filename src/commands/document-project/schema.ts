import { z } from 'zod';

export const documentProjectArgsSchema = z.object({
  initialDocumentationPath: z.string(),
});

export type DocumentProjectArgs = z.infer<typeof documentProjectArgsSchema>;
