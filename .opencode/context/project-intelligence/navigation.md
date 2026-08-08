<!-- Context: project-intelligence/nav | Priority: high | Version: 2.6 | Updated: 2026-08-08 (v2.6: catálogo de errores dividido en 13 archivos temáticos) -->

# Project Intelligence

> Start here for quick project understanding. These files bridge business and technical domains.

## Structure

```
.opencode/context/project-intelligence/
├── navigation.md              # This file - quick overview
├── concepts/
│   ├── business-domain.md     # Business context and problem statement
│   ├── technical-domain.md    # Stack, patterns, naming, standards, security
│   └── business-tech-bridge.md # How business needs map to solutions
├── lookup/
│   ├── decisions-log.md       # Major decisions with rationale (18 entries; #12-#18 live)
│   ├── living-notes.md        # Active issues, debt, open questions
│   ├── decision-details.md    # Alternatives tables (#1-#11)
│   └── decision-archive.md    # Historical decisions #1-#11 (full text)
├── errors/
│   ├── tech-knowledge.md      # Error catalog index (13 thematic files)
│   ├── auth-errors.md         # NextAuth.js errors
│   ├── prisma-junction-errors.md · prisma-schema-errors.md  # Prisma errors
│   ├── deployment-errors.md · nextjs-build-errors.md       # Deploy & build
│   ├── filters-ui-errors.md · navigation-ui-errors.md · filter-state-errors.md
│   ├── security-errors.md · testing-errors.md · testing-mock-errors.md
│   ├── export-import-errors.md · lessons-checklist.md
│   └── (full list in tech-knowledge.md index)
└── development/
    ├── navigation.md          # Development knowledge index
    ├── concepts/              # API response, component refactor, i18n, delegation, upsert
    ├── examples/              # Clean route, mock entity upsert, mock transaction, segment
    ├── guides/                # Deploy to Vercel, refactor large components, rollback
    └── lookup/                # Commands, mock coverage table, files list
```

## Quick Routes

