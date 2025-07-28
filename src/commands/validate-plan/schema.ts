import { z } from 'zod';

import { globalCommandOptionsSchema } from '@/core/schemas';

export const validatePlanArgsSchema = z
  .object({
    planPath: z.string(),
  })
  .and(globalCommandOptionsSchema);

export type ValidatePlanArgs = z.infer<typeof validatePlanArgsSchema>;
