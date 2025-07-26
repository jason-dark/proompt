# Proompt
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
**Turn vague requirements into bulletproof implementation plans that AI coding tools can execute flawlessly.**

Stop wasting cycles on endless revisions. When your implementation plan is thorough, coding becomes straightforward and you build exactly what's needed — not what the AI thinks you want.

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

Proompt transforms that vague requirement into a precise specification with actual code:

```markdown
## Implementation Plan: User Authentication

### Context
- Existing user data in PostgreSQL via Prisma ORM
- Current session management using JWT tokens
- React frontend with existing UserContext provider
...

### Implementation Steps

1. **Extend User model with password_hash field**
   File: prisma/schema.prisma
   
   model User {
     id          String   @id @default(cuid())
     email       String   @unique
     name        String?
     password_hash String?  // Add this field
     createdAt   DateTime @default(now())
     ...
   }

2. **Create AuthService with bcrypt password hashing**
   File: src/services/AuthService.ts (new file)
   
   import bcrypt from 'bcryptjs';
   import jwt from 'jsonwebtoken';
   
   export class AuthService {
     static async hashPassword(password: string): Promise<string> {
       return bcrypt.hash(password, 12);
     }
     
     static async validatePassword(password: string, hash: string): Promise<boolean> {
       return bcrypt.compare(password, hash);
     }
     ...
   }

3. **Add login/register endpoints**
   File: src/pages/api/auth/register.ts
   
   export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     if (req.method !== 'POST') return res.status(405).end();
     
     const { email, password } = req.body;
     const hashedPassword = await AuthService.hashPassword(password);
     ...
   }

...

### Files to Modify
- prisma/schema.prisma (User model extension)
- src/services/AuthService.ts (new file)
- src/pages/api/auth/register.ts (new file)
- src/pages/api/auth/login.ts (new file)
- src/contexts/UserContext.tsx (auth state management)
- src/components/Dashboard.tsx (route protection)
...

### Acceptance Criteria
- Users can register with email/password
- Login persists across browser sessions
- Existing user data remains intact
- Dashboard redirects to login when unauthenticated
...
```

Now when Proompt instructs your AI coding tool to implement this plan, it builds exactly what you need and doesn't tie itself in knots with hallucinations.

## Quick Start

```bash
# Install globally
npm install -g proompt

# Set your AI coding tool
proompt --set-llm-cli claude  # or gemini

# One-time codebase overview documentation (5 minutes)
proompt document-overview --initial-documentation-path "README.md"
# One-time codebase deep documentation (time depends on codebase size)
proompt document-codebase --start-path "libs"

# Start your next feature
echo "Add user authentication to the app ..." > draft.md
proompt generate-plan --draft-plan-path "draft.md"
```

## Core Workflow

### 1. **Plan** - Iterate until the specification is bulletproof
```bash
# Start with any requirements - tickets, notes, ideas  
proompt generate-plan --draft-plan-path "feature-request.md"
```

**Critical**: Run this multiple times, each in a fresh LLM context window. After each run:
- Manually review the output for gaps or issues
- Make corrections to address any problems you spot
- Save the improved version and run `generate-plan` with that version again
- Repeat this process until the plan feels solid

Proompt creates implementation plans with:
- Actual code snippets for each modification
- File-level implementation details
- Integration points with existing architecture
- Comprehensive edge case handling

**Expect 2-5 iterations** depending on feature complexity. Simple features might be ready after 2-3 runs. Complex enterprise features often need 5+ iterations. Each cycle builds on the previous output, creating increasingly detailed and robust plans.

### 2. **Validate** - Stress-test the plan relentlessly  
```bash
proompt validate-plan --plan-path "draft-plan-v3.md"
```

**Critical**: Like planning, validation requires multiple iterations in fresh contexts. Each validation cycle:
- Intentionally tries to break your plan
- Surfaces missing dependencies and integration challenges
- Identifies potential breaking changes and edge cases
- Questions assumptions about existing code behavior
- Provides feedback on the plan

