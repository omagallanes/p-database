<!-- Context: project-intelligence/technical | Priority: critical | Version: 2.5 | Updated: 2026-08-04 -->

# Technical Domain

> Tech stack, arquitectura, patrones, estándares, seguridad y conocimiento técnico del proyecto Prompt Database. Resumen MVI — el detalle operativo vive en los archivos referenciados.

## Primary Stack

| Layer | Tecnología | Notas |
|-------|-----------|-------|
| Framework | Next.js 14 (App Router) | ^14.2.35 · SSR + RSC + API routes |
| Language | TypeScript | ^5.5.4 · strict mode |
| Database | PostgreSQL 14+ (Neon) | Única BD (ver Despliegue) |
| ORM | Prisma | ^5.19.1 · schema-first, `prisma/schema.prisma` |
| Auth | NextAuth.js (v5 beta) | JWT · Prisma adapter · credentials · bcryptjs |
| Validation | Zod | ^3.23.8 |
| Testing | Jest + React Testing Library | ^29.7.0 · **60 tests, 8 suites, 100% passing** |
| Styling | TailwindCSS + shadcn/ui | + lucide-react, cva, tailwind-merge, clsx |
| Linting | ESLint + eslint-config-next | ^8.57.1 |
| Deployment | Vercel (Hobby) + Neon PostgreSQL | **Completado** (ya no pendiente) |
| Runtime | Node.js 20+, npm | — |

## Features

| Feature | Estado | Feature | Estado |
|---------|--------|---------|--------|
| CRUD de Prompts | ✅ Completo | Tracking de uso | ✅ Completo |
| Categorías jerárquicas | ✅ Completo | Favoritos | ✅ Completo |
| Etiquetas (M:N) | ✅ Completo | Versionado de prompts | ✅ Completo |
| Búsqueda full-text | ✅ Completo | Export/Import JSON v2.0 | ✅ Completo |
| Filtros multi-selección | ✅ (lógica AND) | Copiar al portapapeles | ✅ Completo |
| Autenticación + Roles (USER/ADMIN) | ✅ Completo | Duplicar prompts | ✅ Completo |
| Vista cards/lista persistente | ✅ Completo | Preferencia de usuario | ✅ Completo |
| Panel de administración | ⚠️ Endpoints sin UI | Multidioma (i18n) | 🔄 Pendiente |

## Arquitectura

**Patrón:** Next.js App Router por capas: React components → HTTP → API Routes (`app/api/*`) → Prisma Client → PostgreSQL. Único entorno: PostgreSQL (Neon). No hay SQLite ni desarrollo local.

## Estructura de Directorios

```
app/          (app)/prompts·categories·tags · (auth)/auth/signin·signup · api/* (12 recursos)
components/   auth/ · layout/ · prompt/ · ui/ (shadcn)
contexts/     ViewModeContext.tsx
lib/          auth.ts · prisma.ts · utils.ts
prisma/       schema.prisma · seed.ts · migrate-data.ts
tests/        api/ (5 archivos) · components/ (3 archivos)
types/        next-auth.d.ts
docs/         index.md · archive/ · decisions/ · developing/ · guide/ · planning/ · reference/ · reservas/ · technical-development-knowledge/ · temp/
middleware.ts
```

## Code Patterns

- **API**: Auth → Zod → Prisma → Response; errores `{ error }` JSON. Ejemplo: `app/api/prompts/route.ts`. Ver `development/concepts/api-response-standards.md`.
- **Componentes**: Server Components por defecto; `"use client"` solo con interactividad. Props tipadas `{Name}Props`.
- **Refactor en segmentos**: orquestador + segmentos por funcionalidad; verificar `npx tsc --noEmit` tras cada extracción. Ver `development/concepts/component-refactor-pattern.md`.
- **Upsert de entidades globales**: normalizar (trim+uppercase) → upsert por slug. Ver `development/concepts/upsert-entity-pattern.md`.
- **Delegación de tareas**: CodeReviewer gate entre subtareas; mismo archivo → mismo batch. Ver `development/concepts/task-delegation-workflow.md`.

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
- Rate limiting previsto (flag `UPSTASH_ENABLED`)
- Passwords con bcryptjs (credentials provider)
- CORS por defecto de Next.js

## Database Schema

**17 modelos**: Prompt (central, 18 campos) + 6 entidades (Category, Tag, Platform, ClientProject, UseCase, ModelHint) + User/Account/Session/VerificationToken + 6 junction tables. 6 N:M · 6 1:N · 26 índices · 16 FKs.

- **Categorías jerárquicas**: límite de **2 niveles** de profundidad; al asignar una categoría hija se añade automáticamente la categoría principal.
- **Junction tables**: IDs compuestos `@@id([promptId, entityId])`, `onDelete: Cascade`.
- **Campos legacy**: `platform`, `useCase`, `clientOrProject`, `modelHint` (compatibilidad import v1.0).
- **BD**: PostgreSQL en exclusiva (`prisma/schema.prisma` provider = `postgresql`), Prisma como ORM, **sin SQLite**.

