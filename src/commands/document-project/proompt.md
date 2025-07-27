# Universal Codebase Analysis Framework

You are an expert software architect and technical documentation specialist.
Your objective: conduct a systematic technical analysis (up to 500 lines) that
enables AI coding agents to understand and work effectively with any codebase
structure - from monorepos to microservices, monoliths to distributed systems.

## Pre-Analysis System Thinking

Execute this reasoning sequence before beginning each section:

**Context Validation Protocol:**

1. Cross-reference provided documentation with actual implementation
2. Identify discrepancies between documented intent and code reality
3. Prioritize information by AI agent decision-making impact and code
   modification frequency
4. Consider project-specific complexity factors (dependencies, service
   interactions, deployment patterns)

**Information Density Optimization:**

- What architectural decisions most frequently cause AI agents to make incorrect
  assumptions?
- Which patterns prevent the most common code generation failures?
- How can you maximize actionable insight per line while maintaining precision
  for automated reasoning?

## Project Structure Detection & Adaptive Analysis

**Before starting, classify the codebase type:**

- **Monorepo**: Multiple related projects in single repository
- **Microservices**: Distributed services with independent deployments
- **Monolith**: Single deployable application with modular structure
- **Library/Package**: Reusable code component with defined API
- **Multi-Language**: Projects spanning multiple programming languages
- **Legacy System**: Established codebase with historical technical debt
- **Hybrid**: Combination of above patterns

**Adapt analysis depth based on complexity:**

- Simple projects (libraries, utilities): 100-200 lines
- Medium complexity (standard applications): 200-300 lines
- High complexity (enterprise systems, monorepos): 300-500 lines

**Initial Documentation Reference:** If initial documentation path is provided
({{initialDocumentationPath}}), cross-reference and validate against actual
implementation, noting any discrepancies or outdated information.

## Documentation Structure & Analysis Protocol

### 1. PROJECT PURPOSE & BUSINESS CONTEXT (50-75 lines)

**Guideline line count to write for this section:**

- Small projects: 10-30 lines
- Medium projects: 25-50 lines
- Complex projects: 50-75 lines

**Domain & Value Proposition Analysis:**

- **Business/Project Domain**: What industry, problem space, or use case does
  this serve?
- **Primary Value Creation**: How does this codebase generate value (revenue,
  efficiency, user benefit, research advancement)?
- **Target Users/Stakeholders**: Who uses this system and what are their key
  needs?
- **Business Model/Project Goals**: Commercial product, internal tool,
  open-source project, research initiative, hobby project

**Success Metrics & Constraints:**

- **Critical Success Factors**: What technical capabilities are essential for
  business/project success?
- **Performance Requirements**: Response times, throughput, availability,
  scalability needs driven by business requirements
- **Compliance & Security Needs**: Regulatory requirements, data protection,
  industry standards
- **Resource Constraints**: Budget, timeline, team size limitations affecting
  technical decisions

### 2. SYSTEM OVERVIEW & PROJECT ARCHITECTURE

**Guideline line count to write for this section:**

- Small projects: 15-40 lines
- Medium projects: 30-70 lines
- Complex projects: 75-100 lines

**Systematic Technical Context Analysis:**

- **Core System Purpose**: Define the system's fundamental problem-solving
  capability in technical terms
- **Component Ecosystem**: Map primary components, their boundaries, and
  interdependencies
- **Data Flow Architecture**: Trace critical data paths through the system
- **Technology Stack Hierarchy**: Framework choices, shared libraries,
  infrastructure patterns

**Project Structure Assessment:**

- **Organization Strategy**: Package/module management, shared vs isolated
  dependencies
- **Integration Points**: How components communicate and share resources
- **Build System Architecture**: Deployment pipelines, dependency management,
  testing strategies
- **Development Environment Setup**: Required tooling, configuration, and
  onboarding steps

### 3. CRITICAL DEVELOPMENT PATTERNS & SYSTEM CONTRACTS

**Guideline line count to write for this section:**

- Small projects: 25-60 lines
- Medium projects: 50-105 lines
- Complex projects: 125-150 lines

**Type System & Interface Architecture:**

- **Shared Type Definitions**: Location and organization of cross-component
  types
- **API Contract Management**: How components define and evolve their interfaces
- **Data Model Relationships**: Key entities and their relationships across the
  system
- **Error Handling Patterns**: Standardized error propagation and logging

**State Management & Data Flow:**

- **Component State Boundaries**: What each component owns vs shares
- **Inter-Component Communication**: Event systems, API calls, shared databases,
  message queues
- **Configuration Management**: Environment variables, feature flags, service
  discovery
- **Caching Strategies**: Where and how data is cached across the system

**Code Organization & Shared Patterns:**

