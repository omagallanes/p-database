<!-- Context: project-intelligence/development/mock-upsert | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Example: Mock Pattern for Prisma Entity Upsert

**Core Idea**: Mock all Prisma methods an entity uses with `jest.fn().mockResolvedValue()`. Entities with upsert/creation need `findFirst`, `findUnique`, `create`, and optionally `update`.

**Key Points**:
- `findFirst` → used by `upsertEntity()`: mock `null` if new entity, `{ id }` if existing
- `findUnique` → used by `upsertCategory()`/`upsertTag()`: mock `null` if new, `{ id }` if existing
- `create` → always return `{ id: "..." }` (minimum required field)
- Check the ACTUAL handler code — don't assume which methods are used

```typescript
// Entity with upsert (new entity scenario)
platform: {
  findFirst: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: "platform-1" }),
},

// Entity with findUnique + create (new entity scenario)
category: {
  findUnique: jest.fn().mockResolvedValue(null),  // ← often forgotten!
  findFirst: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: "cat-1" }),
  update: jest.fn().mockResolvedValue({ id: "cat-1" }),
},
```

**Validation Checklist**: findFirst, findUnique, findMany, create, update, upsert, delete, deleteMany.

**Reference**: `tests/api/import.test.ts`

**Related**:
- lookup/mock-coverage-table.md (per-entity method list)
- examples/mock-transaction.md
- errors/testing-mock-errors.md (§M-01)
