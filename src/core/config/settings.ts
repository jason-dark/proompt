import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Settings, LlmCli, OutputFormat } from "../types";
import { settingsSchema } from "../schemas";
import { DEFAULT_LLM_CLI } from "../constants";

/**
 * Get the path to the settings file
 */
export const getSettingsPath = (): string => {
  return path.join(os.homedir(), ".proompt", "settings.json");
};

/**
 * Ensure the settings directory exists
 */
export const ensureSettingsDir = (): void => {
  const settingsDir = path.dirname(getSettingsPath());
  if (!fs.existsSync(settingsDir)) {
    fs.mkdirSync(settingsDir, { recursive: true });
  }
};

/**
 * Read settings from file
 */
export const readSettings = (): Settings => {
  try {
    const settingsPath = getSettingsPath();
    if (!fs.existsSync(settingsPath)) {
      return { llmCli: DEFAULT_LLM_CLI };
    }
    const settingsContent = fs.readFileSync(settingsPath, "utf8");
    const parsedSettings = JSON.parse(settingsContent);
    const validatedSettings = settingsSchema.parse(parsedSettings);
    return validatedSettings;
  } catch (error) {
    console.warn("Warning: Could not read settings file, using defaults");
    return { llmCli: DEFAULT_LLM_CLI };
  }
};

/**
 * Write settings to file
 */
export const writeSettings = (settings: Settings): void => {
  try {
    ensureSettingsDir();
    const settingsPath = getSettingsPath();
    const validatedSettings = settingsSchema.parse(settings);
    fs.writeFileSync(settingsPath, JSON.stringify(validatedSettings, null, 2));
  } catch (error) {
    throw new Error(`Failed to write settings: ${(error as Error).message}`);
  }
};

/**
 * Get the LLM CLI from settings
 */
export const getLLM = (): LlmCli => {
  const settings = readSettings();
  return settings.llmCli;
};

/**
 * Get the output format from settings, defaulting to the current LLM CLI
 */
export const getOutputFormat = (): OutputFormat => {
  const settings = readSettings();
  if (settings.outputFormat) {
    return settings.outputFormat;
  }
  // Default to current LLM CLI if no outputFormat is specified
  return [settings.llmCli];
};
