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

**Automated codebase documentation + feature planning for AI coding tools.**

Generate CLAUDE.md and GEMINI.md files that give AI tools a deep understanding
of your codebase, then leverage this foundation with planning workflows for
bulletproof feature implementation.

## The Problem & Solution

AI coding tools waste usage or API credits regenerating context because your
codebase lacks structured documentation. They often generate generic solutions
that don't integrate with your existing architecture, security patterns, your
unique constraints, or coding style.

Proompt solves this by creating optimized CLAUDE.md and/or GEMINI.md files
documenting your codebase, then providing planning workflows that leverage this
documentation for implementation plans specifically tailored to you.

## Quick Start

```bash
# Install and configure
npm install -g proompt
proompt config --global --set-llm-cli claude  # or gemini

# Generate codebase documentation (one-time setup)
proompt document-project "README.md"               # Project-wide architecture
proompt document-dirs "src/auth src/database ..."  # Directory-specific context

# Use documentation-powered workflow
echo "Add user authentication ..." > "draft.md"
proompt generate-plan "draft.md" -o "plan-v1.md"
proompt validate-plan "plan-v1.md" -o "validated-plan-v1.md"
proompt execute-plan "validated-plan-v1.md"
```

## Core Commands

### Documentation Generation

```bash
# Create project-wide architecture documentation
proompt document-project "README.md"

# Document specific directories with focused context
proompt document-dirs "src/auth src/database src/api"
proompt document-dirs "libs/parser libs/decoder"     # Nx monorepos
proompt document-dirs "src/components/Layout"        # React projects
```

**`document-project` input**: The file you provide should contain information
about the business context or purpose of your codebase — it doesn't need to
document the code itself. Sources can include:

- Your existing README.md
- Content copied from your website or product documentation
- An existing CLAUDE.md file from the project
- A simple text file you write explaining the problem the codebase solves

Proompt uses this real world context to understand your project's purpose when
analyzing the codebase structure results in AI documentation that keeps your end
goal in mind.

### Planning Workflow

```bash
# Generate implementation plan (leverages your documentation)
proompt generate-plan "requirements.md" -o "plan-v1.md"

# Validate plan for completeness and edge cases
proompt validate-plan "plan-v3.md" -o "validated-plan-v1.md"

# Execute with your AI tool
proompt execute-plan "validated-plan-v5.md"

# Utilities
proompt lyra                        # Prompt optimization
proompt -C "/path/to/project" <cmd> # Run from different directory
```

**`generate-plan` input**: The requirements file should describe the desired end
state of your work. The better you describe what the final outcome should look
like, the better Proompt can create implementation plans. Sources can include:

- Exported Jira tickets or GitHub issues
- Text files describing the feature or change
- Copied documentation or specifications
- Voice notes transcribed to text

**Human-AI feedback loop**: Proompt is designed to assist, not replace human
verification. At each step (plan generation and validation), manually review the
output and make corrections. This iterative process of AI generation → human
review creates bulletproof plans ready for problem-free implementation.

### Configuration

```bash
# Global settings (affects all projects)
proompt config --global --set-llm-cli claude
proompt config --global --set-output-format claude,gemini

# Project settings (affects current project only)
proompt config --project --set-llm-cli gemini
proompt config --project --set-output-format claude

# View current settings
proompt config --global    # or --project
```

## Workflow: Plan → Validate → Implement

The key to successful AI-assisted development is thorough planning before
implementation.

**1. Plan Generation**: Create detailed implementation specifications that
leverage your documented architecture. Run `generate-plan` multiple times in
fresh contexts, manually reviewing and improving each iteration.

**2. Validation**: Stress-test plans with `validate-plan` to surface missing
dependencies, integration challenges, and edge cases. Continue until no new
problems emerge.

**3. Implementation**: Execute the battle-tested plan with confidence using your
AI tool.

**Investment mindset**: Simple features may need 2-3 planning iterations.
Complex enterprise features may need 10+ iterations. Planning time prevents
implementation chaos and can save hours of debugging.

## Configuration Details

Proompt uses JSON config files with clear hierarchy:

1. **Command-line arguments** (highest priority)
2. **Project settings** (`.proompt/settings.json`)
3. **Global settings** (`~/.proompt/settings.json`)
4. **Built-in defaults** (lowest priority)

**Available Options:**

- `llmCli`: `"claude"` or `"gemini"`
- `outputFormat`: `["claude"]`, `["gemini"]`, or `["claude", "gemini"]`

**Per-command overrides:**

```bash
proompt generate-plan "draft.md" -o "plan.md" -L gemini
proompt document-dirs "src/utils" -F claude,gemini
```

## Project Rules (RULES.md)

Optional `RULES.md` files enforce non-negotiable coding standards. Place in
project root (for `document-project`) or specific directories (for
`document-dirs`). Rules are prominently displayed in generated documentation
with compliance warnings.

```bash
echo "# Project Rules
- All functions must have TypeScript types
- Use functional programming patterns" > RULES.md

proompt document-project "README.md"  # Rules automatically included
```

## Documentation Tracking

Proompt tracks when documentation is generated, storing metadata in
`.proompt/doc-metadata.json`:

```json
{
  "project": {
    "commitHash": "abc123456789...",
    "timestamp": "2025-07-29T08:36:30.588Z"
  },
  "directories": {
    "src/components": {
      "commitHash": "def456789012...",
      "timestamp": "2025-07-29T09:15:42.123Z"
    }
  }
}
```

This enables upcoming Proompt features for updating outdated documentation based
on git diffs.

## Who Benefits

- **Solo developers** eliminate AI context regeneration waste.
- **Engineering teams** onboard developers and AI tools instantly.
- **Complex codebases** ensure AI understands microservices and enterprise
  patterns before generating code.
- **AI-assisted development** transforms tools into architecture-aware
  implementation partners.

## Contributing

#### Local Development Setup

```bash
git clone https://github.com/jason-dark/proompt.git
cd proompt
npm install && npm run build
npm i -g .  # Install globally for testing

# Development
npm run dev     # Watch mode
npm run build   # Production build
```

Feel free to open PRs for features or improvements.

---

**Author:** Jason Dark - [@jason-dark](https://github.com/jason-dark)

**_Better context. Consistent results._**
