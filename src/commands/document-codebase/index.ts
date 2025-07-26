import { readFileSync } from "fs";
import * as path from "path";
import { createCommandModule } from "../../core/command-utils";
import { documentCodebaseArgsSchema } from "./schema";

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, "proompt.md"), 
  "utf-8"
);

// Create and export the command module
export const documentCodebaseCommand = createCommandModule(
  {
    name: "document-codebase",
    description: "Generate comprehensive module/library documentation for AI coding tools",
    arguments: [
      {
        name: "start-path",
        description: "Path to modules, libs, or packages directory",
        required: true,
        type: "string",
        alias: "i"
      }
    ]
  },
  documentCodebaseArgsSchema,
  proomptContent
);