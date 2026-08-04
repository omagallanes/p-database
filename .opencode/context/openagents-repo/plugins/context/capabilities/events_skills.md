<!-- Context: openagents-repo/events_skills | Priority: low | Version: 1.0 | Updated: 2026-02-15 -->

# OpenCode Events: Skills Plugin Implementation

## Overview

This document explains how the OpenCode Skills Plugin uses event hooks (`tool.execute.before` and `tool.execute.after`) to implement skill delivery and output enhancement.

---

## Event Hooks Used

### tool.execute.before

**When it fires**: Before a tool function executes
**Purpose in Skills Plugin**: Inject skill content into the conversation

```typescript
const beforeHook = async (input: any, output: any) => {
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill) {
      await ctx.client.session.prompt({
        path: { id: input.sessionID },
        body: { agent: input.agent, noReply: true,
          parts: [{ type: "text", text: `📚 Skill: ${skill.name}\nBase directory: ${skill.fullPath}\n\n${skill.content}` }]
        }
      })
    }
  }
}
```

**Input**: `input.tool`, `input.sessionID`, `input.agent`, `output.args`
**Can do**: ✅ Inject context | ✅ Validate | ✅ Preprocess | ✅ Log | ✅ Security checks
**Can't**: ❌ Modify output | ❌ Access results

### tool.execute.after

**When it fires**: After a tool function completes
**Purpose in Skills Plugin**: Enhance output with visual feedback

```typescript
const afterHook = async (input: any, output: any) => {
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill && output.output) {
      output.title = `📚 ${skill.name}`
    }
  }
}
```

**Input**: `input.tool`, `input.sessionID`, `output.output`, `output.title`
**Can do**: ✅ Modify output | ✅ Add formatting | ✅ Log | ✅ Analytics
**Can't**: ❌ Modify args | ❌ Prevent execution

---

## Event Lifecycle

```
Agent calls skills_brand_guidelines
  ↓
tool.execute.before fires → beforeHook: Check skill tool → Lookup in skillMap → Inject content via silent prompt
  ↓
Tool.execute() runs → Returns minimal confirmation: "Skill activated: brand-guidelines"
  ↓
tool.execute.after fires → afterHook: Check skill tool → Enhance output.title with emoji
  ↓
Result returned to agent → Tool confirmation + skill content in history + enhanced output
```

---

## Why Hooks?

**Problem**: Embedded delivery in `tool.execute()` → Tight coupling, hard to test, violates SRP.
**Solution**: Hooks → Loose coupling, easy to test, SOLID compliant, reusable, monitorable.

```typescript
// Tool: Minimal
async execute(args, toolCtx) { return `Skill activated: ${skill.name}` }

// Hook: Handles delivery
const beforeHook = async (input, output) => {
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill) { await ctx.client.session.prompt({...}) }
  }
}
```

---

## Skill Lookup Map: Performance

Map enables O(1) access instead of O(n) array search:

```typescript
const skillMap = new Map<string, Skill>()
for (const skill of skills) { skillMap.set(skill.toolName, skill) }
const skill = skillMap.get(input.tool)  // O(1) constant time
```

| Skills | Array O(n) | Map O(1) | Speedup |
|--------|-----------|----------|---------|
| 10 | 10 compares | 1 lookup | 10x |
| 100 | 100 compares | 1 lookup | 100x |

---

## Integration with OpenCode Event System

| OpenCode Event | Hook | Purpose |
|---|---|---|
| `tool.execute.before` | `beforeHook` | Skill content injection |
| `tool.execute.after` | `afterHook` | Output enhancement |

**Plugin return**: `{ tool: tools, "tool.execute.before": beforeHook, "tool.execute.after": afterHook }`

**Key**: Hooks apply to ALL tools (filter with `if`) | Multiple plugins register without conflict | Hooks run in registration order

---

## Testing Hooks

### Before Hook
```typescript
describe("beforeHook", () => {
  it("should inject skill content for skill tools", async () => {
    const input = { tool: "skills_brand_guidelines", sessionID: "ses_test", agent: "test-agent" }
    const output = { args: {} }
    const mockPrompt = jest.fn(); ctx.client.session.prompt = mockPrompt
    await beforeHook(input, output)
    expect(mockPrompt).toHaveBeenCalled()
  })
  it("should skip non-skill tools", async () => {
    const input = { tool: "read_file", sessionID: "ses_test" }
    const output = { args: {} }
    const mockPrompt = jest.fn(); ctx.client.session.prompt = mockPrompt
    await beforeHook(input, output)
    expect(mockPrompt).not.toHaveBeenCalled()
  })
})
```

### After Hook
```typescript
describe("afterHook", () => {
  it("should add emoji title for skill tools", async () => {
    const input = { tool: "skills_brand_guidelines" }
    const output = { output: "Skill activated" }
    await afterHook(input, output)
    expect(output.title).toBe("📚 brand-guidelines")
  })
  it("should skip non-skill tools", async () => {
    const input = { tool: "read_file" }; const output = { output: "File content" }
    await afterHook(input, output)
    expect(output.title).toBeUndefined()
  })
})
```

---

## Common Patterns

**Tool-Specific Hooks**: `switch (input.tool) { case "skills_brand_guidelines": ... }`
**Conditional Processing**: `if (input.tool.startsWith("skills_") && skill.allowedTools?.includes(input.agent))`
**Logging**: Log tool calls in before/after hooks for monitoring
**Error Handling**: Wrap in try/catch, don't rethrow (let tool execute anyway)

---

## Key Takeaways

1. Hooks are middleware intercepting tool execution at specific points
2. Before hook: preprocessing, validation, context injection
3. After hook: output enhancement, logging, analytics
4. Lookup maps enable O(1) access over O(n) search
5. Separation of concerns: tools do one thing, hooks do another

---

## References

- **OpenCode Events**: `context/capabilities/events.md`
- **Tool Definition**: `context/capabilities/tools.md`
