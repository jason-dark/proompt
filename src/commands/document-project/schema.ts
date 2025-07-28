import { z } from 'zod';

import { documentationCommandOptionsSchema } from '@/core/schemas';

export const documentProjectArgsSchema = z
  .object({
    initialDocumentationPath: z.string(),
  })
  .and(documentationCommandOptionsSchema);

export type DocumentProjectArgs = z.infer<typeof documentProjectArgsSchema>;
