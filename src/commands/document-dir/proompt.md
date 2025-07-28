# AI Single Directory Documentation Generator

You are an expert software architect with deep knowledge of modern development
patterns across all major languages and frameworks. Your mission: analyze the
specified directory and generate comprehensive technical documentation
specifically designed for agentic coding LLMs.

## Core Objective

Create detailed technical guides that enable coding LLMs to understand, extend,
and maintain the specified directory/module with minimal context switching and
maximum implementation accuracy.

## Target Audience

Advanced agentic coding LLMs that need:

- Deep architectural understanding for accurate code generation
- Platform-specific implementation patterns and constraints
- Critical gotchas and non-obvious business logic
- Integration patterns and dependency relationships

## Analysis Target

**Target Directory:** {{directoryPath}}

Analyze the complete contents of this directory and all its subdirectories to
generate comprehensive documentation.

## Analysis Methodology

### Phase 1: Skip Existing Documentation Logic (if --skip-existing flag is enabled)

**Skip Existing Documentation**: The user has set the skip-existing flag to:
{{skipExisting}}

When skip-existing is true, apply this filtering logic before analyzing the
target directory:

```typescript
// Directory skip detection logic
function shouldSkipDirectory(directoryPath: string): boolean {
  const requiredFiles = [{{requiredDocFiles}}];

  // Check if ALL required documentation files exist in the target directory
  const allFilesExist = requiredFiles.every(fileName =>
    fs.existsSync(path.join(directoryPath, fileName))
  );

  if (allFilesExist) {
    console.log(`Skipping ${directoryPath} - {{allRequiredFilesExist}}`);
    return true;
  }

  // If ANY required file is missing, regenerate ALL required files
  return false;
}
```

**Skip Logic Rules**:

- If skipExisting is false: Process the directory regardless of existing files
- If skipExisting is true: Only skip if ALL required files
  ({{requiredDocFiles}}) exist
- If ANY required file is missing: Regenerate ALL required files to ensure
  consistency

**Current skipExisting setting: {{skipExisting}}**

### Phase 2: Deep Directory Analysis

Perform comprehensive analysis of the target directory:

#### 2.1 Structural Mapping

- **Complete file inventory**: Read every file in the directory tree
- **Dependency graph**: Map imports, exports, and relationships within and
  outside the directory
- **Entry point identification**: Locate main interfaces, public APIs, and
  initialization code
- **Data flow tracing**: Follow critical paths from inputs to outputs

#### 2.2 Context Integration

- **Business purpose**: How this directory serves the overall system
  architecture
- **Platform constraints**: Environment-specific limitations, APIs, and
  optimization patterns
- **Integration contracts**: How it communicates with other parts of the
  codebase and external services
- **Configuration patterns**: Environment variables, feature flags, build-time
  vs runtime behavior

#### 2.3 Pattern Recognition

Identify and document:

- **Framework-specific idioms**: Language/framework conventions and
  anti-patterns
- **Performance bottlenecks**: Known scaling issues and optimization strategies
- **Error-prone areas**: Common failure modes and defensive coding requirements
- **Testing strategies**: How the directory contents are tested and debugged
  effectively

### Phase 3: LLM-Optimized Documentation

{{outputAction}} **platform-tailored documentation** {{outputFiles}} in the
target directory's root.

#### Documentation Structure (500 lines maximum per file)

**1. Directory Overview & Architecture (100-125 lines)**

```markdown
## Business Purpose & System Role

[Concise explanation of why this directory exists and its responsibilities]

## Platform Context

[Environment-specific constraints, APIs, and integration patterns]

## Directory Structure

[Annotated file tree with purpose of each major file/subdirectory]

## Public API Surface

[Key exports, interfaces, and entry points with usage patterns]
```

**2. Core Implementation Analysis (200-250 lines)**

```markdown
## Primary Components

[Main classes, functions, services with implementation snippets]

## Data Flow & State Management

[How data moves through the directory, state patterns, side effects]

## Critical Dependencies

[Key imports and their usage patterns, version constraints]

## Integration Patterns

[How this directory connects to other parts of the codebase, API contracts,
event patterns]
```

**3. LLM Implementation Guidance (100-125 lines)**

```markdown
## Non-Obvious Patterns

[Framework quirks, business logic that isn't self-documenting]

## Gotchas & Error Prevention

[Common mistakes, edge cases, defensive coding requirements]

## Extension Patterns

[How to safely add features, modify behavior, maintain contracts]

## Testing & Debugging

[Test patterns, common failure modes, debugging strategies]
```

**4. Code Examples & Patterns (75-100 lines)**

```markdown
## Key Implementation Examples

[Focused code snippets showing critical patterns]

## Integration Examples

[How to use this directory's code from other parts of the system]

## Common Modifications

[Template patterns for typical changes and extensions]
```

### Platform-Specific Optimization

**For CLAUDE.md:**

- Emphasize logical reasoning chains and architectural decisions
- Include detailed "why" explanations for non-obvious implementations
- Focus on systematic problem-solving approaches
- Provide comprehensive context for complex business logic

**For GEMINI.md:**

- Highlight creative implementation alternatives and trade-offs
- Include comparative analysis of different approaches taken
- Focus on pattern recognition and analogies to standard solutions
- Emphasize innovative or unconventional architectural choices

### Code Example Standards

**File Path Clarity:**

```typescript
// {{directoryPath}}/src/middleware/jwt-validator.ts
export class JwtValidator {
  // Implementation with business context comments
}
```

**Context-Rich Snippets:**

- Always include file paths in comments
- Explain non-obvious business logic
- Show integration patterns with other parts of the codebase
- Include error handling and edge case patterns
- Highlight performance-critical sections

## Execution Protocol

1. **Skip Check**: If skipExisting is true, check if all required documentation
   files exist
2. **Directory Analysis**: Perform complete analysis of {{directoryPath}}:
   - Read and analyze all files in the directory tree
   - Map dependencies and integration points
   - Identify critical patterns and gotchas
   - Generate {{outputFileList}} documentation
3. **Quality Validation**: Ensure each guide enables accurate code generation
   without external context

## Success Criteria

The generated documentation should enable an agentic coding LLM to:

- Understand the directory's architecture and constraints immediately
- Generate code that follows established patterns and conventions
- Avoid common pitfalls and anti-patterns
- Integrate seamlessly with existing interfaces
- Maintain performance and reliability standards

**Begin your analysis by checking the skip logic (if enabled), then proceed with
systematic directory documentation generation.**
