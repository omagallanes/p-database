<!-- Context: openagents-repo/core-concepts/agent-metadata | Priority: critical | Version: 1.0 | Updated: 2026-01-31 -->
# Core Concept: Agent Metadata System

**Purpose**: Understanding the centralized metadata system for OpenAgents Control  
**Priority**: CRITICAL - Load this before working with agent metadata

---

## What Is It?

Separates **OpenCode-compliant agent configuration** from **OpenAgents Control registry metadata**. Agent frontmatter contains ONLY valid OpenCode fields. All other metadata lives in a centralized file.

**Before** (validation errors):
```yaml
id: opencoder  name: OpenCoder  category: core  version: 1.0.0  tags: [development]  dependencies: []
```
→ `Extra inputs are not permitted, field: 'id'`

**After** (clean separation):
- Agent frontmatter: ONLY `description`, `mode`, `temperature`, `tools`, `permission`
- `.opencode/config/agent-metadata.json`: `id`, `name`, `category`, `type`, `version`, `author`, `tags`, `dependencies`

---

## Valid OpenCode Fields

**Required**: `description` (when to use), `mode` (primary|subagent|all)

**Optional**: `model`, `temperature` (0.0-1.0), `maxSteps`, `disable`, `prompt` (file path), `hidden`, `tools`, `permission` (v1.1.1+, singular; replaces deprecated `permissions`)

### Example
```yaml
---
description: "Code review agent with security focus"
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools: { read: true, grep: true, glob: true, write: false, edit: false }
permission: { bash: { "*": ask, "git *": allow }, edit: deny }
---
```

---

## Centralized Metadata File

**Location**: `.opencode/config/agent-metadata.json`

```json
{
  "$schema": "https://opencode.ai/schemas/agent-metadata.json",
  "schema_version": "1.0.0",
  "agents": {
    "agent-id": {
      "id": "agent-id", "name": "Agent Name",
      "category": "core|development|content|data|product|learning|meta",
      "type": "agent|subagent", "version": "1.0.0", "author": "opencode",
      "tags": ["tag1"], "dependencies": ["subagent:subagent-id", "context:path/to/context"]
    }
  },
  "defaults": {
    "agent": { "version": "1.0.0", "author": "opencode", "type": "agent", "tags": [] },
    "subagent": { "version": "1.0.0", "author": "opencode", "type": "subagent", "tags": [] }
  }
}
```

### Metadata Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `id` | Yes | Unique identifier (kebab-case) | `"opencoder"` |
| `name` | Yes | Display name | `"OpenCoder"` |
| `category` | Yes | Agent category | `"core"` |
| `type` | Yes | Component type | `"agent"` or `"subagent"` |
| `version` | Yes | Version number | `"1.0.0"` |
| `author` | Yes | Author identifier | `"opencode"` |
| `tags` | No | Discovery tags | `["development"]` |
| `dependencies` | No | Component dependencies | `["subagent:tester"]` |

---

## How It Works

### 1. Agent Creation
**Step 1**: Create agent file with ONLY valid OpenCode fields:
```bash
touch .opencode/agent/category/my-agent.md
```
```yaml
---
description: "My agent description"  mode: subagent  temperature: 0.2
tools: { read: true, write: true }
---
```
**Step 2**: Add metadata to `agent-metadata.json`:
```json
{ "agents": { "my-agent": { "id": "my-agent", "name": "My Agent", "category": "development", "type": "subagent", "version": "1.0.0", "author": "opencode", "tags": [], "dependencies": ["context:core/standards/code"] } } }
```
**Step 3**: Run `./scripts/registry/auto-detect-components.sh --auto-add`

The auto-detect script reads frontmatter, looks up metadata in `agent-metadata.json`, merges both into registry.json.

---

## Workflow

### Adding a New Agent
```bash
# 1. Create agent file (OpenCode-compliant frontmatter only)
vim .opencode/agent/category/my-agent.md
# 2. Add metadata entry
vim .opencode/config/agent-metadata.json
# 3. Update registry: ./scripts/registry/auto-detect-components.sh --auto-add
# 4. Validate: ./scripts/registry/validate-registry.sh
```

### Updating
- **OpenCode config** (tools, permissions, temperature): Edit agent file frontmatter
- **Registry metadata** (tags, dependencies, version): Edit metadata file, re-run auto-detect

---

## Benefits

✅ **OpenCode Compliance** - No validation errors from OpenCode  
✅ **Registry Compatible** - Auto-detect merges frontmatter + metadata  
✅ **Single Source of Truth** - Metadata centralized in one file  
✅ **Maintainable** - Update dependencies in one place  

---

## Migration Guide

### permissions → permission (v1.1.1+)
**Before**: `permissions: bash: "*": "deny"`  
**After**: `permission: bash: "*": "deny"`  
Find agents: `grep -r "^permissions:" .opencode/agent/`

### Migrating Existing Agents
1. Find agents with invalid fields: `grep -r "^id:\|^name:\|^category:" .opencode/agent/`
2. Copy `id`, `name`, `category`, `type`, `version`, `author`, `tags`, `dependencies` to metadata file
3. Remove these fields from agent frontmatter
4. Remove old registry entries, re-run auto-detect, validate

---

## Best Practices

**Agent Frontmatter**: ✅ Minimal (only OpenCode fields) | ✅ Comment pointing to metadata file  
❌ No custom fields | ❌ No duplicate metadata

**Metadata File**: ✅ Version control | ✅ Consistent kebab-case IDs | ❌ No orphaned entries

**Dependencies**: ✅ Declare ALL | ✅ Format `type:id` | ❌ Invalid formats

---

## Troubleshooting

### OpenCode Validation Errors
`Extra inputs are not permitted, field: 'id'` → Remove from frontmatter, add to metadata

### Missing Metadata
Auto-detect can't find metadata → Add entry to `agent-metadata.json`

### Registry Out of Sync
```bash
jq 'del(.components.agents[] | select(.id == "agent-id"))' registry.json > tmp && mv tmp registry.json
./scripts/registry/auto-detect-components.sh --auto-add
```

---

## Related Files

- **Registry System**: `core-concepts/registry.md`
- **Adding Agents**: `guides/adding-agent-basics.md`
- **Dependencies**: `quality/registry-dependencies.md`

---

**Last Updated**: 2026-01-31  
**Version**: 1.0.0
