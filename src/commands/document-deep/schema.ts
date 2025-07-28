import { z } from 'zod';

import { globalCommandOptionsSchema } from '@/core/schemas';

export const documentDeepArgsSchema = z
  .object({
    startPath: z.string(),
    skipExisting: z.boolean().default(false),
  })
  .and(globalCommandOptionsSchema);

export type DocumentDeepArgs = z.infer<typeof documentDeepArgsSchema>;
