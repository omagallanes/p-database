<!-- Context: core/update | Priority: medium | Version: 1.0 | Updated: 2026-02-15 -->

# Update Operation

**Purpose**: Update context when APIs, frameworks, or contracts change

**Last Updated**: 2026-01-06

---

## When to Use

- Framework version updates (Next.js 14 → 15)
- API changes (breaking changes, deprecations)
- New features added to existing topics
- Migration guides needed for users

---

## 8-Stage Workflow

### Stage 1: Identify Changes (APPROVAL REQUIRED)
User describes what changed using categorical selection:

```
What changed in {topic}?  Select all that apply:
[A] API changes   [B] Deprecations   [C] New features
[D] Breaking changes   [E] Other (describe)
```

Follow-up collects specific details per type:
- API changes: "App router is now default in Next.js 15"
- New features: "New Metadata API, Server Actions stable"
- Breaking changes: "Pages router requires explicit opt-in"

**Validation**: MUST get user input before proceeding. If the user selects multiple change types, collect details for each one before moving to Stage 2.

---

### Stage 2: Find Affected Files
Search for topic references across all context. Count references per file. Show impact analysis.

```
Found 5 files with 17 references:
📄 concepts/routing.md (3 refs, 145 lines)
📄 examples/app-router-example.md (7 refs, 78 lines)
📄 guides/setting-up-nextjs.md (2 refs, 132 lines)
📄 errors/nextjs-errors.md (1 ref, 98 lines)
📄 lookup/nextjs-commands.md (4 refs, 54 lines)
```

---

### Stage 3: Preview Changes (APPROVAL REQUIRED)
Line-by-line diff for each affected file:

```
━━━ concepts/routing.md ━━━
Line 15: - App router optional + App router now default in Next.js 15
Line 42: + ## Metadata API (New in v15) → Replaces Head component
Line 87: - Reference: docs/app + Reference: docs/15/app

━━━ examples/app-router-example.md ━━━
Line 8:  - // Optional + // Default in Next.js 15+
Line 23: + export const metadata = { title: 'My App' }

━━━ guides/setting-up-nextjs.md ━━━
Line 45: - 3. Choose router + 3. App router default (--pages flag)

━━━ errors/nextjs-errors.md ━━━
Line 67: + ## Migration: Next.js 14→15
         + Breaking: App router default, Pages router opt-in
         + Steps: 1. npm update 2. pages:true 3. metadata exports

━━━ lookup/nextjs-commands.md ━━━
Line 12: + npx create-next-app --pages (pages router opt-in)

Approve changes? (yes/no/edit):
```

**Edit mode**: Line-by-line approval. `- old + new`, user approves/rejects/modifies each.

**Validation**: MUST get approval before proceeding.

---

### Stage 4: Backup
Create backup before updating. **Location**: `.tmp/backup/update-{topic}-{timestamp}/`. Enables rollback.

### Stage 5: Update Files
Apply approved changes. Maintain MVI format (<200 lines). Update "Last Updated" dates. Preserve file structure.

**Enforcement**: `@critical_rules.mvi_strict`

### Stage 6: Add Migration Notes
Add migration guide to `errors/{topic}-errors.md`:

```markdown
## Migration: {Old} → {New}
**Breaking Changes**: - Change 1  - Change 2
**Migration Steps**: 1. Step 1  2. Step 2
**Reference**: [Link to changelog]
```

### Stage 7: Validate
Systematic checks: verify all internal references still point to valid files, confirm no broken links were introduced by the updates, ensure all modified files remain under 200 lines, validate MVI format is maintained (core idea, key points, example, reference), and check that "Last Updated" dates reflect the current update.

### Stage 8: Report
```
✅ Updated 5 files | 📝 Modified 17 references
🔄 Added migration notes to errors/nextjs-errors.md
💾 Backup: .tmp/backup/update-nextjs-2026-01-06/
Summary: routing.md 3 updates (145→162l), examples 4 updates (78→89l)
         guides 1 update, errors migration (98→125l), lookup 2 updates
All files under 200 limit ✓ | Rollback available
```

---

## Impact Assessment

Before running update, assess how many files and references will be affected. A typical version update touches 3-8 files with 10-30 references. Migration notes should be added for any breaking changes.

---

## Rollback

If the update causes issues, restore from backup:
```bash
cp -r .tmp/backup/update-{topic}-{timestamp}/* .opencode/context/
```
This restores all files to their pre-update state.

## Change Types

| Type | Description | Examples |
|------|-------------|----------|
| **API Changes** | Method signatures, parameters, return types changed | `getServerSideProps` → `generateStaticParams` |
| **Deprecations** | Features marked deprecated, replacements available | `next/head` → metadata API exports |
| **New Features** | New capabilities, APIs, patterns introduced | Server Actions, Partial Prerendering |
| **Breaking Changes** | Incompatible changes requiring migration, old code breaks | Pages router opt-in required |

---

## Usage Examples

```bash
/context update for Next.js 15        # Framework version update
/context update for Stripe API v2024  # API changes
/context update for Tailwind CSS v4   # Library update
/context update for React 19          # Version update
```

---

## Success Criteria

- [ ] User described all changes?
- [ ] All affected files found?
- [ ] Diff preview shown and approved?
- [ ] Backup created?
- [ ] Migration notes added?
- [ ] All references validated?
- [ ] All files still <200 lines?

---

## Partial Updates

If only specific files need updating (not all affected), use line-by-line edit mode to approve changes selectively. The system tracks which changes were approved, rejected, or modified for the final report. This audit trail helps verify what was actually changed.

---

## Prioritization

When multiple updates are pending, prioritize: breaking changes first, then API changes, then deprecations, then new features. This ensures context stays accurate and users aren't following outdated patterns.

## Related

- `guides/workflows.md` — Interactive diff examples
- `standards/mvi.md` — Maintain MVI format
- `operations/error.md` — Adding migration notes
