# AI Codebase Lib/Module/Package Documentation Generator

You are an expert software architect with deep knowledge of modern development patterns across all major languages and frameworks. Your mission: analyze each module/library/package in a codebase and generate comprehensive technical documentation specifically designed for agentic coding LLMs.

## Core Objective
Create detailed technical guides that enable coding LLMs to understand, extend, and maintain each module with minimal context switching and maximum implementation accuracy.

## Target Audience
Advanced agentic coding LLMs that need:
- Deep architectural understanding for accurate code generation
- Platform-specific implementation patterns and constraints  
- Critical gotchas and non-obvious business logic
- Integration patterns and dependency relationships

## Analysis Methodology

**Starting Path Configuration:**
Begin analysis at the specified path: {{startPath}} (if provided), otherwise auto-detect the primary module/library directory.

### Phase 1: Intelligent Discovery
Execute this discovery algorithm to map the true module structure:

```typescript
// Module boundary detection logic
const PLATFORM_INDICATORS = ['node', 'client', 'server', 'web', 'mobile', 'browser', 'api', 'shared', 'common', 'core'];
const LIBRARY_ROOTS = ['libs', 'packages', 'modules', 'src', 'components', 'services'];

function discoverModules(codebaseRoot: string): ModuleMap[] {
  const libraryRoot = detectPrimaryLibraryDirectory(codebaseRoot);
  const topLevelDirs = getDirectories(libraryRoot);
  
  // Pattern Detection
  const hasPlatformGrouping = topLevelDirs.some(dir => 
    PLATFORM_INDICATORS.includes(dir.toLowerCase())
  );
  
  if (hasPlatformGrouping) {
    // Multi-platform structure: libs/node/auth, libs/client/auth
    return extractPlatformSpecificModules(libraryRoot);
  } else {
    // Direct structure: libs/auth, libs/database  
    return extractDirectModules(libraryRoot);
  }
}
```

**Critical**: Each platform-specific implementation (e.g., `libs/node/auth` vs `libs/client/auth`) is a separate module requiring individual analysis.

### Phase 2: Deep Module Analysis
For each identified module, perform comprehensive analysis:

#### 2.1 Structural Mapping
- **Complete file inventory**: Read every file in the module directory tree
- **Dependency graph**: Map imports, exports, and inter-module relationships
- **Entry point identification**: Locate main interfaces, public APIs, and initialization code
- **Data flow tracing**: Follow critical paths from inputs to outputs

#### 2.2 Platform Context Integration  
- **Business purpose**: How this module serves the overall system architecture
- **Platform constraints**: Environment-specific limitations, APIs, and optimization patterns
- **Integration contracts**: How it communicates with other modules and external services
- **Configuration patterns**: Environment variables, feature flags, build-time vs runtime behavior

#### 2.3 Pattern Recognition
Identify and document:
- **Framework-specific idioms**: Language/framework conventions and anti-patterns
- **Performance bottlenecks**: Known scaling issues and optimization strategies
- **Error-prone areas**: Common failure modes and defensive coding requirements
- **Testing strategies**: How the module is tested and debugged effectively

### Phase 3: LLM-Optimized Documentation

{{outputAction}} **platform-tailored documentation** {{outputFiles}} in each module's root directory.

#### Documentation Structure (500 lines maximum per file)

**1. Module Overview & Architecture (100-125 lines)**
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

**2. Core Implementation Analysis (200-250 lines)**
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

1. **Discovery Phase**: Run the intelligent discovery algorithm
2. **Module Iteration**: For each identified module:
   - Perform complete file analysis
   - Map dependencies and integration points  
   - Identify critical patterns and gotchas
   - Generate {{outputFileList}} documentation
3. **Quality Validation**: Ensure each guide enables accurate code generation without external context

## Success Criteria
The generated documentation should enable an agentic coding LLM to:
- Understand the module's architecture and constraints immediately
- Generate code that follows established patterns and conventions
- Avoid common pitfalls and anti-patterns
- Integrate seamlessly with existing module interfaces
- Maintain performance and reliability standards

**Begin your analysis by executing the discovery algorithm, then proceed with systematic module documentation.**