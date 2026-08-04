<!-- Context: development/data/nav | Priority: high | Version: 1.1 | Updated: 2026-07-14 -->

# Data Layer

**Purpose**: Database access patterns for this project (Prisma ORM + PostgreSQL)

---

## Structure

```
data/
├── navigation.md
├── concepts/
│   ├── prisma-patterns.md       # Client setup, queries, transactions
│   └── prisma-junction-tables.md # N:M with compound keys + Cascade
├── lookup/
│   └── prisma-cheatsheet.md     # Quick Prisma query reference
└── errors/
    └── prisma-gotchas.md        # Common Prisma issues + solutions
```

---

## Quick Routes

| Task | Path |
|------|------|
| **Prisma client & queries** | `concepts/prisma-patterns.md` |
| **Junction tables pattern** | `concepts/prisma-junction-tables.md` |
| **Quick query reference** | `lookup/prisma-cheatsheet.md` |
| **Common errors** | `errors/prisma-gotchas.md` |

---

## Related Context

- **Backend API patterns** → `../backend/concepts/nextjs-api-patterns.md`
- **Technical domain** → `../../project-intelligence/technical-domain.md`
- **Core Standards** → `../../core/standards/code-quality.md`
