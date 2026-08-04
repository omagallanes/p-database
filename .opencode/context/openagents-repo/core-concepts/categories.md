# Core Concept: Category System

**Purpose**: Understanding how components are organized  
**Priority**: HIGH - Load this before adding categories or organizing components

---

## What Are Categories?

Domain-based groupings that organize agents, context files, and tests by expertise area. Benefits: Scalability, Discovery, Organization, Modularity.

---

## Available Categories

| Category | Agents | Status |
|----------|--------|--------|
| **Core** | openagent, opencoder | ✅ Stable |
| **Development** | frontend-specialist, devops-specialist | ✅ Active |
| **Content** | copywriter, technical-writer | ✅ Active |
| **Data** | data-analyst | ✅ Active |
| **Product** / **Learning** | (none yet) | Ready |

---

## Category Structure

### Directory Layout

```
.opencode/
├── agent/{category}/           # Agents by category
│   └── 0-category.json         # Category metadata
├── context/{category}/         # Context by category
├── prompts/{category}/         # Prompt variants by category
evals/agents/{category}/        # Tests by category
```

### Example
```
.opencode/agent/core/             .opencode/agent/subagents/development/
├── 0-category.json               ├── 0-category.json
├── openagent.md                  ├── frontend-specialist.md
└── opencoder.md                  └── devops-specialist.md

.opencode/context/development/
├── navigation.md  |  clean-code.md  |  react-patterns.md  |  api-design.md
```

---

## Category Metadata (0-category.json)

```json
{ "name": "Development", "description": "Software development specialists", "icon": "💻", "order": 2, "status": "active" }
```

**Fields**: `name`, `description`, `icon` (emoji), `order` (display order), `status` (active|ready|planned)

---

## Naming Conventions

**Category Names**: ✅ Lowercase | ✅ Singular (`development`, not `Development`) | ✅ Descriptive

**Agent Names**: ✅ Kebab-case (`frontend-specialist.md`)
✅ Suffix: `-specialist`, `-agent`, `-writer`

**Context Names**: ✅ Kebab-case (`react-patterns.md`)
✅ Specific, one topic per file

---

## Path Resolution

### Resolution Order

1. Check for `/` → treat as category path
2. Check `core/` → backward compatibility
3. Search categories → look in all categories
4. Error → if not found

### Examples

```
"openagent" → ".opencode/agent/core/openagent.md"
"subagents/development/frontend-specialist" → ".opencode/agent/subagents/development/frontend-specialist.md"
"TestEngineer" → ".opencode/agent/subagents/code/test-engineer.md"
```

---

## Adding a New Category

### Step 1: Create Directories
```bash
mkdir -p .opencode/agent/{category} .opencode/context/{category} evals/agents/{category}
```
### Step 2: Add Category Metadata
```bash
cat > .opencode/agent/{category}/0-category.json << 'EOF'
{ "name": "Category Name", "description": "Brief description", "icon": "🎯", "order": 10, "status": "ready" }
EOF
```
### Step 3: Add Context Navigation
```bash
cat > .opencode/context/{category}/navigation.md << 'EOF'
# Category Name Context
Context files for {category} specialists.
EOF
```
### Step 4: Validate
```bash
./scripts/registry/validate-component.sh
./scripts/registry/auto-detect-components.sh --auto-add
```

---

## Category Guidelines

✅ **Create**: Distinct domain | 2+ agents | Shared context | User demand
❌ **Don't create**: Single agent | Overlaps existing | Too narrow | Unclear domain

---

## Category vs Subagent

| Aspect | Category Agent | Subagent |
|--------|----------------|----------|
| Purpose | User-facing specialist | Delegated subtask |
| Invocation | Direct | Via task tool |
| Scope | Broad domain | Narrow focus |
| Example | frontend-specialist | tester |

---

## Context Organization

```
.opencode/context/{category}/
├── navigation.md      # Overview
├── {topic-1}.md       # Specific topic
```

Loading: `<!-- Context: development/react-patterns | Priority: high -->`

---

## Best Practices

### Organization
✅ Clear, well-defined categories - easy to understand domain groupings
✅ Consistent naming conventions - lowercase, singular, kebab-case
✅ Proper metadata - complete 0-category.json for every category

### Scalability
✅ Modular - categories are independent and self-contained
✅ Extensible - easy to add new categories without disrupting existing ones
✅ Maintainable - clear structure makes updates predictable

### Discovery
✅ Descriptive names - names that clearly convey the domain
✅ Good descriptions - explain when and why to use each category
✅ Proper tags - aid in search and discovery

---

## Migration from Flat Structure

**Old**: all .md files directly in `.opencode/agent/`
**New**: `core/`, `subagents/development/`, `content/` etc.
**Backward compatible**: `openagent` → `core/openagent`, `opencoder` → `core/opencoder`

---

## Related Files: `guides/adding-agent.md` | `core-concepts/agents.md` | `lookup/file-locations.md`

---

**Last Updated**: 2026-01-13  
**Version**: 0.5.1
