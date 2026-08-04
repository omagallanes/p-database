<!-- Context: openagents-repo/examples | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Subagent Prompt Structure (Optimized)

**Purpose**: Template for well-structured subagent prompts with tool usage emphasis  
**Last Updated**: 2026-01-07

---

## Core Principle

**Position Sensitivity**: Critical instructions in first 15% of prompt improves adherence. For subagents, the most critical instruction is: which tools to use.

---

## Optimized Structure

```xml
---
# Frontmatter (lines 1-50)
id: subagent-name
name: Subagent Name
category: subagents/core
type: subagent
mode: subagent
tools: { read: true, grep: true, glob: true, list: true, bash: false, edit: false, write: false }
permission: { bash: { "*": "deny" }, edit: { "**/*": "deny" }, write: { "**/*": "deny" } }
---

# Agent Name

> **Mission**: One-sentence mission statement
Brief description (1-2 sentences).

---

<!-- CRITICAL: This section must be in first 15% -->
<critical_rules priority="absolute" enforcement="strict">
  <rule id="tool_usage">ONLY use: glob, read, grep, list. NEVER use: bash, write, edit, task. Read-only—no modifications allowed.</rule>
  <rule id="always_use_tools">ALWAYS use tools to discover/verify. NEVER assume or fabricate information.</rule>
  <rule id="output_format">ALWAYS include: exact paths, specific details, evidence.</rule>
</critical_rules>

---

<context>
  <system>What system this agent operates in</system>
  <domain>What domain knowledge it needs</domain>
  <task>What it does</task>
  <constraints>What limits it has</constraints>
</context>

<role>One-sentence role description</role>

<task>One-sentence task description</task>

---

<execution_priority>
  <tier level="1" desc="Critical Operations">- @tool_usage: Use ONLY allowed tools - @always_use_tools: Verify everything - @output_format: Precise results</tier>
  <tier level="2" desc="Core Workflow">- Main workflow steps</tier>
  <tier level="3" desc="Quality">- Quality checks - Validation</tier>
  <conflict_resolution>Tier 1 always overrides Tier 2/3</conflict_resolution>
</execution_priority>

---

## Workflow

### Stage 1: Discovery
**Action**: Use tools to discover information
**Process**: 1. glob/list → 2. read → 3. grep
**Output**: Discovered items

### Stage 2: Analysis
**Action**: Analyze discovered information
**Process**: Extract key details
**Output**: Analyzed results

### Stage 3: Present
**Action**: Return structured response
**Process**: Format according to @output_format
**Output**: Complete response

---

## What NOT to Do

- ❌ **NEVER use bash/write/edit/task tools** (@tool_usage)
- ❌ Don't assume information—verify with tools
- ❌ Don't fabricate paths or details
- ❌ Don't skip required output fields

---

## Remember

**Your Tools**: glob (discover) | read (extract) | grep (search) | list (structure)
**Your Constraints**: Read-only, verify everything, precise output
**Your Value**: Accurate, verified information using tools
```

---

## Key Optimizations Applied

### 1. Critical Rules Early (Line 50 vs Line 596)
**Before**: Tool guidelines buried 400+ lines deep
**After**: XML `<critical_rules>` in first 50 lines with `priority="absolute"`
**Impact**: 47.5% reduction in prompt length, tool usage emphasized early in the prompt.

### 2. Execution Priority (3-Tier System)
```xml
<execution_priority>
  <tier level="1">Critical: Tool usage, verification</tier>
  <tier level="2">Core: Main workflow</tier>
  <tier level="3">Quality: Nice-to-haves</tier>
  <conflict_resolution>Tier 1 always overrides</conflict_resolution>
</execution_priority>
```
Resolves conflicts between instructions, makes priorities explicit for the model.

### 3. Flattened Nesting (≤4 Levels)
**Before**: 6-7 levels of nested XML tags
**After**: 3-4 levels with flat structure. Improves clarity, reduces cognitive load.

### 4. Explicit "What NOT to Do"
Negative examples prevent common mistakes like using bash for file operations, assuming paths without verification, or fabricating information.

---

## Why These Optimizations Matter

Subagents with poorly structured prompts often fail tests with 0 tool calls. The model gets confused when critical rules are buried deep in the prompt. Moving tool restrictions to the top (first 50 lines), using XML tags for emphasis, and providing explicit negative examples significantly improves adherence. The 3-tier priority system ensures the model knows what's truly critical vs. nice-to-have.

---

## Prompt Structure Rules

When designing subagent prompts, follow these rules:
1. **Critical rules first**: Tool usage restrictions must appear within the first 15% of the prompt (lines 1-80 for a 400-line prompt)
2. **Be explicit**: State exactly which tools are allowed and which are forbidden - don't leave room for interpretation
3. **Use XML for emphasis**: XML tags like `<critical_rules>` and `<execution_priority>` help models identify key instructions
4. **Flatten nesting**: Keep nesting at ≤4 levels - deep nesting reduces comprehension
5. **Include negative examples**: Explicitly state what NOT to do to prevent common mistakes
6. **Repeat key constraints**: Mention tool restrictions in multiple places (frontmatter, critical rules, workflow, and "What NOT to Do")

---

## File Size Targets

| Section | Lines | Purpose |
|---------|-------|---------|
| Frontmatter | 30-50 | Agent metadata |
| Critical Rules | 20-30 | Tool usage, core rules |
| Context/Role/Task | 20-30 | Agent identity |
| Execution Priority | 20-30 | Priority system |
| Workflow | 80-120 | Main instructions |
| **Total** | **<400 lines** | MVI compliant |

---

## Validation Checklist

- [ ] Critical rules in first 15% (lines 50-80)?
- [ ] Tool usage explicitly stated?
- [ ] Nesting ≤4 levels?
- [ ] Execution priority defined?
- [ ] "What NOT to Do" section included?
- [ ] Total lines <400?
- [ ] Semantic meaning preserved?

---

## Real Example

**ContextScout Optimization**: 750→394 lines (47.5% reduction), critical rules moved to line 50. Test passed (was failing with 0 tool calls).

---

## Related

- `concepts/subagent-testing-modes.md` - How to test optimized prompts
- `guides/testing-subagents.md` - Verify tool usage works
- `errors/tool-permission-errors.md` - Fix tool issues

**Reference**: `.opencode/command/prompt-engineering/prompt-optimizer.md`
