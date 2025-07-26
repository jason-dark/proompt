import { spawn } from "child_process";
import { readFileSync } from "fs";
import { getLLM, getOutputFormat } from "../config/settings";
import { ProomptArguments } from "../types";
import { OUTPUT_FILE_NAMES } from "../constants";

/**
 * Replace template variables in content with provided arguments
 */
const replaceVariables = (content: string, args: ProomptArguments): string => {
  let result = content;
  
  for (const [key, value] of Object.entries(args)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, String(value));
  }
  
  return result;
};

/**
 * Execute proompt with the configured LLM CLI and optional arguments
 */
export const executeProompt = (proomptPath: string, args: ProomptArguments = {}): Promise<void> => {
  const llmCli = getLLM();
  const outputFormat = getOutputFormat();

  return new Promise((resolve, reject) => {
    try {
      // Read the proompt file content
      const content = readFileSync(proomptPath, 'utf-8');
      
      // Generate output file names based on configured formats
      const outputFileNames = outputFormat.map(format => OUTPUT_FILE_NAMES[format]);
      const isPlural = outputFileNames.length > 1;
      
      // Inject output format configuration into template variables
      const enhancedArgs = {
        ...args,
        outputFiles: outputFileNames.map(name => `\`${name}\``).join(' and '),
        outputFileList: outputFileNames.join(' and '),
        outputAction: isPlural ? 'Create identical' : 'Create a',
        fileOrFiles: isPlural ? 'files' : 'file'
      };
      
      // Replace variables with provided arguments
      const processedContent = replaceVariables(content, enhancedArgs);
      
      // Write content to stdin instead of using shell command substitution
      const child = spawn(llmCli, [], {
        stdio: ["pipe", "inherit", "inherit"],
      });
      
      // Write the processed content to stdin
      child.stdin?.write(processedContent);
      child.stdin?.end();

      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`${llmCli} command failed with exit code ${code}`));
        }
      });

      child.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};