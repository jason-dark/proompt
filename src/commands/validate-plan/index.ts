import { readFileSync } from 'fs';
import * as path from 'path';

import { createCommandModule } from '@/core/command-utils';

import { validatePlanArgsSchema } from './schema';

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, 'proompt.md'),
  'utf-8'
);

// Create and export the command module
export const validatePlanCommand = createCommandModule(
  {
    name: 'validate-plan',
    description: 'Validate and stress-test implementation plan',
    arguments: [
      {
        name: 'plan-path',
        description: 'Path to implementation plan file',
        required: true,
        type: 'string',
        positional: true,
      },
    ],
  },
  validatePlanArgsSchema,
  proomptContent
);
