import { z } from 'zod';

export const validatePlanArgsSchema = z.object({
  planPath: z.string(),
});

export type ValidatePlanArgs = z.infer<typeof validatePlanArgsSchema>;
