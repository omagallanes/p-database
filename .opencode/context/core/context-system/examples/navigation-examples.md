<!-- Context: core/navigation-examples | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Navigation File Examples

**Purpose**: Real-world examples of good navigation files

**Last Updated**: 2026-01-08

---

## Example 1: Function-Based (Repository-Specific)

**File**: `openagents-repo/navigation.md` | **Tokens**: ~250

Repository-specific context organized by information type (concepts, guides, lookup, errors).

```markdown
# OpenAgents Repository Navigation
**Purpose**: Navigate OpenAgents Control repository context

## Structure
```
openagents-repo/
├── navigation.md, quick-start.md
├── core-concepts/ (agent-architecture.md, eval-framework.md, registry-system.md)
├── guides/ (adding-agent.md, testing-agent.md, debugging-issues.md)
├── lookup/ (commands.md, file-locations.md)
└── errors/ (tool-permission-errors.md)
```
## Quick Routes
| Task | Path |
|------|------|
| **New here** | `quick-start.md` |
| **Add agent** | `guides/adding-agent-basics.md` |
| **Debug issue** | `guides/debugging-issues.md` |
| **Fix error** | `errors/tool-permission-errors.md` |
## By Type: **Concepts** → Foundational | **Guides** → Step-by-step | **Lookup** → Reference | **Errors** → Fixes
```

**Why**: ✅ Token-efficient (~250t) | ✅ ASCII tree | ✅ Quick routes for tasks | ✅ By-type organization

---

## Example 2: Concern-Based (Multi-Technology)

**File**: `development/navigation.md` | **Tokens**: ~280

Broad category spanning multiple technologies, organized by development concern.

```markdown
# Development Navigation
**Purpose**: Software development across all stacks

## Structure
```
development/
├── navigation.md, ui-navigation.md, backend-navigation.md
├── principles/ (clean-code.md, api-design.md)
├── frontend/ (react/, vue/)
├── backend/ (api-patterns/, nodejs/, authentication/)
└── data/ (sql-patterns/, orm-patterns/)
```
## Quick Routes: **UI** → ui-navigation.md | **Backend** → backend-navigation.md
## By Concern: **Principles** → Universal | **Frontend** → React, Vue | **Backend** → APIs, auth | **Data** → SQL, ORMs
```

**Why**: ✅ Specialized nav files | ✅ Organized by concern | ✅ Points to sub-navigation

---

## Example 3: Subcategory Navigation

**File**: `development/backend/navigation.md` | **Tokens**: ~240

Drilling into a specific concern with both approach and language organization.

```markdown
# Backend Development Navigation
**Scope**: Server-side, APIs, databases, auth

## Structure
```
backend/ ├── navigation.md
├── api-patterns/ (rest-design.md, graphql-design.md, grpc-patterns.md)
├── nodejs/ (express-patterns.md, fastify-patterns.md)
├── python/ (fastapi-patterns.md)
└── authentication/ (jwt-patterns.md, oauth-patterns.md)
```
## Quick Routes: **REST** → api-patterns/rest-design.md | **Auth** → authentication/jwt-patterns.md
## By Approach → REST, GraphQL | ## By Language → Node.js, Python
```

**Why**: ✅ Approach-first then tech | ✅ Auth as separate functional concern | ✅ ~240t

---

## Example 4: Full-Stack Navigation

**File**: `development/fullstack-navigation.md` | **Tokens**: ~300

End-to-end workflows spanning multiple layers, organized by tech stack.

```markdown
# Full-Stack Development Navigation
**Scope**: End-to-end application development

## Common Stacks
### MERN: Frontend→react/ | Backend→express-patterns.md | Data→mongodb.md
### T3: Frontend→react/+styling | Backend→nodejs/+trpc-patterns.md | Data→prisma.md
## Quick Routes: **Frontend** → ui-navigation.md | **Backend** → backend-navigation.md | **Data** → data/navigation.md
## Common Workflows: **New API**: 1. api-design.md 2. rest-design.md 3. express-patterns.md
```

**Why**: ✅ Stack-focused | ✅ Workflow-oriented (how to build features) | ✅ Points to layer nav

---

## Example 5: Minimal Navigation

**File**: `content/navigation.md` | **Tokens**: ~150

Simple categories with few files — keep it minimal.

```markdown
# Content Navigation
**Purpose**: Copywriting and content creation
## Structure: content/ ├── nav.md ├── copywriting-frameworks.md └── tone-voice.md
## Quick Routes: **Write copy** → copywriting-frameworks.md | **Set tone** → tone-voice.md
## Files: **copywriting-frameworks.md** → AIDA, PAS | **tone-voice.md** → Brand voice
```

**Why**: ✅ Simple (only 2 files) | ✅ No unnecessary complexity | ✅ Clear and scannable

---

## Pattern Comparison

| Pattern | Best For | Token Range | Key Feature |
|---------|----------|-------------|-------------|
| Function-Based | Single repo/project | 200-300t | Organized by info type |
| Concern-Based | Multi-technology | 250-300t | Organized by concern/tech |
| Subcategory | Deep drill-down | 200-250t | Approach + language org |
| Full-Stack | End-to-end workflows | 250-300t | Stack-focused + workflows |
| Minimal | Simple categories | 100-150t | Bare essentials only |

---

## Anti-Patterns ❌

| Anti-Pattern | Symptoms | Fix |
|-------------|----------|-----|
| **Too Verbose** | 800+ tokens, long paragraphs explaining history | Use trees + tables, target 200-300t |
| **Missing Structure** | Flat list of files with no hierarchy | Add ASCII tree + quick routes |
| **Too Detailed** | Contains file contents instead of just references | Navigation points TO files, doesn't duplicate |
| **Unfocused** | No task-oriented routes | Add Quick Routes table for common tasks |
| **Inconsistent** | Mixed organizational patterns | Pick one pattern and stick with it |

---

## Key Takeaways

### ✅ Good Navigation
1. **Token-efficient** (200-300t) | 2. **Scannable** (trees, tables) | 3. **Task-focused** (quick routes) | 4. **Organized** (by concern/type) | 5. **Concise** (3-5 word descriptions)

### ❌ Bad Navigation
1. **Verbose** (500+t paragraphs) | 2. **Hard to scan** (walls of text) | 3. **Unfocused** (no clear routes) | 4. **Unorganized** (just lists) | 5. **Detailed** (duplicates content)

---

## Quick Reference: Navigation File Anatomy

Every good navigation.md should have these three components regardless of pattern:
1. **Structure** (ASCII tree) — Shows hierarchy at a glance
2. **Quick Routes** (table) — Maps tasks to file paths
3. **By section** (concern/type) — Groups files by category

Optional: Common Workflows for specialized navigation files, showing multi-step processes.

---

## Related

- `../guides/navigation-design-basics.md` — Creating navigation files
- `../guides/organizing-context.md` — Choosing organizational pattern
- `../standards/mvi.md` — Minimal Viable Information principle
