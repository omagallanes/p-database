<!-- Context: core/error | Priority: medium | Version: 1.0 | Updated: 2026-02-15 -->

# Error Operation

**Purpose**: Add recurring errors to knowledge base with deduplication

**Last Updated**: 2026-01-06

---

## When to Use

- Encountered same error multiple times and need to document solution
- Building error knowledge base to prevent repeated debugging
- Need to share verified solutions with the team

---

## 6-Stage Workflow

### Stage 1: Search Existing
Search error message across all `errors/` files. Use fuzzy matching for similar errors (same root cause, different message). Find related errors (same category, different cause).

```
Searching: "Cannot read property 'map' of undefined"
Similar: react-errors.md:45 — "Cannot read property 'X' of undefined" (common)
Related: react-errors.md — "Cannot read property 'length' of undefined"
         react-errors.md — "Undefined is not an object"
```

Prevents creating duplicates for errors that already have documented solutions.

---

### Stage 2: Check Duplication (APPROVAL REQUIRED)
Present deduplication options with letter-based selection:

```
[A] Add as new error to react-errors.md (specific: 'map' on undefined array)
[B] Update existing 'Cannot read property X' (add 'map' as common example)
[C] Skip (already covered sufficiently)

Category: [1] React (react-errors.md) [2] JS (js-errors.md)
          [3] General (common-errors.md) [4] Create new: ___
Select option + category (e.g., 'B 1'):
```

The system checks for existing errors using both exact match and fuzzy matching. Fuzzy matching catches errors with similar wording but different variable names or values.

**Validation**: MUST wait for user input before proceeding.

---

### Stage 3: Preview (APPROVAL REQUIRED)
Show current entry vs proposed update with line-by-line diff. Mark changes with `← NEW` and `← UPDATED`. Show file size before→after and confirm within limits.

```
Current (Line 45, 98 lines):
## Error: Cannot read property 'X' of undefined
**Symptom**: TypeError: Cannot read property 'X' of undefined
**Cause**: Accessing property on undefined/null object.
**Solution**: 1. Null check 2. Optional chaining 3. Default value
**Code**: ```jsx const value = obj?.property ?? 'default' ```
**Prevention**: Always validate data exists
**Frequency**: common | **Reference**: MDN docs

Proposed update (105 lines):
**Symptom**: + TypeError: Cannot read property 'map'  ← NEW
             + TypeError: Cannot read property 'length'  ← NEW
**Cause**: + Common with array methods (map, filter)  ← NEW
**Solution**: 3. Default value (especially for arrays)  ← UPDATED
**Code**: + const items = (data || []).map(...)
          + const items = data?.map(...) ?? []  ← NEW
**Prevention**: + For arrays: empty array default  ← UPDATED
File size: 98 → 105 lines (under 150 limit ✓)
Approve? (yes/no/edit):
```

**Edit mode**: Allow modification before finalizing. **Validation**: MUST get approval.

---

### Stage 4: Add/Update
Add or update error in target file following the error template. Maintain file size <150 lines. Update "Last Updated" date.

**Error Template**:
```markdown
## Error: {Name}
**Symptom**: [Error message]  **Cause**: [Why — 1-2 sentences]
**Solution**: [Numbered steps]
**Code**: ```lang  // ❌ Before  // ✅ After ```
**Prevention**: [How to avoid]  **Frequency**: common/occasional/rare
**Reference**: [Link]
```

---

### Stage 5: Update Navigation
Update navigation.md if new file created. Add cross-references to related errors. Link from related concepts/examples.

### Stage 6: Report
```
✅ Error added to {category}/errors/{file}.md
🔗 Cross-referenced with 2 related errors
📊 Updated navigation.md (if new file)
Changes: Added 'map' examples, updated cause for arrays, file: 105 lines ✓
```

---

## Deduplication Strategy

The goal is to keep the error knowledge base clean and non-redundant. Each error entry should be unique in its root cause.

| Type | Definition | Action |
|------|-----------|--------|
| **Similar** | Same root cause, different error messages | Update existing to include new examples |
| **Related** | Different root causes, same framework/topic | Cross-reference between error entries |
| **Duplicate** | Exact same error and message already documented | Skip (already covered sufficiently) |
| **New** | Unique error not yet in the knowledge base | Add as new entry in appropriate file |
| **Duplicate** | Exact same error already documented | Skip (already covered) |
| **New** | Unique error not yet documented | Add as new entry |

---

## Error Grouping

Group errors by framework/topic in single file (5-10 errors per file):
- `react-errors.md` — All React errors
- `nextjs-errors.md` — All Next.js errors
- `auth-errors.md` — All auth errors

**Don't create** one file per error — too granular and hard to maintain.

---

## Usage Examples

```bash
/context error for "hooks can only be called inside components"
/context error for "Cannot read property 'map' of undefined"
/context error for "Hydration failed in Next.js"
```

---

## Success Criteria

- [ ] Searched for similar errors before adding?
- [ ] Deduplication options presented to user?
- [ ] Preview shown and user approved?
- [ ] Error follows template (Symptom, Cause, Solution, Code, Prevention, Frequency)?
- [ ] File size stays <150 lines?
- [ ] Cross-references added to related errors?
- [ ] navigation.md updated if new file created?

---

## Best Practices

1. **Be specific in error messages**: Include exact error text, not paraphrased versions
2. **Include reproduction steps**: Help users confirm they have the same issue
3. **Show before AND after code**: The diff is more valuable than just the fix
4. **Update frequency**: Rare errors get one entry; common errors get expanded over time
5. **Cross-reference liberally**: Link from concepts to errors and vice versa for faster debugging

---

## Error File Maintenance

Error files should be reviewed periodically to:
- Remove resolved errors (no longer relevant in newer versions)
- Merge similar errors that were added separately
- Update frequency indicators as errors become more/less common
- Ensure all errors still have valid reference links

## Related

- `standards/templates.md` — Error template format
- `guides/workflows.md` — Interactive examples with full dialog
