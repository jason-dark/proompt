import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import * as path from 'path';

import { createCommandModule, replaceVariables } from '@/core/command-utils';
import { resolveSettings } from '@/core/config/resolver';
import { OUTPUT_FILE_NAMES } from '@/core/constants';
import { CommandHandlerArgs } from '@/core/types';
import { executeRepomix } from '@/core/utils/repomix';
import {
  generateTempXmlPath,
  logTempFileLocation,
} from '@/core/utils/temp-file';

import { documentProjectArgsSchema } from './schema';

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, 'proompt.md'),
  'utf-8'
);

/**
 * Custom handler that generates XML file before AI execution
 */
const customDocumentProjectHandler = async (
  args: CommandHandlerArgs
): Promise<void> => {
  // Validate arguments using schema
  const validatedArgs = documentProjectArgsSchema.parse(args);

  try {
    // Generate temporary XML file path
    const xmlFilePath = generateTempXmlPath('document-project');

    // Log temp file location for user awareness
    logTempFileLocation(xmlFilePath);

    // Execute repomix library to generate XML
    console.log('📦 Packing repository with repomix...');
    await executeRepomix({
      outputPath: xmlFilePath,
      workingDirectory: process.cwd(),
    });
    console.log('✅ Repository packed successfully');

    // Resolve settings using hierarchy: args > user settings > defaults
    const settingsOverride = {
      llmCli: args?.llmCli as 'claude' | 'gemini' | undefined,
      outputFormat: args?.outputFormat as string | undefined,
    };

    const resolvedSettings = resolveSettings(settingsOverride);
    const llmCli = resolvedSettings.llmCli;
    const outputFormat = resolvedSettings.outputFormat;

    // Generate output file names based on configured formats
    const outputFileNames = outputFormat.map(
      (format) => OUTPUT_FILE_NAMES[format]
    );
    const isPlural = outputFileNames.length > 1;

    // Inject template variables including XML file path
    const enhancedArgs = {
      ...validatedArgs,
      repoXmlPath: xmlFilePath,
      outputFiles: outputFileNames.map((name) => `\`${name}\``).join(' and '),
      outputFileList: outputFileNames.join(' and '),
      outputAction: isPlural ? 'Create identical' : 'Create a',
      fileOrFiles: isPlural ? 'files' : 'file',
      requiredDocFiles: outputFileNames.map((name) => `"${name}"`).join(', '),
      allRequiredFilesExist: `all required files (${outputFileNames.join(', ')}) exist`,
    };

    // Replace variables with provided arguments using imported function
    const processedContent = replaceVariables(proomptContent, enhancedArgs);

    // Launch interactive CLI with initial prompt
    console.log(`🤖 Launching ${llmCli} for repository analysis...`);
    let child;
    if (llmCli === 'claude') {
      child = spawn('claude', [processedContent], {
        stdio: 'inherit',
      });
    } else if (llmCli === 'gemini') {
      child = spawn('gemini', ['-i', processedContent], {
        stdio: 'inherit',
      });
    } else {
      throw new Error(`Unsupported LLM CLI: ${llmCli}`);
    }

    return new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`${llmCli} command failed with exit code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error(
      '❌ Error during repository processing:',
      (error as Error).message
    );
    throw error;
  }
};

// Create and export the command module with custom handler
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
        positional: true,
      },
    ],
  },
  documentProjectArgsSchema,
  proomptContent,
  customDocumentProjectHandler
);
