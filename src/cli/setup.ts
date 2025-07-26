import { Command } from "commander";
import {
  readSettings,
  writeSettings,
  getSettingsPath,
} from "../core/config/settings";
import { llmCliSchema, outputFormatSchema } from "@/core/schemas";
import { Settings } from "@/core/types";
import { getCommandModules } from "@/commands";
import { setupCompletion } from "@/completion/shell";
import { registerCommandModule } from "@/core/command-utils";

/**
 * Change working directory if cwd option is provided
 */
const changeWorkingDirectory = (cwd?: string): void => {
  if (cwd) {
    try {
      process.chdir(cwd);
      console.log(`Changed working directory to: ${process.cwd()}`);
    } catch (error) {
      console.error(
        `Failed to change directory to ${cwd}: ${(error as Error).message}`
      );
      process.exit(1);
    }
  }
};

/**
 * Handle the main CLI options (list, set-llm-cli, completion, etc.)
 */
export const handleMainOptions = (
  options: Record<string, unknown>,
  complete: unknown
): void => {
  // Change working directory first if specified
  changeWorkingDirectory(options.cwd as string);

  if (options.completion) {
    return;
  }

  if (options.setupCompletion) {
    try {
      (complete as { setupShellInitFile: () => void }).setupShellInitFile();
      console.log(
        "Shell completion has been set up! Please restart your shell or run:"
      );
      console.log("  source ~/.bashrc   # for bash");
      console.log("  source ~/.zshrc    # for zsh");
    } catch (error) {
      console.error("Failed to setup completion:", (error as Error).message);
      console.log("You can manually add this to your shell config:");
      console.log('eval "$(proompt --completion)"');
      process.exit(1);
    }
    return;
  }

  if (options.list) {
    const commandModules = getCommandModules();
    console.log("Available proompts:");
    for (const module of commandModules) {
      console.log(
        `  ${module.config.name.padEnd(20)} → ${module.config.description}`
      );
    }
    return;
  }

  if (options.setLlmCli) {
    try {
      const llmCli = llmCliSchema.parse(options.setLlmCli);
      const currentSettings = readSettings();
      const newSettings: Settings = { ...currentSettings, llmCli };
      writeSettings(newSettings);
      console.log(`LLM CLI set to: ${llmCli}`);
      console.log(`Settings saved to: ${getSettingsPath()}`);
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        console.error(`Invalid LLM CLI. Valid options are: claude, gemini`);
      } else {
        console.error(`Error setting LLM CLI: ${(error as Error).message}`);
      }
      process.exit(1);
    }
    return;
  }

  if (options.setOutputFormat) {
    try {
      // Parse comma-separated format list
      const formatList = (options.setOutputFormat as string)
        .split(",")
        .map((f: string) => f.trim());
      const outputFormat = outputFormatSchema.parse(formatList);
      const currentSettings = readSettings();
      const newSettings: Settings = { ...currentSettings, outputFormat };
      writeSettings(newSettings);
      console.log(`Output format set to: ${formatList.join(", ")}`);
      console.log(`Settings saved to: ${getSettingsPath()}`);
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        console.error(
          `Invalid output format. Valid options are: claude, gemini (comma-separated)`
        );
        console.error(`Example: --set-output-format claude,gemini`);
      } else {
        console.error(
          `Error setting output format: ${(error as Error).message}`
        );
      }
      process.exit(1);
    }
    return;
  }
};

/**
 * Set up the main CLI program with all options and commands
 */
export const setupCli = (): Command => {
  const program = new Command();
  const complete = setupCompletion();

  program
    .name("proompt")
    .description(
      "CLI tool for running AI prompts with structure and repeatability"
    )
    .version("1.0.0");

  program
    .option("--completion", "output completion script for shell")
    .option("--setup-completion", "setup shell completion")
    .option("-l, --list", "list all available proompts")
    .option("--set-llm-cli <llm>", "set the default LLM CLI (claude|gemini)")
    .option(
      "--set-output-format <formats>",
      "set output format (claude,gemini or any combination)"
    )
    .option(
      "-C, --cwd <directory>",
      "change working directory before running command"
    )
    .action((options) => handleMainOptions(options, complete));

  // Register all command modules automatically
  const commandModules = getCommandModules();
  for (const commandModule of commandModules) {
    registerCommandModule(program, commandModule);
  }

  program.on("command:*", () => {
    console.error(
      "Invalid command: %s\nSee --help for a list of available commands.",
      program.args.join(" ")
    );
    process.exit(1);
  });

  return program;
};
