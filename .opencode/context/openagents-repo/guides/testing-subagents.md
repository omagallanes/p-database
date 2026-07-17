<!-- Context: openagents-repo/guides | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Testing Subagents - Step-by-Step Guide

**Purpose**: How to test subagents in standalone mode  
**Last Updated**: 2026-01-09

---

## ⚠️ CRITICAL: Adding New Subagent to Framework

Before testing, you MUST update THREE locations in framework code:

### 1. `evals/framework/src/sdk/run-sdk-tests.ts` (~line 336)
Add to `subagentParentMap`:
```typescript
'contextscout': 'openagent',  // Maps subagent → parent
```

### 2. `evals/framework/src/sdk/run-sdk-tests.ts` (~line 414)
Add to `subagentPathMap`:
```typescript
'contextscout': 'ContextScout',  // Maps name → path
```

### 3. `evals/framework/src/sdk/test-runner.ts` (~line 238)
Add to `agentMap`:
```typescript
'contextscout': 'ContextScout.md',  // Maps name → file
```

**If missing from ANY map**: Tests will fail with "No test files found" or "Unknown subagent"

---

## Quick Start

```bash
cd evals/framework
npm run eval:sdk -- --subagent=contextscout --pattern="01-test.yaml"
npm run eval:sdk -- --subagent=contextscout --delegate --pattern="01-test.yaml"
npm run eval:sdk -- --subagent=contextscout --pattern="01-test.yaml" --debug
```

---

## Step 1: Verify Agent File

```bash
cat .opencode/agent/subagents/core/contextscout.md | head -20
grep -A 5 "^id:" .opencode/agent/subagents/core/contextscout.md
```

**Expected**: `id: contextscout | name: ContextScout | type: subagent | mode: subagent`

---

## Step 2: Verify Test Configuration

```bash
cat evals/agents/ContextScout/config/config.yaml
```

**Expected**: `agent: ContextScout | model: anthropic/claude-sonnet-4-5 | timeout: 60000`

---

## Step 3: Run Standalone Test

Use `--subagent` flag (not `--agent`):
```bash
cd evals/framework && npm run eval:sdk -- --subagent=ContextScout --pattern="standalone/01-simple-discovery.yaml"
```

**Look for**: `⚡ Standalone Test Mode | Subagent: contextscout | Mode: Forced to 'primary'`

---

## Step 4: Verify Agent Loaded Correctly

```bash
# View latest results metadata
cat evals/results/latest.json | jq '.meta'
```

**Expected Output**:
```json
{ "agent": "ContextScout", "model": "opencode/grok-code-fast", "timestamp": "2026-01-07T..." }
```

**Red Flags**:
- `"agent": "core/openagent"` → Wrong! OpenAgent is running instead
- `"agent": "contextscout"` → Missing category prefix in agent name

---

## Step 5: Check Tool Usage

Verify subagent used the correct tools during the test:

```bash
# Check tool calls in output
cat evals/results/latest.json | jq '.tests[0]' | grep -A 5 "Tool Calls"
```

**Expected** (for ContextScout):
```
Tool Calls: 1
Tools Used: glob
Tool Call Details:
  1. glob: {"pattern":"*.md","path":".opencode/context/core"}
```

**Red Flags**:
- `Tool Calls: 0` → Agent didn't use any tools (prompt issue)
- `Tools Used: task` → Parent agent delegating instead of subagent working
- Missing expected tools (e.g., subagent should use glob but didn't)

---

## Step 6: Analyze Failures

```bash
cat evals/results/latest.json | jq '.tests[0].violations'
```

**Common Issues**:
- **No Tool Calls**: Prompt doesn't emphasize tool usage → Add critical rules section
- **Wrong Agent Running**: Used `--agent` instead of `--subagent` → Use `--subagent=ContextScout`
- **Tool Permission Denied**: Agent tried restricted tool → Check tools/permissions in frontmatter

---

## Step 7: Validate Results

```bash
cat evals/results/latest.json | jq '.summary'
```

**Expected**: `"total": 1, "passed": 1, "failed": 0, "pass_rate": 1.0`

---

## Test File Organization

```
evals/agents/ContextScout/tests/
├── standalone/           # Unit tests (--subagent flag)
│   ├── 01-simple-discovery.yaml
│   └── 02-search-test.yaml
└── delegation/           # Integration tests (--agent flag)
    ├── 01-openagent-delegates.yaml
    └── 02-context-loading.yaml
```

---

## Writing Good Test Prompts

❌ **Vague**: "List all markdown files in .opencode/context/core/"
✅ **Explicit**: "Use the glob tool to find all markdown files in .opencode/context/core/\n\nYou MUST use the glob tool: glob(pattern=\"*.md\", path=\".opencode/context/core\")"

---

## Quick Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| OpenAgent runs instead | Used `--agent` flag | Use `--subagent` flag |
| Tool calls: 0 | Prompt doesn't emphasize tools | Add critical rules section |
| Permission denied | Tool restricted in frontmatter | Check tools: and permissions: |
| Test timeout | Agent stuck/looping | Check prompt logic, add timeout |

---

## Related

- `concepts/subagent-testing-modes.md` - Standalone vs delegation
- `lookup/subagent-test-commands.md` - Quick command reference
- `errors/tool-permission-errors.md` - Common permission issues
- `examples/subagent-prompt-structure.md` - Optimized prompt structure

**Reference**: `evals/framework/src/sdk/run-sdk-tests.ts`
