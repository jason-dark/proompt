import { z } from 'zod';

import { planningCommandOptionsSchema } from '@/core/schemas';

export const validatePlanArgsSchema = z
  .object({
    planPath: z.string(),
  })
  .and(planningCommandOptionsSchema);

export type ValidatePlanArgs = z.infer<typeof validatePlanArgsSchema>;
