import { z } from 'zod';

import { globalCommandOptionsSchema } from '@/core/schemas';

export const documentProjectArgsSchema = z
  .object({
    initialDocumentationPath: z.string(),
  })
  .and(globalCommandOptionsSchema);

export type DocumentProjectArgs = z.infer<typeof documentProjectArgsSchema>;
