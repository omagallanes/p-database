<!-- Context: core/organize | Priority: medium | Version: 1.0 | Updated: 2026-02-15 -->

# Organize Operation

**Purpose**: Restructure flat context files into function-based folder structure

**Last Updated**: 2026-01-06

---

## When to Use

- Migrating from flat structure to function-based organization
- Cleaning up disorganized context directories with mixed file types
- Splitting ambiguous files covering multiple topics into proper categories
- Resolving duplicate or conflicting files between folders

---

## 8-Stage Workflow

### Stage 1: Scan
Scan category for all files and detect current structure type (flat vs organized). Output: complete list of files with sizes and current organization status.

### Stage 2: Categorize
Categorize each file by function:

| Question | Folder |
|----------|--------|
| Explains **what** something is? (principles, definitions) | `concepts/` |
| Shows **working code**? (snippets, examples) | `examples/` |
| **How to do** something? (steps, setup) | `guides/` |
| **Quick reference** data? (tables, commands) | `lookup/` |
| Documents an **error/issue**? (fixes, gotchas) | `errors/` |

**Output**: Categorization plan with flagged ambiguous files and conflicts. Each file gets a clear destination proposal.

---

### Stage 3: Resolve Conflicts (APPROVAL REQUIRED)
Present categorization plan with three categories: clear moves, ambiguous files (need resolution), and conflicts (target already exists).

```
Organizing {category}/ (23 files, flat)

Clear (18 files):
  concepts/ (8): authentication.md, state-management.md, caching.md...
  examples/ (5): jwt-example.md, hooks-example.md...
  guides/ (5): setting-up-auth.md...

Ambiguous (5):
  [?] api-design.md (concepts + steps)
      [A] Split → concepts/ + guides/   [B] Keep concepts   [C] Keep guides
  [?] error-handling.md (guide + errors)
      [D] Split → guides/ + errors/   [E] Keep guide   [F] Keep errors
  [?] testing-patterns.md (concepts + examples)
      [G] Split → concepts/ + examples/   [H] Concepts   [I] Examples

Conflicts (2):
  [!] authentication.md → concepts/auth.md (target exists, 120 lines)
      [J] Merge content   [K] Rename -v2   [L] Skip (keep flat)
  [!] jwt-example.md → examples/jwt.md (target exists, 65 lines)
      [M] Merge   [N] Rename -v2   [O] Skip

Select resolutions (A D J M or 'auto'):
```

**Validation**: MUST wait for user input.

---

### Stage 4: Preview (APPROVAL REQUIRED)
```
CREATE: concepts/, examples/, guides/, lookup/, errors/
MOVE (18): authentication.md → concepts/authentication.md...
SPLIT (3): api-design.md → concepts/ + guides/,
           error-handling.md → guides/ + errors/,
           testing-patterns.md → concepts/ + examples/
MERGE (2): authentication.md → concepts/auth.md,
           jwt-example.md → examples/jwt.md
UPDATE: navigation.md, fix 47 internal references
Dry-run? (yes/no/show-diff):
```

**Dry-run**: Simulates changes without executing. **Validation**: MUST get approval.

---

### Stage 5: Backup
Create backup before making changes. **Location**: `.tmp/backup/organize-{category}-{timestamp}/`. The backup contains the entire category directory before any modifications, enabling full rollback.

### Stage 6: Execute
Perform reorganization: create function folders, move files to correct locations (preserving file content), split ambiguous files into separate category-specific files, merge conflicts by combining content from both sources into the target file. Report each action as it completes.

### Stage 7: Update
Update navigation.md with navigation tables for each folder. Fix all internal references. Validate all links. Update "Last Updated" dates.

### Stage 8: Report
```
✅ Organized X files into function folders
📁 Created Y new folders   🔀 Split Z ambiguous files
🔗 Fixed N references
💾 Backup: .tmp/backup/organize-{category}-{timestamp}/
Rollback available if needed.
```

---

## Common Organize Scenarios

### Small Category (5-10 files)
Typically no conflicts. All files categorize cleanly. Just create folders and move. Takes 1-2 minutes.

### Medium Category (10-25 files)
Likely has 2-4 ambiguous files and possibly 1 conflict. User input needed for resolution. Takes 5-10 minutes including approval.

### Large Category (25+ files)
Will have 5+ ambiguous files and multiple conflicts. Use 'auto' resolution for obvious cases, manual review for tricky ones. Takes 15-30 minutes with multiple approval rounds.

---

## Conflict Resolution Summary

| Type | Definition | Options |
|------|-----------|---------|
| **Ambiguous files** | File content spans multiple categories (e.g., concepts + guide) | Split into separate files (recommended), keep in primary category, let user decide priority |
| **Duplicate targets** | Destination file already exists with same or overlapping content | Merge content into existing file, rename with -v2 suffix, skip (keep in flat structure) |
| **Auto-resolution** | AI suggests optimal handling | Based on file size analysis, content type detection, and existing folder structure |

The default recommendation is always **split** for ambiguous files and **merge** for duplicates. These preserve the most information while maintaining clean organization.

---

## Rollback

If the organize operation causes issues, restore from the backup directory:
```bash
cp -r .tmp/backup/organize-{category}-{timestamp}/* .opencode/context/{category}/
```
This restores all files and structure to their pre-organize state.

## Usage Examples

```bash
/context organize development/           # Organize flat directory
/context organize development/ --dry-run  # Preview first without making changes
/context organize development/ core/     # Organize multiple categories in one command
/context organize .                      # Organize entire context directory
```

---

## Organize vs Other Operations

Organize is structure-only: it moves files but doesn't change their content. Contrast with:
- **Extract**: Creates new files from external sources
- **Update**: Modifies file content for API/framework changes
- **Harvest**: Extracts from summaries into permanent files

Use organize when the content is good but the folder structure is flat or inconsistent.

## Success Criteria

- [ ] All files in function folders (not flat)?
- [ ] Ambiguous files resolved?
- [ ] Conflicts handled appropriately?
- [ ] navigation.md created/updated with tables?
- [ ] All references fixed and validated?
- [ ] Backup created before changes?
- [ ] User approved changes before execution?

---

## Performance Notes

Organize operations on large categories (>25 files) may take several seconds. The dry-run option is recommended first to preview the full scope of changes before executing.

## Related

- `standards/structure.md` — Folder organization rules
- `guides/workflows.md` — Interactive examples with full dialog
