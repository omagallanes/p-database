<!-- Context: project-intelligence/technical | Priority: critical | Version: 2.8 | Updated: 2026-08-08 -->

# Technical Domain

> Tech stack, arquitectura, patrones, estándares, seguridad y conocimiento técnico del proyecto Prompt Database. Resumen MVI — el detalle operativo vive en los archivos referenciados.
>
> **Historial de versiones**: v2.7 (2026-08-06) — cifras de pruebas unificadas (388 pruebas, 40 suites, 100 % superadas; cobertura 79.63 % de líneas), seguridad de agosto (límite de intentos por cuenta e IP, revocación con `tokenVersion`, campo `isActive`, página `/auth/error`), filtro de tipo, preferencias de interfaz, catálogos de taxonomía y prompts compartidos; deudas del seed y de la página de error retiradas; pendientes reales P-01, P-02 y P-03 registrados. v2.6 (2026-08-06) — fases A/B, Pulido, taxonomía y compartidos en la tabla de funcionalidades.

## Primary Stack

| Layer | Tecnología | Notas |
|-------|-----------|-------|
| Framework | Next.js 14 (App Router) | ^14.2.35 · SSR + RSC + API routes |
| Language | TypeScript | ^5.5.4 · strict mode |
| Database | PostgreSQL 14+ (Neon) | Única BD (ver Despliegue) |
| ORM | Prisma | ^5.19.1 · schema-first, `prisma/schema.prisma` |
| Auth | NextAuth.js (v5 beta) | JWT · Prisma adapter · credentials · bcryptjs |
| Validation | Zod | ^3.23.8 |
| Testing | Jest + React Testing Library | ^29.7.0 · **388 tests, 40 suites, 100% passing** |
| Styling | TailwindCSS + shadcn/ui | + lucide-react, cva, tailwind-merge, clsx |
| Linting | ESLint + eslint-config-next | ^8.57.1 |
| Deployment | Vercel (Hobby) + Neon PostgreSQL | **Completado** (ya no pendiente) |
| Runtime | Node.js 20+, npm | — |

## Features

| Feature | Estado | Feature | Estado | Feature | Estado | Feature | Estado |
|---------|--------|---------|--------|---------|--------|---------|--------|
| CRUD de Prompts | ✅ | Tracking de uso | ✅ | Favoritos | ✅ | Versionado | ✅ |
| Categorías jerárquicas | ✅ | Etiquetas (M:N) | ✅ | Búsqueda full-text | ✅ | Export/Import v2.0 | ✅ |
| Filtros multi-selección (AND) | ✅ | Copiar al portapapeles | ✅ | Duplicar prompts | ✅ | Preferencia de usuario | ✅ |
| Autenticación + Roles | ✅ | Vista cards/lista | ✅ | Perfil con pestañas | ✅ | Idioma en cuenta | ✅ |
| Tema claro/oscuro + acento | ✅ | Orden filtros/columnas | ✅ | Panel filtros + MLI | ✅ | Favoritos barra sup. | ✅ |
| Panel admin (usuarios) | ✅ | Taxonomía (7 CRUD) | ✅ | Compartir (isShared) | ✅ | Multidioma (i18n) | ✅ en-GB + es-ES (8 pend.) |
| Filtro de tipo (Type) | ✅ | Página /auth/error | ✅ | | | | |

## Arquitectura

**Patrón:** Next.js App Router por capas: React components → HTTP → API Routes (`app/api/*`) → Prisma Client → PostgreSQL. Único entorno: PostgreSQL (Neon). No hay SQLite ni desarrollo local.

## Estructura de Directorios

```
app/          (app)/prompts·categories·tags · (auth)/auth/signin·signup · api/* (12 recursos)
components/   auth/ · layout/ · prompt/ · ui/ (shadcn)
contexts/     ViewModeContext.tsx
i18n/         request.ts · locales.ts (next-intl)
lib/          auth.ts · prisma.ts · utils.ts · locale.ts
messages/     en-GB.json · es-ES.json (404 claves c/u, 27 namespaces; verificado 2026-08-06)
prisma/       schema.prisma · seed.ts · migrate-data.ts
tests/        api/ · components/ · i18n/ · unit/
types/        next-auth.d.ts
docs/         index.md · archive/ · decisions/ · developing/ · guide/ · planning/ · reference/ · reservas/ · technical-development-knowledge/ · temp/
middleware.ts
```

