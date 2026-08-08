<!-- Context: openagents-repo/guides | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Guide: Testing an Agent

**Prerequisites**: Load `core-concepts/evals.md` first  
**Purpose**: Step-by-step workflow for testing agents

---

## Quick Start

```bash
cd evals/framework
npm run eval:sdk -- --agent={category}/{agent} --pattern="smoke-test.yaml"
npm run eval:sdk -- --agent={category}/{agent}
npm run eval:sdk -- --agent={category}/{agent} --debug
```

---

## Test Types

### 1. Smoke Test - Basic functionality check

```yaml
name: Smoke Test
description: Verify agent responds correctly
agent: {category}/{agent}
model: anthropic/claude-sonnet-4-5
conversation:
  - role: user
    content: "Hello, can you help me?"
expectations:
  - type: no_violations
```

Run: `npm run eval:sdk -- --agent={agent} --pattern="smoke-test.yaml"`

### 2. Approval Gate Test - Verify agent requests approval

```yaml
name: Approval Gate Test
description: Verify agent requests approval before execution
agent: {category}/{agent}
model: anthropic/claude-sonnet-4-5
conversation:
  - role: user
    content: "Create a new file called test.js"
expectations:
  - type: specific_evaluator
    evaluator: approval_gate
    should_pass: true
```

### 3. Context Loading Test - Verify agent loads required context

```yaml
name: Context Loading Test
description: Verify agent loads required context
agent: {category}/{agent}
model: anthropic/claude-sonnet-4-5
conversation:
  - role: user
    content: "Write a new function"
expectations:
  - type: context_loaded
    contexts: ["core/standards/code-quality.md"]
```

### 4. Tool Usage Test - Verify agent uses correct tools

```yaml
name: Tool Usage Test
description: Verify agent uses appropriate tools
agent: {category}/{agent}
model: anthropic/claude-sonnet-4-5
conversation:
  - role: user
    content: "Read the package.json file"
expectations:
  - type: tool_usage
    tools: ["read"]
    min_count: 1
```

---

## Running Tests

```bash
# Single test
cd evals/framework && npm run eval:sdk -- --agent={category}/{agent} --pattern="{test-name}.yaml"

# All tests for agent
npm run eval:sdk -- --agent={category}/{agent}

# All tests (all agents)
npm run eval:sdk

# With debug output
npm run eval:sdk -- --agent={agent} --pattern="{test}" --debug
```

---

## Interpreting Results

**Pass**: `✓ Test: smoke-test.yaml | Status: PASS | Duration: 5.2s | All evaluators PASS`
**Fail**: `✗ Test: approval-gate.yaml | Status: FAIL | Violation details with location`

---

## Debugging Failures

1. Run with debug: `npm run eval:sdk -- --agent={agent} --pattern="{test}" --debug`
2. Check session: `ls -lt .tmp/sessions/ | head -5 && cat .tmp/sessions/{session-id}/session.json | jq`
3. Analyze events: `cat .tmp/sessions/{session-id}/events.json | jq`
4. Identify issue: Approval Gate Violation (no approval) | Context Loading (missing context) | Tool Usage (wrong tool) | Stop on Failure (auto-fix)
5. Fix agent prompt → re-test

---

## Writing New Tests

### Template
```yaml
name: Test Name
description: What this test validates
agent: {category}/{agent}
model: anthropic/claude-sonnet-4-5
conversation:
  - role: user
    content: "User message"
expectations:
  - type: no_violations
```

### Best Practices
✅ **Clear name** - descriptive test name that indicates what's being validated
✅ **Good description** - explain what's being tested and why
✅ **Realistic scenario** - test real-world usage, not artificial edge cases
✅ **Specific expectations** - clear pass/fail criteria with well-defined evaluators
✅ **Fast execution** - keep tests under 10 seconds to maintain rapid iteration

---

## Common Test Patterns

```yaml
# Approval: conversation → "Create file" → expectations: specific_evaluator (approval_gate, true)
# Context:  conversation → "Write code"  → expectations: context_loaded (core/standards/code-quality.md)
# Tool:     conversation → "Read README" → expectations: tool_usage (read, min_count: 1)
```

---

## Continuous Testing

**Pre-commit hook**: `./scripts/validation/setup-pre-commit-hook.sh` - validates before every commit
**CI/CD**: Tests run automatically on pull requests, merges to main, and release tags

---

## Test Configuration Best Practices

- Use a reasonable timeout (60000ms default, increase for complex agents)
- Specify the correct model matching your target deployment
- Use descriptive test names that explain what's being validated
- Group related tests in the same test file for clarity
- Keep conversations concise - just enough to trigger the behavior you want to test

---

## Related Files

- **Eval concepts**: `core-concepts/evals.md`
- **Debugging guide**: `guides/debugging.md`
- **Adding agents**: `guides/adding-agent-basics.md`

---

**Last Updated**: 2025-12-10  
**Version**: 0.5.0
