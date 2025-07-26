import { z } from "zod";

export const documentCodebaseArgsSchema = z.object({
  startPath: z.string()
});

export type DocumentCodebaseArgs = z.infer<typeof documentCodebaseArgsSchema>;