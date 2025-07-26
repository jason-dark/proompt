import { z } from "zod";

export const executePlanArgsSchema = z.object({
  planPath: z.string(),
});

export type ExecutePlanArgs = z.infer<typeof executePlanArgsSchema>;
