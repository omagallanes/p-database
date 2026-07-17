<!-- Context: core/workflows | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Context Operation Workflows

**Purpose**: Detailed interactive workflows for all context operations

**Last Updated**: 2026-01-06

---

## Extract Workflow

**Command**: `/context extract from {source}`

### Stage 1-2: Read & Analyze
Agent reads source, categorizes content: decisions→`concepts/`, code→`examples/`, steps→`guides/`, reference→`lookup/`, errors→`errors/`. Output: extractable items with letter IDs.

### Stage 3: Select Category (APPROVAL REQUIRED)
```
Found 12 items from {source}:
Concepts (8): [A] useState [B] useEffect [C] useContext...
Errors (4): [I] Hooks conditionally [J] Hooks in loops...
Guides (3): [U] Custom hooks [V] Debugging [W] Testing

Category: [1] development/ [2] core/ [3] Create new: ___
Select items (A B I or 'all') + category:
```

### Stage 4: Preview (APPROVAL REQUIRED)
```
Would create: concepts/use-state.md (45l), concepts/use-effect.md (52l)...
              guides/custom-hooks.md (87l), guides/debugging-hooks.md (65l)
              errors/react-hooks-errors.md (124l, +4 errors)
⚠️ CONFLICT: concepts/use-memo.md exists (42l)
  [A] Skip [B] Overwrite [C] Merge (42→58l)
Total: 12 files, ~650 lines | Approve? (yes/no/preview):
```
Preview actions: 'all' shows first 10 lines of each file; filename shows full content.

### Stage 5-7: Create → Update Nav → Report
```
✅ Extracted 20 items into development/
📄 Created 15 files | 📊 Updated navigation.md
```

---

## Organize Workflow

**Command**: `/context organize {category}/`

### Stage 1-2: Scan & Categorize
Scan flat files, categorize by function. Flag ambiguous files (multi-category content).

### Stage 3: Resolve Conflicts (APPROVAL REQUIRED)
```
Organizing {category}/ (23 files, flat)
Clear (18): concepts/ (auth.md, state-management.md...) examples/ (jwt-example.md...)

Ambiguous (5):
  [?] api-design.md (concepts + steps) → [A] Split [B] Keep concept [C] Keep guide
  [?] error-handling.md (guide + errors) → [D] Split [E] Keep guide [F] Keep errors
  [?] testing-patterns.md (concepts + examples) → [G] Split [H] Concepts [I] Examples

Conflicts (2):
  [!] authentication.md → concepts/auth.md (exists, 120l) [J] Merge [K] -v2 [L] Skip
  [!] jwt-example.md → examples/jwt.md (exists, 65l) [M] Merge [N] -v2 [O] Skip

Select (A D J or 'auto'):
```

### Stage 4: Preview (APPROVAL REQUIRED)
```
CREATE: concepts/, examples/, guides/, lookup/, errors/
MOVE: 18 files | SPLIT: 3 files | MERGE: 2 files
UPDATE: navigation.md, fix 47 references
Dry-run? (yes/no/show-diff):
```

### Stage 5-8: Backup → Execute → Update → Report
```
💾 Backup: .tmp/backup/organize-{category}-{timestamp}/
✅ 23 files organized | 5 folders | 3 split | 47 refs fixed
```

---

## Update Workflow

**Command**: `/context update for {topic}`

### Stage 1: Identify Changes (APPROVAL REQUIRED)
```
What changed? [A] API [B] Deprecations [C] New features [D] Breaking [E] Other
```
Follow-up collects specific details (e.g., "App router now default", "New Metadata API").

### Stage 2: Find Affected Files
```
Found 5 files referencing Next.js 15:
📄 concepts/routing.md (3 refs) | examples/app-router-example.md (7 refs)
📄 guides/setup-nextjs.md (2 refs) | errors/nextjs-errors.md (1 ref) | lookup/nextjs-commands.md (4 refs)
```

### Stage 3: Preview Changes (APPROVAL REQUIRED)
```
━━━ concepts/routing.md ━━━
Line 15: - App router optional + App router now default in v15
Line 42: + ## Metadata API (New) → replaces Head component

━━━ examples/app-router-example.md ━━━
Line 8: - // Optional + // Default in Next.js 15+

Approve? (yes/no/edit):   Edit mode: line-by-line approval
```

### Stage 4-8: Backup → Update → Migration Notes → Validate → Report
```
💾 Backup: .tmp/backup/update-{topic}-{timestamp}/
✅ 5 files updated, 17 refs modified
🔄 Migration notes added to errors/{topic}-errors.md
🔗 All refs valid | All files <200l ✓
```

---

## Error Workflow

**Command**: `/context error for "{message}"`

### Stage 1: Search Existing
Search across all `errors/` files. Find similar (fuzzy) and related (same category) errors.

### Stage 2: Check Duplication (APPROVAL REQUIRED)
```
[A] Add as new to {framework}-errors.md  [B] Update existing error  [C] Skip
Category: [1] React [2] JS [3] General [4] Create new
Select (e.g., 'B 1'):
```

### Stage 3: Preview (APPROVAL REQUIRED)
Shows current entry vs proposed update with line diff, size before→after. `← NEW` / `← UPDATED` markers. Approve? (yes/no/edit).

### Stage 4-6: Add/Update → Cross-reference → Report
```
✅ Updated in {category}/errors/{file}.md
🔗 Cross-referenced with 2 related | 📊 File: 105l (under 150l ✓)
```

---

## Deduplication & Grouping

| Type | Definition | Action |
|------|-----------|--------|
| **Similar** | Same root cause, diff manifestations | Update existing |
| **Related** | Diff causes, same category | Cross-reference |
| **Duplicate** | Exact same error | Skip |
| **New** | Unique error | Add as new entry |

**Group errors** by framework/topic: `react-errors.md`, `nextjs-errors.md`, `auth-errors.md`. Not one file per error.

---

## Common Patterns

### Approval Gates (ALL operations)
1. Show clear preview | 2. Wait for user input | 3. Options (yes/no/edit/preview/dry-run) | 4. Never proceed without confirmation

### Conflict Resolution: Letter-based (A/B/C), show impact, user chooses.

### Previews: What's created/modified/deleted + file sizes (before→after) + diffs + validation.

### Backups: `.tmp/backup/{operation}-{topic}-{timestamp}/`. Report location. Keep for rollback.

---

## Related

- `context.md` — Main command interface
- `harvest.md` — Harvest details | `mvi-principle.md` — What to extract
- `compact.md` — How to minimize | `error.md` — Error details
