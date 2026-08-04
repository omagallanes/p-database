<!-- Context: core/structure | Priority: critical | Version: 1.0 | Updated: 2026-02-15 -->

# Context Structure

**Purpose**: Function-based folder organization for easy discovery

**Last Updated**: 2026-01-06

---

## Core Structure

<rule id="function_structure" enforcement="strict">
  ALWAYS organize by function (what info does), not just by topic. Required folders:
  - `concepts/` — Core ideas, definitions, "what is it?"
  - `examples/` — Minimal working code snippets
  - `guides/` — Step-by-step workflows
  - `lookup/` — Quick reference tables, commands, paths
  - `errors/` — Common issues, gotchas, fixes
</rule>

```
.opencode/context/{category}/
├── navigation.md              # REQUIRED at every level
├── concepts/                  # What it is
├── examples/                  # Working code
├── guides/                    # How to do it
├── lookup/                    # Quick reference
└── errors/                    # Common issues
```

Each subfolder can contain its own `navigation.md`. All content files must be <200 lines.

---

## Folder Purposes

### concepts/
**Purpose**: Core ideas, definitions, "what is it?"
**Contains**: Fundamental concepts, design patterns, architecture decisions, system principles, domain definitions
**Examples**: `concepts/authentication.md`, `concepts/state-management.md`, `concepts/mvi-principle.md`

---

### examples/
**Purpose**: Minimal working code patterns
**Contains**: Code snippets that work as-is, minimal reproductions, common patterns in action, before/after comparisons
**Examples**: `examples/jwt-auth-example.md`, `examples/react-hooks-example.md`
**Rule**: <30 lines of code, fully functional, copy-paste ready. Each example should solve one specific problem.

---

### guides/
**Purpose**: Step-by-step workflows, "how to do X"
**Contains**: Numbered procedures, setup instructions, implementation workflows, migration guides, troubleshooting flows
**Examples**: `guides/setting-up-auth.md`, `guides/deploying-api.md`, `guides/migrating-to-v2.md`
**Rule**: Steps must be actionable (not theoretical) with expected results after each step. Include verification commands where possible.

---

### lookup/
**Purpose**: Quick reference tables, commands, paths
**Contains**: Command lists, file locations, API endpoints, configuration options, keyboard shortcuts, environment variables
**Examples**: `lookup/cli-commands.md`, `lookup/file-locations.md`, `lookup/api-endpoints.md`
**Rule**: Must be in table/list format for scannability, not prose. Users scan lookup tables, they don't read them.

---

### errors/
**Purpose**: Common errors, gotchas, edge cases
**Contains**: Error messages + fixes, common pitfalls, edge cases, troubleshooting steps, prevention tips
**Examples**: `errors/react-errors.md`, `errors/nextjs-build-errors.md`, `errors/auth-errors.md`
**Rule**: Group by framework/topic (5-10 errors per file), not one per error. Include frequency indicator (common/occasional/rare). Each error entry should have a before/after code example showing the fix.

**Examples**: `errors/react-errors.md` can hold "Cannot read property", "Hooks called conditionally", "Stale closure", "Invalid hook call" — all in one file.

---

## navigation.md Requirement

<rule id="readme_required" enforcement="strict">
  Every context category MUST have navigation.md at its root with:
  1. Purpose (1-2 sentences)
  2. Navigation tables for each function folder (file name, description, priority)
  3. Priority levels (critical/high/medium/low)
  4. Loading strategy for common tasks (what to load in what order)
</rule>

**Example navigation.md**:
```markdown
# Development Context
**Purpose**: Core development patterns, errors, and examples

## Quick Navigation
### Concepts | File | Description | Priority |
| concepts/auth.md | Authentication patterns | critical |
### Examples | examples/jwt.md | JWT auth example | high |
### Errors | errors/react.md | Common React errors | high |

## Loading Strategy
For auth work: 1. concepts/auth.md  2. examples/jwt.md  3. guides/setup-auth.md
```

---

## Categorization Rules

When organizing a file, ask:

| Question | Folder |
|----------|--------|
| Does it explain **what** something is? (concept, definition) | `concepts/` |
| Does it show **working code**? (snippet, example) | `examples/` |
| Does it explain **how to do** something? (steps, workflow) | `guides/` |
| Is it **quick reference** data? (table, list, command) | `lookup/` |
| Does it document an **error/issue**? (fix, gotcha) | `errors/` |

---

## Anti-Patterns ❌

### Flat Structure
```
development/ ├── authentication.md, jwt-example.md, setting-up-auth.md
              ├── auth-errors.md, api-endpoints.md
```
**Problem**: Hard to discover. `authentication.md` could be concept, guide, or reference.

### ✅ Function-Based
```
development/ ├── navigation.md, concepts/authentication.md, examples/jwt-example.md
              ├── guides/setting-up-auth.md, lookup/api-endpoints.md, errors/auth-errors.md
```
**Benefit**: File purpose instantly clear from location. Navigation tables enable quick discovery of relevant files without searching through flat lists.

When in doubt, use function-based. It's simpler and works for most cases. You can always reorganize later if the concern-based pattern becomes necessary. The organize command handles this transition automatically.

---

## Subfolder Navigation

For large categories, each function folder can have its own `navigation.md`. This is useful when a folder has 5+ files. The subfolder nav should list files with descriptions and priorities, similar to the root navigation.md format.

---

## Validation Checklist

Run this checklist before committing context structure changes:

- [ ] All categories have navigation.md at root level?
- [ ] All files placed in function folders (not flat)?
- [ ] navigation.md has tables for all function folders?
- [ ] Priority levels assigned (critical/high/medium/low)?
- [ ] Loading strategy documented for common tasks?
- [ ] No broken internal references across files?

---

## Category Relationships

Context categories can reference each other. For example, a concept in `development/concepts/` can link to related errors in `development/errors/`. Cross-category references should use relative paths from the source file.

---

## Hidden Files

Files starting with `.` (dotfiles) in context directories are ignored by navigation and operations. Use them for temporary notes or configuration that shouldn't appear in navigation tables.

Subfolder navigation.md files follow the same format as root navigation.md but focus only on files within that subfolder.

## File Size Enforcement

All content files must be <200 lines. Navigation files must be 200-300 tokens. If a file exceeds these limits, split it into multiple files or compact using MVI principles. The `compact` command can help minimize verbose files.

---

## Related

- `mvi-principle.md` — What to extract and how to format
- `templates.md` — File format templates for each type
- `creation.md` — Rules for creating new context files
