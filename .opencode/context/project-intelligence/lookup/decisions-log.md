<!-- Context: project-intelligence/decisions | Priority: high | Version: 3.2 | Updated: 2026-08-08 (18 entradas; #1–#11 archivadas en lookup/decision-archive.md; referencias de #12–#16 corregidas a docs/reference/, incluidos aislamiento-por-fila.md y errores-comunes-api.md creados el 2026-08-08) -->

# Decisions Log

**Vivo**: entradas #12–#18 (2026-08-06). Histórico #1–#11 en `decision-archive.md` · alternatives en `decision-details.md`.

---

## 12. Perfil con pestañas + personalización del escritorio (Fase B, 2026-08-06)

**Decision**: Perfil (MLI + Topbar) en pestañas Cuenta/Escritorio (`components/ui/tabs.tsx` shadcn + Radix), todo persistido en la cuenta. **Idioma de la cuenta con prioridad sobre `accept-language`** (visitantes sin sesión → cabecera; solo 2 locales activos). Tema y color de acento con variables CSS semánticas, clase `dark` **server-side** en el root layout (anti-FOUC) + toggle idempotente en cliente. Columnas configurables con fijas siempre ★/Copiar/Editar/Título (mínimo 1); reorden con flechas, sin drag & drop ni dependencias nuevas; `filterOrder` para las cajas de filtros. Preferencias del usuario; simplicidad (flechas) sobre drag & drop.

**Impact**: ✅ 13 subtareas, tests 97→147 verdes, deploy PROD verificado (preferencias persisten tras recargar). ❌ Dos lecturas de BD por request (root + layout). Risk: restos de colores fijos tras el barrido (verificado visualmente).

**Related**: `docs/reference/preferencias-interfaz.md` (patrones de tema y acento + preferencias de interfaz; creado el 2026-08-06)

---

## 13. Seed sin credenciales reales + hardening de autenticación (Pulido, 2026-08-06)

**Decision**: Contraseñas reales en `prisma/seed.ts:12,30` (expuestas en git history) y sin protección contra fuerza bruta (`UPSTASH_ENABLED=false`, sin Upstash) ni sesiones revocables → Seed con `process.env.SEED_ADMIN_PASSWORD` / `SEED_USER_PASSWORD` (sin fallback débil). **Rate limiting sin dependencias**: `failedLoginAttempts` + `lockoutUntil` en `User` (5 fallos → 15 min, errores genéricos que no revelan bloqueo). **Revocación de sesiones**: `tokenVersion Int @default(0)` en `User` y JWT, verificado con `findUnique` ligero en el callback `jwt` con política **fail-open** (BD caída → sesión sigue válida). Anti-FOUC: clase `dark` server-side. Sin Upstash: seguridad básica no merece dependencia; fail-open para no tumbar la app.

**Impact**: ✅ Implementado y verificado (lib/auth.ts, PATCH /api/user/password incrementa `tokenVersion` y revoca todos los JWT previos); debt de living-notes resuelto. ❌ Query extra por request en el callback jwt (select ligero por PK, aceptado).

---

## 14. Aislamiento por usuario — row-level ownership (Fase D, 2026-08-06)

**Decision**: El usuario "chamed" veía TODOS los prompts (lista, API GET, usage y detalle sin filtrar por propietario) → cada usuario ve SOLO sus prompts (lista, buscador, filtros, detalle, uso, exportación, importación); el admin ve solo los suyos (los 39 actuales, todos suyos — verificado, sin migración de datos). Sin diálogo de alcance en exportación. `where.userId` en toda query (findMany/update/findUnique); las APIs de prompts exigen sesión (401); prompts ajenos → 404 (no revelar existencia); contadores `_count` por usuario.

**Impact**: ✅ Implementado y verificado en código (getPrompts(userId), GET /api/prompts con auth+401, usage con ownership, detalle filtrado, tests nuevos). ⚠️ Validación final (test/tsc/lint/build) y deploy sin documentar.

**Related**: `docs/reference/aislamiento-por-fila.md` (patrón de aislamiento por fila; creado el 2026-08-08) · `docs/reference/errores-comunes-api.md` (errores comunes de API; creado el 2026-08-08)

---

## 15. Gestión de usuarios por el admin (Fase C, 2026-08-06)

**Decision**: Pestaña "Usuarios" en el perfil (solo admin): alta con rol+contraseña inicial, editar nombre/contraseña, desactivar/reactivar, eliminar. `isActive Boolean @default(true)` en `User`; `authorize` rechaza inactivos con error genérico + timing equalization. Desactivar incrementa `tokenVersion` (revoca TODAS sus sesiones al instante). Eliminar borra prompts + usuario en `$transaction` (sin esto falla por FK). **Protección: no se puede desactivar ni eliminar al ÚLTIMO admin activo** (400 `cannotDeactivateLastAdmin` / `cannotDeleteLastAdmin`). Rutas de usuarios admin-only (401).

**Impact**: ✅ 7 subtareas, implementado y verificado (schema isActive, authorize, ProfileUsersTab.tsx, i18n paridad). ⚠️ Validación final + deploy sin documentar.

**Related**: `docs/reference/seguridad-autenticacion.md` (endurecimiento de autenticación, tokenVersion; creado el 2026-08-06) · `docs/reference/errores-comunes-api.md` (errores comunes de API; creado el 2026-08-08)

---

## 16. Taxonomía (catálogos) + Compartir prompts (Etapa final, 2026-08-06)

**Decision**: Type/Status/Language pasan a tablas catálogo sembradas (`name/slug/sortOrder`) SIN migrar los strings del Prompt a FKs; formulario y filtros leen de ellas por props. CRUD de los 7 elementos solo admin (7 páginas `/taxonomy/*` con buscador + desplegable "Taxonomía" en el MLI solo admin); eliminar elemento en uso → desvincula (prompts conservan el valor). Compartir: `isShared` en Prompt + switch en el formulario; página `/shared` muestra SOLO prompts compartidos por OTROS (buscador, sin filtros, sin edición); detalle solo lectura con copiar que incrementa usage; GET `[id]` permite propietario OR compartido (solo lectura); PUT/DELETE exigen propiedad.

**Impact**: ✅ 10 subtareas, implementado y verificado (schema isShared + 3 catálogos, `/api/shared/prompts`, `/shared`, `/taxonomy/*`). ⚠️ Validación final + deploy sin documentar.

**Related**: `docs/reference/taxonomia-catalogos.md` (patrón de catálogos; creado el 2026-08-06) · `docs/reference/prompts-compartidos.md` (compartir prompts; creado el 2026-08-06) · `docs/reference/aislamiento-por-fila.md` (aislamiento por fila con la excepción de compartidos; creado el 2026-08-08)

---

## 17. Límite de intentos por dirección IP — tabla IpAttempt (Lote de mejoras, 2026-08-06)

**Decision**: El límite de intentos por cuenta (decisión 13) se complementa con un límite por dirección IP: nueva tabla `IpAttempt` (5 fallos → 15 minutos), tolerante a fallos en la base de datos (si la base de datos no responde, el inicio de sesión no se bloquea) y con tiempos igualados para no revelar qué cuentas están bloqueadas. Queda activo SIN la opción de Upstash: el límite por IP se resuelve sin Redis externo, confirmando la decisión 13 de no añadir esa dependencia.

**Impact**: ✅ Implementado y verificado en el flujo de autenticación (tabla `IpAttempt` en `prisma/schema.prisma`); el límite por IP está activo sin Upstash, resuelto sin Redis externo. ❌ Sin efectos secundarios conocidos.

**Related**: `docs/reference/seguridad-autenticacion.md` (límite por cuenta e IP; creado el 2026-08-06)

---

## 18. Página de error de autenticación + filtro de tipo + umbrales de cobertura (Lote de mejoras, 2026-08-06)

**Decision**: Se crea la página de error de autenticación (`/auth/error`) con internacionalización completa; se añade el filtro de tipo a la página de prompts; los umbrales de cobertura quedan protegidos en la configuración de pruebas para que no bajen de los objetivos.

**Impact**: ✅ Implementado y verificado; la página de error queda internacionalizada y el filtro de tipo operativo. Pruebas actuales: 388 en 40 suites, cobertura del 79.63% de las líneas. ❌ Sin efectos secundarios conocidos.

**Related**: `docs/reference/seguridad-autenticacion.md` (página `/auth/error`; creado el 2026-08-06)

---

## Reference

- `decision-archive.md` — Histórico #1–#11 (2026-04 → 2026-07)
- `decision-details.md` — Alternatives tables, deprecated decisions + related commits
- `../concepts/technical-domain.md` — Technical implementation · `../concepts/business-tech-bridge.md` — Business impact

## Evolución

- **v3.2 (2026-08-08)**: corregidas las referencias pendientes de las decisiones 14, 15 y 16: el patrón de aislamiento por fila y el de errores comunes de API apuntan ahora a los documentos creados en `docs/reference/` el 2026-08-08 (`aislamiento-por-fila.md` y `errores-comunes-api.md`). No se han borrado decisiones previas: el texto original de #14–#16 se conserva y el estado anterior (pendientes de creación) queda como histórico de esta entrada.
- **v3.1 (2026-08-06)**: añadidas las decisiones 17 (límite de intentos por dirección IP con la tabla `IpAttempt`, activo sin Upstash) y 18 (página de error de autenticación internacionalizada + filtro de tipo + umbrales de cobertura). Corregidas las referencias rotas de las decisiones 12 a 16: las de preferencias de interfaz, tema y acento, endurecimiento de autenticación y patrón de catálogos apuntan ahora a los archivos creados en `docs/reference/` (preferencias-interfaz.md, taxonomia-catalogos.md, prompts-compartidos.md, seguridad-autenticacion.md); las de aislamiento por fila y errores comunes de API quedan marcadas como pendientes de creación. No se han borrado decisiones previas: el texto original de #12–#16 se conserva y #1–#11 permanecen en `decision-archive.md`.
