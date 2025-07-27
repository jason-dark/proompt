import { readFileSync } from 'fs';
import * as path from 'path';

import { createCommandModule } from '@/core/command-utils';

import { documentProjectArgsSchema } from './schema';

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, 'proompt.md'),
  'utf-8'
);

// Create and export the command module
export const documentProjectCommand = createCommandModule(
  {
    name: 'document-project',
    description:
      'Generate comprehensive codebase analysis and overview documentation',
    arguments: [
      {
        name: 'initial-documentation-path',
        description:
          'Path to initial documentation file (README.md, CLAUDE.md, GEMINI.md)',
        required: true,
        type: 'string',
        alias: 'i',
      },
    ],
  },
  documentProjectArgsSchema,
  proomptContent
);
