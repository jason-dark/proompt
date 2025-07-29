import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { settingsSchema } from '../schemas';
import { Settings, SettingsWithMeta } from '../types';

/**
 * Get the path to the global settings file
 */
export const getGlobalSettingsPath = (): string => {
  return path.join(os.homedir(), '.proompt', 'settings.json');
};

/**
 * Get the path to the project settings file
 */
export const getProjectSettingsPath = (): string => {
  return path.join(process.cwd(), '.proompt', 'settings.json');
};

/**
 * Ensure the global settings directory exists
 */
export const ensureGlobalSettingsDir = (): void => {
  const settingsDir = path.dirname(getGlobalSettingsPath());
  if (!fs.existsSync(settingsDir)) {
    fs.mkdirSync(settingsDir, { recursive: true });
  }
};

/**
 * Ensure the project settings directory exists
 */
export const ensureProjectSettingsDir = (): void => {
  const settingsDir = path.dirname(getProjectSettingsPath());
  if (!fs.existsSync(settingsDir)) {
    fs.mkdirSync(settingsDir, { recursive: true });
  }
};

/**
 * Read global settings from file with metadata
 */
export const readGlobalSettings = (): SettingsWithMeta => {
  const filePath = getGlobalSettingsPath();

  try {
    if (!fs.existsSync(filePath)) {
      return {
        settings: null,
        fileExists: false,
        filePath,
      };
    }

    const settingsContent = fs.readFileSync(filePath, 'utf8');
    const parsedSettings = JSON.parse(settingsContent);
    const validatedSettings = settingsSchema.parse(parsedSettings);

    return {
      settings: validatedSettings,
      fileExists: true,
      filePath,
    };
  } catch {
    console.warn('Warning: Could not read global settings file');
    return {
      settings: null,
      fileExists: false,
      filePath,
    };
  }
};

/**
 * Read project settings from file with metadata
 */
export const readProjectSettings = (): SettingsWithMeta => {
  const filePath = getProjectSettingsPath();

  try {
    if (!fs.existsSync(filePath)) {
      return {
        settings: null,
        fileExists: false,
        filePath,
      };
    }

    const settingsContent = fs.readFileSync(filePath, 'utf8');
    const parsedSettings = JSON.parse(settingsContent);
    const validatedSettings = settingsSchema.parse(parsedSettings);

    return {
      settings: validatedSettings,
      fileExists: true,
      filePath,
    };
  } catch {
    console.warn('Warning: Could not read project settings file');
    return {
      settings: null,
      fileExists: false,
      filePath,
    };
  }
};

/**
 * Write global settings to file
 */
export const writeGlobalSettings = (settings: Settings): void => {
  try {
    ensureGlobalSettingsDir();
    const settingsPath = getGlobalSettingsPath();
    const validatedSettings = settingsSchema.parse(settings);
    fs.writeFileSync(settingsPath, JSON.stringify(validatedSettings, null, 2));
  } catch (error) {
    throw new Error(
      `Failed to write global settings: ${(error as Error).message}`
    );
  }
};

/**
 * Write project settings to file
 */
export const writeProjectSettings = (settings: Settings): void => {
  try {
    ensureProjectSettingsDir();
    const settingsPath = getProjectSettingsPath();
    const validatedSettings = settingsSchema.parse(settings);
    fs.writeFileSync(settingsPath, JSON.stringify(validatedSettings, null, 2));
  } catch (error) {
    throw new Error(
      `Failed to write project settings: ${(error as Error).message}`
    );
  }
};
