import { z } from 'zod';

import { globalCommandOptionsSchema } from '@/core/schemas';

export const executePlanArgsSchema = z
  .object({
    planPath: z.string(),
  })
  .and(globalCommandOptionsSchema);

export type ExecutePlanArgs = z.infer<typeof executePlanArgsSchema>;
