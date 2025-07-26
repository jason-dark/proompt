import { z } from "zod";

export const documentOverviewArgsSchema = z.object({
  initialDocumentationPath: z.string()
});

export type DocumentOverviewArgs = z.infer<typeof documentOverviewArgsSchema>;