<!-- Context: development/integration/concepts | Priority: medium | Version: 1.0 | Updated: 2026-07-14 -->

# Concept: Export/Import Dual Format

**Core Idea**: Export produces JSON v2.0 with N:M relations as arrays of names. Import accepts both v2.0 (arrays) and v1.0 (legacy string fields) via a dual parser. Uses upsert for idempotent re-import.

**Key Points**:
- **Export**: `GET /api/export/prompts` → JSON with `version: "2.0"`, prompts with arrays of platform/category/tag/etc names
- **Import v2.0**: Arrays of names (e.g., `platforms: ["CURSOR", "CHATGPT"]`) → resolved via `findUnique` → `connect` or `create`
- **Import v1.0**: Legacy string fields (e.g., `platform: "CURSOR"`) — accepted via `promptV1Schema`
- **Version detection**: `body.version === "2.0"` in import route
- **Upsert logic**: Match by `id` first, then by `title + userId` combination
- **Atomicity**: Entire import wrapped in `prisma.$transaction`

**Export flow**:
```
auth() → findMany({ include all N:M }) → map to { version: "2.0", prompts: [...] } → Response.json()
```

**Import flow**:
```
auth() → detect version → parse (v1Schema or v2Schema) → for each prompt: upsert → for each junction: resolve entities → transaction
```

**Schema version detection**:
```typescript
// Import uses both schemas
const promptV2Schema = promptBaseSchema.extend({
  platforms: z.array(z.string()).optional(),       // v2.0: arrays
  categories: z.array(z.string()).optional(),
  platform: z.string().nullable().optional(),       // v1.0 compat: strings
  clientOrProject: z.string().nullable().optional(),
})

const promptV1Schema = promptBaseSchema.extend({
  platform: z.string().nullable().optional(),       // v1.0: strings only
  category: z.string().nullable().optional(),
})
```

**Reference**: `app/api/export/prompts/route.ts`, `app/api/import/prompts/route.ts`
