import * as fs from 'fs';
import * as path from 'path';

export type DocMetadata = {
  project?: {
    commitHash: string;
    timestamp: string;
  };
  directories?: Record<
    string,
    {
      commitHash: string;
      timestamp: string;
    }
  >;
};

/**
 * Get the path to the documentation metadata file
 */
export const getDocMetadataPath = (): string => {
  return path.join(process.cwd(), '.proompt', 'doc-metadata.json');
};

/**
 * Ensure the .proompt directory exists
 */
export const ensureProomptDir = (): void => {
  const proomptDir = path.dirname(getDocMetadataPath());
  if (!fs.existsSync(proomptDir)) {
    fs.mkdirSync(proomptDir, { recursive: true });
  }
};

/**
 * Read documentation metadata from file
 */
export const readDocMetadata = (): DocMetadata => {
  const filePath = getDocMetadataPath();

  try {
    if (!fs.existsSync(filePath)) {
      return {};
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as DocMetadata;
  } catch {
    // Return empty metadata if file is corrupt or unreadable
    return {};
  }
};

/**
 * Write documentation metadata to file
 */
export const writeDocMetadata = (metadata: DocMetadata): void => {
  try {
    ensureProomptDir();
    const filePath = getDocMetadataPath();
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    throw new Error(
      `Failed to write documentation metadata: ${(error as Error).message}`
    );
  }
};

/**
 * Update project documentation metadata with commit hash
 */
export const updateProjectDocHash = (commitHash: string): void => {
  const metadata = readDocMetadata();
  metadata.project = {
    commitHash,
    timestamp: new Date().toISOString(),
  };
  writeDocMetadata(metadata);
};

/**
 * Update directory documentation metadata with commit hash
 */
export const updateDirDocHash = (dirPath: string, commitHash: string): void => {
  const metadata = readDocMetadata();
  if (!metadata.directories) {
    metadata.directories = {};
  }

  // Convert to relative path from project root for portability
  const relativePath = path.relative(process.cwd(), path.resolve(dirPath));
  metadata.directories[relativePath] = {
    commitHash,
    timestamp: new Date().toISOString(),
  };
  writeDocMetadata(metadata);
};

/**
 * Get project documentation metadata
 */
export const getProjectDocMetadata = (): DocMetadata['project'] | null => {
  const metadata = readDocMetadata();
  return metadata.project || null;
};

/**
 * Get directory documentation metadata
 */
export const getDirDocMetadata = (
  dirPath: string
): { commitHash: string; timestamp: string } | null => {
  const metadata = readDocMetadata();
  if (!metadata.directories) {
    return null;
  }

  // Convert to relative path to match how it's stored
  const relativePath = path.relative(process.cwd(), path.resolve(dirPath));
  return metadata.directories[relativePath] || null;
};
