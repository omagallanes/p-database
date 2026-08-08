<!-- Context: core/navigation | Priority: critical | Version: 1.1 | Updated: 2026-08-08 -->

# Core Context Navigation

**Purpose**: Universal standards and workflows for all development

---

## Structure

```
core/
├── navigation.md
├── context-system.md
├── essential-patterns.md
├── visual-development.md
│
├── config/
│   ├── navigation.md
│   └── paths.json
│
├── standards/
│   ├── navigation.md
│   ├── code-analysis.md
│   ├── code-quality.md
│   ├── documentation.md
│   ├── project-intelligence.md
│   ├── project-intelligence-management.md
│   ├── security-patterns.md
│   └── test-coverage.md
│
├── workflows/
│   ├── navigation.md
│   ├── code-review.md
│   ├── component-planning.md
│   ├── delegation.md
│   ├── design-iteration-*.md
│   ├── external-context-integration.md
│   ├── external-context-management.md
│   ├── external-libraries-scenarios.md
│   ├── external-libraries-faq.md
│   ├── feature-breakdown.md
│   ├── review.md
│   ├── session-management.md
│   ├── task-delegation-basics.md
│   ├── task-delegation-caching.md
│   └── task-delegation-specialists.md
│
├── task-management/
│   ├── navigation.md
│   ├── standards/
│   │   └── task-schema.md
│   ├── guides/
│   │   ├── managing-tasks.md
│   │   └── splitting-tasks.md
│   └── lookup/
│       └── task-commands.md
│
├── system/
│   ├── navigation.md
│   ├── context-guide.md
│   └── context-paths.md
│
└── context-system/
    ├── navigation.md
    ├── examples/
    │   └── navigation-examples.md
    ├── guides/
    │   ├── compact.md
    │   ├── creation.md
    │   ├── navigation-design-basics.md
    │   ├── navigation-templates.md
    │   ├── organizing-context.md
    │   └── workflows.md
    ├── operations/
    │   ├── error.md
    │   ├── extract.md
    │   ├── harvest.md
    │   ├── migrate.md
    │   ├── organize.md
    │   └── update.md
    └── standards/
        ├── codebase-references.md
        ├── frontmatter.md
        ├── mvi.md
        ├── structure.md
        └── templates.md
```

---

## Quick Routes

| Task | Path |
|------|------|
| **Write code** | `standards/code-quality.md` |
| **Write tests** | `standards/test-coverage.md` |
| **Write docs** | `standards/documentation.md` |
| **Security patterns** | `standards/security-patterns.md` |
| **Review code** | `workflows/code-review.md` |
| **Delegate task** | `workflows/task-delegation-basics.md` |
| **Break down feature** | `workflows/feature-breakdown.md` |
| **External context** | `workflows/external-context-integration.md` |
| **Essential patterns** | `essential-patterns.md` |
| **Visual development** | `visual-development.md` |
| **Manage tasks** | `task-management/navigation.md` |
| **Task CLI commands** | `task-management/lookup/task-commands.md` |
| **Context paths** | `system/context-paths.md` |
| **Context system** | `context-system.md` |

---

## By Type

**Standards** → Code quality, testing, docs, security (critical priority)
**Workflows** → Review, delegation, task breakdown (high priority)
**Task Management** → JSON-driven task tracking with CLI (high priority)
**System** → Context management and guides (medium priority)
**Config** → Paths and settings for the context system (low priority)
**Essential Patterns** → Language-agnostic development patterns (critical priority)
**Visual Development** → UI design and image generation (high priority)

---

## Related Context

- **Development** → `../development/navigation.md`
- **OpenAgents Control Repo** → `../openagents-repo/navigation.md`

---

## Nota de versión

### Versión 1.1 — 2026-08-08
- Eliminado el bloque `guides/` del árbol: la carpeta `core/guides/` no existe en el disco.
- Eliminada la ruta `guides/resuming-sessions.md` de rutas rápidas: el archivo no existe.
- Añadidos al árbol los elementos reales omitidos: `config/`, `essential-patterns.md`, `visual-development.md`, `system/context-paths.md` y `system/navigation.md`.
- Corregidos los subárboles de `context-system/` y `task-management/`: las subcarpetas `examples/`, `guides/`, `operations/`, `standards/` y `lookup/` no tienen `navigation.md` propio; ahora las referencias apuntan a los archivos reales.
- Añadidas rutas rápidas a `essential-patterns.md`, `visual-development.md`, `workflows/external-context-integration.md` y `system/context-paths.md`.

### Versión 1.0 — 2026-02-15
- Versión original con el árbol de `guides/`, `context-system` y `task-management` no verificado contra el disco.
