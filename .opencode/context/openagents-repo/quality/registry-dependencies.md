---
description: Maintain registry quality through dependency validation and consistency checks
tags: [registry, quality, validation, dependencies]
dependencies: []
---

<!-- Context: quality/registry-dependencies | Priority: high | Version: 1.0 | Updated: 2026-01-06 -->
# Registry Dependency Validation

**Purpose**: Maintain registry quality through dependency validation and consistency checks  
**Audience**: Contributors, maintainers, CI/CD processes

---

## Quick Reference

**Golden Rule**: All component dependencies must be declared in frontmatter and validated before commits.

**Critical Commands**:
```bash
/check-context-deps                                     # Check context deps
/check-context-deps --fix                                # Auto-fix missing deps
./scripts/registry/validate-registry.sh                  # Validate registry
./scripts/registry/auto-detect-components.sh --auto-add  # Update registry
```

---

## Dependency System

### Dependency Types

| Type | Format | Example | Description |
|------|--------|---------|-------------|
| agent | `agent:id` | `agent:opencoder` | Core agent profile |
| subagent | `subagent:id` | `subagent:coder-agent` | Delegatable subagent |
| command | `command:id` | `command:context` | Slash command |
| tool | `tool:id` | `tool:gemini` | External tool |
| plugin | `plugin:id` | `plugin:context` | Plugin component |
| context | `context:path` | `context:core/standards/code` | Context file |
| config | `config:id` | `config:defaults` | Configuration |

### Declaring Dependencies

In component frontmatter:
```yaml
id: opencoder
dependencies:
  - subagent:task-manager       # Can delegate to task-manager
  - subagent:coder-agent         # Can delegate to coder-agent
  - context:core/standards/code  # Requires code standards context
```

### Why Declare?
✅ **Validation**: Catch missing components before runtime
✅ **Documentation**: Clear visibility of component needs
✅ **Installation**: Installers fetch all required dependencies
✅ **Dependency graphs**: Visualize relationships
✅ **Breaking change detection**: Know what's affected

---

## Context File Dependencies

### The Problem
Agents reference context files in prompts but often don't declare them as dependencies. Without declaration: no validation that context file exists, can't track usage, breaking changes when files move, installers don't fetch them.

### The Solution
Declare context dependencies in frontmatter:
```yaml
dependencies:
  - context:core/standards/code   # Required context
```

Use `/check-context-deps` to find missing declarations:
```bash
/check-context-deps        # Analyze all agents
/check-context-deps --fix  # Auto-add missing deps
```

### Context Dependency Format
```
File:  .opencode/context/core/standards/code-quality.md
Dep:   context:core/standards/code  (no .opencode/, no .md)
```

Examples:
```yaml
dependencies:
  - context:core/standards/code       # code-quality.md
  - context:core/standards/docs       # documentation.md
  - context:core/workflows/delegation # task-delegation-basics.md
```

---

## Validation Workflow

### Pre-Commit Checklist
1. `/check-context-deps` - find missing deps
2. `/check-context-deps --fix` - auto-add missing
3. `./scripts/registry/auto-detect-components.sh --auto-add` - update registry
4. `./scripts/registry/validate-registry.sh` - validate

### Validation Tools

**`/check-context-deps`**: Checks context files referenced, deps declared, files exist, registry entries, unused files.
**`auto-detect-components.sh`**: Scans for new components, validates deps during scanning.
**`validate-registry.sh`**: Validates paths exist, deps exist, unique IDs, valid JSON, required fields.

---

## Quality Standards

A high-quality registry has:
✅ Complete dependencies declared
✅ Validated - all deps exist in registry
✅ No orphans - all context files used by at least one component
✅ Consistent format (`type:id`)
✅ No broken paths
✅ Up-to-date with current component state

### DO
✅ Declare all subagents you delegate to
✅ Declare all context files you reference
✅ Declare all commands you invoke
✅ Use correct format: `type:id`
✅ Keep deps in frontmatter (not hardcoded in prompts)

### DON'T
❌ Reference context files without declaring dependency
❌ Use invalid dependency formats
❌ Declare deps you don't actually use
❌ Forget to update registry after adding deps

---

## Commit Guidelines

**Adding**: Add frontmatter → `/check-context-deps agent` → `--auto-add` → validate → `git commit -m "Add agent with deps"`
**Modifying context**: Check dependents with `jq` → update → validate → `git commit -m "Update context - affects X, Y, Z"`
**Deleting**: Check dependents → remove from frontmatter → delete file → update registry → validate

---

## Troubleshooting

### Missing Context Dependencies
`/check-context-deps reports: opencoder: missing context:core/standards/code`
**Fix**: `/check-context-deps --fix` or manually add to frontmatter

### Dependency Not Found in Registry
**Causes**: File doesn't exist | File not in registry | Wrong format
**Fix**: `ls -la .opencode/context/core/standards/code-quality.md` → If exists, add to registry. If not, create or remove dep.

### Unused Context Files
**Fix**: Add to an agent that should use it, or remove if truly unused.

### Circular Dependencies
**Fix**: Refactor to remove cycle. Extract shared logic to a third component.

---

## CI/CD: Pre-commit hook (`/check-context-deps && validate-registry.sh`) and GitHub Actions on push/PR

---

## Best Practices

**Authors**: Declare deps in frontmatter | Use `/check-context-deps` before commit | Update registry | Validate before push
**Maintainers**: Review deps in PRs | Run validation in CI | Monitor unused context files | Refactor complex dep graphs
**CI/CD**: Fail builds on validation errors | Report missing deps | Track changes over time | Enforce standards

---

## Related: `guides/updating-registry.md` | `core-concepts/registry.md` | `guides/adding-agent-basics.md`

---

## Summary

**Key Takeaways**: Declare all deps in frontmatter | Use `/check-context-deps` | Validate before commits | Keep registry in sync | Format: `type:id`

**Quality Checklist**: [ ] All context deps declared | [ ] All deps exist in registry | [ ] No unused context files | [ ] Registry validates | [ ] Consistent format

**Remember**: Dependencies are documentation. They help users understand what components need and help validate integrity.
