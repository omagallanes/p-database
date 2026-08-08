<!-- Context: core/navigation | Priority: critical | Version: 2.0 | Updated: 2026-08-08 -->

# Context System

**Purpose**: Documentation for the context system architecture and operations

---

## Structure

```
core/context-system/
├── navigation.md                # This file
├── CHANGELOG.md                 # System change history
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
| **Understand context system** | `../context-system.md` |
| **Design navigation files** | `guides/navigation-design-basics.md` |
| **Use navigation templates** | `guides/navigation-templates.md` |
| **Harvest knowledge** | `operations/harvest.md` |
| **Extract content** | `operations/extract.md` |
| **Organize files** | `operations/organize.md` |
| **Update context** | `operations/update.md` |
| **Migrate global → local** | `operations/migrate.md` |
| **MVI standard** | `standards/mvi.md` |
| **Frontmatter standard** | `standards/frontmatter.md` |

---

## By Type

**Examples** → `examples/navigation-examples.md` — working navigation examples

**Guides** → `guides/compact.md` (compact to MVI), `guides/creation.md` (create a category), `guides/navigation-design-basics.md` (design navigation), `guides/navigation-templates.md` (templates), `guides/organizing-context.md` (choose a pattern), `guides/workflows.md` (workflows)

**Operations** → `operations/error.md`, `operations/extract.md`, `operations/harvest.md`, `operations/migrate.md`, `operations/organize.md`, `operations/update.md`

**Standards** → `standards/codebase-references.md`, `standards/frontmatter.md`, `standards/mvi.md`, `standards/structure.md`, `standards/templates.md`

---

## Related Context

- **Core Navigation** → `../navigation.md`
- **Core Standards** → `../standards/navigation.md`
- **Core System** → `../system/navigation.md`
- **Context System Overview** → `../context-system.md`

---

## Notas de versión

- **v2.0 (2026-08-08)**: se corrigen las referencias a `operations/navigation.md`, `guides/navigation.md`, `standards/navigation.md` y `examples/navigation.md` (no existen; las subcarpetas no tienen archivo de navegación propio). El árbol de estructura, las rutas rápidas y las secciones por tipo apuntan ahora a los archivos reales de cada subcarpeta, incluido `examples/navigation-examples.md` y `CHANGELOG.md`.
- **v1.0 (2026-02-15)**: versión original; apuntaba a archivos de navegación por subcarpeta que no existían en el disco y omitía la lista de archivos reales de cada subcarpeta.