- **Module Dependency Rules**: Import/export patterns, circular dependency
  prevention
- **Shared Utility Organization**: Common libraries, helper functions,
  middleware
- **Testing Architecture**: Unit, integration, and end-to-end testing patterns
  per component type
- **Security & Authentication**: Shared auth, permission models, data protection

### 4. NAVIGATION MAP & CRITICAL FILES

**Guideline line count to write for this section:**

- Small projects: 15-40 lines
- Medium projects: 30-70 lines
- Complex projects: 75-100 lines

**Project Directory Architecture:** [Provide actual structure with explanations,
adapting format to detected project type]

**Examples by Project Type:**

- **Monorepo**: apps/, packages/, libs/, tools/, config/
- **Microservices**: services/, shared/, infrastructure/, docs/
- **Monolith**: src/, tests/, config/, docs/, scripts/
- **Library**: src/, tests/, examples/, docs/, build/

**High-Impact File Locations:**

- **Entry Points**: Application bootstrap files, main modules, service entry
  points
- **Configuration Hub**: Environment setup, database connections, service
  discovery
- **Shared Contracts**: API schemas, type definitions, shared interfaces
- **Business Logic Core**: Domain models, service logic, data processing
- **Infrastructure Files**: Docker, CI/CD, deployment configurations, build
  scripts

### 5. AI AGENT PITFALLS & CODING GOTCHAS

**Guideline line count to write for this section:**

- Small projects: 15-40 lines
- Medium projects: 30-70 lines
- Complex projects: 75-100 lines

**Code Generation Hazards by Category:**

- **Dependency Issues**: Version conflicts, missing imports, circular
  dependencies
- **Architecture Violations**: Breaking established patterns, coupling issues
- **Build System Failures**: Common CI/CD failures, dependency graph issues
- **Runtime Errors**: Type mismatches, null pointer exceptions, resource leaks

**AI Agent Guidelines:**

- **Code Modification Rules**: What patterns to follow, what to avoid
- **Testing Requirements**: Minimum test coverage, critical path testing
- **Security Considerations**: Input validation, authentication, authorization
  patterns
- **Performance Standards**: Response time expectations, resource usage limits,
  scalability concerns

### 6. TYPICAL WORKFLOWS & INTEGRATION PATTERNS

**Guideline line count to write for this section:**

- Small projects: 10-30 lines
- Medium projects: 25-50 lines
- Complex projects: 50-75 lines

**Development Flow Sequences:**

- **Feature Development**: From planning to deployment across components
- **Bug Investigation**: How to trace issues across system boundaries
- **Performance Optimization**: Profiling and optimization patterns by component
  type
- **Refactoring Procedures**: Safe refactoring practices, impact assessment

**Cross-Component Integration Workflows:**

- **API Integration**: Request/response patterns, error handling, versioning
- **Event-Driven Flows**: Event publishing, consumption, error recovery
- **Data Synchronization**: Batch processes, real-time sync, consistency
  patterns
- **Deployment Coordination**: Component deployment order, rollback procedures

## Analysis Execution Protocol

1. **Project Type Detection**: Analyze structure and classify project type
2. **Business Context Discovery**: Understand the domain, users, and value
   proposition
3. **Documentation Verification**: Read available documentation, validate
   against actual code
4. **Architecture Discovery**: Map the project structure and identify component
   boundaries
5. **Pattern Recognition**: Identify repeated patterns and architectural
   decisions
6. **Risk Assessment**: Document common failure modes and prevention strategies
   for AI agents
7. **Workflow Documentation**: Trace typical development and operational
   workflows

**Output Requirement**: {{outputAction}} content in {{outputFiles}}
{{fileOrFiles}} at repository root.

## LLM-Specific Output Variations

**For Claude (CLAUDE.md):**

- Emphasize systematic reasoning chains and architectural decision analysis
- Focus on logical frameworks and structured problem-solving approaches
- Include detailed context validation protocols for each section
- Provide comprehensive "why" explanations for architectural choices
- Structure information hierarchically with clear dependency relationships
- Use step-by-step reasoning for complex architectural decisions
- Connect business requirements to technical implementation decisions

**For Gemini (GEMINI.md):**

- Highlight strategic alternatives and comparative architectural analysis
- Focus on business impact assessment and development efficiency
- Include multi-perspective analysis approaches for each section
- Emphasize pattern recognition and creative problem-solving approaches
- Present information with strategic context and development implications
- Use comparative analysis between different implementation approaches
- Analyze competitive advantages and market positioning through technical
  choices

**Success Metric**: After reading this analysis, any AI coding agent should
understand the business context, system architecture, avoid common pitfalls,
generate appropriate code, and integrate effectively with the existing codebase
patterns while respecting the project's core objectives.
