<!-- Context: project-intelligence/notes | Priority: high | Version: 1.6 | Updated: 2026-08-06 -->

# Living Notes

> Active issues, technical debt, gotchas, and active projects. Based on verified analysis of the codebase.

## Technical Debt

| Item | Impact | Priority | Mitigation |
|------|--------|----------|------------|
| Legacy string fields on Prompt | Data duplication with N:M junction tables | Medium | Remove after confirming no v1.0 imports in production |

### Resolved (2026-08-06, Pulido)
- ~~Hardcoded credentials in seed~~ → `prisma/seed.ts` ahora usa `process.env.SEED_ADMIN_PASSWORD` / `SEED_USER_PASSWORD` (decisión #13).
- ~~Rate limiting not implemented~~ → implementado sin Upstash (BD): límite por cuenta (`failedLoginAttempts` + `lockoutUntil`, 5 fallos → 15 min) en login y cambio de contraseña, y límite por dirección IP (tabla `IpAttempt`, 5 fallos → 15 min, tolerante a fallos en BD, tiempos igualados); revocación de sesiones con `tokenVersion`; campo `isActive`. Ver `development/backend/concepts/auth-hardening-pattern.md`.
- ~~Missing `/auth/error` page~~ → página creada e internacionalizada (2026-08-06) en `app/(auth)/auth/error/`; los fallos de autenticación muestran la página propia (sección histórica más abajo).

### Legacy String Fields on Prompt Model
**Priority**: Medium
**Impact**: `platform`, `useCase`, `clientOrProject`, `modelHint` fields on the `Prompt` model coexist with N:M junction tables (`PromptPlatform`, `PromptClientProject`, `PromptUseCase`, `PromptModelHint`). Data can be duplicated or inconsistent.
**Root Cause**: Kept for backwards compatibility with v1.0 imports (see `app/api/import/prompts/route.ts:42-50`).
**Proposed Solution**: Remove fields after confirming no v1.0 imports in production.
**Status**: Deferred

## Known Issues

| Issue | Severity | Workaround | Status |
|-------|----------|------------|--------|
| `force-dynamic` required for auth pages | Medium | Add `export const dynamic = 'force-dynamic'` | Known |
| ESLint `react/no-unescaped-entities` | Medium | Escape apostrophes or disable rule | Known |

> **Histórico**: la fila "Missing `/auth/error` page" se retiró de esta tabla el 2026-08-06 porque la página se creó (ver sección resuelta abajo).

### Missing `/auth/error` Page (RESUELTO 2026-08-06)
**Severity**: High (resuelto)
**Impact**: Referenced in `lib/auth.ts:13` (`error: "/auth/error"`) and `middleware.ts:12` as a public route, but the page did not exist — no directory under `app/(auth)/auth/error/`. Auth errors fell through to Next.js default error page.
**Workaround**: Users saw the browser-default error on auth failures.
**Root Cause**: Page was never created after auth configuration was set up.
**Status**: **Resolved (2026-08-06)** — page created and internationalized at `app/(auth)/auth/error/`; the section is kept for the historical record.

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

- **Seed passwords**: `prisma/seed.ts` usa `process.env.SEED_ADMIN_PASSWORD` / `SEED_USER_PASSWORD` (sin fallback débil) desde el Pulido 2026-08-06 — las contraseñas antiguas siguen expuestas en git history (pendiente P-01, ver `docs/dodp.md`). Ejecutar el seed requiere definir esas env vars.
- **All 6 junction tables** (`PromptTag`, `PromptPlatform`, `PromptClientProject`, `PromptUseCase`, `PromptModelHint`, `PromptCategory`) use `onDelete: Cascade` on **both** foreign keys — deleting a Prompt automatically removes all its junction records, and deleting a Tag/Platform/etc. removes all its prompt associations.
- **Export v2.0** transforms N:M relations to arrays of names (e.g., `platforms: ["CURSOR"]`). The **import parser** accepts both v2.0 (arrays) and v1.0 (legacy string fields). Version detection is via `body.version === "2.0"` in `app/api/import/prompts/route.ts:627`.
- **Middleware** (`middleware.ts`) protects all routes except `/auth/signin`, `/auth/signup`, and `/auth/error` — la página `/auth/error` ya existe (creada 2026-08-06); antes era una ruta pública sin página (ver sección resuelta).
- **Prisma migrations** (`/prisma/migrations`) are gitignored (`.gitignore:41`) — migration history is NOT in the repository. Run `npx prisma migrate dev` on fresh clones.
- **PromptForm.tsx** is 769 lines — the largest component in the project (reduced from 1,021 via Plan C segment split) and a potential refactor target.
- **Auth secret must be generated** with `openssl rand -base64 32` — the `.env.example` placeholder value will not work in production.
- **Jest + next-intl v4 (ESM-only)**: `next/jest` antepone `/node_modules/` a `transformIgnorePatterns`, así que añadir patrones a `customJestConfig` NO transforma next-intl. La config debe sobrescribirlos tras `createJestConfig` (`jest.config.js`): `"/node_modules/(?!(next-auth|@auth/core|@auth/prisma-adapter|next-intl|use-intl|intl-messageformat|@formatjs)/)"`. Además `getTranslations` de `next-intl/server` NO funciona en Jest (stub que lanza); los tests de API deben simular `next-intl/server` con los catálogos reales.
- **Localización por `accept-language`**: solo se sirven los locales activos (en-GB, es-ES); los declarados sin traducción (es-MX, ca, gl...) caen al respaldo en-GB. Para activar un idioma nuevo: añadirlo a `activeLocales` en `i18n/locales.ts` y crear su catálogo con paridad total (verificado por `tests/i18n/messages.test.ts`).

## Active Projects

| Project | Goal | Timeline |
|---------|------|----------|
| Production deployment to Vercel | Deployed (2026-04/07) — smoke tests verified, 22 static pages built | Done |
| Fase A — Interfaz (sidebar colapsable, filtros ocultables, preferencias en cuenta) | Implementado 2026-08-06 — ver `development/frontend/concepts/ui-preferences-pattern.md` | Done |
| Fase B — Perfil en pestañas + personalización (idioma, tema, color, orden filtros, columnas) | Implementado 2026-08-06 — ver `development/frontend/concepts/theme-accent-pattern.md` | Done |
| Pulido — Seguridad (rate limiting, revocación tokenVersion, anti-FOUC, seed seguro) | Implementado 2026-08-06 — ver `development/backend/concepts/auth-hardening-pattern.md` | Done |
| Fase D — Aislamiento por usuario (row-level ownership) | **Completado 2026-08-06** (decisión #14) — ver `development/backend/concepts/row-level-isolation-pattern.md`; verificado: 388 pruebas, 40 suites, 100 % superadas, cobertura 79.63 % de líneas | Done |
| Fase C — Pestaña Usuarios (admin) | **Completado 2026-08-06** (decisión #15) — isActive, protección último admin, borrado transaccional; verificado: 388 pruebas, 40 suites, 100 % superadas | Done |
| Etapa final — Taxonomía + Compartir | **Completado 2026-08-06** (decisión #16) — 3 catálogos, /taxonomy/*, /shared; verificado: 388 pruebas, 40 suites, 100 % superadas | Done |

## Pendientes reales (docs/dodp.md)

| ID | Tarea | Estado |
|----|-------|--------|
| P-01 | Rotar las contraseñas reales de las cuentas del historial de git | Pendiente — requiere acción del propietario de las cuentas |
| P-02 | Internacionalización de los 8 idiomas restantes (es-MX, ca, ca-ES-valencia, gl, pt-PT, fr, ru, zh-CN) | Pendiente — trabajo futuro por idioma |
| P-03 | Rotar el token de Vercel descargado al entorno local | Pendiente — requiere acción del propietario en Vercel |

Detalle completo (riesgo, motivo de exclusión y cómo abordarlas) en `docs/dodp.md`.

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
