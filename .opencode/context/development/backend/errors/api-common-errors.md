<!-- Context: development/backend/errors | Priority: medium | Version: 1.1 | Updated: 2026-08-06 -->

# Errors: Common API Gotchas

**Purpose**: Known issues and solutions when working with the API layer.

---

## Auth Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `MissingSecret` in middleware | `AUTH_SECRET` env var not set or invalid | Generate with `openssl rand -base64 32`, add to `.env` |
| 401 on every route | `auth()` returns null | Check `auth()` is called at route start; verify middleware isn't blocking |
| 403 on own resource | Ownership check mismatch | `checkOwnership()` compares `prompt.userId` with `session.user.id` |

---

## Isolation Errors

| Error | Cause | Fix |
|-------|-------|-----|
| **PATCH usage sin auth** (defecto preexistente, corregido Fase D) | `app/api/prompts/[id]/usage/route.ts` hacía `update` sin `auth()` ni `where.userId` — cualquiera podía incrementar `usageCount` de cualquier prompt | `auth()` → 401; `where: { id, userId }` → 404 `promptNotFound` si no existe o no es suyo |
| GET devuelve prompts de todos | `findMany` sin `where.userId` (página y API) | Añadir `where.userId = session.user.id`; exigir sesión (401) |
| Contadores globales | `_count.prompts` cuenta todos los usuarios | `_count: { select: { prompts: { where: { userId } } } }` |

**Reference**: `concepts/row-level-isolation-pattern.md`, `project-intelligence/living-notes.md`, `project-intelligence/technical-domain.md` Known Pitfalls

---

## Build/Deploy Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Static pre-render fail | Pages using `auth()` missing `force-dynamic` | Add `export const dynamic = 'force-dynamic'` |
| ESLint build break | `react/no-unescaped-entities` on apostrophes | Use `&apos;` or `{'`'}` in JSX |
| Prisma Client not found | `prisma generate` not run postinstall | Add `"postinstall": "prisma generate"` to package.json |

---

## Import/Export Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Import creates duplicates | Same title+userId pair exists | Import uses upsert: matches by `id` first, then `title+userId` |
| v1.0 import fails | Old format missing N:M arrays | Dual parser handles both v1.0 (string fields) and v2.0 (arrays) |
| Export missing relations | N:M includes not in Prisma query | Verify `.findMany({ include: { platforms: { include: { platform: true } } } })` |

---

## DB Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `onDelete: Cascade` surprise | Deleting a Prompt removes all junction records | Documented behavior — cascade on both FKs for all 6 junction tables |
| Junction table FK violation | Referencing non-existent entity ID | All relations use `connect` or `create` within Prisma transactions |
| DELETE user fails (FK) | User has prompts → FK constraint blocks `user.delete` | `prisma.$transaction([prisma.prompt.deleteMany({ where: { userId } }), prisma.user.delete({ where: { id } })])` (Fase C) |

**Reference**: `project-intelligence/living-notes.md`, `project-intelligence/technical-domain.md` Known Pitfalls
