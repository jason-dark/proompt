import { z } from 'zod';

import { llmCommandOptionsSchema } from '@/core/schemas';

export const validatePlanArgsSchema = z
  .object({
    planPath: z.string(),
  })
  .and(llmCommandOptionsSchema);

export type ValidatePlanArgs = z.infer<typeof validatePlanArgsSchema>;
