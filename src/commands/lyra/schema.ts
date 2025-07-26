import { z } from "zod";

// Lyra command typically doesn't take arguments
export const lyraArgsSchema = z.object({});

export type LyraArgs = z.infer<typeof lyraArgsSchema>;