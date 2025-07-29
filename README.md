# Proompt

[![npm version](https://badge.fury.io/js/@jasondark%2Fproompt.svg)](https://badge.fury.io/js/@jasondark%2Fproompt)
[![Build Status](https://github.com/jason-dark/proompt/workflows/Publish%20to%20NPM/badge.svg)](https://github.com/jason-dark/proompt/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

```
 ____                                           __
/\  _`\                                        /\ \__
\ \ \L\ \_ __   ___     ___     ___ ___   _____\ \ ,_\
 \ \ ,__/\`'__\/ __`\  / __`\ /' __` __`\/\ '__`\ \ \/
  \ \ \/\ \ \//\ \L\ \/\ \L\ \/\ \/\ \/\ \ \ \L\ \ \ \_
   \ \_\ \ \_\\ \____/\ \____/\ \_\ \_\ \_\ \ ,__/\ \__\
    \/_/  \/_/ \/___/  \/___/  \/_/\/_/\/_/\ \ \/  \/__/
                                            \ \_\
                                             \/_/
```

**Turn vague requirements into bulletproof implementation plans that AI coding
tools can execute flawlessly.**

Stop wasting cycles on endless revisions. When your implementation plan is
thorough, coding becomes straightforward and you build exactly what's needed —
not what the AI thinks you want.

## The Problem

You feed a poorly groomed ticket to Claude Code or Cursor:

```
"Add user authentication to the app"
```

Three hours later, you have:

- Authentication that doesn't integrate with your existing user system
- Security patterns that don't match your codebase
- Breaking changes to components that should have been left alone
- A feature that technically "works" but created more problems that it solved

## The Solution

Proompt transforms that vague requirement into a precise specification with
actual code:

```markdown
## Implementation Plan: User Authentication

### Context

- Existing user data in PostgreSQL via Prisma ORM
- Current session management using JWT tokens
- React frontend with existing UserContext provider ...

### Implementation Steps

1. **Extend User model with password_hash field** File: prisma/schema.prisma

   model User { id String @id @default(cuid()) email String @unique name String?
   password_hash String? // Add this field createdAt DateTime @default(now())
   ... }

2. **Create AuthService with bcrypt password hashing** File:
   src/services/AuthService.ts (new file)

   import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken';

   export class AuthService { static async hashPassword(password: string):
   Promise<string> { return bcrypt.hash(password, 12); }

   static async validatePassword(password: string, hash: string):
   Promise<boolean> { return bcrypt.compare(password, hash); } ... }

3. **Add login/register endpoints** File: src/pages/api/auth/register.ts

   export default async function handler(req: NextApiRequest, res:
   NextApiResponse) { if (req.method !== 'POST') return res.status(405).end();

   const { email, password } = req.body; const hashedPassword = await
   AuthService.hashPassword(password); ... }

...

### Files to Modify

- prisma/schema.prisma (User model extension)
- src/services/AuthService.ts (new file)
- src/pages/api/auth/register.ts (new file)
- src/pages/api/auth/login.ts (new file)
- src/contexts/UserContext.tsx (auth state management)
- src/components/Dashboard.tsx (route protection) ...

### Acceptance Criteria

- Users can register with email/password
- Login persists across browser sessions
- Existing user data remains intact
- Dashboard redirects to login when unauthenticated ...
```

Now when Proompt instructs your AI coding tool to implement this plan, it builds
exactly what you need and doesn't tie itself in knots with hallucinations.

## Quick Start

```bash
# Install globally
npm install -g proompt

# Set your AI coding tool
proompt config -L claude  # or gemini

# One-time codebase overview documentation (5 minutes)
proompt document-project "README.md"
# Document libs/modules/packages/apps or any dirs with specific project logic (time depends on codebase size)
proompt document-deep "libs/client/auth libs/server/auth"
# Document specific directory/module (faster than full codebase)
proompt document-dir "src/libs/auth"

# Start your next feature
echo "Add user authentication to the app ..." > "draft.md"
proompt generate-plan "jira-ticket-export.xml" -o "plan-v1.md"
```

## Core Workflow

### 1. **Plan** - Iterate until the specification is bulletproof

```bash
# Generate a plan from a draft you wrote
proompt generate-plan "draft-plan.md" -o "plan-v1.md"
```

**Draft Plan Sources**: Your draft plan can come from anywhere:

- **Claude Code Plan Mode**: Use Claude Code's plan mode to generate an initial
  plan, save it as `draft-plan.md`, then run
  `proompt generate-plan "draft-plan.md" -o "plan-v1.md"`
- **Manual Requirements**: Write your own requirements in markdown or text
  format
- **Tickets & Documentation**: Export Jira tickets to XML, copy GitHub issues,
  or paste any existing documentation in markdown, HTML, or text format
- **Voice Notes**: Dictate requirements into a text file and use that as your
  starting point

The key is to describe the desired outcome you are looking for. You don't need
to have fully fleshed out acceptance criteria (although that doesn't hurt), you
just need to describe what the end state should be.

**Critical**: Run `proompt generate-plan "draft-plan.md" -o "plan-version.md"`
multiple times, each in a fresh LLM context window. After each run:

- Manually review the output for gaps or issues
- Make corrections to address any problems you spot
- Save the improved version and run `proompt generate-plan` with that improved
  version again (updating the output file path)
- Repeat this process until the plan feels solid

Proompt creates implementation plans with:

- Actual code snippets for each modification
- File-level implementation details
- Integration points with existing architecture
- Comprehensive edge case handling

**Expect 2-5 iterations** depending on feature complexity. Simple features might
be ready after 2-3 runs. Complex enterprise features may need 5+ iterations.
Each cycle builds on the previous output, creating increasingly detailed and
robust plans.

### 2. **Validate** - Stress-test the plan relentlessly

```bash
# Validate a plan for completeness
proompt validate-plan "plan-v3.md" -o "validated-plan-v1.md"
```

**Critical**: Like planning, validation requires multiple iterations in fresh
contexts. Each validation cycle:

- Intentionally tries to break your plan
- Surfaces missing dependencies and integration challenges
- Identifies potential breaking changes and edge cases
- Questions assumptions about existing code behavior
- Provides feedback on the plan

After each validation:

- Review the feedback
- Address the feedback manually or with the assistance of your LLM
- Run validation again with the improved plan
- Continue until no new problems surface

**Using Proompt's rigorous plan validation stops human and non-human coders
alike from going rogue during implementation.**

### 3. **Implement** - Execute with confidence

```bash
proompt execute-plan "battle-tested-plan.md"
```

With thorough planning and validation, your AI coding tool has everything needed
for successful first-try implementation.

### The Investment Mindset

**Planning time prevents implementation chaos.** A feature that takes 1 hour to
plan and validate properly might save 8+ hours of debugging, refactoring, and
stakeholder confusion.

- **Simple features**: 2-3 planning iterations, 2-3 validation cycles
- **Complex features**: 5+ planning iterations, 5+ validation cycles
- **Enterprise/cross-system features**: 8+ planning iterations, 8+ validation
  cycles

The complexity of your codebase and the scope of the change determine iteration
count, not arbitrary limits.

## Commands Reference

### Setup & Configuration

```bash
# Choose your AI tool
proompt config -L claude        # Claude Code
proompt config -L gemini        # Gemini CLI

# Configure output format
proompt config -F claude,gemini  # Both CLAUDE.md and GEMINI.md
proompt config -F claude         # Just CLAUDE.md files

# One-time codebase documentation
proompt document-project "README.md"
proompt document-deep "src/components/AppLayout src/components/Providers"  # React projects
proompt document-deep "libs/parser libs/decoder libs/encoder" # Nx monorepos
proompt document-deep "modules/typegen services/api" # Custom project structure

# Document specific directories
proompt document-dir "src/libs/api"    # Single directory
proompt document-dir "src/libs/auth" -s      # Skip if docs exist
```

### Development Workflow

```bash
# Core planning cycle
proompt generate-plan "requirements.md" -o "plan-v1.md"
# Rerun as many times as needed to make a solid plan
# ...
proompt validate-plan "plan-v4.md" -o "validated-plan-v1.md"
# Rerun as many times as needed to end up with a thoroughly validated plan
# ...
proompt execute-plan "validated-plan-v5.md"

# Utilities
proompt lyra                        # Prompt optimization
proompt --help                      # All commands
proompt -C "/path/to/project" <cmd>   # Run from different directory
```

## Configuration

Proompt stores its configuration in a JSON file located at
`~/.proompt/settings.json`. This file is created when you first use the
`proompt config` command and persists settings across all projects. If no
settings file exists, Proompt uses the built-in defaults: `claude` for the LLM
CLI and generates `CLAUDE.md` files.

### Settings Hierarchy

Proompt follows a clear hierarchy for configuration:

1. **Command-line arguments** (highest priority) - Override settings for a
   single command execution
2. **User settings file** (`~/.proompt/settings.json`) - Your default
   preferences
3. **Built-in defaults** (lowest priority) - Fallback when no configuration is
   set

### Settings File Location

```
~/.proompt/settings.json
```

### Available Configuration Options

| Option         | Type   | Description                                              | Valid Values                                       |
| -------------- | ------ | -------------------------------------------------------- | -------------------------------------------------- |
| `llmCli`       | string | The AI coding tool to use for executing proompt commands | `"claude"`, `"gemini"`                             |
| `outputFormat` | array  | Which output files to generate (optional)                | `["claude"]`, `["gemini"]`, `["claude", "gemini"]` |

### Example Configuration

```json
{
  "llmCli": "claude",
  "outputFormat": ["claude", "gemini"]
}
```

### Configuration Commands

```bash
# View current configuration
proompt config

# Set your primary AI tool
proompt config -L claude        # Use Claude Code
proompt config -L gemini        # Use Gemini CLI

# Configure output formats (creates separate files for each tool)
proompt config -F claude         # Generate only CLAUDE.md files
proompt config -F gemini         # Generate only GEMINI.md files
proompt config -F claude,gemini  # Generate both CLAUDE.md and GEMINI.md files
```

### Per-Command Overrides

You can override settings for individual command executions without changing
your defaults:

```bash
# Use a different LLM for this specific command
proompt generate-plan "draft.md" -o "plan.md" -L gemini

# Generate different output format for this command (documentation commands only)
proompt document-deep "src" -F claude,gemini

# Combine multiple overrides
proompt document-deep "src" -L claude -F gemini
```

### Default Behavior

- **Default LLM CLI**: `claude`
- **Default Output Format**: Uses the selected LLM CLI (e.g., if `llmCli` is
  `"claude"`, generates `CLAUDE.md` files)
- **Settings Directory**: Created automatically on first use

## Real-World Examples

### Enterprise Monorepo

```bash
# Document the entire libs structure
proompt document-deep "libs packages"

# Plan a feature that spans multiple packages
proompt generate-plan "cross-service-feature.md" -o "implementation-plan.md"
```

### React Project

```bash
# Document component architecture
proompt document-deep "src components"

# Plan component refactoring with state management changes
proompt generate-plan "refactor-user-components.md" -o "refactor-plan.md"
```

### API Integration

```bash
# Plan new API endpoints with database changes
echo "Add webhook system for payment notifications..." > "webhook-requirements.md"
proompt generate-plan "webhook-requirements.md" -o "webhook-plan.md"
```

### Directory-Specific Documentation

Use `document-dir` to create focused documentation for individual directories or
modules:

```bash
# Document a specific component directory
proompt document-dir "src/components/ui"

# Document a service module
proompt document-dir "src/services/auth"

# Skip directories that already have complete documentation
proompt document-dir "libs/shared" --skip-existing

# Use short flag for skip-existing
proompt document-dir "src/utils/helpers" -s
```

**When to use `document-dir` vs `document-deep`:**

- **`document-dir`**: Fast, focused documentation for a single directory when
  you need context for specific modules or components
- **`document-deep`**: Comprehensive documentation of entire codebase sections,
  slower but more complete

**Skip-existing flag (`-s`):** Only processes directories missing any required
documentation files (CLAUDE.md, GEMINI.md). If all required documentation files
exist, the directory is skipped entirely.

## Who Benefits

**Solo Developers**: Avoid mid-implementation surprises when you realize you
misunderstood the requirements or missed a critical integration point.

**Engineering Teams**: Reduce stakeholder back-and-forth by validating
requirements thoroughly before implementation. Catch architectural issues in
planning, not in code review.

**Complex Codebases**: Ensure new features integrate cleanly with existing
systems. Prevent technical debt from AI tools that don't understand your
architecture.

**AI-Assisted Development**: Give tools like Claude Code, Gemini CLI, Cursor,
and Copilot the detailed context they need to generate maintainable code that
works on the first try.

## Why Planning Matters More with AI

AI coding tools excel at implementation, not requirement interpretation. They
need clear, detailed specifications to:

- Understand your existing architecture
- Make consistent design decisions
- Handle edge cases properly
- Integrate cleanly with your codebase

**Without proper planning**: AI generates technically correct code that doesn't
solve your actual problem.

**With Proompt**: AI becomes a reliable implementation partner that builds
exactly what you need.

## Installation & Setup

### Prerequisites

- Node.js 14.0.0 or higher
- Claude Code or Gemini CLI installed and configured

### Install

```bash
npm install -g proompt
```

### Initial Setup (One-Time)

```bash
# Configure your AI tool
proompt config -L claude

# Document your codebase for better context
proompt document-project "README.md"
proompt document-deep "src/libs apps/shared"
proompt document-dir "apps/scripts"  # Document specific directories
```

## Contributing

Contributions are welcome. Pull requests will be reviewed and merged when they
align with the project's goals. Whether you're fixing bugs, adding features, or
improving documentation, your help is appreciated.

#### Local Development Setup

```bash
git clone https://github.com/jason-dark/proompt.git
cd proompt
npm install && npm run build

# Install globally for testing
npm i -g .

# OR run directly during development
node dist/index.js

# Development workflow
npm run dev     # Watch mode for development
npm run build   # Build production build locally
```

#### Development Guidelines

- Follow existing code patterns and TypeScript conventions
- Test your changes with both `claude` and `gemini` CLI tools if possible
- Ensure command modules follow the `CommandModule` interface
- Add appropriate Zod schema validation for new command arguments
- Update documentation for new features or changed behavior

---

## Authors

- **Jason Dark** - [@jason-dark](https://github.com/jason-dark)

---

**_Plan thoroughly. Implement simply. Ship confidently._**
