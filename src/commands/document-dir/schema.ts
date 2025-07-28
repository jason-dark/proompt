import { z } from 'zod';

import { globalCommandOptionsSchema } from '@/core/schemas';

export const documentDirArgsSchema = z
  .object({
    directoryPath: z.string(),
    skipExisting: z.boolean().default(false),
  })
  .and(globalCommandOptionsSchema);

export type DocumentDirArgs = z.infer<typeof documentDirArgsSchema>;
