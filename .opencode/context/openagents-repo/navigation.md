<!-- Context: openagents-repo/navigation | Priority: critical | Version: 2.1 | Updated: 2026-08-08 -->

# OpenAgents Control Repository Context

**Purpose**: Context files specific to the OpenAgents Control repository

---

## Structure

```
openagents-repo/
├── quick-start.md
├── concepts/
│   └── subagent-testing-modes.md
├── core-concepts/
│   ├── agent-metadata.md
│   ├── agents.md
│   ├── categories.md
│   ├── evals.md
│   └── registry.md
├── errors/
│   └── tool-permission-errors.md
├── examples/
│   ├── context-bundle-example.md
│   └── subagent-prompt-structure.md
├── guides/
│   ├── adding-agent-basics.md
│   ├── adding-agent-testing.md
│   ├── adding-skill-basics.md
│   ├── adding-skill-example.md
│   ├── adding-skill-implementation.md
│   ├── building-cli-compact.md
│   ├── creating-release.md
│   ├── debugging.md
│   ├── external-libraries-workflow.md
│   ├── github-issues-workflow.md
│   ├── npm-publishing.md
│   ├── profile-validation.md
│   ├── resolving-installer-wildcard-failures.md
│   ├── subagent-invocation.md
│   ├── testing-agent.md
│   ├── testing-subagents-approval.md
│   ├── testing-subagents.md
│   └── updating-registry.md
├── lookup/
│   ├── commands.md
│   ├── file-locations.md
│   ├── subagent-framework-maps.md
│   └── subagent-test-commands.md
├── plugins/
│   └── context/
│       ├── architecture/
│       │   ├── lifecycle.md
│       │   └── overview.md
│       ├── capabilities/
│       │   ├── agents.md
│       │   ├── events.md
│       │   ├── events_skills.md
│       │   └── tools.md
│       └── reference/
│           └── best-practices.md
├── quality/
│   └── registry-dependencies.md
└── templates/
    └── context-bundle-template.md
```

---

## By Type

### Concepts

| File | Topic | Priority |
|------|-------|----------|
| `concepts/subagent-testing-modes.md` | Standalone vs delegation testing | ⭐⭐⭐⭐⭐ |

### Core Concepts

| File | Topic | Priority |
|------|-------|----------|
| `core-concepts/agents.md` | How agents work | ⭐⭐⭐⭐⭐ |
| `core-concepts/evals.md` | How testing works | ⭐⭐⭐⭐⭐ |
| `core-concepts/registry.md` | How registry works | ⭐⭐⭐⭐ |
| `core-concepts/categories.md` | How organization works | ⭐⭐⭐ |
| `core-concepts/agent-metadata.md` | Agent metadata fields | ⭐⭐⭐ |

### Errors

| File | Topic | Priority |
|------|-------|----------|
| `errors/tool-permission-errors.md` | Tool permission issues | ⭐⭐⭐⭐⭐ |

### Examples

| File | Topic | Priority |
|------|-------|----------|
| `examples/subagent-prompt-structure.md` | Optimized subagent prompt template | ⭐⭐⭐⭐ |
| `examples/context-bundle-example.md` | Context bundle usage example | ⭐⭐⭐ |

### Guides

| File | Topic | Priority |
|------|-------|----------|
| `guides/testing-subagents.md` | How to test subagents standalone | ⭐⭐⭐⭐⭐ |
| `guides/adding-agent-basics.md` | How to add new agents (basics) | ⭐⭐⭐⭐ |
| `guides/adding-agent-testing.md` | How to add agent tests | ⭐⭐⭐⭐ |
| `guides/adding-skill-basics.md` | How to add OpenCode skills | ⭐⭐⭐⭐ |
| `guides/adding-skill-example.md` | Skill example walkthrough | ⭐⭐⭐⭐ |
| `guides/adding-skill-implementation.md` | Skill implementation steps | ⭐⭐⭐⭐ |
| `guides/testing-agent.md` | How to test agents | ⭐⭐⭐⭐ |
| `guides/external-libraries-workflow.md` | External library dependencies | ⭐⭐⭐⭐ |
| `guides/github-issues-workflow.md` | GitHub issues and project board | ⭐⭐⭐⭐ |
| `guides/subagent-invocation.md` | How to invoke subagents | ⭐⭐⭐⭐ |
| `guides/testing-subagents-approval.md` | Subagent testing with approval | ⭐⭐⭐⭐ |
| `guides/npm-publishing.md` | How to publish package to npm | ⭐⭐⭐ |
| `guides/updating-registry.md` | How to update registry | ⭐⭐⭐ |
| `guides/debugging.md` | How to debug issues | ⭐⭐⭐ |
| `guides/resolving-installer-wildcard-failures.md` | Fix wildcard install failures | ⭐⭐⭐ |
| `guides/profile-validation.md` | Agent profile validation | ⭐⭐⭐ |
| `guides/building-cli-compact.md` | Building compact CLI tools | ⭐⭐ |
| `guides/creating-release.md` | How to create releases | ⭐⭐ |

