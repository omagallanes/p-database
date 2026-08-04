<!-- Context: core/extract | Priority: medium | Version: 1.0 | Updated: 2026-02-15 -->

# Extract Operation

**Purpose**: Extract context from docs, code, or URLs into organized context files

**Last Updated**: 2026-01-06

---

## When to Use

- Extracting from documentation (React docs, API docs, etc.) to create permanent reference
- Extracting from codebase to document patterns, conventions, and architecture
- Extracting from URLs (blog posts, guides, tutorials) for team knowledge
- Creating initial context for new topics or technologies being adopted

---

## 7-Stage Workflow

### Stage 1: Read Source
Agent reads the source material completely, identifies sections, patterns, APIs, and extractable content. Reports progress to the user.

```
/context extract from https://react.dev/hooks
  → "Reading source (8,500 lines)... Analyzing for extractable items..."
```

The agent scans for: code examples, API signatures, conceptual explanations, error patterns, and workflow steps. All findings are cataloged for the categorization step.

---

### Stage 2: Analyze & Categorize
Content is categorized by function into five target folders:

| Content Type | Target Folder | Examples of What Goes There |
|-------------|---------------|------------------------------|
| Design decisions | `concepts/` | Architecture choices, principles, rationale, definitions |
| Working code | `examples/` | Code snippets, usage patterns that work as-is |
| Step-by-step | `guides/` | Workflows, setup instructions, tutorials, migration steps |
| Reference data | `lookup/` | Commands, API endpoints, config options, paths |
| Errors/gotchas | `errors/` | Common issues, pitfalls, fixes, edge cases |

**Output**: A numbered list of extractable items with letter IDs (A, B, C...), target folder, and a short preview of each item's content (first 60 characters).

---

### Stage 3: Select Category (APPROVAL REQUIRED)
User selects which items to extract and which category to place them in:

```
Found 12 extractable items from React hooks docs:
Concepts (8):
  [A] useState — State management hook
  [B] useEffect — Side effects hook
  [C] useContext — Context consumption
  ... (6 more items)

Errors (4):
  [I] Hooks called conditionally
  [J] Hooks in loops
  [K] Hooks outside components
  [L] Stale closures

Guides (3):
  [U] Setting up custom hooks
  [V] Debugging hook issues
  [W] Testing components with hooks

Category: [1] development/ [2] core/ [3] Create new: ___
Select items (A B I or 'all') + category (1/2/3):
```

**Validation**: MUST wait for user input before proceeding.

---

### Stage 4: Preview (APPROVAL REQUIRED)
Shows what will be created, modified, and any conflicts:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Extraction Plan: development/                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

NEW FILES TO CREATE:
  concepts/use-state.md (45 lines)
  concepts/use-effect.md (52 lines)
  concepts/use-context.md (38 lines)
  ... (9 concept files total)
  guides/custom-hooks.md (87 lines)
  guides/debugging-hooks.md (65 lines)
  guides/testing-hooks.md (72 lines)

EXISTING FILES TO UPDATE:
  errors/react-hooks-errors.md (98 → 124 lines, +4 new error entries)

⚠️ CONFLICT DETECTED:
  concepts/use-memo.md already exists (42 lines)
  [A] Skip — keep existing file
  [B] Overwrite — replace with extracted version
  [C] Merge — add new content to existing (42 → 58 lines)
  Choose [A/B/C]: ___

NAVIGATION UPDATE:
  development/navigation.md
    + 9 new entries in Concepts table
    + 2 new entries in Guides table
    + 1 updated entry in Errors table

Total: 12 files, ~650 lines
Preview specific file? (type filename, 'all', or 'skip')
Approve? (yes/no/edit):
```

**Preview modes**: 'all' shows first 10 lines of each file in sequence; typing a filename shows full content; 'skip' goes straight to the approval prompt.

**Validation**: MUST get user approval before proceeding.

---

### Stage 5: Create Files
Apply MVI format to each file: 1-3 sentences for core idea, 3-5 key points as bullets, minimal code example (<10 lines), reference link back to source. Create files in correct function folders. Ensure all files under 200 lines. Add cross-references between related files (e.g., a concept may link to its example and error entries).

**Enforcement**: `@critical_rules.mvi_strict` + `@critical_rules.function_structure`

Quality checks before writing: verify all file paths are correct, confirm no existing files will be accidentally overwritten (unless merge chosen), validate that cross-references point to existing or newly created files.

---

### Stage 6: Update Navigation
Update category navigation.md with new file entries. Assign priority levels (critical/high/medium/low) based on importance. Add cross-references between newly created and existing related files. Update "Last Updated" dates on all modified navigation files.

---

### Stage 7: Report Results
```
✅ Extracted X items into {category}
📄 Created Y new files
📝 Updated Z existing files
📊 Updated {category}/navigation.md

Files created:
  - {category}/concepts/ (N files)
  - {category}/examples/ (N files)
  - {category}/errors/ (N files)
  - {category}/guides/ (N files)
```

---

## Usage Examples

```bash
/context extract from https://react.dev/hooks   # Extract from URL
/context extract from docs/api.md                # Extract from local file
/context extract from src/utils/                 # Extract from codebase
/context extract from docs/architecture/         # Extract from directory
```

---

## Success Criteria

Checklist for a successful extract operation:

- [ ] All extracted files <200 lines each?
- [ ] MVI format applied (1-3 sentences core idea, 3-5 key points, example <10 lines, reference)?
- [ ] Files placed in correct function folders (concepts/, examples/, guides/, lookup/, errors/)?
- [ ] Navigation.md updated with new entries and priority levels?
- [ ] Cross-references added between related files?
- [ ] User approved at Stages 3 and 4 (Select Category + Preview)?
- [ ] All files under the 200-line limit?

---

## Related

- `standards/mvi.md` — What to extract and how to format content
- `guides/compact.md` — How to minimize verbose extracted content
- `guides/workflows.md` — Interactive examples with full dialog simulation
