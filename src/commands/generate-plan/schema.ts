import { z } from 'zod';

import { llmCommandOptionsSchema } from '@/core/schemas';

export const generatePlanArgsSchema = z
  .object({
    draftPlanPath: z.string(),
  })
  .and(llmCommandOptionsSchema);

export type GeneratePlanArgs = z.infer<typeof generatePlanArgsSchema>;
