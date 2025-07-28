import { readFileSync } from 'fs';
import * as path from 'path';

import { createCommandModule } from '@/core/command-utils';

import { documentDirArgsSchema } from './schema';

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, 'proompt.md'),
  'utf-8'
);

// Create and export the command module
export const documentDeepCommand = createCommandModule(
  {
    name: 'document-dir',
    description:
      'Generate comprehensive documentation for AI coding tools in a specific directory',
    arguments: [
      {
        name: 'directory-path',
        description: 'Path to directory to document',
        required: true,
        type: 'string',
        positional: true,
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
  documentDirArgsSchema,
  proomptContent
);
