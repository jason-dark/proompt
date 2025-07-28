import { z } from 'zod';

import { documentationCommandOptionsSchema } from '@/core/schemas';

export const documentDeepArgsSchema = z
  .object({
    startPath: z.string(),
    skipExisting: z.boolean().default(false),
  })
  .and(documentationCommandOptionsSchema);

export type DocumentDeepArgs = z.infer<typeof documentDeepArgsSchema>;
