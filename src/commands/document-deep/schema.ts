import { z } from 'zod';

import { documentationCommandOptionsSchema } from '@/core/schemas';

export const documentDeepArgsSchema = z
  .object({
    directoryPaths: z
      .string()
      .min(1, 'At least one directory path is required'),
  })
  .and(documentationCommandOptionsSchema);

export type DocumentDeepArgs = z.infer<typeof documentDeepArgsSchema>;
