<!-- Context: openagents-repo/guides | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Guide: Subagent Invocation

**Purpose**: How to correctly invoke subagents using the task tool  
**Priority**: HIGH - Critical for agent delegation

---

## The Problem

**Issue**: Agents trying to invoke subagents with incorrect `subagent_type` format

**Error**: `Unknown agent type: ContextScout is not a valid agent type`

**Root Cause**: The `subagent_type` parameter must match the registered agent type in the OpenCode CLI, not the file path.

---

## Correct Subagent Invocation

### Available Subagent Types

Use these exact strings for `subagent_type`:

**Core**: `"Task Manager"` | `"Documentation"` | `"ContextScout"`
**Code**: `"Coder Agent"` | `"TestEngineer"` | `"Reviewer"` | `"Build Agent"`
**System Builder**: `"Domain Analyzer"` | `"Agent Generator"` | `"Context Organizer"` | `"Workflow Designer"` | `"Command Creator"`
**Utility**: `"Image Specialist"`

### ✅ Correct Format
```javascript
task(subagent_type="Task Manager", description="Break down feature", prompt="Detailed instructions...")
```

### ❌ Incorrect Formats
```javascript
task(subagent_type="TaskManager", ...)    // ❌ Missing space
task(subagent_type="task-manager", ...)   // ❌ kebab-case ID
task(subagent_type=".opencode/agent/...", ...)  // ❌ File path
```

---

## How to Find the Correct Type

### Method 1: Check Registry
```bash
# List all subagent names
cat registry.json | jq -r '.components.subagents[] | "\(.name)"'
```
**Output**: `Task Manager` | `Image Specialist` | `Reviewer` | `TestEngineer` | `Documentation Writer` | `Coder Agent` | `Build Agent` | `Domain Analyzer` | `Agent Generator` | `Context Organizer` | `Workflow Designer` | `Command Creator` | `ContextScout`

### Method 2: Check Agent Frontmatter
Look at the `name` field in the subagent's frontmatter:
```yaml
---
id: task-manager
name: Task Manager   # ← Use this for subagent_type
type: subagent
---
```

---

## Common Subagent Invocations

### Task Manager
```javascript
task(subagent_type="Task Manager", description="Break down complex feature",
     prompt="Break down the following feature into atomic subtasks:\n\nFeature: {feature description}\n\nRequirements:\n- {requirement 1}\n- {requirement 2}\n\nCreate subtask files in .tmp/tasks/{feature}/")
```

### TestEngineer
```javascript
task(subagent_type="TestEngineer", description="Write tests for feature",
     prompt="Write comprehensive tests for {feature}:\n\nFiles to test:\n- {file 1}\n- {file 2}\n\nCoverage:\n- Positive cases\n- Negative cases\n- Edge cases")
```

### Coder Agent
```javascript
task(subagent_type="Coder Agent", description="Implement subtask",
     prompt="Implement the following subtask:\n\nSubtask: {subtask description}\n\nFiles to create/modify:\n- {file 1}\n\nRequirements:\n- {requirement 1}\n- {requirement 2}")
```

### Documentation
```javascript
task(subagent_type="Documentation", description="Update documentation for feature",
     prompt="Update documentation for {feature}:\n\nWhat changed:\n- {change 1}\n- {change 2}\n\nFiles to update:\n- {doc 1}\n- {doc 2}")
```

### Reviewer
```javascript
task(subagent_type="Reviewer", description="Review implementation",
     prompt="Review the following implementation:\n\nFiles:\n- {file 1}\n- {file 2}\n\nFocus areas:\n- Security\n- Performance\n- Code quality")
```

---

## ContextScout Special Case

**Status**: ⚠️ May not be registered in OpenCode CLI yet

**Workaround**: Use direct file operations instead:
```javascript
// Use glob + grep + read directly
glob(pattern="**/*.md", path=".opencode/context")
grep(pattern="registry", path=".opencode/context")
read(filePath=".opencode/context/openagents-repo/core-concepts/registry.md")
```

---

## Fixing Existing Agents

### Agents That Need Fixing

1. **repo-manager.md** - Uses `ContextScout` (may need workaround)
2. **opencoder.md** - Check if uses incorrect format

### Fix Process

1. **Find**: `grep -r 'subagent_type="subagents/' .opencode/agent --include="*.md"`
2. **Replace**: Use registry `name` field (e.g., `"Task Manager"` not `"TaskManager"`)
3. **Test**: Run agent and verify delegation works

---

## Validation

### Check Subagent Type Before Using

Before using a subagent type, verify it's in the available types list:

```javascript
available_types = [
  "Task Manager", "Documentation",
  "TestEngineer", "Reviewer", "Coder Agent", "Build Agent",
  "Image Specialist",
  "Domain Analyzer", "Agent Generator", "Context Organizer",
  "Workflow Designer", "Command Creator"
]

if subagent_type not in available_types:
  error("Invalid subagent type: {subagent_type}")
```

### Verify Subagent Exists: `ls -la .opencode/agent/subagents/{category}/{name}.md && jq '.components.subagents[] | select(.name == "Subagent Name")' registry.json`

---

## Best Practices

✅ Use exact names matching registry `name` field
✅ Check registry first - verify subagent exists
✅ Test invocations before committing
✅ Document dependencies in agent frontmatter
❌ Never use file paths as subagent_type
❌ Never use kebab-case IDs
❌ Always verify subagent is registered

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| "Unknown agent type" | Wrong format or not registered | Check registry for correct name, use exact string |
| "Subagent not found" | File doesn't exist | Verify path, run validate-registry |
| Delegation fails silently | Subagent lacks tools/permissions | Check frontmatter tools + permissions |

---

## Related Files

- **Registry**: `registry.json`
- **Subagents**: `.opencode/agent/subagents/`
- **Validation**: `scripts/registry/validate-registry.sh`

---

**Last Updated**: 2025-12-29  
**Version**: 0.5.1
