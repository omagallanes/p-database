<!-- Context: openagents-repo/lookup | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Lookup: Command Reference

**Purpose**: Quick reference for common commands

---

## Registry Commands

```bash
./scripts/registry/validate-registry.sh              # Basic validation
./scripts/registry/validate-registry.sh -v           # Verbose
./scripts/registry/auto-detect-components.sh --dry-run      # Preview changes
./scripts/registry/auto-detect-components.sh --auto-add     # Add components
./scripts/registry/auto-detect-components.sh --auto-add --force  # Force update
./scripts/registry/validate-component.sh             # Validate component structure
```

---

## Testing Commands

```bash
cd evals/framework
npm run eval:sdk -- --agent={category}/{agent} --pattern="{test}.yaml"  # Single test
npm run eval:sdk -- --agent={category}/{agent}      # All tests for agent
npm run eval:sdk                                    # All tests (all agents)
npm run eval:sdk -- --agent={agent} --debug         # Debug mode
./scripts/validation/validate-test-suites.sh        # Validate test suites
```

---

## Installation Commands

```bash
./install.sh --list                                  # List available components
./install.sh {profile}                               # Install profile (essential|developer|business)
./install.sh --component agent:{agent-name}          # Install specific component
REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh --list  # Local registry

# Collision handling
./install.sh developer --skip-existing               # Skip existing
./install.sh developer --force                       # Overwrite all
./install.sh developer --backup                      # Backup existing
```

---

## Version Commands

```bash
# Check version
cat VERSION && cat package.json | jq '.version' && cat registry.json | jq '.version'

# Update version
echo "0.X.Y" > VERSION
jq '.version = "0.X.Y"' package.json > tmp && mv tmp package.json
jq '.version = "0.X.Y"' registry.json > tmp && mv tmp registry.json

# Bump version script
./scripts/versioning/bump-version.sh 0.X.Y
```

---

## Git Commands (Release)

```bash
git add VERSION package.json CHANGELOG.md
git commit -m "chore: bump version to 0.X.Y"
git tag -a v0.X.Y -m "Release v0.X.Y"
git push origin main && git push origin v0.X.Y
gh release create v0.X.Y --title "v0.X.Y" --notes "See CHANGELOG.md"
```

---

## Validation Commands

```bash
# Full validation
./scripts/registry/validate-registry.sh && ./scripts/validation/validate-test-suites.sh && cd evals/framework && npm run eval:sdk

# Check context dependencies
/check-context-deps                          # Analyze all agents
/check-context-deps contextscout             # Analyze specific agent
/check-context-deps --fix                    # Auto-fix missing deps

# Validate
./scripts/validation/validate-context-refs.sh
./scripts/validation/setup-pre-commit-hook.sh
```

---

## Development Commands

```bash
./scripts/development/demo.sh
./scripts/development/dashboard.sh
```

---

## Maintenance Commands

```bash
./scripts/maintenance/cleanup-stale-sessions.sh
./scripts/maintenance/uninstall.sh
```

---

## Debugging Commands

```bash
# Check sessions
ls -lt .tmp/sessions/ | head -5
cat .tmp/sessions/{session-id}/session.json | jq
cat .tmp/sessions/{session-id}/events.json | jq

# Context logs
./scripts/check-context-logs/check-session-cache.sh
./scripts/check-context-logs/count-agent-tokens.sh
./scripts/check-context-logs/show-api-payload.sh
./scripts/check-context-logs/show-cached-data.sh
```

---

## Quick Workflows

### Adding a New Agent
```bash
touch .opencode/agent/{category}/{agent-name}.md   # Create agent file
mkdir -p evals/agents/{category}/{agent-name}/{config,tests}  # Test structure
./scripts/registry/auto-detect-components.sh --auto-add       # Update registry
./scripts/registry/validate-registry.sh                       # Validate
```

### Testing an Agent
```bash
cd evals/framework && npm run eval:sdk -- --agent={category}/{agent} --pattern="smoke-test.yaml"
# If fails: npm run eval:sdk -- --agent={category}/{agent} --debug
```

### Creating a Release
```bash
echo "0.X.Y" > VERSION && jq '.version = "0.X.Y"' package.json > tmp && mv tmp package.json
git add VERSION package.json CHANGELOG.md && git commit -m "chore: bump version to 0.X.Y"
git tag -a v0.X.Y -m "Release v0.X.Y" && git push origin main && git push origin v0.X.Y
gh release create v0.X.Y --title "v0.X.Y" --notes "See CHANGELOG.md"
```

---

## Common Patterns

```bash
# Find files
find .opencode/agent -name "{agent-name}.md"
find evals/agents -name "*.yaml"
find .opencode/context -name "*.md"
find scripts -name "*.sh"

# Check registry
cat registry.json | jq '.components.agents[].id'
cat registry.json | jq '.components.agents[] | select(.id == "{agent-name}")'
cat registry.json | jq '.components.agents | length'

# Test locally
REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh --list
REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh developer
```

---

## NPM: `cd evals/framework && npm install && npm test && npm run eval:sdk`

---

## Related: `quick-start.md` | `lookup/file-locations.md` | `guides/`

---

**Last Updated**: 2025-12-10  
**Version**: 0.5.0
