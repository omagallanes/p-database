<!-- Context: openagents-repo/navigation | Priority: critical | Version: 2.0 | Updated: 2026-08-08 -->

# OpenAgents Control Repository Context

**Purpose**: Context files specific to the OpenAgents Control repository

**Last Updated**: 2026-08-08

---

## Quick Navigation

| Function | Files | Purpose |
|----------|-------|---------|
| **Blueprints** | 1 file | Reusable architecture templates |
| **Concepts** | 1 file | Core ideas and principles |
| **Core Concepts** | 5 files | Foundational repository knowledge |
| **Errors** | 1 file | Common issues + solutions |
| **Examples** | 2 files | Working code samples |
| **Guides** | 18 files | Step-by-step workflows |
| **Lookup** | 4 files | Quick reference tables |
| **Plugins** | 8 files | Context plugin architecture and capabilities |
| **Quality** | 1 file | Dependency quality checks |
| **Templates** | 1 file | Ready-to-use file templates |

---

## Structure

```
openagents-repo/
├── navigation.md
├── quick-start.md
├── blueprints/
│   ├── navigation.md
│   └── context-bundle-template.md
├── concepts/
│   ├── navigation.md
│   └── subagent-testing-modes.md
├── core-concepts/
│   ├── navigation.md
│   ├── agent-metadata.md
│   ├── agents.md
│   ├── categories.md
│   ├── evals.md
│   └── registry.md
├── errors/
│   ├── navigation.md
│   └── tool-permission-errors.md
├── examples/
│   ├── navigation.md
│   ├── context-bundle-example.md
│   └── subagent-prompt-structure.md
├── guides/
│   ├── navigation.md
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
│   ├── navigation.md
│   ├── commands.md
│   ├── file-locations.md
│   ├── subagent-framework-maps.md
│   └── subagent-test-commands.md
├── plugins/
│   ├── navigation.md
│   └── context/
│       ├── context-overview.md
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
│   ├── navigation.md
│   └── registry-dependencies.md
└── templates/
    ├── navigation.md
    └── context-bundle-template.md
```

---

## Quick Routes

| Task | Path |
|------|------|
| **Add agent** | `guides/adding-agent-basics.md` |
| **Test agent** | `guides/testing-agent.md` |
| **Add skill** | `guides/adding-skill-basics.md` |
| **Test subagents** | `guides/testing-subagents.md` |
| **Invoke subagents** | `guides/subagent-invocation.md` |
| **Publish to npm** | `guides/npm-publishing.md` |
| **Create release** | `guides/creating-release.md` |
| **Debug issues** | `guides/debugging.md` |
| **Update registry** | `guides/updating-registry.md` |
| **Commands reference** | `lookup/commands.md` |
| **File locations** | `lookup/file-locations.md` |
| **Subagent test commands** | `lookup/subagent-test-commands.md` |
| **Context plugin overview** | `plugins/context/context-overview.md` |
| **Context bundle template** | `blueprints/context-bundle-template.md` |
| **Repo orientation** | `quick-start.md` |

---

## By Type

### Blueprints

| File | Topic | Priority |
|------|-------|----------|
| `blueprints/context-bundle-template.md` | Reusable context bundle blueprint | ⭐⭐⭐ |

**When to read**: When planning a new context bundle

---

### Concepts

| File | Topic | Priority |
|------|-------|----------|
| `concepts/subagent-testing-modes.md` | Standalone vs delegation testing | ⭐⭐⭐⭐⭐ |

**When to read**: Before testing any subagent

---

### Core Concepts

| File | Topic | Priority |
|------|-------|----------|
| `core-concepts/agents.md` | How agents work | ⭐⭐⭐⭐⭐ |
| `core-concepts/evals.md` | How testing works | ⭐⭐⭐⭐⭐ |
| `core-concepts/registry.md` | How registry works | ⭐⭐⭐⭐ |
| `core-concepts/categories.md` | How organization works | ⭐⭐⭐ |
| `core-concepts/agent-metadata.md` | Agent metadata fields | ⭐⭐⭐ |

**When to read**: First time working in this repo

---

### Errors

| File | Topic | Priority |
|------|-------|----------|
| `errors/tool-permission-errors.md` | Tool permission issues | ⭐⭐⭐⭐⭐ |

**When to read**: When tests fail with permission errors

---

### Examples

| File | Topic | Priority |
|------|-------|----------|
| `examples/subagent-prompt-structure.md` | Optimized subagent prompt template | ⭐⭐⭐⭐ |
| `examples/context-bundle-example.md` | Context bundle usage example | ⭐⭐⭐ |

**When to read**: When optimizing prompts or building bundles

---

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

**When to read**: When performing specific tasks

---

### Lookup

| File | Topic | Priority |
|------|-------|----------|
| `lookup/subagent-test-commands.md` | Subagent testing commands | ⭐⭐⭐⭐⭐ |
| `lookup/file-locations.md` | Where files are located | ⭐⭐⭐⭐ |
| `lookup/commands.md` | Available slash commands | ⭐⭐⭐ |
| `lookup/subagent-framework-maps.md` | Subagent framework mappings | ⭐⭐⭐ |

**When to read**: Quick command lookups and file references

---

### Plugins

