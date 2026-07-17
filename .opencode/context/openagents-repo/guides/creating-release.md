<!-- Context: openagents-repo/guides | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Guide: Creating a Release

**Purpose**: Step-by-step workflow for creating a new release

---

## Quick Steps

```bash
# 1. Update version
echo "0.X.Y" > VERSION
jq '.version = "0.X.Y"' package.json > tmp && mv tmp package.json

# 2. Update CHANGELOG (Edit CHANGELOG.md manually)

# 3. Commit and tag
git add VERSION package.json CHANGELOG.md
git commit -m "chore: bump version to 0.X.Y"
git tag -a v0.X.Y -m "Release v0.X.Y"

# 4. Push
git push origin main
git push origin v0.X.Y
```

---

## Step 1: Determine Version

### Semantic Versioning
```
MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes
```

Examples: `0.5.0 → 0.5.1` (bug fix) | `0.5.0 → 0.6.0` (new feature) | `0.5.0 → 1.0.0` (breaking)

---

## Step 2: Update Version Files

```bash
echo "0.X.Y" > VERSION
jq '.version = "0.X.Y"' package.json > tmp && mv tmp package.json

# Verify consistency
cat VERSION && cat package.json | jq '.version'
# Both should show same version
```

---

## Step 3: Update CHANGELOG

### Format

```markdown
# Changelog

## [0.X.Y] - 2025-12-10

### Added
- New feature 1
- New feature 2

### Changed
- Updated feature 1
- Improved feature 2

### Fixed
- Bug fix 1
- Bug fix 2

### Removed
- Deprecated feature 1
```

### Tips
✅ Group by type (Added, Changed, Fixed, Removed)
✅ User-focused - describe impact, not implementation
✅ Link PRs - reference PR numbers
✅ Clearly mark breaking changes

---

## Step 4: Commit Changes

```bash
git add VERSION package.json CHANGELOG.md
git commit -m "chore: bump version to 0.X.Y"
```

---

## Step 5: Create Git Tag

```bash
git tag -a v0.X.Y -m "Release v0.X.Y"
git tag -l "v0.X.Y"    # Verify
git show v0.X.Y         # Show details
```

---

## Step 6: Push to GitHub

```bash
git push origin main
git push origin v0.X.Y
```

---

## Step 7: Create GitHub Release

### Via GitHub CLI
```bash
gh release create v0.X.Y --title "v0.X.Y" --notes "$(cat CHANGELOG.md | sed -n '/## \[0.X.Y\]/,/## \[/p' | head -n -1)"
```

### Via GitHub UI
1. Repository → Releases → Create a new release
2. Select tag `v0.X.Y`, title `v0.X.Y`, description from CHANGELOG
3. Publish release

---

## Step 8: Verify Release

- ✅ Release appears on GitHub
- ✅ Tag is correct
- ✅ CHANGELOG is included
- ✅ Test installation: `./install.sh --list`

---

## Complete Example (v0.6.0)

```bash
echo "0.6.0" > VERSION
jq '.version = "0.6.0"' package.json > tmp && mv tmp package.json
# Update CHANGELOG.md
git add VERSION package.json CHANGELOG.md
git commit -m "chore: bump version to 0.6.0"
git tag -a v0.6.0 -m "Release v0.6.0"
git push origin main && git push origin v0.6.0
gh release create v0.6.0 --title "v0.6.0" --notes "See CHANGELOG.md for details"
```

---

## Checklist

Before releasing:
- [ ] All tests pass | [ ] Registry validates | [ ] VERSION updated
- [ ] package.json updated | [ ] CHANGELOG updated | [ ] Changes committed
- [ ] Tag created | [ ] Pushed to GitHub | [ ] GitHub release created
- [ ] Installation tested

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Version mismatch (VERSION ≠ package.json) | Update both to same version |
| Tag already exists | `git tag -d v0.X.Y && git push origin :refs/tags/v0.X.Y` |
| Push rejected (not up to date) | `git pull origin main && git push` |

---

## Related Files

- **Version management**: `scripts/versioning/bump-version.sh`
- **CHANGELOG**: `CHANGELOG.md`
- **VERSION**: `VERSION`

---

**Last Updated**: 2025-12-10  
**Version**: 0.5.0
