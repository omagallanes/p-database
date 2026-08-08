<!-- Context: standards/intelligence-mgmt | Priority: high | Version: 1.0 | Updated: 2025-01-12 -->

# Project Intelligence Management

> **What**: How to manage project intelligence files and folders.
> **When**: Use this guide when adding, updating, or removing intelligence files.
> **Related**: See `project-intelligence.md` for what and why.

## Quick Reference

| Action | Do This |
|--------|---------|
| Update existing file | Edit + bump frontmatter version |
| Add new file | Create `.md` + add to navigation.md |
| Add subfolder | Create folder + `navigation.md` + update parent nav |
| Remove file | Rename `.deprecated.md` + archive, don't delete |

---

## Update Existing Files

**When**: Business changes → Update `concepts/business-domain.md` | New decision → Add to `lookup/decisions-log.md` | New issues → Update `lookup/living-notes.md` | Feature launch → Update `concepts/business-tech-bridge.md` | Stack changes → Update `concepts/technical-domain.md`

**Process**:
1. Edit the file
2. Update frontmatter: `<!-- Context: {category} | Priority: {level} | Version: {X.Y} | Updated: {YYYY-MM-DD} -->`
3. Keep under 200 lines
4. Commit with message like: `docs: Update business-domain.md with new market focus`

---

## Add New Files

**When**: New domain area needs dedicated docs, existing file exceeds 200 lines, specialized context requires separation

**Naming**: Kebab-case (`user-research.md`, `api-docs.md`) — descriptive filenames

**Template**:
```html
<!-- Context: project-intelligence/{filename} | Priority: {high|medium} | Version: 1.0 | Updated: {YYYY-MM-DD} -->

# File Title
> One-line purpose statement

## Quick Reference
- **Purpose**: [What this covers]
- **Update When**: [Triggers]
- **Related Files**: [Links]

## Content
[Follow patterns from existing files]

## Related Files
- [File 1] - [Description]
```

**Process**: Create file in `project-intelligence/` → Add frontmatter with `project-intelligence/{filename}` → Follow existing patterns → Keep under 200 lines → Add to `navigation.md`

---

## Create Subfolders

**When**: 5+ related files need grouping, subdomain warrants separation (e.g., api/, mobile/), improves navigation clarity

**Structure**:
```
project-intelligence/
├── navigation.md           # Root nav
├── [new-subfolder]/
│   ├── navigation.md       # Subfolder nav REQUIRED
│   ├── file-1.md
│   └── file-2.md
```

**Process**:
1. Create folder with kebab-case name
2. Create `navigation.md` inside with file table
3. Add content files
4. Update root `navigation.md` with subfolder entry

**Rule**: Every subfolder MUST have `navigation.md`. Max nesting: 2 levels (e.g., `project-intelligence/domain/subdomain/`) to prevent context fragmentation.

---

## Remove/Deprecate Files

**When**: Content moved elsewhere, file no longer relevant, merged with another file

**Process**:
1. Rename: `filename.md` → `filename.deprecated.md`
2. Add deprecation frontmatter:
   ```html
   <!-- DEPRECATED: {YYYY-MM-DD} - {Reason} -->
   <!-- REPLACED BY: {new-file.md} -->
   ```
3. Add banner: `> ⚠️ **DEPRECATED**: See new-file.md for current info`
4. Mark deprecated in `navigation.md`

**Never Delete**: Decision history (archive instead), lessons learned (move to living-notes.md), context needed later

---

## Version Tracking

**Frontmatter**: `<!-- Context: {category} | Priority: {level} | Version: {MAJOR.MINOR} | Updated: {YYYY-MM-DD} -->`

| Change | Version |
|--------|---------|
| New file | 1.0 |
| Content addition/update | MINOR |
| Structure change | MAJOR |
| Typo fix | PATCH |

**Date**: Always `YYYY-MM-DD`

---

## Quality Standards

**Line Limits**: Files <200 lines | Sections 3-7 per file
**Required Elements**: Frontmatter (all fields), Quick Reference section, Related files section

**Anti-Patterns**: ❌ Mix concerns in one file | ❌ Exceed 200 lines | ❌ Delete files (archive instead) | ❌ Skip frontmatter | ❌ Duplicate information
✅ Keep focused and scannable | ✅ Archive deprecated content | ✅ Use frontmatter consistently | ✅ Link to related files

---

## Governance

**Ownership**:
| Area | Owner | Responsibility |
|------|-------|----------------|
| Business domain | Product Owner | Keep current, accurate |
| Technical domain | Tech Lead | Keep current, accurate |
| Decisions log | Tech Lead | Document decisions |
| Living notes | Team | Keep active items current |

**Review Cadence**: Quick review per PR | Full review quarterly | Archive review semi-annually

---

## Checklist

### Add New Intelligence File
- [ ] Follow naming convention (kebab-case)
- [ ] Add complete frontmatter
- [ ] Include Quick Reference section
- [ ] Keep under 200 lines
- [ ] Add to navigation.md
- [ ] Link from related files
- [ ] Version: 1.0

### Update Existing File
- [ ] Make targeted changes only
- [ ] Update version/date in frontmatter
- [ ] Verify still <200 lines
- [ ] Update navigation if needed
- [ ] Update related files

### Create Subfolder
- [ ] Verify warranted (5+ related files)
- [ ] Create folder with kebab-case name
- [ ] Create `navigation.md` inside
- [ ] Add subfolder to parent navigation
- [ ] Create content files

### Deprecate File
- [ ] Rename with `.deprecated.md`
- [ ] Add deprecation frontmatter
- [ ] Add deprecation banner
- [ ] Mark deprecated in navigation
- [ ] Document replacement

---

## Related Files

- **Standard**: `project-intelligence.md`
- **Project Intelligence**: `../../project-intelligence/navigation.md`
- **Context System**: `../context-system.md`