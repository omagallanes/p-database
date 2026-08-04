<!-- Context: development/backend/concepts | Priority: high | Version: 1.0 | Updated: 2026-07-14 -->

# Concept: Next.js API Route Pattern

**Core Idea**: Every API route follows `Auth → Zod validation → Prisma query → NextResponse` with consistent error handling returning `{ data }` or `{ error }` JSON.

**Key Points**:
- `auth()` call is the FIRST operation in every protected route
- Zod schemas defined at top of each route file
- `try/catch` with typed error handling (Zod vs generic)
- Ownership checks for resources: admins bypass, users scoped to own data
- All protected routes check `session?.user` before processing

**Quick Example**:
```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json(
      { error: "Unauthorized" }, { status: 401 }
    )
    const body = await request.json()
    const data = createPromptSchema.parse(body)      // Zod validation
    const prompt = await prisma.prompt.create({       // Prisma query
      data: { ...data, userId: session.user.id }
    })
    return NextResponse.json({ data: prompt }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json(
      { error: "Invalid input", details: error.errors }, { status: 400 }
    )
    return NextResponse.json(
      { error: "Failed to create prompt" }, { status: 500 }
    )
  }
}
```

**Pattern variations**:
- **GET list**: `searchParams` → build Prisma `where` clause → `findMany` with includes
- **GET by ID**: `params.id` → `findUnique` with includes + ownership check
- **PUT/DELETE**: auth + ownership check → validate → mutate → respond
- **PATCH usage**: no auth needed (tracks public usage count)

**Reference**: `app/api/prompts/route.ts`, `app/api/prompts/[id]/route.ts`

**Related**: `lookup/api-routes.md`, `errors/api-common-errors.md`
