import { z } from 'zod';

export const generatePlanArgsSchema = z.object({
  draftPlanPath: z.string(),
});

export type GeneratePlanArgs = z.infer<typeof generatePlanArgsSchema>;
