<!-- Context: project-intelligence/decisions | Priority: high | Version: 2.5 | Updated: 2026-08-06 (14 entradas; deprecated en lookup/decision-details.md) -->

# Decisions Log

---

## 1. SQLite → PostgreSQL (2026-04)

**Context**: Original SQLite lacked concurrent write support, connection pooling, and production readiness. Needed Vercel-compatible database.

**Decision**: Migrated to PostgreSQL 14+ via Prisma ORM. Neon for serverless.

**Rationale**: Production-ready, best Prisma support, Vercel/Neon compatibility.

**Impact**: ✅ Production-ready DB, concurrent access, pooling. ❌ Requires local PG (Docker). Risk: schema incompatibilities.

**Related**: `lookup/decision-details.md` #1

---

## 2. Railway → Vercel (2026-04-25)

**Context**: Docker+nginx/Traefik complexity outweighed value for a Next.js app.

**Decision**: Migrated to Vercel (standalone output, serverless functions). Neon PostgreSQL.

**Rationale**: First-class Next.js support, integrated PG, generous free tier, no Docker mgmt.

**Impact**: ✅ Git-push deploy, Neon PG, zero server mgmt. ❌ Serverless cold starts, 10s timeout. Risk: Vercel lock-in.

**Related**: `lookup/decision-details.md` #2

---

## 3. String Fields → N:M Junction Tables (2026-04-24)

**Context**: Prompt model used legacy string fields (`platform`, `useCase`, etc.) with no referential integrity, no multi-value support.

**Decision**: Created 4 entities + 4 junction tables with compound keys (`@@id`). Legacy fields preserved for v1.0 import compat.

**Rationale**: Referential integrity, multi-value support, slug-based uniqueness, independent CRUD.

**Impact**: ✅ Data integrity, multi-value, sortable entities. ❌ Schema complexity, dual-maintenance overhead. Risk: migration handled by idempotent `$transaction` script.

**Related**: `lookup/decision-details.md` #3

---

## 4. NextAuth.js JWT + Credentials (2026-04-18)

**Context**: Needed email/password auth without OAuth. Route protection required.

**Decision**: NextAuth.js v5 beta, JWT strategy, CredentialsProvider, PrismaAdapter.

**Rationale**: Well-integrated with Next.js App Router + Prisma. JWT avoids DB lookups per request (ideal for serverless).

**Impact**: ✅ Email/password auth, JWT with embedded role, middleware protection. ❌ No OAuth, JWT not revocable. Risk: `AUTH_SECRET` mgmt critical.

**Related**: `lookup/decision-details.md` #4

---

## 5. shadcn/ui + TailwindCSS (Original)

**Context**: Needed accessible, customizable, lightweight UI library integrated with TailwindCSS.

**Decision**: shadcn/ui (Radix + CVA) with purple-themed TailwindCSS design system.

**Rationale**: Source-owned components (no heavy bundle), Radix for accessibility, CVA for Tailwind-native styling.

**Impact**: ✅ 8 components, full source ownership, accessible, tree-shakeable. ❌ Manual updates. Risk: TailwindCSS upgrades may break CVA composition.

**Related**: `lookup/decision-details.md` #5

---

## 6. KILO → OAC Framework (2026-07-14)

**Context**: Custom KILO agent framework had no community support, diverged from standards.

**Decision**: Migrated to OAC (OpenAgents Control) with `.opencode/context/` structure, approval gates, editable agents.

**Rationale**: Documented agent management, structured context hierarchy, team collaboration.

**Impact**: ✅ Standardized context, approval gates, documented workflows. ❌ KILO prompts lost, team learns OAC. Risk: KILO governance knowledge loss mitigated by OAC context files.

**Related**: `lookup/decision-details.md` #6

---

## 7. VPS/Hetzner/Traefik Elimination (2026-07-14)

**Context**: VPS infra unused after Vercel migration. Files misled contributors.

**Decision**: Deleted `nginx.conf`, `traefik-*.yml`, `deploy.sh`, `docker-entrypoint.sh`. Docker Compose retained for local dev PG.

**Rationale**: Zero benefit post-Vercel; unused files caused confusion.

**Impact**: ✅ Simplified Vercel-only, cleaner repo, lower cognitive load. ❌ Lost Traefik routing/SSL control. Risk: Dockerfile still references deleted entrypoint and SQLite (currently broken).

**Related**: `lookup/decision-details.md` #7

---

## 8. Plan C — Technical Cleanup & Stabilization (2026-07-15)

**Context**: After Plan B (code deduplication), CodeReviewer identified residual issues: 3 broken test suites, 21 unused-vars warnings, 2 large components (1k+ lines), inconsistent API format, unverified type guard.

