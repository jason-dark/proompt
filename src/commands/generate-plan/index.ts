import { readFileSync } from 'fs';
import * as path from 'path';

import { createCommandModule } from '@/core/command-utils';

import { generatePlanArgsSchema } from './schema';

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, 'proompt.md'),
  'utf-8'
);

// Create and export the command module
export const generatePlanCommand = createCommandModule(
  {
    name: 'generate-plan',
    description:
      'Generate detailed implementation plan from draft requirements',
    arguments: [
      {
        name: 'draft-plan-path',
        description: 'Path to draft plan file',
        required: true,
        type: 'string',
        positional: true,
      },
    ],
  },
  generatePlanArgsSchema,
  proomptContent
);
