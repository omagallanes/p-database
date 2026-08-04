<!-- Context: project-intelligence/notes | Priority: high | Version: 1.2 | Updated: 2026-08-04 -->

# Living Notes

> Active issues, technical debt, gotchas, and active projects. Based on verified analysis of the codebase.

## Technical Debt

| Item | Impact | Priority | Mitigation |
|------|--------|----------|------------|
| Hardcoded credentials in seed | Security risk — passwords in plain text in repo | High | Move to env vars with dev fallback |
| Legacy string fields on Prompt | Data duplication with N:M junction tables | Medium | Remove after confirming no v1.0 imports in production |
| Rate limiting not implemented | No API abuse protection | Medium | Implement with Upstash Redis when needed |

### Hardcoded Credentials in `prisma/seed.ts`
**Priority**: High
**Impact**: Passwords `G4VK2F56FTS96YDG` and `281116pDB` are hardcoded in plain text in the repository (`prisma/seed.ts:12,30`). Any commit exposes them permanently.
**Root Cause**: Seed file written without env var support.
**Proposed Solution**: Read admin/user passwords from `process.env` with fallback only in development mode.
**Status**: Acknowledged

### Legacy String Fields on Prompt Model
**Priority**: Medium
**Impact**: `platform`, `useCase`, `clientOrProject`, `modelHint` fields on the `Prompt` model coexist with N:M junction tables (`PromptPlatform`, `PromptClientProject`, `PromptUseCase`, `PromptModelHint`). Data can be duplicated or inconsistent.
**Root Cause**: Kept for backwards compatibility with v1.0 imports (see `app/api/import/prompts/route.ts:42-50`).
**Proposed Solution**: Remove fields after confirming no v1.0 imports in production.
**Status**: Deferred

### Rate Limiting Not Implemented
**Priority**: Medium
**Impact**: All API routes are unprotected against abuse. Feature flag `UPSTASH_ENABLED="false"` in both `.env.example` and `.env.production`. Upstash credentials (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) are empty.
**Root Cause**: Planned but not executed (Fase 4 scope was reduced).
**Proposed Solution**: Implement with Upstash Redis when rate limiting becomes necessary.
**Status**: Deferred

## Known Issues

| Issue | Severity | Workaround | Status |
|-------|----------|------------|--------|
| Missing `/auth/error` page | High | Next.js default error page shown instead | Known |
| `force-dynamic` required for auth pages | Medium | Add `export const dynamic = 'force-dynamic'` | Known |
| ESLint `react/no-unescaped-entities` | Medium | Escape apostrophes or disable rule | Known |

### Missing `/auth/error` Page
**Severity**: High
**Impact**: Referenced in `lib/auth.ts:13` (`error: "/auth/error"`) and `middleware.ts:12` as a public route, but the page does not exist — no directory under `app/(auth)/auth/error/`. Auth errors fall through to Next.js default error page.
**Workaround**: Users see browser-default error on auth failures.
**Root Cause**: Page was never created after auth configuration was set up.
**Status**: Known

### `force-dynamic` Required for Auth Pages
**Severity**: Medium
**Impact**: Pages using `auth()` fail during static pre-render if `force-dynamic` is not set. Affects: `app/(auth)/auth/signin/page.tsx`, `app/(auth)/auth/signup/page.tsx`, `app/(app)/auth/profile/page.tsx`, `app/(app)/prompts/page.tsx`, `app/(app)/prompts/new/page.tsx`, `app/(app)/prompts/[id]/page.tsx`, and `app/api/users/route.ts`.
**Workaround**: Each affected page has `export const dynamic = 'force-dynamic'`.
**Status**: Known (documented in governance files)

### ESLint Unescaped Entities
**Severity**: Medium
**Impact**: ESLint rule `react/no-unescaped-entities` breaks builds on apostrophes in JSX. No custom ESLint config beyond `next/core-web-vitals`.
**Workaround**: Use `&apos;` or `{`'`}` in JSX.
**Status**: Resolved — configurado como warn en Plan A (commit 9d78f7e)

## Gotchas for Maintainers

- **Seed passwords are in plain text** in `prisma/seed.ts` — do NOT deploy to production without addressing this. The passwords `G4VK2F56FTS96YDG` and `281116pDB` will be in your git history.
- **All 6 junction tables** (`PromptTag`, `PromptPlatform`, `PromptClientProject`, `PromptUseCase`, `PromptModelHint`, `PromptCategory`) use `onDelete: Cascade` on **both** foreign keys — deleting a Prompt automatically removes all its junction records, and deleting a Tag/Platform/etc. removes all its prompt associations.
- **Export v2.0** transforms N:M relations to arrays of names (e.g., `platforms: ["CURSOR"]`). The **import parser** accepts both v2.0 (arrays) and v1.0 (legacy string fields). Version detection is via `body.version === "2.0"` in `app/api/import/prompts/route.ts:627`.
- **Middleware** (`middleware.ts`) protects all routes except `/auth/signin`, `/auth/signup`, and `/auth/error` — but `/auth/error` doesn't exist (see Known Issues).
- **Prisma migrations** (`/prisma/migrations`) are gitignored (`.gitignore:41`) — migration history is NOT in the repository. Run `npx prisma migrate dev` on fresh clones.
- **PromptForm.tsx** is 769 lines — the largest component in the project (reduced from 1,021 via Plan C segment split) and a potential refactor target.
- **Auth secret must be generated** with `openssl rand -base64 32` — the `.env.example` placeholder value will not work in production.

## Active Projects

| Project | Goal | Timeline |
|---------|------|----------|
| Production deployment to Vercel | Deployed (2026-04/07) — smoke tests verified, 22 static pages built | Done |

## What Works Well

- **Clean API route pattern**: Auth → Zod schema validation → Prisma query → Response. Consistent across all routes.
- **N:M junction table pattern**: Compound keys (`@@id([promptId, platformId])`) with `onDelete: Cascade` on both foreign keys. Clean, normalized relational design.
- **Dual-format export/import**: Export produces v2.0 with array-based N:M relations; import accepts both v2.0 and v1.0 (legacy string fields). Backward-compatible without breaking existing data.
- **URL-driven filter parameters**: `PromptFilters.tsx` uses `useSearchParams()` enabling shareable filter URLs (e.g., `/prompts?categoryIds=...&tagIds=...`).
- **Prisma binaryTargets**: Configured for multiplatform deployment (`native`, `linux-musl-openssl-3.0.x`, `linux-musl-arm64-openssl-3.0.x`, `debian-openssl-3.0.x`).

## Data State

| Item | Value | Notes |
|------|-------|-------|
| Prompts in PROD | 17 | All assigned category "existentes" |
| Category "existentes" | slug: `existentes` | Created manually in Neon console, assigned via temp admin endpoint (2026-07-17) |

## Related Files

- `decisions-log.md` — Past decisions that inform current state
- `business-domain.md` — Business context for current priorities
- `technical-domain.md` — Technical context and architecture
- `business-tech-bridge.md` — Context for current trade-offs