| File | Topic | Priority |
|------|-------|----------|
| `plugins/context/context-overview.md` | Context plugin system overview | ⭐⭐⭐⭐⭐ |
| `plugins/context/architecture/overview.md` | Plugin architecture overview | ⭐⭐⭐⭐ |
| `plugins/context/architecture/lifecycle.md` | Plugin lifecycle stages | ⭐⭐⭐⭐ |
| `plugins/context/capabilities/agents.md` | Agent capabilities | ⭐⭐⭐⭐ |
| `plugins/context/capabilities/events.md` | Event capabilities | ⭐⭐⭐⭐ |
| `plugins/context/capabilities/events_skills.md` | Events and skills capabilities | ⭐⭐⭐⭐ |
| `plugins/context/capabilities/tools.md` | Tool capabilities | ⭐⭐⭐⭐ |
| `plugins/context/reference/best-practices.md` | Plugin best practices | ⭐⭐⭐ |

**When to read**: When working with the context plugin system

---

### Quality

| File | Topic | Priority |
|------|-------|----------|
| `quality/registry-dependencies.md` | Registry dependency checks | ⭐⭐⭐ |

**When to read**: When validating registry dependencies

---

### Templates

| File | Topic | Priority |
|------|-------|----------|
| `templates/context-bundle-template.md` | Ready-to-use context bundle template | ⭐⭐⭐⭐ |

**When to read**: When creating a context bundle

---

## Loading Strategy

### For Subagent Testing:
1. Load `concepts/subagent-testing-modes.md` (understand modes)
2. Load `guides/testing-subagents.md` (step-by-step)
3. Reference `lookup/subagent-test-commands.md` (commands)
4. If errors: Load `errors/tool-permission-errors.md`

### For Agent Creation:
1. Load `core-concepts/agents.md` (understand system)
2. Load `core-concepts/agent-metadata.md` (metadata fields)
3. Load `guides/adding-agent-basics.md` (step-by-step)
4. **If using external libraries**: Load `guides/external-libraries-workflow.md` (fetch docs)
5. Load `examples/subagent-prompt-structure.md` (if subagent)
6. Load `guides/testing-agent.md` (validate)

### For Skill Creation:
1. Load `guides/adding-skill-basics.md` (step-by-step)
2. Load `guides/adding-skill-implementation.md` (implementation)
3. Load `guides/adding-skill-example.md` (example)

### For Issue Management:
1. Load `guides/github-issues-workflow.md` (understand workflow)
2. Create issues with proper labels and templates
3. Add to project board for tracking
4. Process requests systematically

### For Debugging:
1. Load `guides/debugging.md` (general approach)
2. Load specific error file from `errors/`
3. Reference `lookup/file-locations.md` (find files)

### For Publishing:
1. Load `guides/updating-registry.md` (update registry)
2. Load `guides/npm-publishing.md` (publish to npm)
3. Load `guides/creating-release.md` (create release)

---

## File Size Compliance

All files follow MVI principle (<200 lines):

- ✅ Blueprints: <100 lines
- ✅ Concepts: <100 lines
- ✅ Core Concepts: <100 lines
- ✅ Examples: <100 lines
- ✅ Guides: <150 lines
- ✅ Lookup: <100 lines
- ✅ Errors: <150 lines
- ✅ Plugins: <150 lines
- ✅ Quality: <100 lines
- ✅ Templates: <100 lines

---

## Related Context

- `../core/` - Core system context (standards, patterns)
- `../core/context-system/` - Context management system
- `quick-start.md` - 2-minute repo orientation
- `../content-creation/navigation.md` - Content creation principles
- `plugins/navigation.md` - Plugin system context

---

## Nota de versión

### Versión 2.0 — 2026-08-08
Reconstrucción completa de la navegación contra el disco real (recorrido con `find`). Se retiran como histórico las referencias a archivos y carpetas inexistentes:

- Carpeta `standards/` completa: `standards/agent-frontmatter.md` y `standards/subagent-structure.md`.
- Conceptos: `concepts/compatibility-layer.md`, `concepts/hooks-system.md`, `concepts/agent-skills.md` y `concepts/subagents-system.md`.
- Ejemplos: `examples/baseadapter-pattern.md` y `examples/zod-schema-migration.md`.
- Guías: `guides/compatibility-layer-workflow.md`, `guides/creating-skills.md` y `guides/creating-subagents.md`.
- Búsquedas: `lookup/tool-feature-parity.md`, `lookup/compatibility-layer-structure.md`, `lookup/hook-events.md`, `lookup/skill-metadata.md`, `lookup/skills-comparison.md`, `lookup/builtin-subagents.md` y `lookup/subagent-frontmatter.md`.
- Errores: `errors/skills-errors.md`.
- Carpetas inexistentes: `features/` y `plugins/context/navigation.md` (el índice real de plugins es `plugins/navigation.md`).

Se incorporan los archivos reales que faltaban (huérfanos): `blueprints/context-bundle-template.md`, `core-concepts/agent-metadata.md`, `examples/context-bundle-example.md`, las guías `adding-skill-example.md`, `adding-skill-implementation.md`, `building-cli-compact.md`, `profile-validation.md`, `subagent-invocation.md` y `testing-subagents-approval.md`, la búsqueda `lookup/subagent-framework-maps.md`, el subárbol completo de `plugins/context/` (ocho archivos), `quality/registry-dependencies.md`, `templates/context-bundle-template.md` y los índices `navigation.md` de cada subcarpeta.

### Versión 1.0 — 2026-02-15
Versión original de la navegación con referencias a archivos inexistentes.
