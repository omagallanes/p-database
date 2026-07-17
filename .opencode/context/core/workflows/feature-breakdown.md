<!-- Context: workflows/task-breakdown | Priority: high | Version: 2.0 | Updated: 2025-01-21 -->

# Task Breakdown Guidelines

## Quick Reference

**When to Use**: 4+ files, >60 min effort, complex dependencies, multi-step coordination
**Process**: Scope → Phases → Small Tasks (1-2h) → Dependencies → Estimates
**Best Practices**: Keep tasks small (1-2h), clear dependencies, include verification, realistic estimates

---

## Purpose

Framework for breaking down complex tasks into manageable, sequential subtasks with clear dependencies and verification criteria.

## When to Use

Reference this when:
- Task involves 4+ files
- Estimated effort >60 minutes
- Complex dependencies exist
- Multi-step coordination needed
- User requests task breakdown

## Breakdown Process

### 1. Understand the Full Scope
What's the complete requirement? All components needed? End goal? Constraints?

### 2. Identify Major Phases
Logical groupings? What must happen first? What can be parallel? Dependencies?

### 3. Break Into Small Tasks
1-2 hours max each. Clear, actionable, independently completable, easy to verify.

### 4. Define Dependencies
Prerequisites? Parallel work opportunities? Blocking dependencies? Critical path?

### 5. Estimate Effort
Include testing time. Account for unknowns. Add buffer for complexity. Better to overestimate.

---

## Breakdown Template

```markdown
# Task Breakdown: {Task Name}

## Overview
{1-2 sentence description}

## Prerequisites
- [ ] {Prerequisite 1}
- [ ] {Prerequisite 2}

## Tasks

### Phase 1: {Phase Name}
**Goal:** {What this phase accomplishes}

- [ ] **Task 1.1:** {Description}
  - **Files:** {files to create/modify}
  - **Estimate:** {time} | **Dependencies:** {none / task X}
  - **Verification:** {how to verify it's done}

### Phase 2: {Phase Name}
**Goal:** {What this phase accomplishes}

- [ ] **Task 2.1:** {Description}
  - **Files:** {files to create/modify}
  - **Estimate:** {time} | **Dependencies:** {phase 1 complete}
  - **Verification:** {how to verify it's done}

## Testing Strategy
- [ ] Unit tests for {component}
- [ ] Integration tests for {flow}
- [ ] Manual testing: {scenarios}

## Total Estimate
**Time:** {X} hours | **Complexity:** {Low / Medium / High}

## Notes
{Important context, decisions, or considerations}
```

## Example: User Authentication System

```markdown
# Task Breakdown: User Authentication System

## Overview
Build authentication system with login, registration, and password reset.

## Tasks

### Phase 1: Core Authentication
**Goal:** Basic login/logout

- [ ] **1.1:** Create user model + DB schema
  - Files: `models/user.js`, `migrations/001_users.sql`
  - 1 hour | Dependencies: none | Verify: Can create user in DB

- [ ] **1.2:** Implement password hashing (bcrypt)
  - Files: `utils/password.js`
  - 30 min | Dependencies: 1.1 | Verify: Passwords hashed, not plain text

- [ ] **1.3:** Create login endpoint
  - Files: `routes/auth.js`, `controllers/auth.js`
  - 1.5 hours | Dependencies: 1.1, 1.2 | Verify: Can login with valid credentials

### Phase 2: Registration
**Goal:** New user registration

- [ ] **2.1:** Registration endpoint
  - 1 hour | Dependencies: Phase 1 | Verify: Can create account
- [ ] **2.2:** Email validation
  - 30 min | Dependencies: 2.1 | Verify: Invalid emails rejected

### Phase 3: Password Reset
**Goal:** Users can reset forgotten passwords

- [ ] **3.1:** Generate reset tokens (expire after 1 hour)
  - 1 hour | Dependencies: Phase 1 | Verify: Tokens generated and validated
- [ ] **3.2:** Create reset endpoints
  - 1.5 hours | Dependencies: 3.1 | Verify: Can complete password reset

## Testing Strategy
- Unit: password hashing, token generation
- Integration: login, registration, reset flows
- Manual: Complete user journey

## Total Estimate: 8.5 hours | Complexity: Medium

## Notes
- Use bcrypt for password hashing (industry standard)
- Reset tokens expire after 1 hour
- Rate limit password reset requests
- Email service must be configured before Phase 3
```

---

## Best Practices

### Keep Tasks Small
1-2 hours maximum. If larger, break down further. Each task completable in one sitting.

### Make Dependencies Clear
Explicitly state prerequisites. Identify parallel work opportunities. Note blocking deps.

### Include Verification
How to know it's done? What should work when complete? How can it be tested?

### Be Realistic with Estimates
Include testing time. Account for unknowns. Add buffer for complexity.

### Group Related Work
Organize by feature or component. Keep related tasks together. Logical phases.

---

## Common Patterns

| Pattern | Sequence |
|---------|----------|
| **Database-First** | Schema → Migrations → Models → Business Logic → API → Tests |
| **Feature-First** | Requirements → Interface → Core Logic → Error Handling → Tests → Docs |
| **Refactoring** | Tests for existing → Refactor section → Verify tests → Repeat → Clean up → Docs |

---

## Quick Reference

**Good breakdown**: Small focused tasks (1-2h), clear dependencies, realistic estimates, verification criteria, logical phases

**Breakdown checklist**:
- [ ] All requirements captured
- [ ] Tasks are small and focused
- [ ] Dependencies identified
- [ ] Estimates are realistic
- [ ] Testing included
- [ ] Verification criteria clear