## Code Patterns

- **API**: Auth → Zod → Prisma → Response; errores `{ error }` JSON. Ejemplo: `app/api/prompts/route.ts`. Ver `../development/concepts/api-response-standards.md`.
- **Preferencias de interfaz**: `User.uiPreferences` (JSON) con schema compartido `lib/ui-preferences.ts`; `UIContext` (patrón ViewModeContext) con persistencia PATCH `/api/user/preferences`; todo guardado en la cuenta, sin localStorage. Incluye tema claro/oscuro, color de acento, orden de filtros (8 cajas) y columnas configurables; Fase A: sidebarCollapsed, filtersVisible.
- **Catálogos de taxonomía**: modelos `Type`, `Status` y `Language` sembrados (3/3/12) con CRUD solo administrador en las páginas `/taxonomy/*`; el formulario y los filtros leen los catálogos; filtro de tipo en la página de prompts. Ver decisión #16 de `../lookup/decisions-log.md`.
- **Prompts compartidos**: campo `isShared` en `Prompt` + página `/shared` (solo prompts de otros, con búsqueda, sin filtros, sin favoritos ni edición, 8 columnas); detalle en solo lectura con copiado que incrementa el contador de usos; edición y borrado exigen propiedad. Ver decisión #16 de `../lookup/decisions-log.md`.
- **Componentes**: Server Components por defecto; `"use client"` solo con interactividad. Props tipadas `{Name}Props`. **Refactor en segmentos**: orquestador + segmentos por funcionalidad; verificar `npx tsc --noEmit` tras cada extracción. Ver `../development/concepts/component-refactor-pattern.md`.
- **Upsert de entidades globales**: normalizar (trim+uppercase) → upsert por slug. Ver `../development/concepts/upsert-entity-pattern.md`.
- **Delegación de tareas**: CodeReviewer gate entre subtareas; mismo archivo → mismo batch. Ver `../development/concepts/task-delegation-workflow.md`.
- **i18n**: next-intl v4 sin enrutado; locale por `accept-language` (helper puro `lib/locale.ts`); API routes con `getTranslations({ locale, namespace: "Api" })`. Ver `../development/concepts/i18n-next-intl-pattern.md`.

