<!-- Context: development/frontend/concepts | Priority: high | Version: 1.1 | Updated: 2026-07-16 -->

# Concept: URL-Driven Multi-Dimension Filters

**Core Idea**: All filter state lives in URL search params (`useSearchParams`). Users can filter across 8 dimensions simultaneously with AND logic. Filter URLs are shareable and bookmarkable.

**Key Points**:
- **8 filter dimensions**: categoryIds, tagIds, platformIds, status, isFavorite, language, clientProjectIds, useCaseIds
- **AND logic**: ALL selected filters must match (Prisma `where.AND` for search, `where.{relation}.some` for taxonomy)
- **URL-driven**: `PromptFilters` reads `searchParams`, updates via `router.push({ search: params.toString() })`
- **Server component**: `page.tsx` reads `searchParams`, builds Prisma `where` clause, returns filtered data
- **Multi-select**: Checkbox lists for categories, tags, platforms, status, language; single-select for favorites
- **Persistence**: Filters reset on page navigation but can be bookmarked

**Filter flow**:
```
URL searchParams → Server Component reads params → Builds Prisma where clause → findMany → Rendered list

Client: PromptFilters reads searchParams → User toggles filter → router.push with new params → Server re-renders
```

**Example URL**: `/prompts?status=TESTED&language=en&isFavorite=true&categoryIds=abc123&tagIds=def456,ghi789`

**Prisma query construction — Search** (case-insensitive, multi-word AND):
```typescript
if (search) {
  const searchWords = search.trim().split(/\s+/).filter(w => w.length > 0)
  if (searchWords.length > 0) {
    where.AND = searchWords.map(word => ({
      OR: [
        { title: { contains: word, mode: "insensitive" } },
        { description: { contains: word, mode: "insensitive" } },
        { body: { contains: word, mode: "insensitive" } },
        { prePrompt: { contains: word, mode: "insensitive" } },
        { manualDeUso: { contains: word, mode: "insensitive" } },
      ],
    }))
  }
}
```

**Prisma query construction — N:M Filters** (AND logic per relation):
```typescript
const andConditions: Prisma.PromptWhereInput[] = []

// Each selected category requires a separate `some` condition (AND)
for (const catId of categoryIds) {
  andConditions.push({
    categories: { some: { categoryId: catId } },
  })
}
// Same pattern for tags, platforms, clientProjects, useCases

// Merge with existing search where.AND
if (andConditions.length > 0) {
  if (where.AND) {
    where.AND = [...(Array.isArray(where.AND) ? where.AND : [where.AND]), ...andConditions]
  } else {
    where.AND = andConditions
  }
}
```

**Reference**: `components/prompt/PromptFilters.tsx`, `app/(app)/prompts/page.tsx`, `app/api/prompts/route.ts`
**Related**: `backend/guides/prisma-nm-and-filters.md`, `backend/lookup/searchable-fields-dimensions.md`