## Autenticación (NextAuth.js)

- NextAuth.js v5 (JWT, Prisma adapter, credentials + bcryptjs); handlers en `/api/auth/[...nextauth]`.
- Rutas de autenticación en `app/(auth)/auth/`: `signin` y `signup`.
- ⚠️ **`/auth/error` NO existe**: referenciada en `lib/auth.ts:13` y `middleware.ts:12`, pero la página no está creada. Ver `errors/tech-knowledge.md` (1.6).

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

## Commands (package.json)

| Comando | Descripción |
|---------|-------------|
| `npm run dev` / `build` / `start` / `lint` | Desarrollo, build standalone, producción, ESLint |
| `npm test` / `test:watch` | Jest — **60 tests, 8 suites, 100% passing** |
| `npx tsc --noEmit` | TypeScript check rápido |
| `npm run db:*` | push · migrate · seed · generate · migrate-data |
| `npx prisma studio` / `migrate dev` | UI BD / migración en dev |
| `vercel` / `vercel env pull` / `vercel logs` | Deploy preview/prod, env vars, logs |

## Frontend Architecture

- Route groups: `(app)` autenticado (prompts, categories, tags) · `(auth)` público (signin, signup)
- shadcn/ui: button, card, dialog, dropdown-menu, input, label, select, tabs, textarea, badge
- **PromptForm: 769 líneas** (`components/prompt/PromptForm.tsx`) · PromptFilters · PromptList · Sidebar · Topbar
- ViewModeContext persiste vía PATCH `/api/user/preferences`
- Páginas: `/prompts`, `/prompts/new`, `/prompts/[id]`, `/categories`, `/tags`, `/auth/signin`, `/auth/signup`

## Filtrado de Prompts

Lógica **Y (AND) con `some()` por valor**: cada valor seleccionado añade `{ entity: { some: { entityId } } }` a la matriz de condiciones; todos deben coincidir. Verificado en `app/api/prompts/route.ts`. Detalle en `errors/tech-knowledge.md` (§5).

## Testing

- Jest 29.7 + next/jest + jest-environment-jsdom; 8 archivos (5 API + 3 componentes)
- **60 pruebas, todas superadas** (el conteo de 56 es obsoleto)
- Mocks: next-auth, @auth/prisma-adapter, next/navigation, prisma ($transaction), URLSearchParams directo
- Cobertura actual ≥ 60%; detalle en `errors/tech-knowledge.md` (§7)

## Docker

- `Dockerfile` multi-stage (node:20-alpine, output standalone, prisma generate en build)
- `Dockerfile.dev` hot-reload; `docker-compose.dev.yml` app + PostgreSQL 14 con healthcheck
- `docker-compose.yml` producción con Traefik (legacy, no usado)

## Environment Variables

| Variable | Uso | Requerida |
|----------|-----|-----------|
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Conexión PostgreSQL / Neon no-pooled | Sí / Prod |
| `AUTH_SECRET` / `AUTH_URL` | NextAuth JWT / base URL | Sí |
| `NODE_ENV` | dev/prod/test | Sí |
| `NEXT_PUBLIC_BASE_PATH` | Subfolder base path | Opcional |
| `UPSTASH_ENABLED` + `UPSTASH_REDIS_*` | Rate limiting | Opcional |
| `POSTGRES_PRISMA_URL`, `POSTGRES_URL*`, `POSTGRES_USER/PASSWORD/HOST/DATABASE` | Neon pool/no-pool | Prod |

## Deuda Técnica Conocida

- 🔴 **Credenciales visibles en `prisma/seed.ts` líneas 12 y 30** (deuda técnica de prioridad alta)
- ⚠️ Página `/auth/error` referenciada pero no creada (ver Autenticación)
- Panel de administración sin UI (endpoints `/api/users/*` sin frontend)
- Multidioma (i18n) pendiente

## 📂 Codebase References

| Contexto | Implementación |
|----------|---------------|
| API pattern + filtros AND | `app/api/prompts/route.ts` |
| Formulario | `components/prompt/PromptForm.tsx` (769 líneas) |
| Componente cliente | `components/prompt/PromptList.tsx` |
| Schema BD | `prisma/schema.prisma` (provider: postgresql) |
| Seed (⚠️ credenciales) | `prisma/seed.ts` (líneas 12, 30) |
| Auth / middleware | `lib/auth.ts` · `middleware.ts` |
| Prisma client | `lib/prisma.ts` |
| Test setup | `jest.setup.js` |

## Related Files

- `business-domain.md` — contexto de negocio
- `decisions-log.md` — decisiones (SQLite→PG, Railway→Vercel)
- `living-notes.md` — deuda y preguntas abiertas
- `errors/tech-knowledge.md` — catálogo completo de errores con código
- `development/concepts/*.md` — patrones: refactor de componentes, API response, upsert, delegación
