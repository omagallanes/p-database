<!-- Context: openagents-repo/registry | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Core Concept: Registry System

**Purpose**: Understanding how component tracking and distribution works  
**Priority**: CRITICAL - Load this before working with registry

---

## What Is the Registry?

Centralized catalog (`registry.json`) tracking all components: Agents, Subagents, Commands, Tools, Contexts. **Location**: `registry.json` (root)

### Top-Level Structure

```json
{
  "version": "0.5.0", "schema_version": "2.0.0",
  "components": { "agents": [...], "subagents": [...], "commands": [...], "tools": [...], "contexts": [...] },
  "profiles": { "essential": {...}, "developer": {...}, "business": {...} }
}
```

### Component Entry Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (kebab-case) |
| `name` | Yes | Display name |
| `type` | Yes | agent, subagent, command, tool, context |
| `path` | Yes | File path relative to repo root |
| `description` | Yes | Brief description |
| `category` | For agents | Category name |
| `tags` | No | Discovery tags |
| `dependencies` | No | Component dependencies |
| `version` | Yes | Version when added/updated |

---

## Auto-Detect System

Scans `.opencode/` and automatically updates the registry. **Flow**: Scan → Find .md files with frontmatter → Extract metadata → Validate paths → Generate entries → Update registry.json

```bash
./scripts/registry/auto-detect-components.sh --dry-run    # See what would change
./scripts/registry/auto-detect-components.sh --auto-add    # Add new components
./scripts/registry/auto-detect-components.sh --auto-add --force  # Force update
```

**Detects**: Agents (`.opencode/agent/{category}/*.md`), Subagents (`**/*.md`), Commands (`.opencode/command/`), Tools (`.opencode/tool/`), Contexts (`.opencode/context/`)

### Frontmatter Requirements

```yaml
---
description: "Brief description"
category: "category-name"
type: "agent"  # Or subagent, command, tool, context
tags: ["tag1", "tag2"]
---
```

---

## Validation

```bash
./scripts/registry/validate-registry.sh        # Basic validation
./scripts/registry/validate-registry.sh -v     # Verbose
```

**Validates**: Schema (JSON structure) | Paths (all exist) | IDs (unique) | Categories (valid) | Dependencies (exist) | Versions (consistency)

### Common Errors
```
ERROR: Path does not exist: .opencode/agent/core/missing.md
ERROR: Duplicate ID: frontend-specialist
ERROR: Invalid category: invalid-category
ERROR: Missing dependency: subagent:nonexistent
```

---

## Agents vs Subagents

**Main Agents** (2 in Developer): openagent (coordination), opencoder (coding)
**Specialist Subagents** (8): frontend-specialist, devops-specialist, task-manager, documentation, coder-agent, reviewer, tester, build-agent, image-specialist
**Commands** (7): analyze-patterns, commit, test, context, clean, optimize, validate-repo

---

## Component Profiles

| Profile | Purpose | Includes |
|---------|---------|----------|
| **essential** | Minimal setup | Core agents + essential commands + core context |
| **developer** | Full dev | All core + dev specialists + all subagents + dev commands/context |
| **business** | Content/product | Core + content/data specialists + content context |

Profile example:
```json
"developer": {
  "description": "Full development setup",
  "components": ["agent:*", "subagent:*", "command:*", "context:core/*", "context:development/*"]
}
```

---

## Install System

### Flow
User runs install.sh → Check for local registry.json → If not local, fetch from GitHub → Parse registry → Show component selection UI → Resolve dependencies → Download components → Install → Handle collisions

### Local Registry (Development)
```bash
REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh --list
REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh developer
```

### Remote Registry (Production)
```bash
./install.sh developer
./install.sh --list
```

---

## Dependency Resolution

Format: `type:id` (e.g., `subagent:tester`, `context:core/standards/code`)

**Rules**: Parse → Find in registry → Check installed → Add to queue → Recursively resolve → Install in dependency order

```
frontend-specialist → depends on subagent:tester → depends on context:core/standards/tests
Install order: 1. context 2. subagent 3. frontend-specialist
```

---

## Collision Handling

**Strategies**: Skip (keep existing) | Overwrite (replace) | Backup (backup + install new)

```bash
./install.sh developer --skip-existing   # Skip all collisions
./install.sh developer --force           # Overwrite all
./install.sh developer --backup          # Backup all
```

---

## Version Management

```bash
echo "0.X.Y" > VERSION
jq '.version = "0.X.Y"' package.json > tmp && mv tmp package.json
jq '.version = "0.X.Y"' registry.json > tmp && mv tmp registry.json
```

---

## CI/CD Integration

Validate on PRs (`validate-registry.yml`), auto-update on merge (`update-registry.yml`), version bump on release (`version-bump.yml`).

---

## Best Practices

✅ Add frontmatter - required for auto-detect
✅ Run auto-detect - don't manually edit registry
✅ Validate after changes
✅ Test with local registry
✅ Explicit dependencies - list all
✅ Version consistency across VERSION, package.json, registry.json

---

## Related Files

- **Updating registry**: `guides/updating-registry.md`
- **Adding agents**: `guides/adding-agent.md`
- **Categories**: `core-concepts/categories.md`

---

**Last Updated**: 2025-01-28  
**Version**: 0.5.2
