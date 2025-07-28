import { z } from 'zod';

import { llmCommandOptionsSchema } from '@/core/schemas';

export const executePlanArgsSchema = z
  .object({
    planPath: z.string(),
  })
  .and(llmCommandOptionsSchema);

export type ExecutePlanArgs = z.infer<typeof executePlanArgsSchema>;
