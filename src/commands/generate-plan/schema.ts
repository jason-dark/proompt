import { z } from 'zod';

import { globalCommandOptionsSchema } from '@/core/schemas';

export const generatePlanArgsSchema = z
  .object({
    draftPlanPath: z.string(),
  })
  .and(globalCommandOptionsSchema);

export type GeneratePlanArgs = z.infer<typeof generatePlanArgsSchema>;
