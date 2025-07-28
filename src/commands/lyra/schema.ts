import { z } from 'zod';

import { llmCommandOptionsSchema } from '@/core/schemas';

// Lyra command typically doesn't take arguments
export const lyraArgsSchema = z.object({}).and(llmCommandOptionsSchema);

export type LyraArgs = z.infer<typeof lyraArgsSchema>;
