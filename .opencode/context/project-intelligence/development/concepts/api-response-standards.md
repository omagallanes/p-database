<!-- Context: project-intelligence/development/api-response | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Concept: API Response Standards

**Core Idea**: All API endpoints must return a consistent JSON response envelope. Individual `[id]` endpoints use `{ data, success }`. List endpoints use `{ items, total }` or `{ data, success }` depending on pagination.

**Key Points**:
- **GET/PUT/DELETE `[id]`** → `NextResponse.json({ data: item, success: true })`
- **DELETE** → `{ data: { message: "Deleted" }, success: true }`
- **List GET** → `{ items: [...], total: number }` (paginado)
- **POST create** → `{ data: item, success: true }` (status 201)
- **Errors** → Always `{ error: string, details?: any }` with appropriate HTTP status (400/401/500)
- **Auth check** → First operation in every handler, return 401 `{ error: "Unauthorized" }`

**Example**:
```typescript
// [id] endpoints
return NextResponse.json({ data: prompt, success: true })

// List endpoint
return NextResponse.json({ items: prompts, total: count })

// Error
return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
```

**Reference**: `app/api/prompts/[id]/route.ts`

**Related**:
- concepts/task-delegation-workflow.md
- technical-domain.md (Code Standards)
