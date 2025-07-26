import { Command } from "commander";
import { z } from "zod";
import { CommandModule, CommandArgument, CommandHandlerArgs, CommandHandler } from "./types";
import { executeProompt } from "./execution/executor";

/**
 * Create a command module with type safety and schema validation
 */
export const createCommandModule = <T extends z.ZodSchema>(
  config: {
    name: string;
    description: string;
    arguments?: CommandArgument[];
  },
  argsSchema: T,
  proomptContent: string,
  customHandler?: CommandHandler
): CommandModule => {
  const handler: CommandHandler = customHandler || createDefaultHandler(proomptContent, argsSchema);

  return {
    config: {
      name: config.name,
      description: config.description,
      arguments: config.arguments || []
    },
    argsSchema,
    handler,
    proomptContent
  };
};

/**
 * Create default handler that executes proompt with schema-validated arguments
 */
const createDefaultHandler = <T extends z.ZodSchema>(
  proomptContent: string,
  argsSchema: T
): CommandHandler => {
  return async (args: CommandHandlerArgs): Promise<void> => {
    // Validate arguments using schema
    const validatedArgs = argsSchema.parse(args);
    
    // Use direct execution with proompt content instead of file path
    await executeProomptContent(proomptContent, validatedArgs as Record<string, unknown>);
  };
};

/**
 * Execute proompt with content directly (not from file)
 */
const executeProomptContent = async (content: string, args: Record<string, unknown>): Promise<void> => {
  const { getLLM, getOutputFormat } = await import("./config/settings");
  const { OUTPUT_FILE_NAMES } = await import("./constants");
  const { spawn } = await import("child_process");

  const llmCli = getLLM();
  const outputFormat = getOutputFormat();

  // Generate output file names based on configured formats
  const outputFileNames = outputFormat.map(format => OUTPUT_FILE_NAMES[format]);
  const isPlural = outputFileNames.length > 1;
  
  // Inject output format configuration into template variables
  const enhancedArgs = {
    ...args,
    outputFiles: outputFileNames.map(name => `\`${name}\``).join(' and '),
    outputFileList: outputFileNames.join(' and '),
    outputAction: isPlural ? 'Create identical' : 'Create a',
    fileOrFiles: isPlural ? 'files' : 'file',
    requiredDocFiles: outputFileNames.map(name => `"${name}"`).join(', '),
    allRequiredFilesExist: `all required files (${outputFileNames.join(', ')}) exist`
  };
  
  // Replace variables with provided arguments
  const processedContent = replaceVariables(content, enhancedArgs);
  
  // Launch interactive CLI with initial prompt
  let child;
  if (llmCli === 'claude') {
    // Claude accepts prompt as argument
    child = spawn('claude', [processedContent], {
      stdio: "inherit"
    });
  } else if (llmCli === 'gemini') {
    // Gemini uses -i flag for interactive with initial prompt
    child = spawn('gemini', ['-i', processedContent], {
      stdio: "inherit"
    });
  } else {
    throw new Error(`Unsupported LLM CLI: ${llmCli}`);
  }
  
  return new Promise((resolve, reject) => {
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
  });
};

/**
 * Replace template variables in content with provided arguments
 */
const replaceVariables = (content: string, args: Record<string, unknown>): string => {
  let result = content;
  
  for (const [key, value] of Object.entries(args)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, String(value));
  }
  
  return result;
};

/**
 * Add command module to Commander program with automatic option generation
 */
export const registerCommandModule = (program: Command, module: CommandModule): void => {
  const command = program
    .command(module.config.name)
    .description(module.config.description);

  // Add options based on command arguments
  for (const arg of module.config.arguments) {
    const optionFlag = arg.alias ? `-${arg.alias}, --${arg.name}` : `--${arg.name}`;
    const optionDescription = arg.required ? 
      `${arg.description} (required)` : 
      arg.description;

    if (arg.type === "boolean") {
      command.option(optionFlag, optionDescription);
    } else {
      const valueDesc = arg.type === "number" ? "<number>" : "<value>";
      command.option(`${optionFlag} ${valueDesc}`, optionDescription);
    }
  }

  // Set up action handler
  command.action(async (options: CommandHandlerArgs) => {
    try {
      await module.handler(options);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(`Error: Missing required arguments for command '${module.config.name}':`);
        for (const issue of error.issues) {
          const argName = String(issue.path[0]);
          const arg = module.config.arguments.find(a => a.name.replace(/-/g, '') === argName || 
                                                         a.name.replace(/-/g, '').toLowerCase() === argName.toLowerCase());
          if (arg) {
            const flag = arg.alias ? `-${arg.alias}, --${arg.name}` : `--${arg.name}`;
            console.error(`  ${flag}: ${arg.description}`);
          } else {
            console.error(`  --${argName}: ${issue.message}`);
          }
        }
        console.error(`\nUse 'proompt ${module.config.name} --help' for more information.`);
      } else {
        console.error(`Error running command ${module.config.name}: ${(error as Error).message}`);
      }
      process.exit(1);
    }
  });
};