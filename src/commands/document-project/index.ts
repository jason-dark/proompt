import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import * as path from 'path';

import { createCommandModule, replaceVariables } from '@/core/command-utils';
import { resolveSettings } from '@/core/config/resolver';
import { OUTPUT_FILE_NAMES } from '@/core/constants';
import { CommandHandlerArgs } from '@/core/types';
import { updateProjectDocHash } from '@/core/utils/doc-metadata';
import { anyDocumentationFilesModified } from '@/core/utils/file-tracker';
import { getCurrentCommitHash } from '@/core/utils/git';
import { executeRepomix } from '@/core/utils/repomix';
import { formatRulesForPrompt, readRulesFile } from '@/core/utils/rules';
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
    // Get current commit hash for tracking
    const commitHash = getCurrentCommitHash();
    if (!commitHash) {
      console.warn(
        '⚠️  Warning: Not in a git repository, commit hash tracking disabled'
      );
    }

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

    // Check for optional RULES.md file in project root
    const projectRules = readRulesFile(process.cwd());
    const formattedRules = projectRules
      ? formatRulesForPrompt(projectRules, 'project root')
      : '';

    // Inject template variables including XML file path and optional rules
    const enhancedArgs = {
      ...validatedArgs,
      repoXmlPath: xmlFilePath,
      outputFiles: outputFileNames.map((name) => `\`${name}\``).join(' and '),
      outputFileList: outputFileNames.join(' and '),
      outputAction: isPlural ? 'Create identical' : 'Create a',
      fileOrFiles: isPlural ? 'files' : 'file',
      requiredDocFiles: outputFileNames.map((name) => `"${name}"`).join(', '),
      allRequiredFilesExist: `all required files (${outputFileNames.join(', ')}) exist`,
      projectRules: formattedRules,
    };

    // Replace variables with provided arguments using imported function
    const processedContent = replaceVariables(proomptContent, enhancedArgs);

    // Record start time for file modification tracking
    const startTime = new Date();

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
          // Check if documentation files were actually modified
          const filesModified = anyDocumentationFilesModified(
            startTime,
            outputFileNames
          );

          // Update metadata if files were modified and we have a commit hash
          if (filesModified && commitHash) {
            try {
              updateProjectDocHash(commitHash);
              console.log(
                `📝 Updated project documentation metadata with commit ${commitHash.substring(0, 7)}`
              );
            } catch (error) {
              console.warn(
                '⚠️  Warning: Failed to update documentation metadata:',
                (error as Error).message
              );
            }
          } else if (filesModified && !commitHash) {
            console.log(
              '📝 Documentation files were modified but no commit hash available for tracking'
            );
          }

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
      'Generate comprehensive codebase analysis and overview documentation for AI coding tools',
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