### Lookup

| File | Topic | Priority |
|------|-------|----------|
| `lookup/subagent-test-commands.md` | Subagent testing commands | ⭐⭐⭐⭐⭐ |
| `lookup/file-locations.md` | Where files are located | ⭐⭐⭐⭐ |
| `lookup/commands.md` | Available slash commands | ⭐⭐⭐ |
| `lookup/subagent-framework-maps.md` | Subagent framework mappings | ⭐⭐⭐ |

### Plugins

| File | Topic | Priority |
|------|-------|----------|
| `plugins/context/navigation.md` | Context plugin system overview | ⭐⭐⭐⭐⭐ |
| `plugins/context/architecture/overview.md` | Plugin architecture overview | ⭐⭐⭐⭐ |
| `plugins/context/architecture/lifecycle.md` | Plugin lifecycle stages | ⭐⭐⭐⭐ |
| `plugins/context/capabilities/agents.md` | Agent capabilities | ⭐⭐⭐⭐ |
| `plugins/context/capabilities/events.md` | Event capabilities | ⭐⭐⭐⭐ |
| `plugins/context/capabilities/events_skills.md` | Events and skills capabilities | ⭐⭐⭐⭐ |
| `plugins/context/capabilities/tools.md` | Tool capabilities | ⭐⭐⭐⭐ |
| `plugins/context/reference/best-practices.md` | Plugin best practices | ⭐⭐⭐ |

### Quality

| File | Topic | Priority |
|------|-------|----------|
| `quality/registry-dependencies.md` | Registry dependency checks | ⭐⭐⭐ |

### Templates

| File | Topic | Priority |
|------|-------|----------|
| `templates/context-bundle-template.md` | Ready-to-use context bundle template | ⭐⭐⭐⭐ |

---

## Loading Strategy

**Subagent testing**: `concepts/subagent-testing-modes.md` → `guides/testing-subagents.md` → `lookup/subagent-test-commands.md` → `errors/tool-permission-errors.md` (si falla)

**Agent creation**: `core-concepts/agents.md` → `core-concepts/agent-metadata.md` → `guides/adding-agent-basics.md` → `guides/external-libraries-workflow.md` (si librerías externas) → `examples/subagent-prompt-structure.md` (si subagent) → `guides/testing-agent.md`

**Skill creation**: `guides/adding-skill-basics.md` → `guides/adding-skill-implementation.md` → `guides/adding-skill-example.md`

**Issue management**: `guides/github-issues-workflow.md` → crear issues con labels y templates → añadir al project board

**Debugging**: `guides/debugging.md` → error específico en `errors/` → `lookup/file-locations.md`

**Publishing**: `guides/updating-registry.md` → `guides/npm-publishing.md` → `guides/creating-release.md`

---

## Related Context

- `../core/` - Core system context (standards, patterns)
- `../core/context-system/` - Context management system
- `quick-start.md` - 2-minute repo orientation
- `plugins/navigation.md` - Plugin system context

---

## Nota de versión

### Versión 2.1 — 2026-08-08
Compactado a MVI (<200 líneas): eliminados "Quick Navigation" (redundante con Structure), "Quick Routes" (redundante con By Type), "When to read" repetitivos y "File Size Compliance".

### Versión 2.0 — 2026-08-08
Reconstrucción contra el disco real: retiradas referencias a inexistentes (standards/, concepts/compatibility-layer, examples/baseadapter-pattern, lookup/tool-feature-parity, errors/skills-errors, features/); incorporados huérfanos (blueprints/context-bundle-template, core-concepts/agent-metadata, examples/context-bundle-example, guías adding-skill-*/building-cli-compact/profile-validation/subagent-invocation/testing-subagents-approval, lookup/subagent-framework-maps, plugins/context/, quality/registry-dependencies, templates/context-bundle-template).

### Histórico
**v1.0 (2026-02-15)**: versión original con referencias a archivos inexistentes.