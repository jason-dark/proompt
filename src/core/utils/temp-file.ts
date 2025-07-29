import { randomBytes } from 'crypto';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * Generate a unique temporary file path for repository XML output
 */
export const generateTempXmlPath = (
  prefix: string = 'proompt-repo'
): string => {
  const timestamp = Date.now();
  const randomSuffix = randomBytes(8).toString('hex');
  const filename = `${prefix}-${timestamp}-${randomSuffix}.xml`;
  return join(tmpdir(), filename);
};

/**
 * Log temporary file location for manual cleanup
 */
export const logTempFileLocation = (filepath: string): void => {
  console.log(`📁 Temporary XML file created: ${filepath}`);
  console.log(`🧹 Note: Clean up manually when finished: rm "${filepath}"`);
};
