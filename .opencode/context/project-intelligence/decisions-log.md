<!-- Context: project-intelligence/decisions | Priority: high | Version: 3.0 | Updated: 2026-08-06 (16 entradas; #1–#11 archivadas en lookup/decision-archive.md) -->

# Decisions Log

**Vivo**: entradas #12–#16 (2026-08-06). Histórico #1–#11 en `lookup/decision-archive.md` · alternatives en `lookup/decision-details.md`.

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

## 15. Gestión de usuarios por el admin (Fase C, 2026-08-06)

**Decision**: Pestaña "Usuarios" en el perfil (solo admin): alta con rol+contraseña inicial, editar nombre/contraseña, desactivar/reactivar, eliminar. `isActive Boolean @default(true)` en `User`; `authorize` rechaza inactivos con error genérico + timing equalization. Desactivar incrementa `tokenVersion` (revoca TODAS sus sesiones al instante). Eliminar borra prompts + usuario en `$transaction` (sin esto falla por FK). **Protección: no se puede desactivar ni eliminar al ÚLTIMO admin activo** (400 `cannotDeactivateLastAdmin` / `cannotDeleteLastAdmin`). Rutas de usuarios admin-only (401).

**Impact**: ✅ 7 subtareas, implementado y verificado (schema isActive, authorize, ProfileUsersTab.tsx, i18n paridad). ⚠️ Validación final + deploy sin documentar.

**Related**: `backend/errors/api-common-errors.md` · `backend/concepts/auth-hardening-pattern.md` (tokenVersion)

---

## 16. Taxonomía (catálogos) + Compartir prompts (Etapa final, 2026-08-06)

**Decision**: Type/Status/Language pasan a tablas catálogo sembradas (`name/slug/sortOrder`) SIN migrar los strings del Prompt a FKs; formulario y filtros leen de ellas por props. CRUD de los 7 elementos solo admin (7 páginas `/taxonomy/*` con buscador + desplegable "Taxonomía" en el MLI solo admin); eliminar elemento en uso → desvincula (prompts conservan el valor). Compartir: `isShared` en Prompt + switch en el formulario; página `/shared` muestra SOLO prompts compartidos por OTROS (buscador, sin filtros, sin edición); detalle solo lectura con copiar que incrementa usage; GET `[id]` permite propietario OR compartido (solo lectura); PUT/DELETE exigen propiedad.

**Impact**: ✅ 10 subtareas, implementado y verificado (schema isShared + 3 catálogos, `/api/shared/prompts`, `/shared`, `/taxonomy/*`). ⚠️ Validación final + deploy sin documentar.

**Related**: `data/concepts/catalog-pattern.md` · `backend/concepts/row-level-isolation-pattern.md` (excepción compartidos)

---

## Reference

- `lookup/decision-archive.md` — Histórico #1–#11 (2026-04 → 2026-07)
- `lookup/decision-details.md` — Alternatives tables, deprecated decisions + related commits
- `technical-domain.md` — Technical implementation · `business-tech-bridge.md` — Business impact
