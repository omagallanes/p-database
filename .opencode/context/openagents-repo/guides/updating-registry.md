<!-- Context: openagents-repo/guides | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Guide: Updating Registry

**Prerequisites**: Load `core-concepts/registry.md` first  
**Purpose**: How to update the component registry

---

## Quick Commands

```bash
./scripts/registry/auto-detect-components.sh --auto-add    # Auto-detect and add
./scripts/registry/validate-registry.sh                     # Validate
./scripts/registry/auto-detect-components.sh --dry-run      # See what would change
```

---

## When to Update

Add/change agent, command, tool, context file | Change component metadata | Move/rename components

---

## Auto-Detect (Recommended)

### Step 1: Dry Run
```bash
./scripts/registry/auto-detect-components.sh --dry-run
```
Shows what would be added/updated before applying changes.

### Step 2: Apply
```bash
./scripts/registry/auto-detect-components.sh --auto-add
```

### Step 3: Validate
```bash
./scripts/registry/validate-registry.sh
```

---

## Frontmatter Metadata (Auto-Extracted)

The auto-detect script extracts `tags` and `dependencies` from component frontmatter.

### Supported Formats

**Multi-line** (recommended):
```yaml
---
tags: [tag1, tag2]
dependencies: [subagent:coder-agent, context:core/standards/code]
---
```

### Component-Specific Examples

**Command** (`.opencode/command/your-command.md`):
```yaml
---
description: "Brief description"
tags: [category, feature]
dependencies: [subagent:context-organizer, subagent:contextscout]
---
```

**Subagent** (`.opencode/agent/subagents/{category}/{name}.md`):
```yaml
---
id: your-agent
name: Your Agent Name
description: "What this agent does"
tags: [domain, capability]
dependencies: [subagent:coder-agent, context:core/standards/code]
---
```

**Context** (`.opencode/context/{category}/{name}.md`):
```yaml
---
description: "What knowledge this context provides"
tags: [domain, topic]
---
```

### Dependency Format

`type:id` - Valid types: `subagent:`, `command:`, `context:`, `agent:`

Examples:
```yaml
dependencies:
  - subagent:coder-agent          # Depends on coder-agent subagent
  - context:core/standards/code   # Requires code standards context
  - command:context               # Uses context command
```

**Workflow**: Create component with frontmatter → `--dry-run` → `--auto-add` → validate

---

## Manual Updates (Not Recommended)

Only if auto-detect doesn't work. Prefer frontmatter for tags/dependencies.

---

## Validation

**Validates**: Schema | Paths (exist) | IDs (unique) | Categories (valid) | Dependencies (exist)
**Errors**: Path not found | Duplicate ID | Invalid category | Missing dependency

---

## Testing Registry Changes

```bash
REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh --list
REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh --component agent:your-agent
```

---

## Common Tasks

**Add**: Create component → `--auto-add` → validate
**Update**: Edit frontmatter → `--auto-add` → validate
**Remove**: Delete file → `--auto-add` → validate

---

## CI/CD Integration

Registry validated on PRs, merges, releases. Can auto-update after merge.

---

## Best Practices

✅ Use frontmatter (not registry) for tags/dependencies
✅ Use auto-detect (not manual edits)
✅ Validate often | Test locally | Dry run first
✅ Multi-line arrays (more readable)
✅ Meaningful tags | Declare all dependencies

---

## Troubleshooting

### Tags/Dependencies Not Extracted

1. Check frontmatter format (must start/end with `---`, valid YAML)
2. Verify array format: `tags: [tag1, tag2]` or multi-line with `-`
3. Check dependency format: `type:id` (e.g., `subagent:coder-agent`)
4. Run dry-run to debug

### Dependency Validation Errors
```bash
jq '.components.subagents[] | select(.id == "coder-agent")' registry.json
```

### Context Not Found (Aliases)
Add alias to component in registry.json:
```json
{ "id": "session-management", "aliases": ["workflows-sessions", "sessions"] }
```
Then validate: `./scripts/registry/validate-registry.sh`

---

## Related Files

- **Registry concepts**: `core-concepts/registry.md`
- **Adding agents**: `guides/adding-agent.md`
- **Debugging**: `guides/debugging.md`

---

**Last Updated**: 2025-01-06  
**Version**: 2.0.0
