<!-- Context: project-intelligence/development/clean-route | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Example: Clean Route POST Handler

**Core Idea**: After extracting logic to separate modules, the route handler becomes pure orchestration: Auth → Parse → Dispatch → Response.

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { importV1Schema, importV2Schema } from "../schemas"
import { importV1 } from "../import-v1"
import { importV2 } from "../import-v2"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id
    const body = await request.json()
    const isV2 = body.version === "2.0"
    let result: { imported: number; upserted: number; created: number }
    if (isV2) {
      const data = importV2Schema.parse(body)
      result = await importV2(data, userId)
    } else {
      const data = importV1Schema.parse(body)
      result = await importV1(data, userId)
    }
    return NextResponse.json({
      success: true,
      imported: { prompts: result.imported, upserted: result.upserted, created: result.created },
      format: isV2 ? "2.0" : "1.0",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid import format", details: error.errors }, { status: 400 })
    }
    console.error("Error importing prompts:", error)
    return NextResponse.json({ error: "Failed to import prompts" }, { status: 500 })
  }
}
```

**Before/After**: 663 lines → 63 lines. Extraction to `schemas.ts`, `upsert-entity.ts`, `import-v2.ts`, `import-v1.ts`.

**Reference**: `app/api/import/prompts/route.ts`

**Related**:
- concepts/api-response-standards.md
- concepts/component-refactor-pattern.md
