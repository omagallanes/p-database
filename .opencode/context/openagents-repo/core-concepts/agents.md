# Core Concept: Agents

**Purpose**: Understanding how agents work in OpenAgents Control  
**Priority**: CRITICAL - Load this before working with agents

---

## What Are Agents?

Agents are AI prompt files (Markdown with frontmatter metadata) that define specialized behaviors. They are category-organized, context-aware, and testable via eval framework.

---

## Agent Structure

```markdown
---
description: "Brief description of what this agent does"
category: "category-name"
type: "agent"
tags: ["tag1", "tag2"]
dependencies: ["subagent:tester"]
---

# Agent Name
[Agent prompt content - instructions, workflows, constraints]
```

**Key Components**: 1. Frontmatter (description, category, type, tags, dependencies) 2. Prompt Content (instructions, workflows, context loading)

---

## Category System

**Core** (`core/`): `openagent.md`, `opencoder.md`, `system-builder.md`
**Development** (`development/`): `frontend-specialist.md`, `devops-specialist.md`
**Content** (`content/`): `copywriter.md`, `technical-writer.md`
**Data** (`data/`): `data-analyst.md`
**Product** / **Learning**: Ready, no agents yet.

---

## Subagents

**Location**: `.opencode/agent/subagents/`

| Category | Subagents |
|----------|-----------|
| **code/** | tester, reviewer, coder-agent, build-agent |
| **core/** | task-manager, documentation |
| **system-builder/** | agent-generator, command-creator, domain-analyzer, context-organizer, workflow-designer |
| **utils/** | image-specialist |

### Subagents vs Category Agents

| Aspect | Category Agents | Subagents |
|--------|----------------|-----------|
| Purpose | User-facing specialists | Delegated subtasks |
| Invocation | Direct by user | Via task tool |
| Scope | Broad domain | Narrow focus |

---

## Claude Code Interop (Optional)

Can pair with Claude Code: Subagents in `.claude/agents/`, Skills in `.claude/skills/`, Hooks for lifecycle events, Plugins for cross-project sharing.

---

## Path Resolution

### Supported Formats

```
"openagent" → ".opencode/agent/core/openagent.md"
"core/openagent" → ".opencode/agent/core/openagent.md"
"TestEngineer" → ".opencode/agent/subagents/code/test-engineer.md"
```

### Resolution Rules

1. Has `/` → use as category path
2. No `/` → check `core/` first (backward compat)
3. Not in `core/` → search all categories
4. Not found → error

---

## Prompt Variants

**Location**: `.opencode/prompts/{category}/{agent}/`
**Models**: gemini.md, grok.md, llama.md, openrouter.md
**Fallback**: Base agent file if no variant exists.

---

## Context Loading

```markdown
<!-- Context: standards/code | Priority: critical -->
```
Loads: `.opencode/context/core/standards/code-quality.md`

Multiple: `<!-- Context: standards/code, standards/tests | Priority: critical -->`

---

## Agent Lifecycle

### 1. Creation
```bash
touch .opencode/agent/{category}/{agent-name}.md
# Add frontmatter and content
```

### 2. Testing
```bash
mkdir -p evals/agents/{category}/{agent-name}/{config,tests}
cd evals/framework && npm run eval:sdk -- --agent={category}/{agent-name}
```

### 3. Registration
```bash
./scripts/registry/auto-detect-components.sh --auto-add
./scripts/registry/validate-registry.sh
```

### 4. Distribution
```bash
./install.sh {profile}
```

---

## Best Practices

### Agent Design
✅ Single responsibility - one domain, one agent
✅ Clear instructions - explicit workflows and constraints
✅ Context-aware - load relevant context files
✅ Testable - include eval tests

### Naming Conventions
- Category agents: `{domain}-specialist.md`
- Core agents: `{name}.md`
- Subagents: `{purpose}.md`

### Frontmatter Requirements

```yaml
---
description: "Required - brief description"
category: "Required - category name"
type: "Required - always 'agent'"
tags: ["Optional - for discovery"]
dependencies: ["Optional - e.g., 'subagent:tester'"]
---
```

---

## Common Patterns

**Delegation to Subagents**: Implement feature → delegate to TestEngineer for test creation

**Context Loading**: Load core/standards/code-quality.md → Apply standards to implementation

**Approval Gates**: Present plan → Request approval → Execute incrementally

---

## Related Files

- **Adding agents**: `guides/adding-agent-basics.md`
- **Testing agents**: `guides/testing-agent.md`
- **Category system**: `core-concepts/categories.md`
- **File locations**: `lookup/file-locations.md`

---

**Last Updated**: 2026-01-13  
**Version**: 0.5.1