## Naming Conventions

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Archivos | kebab-case | `prompt-card.tsx` |
| Componentes | PascalCase | `PromptCard` |
| Funciones | camelCase (verb phrases) | `getPrompts()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Tipos/Interfaces | PascalCase + `Props` | `PromptListProps` |
| CSS | Tailwind utilities | `flex`, `gap-2` |
| Modelos BD | PascalCase | `Prompt`, `Category` |

## Code Standards

- TypeScript `strict: true`, sin `any`
- Zod en toda entrada de API (`parse`/`safeParse` con try/catch)
- Solo Prisma para BD, nunca SQL crudo
- Server Components por defecto
- Código en inglés; docs en español; mensajes i18n es-ES
- Errores `{ data }` / `{ error }`, sin stack traces en producción
- N:M con junction tables + `@@id([promptId, tagId])` + Cascade
- Migraciones solo vía Prisma
- Respuestas: `[id]` → `{ data, success }`; listas → `{ items, total }`; errores → `{ error, details? }`
- Mismo archivo → mismo batch; CodeReviewer gate por subtarea

## Security Requirements

- Auth en TODAS las API routes: `auth()` como primera operación
- Zod en cada endpoint; Prisma parameterizado (sin SQL injection)
- `AUTH_SECRET` obligatorio; env vars validadas al init
- Sin secretos en VCS (`.env*.local` en `.gitignore`)
- ~~Rate limiting previsto (flag `UPSTASH_ENABLED`)~~ → **Resuelto (2026-08-06) sin Upstash** (decisión #13): límite de intentos por cuenta (`failedLoginAttempts` + `lockoutUntil` en `User`: 5 fallos → 15 minutos, errores genéricos) y por dirección IP (tabla `IpAttempt`: 5 fallos → 15 minutos, tolerante a fallos en base de datos, tiempos igualados).
- **Revocación de sesiones** con `tokenVersion` en `User` y JWT: se incrementa al cambiar la contraseña, al desactivar usuarios y al degradar roles; invalida los JWT emitidos (política fail-open si la base de datos falla). Ver decisión #13.
- **Campo `isActive` en usuarios**: desactivar cierra las sesiones y bloquea accesos; eliminar borra los prompts en transacción; no se puede desactivar ni eliminar al último administrador activo. Ver decisión #15.
- **Página `/auth/error` creada e internacionalizada** (2026-08-06): los fallos de autenticación muestran la página propia.
- Passwords con bcryptjs (credentials provider)
- CORS por defecto de Next.js

## Database Schema

**21 modelos** (v2.7, 2026-08-06): los 17 de la versión anterior (Prompt central, 6 entidades de taxonomía, autenticación y 6 tablas de unión N:M) + `IpAttempt` (intentos por IP) + 3 catálogos (`Type`, `Status`, `Language`). Histórico v2.6: 17 modelos, 26 índices, 16 FKs.

- **Categorías jerárquicas**: límite de **2 niveles** de profundidad; al asignar una categoría hija se añade automáticamente la categoría principal.
- **Junction tables**: IDs compuestos `@@id([promptId, entityId])`, `onDelete: Cascade`.
- **Campos legacy**: `platform`, `useCase`, `clientOrProject`, `modelHint` (compatibilidad import v1.0).
- **BD**: PostgreSQL en exclusiva (`prisma/schema.prisma` provider = `postgresql`), Prisma como ORM, **sin SQLite**.

## Autenticación (NextAuth.js)

NextAuth.js v5 (JWT, Prisma adapter, credentials + bcryptjs); handlers en `/api/auth/[...nextauth]`; rutas en `app/(auth)/auth/` (signin, signup, error). ✅ Página `/auth/error` creada e internacionalizada (2026-08-06) — antes referenciada sin existir (`lib/auth.ts:13`, `middleware.ts:12`). Ver `../errors/auth-errors.md` (1.6).

## API Routes

| Recurso | Rutas |
|---------|-------|
| Auth | `/api/auth/[...nextauth]` · `/api/auth/register` |
| Prompts | `/api/prompts` · `/api/prompts/[id]` · `/api/prompts/[id]/usage` |
| Categorías / Tags | `/api/categories([id])` · `/api/tags([id])` |
| Entidades globales | `/api/platforms` · `/api/client-projects` · `/api/use-cases` · `/api/model-hints` (POST upsert) |
| Export/Import | `/api/export/prompts` · `/api/import/prompts` |
| Preferencias | `/api/user/preferences` |
| Usuarios | `/api/users` · `/api/users/[id]` (Admin) |

**Filtrado AND**: cada valor seleccionado añade `{ entity: { some: { entityId } } }` a la matriz de condiciones; todos deben coincidir (verificado en `app/api/prompts/route.ts`; detalle en `../errors/filter-state-errors.md`).

## Commands (package.json)

| Comando | Descripción |
|---------|-------------|
| `npm run dev` / `build` / `start` / `lint` | Desarrollo, build standalone, producción, ESLint |
| `npm test` / `test:watch` | Jest — **388 tests, 40 suites, 100% passing** |
| `npx tsc --noEmit` | TypeScript check rápido |
| `npm run db:*` | push · migrate · seed · generate · migrate-data |
| `npx prisma studio` / `migrate dev` | UI BD / migración en dev |
| `vercel` / `vercel env pull` / `vercel logs` | Deploy preview/prod, env vars, logs |

## Frontend Architecture

- Route groups: `(app)` autenticado (prompts, categories, tags) · `(auth)` público (signin, signup)
- shadcn/ui: button, card, dialog, dropdown-menu, input, label, select, tabs, textarea, badge
- **PromptForm: 769 líneas** · PromptFilters · PromptList · Sidebar · Topbar
- ViewModeContext persiste vía PATCH `/api/user/preferences`
- Páginas: `/prompts`, `/prompts/new`, `/prompts/[id]`, `/categories`, `/tags`, `/auth/signin`, `/auth/signup`

## Testing

- Jest 29.7 + next/jest + jest-environment-jsdom
- **388 pruebas, 40 suites, 100 % superadas** (cifra unificada a 2026-08-06; anteriormente la cifra aparecía desdoblada en 338/34 y 81)
- **Histórico de cifras de pruebas**: 60 → 81 → 97 → 147 → 203 → 275 → 338 → 388 (cada hito superado en su fase; la serie se mantiene para evitar contradicciones futuras)
- Cobertura actual **79.63 % de líneas**; objetivo ≥ 70 %; informe en `docs/informe-cobertura.md`
- Mocks: next-auth, @auth/prisma-adapter, next/navigation, prisma ($transaction), next-intl/server (con catálogos reales)

## Docker

`Dockerfile` multi-stage (node:20-alpine, output standalone) · `Dockerfile.dev` + `docker-compose.dev.yml` (hot-reload + PostgreSQL 14) · `docker-compose.yml` producción con Traefik (legacy, no usado)

## Environment Variables

| Variable | Uso | Requerida |
|----------|-----|-----------|
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Conexión PostgreSQL / Neon no-pooled | Sí / Prod |
| `AUTH_SECRET` / `AUTH_URL` | NextAuth JWT / base URL | Sí |
| `NODE_ENV` | dev/prod/test | Sí |
| `NEXT_PUBLIC_BASE_PATH` | Subfolder base path | Opcional |
| ~~`UPSTASH_ENABLED` + `UPSTASH_REDIS_*`~~ | Rate limiting (obsoleto — implementado sin Upstash, 2026-08-06) | Opcional |
| `POSTGRES_PRISMA_URL`, `POSTGRES_URL*`, `POSTGRES_USER/PASSWORD/HOST/DATABASE` | Neon pool/no-pool | Prod |

## Deuda Técnica Conocida

- ~~🔴 Credenciales en `prisma/seed.ts`~~ → **Resuelto (2026-08-06)**: usa `SEED_ADMIN_PASSWORD`/`SEED_USER_PASSWORD` (decisión #13). Pendiente real: **P-01 — rotar contraseñas reales del historial de git** (ver `docs/dodp.md`).
- ~~⚠️ Página `/auth/error` referenciada sin crear~~ → **Resuelto (2026-08-06)**: creada e internacionalizada (ver Autenticación).
- **P-02 — 8 idiomas sin traducir** (es-MX, ca, ca-ES-valencia, gl, pt-PT, fr, ru, zh-CN; `docs/plan-traduccion-i18n.md`, `docs/dodp.md`). Selector de idioma ya existe en el perfil con prioridad sobre el navegador.
- **P-03 — rotar el token de Vercel** descargado al entorno local (`docs/dodp.md`).

## 📂 Codebase References

| Contexto | Implementación |
|----------|---------------|
| API pattern + filtros AND | `app/api/prompts/route.ts` |
| Formulario | `components/prompt/PromptForm.tsx` (769 líneas) |
| Componente cliente | `components/prompt/PromptList.tsx` |
| i18n (resolución de locale) | `i18n/request.ts` · `lib/locale.ts` |
| Mensajes i18n | `messages/en-GB.json` · `messages/es-ES.json` |
| Schema BD | `prisma/schema.prisma` (provider: postgresql) |
| Seed (env vars, sin credenciales reales) | `prisma/seed.ts` (usa `SEED_ADMIN_PASSWORD` / `SEED_USER_PASSWORD`) |
| Auth / middleware | `lib/auth.ts` · `middleware.ts` |
| Prisma client | `lib/prisma.ts` |
| Test setup | `jest.setup.js` |

## Related Files

- `business-domain.md` · `../lookup/decisions-log.md` (SQLite→PG, Railway→Vercel, i18n) · `../lookup/living-notes.md` (deuda) · `../errors/tech-knowledge.md` (índice de errores con código) · `../development/concepts/*.md` (patrones: refactor, API response, upsert, delegación, i18n)
