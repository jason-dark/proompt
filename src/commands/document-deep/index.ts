import { readFileSync } from 'fs';
import * as path from 'path';

import { createCommandModule } from '@/core/command-utils';

import { documentDeepArgsSchema } from './schema';

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, 'proompt.md'),
  'utf-8'
);

// Create and export the command module
export const documentDeepCommand = createCommandModule(
  {
    name: 'document-deep',
    description:
      'Generate comprehensive module/library documentation for AI coding tools',
    arguments: [
      {
        name: 'start-path',
        description: 'Path to modules, libs, or packages directory',
        required: true,
        type: 'string',
        alias: 'i',
      },
      {
        name: 'skip-existing',
        description:
          'Skip directories where all required documentation files already exist (e.g. CLAUDE.md, GEMINI.md)',
        required: false,
        type: 'boolean',
        alias: 's',
      },
    ],
  },
  documentDeepArgsSchema,
  proomptContent
);
