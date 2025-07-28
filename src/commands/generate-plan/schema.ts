import { z } from 'zod';

import { planningCommandOptionsSchema } from '@/core/schemas';

export const generatePlanArgsSchema = z
  .object({
    draftPlanPath: z.string(),
  })
  .and(planningCommandOptionsSchema);

export type GeneratePlanArgs = z.infer<typeof generatePlanArgsSchema>;