**Decision**: Executed 3 independent phases (no cross-dependencies):
- F1: Fix tests + unused-vars + type guard + API format standardization
- F2: Split `PromptForm.tsx` (1,022 → 769 lines, 4 extracted segments)
- F3: Split `import/prompts/route.ts` (663 → 63 lines, 4 extracted modules)

**Rationale**: Fix quality issues iteratively — each phase independently deployable. CodeReviewer gate per subtask prevented error accumulation.

**Impact**: ✅ 56/56 tests passing, 0 unused-vars, clean build, all features verified on production. Tags: `fase1-completa` (866c866), `fase2-completa` (9bf6043), `fase3-completa` (006a615). Deploy: manual via `source .env && npx vercel --prod`.

**Risk Mitigated**: M-01 (missing `findUnique` mock) caught by CodeReviewer gate. Auto-deploy disabled on `main` (`vercel.json`).

**Related**: `development/concepts/task-delegation-workflow.md`, `development/concepts/component-refactor-pattern.md`, `development/lookup/plan-c-files-list.md`

---

## 9. Temporary Admin Endpoint for Bulk Category Assignment (2026-07-17)

**Context**: Needed to assign the "existentes" category to all 17 existing prompts in PROD. No UI or permanent endpoint existed for bulk category assignment. Creating a full admin UI would have been disproportionate effort.

**Decision**: Created a disposable admin-only `GET` endpoint at `app/api/system/assign-category/route.ts` with `auth()` + `role === "admin"` guards. After execution, the file was deleted and the cleanup was deployed.

**Rationale**: Lower effort than building admin UI. GET endpoint (no body) was sufficient for this operation. Admin-only double-gate prevented unauthorized access during the brief window the endpoint existed.

**Impact**: ✅ All 17 prompts assigned "existentes" category in one request. ✅ No dead code left behind. ❌ Two extra deployments (add + remove). Risk: brief window of vulnerability if endpoint was discovered (mitigated by admin-only guard + immediate deletion).

**Execution**: `curl -X GET "https://p-database.vercel.app/api/system/assign-category"` via Vercel CLI token. 3 commits: `6302787` (create), `2201462` (temp auth removal for Vercel token), `9d54180` (delete endpoint + cleanup).

**Related**: `backend/examples/temp-admin-bulk-op.md`, `backend/concepts/nextjs-api-patterns.md`

---

## 10. Internacionalización con next-intl v4 sin enrutado (2026-08-06)

**Context**: La app estaba 100% en inglés hardcodeado. Se necesitaba soporte multilingüe (10 idiomas declarados: en-GB, es-ES, es-MX, ca, ca-ES-valencia, gl, pt-PT, fr, ru, zh-CN) con traducción completa es-ES en esta fase.

**Decision**: next-intl v4 en modo "without i18n routing": resolución del locale por cabecera `accept-language` (coincidencia exacta → prefijos `es`→`es-ES`, `en`→`en-GB` → fallback en-GB), sin prefijo de URL, sin middleware de routing, sin cookie propia, sin campo de preferencia en BD. Solo se sirven `activeLocales` (en-GB, es-ES); los demás declarados sin mensajes no se sirven. Selector de idioma diferido a otro plan de trabajo. Errores de API traducidos con `getTranslations({ locale, namespace: "Api" })` en las 17 rutas. Despliegue directo a PROD (nada en local).

**Rationale**: Opción más fácil y menos problemática según el usuario: sin cambios de sesión ni de BD, sin complejidad de enrutado; `accept-language` ya lo envía el navegador. next-intl v4 es compatible con Next.js 14 (peer deps) y su patrón oficial sin enrutado usa `headers()` en `getRequestConfig`.

**Impact**: ✅ 21 namespaces, 240 claves por idioma con paridad verificada por test; fechas y números con formato regional (`useFormatter`); 81/81 tests; desplegado a PROD (prompt-database-liard.vercel.app) y verificado en vivo. ❌ Sin selector ni persistencia de preferencia (diferido); 8 idiomas declarados sin traducir; Jest exige `transformIgnorePatterns` sobrescrito (next-intl v4 es ESM-only) y simular `next-intl/server` en tests de API. Risk: los q-values del header se ignoran (el orden del header manda; impacto mínimo).

**Related**: `development/concepts/i18n-next-intl-pattern.md`, `docs/plan-traduccion-i18n.md`, `technical-domain.md`

---

## 11. Preferencias de interfaz en cuenta, nunca localStorage (2026-08-06)

