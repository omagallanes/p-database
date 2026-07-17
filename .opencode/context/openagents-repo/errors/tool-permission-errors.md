<!-- Context: openagents-repo/errors | Priority: medium | Version: 1.0 | Updated: 2026-02-15 -->

# Tool Permission Errors

**Purpose**: Diagnose and fix tool permission issues in agents  
**Last Updated**: 2026-01-07

---

## Error: Tool Permission Denied

### Symptom

```json
{ "type": "missing-approval", "severity": "error", "message": "Execution tool 'bash' called without requesting approval" }
```

Or agent tries to use a tool but gets blocked silently (0 tool calls).

### Cause

Agent has tool **disabled** or **denied** in frontmatter:

```yaml
tools:
  bash: false    # Tool disabled

permission:
  bash:
    "*": "deny"  # Explicitly denied
```

Framework enforces this - agent can't use bash even if prompt says to. NOT an approval issue—it's a permission restriction.

### Solution

**Option 1: Emphasize Tool Restrictions in Prompt** (Recommended)

Add critical rules section at top of agent prompt (first 15%):

```xml
<critical_rules priority="absolute" enforcement="strict">
  <rule id="tool_usage">
    ONLY use: glob, read, grep, list
    NEVER use: bash, write, edit, task
    Read-only—no modifications allowed
  </rule>
  <rule id="always_use_tools">
    ALWAYS use tools to discover files
    NEVER assume or fabricate file paths
  </rule>
</critical_rules>
```

**Why this works**: Makes tool restrictions crystal clear early in the prompt.

**Option 2: Enable Tool** (If agent needs it)

```yaml
tools:
  bash: true   # Enable if agent legitimately needs bash
```

**Warning**: Only enable if agent truly needs it. Read-only subagents should NOT have bash/write/edit.

### Prevention

**For Read-Only Subagents**:

```yaml
tools: { read: true, grep: true, glob: true, list: true, bash: false, edit: false, write: false, task: false }
permission: { bash: { "*": "deny" }, edit: { "**/*": "deny" }, write: { "**/*": "deny" } }
```

**For Primary Agents**:

```yaml
tools: { read: true, grep: true, glob: true, list: true, bash: true, edit: true, write: true, task: true }
```

---

## Error: Subagent Approval Gate Violation

### Symptom

```json
{ "type": "missing-approval", "message": "Execution tool 'bash' called without requesting approval" }
```

In a **subagent** test.

### Cause

**Subagents should NOT have approval gates** - they're delegated to by primary agents who already got approval. The issue is: subagent trying to use restricted tool (bash/write/edit), or test expecting approval behavior (wrong for subagents).

### Solution

**Fix 1: Remove Tool Usage** - Subagents shouldn't use execution tools. Update prompt to emphasize read-only nature.

**Fix 2: Update Test Configuration** - Subagent tests should use auto-approve:

```yaml
approvalStrategy:
  type: auto-approve   # No approval gates for subagents
```

**Fix 3: Check Tool Permissions** - Ensure subagent has `bash: false` in frontmatter.

---

## Error: Tool Not Available

### Symptom
Agent tries to use a tool but framework says "tool not available".

### Cause
Tool not enabled in frontmatter:
```yaml
tools:
  glob: false  # ← Tool disabled
```

### Solution
Enable the tool:
```yaml
tools:
  glob: true  # ← Enable
```

---

## Verification Checklist

After fixing tool permission:
- [ ] Agent frontmatter has correct `tools:` configuration?
- [ ] Prompt emphasizes allowed tools in critical rules section?
- [ ] Prompt warns against restricted tools?
- [ ] Test uses `auto-approve` for subagents?
- [ ] Test verifies tool usage with `mustUseTools`?

---

## Tool Permission Matrix

| Agent Type | bash | write | edit | task | read | grep | glob | list |
|------------|------|-------|------|------|------|------|------|------|
| **Read-only subagent** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Primary agent** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Orchestrator** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Related

- `concepts/subagent-testing-modes.md` - Understand subagent testing
- `guides/testing-subagents.md` - How to test subagents
- `examples/subagent-prompt-structure.md` - Prompt structure with tool emphasis

## Debugging Example

### Scenario: ContextScout Fails with 0 Tool Calls

**Problem**: ContextScout subagent test fails with `Tool Calls: 0` - agent didn't use any tools.

**Root Cause**: The agent prompt had tool usage instructions buried at line 596, after 400+ lines of context. The model missed the critical rules.

**Fix**: Restructured the prompt to place `<critical_rules>` in the first 50 lines, explicitly stating which tools to use (glob, read, grep, list) and which to avoid (bash, write, edit, task). Also added a "What NOT to Do" section with negative examples.

**Result**: Test passed with 1+ tool calls, 47.5% prompt reduction.

### Scenario: Approval Gate Fails for a Subagent

**Problem**: Subagent test fails with "Execution tool 'bash' called without requesting approval".

**Root Cause**: The subagent has `bash: true` in tools and the test expects approval behavior. Subagents should not have execution tools.

**Fix**: Set `bash: false`, `write: false`, `edit: false` in subagent frontmatter. Update test to use `auto-approve` strategy.

**Result**: Test passes without approval gate violations.

---

## Related

- `concepts/subagent-testing-modes.md` - Understand subagent testing
- `guides/testing-subagents.md` - How to test subagents
- `examples/subagent-prompt-structure.md` - Prompt structure with tool emphasis

**Reference**: `.opencode/agent/subagents/core/contextscout.md` (tool configuration)
