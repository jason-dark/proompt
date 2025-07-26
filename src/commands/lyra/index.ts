import { readFileSync } from "fs";
import * as path from "path";
import { lyraArgsSchema } from "./schema";
import { createCommandModule } from "@/core/command-utils";

// Read proompt content
const proomptContent = readFileSync(
  path.join(__dirname, "proompt.md"),
  "utf-8"
);

// Create and export the command module
export const lyraCommand = createCommandModule(
  {
    name: "lyra",
    description: "Optimize prompts for better AI responses",
    arguments: [],
  },
  lyraArgsSchema,
  proomptContent
);
