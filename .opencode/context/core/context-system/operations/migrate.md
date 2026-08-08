<!-- Context: core/migrate | Priority: medium | Version: 1.0 | Updated: 2026-02-15 -->

# Context Migrate Operation

**Purpose**: Copy context files from global (`~/.config/opencode/context/`) to local (`.opencode/context/`) for git versioning and team sharing

**Last Updated**: 2026-02-06

---

## Core Problem

Users with global OAC install have project-intelligence files at `~/.config/opencode/context/project-intelligence/`. These contain project-specific patterns (tech stack, conventions, decisions) but aren't committed to git or shared with team. **Solution**: Migrate project-intelligence from global → local.

---

## 4-Stage Workflow

### Stage 1: Detect Sources
Scan global config directory for project-intelligence files:

```
Scanning global context...
Global: ~/.config/opencode/context/
Found:
  project-intelligence/
    technical-domain.md (1.2 KB, Version: 1.3)
    navigation.md (800 B, Version: 1.0)
    business-domain.md (1.5 KB, Version: 1.1)
Local: .opencode/context/
Status: No local project-intelligence/ found
```

**Edge cases**:
- **No global context**: `Nothing to migrate. Use /add-context.` → Exit
- **No project-intelligence** (but other global exists): Only project-intelligence migrates. Core standards stay global (universal). → Exit

---

### Stage 2: Check for Conflicts
If local `.opencode/context/project-intelligence/` already exists:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Conflict: Local project-intelligence exists         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Global:                              Local:
  technical-domain.md v1.3             technical-domain.md v1.0
  navigation.md v1.0                   navigation.md v1.0
  business-domain.md v1.1              (not present)

Options:
1. Skip existing — copy only new files (will copy: business-domain.md)
2. Overwrite all — replace local with global (backup first, show diffs)
3. Cancel — do nothing
```

**If Overwrite (2) selected**, show diff:
```
Local: Tech Stack Next.js 14, API: basic validation
Global: Tech Stack Next.js 15, API: Zod validation
Backup local to .tmp/backup/migrate-{timestamp}/? [y/n] (default: y):
```

If no conflicts → proceed directly to Stage 3.

---

### Stage 3: Approval & Copy
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Migration Plan                                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Copy from: ~/.config/opencode/context/project-intelligence/
Copy to:   .opencode/context/project-intelligence/

Files: ✓ technical-domain.md (1.2 KB)
       ✓ navigation.md (800 B)
       ✓ business-domain.md (1.5 KB)

After: local files committed → team gets patterns
       Agents load local (overrides global)
       Global remains as fallback for other projects
Proceed? [y/n]:
```

**On approval**: 
1. Create `.opencode/context/project-intelligence/` directory if it doesn't exist
2. Copy each file from global → local using `cp` (preserves metadata)
3. Validate each copied file: check frontmatter is intact, MVI structure is maintained, file size is under limits
4. Report any validation warnings but don't block the migration

---

### Stage 4: Cleanup & Confirmation
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Migration Complete                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Copied 3 files to .opencode/context/project-intelligence/

Clean up global project-intelligence?
1. Keep global files (safe default) — still serves other projects
2. Remove global project-intelligence/ (only this user)
Choose [1/2] (default: 1):
```

**If 2**: Delete `~/.config/opencode/context/project-intelligence/` only. Do NOT touch `core/` or other global context. This operation cannot be undone — a backup is recommended before proceeding.

The cleanup option exists because once files are migrated to the local project, the global copies become stale. Keeping them can cause confusion (which version is current?). However, if you work on multiple projects, keeping the global files ensures consistency across all projects until each is migrated individually.

The global cleanup is optional because those files can still serve as a fallback for other projects on the same machine. Only remove them when you're certain all relevant projects have been migrated.

---

## What Gets Migrated

| Migrated (project-specific) | NOT Migrated (universal) |
|---|---|
| `project-intelligence/` (all files) | `core/standards/` |
| `technical-domain.md`, `business-domain.md` | `core/context-system/` |
| `navigation.md` | `core/workflows/` |
| `decisions-log.md`, `living-notes.md` | Any other `core/` files |

**Rationale**: Project intelligence = YOUR tech stack, YOUR patterns (project-specific). Core standards = universal (code quality, documentation, security) → stay global for all projects.

---

## Validation After Migration

After migration completes, verify:
- All files exist in the local `.opencode/context/project-intelligence/` directory
- Frontmatter is intact (Context, Priority, Version, Updated fields)
- File sizes are within limits (<200 lines)
- No files were corrupted during copy (compare checksums if available)

---

## Summary

Migrate moves project-specific patterns from global to local, enabling version control and team sharing. Core standards remain global and universal. The operation requires user approval at each stage.

## Error Handling

```
Permission denied:
Error: Cannot write to .opencode/context/project-intelligence/
Check directory permissions and try again.

Global path not found:
No global config at ~/.config/opencode/
Set OPENCODE_INSTALL_DIR=/your/custom/path and retry
```

---

## Usage Examples

```bash
/context migrate              # Auto-detect and migrate
/context migrate --dry-run    # Preview without copying
```

---

## Dry Run Mode

Use `--dry-run` to preview what would be migrated without making changes:
```bash
/context migrate --dry-run
```
This shows: detected global files, local file status, any conflicts, and what the final migration plan would look like.

---

## Related

- `/add-context` — Create new project intelligence (interactive wizard)
- `/context harvest` — Extract knowledge from summaries
- Context path resolution: `../../system/context-paths.md`
