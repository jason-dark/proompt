import { z } from 'zod';

import { globalCommandOptionsSchema } from '@/core/schemas';

// Lyra command typically doesn't take arguments
export const lyraArgsSchema = z.object({}).and(globalCommandOptionsSchema);

export type LyraArgs = z.infer<typeof lyraArgsSchema>;
