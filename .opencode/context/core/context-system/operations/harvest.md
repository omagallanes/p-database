<!-- Context: core/harvest | Priority: medium | Version: 1.0 | Updated: 2026-02-15 -->

# Context Harvest Operation

**Purpose**: Extract knowledge from AI summaries → permanent context, then clean workspace

**Last Updated**: 2026-01-06

---

## Core Problem

AI agents create summary files (`OVERVIEW.md`, `SESSION-*.md`, `SUMMARY.md`) that contain valuable knowledge but clutter the workspace. **Solution**: Harvest the knowledge → permanent context, then delete summaries. Workspace stays clean, knowledge persists.

---

## Auto-Detection Patterns

<rule id="summary_patterns" enforcement="strict">
  Harvest auto-detects:
  - Filename: `*OVERVIEW.md`, `*SUMMARY.md`, `SESSION-*.md`, `CONTEXT-*.md`, `*NOTES.md`
  - Location: Files in `.tmp/`, files titled "Summary"/"Overview"/"Session", files >2KB in root
</rule>

---

## 6-Stage Workflow

### Stage 1: Scan
Find all summary files using auto-detection patterns. Check `.tmp/` directory. List files with sizes, sorted newest first.

```
Found 3 summary documents:
1. CONTEXT-SYSTEM-OVERVIEW.md (4.2 KB, modified 1h ago)
2. SESSION-auth-work.md (1.8 KB, modified today)
3. .tmp/IMPLEMENTATION-NOTES.md (800 B, modified today)
```

---

### Stage 2: Analyze
Read each file, identify valuable sections, skip planning/conversation. Map content by function:

| Content Type | Target Folder | Indicators |
|-------------|---------------|------------|
| Design decisions | `concepts/` | "We decided to...", "Architecture", "Pattern" |
| Solutions/patterns | `examples/` | Code snippets, "Here's how we..." |
| Workflows | `guides/` | Numbered steps, "How to...", "Setup" |
| Errors encountered | `errors/` | Error messages, "Fixed issue", "Gotcha" |
| Reference data | `lookup/` | Tables, lists, paths, commands |

**Output**: Categorized items with letter IDs, target paths, and 60-char previews.

---

### Stage 3: Approve (CRITICAL — APPROVAL REQUIRED)

<rule id="approval_gate" enforcement="strict">
  ALWAYS show approval UI before extracting/deleting. NEVER auto-harvest without user confirmation.
</rule>

```
### CONTEXT-SYSTEM-OVERVIEW.md (4.2 KB)
✓ [A] Design: Function-based org → core/concepts/context-organization.md
✓ [B] Pattern: MVI → core/concepts/mvi-principle.md
✓ [C] Workflow: Harvesting → core/guides/harvesting.md
✗ [D] Skip: Planning discussion (temporary knowledge)

### SESSION-auth-work.md (1.8 KB)
✓ [E] Error: JWT expiry → development/errors/auth-errors.md
✓ [F] Example: JWT refresh → development/examples/jwt-refresh.md

### .tmp/IMPLEMENTATION-NOTES.md (800 B)
✗ [G] Skip: Duplicate (already in concepts/api-design.md)

Quick: 'A B C E F' (specific) | 'all' (all ✓) | 'none' (delete) | 'cancel' (keep all)
```

**Validation**: MUST wait for user input. If 'cancel', stop immediately and keep all files.

---

### Stage 4: Extract (APPROVAL REQUIRED)

<rule id="extraction" enforce="@mvi_principle">
  MVI: Core concept 1-3 sentences | Key points 3-5 bullets | Example <10 lines | Reference link | Files <200 lines
</rule>

For each approved item, extract and minimize content, then show preview:

```
[A] → core/concepts/context-organization.md (CREATE, 45 lines)
┌─ # Concept: Context Organization | Organize by function... ─┐
[E] → development/errors/auth-errors.md (ADD, 98→112 lines)
┌─ + ## Error: JWT Token Expiration | Symptom: 401 after 1h... ─┐
Approve extraction? (yes/no/edit):
```

On approval: write files to disk, add cross-references, update navigation.md maps.

---

### Stage 5: Cleanup (APPROVAL REQUIRED)
```
Successfully harvested: CONTEXT-SYSTEM-OVERVIEW.md, SESSION-auth-work.md
Skipped (no value): .tmp/IMPLEMENTATION-NOTES.md

[1] Archive → .tmp/archive/harvested/{date}/ (safe, can restore)
[2] Delete permanently   [3] Keep as-is
```

<rule id="cleanup_safety" enforcement="strict">
  ONLY cleanup files successfully harvested. If extraction failed, keep original file.
</rule>

---

### Stage 6: Report
```
✅ Harvested 5 items into permanent context
   → core/concepts/context-organization.md, mvi-principle.md
   → core/guides/harvesting.md
   → development/errors/auth-errors.md, examples/jwt-refresh.md
🗑️ Archived: 2 files → .tmp/archive/harvested/2026-01-06/
📊 Updated: core/navigation.md, development/navigation.md
💾 Disk space freed: 6.8 KB
```

The report includes: items harvested, files created/modified, cleanup actions taken, navigation files updated, and disk space freed. These metrics help track knowledge base growth over time.

---

## Usage Examples

```bash
/context harvest                     # Scan entire workspace
/context harvest .tmp/               # Specific directory
/context harvest OVERVIEW.md         # Specific file
/context harvest SESSION-2026-01-06.md
```

---

## Smart Content Detection

| ✅ Extract (Valuable Knowledge) | ❌ Skip (Temporary/Noise) |
|----------------------------------|---------------------------|
| Design decisions, patterns that worked, errors + solutions, API changes, performance findings, core concepts | Planning ("Should we?"), conversation ("I think..."), duplicates, TODO lists, timestamps |

---

## Safety Features

1. **Approval gate** — Never auto-delete without confirmation
2. **Archive by default** — Move to `.tmp/archive/`, not permanent delete
3. **Validation** — Check file sizes and structure before committing
4. **Rollback** — Can restore from archive if needed
5. **Dry run** — Show what would happen before executing

---

## Success Criteria

A successful harvest leaves the workspace cleaner and knowledge better organized:

- [ ] Valuable knowledge extracted to permanent context?
- [ ] All extracted files <200 lines?
- [ ] Files in correct function folders?
- [ ] navigation.md updated?
- [ ] Summary files archived/deleted?
- [ ] Workspace cleaner than before?
- [ ] No knowledge lost?

---

## Related

- `compact.md` — Minimizing extracted content
- `mvi-principle.md` — What to extract
- `structure.md` — Where files go
- `creation.md` — File creation rules
