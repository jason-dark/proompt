import { execSync } from 'child_process';

/**
 * Check if the current directory is a git repository
 */
export const isGitRepository = (): boolean => {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

/**
 * Get the current git commit hash
 * @returns The current commit hash or null if not in a git repository
 */
export const getCurrentCommitHash = (): string | null => {
  try {
    if (!isGitRepository()) {
      return null;
    }

    const hash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    return hash;
  } catch {
    return null;
  }
};

/**
 * Get git diff between two commits
 * @param fromCommit The starting commit hash
 * @param toCommit The ending commit hash (defaults to HEAD)
 * @returns The git diff output or null if error
 */
export const getGitDiff = (
  fromCommit: string,
  toCommit: string = 'HEAD'
): string | null => {
  try {
    if (!isGitRepository()) {
      return null;
    }

    const diff = execSync(`git diff ${fromCommit} ${toCommit}`, {
      encoding: 'utf8',
    });
    return diff;
  } catch {
    return null;
  }
};

/**
 * Get a short version of the commit hash (first 7 characters)
 * @returns The short commit hash or null if not in a git repository
 */
export const getShortCommitHash = (): string | null => {
  const fullHash = getCurrentCommitHash();
  return fullHash ? fullHash.substring(0, 7) : null;
};
