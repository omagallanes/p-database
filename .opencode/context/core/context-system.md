<!-- Context: core/context-system | Priority: critical | Version: 1.0 | Updated: 2026-02-15 -->

# Context System

**Purpose**: Minimal, concern-based knowledge organization for AI agents

**Last Updated**: 2026-01-08

---

## Core Principles

### 1. Minimal Viable Information (MVI)
Extract core concepts (1-3 sentences), key points (3-5 bullets), minimal example, reference link. **Goal**: Scannable in <30s. Reference full docs, don't duplicate them.

### 2. Concern-Based Structure
Organize by **what you're doing** (concern), then **how** (approach/tech):

**Pattern A — Function-Based** (repo-specific): `concepts/`, `examples/`, `guides/`, `lookup/`, `errors/` folders under each category. Best for repo-specific context.
**Pattern B — Concern-Based** (multi-tech): `{concern}/{approach|tech}/{file}.md`. Best for cross-technology content.
- `development/backend/api-patterns/` — Concern: backend, Approach: API patterns
- `development/frontend/react/` — Concern: frontend, Tech: React

### 3. Token-Efficient Navigation
Every `navigation.md`: ASCII tree (~50t), Quick routes (~100t), By concern (~50t). **Total**: ~200-300 tokens. Faster loading, lower cost, quicker AI decisions.

### 4. Specialized Navigation
Cross-cutting concerns: `ui-navigation.md` (frontend + ui), `backend-navigation.md`, `fullstack-navigation.md` (common stacks like MERN, T3). Real workflows don't fit neatly into single categories.

### 5. Self-Describing Filenames
❌ `code.md` → ✅ `code-quality.md`. Use kebab-case. Include type context: `rest-design.md`, `jwt-patterns.md`.

### 6. Knowledge Harvesting
Extract valuable context from AI summaries → permanent context → delete summaries. Workspace stays clean, knowledge persists.

### 7. Technology Organization
- **Full-stack frameworks** (Next.js, TanStack Start): `development/frameworks/{tech}/`
- **Specialized domains** (AI, Data): `development/{domain}/`
- **Layer-specific** (React, Node.js): `development/{frontend|backend}/`

---

## Directory Patterns

### Pattern A: Function-Based (Repository-Specific)

```
.opencode/context/{category}/
├── navigation.md              # REQUIRED at every level
├── quick-start.md             # Optional: 2-min orientation
├── core-concepts/             # Optional: foundational concepts
├── concepts/                  # What it is (definitions, principles)
├── examples/                  # Working code (snippets, patterns)
├── guides/                    # How to do it (step-by-step)
├── lookup/                    # Quick reference (tables, commands)
└── errors/                    # Common issues (fixes, gotchas)
```

Use for repository-specific context (e.g., `openagents-repo/`). Each subfolder can have its own `navigation.md`. All content files must be <200 lines.

### Pattern B: Concern-Based (Development Context)

```
.opencode/context/{category}/
├── navigation.md
├── {concern}-navigation.md    # Specialized (optional)
├── principles/                # Universal (optional)
├── {concern}/{approach}/      # e.g., api-patterns/rest-design.md
└── {concern}/{tech}/          # e.g., backend/nodejs/express-patterns.md
```

**Example**: `development/` with `principles/`, `frontend/react/`, `backend/api-patterns/`, `data/sql-patterns/`.

---

## Pattern Selection Guide

Choosing between patterns depends on your content scope:

| Factor | Function-Based (Pattern A) | Concern-Based (Pattern B) |
|--------|---------------------------|---------------------------|
| Scope | Single repository/project | Multiple technologies |
| Structure | Flat by info type (concepts, examples) | Deep by concern (frontend, backend) |
| Best for | `openagents-repo/`, `project-docs/` | `development/`, `design/` |
| Navigation | One nav.md per category | Multiple specialized nav files |
| File organization | `concepts/x.md`, `examples/y.md` | `frontend/react/hooks.md`, `backend/api/rest.md` |

If unsure, start with Function-Based. It's simpler and can be reorganized later.

---

## Navigation File Format

Target: 200-300 tokens per navigation.md.

```markdown
# {Category} Navigation · **Purpose**: [1 sentence]
## Structure — `{cat}/ ├── nav.md └── {sub}/{files}.md`
## Quick Routes — | Task | Path | |---|---| | **{Task}** | `{path}` |
## By {Concern} — **{Section}** → {description}
```

---

## Organizing Principles

### Core Standards (Universal)
`.opencode/context/core/standards/` — Code quality, testing, docs, security. Used by ALL agents. Dev-specific → `development/principles/`.

| Location | Scope | Examples |
|----------|-------|----------|
| `core/standards/` | Universal (all projects, all languages) | Code quality, testing, docs, security |
| `development/principles/` | Dev-specific (software engineering) | Clean code, API design, error handling |

**Data context**: `development/data/` as part of dev workflow (SQL, NoSQL, ORM). Top-level `data/` reserved for data engineering/analytics.

**Specialized navigation**: Includes quick routes + common stacks (MERN, T3). References layer-specific nav files.

---

## Operations

| Command | Purpose | Key Stages |
|---------|---------|------------|
| **Harvest** | Summaries → permanent context | Scan→Analyze→Approve (letter UI)→Extract+MVI→Archive/delete→Report |
| **Extract** | From docs/code/URLs | Read→Categorize→Select category→Preview→Create→Update nav→Report |
| **Organize** | Flat files → function folders | Scan→Categorize→Resolve conflicts→Preview→Backup→Execute→Update refs→Report |
| **Update** | APIs/frameworks change | Identify changes→Find affected→Preview diffs→Backup→Update→Migration notes→Validate→Report |

All operations show preview before approval. Backups in `.tmp/backup/`. Dry-run available for destructive ops.

---

## File Naming

- `navigation.md` (main), `{domain}-navigation.md` (specialized cross-cutting)
- Descriptive: `code-quality.md`, `rest-design.md`, `jwt-patterns.md`
- kebab-case: `scroll-linked-animations.md`

---

## Extraction Rules

Follow MVI when extracting. Keep files focused on one topic each.

| ✅ Extract | ❌ Don't Extract |
|------------|------------------|
| Core concepts (1-3 sentences), essential patterns, step-by-step workflows, critical errors, quick reference data, links to detailed docs | Verbose explanations, complete API docs, implementation details, historical context, marketing content, duplicate information |

---

## Success Criteria

✅ **Minimal** (<200 lines/file) | ✅ **Navigable** (nav.md every level) | ✅ **Organized** (right pattern) | ✅ **Token-efficient** (nav ~200-300t) | ✅ **Self-describing** (filenames tell content) | ✅ **Referenceable** (links to docs) | ✅ **Searchable** | ✅ **Maintainable**

---

## Related Documentation

- `guides/navigation-design.md` — Creating navigation files
- `guides/organizing-context.md` — Choosing organizational pattern
- `examples/navigation-examples.md` — Good navigation examples
- `standards/templates.md` — File templates for each type

---

## Quick Commands

```bash
/context                      # Quick scan, suggest actions
/context harvest              # Summaries → permanent context
/context extract {source}     # From docs/code/URLs
/context organize {category}  # Flat files → function folders
/context update {what}        # When APIs/frameworks change
/context migrate              # Global project-intelligence → local
/context create {category}    # New context category
/context error {error}        # Add error to knowledge base
/context compact {file}       # Minimize to MVI format
/context map [category]       # View structure
/context validate             # Check integrity, references, sizes
```
