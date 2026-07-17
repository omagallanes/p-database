<!-- Context: openagents-repo/guides | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Guide: Debugging Common Issues

**Purpose**: Troubleshooting guide for common problems

---

## Quick Diagnostics

```bash
# System health check
./scripts/registry/validate-registry.sh && ./scripts/validation/validate-test-suites.sh

# Check version consistency
cat VERSION && cat package.json | jq '.version'

# Test core agents
cd evals/framework && npm run eval:sdk -- --agent=core/openagent --pattern="smoke-test.yaml"
```

---

## Registry Issues

### Registry Validation Fails

**Symptoms**: `ERROR: Path does not exist: .opencode/agent/core/missing.md`

**Diagnosis**: Run with verbose flag:
```bash
./scripts/registry/validate-registry.sh -v
```

**Common Causes & Solutions**:
1. Path doesn't exist → Remove registry entry or create the missing file
2. Duplicate ID → Rename one of the conflicting components
3. Invalid category → Use a valid category (core, development, content, data, product, learning)

**Fix**:
```bash
./scripts/registry/auto-detect-components.sh --auto-add
./scripts/registry/validate-registry.sh
```

### Component Not in Registry

**Symptoms**: Component doesn't appear in `./install.sh --list`

**Diagnosis**:
```bash
head -10 .opencode/agent/{category}/{agent}.md   # Check frontmatter
./scripts/registry/auto-detect-components.sh --dry-run
```

**Solutions**: Missing frontmatter → Add YAML | Invalid YAML → Fix syntax | Wrong location → Move file

**Fix**: Add frontmatter, re-run auto-detect

---

## Test Failures

### Approval Gate Violation: Agent executed without approval
**Diagnosis**: `cd evals/framework && npm run eval:sdk -- --agent={agent} --debug` + check session
**Solution**: Add approval request: "Present plan → Request approval → Execute"

### Context Loading Violation: Agent didn't load required context
**Diagnosis**: `cat .tmp/sessions/{session-id}/events.json | jq '.[] | select(.type == "context_load")'`
**Solution**: Add: "Load core/standards/code-quality.md before implementing"

### Tool Usage Violation: Agent used wrong tool
**Diagnosis**: `cat .tmp/sessions/{session-id}/events.json | jq '.[] | select(.type == "tool_call")'`
**Solution**: Use read (not bash cat) | list (not bash ls) | grep (not bash grep)

---

## Install Issues

### Install Script Fails

**Symptoms**: `ERROR: Failed to fetch registry` or `ERROR: Component not found`

**Diagnosis**:
```bash
which curl jq
REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh --list
```

**Solutions**:
- **macOS**: `brew install curl jq`
- **Linux**: `sudo apt-get install curl jq`
- **Registry not found**: Verify registry.json exists in project root
- **Component not found**: Check the component is listed in registry.json

### Collision Handling: `--skip-existing` (skip) | `--force` (overwrite) | `--backup` (backup + install)

---

## Path Resolution Issues

### Agent Not Found

**Symptoms**: `ERROR: Agent not found: development/frontend-specialist`

**Diagnosis**: `ls -la .opencode/agent/subagents/development/frontend-specialist.md` and `jq '.components.agents[] | select(.id == "frontend-specialist")' registry.json`

**Fix**: Re-run auto-detect + validate

---

## Version Issues

### Version Mismatch

**Symptoms**: VERSION, package.json, registry.json out of sync

**Diagnosis**: `cat VERSION && cat package.json | jq '.version' && cat registry.json | jq '.version'`

**Solution**: Sync all:
```bash
echo "0.5.0" > VERSION
jq '.version = "0.5.0"' package.json > tmp && mv tmp package.json
jq '.version = "0.5.0"' registry.json > tmp && mv tmp registry.json
```

---

## CI/CD Issues

### Workflow Fails

Run same commands as CI:
```bash
./scripts/registry/validate-registry.sh && ./scripts/validation/validate-test-suites.sh && cd evals/framework && npm run eval:sdk
```

---

## Performance Issues

**Tests Timeout**: Increase timeout in config.yaml (`timeout: 120000`)
**Slow Auto-Detect**: Limit scope (`--path .opencode/agent/development/`)

---

## Getting Help

### Check Logs
```bash
ls -lt .tmp/sessions/ | head -5
cat .tmp/sessions/{session-id}/session.json | jq
cat .tmp/sessions/{session-id}/events.json | jq
```

### Full Diagnostics
```bash
./scripts/registry/validate-registry.sh -v
./scripts/validation/validate-test-suites.sh
cd evals/framework && npm run eval:sdk -- --agent=core/openagent
```

### Common Commands
```bash
./scripts/registry/validate-registry.sh && ./scripts/validation/validate-test-suites.sh && cd evals/framework && npm run eval:sdk
./scripts/registry/auto-detect-components.sh --auto-add --force && ./scripts/registry/validate-registry.sh
REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh --list
```

---

## Related Files

- **Testing guide**: `guides/testing-agent.md`
- **Registry guide**: `guides/updating-registry.md`
- **Eval concepts**: `core-concepts/evals.md`

---

**Last Updated**: 2025-12-10  
**Version**: 0.5.0
