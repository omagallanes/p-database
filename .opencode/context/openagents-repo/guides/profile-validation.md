<!-- Context: openagents-repo/guides | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Guide: Profile Validation

**Purpose**: Ensure installation profiles include all appropriate components  
**Priority**: HIGH - Check this when adding new agents or updating registry

---

## What Are Profiles?

Pre-configured component bundles in `registry.json` that users install:
- **essential** - Minimal setup (openagent + core subagents)
- **developer** - Full dev environment (all dev agents + tools)
- **business** - Content/product focus (content agents + tools)
- **full** - Everything (all agents, subagents, tools)
- **advanced** - Full + meta-level (system-builder, repo-manager)

---

## The Problem

**Issue**: New agents added to `components.agents[]` but NOT added to profiles. Users install a profile but don't get the new agents.

**Example** (v0.5.0 bug):
```json
// ✅ Agent exists in components
{ "id": "devops-specialist", "path": ".opencode/agent/subagents/development/devops-specialist.md" }
// ❌ But NOT in developer profile
"developer": { "components": [ "agent:openagent", "agent:opencoder" /* Missing: agent:devops-specialist */ ] }
```

**Impact**: Users who install the developer profile don't get the devops-specialist agent, leading to confusion and missing functionality.

---

## Validation Checklist

### 1. Agent Added to Components
```bash
jq '.components.agents[] | select(.id == "your-agent")' registry.json
```

### 2. Agent Added to Appropriate Profiles

| Agent Category | Essential | Developer | Business | Full | Advanced |
|---------------|-----------|-----------|----------|------|----------|
| core | ✅ | ✅ | ✅ | ✅ | ✅ |
| development | ❌ | ✅ | ❌ | ✅ | ✅ |
| content | ❌ | ❌ | ✅ | ✅ | ✅ |
| data | ❌ | ❌ | ✅ | ✅ | ✅ |
| meta | ❌ | ❌ | ❌ | ❌ | ✅ |

### 3. Verify Profile Includes Agent

```bash
# Check if agent is in developer profile
jq '.profiles.developer.components[] | select(. == "agent:your-agent")' registry.json

# Check if agent is in business profile
jq '.profiles.business.components[] | select(. == "agent:your-agent")' registry.json

# Check if agent is in full profile
jq '.profiles.full.components[] | select(. == "agent:your-agent")' registry.json

# Check advanced profile
jq '.profiles.advanced.components[] | select(. == "agent:your-agent")' registry.json
```

If any profile is missing the agent, add it manually to the profiles section in registry.json.

---

## Profile Assignment Rules

### Developer Profile
**Include**: Core agents | Development specialist subagents | Code subagents (tester, reviewer, coder-agent, build-agent) | Dev commands | Dev context | Utility subagents | Tools
**Exclude**: Content agents | Data agents | Meta agents

### Business Profile
**Include**: Core (openagent) | Content specialists | Data specialists | Image tools | Notification tools
**Exclude**: Development specialists | Code subagents | Meta agents

### Full Profile
**Include**: Everything from developer + business profiles (except meta agents)

### Advanced Profile
**Include**: Everything from full + meta agents + meta subagents + meta commands

---

## Automated Validation

Save this as `scripts/registry/validate-profile-coverage.sh`:

```bash
#!/bin/bash
agents=$(jq -r '.components.agents[].id' registry.json)
for agent in $agents; do
  category=$(jq -r ".components.agents[] | select(.id == \"$agent\") | .category" registry.json)
  in_developer=$(jq ".profiles.developer.components[] | select(. == \"agent:$agent\")" registry.json 2>/dev/null)
  in_business=$(jq ".profiles.business.components[] | select(. == \"agent:$agent\")" registry.json 2>/dev/null)
  in_full=$(jq ".profiles.full.components[] | select(. == \"agent:$agent\")" registry.json 2>/dev/null)
  in_advanced=$(jq ".profiles.advanced.components[] | select(. == \"agent:$agent\")" registry.json 2>/dev/null)
  case $category in
    "development") [[ -z "$in_developer" ]] && echo "❌ $agent missing from developer"; [[ -z "$in_full" ]] && echo "❌ $agent missing from full"; [[ -z "$in_advanced" ]] && echo "❌ $agent missing from advanced" ;;
    "content"|"data") [[ -z "$in_business" ]] && echo "❌ $agent missing from business"; [[ -z "$in_full" ]] && echo "❌ $agent missing from full"; [[ -z "$in_advanced" ]] && echo "❌ $agent missing from advanced" ;;
    "meta") [[ -z "$in_advanced" ]] && echo "❌ $agent (meta) missing from advanced" ;;
    "essential"|"standard") [[ -z "$in_full" ]] && echo "❌ $agent missing from full"; [[ -z "$in_advanced" ]] && echo "❌ $agent missing from advanced" ;;
  esac
done
echo "✅ Profile coverage check complete"
```

---

## Manual Validation Steps (After Adding Agent)

1. `./scripts/registry/auto-detect-components.sh --auto-add` - Add agent to components
2. Edit `registry.json` - Add `"agent:your-agent"` to appropriate profiles
3. `./scripts/registry/validate-registry.sh` - Validate
4. `REGISTRY_URL="file://$(pwd)/registry.json" ./install.sh --list | grep "your-agent"` - Test locally
5. Test actual install to temp directory

---

## Common Mistakes

**Mistake 1**: Agent in components but NOT in profiles
**Mistake 2**: Development agent added to business profile instead of developer
**Mistake 3**: Agent in full but NOT in advanced (inconsistent coverage)

---

## CI/CD Integration

Add profile validation to CI to catch missing agents automatically:

```yaml
# .github/workflows/validate-registry.yml
- name: Validate Registry
  run: ./scripts/registry/validate-registry.sh

- name: Validate Profile Coverage
  run: ./scripts/registry/validate-profile-coverage.sh
```

This ensures that any PR that adds a new agent without updating profiles will fail CI checks, preventing the bug from reaching production.

---

## Development Profile Changes (v2.0.0)

**Changed**: frontend-specialist & devops-specialist → Subagents (specialized executors)
**Removed**: backend-specialist (covered by opencoder) | codebase-pattern-analyst (replaced by analyze-patterns command)
**New**: analyze-patterns command for pattern analysis

**What Changed**:
- frontend-specialist: Agent → Subagent (specialized executor)
- devops-specialist: Agent → Subagent (specialized executor)
- backend-specialist: Removed (functionality covered by opencoder)
- codebase-pattern-analyst: Removed (replaced by analyze-patterns command)
- analyze-patterns: New command for pattern analysis

**Why**: Streamlined main agents to 2 (openagent, opencoder). Specialist subagents provide focused expertise when needed. Reduced cognitive load for new users. Clearer separation between main agents and specialized tools.

**Impact**: Developer profile now has 2 main agents + 8 subagents. Smaller, more focused. Same capabilities, better organization. No breaking changes for existing workflows.

---

## Related Files

- **Registry concepts**: `core-concepts/registry.md`
- **Updating registry**: `guides/updating-registry.md`
- **Adding agents**: `guides/adding-agent.md`

---

**Last Updated**: 2025-01-28  
**Version**: 0.5.2