After each validation:
- Review the feedback
- Address the feedback either with the assistance of your llm or manually
- Run validation again with the improved plan
- Continue until no new problems surface

**This is where the magic happens**: Rigorous validation catches issues that would otherwise become expensive bugs or architectural problems.

### 3. **Implement** - Execute with confidence
```bash
proompt implement-plan --plan-path "battle-tested-plan.md"
```

With thorough planning and validation, your AI coding tool has everything needed for successful first-try implementation.

### The Investment Mindset
**Planning time prevents implementation chaos.** A feature that takes 30 minutes to plan and validate properly might save 3+ hours of debugging, refactoring, and stakeholder confusion.

- **Simple features**: 2-3 planning iterations, 2-3 validation cycles
- **Complex features**: 5+ planning iterations, 5+ validation cycles  
- **Enterprise/cross-system features**: 8+ planning iterations, 8+ validation cycles

The complexity of your codebase and the scope of the change determine iteration count, not arbitrary limits.

## Commands Reference

### Setup & Configuration
```bash
# Choose your AI tool
proompt --set-llm-cli claude        # Claude Code
proompt --set-llm-cli gemini        # Gemini CLI

# Configure output format
proompt --set-output-format claude,gemini  # Both formats
proompt --set-output-format claude         # Just CLAUDE.md files

# One-time codebase documentation
proompt document-overview --initial-documentation-path "README.md"
proompt document-codebase --start-path "src"  # React projects
proompt document-codebase --start-path "libs" # Nx monorepos
proompt document-codebase --start-path "modules" # Custom project structure
```

### Development Workflow
```bash
# Core planning cycle
proompt generate-plan --draft-plan-path "requirements.md"
proompt validate-plan --plan-path "plan-v1.md"
proompt implement-plan --plan-path "final-plan.md"

# Utilities
proompt lyra                        # Prompt optimization
proompt --help                      # All commands
proompt -C /path/to/project <cmd>   # Run from different directory
```

## Real-World Examples

### Enterprise Monorepo
```bash
# Document the entire libs structure
proompt document-codebase --start-path "libs"

# Plan a feature that spans multiple packages
proompt generate-plan --draft-plan-path "cross-service-feature.md"
```

### React Project
```bash
# Document component architecture
proompt document-codebase --start-path "src"

# Plan component refactoring with state management changes
proompt generate-plan --draft-plan-path "refactor-user-components.md"
```

### API Integration
```bash
# Plan new API endpoints with database changes
echo "Add webhook system for payment notifications" > webhook-plan.md
proompt generate-plan --draft-plan-path "webhook-plan.md"
```

## Who Benefits

**Solo Developers**: Avoid mid-implementation surprises when you realize you misunderstood the requirements or missed a critical integration point.

**Engineering Teams**: Reduce stakeholder back-and-forth by validating requirements thoroughly before implementation. Catch architectural issues in planning, not in code review.

**Complex Codebases**: Ensure new features integrate cleanly with existing systems. Prevent technical debt from AI tools that don't understand your architecture.

**AI-Assisted Development**: Give tools like Claude Code, Gemini CLI, Cursor, and Copilot the detailed context they need to generate maintainable code that works on the first try.

## Why Planning Matters More with AI

AI coding tools excel at implementation, not requirement interpretation. They need clear, detailed specifications to:

- Understand your existing architecture
- Make consistent design decisions
- Handle edge cases properly
- Integrate cleanly with your codebase

**Without proper planning**: AI generates technically correct code that doesn't solve your actual problem.

**With Proompt**: AI becomes a reliable implementation partner that builds exactly what you need.

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
proompt --set-llm-cli claude

# Document your codebase for better context
proompt document-overview --initial-documentation-path "README.md"
proompt document-codebase --start-path "src"
```

### Local Development
```bash
git clone <repository-url>
cd proompt
npm install && npm run build

# Install globally or run directly
npm i -g . 
# OR
node dist/index.js
```

---

**Ready to ship features that work the first time?**

```bash
npm install -g proompt
```

***Plan thoroughly. Implement simply. Ship confidently.***