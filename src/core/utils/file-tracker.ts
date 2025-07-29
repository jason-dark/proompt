import * as fs from 'fs';
import * as path from 'path';

/**
 * Get the modification time of a file
 * @param filePath The path to the file
 * @returns The modification time as a Date, or null if file doesn't exist
 */
export const getFileModificationTime = (filePath: string): Date | null => {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch {
    return null;
  }
};

/**
 * Check if any of the specified documentation files were modified after a given time
 * @param startTime The time to compare against
 * @param outputFileNames Array of output file names to check (e.g., ['CLAUDE.md', 'GEMINI.md'])
 * @returns Object with results for each file
 */
export const checkDocumentationFilesModified = (
  startTime: Date,
  outputFileNames: string[]
): Record<string, { exists: boolean; modified: boolean; modTime: Date | null }> => {
  const results: Record<string, { exists: boolean; modified: boolean; modTime: Date | null }> = {};
  
  for (const fileName of outputFileNames) {
    const modTime = getFileModificationTime(fileName);
    const exists = modTime !== null;
    const modified = exists && modTime > startTime;
    
    results[fileName] = {
      exists,
      modified,
      modTime,
    };
  }
  
  return results;
};

/**
 * Check if any documentation files were actually created or modified
 * @param startTime The time before the LLM CLI was launched
 * @param outputFileNames Array of output file names to check
 * @returns True if any files were created or modified after startTime
 */
export const anyDocumentationFilesModified = (
  startTime: Date,
  outputFileNames: string[]
): boolean => {
  const results = checkDocumentationFilesModified(startTime, outputFileNames);
  return Object.values(results).some(result => result.modified);
};

/**
 * Check if documentation files were modified in specific directories
 * @param startTime The time to compare against
 * @param outputFileNames Array of output file names to check (e.g., ['CLAUDE.md', 'GEMINI.md'])
 * @param directories Array of directory paths to check in
 * @returns True if any files were created or modified after startTime in any directory
 */
export const anyDocumentationFilesModifiedInDirs = (
  startTime: Date,
  outputFileNames: string[],
  directories: string[]
): boolean => {
  for (const dir of directories) {
    for (const fileName of outputFileNames) {
      const filePath = path.join(dir, fileName);
      const modTime = getFileModificationTime(filePath);
      if (modTime && modTime > startTime) {
        return true;
      }
    }
  }
  return false;
};