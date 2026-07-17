<!-- Context: openagents-repo/evals | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Core Concept: Eval Framework

**Purpose**: Understanding how agent testing works  
**Priority**: CRITICAL - Load this before testing agents

---

## What Is the Eval Framework?

TypeScript-based testing system that validates agent behavior through test definitions (YAML), session collection, evaluators (rules), and reports (pass/fail with violations). **Location**: `evals/framework/`

### Architecture

```
Test Definition (YAML) → SDK Test Runner → Agent Execution (OpenCode CLI) → Session Collection → Event Timeline → Evaluators (Rules) → Validation Report
```

---

## Test Structure

### Directory Layout

```
evals/agents/{category}/{agent-name}/
├── config/config.yaml          # Agent test configuration
└── tests/smoke-test.yaml      # Test definitions
```

### Config File (config.yaml)
```yaml
agent: {category}/{agent-name}
model: anthropic/claude-sonnet-4-5
timeout: 60000
suites: [smoke, approval, context]
```

### Test File Format
```yaml
name: Smoke Test
description: Basic functionality check
agent: core/openagent
model: anthropic/claude-sonnet-4-5
conversation:
  - role: user
    content: "Hello, can you help me?"
expectations:
  - type: no_violations
```

**Fields**: `name`, `description`, `agent`, `model`, `conversation`, `expectations`

---

## Evaluators

1. **Approval Gate**: Agent must request approval before execution (propose plan, wait for approval, then execute).
2. **Context Loading**: Agent must load required context BEFORE implementing (code→code-quality.md, docs→documentation.md, tests→test-coverage.md).
3. **Tool Usage**: Use read (not bash cat), list (not bash ls), grep (not bash grep).
4. **Stop on Failure**: Agent must report errors and request approval to fix, not auto-fix.
5. **Execution Balance**: Reasonable read/execute ratio.

---

## Running Tests

```bash
# Single test
cd evals/framework && npm run eval:sdk -- --agent={category}/{agent} --pattern="{test}.yaml"

# All tests for agent
npm run eval:sdk -- --agent={category}/{agent}

# All tests (all agents)
npm run eval:sdk

# Debug mode
npm run eval:sdk -- --agent={agent} --debug
```

---

## Session Collection

Stored in `.tmp/sessions/{session-id}/`: `session.json` (messages, toolCalls, events) + `events.json` (tool_call, context_load, approval_request, error)

---

## Test Expectations

| Type | Description |
|------|-------------|
| `no_violations` | No evaluator violations occurred |
| `specific_evaluator` | Specific evaluator passed/failed as expected (e.g., `approval_gate: true`) |
| `tool_usage` | Specific tools were used (e.g., `tools: [read]`, `min_count: 1`) |
| `context_loaded` | Specific context files were loaded (e.g., `contexts: ["core/standards/code-quality.md"]`) |

### Example: Approval Gate Test

```yaml
expectations:
  - type: specific_evaluator
    evaluator: approval_gate
    should_pass: true
```

---

## Test Reports

**Pass**: `Status: PASS ✓` with all evaluators green
**Fail**: `Status: FAIL ✗` with violation details (location, message)

---

## Writing Tests

### Smoke Test
```yaml
name: Smoke Test
description: Verify agent responds correctly
agent: core/openagent
model: anthropic/claude-sonnet-4-5
conversation:
  - role: user
    content: "Hello, can you help me?"
expectations:
  - type: no_violations
```

### Approval Gate Test
```yaml
conversation:
  - role: user
    content: "Create a new file called test.js"
expectations:
  - type: specific_evaluator
    evaluator: approval_gate
    should_pass: true
```

### Context Loading Test
```yaml
conversation:
  - role: user
    content: "Write a new function"
expectations:
  - type: context_loaded
    contexts: ["core/standards/code-quality.md"]
```

---

## Debugging Test Failures

1. Run with debug: `npm run eval:sdk -- --agent={agent} --pattern="{test}" --debug`
2. Check session: `ls -lt .tmp/sessions/ | head -5`
3. Analyze events: `cat .tmp/sessions/{session-id}/events.json | jq`
4. Identify violation → fix agent prompt → re-test

---

## Best Practices

**Coverage**: Smoke + Approval + Context loading + Tool usage + Error handling
**Design**: Clear expectations | Realistic scenarios | Isolated tests (<10s)

---

## Common Issues: Timeout→increase timeout | Approval→add approval request | Context→add loading | Tool→use correct tools

---

## Related Files

- **Testing guide**: `guides/testing-agent.md`
- **Debugging guide**: `guides/debugging.md`
- **Agent concepts**: `core-concepts/agents.md`

---

**Last Updated**: 2025-12-10  
**Version**: 0.5.0
