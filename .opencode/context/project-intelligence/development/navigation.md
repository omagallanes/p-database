<!-- Context: project-intelligence/development/nav | Priority: medium | Version: 1.1 | Updated: 2026-08-06 -->

# Development Knowledge

> Project-specific development patterns, examples, guides, and reference data extracted from Plan C and related interventions.

## Structure

```
development/
├── navigation.md          # This file
├── concepts/              # Design decisions and principles
├── examples/              # Working code snippets and patterns
├── guides/                # Step-by-step procedures
└── lookup/                # Quick reference data
```

## Quick Routes

| What You Need | File |
|---------------|------|
| Refactor large components | `concepts/component-refactor-pattern.md` |
| API response standards | `concepts/api-response-standards.md` |
| Upsert pattern for entities | `concepts/upsert-entity-pattern.md` |
| CodeReviewer gate workflow | `concepts/task-delegation-workflow.md` |
| i18n con next-intl (sin enrutado) | `concepts/i18n-next-intl-pattern.md` |
| Mock Prisma upsert entities | `examples/mock-entity-upsert.md` |
| Mock Prisma $transaction | `examples/mock-transaction.md` |
| Segment component pattern | `examples/segment-component.md` |
| Clean route handler | `examples/clean-route-handler.md` |
| Refactor step-by-step | `guides/refactor-large-components.md` |
| Rollback procedures | `guides/rollback-procedures.md` |
| Deploy to Vercel | `guides/deploy-to-vercel.md` |
| Migración de schema (BD única Neon) | `guides/deploy-to-vercel.md` → sección "Migración de schema" |
| Commands reference | `lookup/plan-c-commands.md` |
| Mock coverage table | `lookup/mock-coverage-table.md` |
| Files modified per phase | `lookup/plan-c-files-list.md` |

## Related

- `technical-domain.md` — Code Patterns, Standards, Commands (updated with Plan C learnings)
- `errors/tech-knowledge.md` — Error catalog (testing errors extended with Plan C)
- `decisions-log.md` — Plan C decision entry
