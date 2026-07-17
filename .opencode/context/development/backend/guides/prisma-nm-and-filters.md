<!-- Context: development/backend/guides | Priority: high | Version: 1.0 | Updated: 2026-07-16 -->

# Guide: N:M AND Filter Pattern in Prisma

**Problem**: When filtering by N:M relations (e.g., categories, tags), using `some: { categoryId: { in: ids } }` produces OR logic — a prompt matching ANY selected category is returned. Users expect AND logic: a prompt must match ALL selected categories.

**Solution**: Create individual `some` conditions for each selected value and combine them with `where.AND`.

---

## The Pattern

### Building N:M AND Conditions

```typescript
import { Prisma } from "@prisma/client"

const where: Prisma.PromptWhereInput = {}
const andConditions: Prisma.PromptWhereInput[] = []

// For each selected category, add a separate `some` condition
if (categoryIds?.length > 0) {
  for (const catId of categoryIds) {
    andConditions.push({
      categories: { some: { categoryId: catId } },
    })
  }
} else if (categoryId) {
  andConditions.push({
    categories: { some: { categoryId } },
  })
}

// Same pattern for all N:M relations
for (const tagId of tagIds) {
  andConditions.push({ tags: { some: { tagId } } })
}
for (const platId of platformIds) {
  andConditions.push({ platforms: { some: { platformId: platId } } })
}
for (const cpId of clientProjectIds) {
  andConditions.push({ clientProjects: { some: { clientProjectId: cpId } } })
}
for (const ucId of useCaseIds) {
  andConditions.push({ useCases: { some: { useCaseId: ucId } } })
}
```

### Merging with Search `where.AND`

Search also uses `where.AND`. Merge both arrays:

```typescript
if (andConditions.length > 0) {
  if (where.AND) {
    // Merge: search AND conditions + N:M filter AND conditions
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : [where.AND]),
      ...andConditions,
    ]
  } else {
    where.AND = andConditions
  }
}
```

---

## N:M Relations in This Project

| Relation | Junction Table | Filter Param | Entity Key |
|---|---|---|---|
| categories | PromptCategory | categoryIds | categoryId |
| tags | PromptTag | tagIds | tagId |
| platforms | PromptPlatform | platformIds | platformId |
| clientProjects | PromptClientProject | clientProjectIds | clientProjectId |
| useCases | PromptUseCase | useCaseIds | useCaseId |

---

## Key Rules

1. **Never use `{ in: ids }` for N:M multi-select** — that produces OR logic
2. **Each selected value = one `some` condition** — combined with AND
3. **Always merge** N:M conditions into `where.AND` with search conditions
4. **Handle single value** (legacy `categoryId`, `platform`) — convert to same pattern
5. **Empty array = no filter** — skip adding conditions entirely

---

## What to Avoid

```typescript
// ❌ WRONG: OR logic — matches if ANY category matches
where.categories = { some: { categoryId: { in: categoryIds } } }

// ❌ WRONG: Overwriting existing where.AND from search
if (andConditions.length > 0) {
  where.AND = andConditions  // Lost the search AND conditions!
}

// ✅ CORRECT: Individual some conditions merged with search
for (const catId of categoryIds) {
  andConditions.push({ categories: { some: { categoryId: catId } } })
}
// ... merge with where.AND
```

---

**Reference**: `app/(app)/prompts/page.tsx` (lines 70-126), `app/api/prompts/route.ts` (lines 69-125)
**Related**: `frontend/concepts/filter-patterns.md`, `backend/lookup/searchable-fields-dimensions.md`
