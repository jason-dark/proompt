import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

/**
 * Reads a RULES.md file from the specified directory if it exists and has content.
 * This is an optional feature - missing files are expected and handled silently.
 *
 * @param directoryPath - The directory to check for RULES.md
 * @returns The content of RULES.md if found and has content, undefined otherwise
 */
export const readRulesFile = (directoryPath: string): string | undefined => {
  const rulesPath = path.join(directoryPath, 'RULES.md');

  try {
    if (!existsSync(rulesPath)) {
      return undefined;
    }

    const content = readFileSync(rulesPath, 'utf-8').trim();

    // Return undefined if file exists but has no meaningful content
    if (content.length === 0) {
      return undefined;
    }

    return content;
  } catch {
    // Silently handle any file reading errors - this is an optional feature
    return undefined;
  }
};

/**
 * Reads RULES.md files from multiple directories and combines them.
 * Used by document-dirs command to collect rules from all specified directories.
 *
 * @param directoryPaths - Array of directory paths to check for RULES.md
 * @returns Object mapping directory paths to their rules content (only includes directories with rules)
 */
export const readRulesFromDirectories = (
  directoryPaths: string[]
): Record<string, string> => {
  const rulesMap: Record<string, string> = {};

  for (const dirPath of directoryPaths) {
    const rules = readRulesFile(dirPath);
    if (rules) {
      rulesMap[dirPath] = rules;
    }
  }

  return rulesMap;
};

/**
 * Formats rules content for inclusion in prompts with strong emphasis on compliance.
 *
 * @param rules - The rules content to format
 * @param source - Description of where the rules came from (e.g., "project root" or "directory X")
 * @returns Formatted rules text for prompt inclusion
 */
export const formatRulesForPrompt = (rules: string, source: string): string => {
  return `
It is imperative you write the following information verbatim into your output at the end of the file:

## CRITICAL PROJECT RULES FROM ${source.toUpperCase()}

**⚠️  MANDATORY COMPLIANCE NOTICE ⚠️**

The following rules are **NON-NEGOTIABLE** and **SUPERSEDE** any patterns, conventions, or practices you may discover in the codebase analysis. These rules come directly from the project maintainers and represent absolute requirements.

**FAILURE TO FOLLOW THESE RULES IS A CRITICAL FAILURE** for any agentic coder working on this project.

---

${rules}

---

Remember: These rules are **mandatory** and **non-negotiable**. They override any conflicting information you may find elsewhere in the codebase or documentation.

**END OF CRITICAL PROJECT RULES**

`;
};

/**
 * Formats multiple rules from different directories for the document-dirs command.
 *
 * @param rulesMap - Object mapping directory paths to their rules content
 * @returns Formatted rules text for prompt inclusion, or undefined if no rules found
 */
export const formatMultipleRulesForPrompt = (
  rulesMap: Record<string, string>
): string | undefined => {
  const directories = Object.keys(rulesMap);

  if (directories.length === 0) {
    return undefined;
  }

  let formattedRules = `
It is imperative you write the following information verbatim into your output at the end of the file:

## CRITICAL PROJECT RULES FROM ANALYZED DIRECTORIES

**⚠️  MANDATORY COMPLIANCE NOTICE ⚠️**

The following rules are **NON-NEGOTIABLE** and **SUPERSEDE** any patterns, conventions, or practices you may discover in the codebase analysis. These rules come directly from the project maintainers and represent absolute requirements.

**FAILURE TO FOLLOW THESE RULES IS A CRITICAL FAILURE** for any agentic coder working on this project.

---
`;

  for (const [dirPath, rules] of Object.entries(rulesMap)) {
    formattedRules += `
### Rules from: ${dirPath}

${rules}

---
`;
  }

  formattedRules += `

Remember: These rules are **mandatory** and **non-negotiable**. They override any conflicting information you may find elsewhere in the codebase or documentation.

**END OF CRITICAL PROJECT RULES**
`;

  return formattedRules;
};
