import { readFileSync } from 'fs';
import { promises as fs } from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

import { createCommandModule, replaceVariables } from '@/core/command-utils';
import { resolveSettings } from '@/core/config/resolver';
import { OUTPUT_FILE_NAMES } from '@/core/constants';
import { CommandHandlerArgs } from '@/core/types';
import { executeRepomix } from '@/core/utils/repomix';
import {
  generateTempXmlPath,
  logTempFileLocation,
} from '@/core/utils/temp-file';

import { documentDeepArgsSchema } from './schema';

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, 'proompt.md'),
  'utf-8'
);

/**
 * Custom handler that generates XML file before AI execution
 */
const customDocumentDeepHandler = async (
  args: CommandHandlerArgs
): Promise<void> => {
  // Validate arguments using schema
  const validatedArgs = documentDeepArgsSchema.parse(args);

  try {
    // Parse directory paths from CLI input string
    const directoryPaths = validatedArgs.directoryPaths
      .split(/\s+/)
      .filter((path) => path.length > 0);

    // Validate that all directory paths exist and are accessible
    for (const dirPath of directoryPaths) {
      try {
        const stats = await fs.stat(dirPath);
        if (!stats.isDirectory()) {
          throw new Error(`Path is not a directory: ${dirPath}`);
        }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          throw new Error(`Directory does not exist: ${dirPath}`);
        }
        throw new Error(
          `Cannot access directory: ${dirPath} - ${(error as Error).message}`
        );
      }
    }

    console.log(
      `📁 Validated ${directoryPaths.length} director${directoryPaths.length === 1 ? 'y' : 'ies'} for analysis`
    );

    // Generate XML files for each directory
    const directoryXmlMap: Record<string, string> = {};
    
    console.log('📦 Packing directories with repomix...');
    for (const dirPath of directoryPaths) {
      const xmlFilePath = generateTempXmlPath(`document-deep-${dirPath.replace(/[^a-zA-Z0-9]/g, '_')}`);
      
      console.log(`📁 Packing ${dirPath}...`);
      await executeRepomix({
        outputPath: xmlFilePath,
        workingDirectory: dirPath,
      });
      
      directoryXmlMap[dirPath] = xmlFilePath;
      logTempFileLocation(xmlFilePath);
    }
    console.log('✅ All directories packed successfully');

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

    // Create formatted directory-to-XML mapping for the prompt
    const directoryXmlMapping = Object.entries(directoryXmlMap)
      .map(([dir, xmlPath]) => `- ${dir}: \`${xmlPath}\``)
      .join('\n');

    // Inject template variables including XML mappings
    const enhancedArgs = {
      ...validatedArgs,
      directoryXmlMap: directoryXmlMapping,
      directoryPaths: directoryPaths.join(', '),
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
    console.log(`🤖 Launching ${llmCli} for directory analysis...`);
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
      '❌ Error during directory processing:',
      (error as Error).message
    );
    throw error;
  }
};

// Create and export the command module
export const documentDeepCommand = createCommandModule(
  {
    name: 'document-deep',
    description:
      'Generate comprehensive module/library documentation for AI coding tools',
    arguments: [
      {
        name: 'directory-paths',
        description:
          'Paths to directories for documentation generation (space-separated)',
        required: true,
        type: 'string',
        positional: true,
      },
    ],
  },
  documentDeepArgsSchema,
  proomptContent,
  customDocumentDeepHandler
);
