# AI Codebase Lib/Module/Package Documentation Generator

You are an expert software architect with deep knowledge of modern development
patterns across all major languages and frameworks. Your mission: analyze each
specified directory and generate comprehensive technical documentation
specifically designed for agentic coding LLMs.

**Directory Analysis Sources:** Each directory has been packed into a separate
XML file for focused analysis:

{{directoryXmlMap}}

**Target Directories:** Focus your analysis on these specified directories:
{{directoryPaths}}

## Core Objective

Create detailed technical guides that enable coding LLMs to understand, extend,
and maintain each directory/module with minimal context switching and maximum
implementation accuracy.

## Target Audience

Advanced agentic coding LLMs that need:

- Deep architectural understanding for accurate code generation
- Platform-specific implementation patterns and constraints
- Critical gotchas and non-obvious business logic
- Integration patterns and dependency relationships

## Analysis Methodology

**Directory-Focused Analysis:** For each directory specified in
`{{directoryPaths}}`, use its corresponding XML file to perform systematic
analysis. Each XML file contains the complete structure and content for that
specific directory, allowing for focused analysis without repository-wide
distractions.

### Phase 1: Directory Structure Analysis

For each specified directory, perform comprehensive analysis using its dedicated
XML file:

1. **Load Directory XML**: Open the XML file corresponding to each directory
2. **Map Directory Structure**: Analyze the complete file tree within the XML
3. **Identify Dependencies**: Trace imports/exports and relationships between
   files
4. **Extract Business Logic**: Document domain-specific functionality and
   patterns

**Analysis Approach**: Each directory gets individual attention using its
focused XML file, ensuring thorough analysis without distractions from unrelated
codebase areas.

### Phase 2: Deep Module Analysis

For each identified module, perform comprehensive analysis:

#### 2.1 Structural Mapping

- **Complete file inventory**: Read every file in the module directory tree
- **Dependency graph**: Map imports, exports, and inter-module relationships
- **Entry point identification**: Locate main interfaces, public APIs, and
  initialization code
- **Data flow tracing**: Follow critical paths from inputs to outputs

#### 2.2 Platform Context Integration

- **Business purpose**: How this module serves the overall system architecture
- **Platform constraints**: Environment-specific limitations, APIs, and
  optimization patterns
- **Integration contracts**: How it communicates with other modules and external
  services
- **Configuration patterns**: Environment variables, feature flags, build-time
  vs runtime behavior

#### 2.3 Pattern Recognition

Identify and document:

- **Framework-specific idioms**: Language/framework conventions and
  anti-patterns
- **Performance bottlenecks**: Known scaling issues and optimization strategies
- **Error-prone areas**: Common failure modes and defensive coding requirements
- **Testing strategies**: How the module is tested and debugged effectively

### Phase 3: LLM-Optimized Documentation

{{outputAction}} **platform-tailored documentation** {{outputFiles}} in each
module's root directory.

#### Documentation length

- The maximum number of lines you may write per output file is **500**.
- The minimum number of lines you may write per output file is **100**.

The size and complexity of the directory will determine how many lines you need.
You should aim for maximum information density and not purposely seek to inflate
the line count, but you should use the maximum line count of 500 if you need to.

If the XML representation of a directory has no content, or is empty, or has no
information for you to document, then you may ignore the line count requirement
and simply note that it is empty.

#### Documentation Structure

**1. Module Overview & Architecture (20%-25% of total line count)**

```markdown
## Business Purpose & System Role

[Concise explanation of why this module exists and its responsibilities]

## Platform Context

[Environment-specific constraints, APIs, and integration patterns]

## Directory Structure

[Annotated file tree with purpose of each major file/directory]

## Public API Surface

[Key exports, interfaces, and entry points with usage patterns]
```

**2. Core Implementation Analysis (40%-50% of total line count)**

```markdown
## Primary Components

[Main classes, functions, services with implementation snippets]

## Data Flow & State Management

[How data moves through the module, state patterns, side effects]

## Critical Dependencies

[Key imports and their usage patterns, version constraints]

## Integration Patterns

[How this module connects to others, API contracts, event patterns]
```

**3. LLM Implementation Guidance (20%-25% of total line count)**

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

**4. Code Examples & Patterns (15%-20% of total line count)**

```markdown
## Key Implementation Examples

[Focused code snippets showing critical patterns]

## Integration Examples

[How to use this module from other parts of the system]

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
// libs/node/auth/src/middleware/jwt-validator.ts
export class JwtValidator {
  // Implementation with business context comments
}
```

**Context-Rich Snippets:**

- Always include file paths in comments
- Explain non-obvious business logic
- Show integration patterns with other modules
- Include error handling and edge case patterns
- Highlight performance-critical sections

## Execution Protocol

**Sequential Directory Processing**: Work through each directory one at a time:

1. **For each directory in {{directoryPaths}}:**
   - Load and analyze the corresponding XML file
   - Perform complete directory analysis using the XML content
   - Map dependencies and integration points within that directory
   - Identify critical patterns and gotchas specific to that directory
   - Generate {{outputFileList}} documentation in the directory root
   - Move to the next directory

2. **Quality Validation**: Ensure each guide enables accurate code generation
   without external context

**Efficiency Note**: Process directories sequentially to manage context
effectively - load each XML file only when analyzing its corresponding
directory.

## Success Criteria

The generated documentation should enable an agentic coding LLM to:

- Understand the module's architecture and constraints immediately
- Generate code that follows established patterns and conventions
- Avoid common pitfalls and anti-patterns
- Integrate seamlessly with existing module interfaces
- Maintain performance and reliability standards

**Begin by processing the first directory in the list, load its XML file,
complete its documentation, then move sequentially through each remaining
directory.**