| What You Need | File | Description |
|---------------|------|-------------|
| Understand the "why" | `concepts/business-domain.md` | Problem, users, value proposition |
| Understand the "how" | `concepts/technical-domain.md` | Stack, patterns, naming, standards, security |
| Tech stack at a glance | `concepts/technical-domain.md` → Primary Stack | Framework, DB, ORM, auth, deploy |
| Copy-paste API pattern | `concepts/technical-domain.md` → Code Patterns | Auth→Zod→Prisma→Response flow |
| Component pattern | `concepts/technical-domain.md` → Code Patterns | Server default, client when needed |
| Naming conventions | `concepts/technical-domain.md` → Naming Conventions | kebab-case, PascalCase, camelCase |
| Code standards | `concepts/technical-domain.md` → Code Standards | Strict TS, Prisma, Server Components |
| Security requirements | `concepts/technical-domain.md` → Security Requirements | Auth, Zod, Prisma, env vars |
| See the connection | `concepts/business-tech-bridge.md` | Business → technical mapping |
| Know the context | `lookup/decisions-log.md` | Why decisions were made (18 entries; #12-#18 live, #1-#11 in archive) |
| Current state | `lookup/living-notes.md` | Active issues and open questions |
| Error catalog | `errors/tech-knowledge.md` | Index of 13 thematic error files with code examples |
| Pitfalls quick-ref | `concepts/technical-domain.md` → Known Pitfalls | High-level gotchas organized by domain |
| Refactor pattern | `development/concepts/component-refactor-pattern.md` | Split large components into segments |
| API response standards | `development/concepts/api-response-standards.md` | Response shape conventions for API routes |
| i18n pattern | `development/concepts/i18n-next-intl-pattern.md` | next-intl setup and usage without routing |
| Task delegation | `development/concepts/task-delegation-workflow.md` | CodeReviewer gate per subtask |
| Upsert pattern | `development/concepts/upsert-entity-pattern.md` | Upsert for global entities |
| Mock patterns | `development/examples/mock-entity-upsert.md` | Prisma mock methods checklist |
| Transaction mocks | `development/examples/mock-transaction.md` | Prisma $transaction mock pattern |
| Clean route example | `development/examples/clean-route-handler.md` | Minimal POST route handler example |
| Segment example | `development/examples/segment-component.md` | Form segment component pattern |
| Deploy guide | `development/guides/deploy-to-vercel.md` | Manual deploy with env vars |
| Refactor guide | `development/guides/refactor-large-components.md` | Procedure for refactoring large components |
| Rollback procedures | `development/guides/rollback-procedures.md` | Rollback steps after deploys |
| Commands | `development/lookup/plan-c-commands.md` | Test, git, deploy, task CLI |
| Mock coverage table | `development/lookup/mock-coverage-table.md` | Prisma mock coverage per entity |
| Files list | `development/lookup/plan-c-files-list.md` | Files modified in Plan C |

## Quick Reference (from technical-domain.md v2.0)

```
Stack:  Next.js 14 + TypeScript 5.5 + PostgreSQL 14 + Prisma 5.19 + TailwindCSS/shadcn/ui
Auth:   NextAuth.js v5 (JWT) + Credentials + bcryptjs
API:    Next.js App Router → auth() → Zod.parse → prisma.create → Response
UI:     Server Components default, "use client" for interactivity only
DB:     Prisma ORM, junction tables w/ compound keys (@@id), never raw SQL
```

## Usage

**New Team Member / Agent**:
1. Start with `navigation.md` (this file)
2. Read `concepts/technical-domain.md` for all code patterns and standards
3. Follow onboarding checklist in each file

**Quick Reference**:
- Code patterns → `concepts/technical-domain.md` (Code Patterns section)
- Naming rules → `concepts/technical-domain.md` (Naming Conventions table)
- Security → `concepts/technical-domain.md` (Security Requirements section)
- Business context → `concepts/business-domain.md`

## Integration

This folder is referenced from:
- `.opencode/context/core/standards/project-intelligence.md` (standards and patterns)
- `.opencode/context/core/system/context-guide.md` (context loading)

See `.opencode/context/core/concepts/context-system.md` for the broader context architecture.

## Maintenance

Keep this folder current:
- Update when business direction changes
- Document decisions as they're made
- Review `lookup/living-notes.md` regularly
- Archive resolved items from `lookup/decisions-log.md`

**Management Guide**: See `.opencode/context/core/standards/project-intelligence-management.md` for complete lifecycle management including:
- How to update, add, and remove files
- How to create new subfolders
- Version tracking and frontmatter standards
- Quality checklists and anti-patterns
- Governance and ownership

See `.opencode/context/core/standards/project-intelligence.md` for the standard itself.

## Evolución

- **v2.6 (2026-08-08)**: catálogo de errores dividido en 13 archivos temáticos (<200 líneas c/u) con índice en `errors/tech-knowledge.md`; actualizadas referencias en `concepts/technical-domain.md` y `development/examples/*`.
- **v2.5 (2026-08-08)**: organización por función de los archivos raíz — `business-domain.md`, `technical-domain.md` y `business-tech-bridge.md` movidos a `concepts/`; `decisions-log.md` y `living-notes.md` movidos a `lookup/`. Actualizadas todas las referencias internas y externas.
- **v2.4 (2026-08-06)**: mapa reconciliado con la estructura real de carpetas — `lookup/` (decision-details.md y decision-archive.md) vive al nivel raíz de la inteligencia del proyecto, no dentro de `errors/`; el árbol de `development/` refleja los archivos reales (concepts: api-response-standards, component-refactor-pattern, i18n-next-intl-pattern, task-delegation-workflow, upsert-entity-pattern; examples: clean-route-handler, mock-entity-upsert, mock-transaction, segment-component; guides: deploy-to-vercel, refactor-large-components, rollback-procedures; lookup: mock-coverage-table, plan-c-commands, plan-c-files-list). Rutas rápidas ampliadas con los archivos existentes y actualizado el registro de decisiones (18 entradas; #12–#18 vivas). Las referencias anteriores se conservan como histórico en las secciones precedentes.
