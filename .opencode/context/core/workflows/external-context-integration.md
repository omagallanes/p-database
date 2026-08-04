<!-- Context: workflows/external-context-integration | Priority: high | Version: 1.0 | Updated: 2026-01-28 -->
# External Context Integration Guide

## Overview

This guide explains how to integrate external context (fetched via ExternalScout) into the main agent workflow so subagents can access it without re-fetching.

**Key Principle**: Main agents fetch external docs once → persist to disk → reference in session → subagents read (no re-fetching)

---

## When to Use External Context

**Use ExternalScout when**: User asks about external libraries (Drizzle, Better Auth, Next.js, etc.), task involves multi-library integration, setup/configuration of external tools, API patterns from external libs
**Don't use when**: Question is about internal project code, answer is in `.opencode/context/` (use ContextScout), general programming concepts

---

## Integration Workflow (6 Stages)

### Stage 1: Analyze & Discover (Before Approval)
Main Agent → Analyze user request → Identify external libraries → Call ContextScout for internal context → Call ExternalScout for external docs → Capture returned file paths → Do NOT write anything to disk yet

### Stage 2: Propose Plan (Before Approval)
Main Agent → Show lightweight summary (what, which libs, context files) → Include external context files in proposal → Wait for user approval

### Stage 3: Approve (User Gate)
User approves plan (or redirects)

### Stage 4: Init Session (After Approval)
Main Agent → Create `.tmp/sessions/{session-id}/context.md` → Populate with: Context Files, Reference Files, External Context Fetched, Components, Constraints, Exit Criteria

### Stage 5: Delegate with Context Path
Main Agent → Call TaskManager with session path → TaskManager reads session → Extracts external context → Includes in subtask JSONs

### Stage 6: Subagents Read External Context
TaskManager/CoderAgent/TestEngineer → Read session context → Extract "## External Context Fetched" → Read files from `.opencode/external-context/` → Implement → NO RE-FETCHING ✅

---

## Implementation Details

### Step 1: Call ExternalScout (Before Approval)
```javascript
// Detect external libraries from user request
task(subagent_type="ExternalScout", description="Fetch external documentation",
  prompt="Fetch documentation for:
    - Drizzle ORM: modular schema organization
    - Better Auth: Next.js integration
    - Next.js: App Router setup
  Persist fetched docs to .opencode/external-context/
  Return file paths for each fetched document")

// Capture returned file paths
// Example: .opencode/external-context/drizzle-orm/modular-schemas.md
```

### Step 2: Propose Plan with External Context
```markdown
## Implementation Plan
**Task**: Set up Drizzle + Better Auth in Next.js
**External Libraries**: Drizzle ORM, Better Auth, Next.js
**External Context Discovered**:
- .opencode/external-context/drizzle-orm/modular-schemas.md
- .opencode/external-context/better-auth/nextjs-integration.md
- .opencode/external-context/next.js/app-router-setup.md
**Approach**: 1. Drizzle schema → 2. Better Auth config → 3. Next.js integration
**Approval needed before proceeding.**
```

### Step 3: Create Session with External Context (After Approval)
```markdown
# Task Context: Drizzle + Better Auth Integration
Session ID: 2026-01-28-drizzle-auth | Created: 2026-01-28T14:30:22Z | Status: in_progress

## Current Request
Set up Drizzle ORM with Better Auth in a Next.js application

## Context Files (Standards)
- .opencode/context/core/standards/code-quality.md
- .opencode/context/core/standards/test-coverage.md

## Reference Files (Source)
- package.json, src/db/schema.ts, src/auth/config.ts

## External Context Fetched
### Drizzle ORM
- `.../drizzle-orm/modular-schemas.md` — Schema organization patterns
- `.../drizzle-orm/postgresql-setup.md` — PostgreSQL configuration
### Better Auth
- `.../better-auth/nextjs-integration.md` — Next.js integration guide
- `.../better-auth/drizzle-adapter.md` — Drizzle adapter setup
### Next.js
- `.../next.js/app-router-setup.md` — App Router basics
- `.../next.js/server-actions.md` — Server Actions patterns
**Important**: These files are read-only and cached for reference. Do not modify them.

## Components
Drizzle schema setup, Better Auth config, Next.js App Router integration

## Constraints
TypeScript strict mode, must support PostgreSQL, backward compatible

## Exit Criteria
- [ ] Drizzle schema set up with modular organization
- [ ] Better Auth configured with Drizzle adapter
- [ ] Next.js integration complete
- [ ] All tests passing, documentation updated
```

### Step 4-6: Delegate → TaskManager Creates Subtasks → CoderAgent Implements
TaskManager reads session context → creates subtask JSONs with `external_context` field → CoderAgent reads external_context files and implements (no re-fetching)

**Subtask JSON Example**:
```json
{
  "id": "01-drizzle-schema-setup",
  "title": "Set up Drizzle schema with modular organization",
  "context_files": [".opencode/context/core/standards/code-quality.md"],
  "reference_files": ["package.json", "src/db/schema.ts"],
  "external_context": [
    ".opencode/external-context/drizzle-orm/modular-schemas.md",
    ".opencode/external-context/drizzle-orm/postgresql-setup.md"
  ],
  "instructions": "Set up Drizzle schema following modular patterns from external context...",
  "acceptance_criteria": ["Schema organized by domain", "PostgreSQL config matches docs", "Tests cover schema"]
}
```

---

### Integration Checklist Summary
- All external libraries discovered via ExternalScout
- File paths captured from ExternalScout response
- Session context includes full "External Context Fetched" section
- Subtask JSONs include external_context field
- Subagents read, never re-fetch

---

## Best Practices

| Agent | ✅ DO | ❌ DON'T |
|-------|-------|----------|
| **Main Agents** | Call ExternalScout early, capture paths, add to session, pass to subagents | Forget ExternalScout, skip session, re-fetch, modify external files |
| **ExternalScout** | Persist docs, update manifest, include metadata header, filter to relevant sections, cite sources | Skip persistence/manifest, return entire docs, fabricate content, write outside external-context/ |
| **TaskManager** | Extract external_context from session, include in subtask JSONs, pass downstream | Omit external_context, mix with context_files, assume re-fetch |
| **Subagents** | Read external_context files, use docs for implementation, reference in comments | Re-fetch, ignore external context, modify files, treat as optional |

---

## Complete Flow Example

**User**: "Set up Drizzle ORM with Better Auth in Next.js, using modular schema organization"

**Main Agent Flow**:
1. Analyze → Detect Drizzle, Better Auth, Next.js
2. Discover → Call ContextScout + ExternalScout
3. Propose → Show plan with external context files
4. Approve → User approves
5. Init Session → Create context.md with external context section
6. Delegate → Call TaskManager with session path
7. Validate → Check tests pass
8. Complete → Update docs, cleanup

**CoderAgent Flow**: Read subtask JSON → Load context_files → Reference external_context → Implement → Complete

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Files not found** | Check ExternalScout ran, verify file paths match, check .manifest.json, re-run if missing |
| **Stale context** | Delete stale files (`manage-external-context.sh delete-package {pkg}`), re-fetch, update session |
| **Manifest out of sync** | Regenerate (`manage-external-context.sh regenerate-manifest`), verify metadata headers |

---

## References

- **ExternalScout**: `.opencode/agent/subagents/core/externalscout.md`
- **External Context Management**: `.opencode/context/core/workflows/external-context-management.md`
- **Task Delegation**: `.opencode/context/core/workflows/task-delegation-basics.md`
- **Management Script**: `scripts/external-context/manage-external-context.sh`