**Context**: El colapso del sidebar, la ocultación del panel de filtros y futuras preferencias (idioma, tema, color, columnas) debían sobrevivir entre sesiones y dispositivos.

**Decision**: Las preferencias de interfaz se guardan TODAS en la cuenta: BD vía `PATCH /api/user/preferences` → JSON en `User.uiPreferences` (schema compartido `lib/ui-preferences.ts`), expuestas a componentes cliente vía `UIContext`. Nunca `localStorage`.

**Rationale**: Motivo del usuario: "así todo está homologado" — el usuario recupera su entorno en cualquier ordenador o móvil. localStorage no homologa entre dispositivos.

**Impact**: ✅ Entorno recuperable en cualquier dispositivo; base extensible para Fase B (theme, accentColor, columns). ❌ Requiere sesión autenticada (sin sesión → defaults). Risk: JSON corrupto en BD mitigado por `.catch({})` del schema Zod.

**Related**: `development/frontend/concepts/ui-preferences-pattern.md`, `lookup/decision-details.md` #11

---

## 12. Perfil con pestañas + personalización del escritorio (Fase B, 2026-08-06)

**Decision**: Perfil (MLI + Topbar) en pestañas Cuenta/Escritorio (`components/ui/tabs.tsx` shadcn + Radix), todo persistido en la cuenta. **Idioma de la cuenta con prioridad sobre `accept-language`** (visitantes sin sesión → cabecera; solo 2 locales activos). Tema y color de acento con variables CSS semánticas, clase `dark` **server-side** en el root layout (anti-FOUC) + toggle idempotente en cliente. Columnas configurables con fijas siempre ★/Copiar/Editar/Título (mínimo 1); reorden con flechas, sin drag & drop ni dependencias nuevas; `filterOrder` para las cajas de filtros. Preferencias del usuario; simplicidad (flechas) sobre drag & drop.

**Impact**: ✅ 13 subtareas, tests 97→147 verdes, deploy PROD verificado (preferencias persisten tras recargar). ❌ Dos lecturas de BD por request (root + layout). Risk: restos de colores fijos tras el barrido (verificado visualmente).

**Related**: `development/frontend/concepts/theme-accent-pattern.md`, `development/frontend/concepts/ui-preferences-pattern.md`

---

## 13. Seed sin credenciales reales + hardening de autenticación (Pulido, 2026-08-06)

**Decision**: Contraseñas reales en `prisma/seed.ts:12,30` (expuestas en git history) y sin protección contra fuerza bruta (`UPSTASH_ENABLED=false`, sin Upstash) ni sesiones revocables → Seed con `process.env.SEED_ADMIN_PASSWORD` / `SEED_USER_PASSWORD` (sin fallback débil). **Rate limiting sin dependencias**: `failedLoginAttempts` + `lockoutUntil` en `User` (5 fallos → 15 min, errores genéricos que no revelan bloqueo). **Revocación de sesiones**: `tokenVersion Int @default(0)` en `User` y JWT, verificado con `findUnique` ligero en el callback `jwt` con política **fail-open** (BD caída → sesión sigue válida). Anti-FOUC: clase `dark` server-side. Sin Upstash: seguridad básica no merece dependencia; fail-open para no tumbar la app.

**Impact**: ✅ Implementado y verificado (lib/auth.ts, PATCH /api/user/password incrementa `tokenVersion` y revoca todos los JWT previos); debt de living-notes resuelto. ❌ Query extra por request en el callback jwt (select ligero por PK, aceptado).

---

## 14. Aislamiento por usuario — row-level ownership (Fase D, 2026-08-06)

**Decision**: El usuario "chamed" veía TODOS los prompts (lista, API GET, usage y detalle sin filtrar por propietario) → cada usuario ve SOLO sus prompts (lista, buscador, filtros, detalle, uso, exportación, importación); el admin ve solo los suyos (los 39 actuales, todos suyos — verificado, sin migración de datos). Sin diálogo de alcance en exportación. `where.userId` en toda query (findMany/update/findUnique); las APIs de prompts exigen sesión (401); prompts ajenos → 404 (no revelar existencia); contadores `_count` por usuario.

**Impact**: ✅ Implementado y verificado en código (getPrompts(userId), GET /api/prompts con auth+401, usage con ownership, detalle filtrado, tests nuevos). ⚠️ Validación final (test/tsc/lint/build) y deploy sin documentar.

**Related**: `development/backend/concepts/row-level-isolation-pattern.md`, `backend/errors/api-common-errors.md`

---

## Reference

- `lookup/decision-details.md` — Full alternatives tables, deprecated decisions + related commits
- `technical-domain.md` — Technical implementation · `business-tech-bridge.md` — Business impact
