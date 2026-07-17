<!-- Context: workflows/external-context | Priority: high | Version: 1.0 | Updated: 2026-01-28 -->
# External Context Management

## Overview

External context is live documentation fetched from external libraries and frameworks (via Context7 API or official docs). We **persist** it to `.opencode/external-context/` so agents can pass it to subagents without re-fetching.

**Key Principle**: ExternalScout fetches once → persists to disk → main agents reference → subagents read (no re-fetching)

---

## Directory Structure

```
.opencode/external-context/
├── .manifest.json                    # Cache metadata
├── drizzle-orm/
│   ├── modular-schemas.md
│   ├── postgresql-setup.md
│   └── typescript-config.md
├── better-auth/
│   ├── nextjs-integration.md
│   ├── drizzle-adapter.md
│   └── session-management.md
├── next.js/
│   ├── app-router-setup.md
│   ├── server-actions.md
│   └── middleware.md
└── tanstack-query/
    ├── server-components.md
    └── prefetching.md
```

### Naming Conventions
- **Package dir**: Exact npm package name, kebab-case (✅ `drizzle-orm`, `better-auth`, `@tanstack/react-query` / ❌ `drizzle`, `nextjs`)
- **File name**: Kebab-case topic description (✅ `modular-schemas.md` / ❌ `modular schemas.md`, `ServerComponents.md`)

---

## Manifest File

**Location**: `.opencode/external-context/.manifest.json`
**Purpose**: Track what's cached, when fetched, and from which source

```json
{
  "last_updated": "2026-01-28T14:30:22Z",
  "packages": {
    "drizzle-orm": {
      "files": ["modular-schemas.md", "postgresql-setup.md", "typescript-config.md"],
      "last_updated": "2026-01-28T14:30:22Z",
      "source": "Context7 API",
      "official_docs": "https://orm.drizzle.team"
    },
    "better-auth": {
      "files": ["nextjs-integration.md", "drizzle-adapter.md", "session-management.md"],
      "last_updated": "2026-01-28T14:25:10Z",
      "source": "Context7 API",
      "official_docs": "https://better-auth.com"
    }
  }
}
```

---

## File Format

Each file has a YAML metadata header followed by filtered documentation:

```markdown
---
source: Context7 API
library: Drizzle ORM
package: drizzle-orm
topic: modular-schemas
fetched: 2026-01-28T14:30:22Z
official_docs: https://orm.drizzle.team/docs/goodies#multi-file-schemas
---

# Modular Schemas in Drizzle ORM

[Filtered documentation content from Context7 API]

## Key Concepts
[Relevant sections only]

## Code Examples
[Practical examples from official docs]

---
**Source**: Context7 API | **Official Docs**: [link] | **Fetched**: 2026-01-28T14:30:22Z
```

---

## Workflow: How External Context Flows

### Stage 1: Main Agent Detects Need
Main Agent detects external libraries in user request → Calls ExternalScout to fetch live docs

### Stage 2: ExternalScout Fetches & Persists
Detect → Fetch from Context7 API → Filter to relevant sections → Persist to `external-context/{package}/{topic}.md` → Update `.manifest.json` → Return file paths

### Stage 3: Main Agent Creates Session
Creates `.tmp/sessions/{session-id}/context.md` → Adds "## External Context Fetched" section listing files → Delegates to TaskManager with session path

### Stage 4: Subagents Read (No Re-fetching)
TaskManager/CoderAgent → Read session context → Extract external context section → Read files from `external-context/` → Implement → NO RE-FETCHING ✅

---

## Integration with Task Delegation

The session context file serves as the bridge between main agents and subagents. It collects all context (internal standards, project files, and external docs) in one place.

### In Session Context File
```markdown
## External Context Fetched
### Drizzle ORM
- `.../modular-schemas.md` — Schema organization patterns
- `.../postgresql-setup.md` — PostgreSQL configuration
### Better Auth
- `.../nextjs-integration.md` — Next.js integration guide
- `.../drizzle-adapter.md` — Drizzle adapter setup
**Read-only. Cached for reference only. Do not modify.**
```

### In Subtask JSONs (Created by TaskManager)
```json
{
  "id": "01-drizzle-schema-setup",
  "title": "Set up Drizzle schema",
  "context_files": [".opencode/context/core/standards/code-quality.md"],
  "reference_files": ["package.json", "src/db/schema.ts"],
  "external_context": [
    ".opencode/external-context/drizzle-orm/modular-schemas.md",
    ".opencode/external-context/drizzle-orm/postgresql-setup.md"
  ],
  "acceptance_criteria": ["Schema organized by domain", "PostgreSQL config matches docs", "Tests cover schema"]
}
```

---

## Cleanup & Maintenance

**When to clean up**:
1. Task complete and session is deleted
2. External docs become stale (>7 days old)
3. User explicitly requests cleanup
4. Disk space is needed

**How to clean up manually**: `rm -rf .opencode/external-context/{package-name}/` → update .manifest.json → re-fetch if needed
**Automatic** (planned): Cleanup script removes files older than 7 days, runs as part of session cleanup

---

## Best Practices

| Role | ✅ DO | ❌ DON'T |
|------|-------|----------|
| **Main Agents** | Call ExternalScout early, capture paths, add to session, pass to subagents, don't re-fetch | Forget ExternalScout, skip session, re-fetch |
| **ExternalScout** | Persist docs, update manifest, include metadata header, filter aggressively, cite sources | Skip persistence/manifest, return entire docs, fabricate content |
| **Subagents** | Read external context, don't re-fetch, reference in implementation, don't modify files | Re-fetch, ignore context, modify files, treat as optional |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Files not found** | Check ExternalScout ran successfully, verify path in session matches actual location, check .manifest.json, re-run if missing |
| **Stale context (>7 days)** | `rm -rf .opencode/external-context/{package}/`, update manifest, re-run ExternalScout, update session paths |
| **Manifest out of sync** | Regenerate: `find .opencode/external-context -name "*.md" | sort`, update manifest, verify metadata headers present |

---

## References

- **ExternalScout**: `.opencode/agent/subagents/core/externalscout.md`
- **Task Delegation**: `.opencode/context/core/workflows/task-delegation-basics.md`
- **Session Management**: `.opencode/context/core/workflows/session-management.md`
- **Library Registry**: `.opencode/skills/context7/library-registry.md`