import { z } from 'zod';

import { documentationCommandOptionsSchema } from '@/core/schemas';

export const documentDirArgsSchema = z
  .object({
    directoryPath: z.string(),
    skipExisting: z.boolean().default(false),
  })
  .and(documentationCommandOptionsSchema);

export type DocumentDirArgs = z.infer<typeof documentDirArgsSchema>;
