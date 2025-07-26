import { readFileSync } from "fs";
import * as path from "path";
import { executePlanArgsSchema } from "./schema";
import { createCommandModule } from "@/core/command-utils";

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, "proompt.md"),
  "utf-8"
);

// Create and export the command module
export const executePlanCommand = createCommandModule(
  {
    name: "execute-plan",
    description: "Execute validated implementation plan",
    arguments: [
      {
        name: "plan-path",
        description: "Path to implementation plan file",
        required: true,
        type: "string",
        alias: "i",
      },
    ],
  },
  executePlanArgsSchema,
  proomptContent
);
