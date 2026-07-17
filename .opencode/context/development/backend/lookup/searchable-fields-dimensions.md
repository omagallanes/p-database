<!-- Context: development/backend/lookup | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Lookup: Searchable Fields & Filter Dimensions

## Search Fields (5 fields, case-insensitive, multi-word AND)

| Field | Type | Prisma Condition | Notes |
|---|---|---|---|
| title | String? | `{ contains: word, mode: "insensitive" }` | Primary search field |
| description | String? | `{ contains: word, mode: "insensitive" }` | |
| body | String | `{ contains: word, mode: "insensitive" }` | Prompt content |
| prePrompt | String? | `{ contains: word, mode: "insensitive" }` | System-level instructions |
| manualDeUso | String? | `{ contains: word, mode: "insensitive" }` | Usage instructions |

**URL param**: `search`
**Pattern**: Multi-word → split by whitespace → ALL words must match (AND)
**Edge case**: Empty search → no filter applied

---

## Filter Dimensions (8 dimensions)

| Dimension | URL Param | Type | Filter Logic | Notes |
|---|---|---|---|---|
| Categories | categoryIds | string[] | AND (individual `some`) | N:M relation |
| Tags | tagIds | string[] | AND (individual `some`) | N:M relation |
| Platforms | platformIds | string[] | AND (individual `some`) | N:M relation |
| Client Projects | clientProjectIds | string[] | AND (individual `some`) | N:M relation |
| Use Cases | useCaseIds | string[] | AND (individual `some`) | N:M relation |
| Status | status | string[] | `in` (OR within dimension) | Single field |
| Language | language | string[] | `in` (OR within dimension) | Single field |
| Is Favorite | isFavorite | boolean | Exact match | Single field |

---

## N:M AND Filter Quick Reference

```typescript
// Standard pattern for ALL N:M filters:
const andConditions: Prisma.PromptWhereInput[] = []

for (const id of categoryIds) {
  andConditions.push({ categories: { some: { categoryId: id } } })
}
for (const id of tagIds) {
  andConditions.push({ tags: { some: { tagId: id } } })
}
// ... same for platforms, clientProjects, useCases

// Merge with search
if (andConditions.length > 0) {
  if (where.AND) {
    where.AND = [...(Array.isArray(where.AND) ? where.AND : [where.AND]), ...andConditions]
  } else {
    where.AND = andConditions
  }
}
```

---

## Combined Search + Filter Example

**URL**: `/prompts?search=guia%20desarrollo&categoryIds=cat1&categoryIds=cat2&status=TESTED`

```typescript
where.AND = [
  // Search: "guia" AND "desarrollo" must both match
  { OR: [{ title: { contains: "guia", mode: "insensitive" } }, ...] },
  { OR: [{ title: { contains: "desarrollo", mode: "insensitive" } }, ...] },
  // Categories: must have BOTH cat1 AND cat2
  { categories: { some: { categoryId: "cat1" } } },
  { categories: { some: { categoryId: "cat2" } } },
]
// status uses IN (OR within the dimension)
where.status = { in: ["TESTED"] }
```

---

**Reference**: `app/(app)/prompts/page.tsx`, `app/api/prompts/route.ts`
**Related**: `frontend/concepts/filter-patterns.md`, `backend/guides/prisma-nm-and-filters.md`
