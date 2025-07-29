import { type CliOptions, runCli } from 'repomix';

export interface RepomixOptions {
  outputPath: string;
  workingDirectory?: string;
  excludePatterns?: string[];
}

/**
 * Execute repomix library to pack repository into XML format
 */
export const executeRepomix = async (
  options: RepomixOptions
): Promise<void> => {
  const {
    outputPath,
    workingDirectory = process.cwd(),
    excludePatterns = [],
  } = options;

  try {
    // Build repomix options for library usage
    const cliOptions: CliOptions = {
      output: outputPath,
      style: 'xml',
      ignore: ['CLAUDE.md', 'GEMINI.md', ...excludePatterns].join(','),
      quiet: true,
      compress: false,
    };

    // Use repomix library to process the repository
    const result = await runCli(['.'], workingDirectory, cliOptions);

    // Check if the operation was successful - result can be void or DefaultActionRunnerResult
    if (result && typeof result === 'object' && 'packResult' in result) {
      if (result.packResult.totalFiles === 0) {
        throw new Error('Repomix completed but no files were processed');
      }
    } else {
      // Result was void, which likely means success for quiet mode
      console.log('📦 Repository processing completed');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Repomix processing failed: ${error.message}`);
    } else {
      throw new Error('Repomix processing failed with unknown error');
    }
  }
};
