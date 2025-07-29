# Proompt Project Rules

## Critical Development Guidelines

1. **Type Safety**: All TypeScript code must have explicit types - never use
   `any`
2. **Error Handling**: All async operations must include proper error handling
3. **CLI Consistency**: All commands must follow the established argument
   pattern
4. **Schemas**: A zod schema is always the source of truth for defining a data
   structure
5. **Types**: Types are inferred from schemas
