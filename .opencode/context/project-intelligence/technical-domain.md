<!-- Context: project-intelligence/technical | Priority: critical | Version: 2.3 | Updated: 2026-07-17 -->

# Technical Domain

> Tech stack, architecture patterns, naming conventions, code standards, security requirements, and technical knowledge for the Prompt Database project.

## Primary Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | Next.js (App Router) | ^14.2.35 | SSR + RSC + file-based API routes |
| Language | TypeScript | ^5.5.4 | Strict mode, full type safety |
| Database | PostgreSQL 14+ (Neon serverless) | 14+ | Migrated from SQLite, production-grade, 512 MB |
| ORM | Prisma | ^5.19.1 | Type-safe queries, schema-first, multi-DB support |
| Styling | TailwindCSS + shadcn/ui | ^3.4.7 | Utility-first + Radix UI primitives |
| Auth | NextAuth.js (v5 beta) | ^5.0.0-beta.31 | JWT strategy, Prisma adapter, credentials |
| Validation | Zod | ^3.23.8 | Runtime schema validation w/ type inference |
| Testing | Jest + React Testing Library | ^29.7.0 | Unit + component tests (56 tests, 8 suites) |
| UI Components | shadcn/ui + @radix-ui/react-* | — | dialog, dropdown-menu, label, select, tabs |
| Icons | lucide-react | ^0.427.0 | Icon library |
| CSS Utils | class-variance-authority + tailwind-merge + clsx | — | Component variants and class merging |
| Linting | ESLint + eslint-config-next | ^8.57.1 | Code quality |
| Deployment | Vercel (Plan Hobby) | — | Migrated from Railway, eliminated VPS/Traefik |
| Runtime | Node.js | 20+ | Current LTS, `npm` package manager |

## Features

| Feature | Estado | Feature | Estado |
|---------|--------|---------|--------|
| CRUD de Prompts | ✅ Completo | Tracking de uso | ✅ Completo |
| Categorías jerárquicas | ✅ Completo | Favoritos | ✅ Completo |
| Etiquetas (relación M:N) | ✅ Completo | Versionado de prompts | ✅ Completo |
| Búsqueda full-text | ✅ Completo | Export/Import JSON v2.0 | ✅ Completo |
| Filtros multi-selección | ✅ Completo (OR logic) | Copiar al portapapeles | ✅ Completo |
| Autenticación + Roles (USER/ADMIN) | ✅ Completo | Duplicar prompts | ✅ Completo |
| Vista cards/lista con persistencia | ✅ Completo | Preferencia de usuario | ✅ Completo |
| Panel de administración | ⚠️ Endpoints sin UI | Multidioma (i18n) | 🔄 Pendiente |

## Arquitectura del Proyecto

**Patrón:** Next.js App Router con arquitectura de capas.

```
Frontend (React Components)
       ↓ HTTP
API Routes (/api/prompts, /api/categories, /api/tags, /api/auth, /api/users)
       ↓
Prisma Client (ORM type-safe)
       ↓
PostgreSQL (Neon) — Único entorno. No hay desarrollo local SQLite.
```

### Estructura de Directorios

```
app/                              # Next.js App Router
├── (app)/     prompts/ · categories/ · tags/ · auth/
├── (auth)/    signin/ · signup/
├── api/       auth/ · categories/ · client-projects/ · export/ · import/ · model-hints/ · platforms/ · prompts/ · tags/ · use-cases/ · user/ · users/
├── layout.tsx · globals.css · not-found.tsx · page.tsx (redirect → /prompts)

components/
├── auth/      LoginForm.tsx · SignupForm.tsx · UserProfile.tsx
├── layout/    Sidebar.tsx · Topbar.tsx
├── prompt/    AdvancedSegment.tsx · BasicInfoSegment.tsx · MetadataSegment.tsx · PromptFilters.tsx · PromptForm.tsx · PromptList.tsx · TaxonomyMultiSelect.tsx · ViewToggle.tsx
└── ui/        badge · button · card · dialog · dropdown-menu · input · label · select · tabs · textarea (shadcn/ui)

contexts/      ViewModeContext.tsx
lib/           auth.ts (NextAuth) · prisma.ts (singleton) · utils.ts (cn, getApiUrl)
prisma/        schema.prisma · seed.ts · migrate-data.ts
tests/         api/ (5 archivos) · components/ (3 archivos)
types/         next-auth.d.ts
public/        Static assets
docs/          reference/ · guide/ · developing/ · archive/ · reservas/
middleware.ts
```

## Code Patterns

### API Endpoint (Next.js App Router)
```typescript
// app/api/prompts/route.ts
export async function POST(request: NextRequest) {
  try {
    const session = await auth()                               // 1. Auth check
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const body = await request.json()
    const data = createPromptSchema.parse(body)                // 2. Zod validation (safeParse alternative)
    const prompt = await prisma.prompt.create({ data })        // 3. Prisma query
    return NextResponse.json({ data: prompt }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 })
  }
}
```

**Pattern**: Auth → Zod parse → Prisma → Response. All errors return `{ error }` JSON.

### Component (React Server/Client Components)
```tsx
// Client Component pattern (interactivity needed)
"use client"
interface PromptListProps { prompts: Prompt[] }
export function PromptList({ prompts }: PromptListProps) {   // PascalCase, Props suffix
  const { viewMode } = useViewMode()
  return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">...shadcn/ui components...</div>
}
```

**Pattern**: Server Components by default. `"use client"` only when interactivity (hooks, event handlers, state) required. Props typed with `{Name}Props` interface.

### Refactor: Extract Segments Pattern
Large components (1k+ lines) → orchestrator + segments by functionality:

```
Orchestrator (state + business logic)
  ├── BasicInfoSegment    (title, description, body)
  ├── MetadataSegment     (type, status, language, favorite)
  ├── AdvancedSegment     (version, changelog, notes)
  └── TaxonomyMultiSelect (reusable for 6 N:M relations)
```

Rules: Each segment receives typed props + individual onChange. Orchestrator keeps all state. Extract in dependency order (helpers → dependents → orchestrator). Verify `npx tsc --noEmit` after EACH extraction. See `development/concepts/component-refactor-pattern.md`.

### Upsert Pattern (Global Entities)
Normalize → slug-based upsert for entities with name uniqueness (Platform, ClientProject, UseCase, ModelHint):
```typescript
const normalizedName = data.name.trim().toUpperCase()
const normalizedSlug = normalizedName.toLowerCase()
const entity = await prisma.platform.upsert({
  where: { slug: normalizedSlug },
  update: {},
  create: { name: normalizedName, slug: normalizedSlug },
})
```
See `development/concepts/upsert-entity-pattern.md`.

### Import Organization
Separate imports with blank lines: external packages → `@/` internal imports → `./` relative imports.

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `prompt-card.tsx`, `api-patterns.ts` |
| Components | PascalCase | `PromptCard`, `FilterSidebar` |
| Functions | camelCase (verb phrases) | `getPrompts()`, `validateInput()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `DEFAULT_PAGE_SIZE` |
| Types/Interfaces | PascalCase + `Props` suffix | `PromptListProps`, `PromptWithRelations` |
| CSS | Tailwind utility classes | `flex`, `gap-2`, `text-muted-foreground` |
| DB Models | PascalCase | `Prompt`, `Category`, `Tag` |

## Code Standards

- **TypeScript `strict: true`** — no `any` types allowed
- **Zod validation** on every API input (`safeParse` or `parse` w/ try/catch)
- **Prisma only** for database access — never raw SQL
- **Server Components by default** — Client Components only when interactivity needed
- **Language rules**: Code (variables, functions, comments) in English. Docs in Spanish. User messages via i18n, default `es-ES`.
- **Error handling**: `try/catch` returning `{ data }` or `{ error }` JSON. Never expose stack traces in production.
- **Pure functions preferred** — immutability, no side effects
- **N:M relationships** via junction tables with compound keys (`@@id([promptId, tagId])`)
- **Auth via NextAuth.js middleware** — protects all routes except `/auth/*`
- **DB migrations**: Via Prisma only. Never raw DDL in runtime code.
- **API response format**: `[id]` endpoints → `{ data, success: true }`. List endpoints → `{ items, total }`. Errors → `{ error, details? }`. See `development/concepts/api-response-standards.md`.
- **Same-file merging**: If two tasks modify the same file, execute them in the same batch to prevent merge conflicts.
- **CodeReviewer gate**: Each coding subtask must pass CodeReviewer BEFORE next subtask begins. See `development/concepts/task-delegation-workflow.md`.

## Security Requirements

- **All API routes require authentication** — `const session = await auth()` check at route start
- **Input validation with Zod** on every endpoint — schema-defined at route top
- **Parameterized queries via Prisma** — eliminates SQL injection risk
- **Auth secret required** — `AUTH_SECRET` env var (NextAuth.js)
- **Environment variables validated** — Prisma datasource URL, auth secret checked at init
- **No secrets in version control** — `.env*.local` in `.gitignore`
- **Rate limiting planned** — behind `UPSTASH_ENABLED` feature flag
- **CORS protection** — via Next.js built-in, no custom CORS headers
- **Password hashing** — bcryptjs for credentials provider

## Database Schema

**17 modelos total** — Prompt (entidad central), User, Account, Session, VerificationToken, Category, Tag, Platform, ClientProject, UseCase, ModelHint + 6 junction tables (PromptTag, PromptCategory, PromptPlatform, PromptClientProject, PromptUseCase, PromptModelHint).

**Estadísticas:** 17 tablas, 6 relaciones N:M, 6 relaciones 1:N, 26 índices, 16 foreign keys.

### Modelo Principal: Prompt (18 campos + 6 relaciones N:M)

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | String | PK @default(cuid()) | Identificador único CUID |
| title | String | NOT NULL | Título del prompt |
| description | String? | NULL | Descripción opcional |
| body | String | NOT NULL | Cuerpo del prompt |
| type | String | DEFAULT 'USER' | Tipo: SYSTEM, USER, TOOL |
| platform | String? | DEFAULT 'CURSOR' | Plataforma (legacy, mantener para compatibilidad) |
| modelHint | String? | NULL | Sugerencia de modelo (legacy) |
| language | String | DEFAULT 'es' | Código de idioma (ISO) |
| useCase | String? | NULL | Caso de uso (legacy) |
| clientOrProject | String? | NULL | Cliente/proyecto (legacy) |
| status | String | DEFAULT 'DRAFT' | Estado: DRAFT, TESTED, PRODUCTION |
| isFavorite | Boolean | DEFAULT false | Marcador de favorito |
| version | Int | DEFAULT 1 | Número de versión |
| changelog | String? | NULL | Historial de cambios |
| notes | String? | NULL | Notas adicionales |
| prePrompt | String? | @db.Text | Pre-prompt opcional |
| manualDeUso | String? | @db.Text | Manual de uso opcional |
| usageCount | Int | DEFAULT 0 | Contador de usos |
| lastUsedAt | DateTime? | NULL | Fecha de último uso |
| userId | String? | NULL, FK → User | Referencia al creador |
| createdAt | DateTime | @default(now()) | Fecha de creación |
| updatedAt | DateTime | @updatedAt | Fecha de actualización |

**Relaciones N:M** (6): categories (via PromptCategory), tags (via PromptTag), platforms (via PromptPlatform), clientProjects (via PromptClientProject), useCases (via PromptUseCase), modelHints (via PromptModelHint).

**Índices:** status, platform, isFavorite, language, userId

### Modelos de Taxonomía

**Category** (jerárquica): id (CUID PK), name/slug (UNIQUE NOT NULL), parentId (FK auto-relación), sortOrder. Relación: parent/children para árbol. Índices: parentId, slug.

**Tag**: id (CUID PK), name/slug (UNIQUE NOT NULL). Índice: slug.

**Platform**: id (CUID PK), name/slug (UNIQUE NOT NULL), sortOrder. Relación N:M con Prompt via PromptPlatform.

**ClientProject**: id (CUID PK), name/slug (UNIQUE NOT NULL), sortOrder. Relación N:M con Prompt via PromptClientProject.

**UseCase**: id (CUID PK), name/slug (UNIQUE NOT NULL), sortOrder. Relación N:M con Prompt via PromptUseCase.

**ModelHint**: id (CUID PK), name/slug (UNIQUE NOT NULL), sortOrder. Relación N:M con Prompt via PromptModelHint.

### Junction Tables (relaciones N:M)

Todas usan IDs compuestos `@@id([promtId, entityId])` con `onDelete: Cascade` en ambas FKs. Incluyen índices en ambas columnas FK.

| Tabla | IDs Compuestos |
|-------|---------------|
| PromptTag | `@@id([promptId, tagId])` |
| PromptCategory | `@@id([promptId, categoryId])` |
| PromptPlatform | `@@id([promptId, platformId])` |
| PromptClientProject | `@@id([promptId, clientProjectId])` |
| PromptUseCase | `@@id([promptId, useCaseId])` |
| PromptModelHint | `@@id([promptId, modelHintId])` |

### Modelos de Autenticación (NextAuth.js)

**User**: id (TEXT PK), name, email (UNIQUE NOT NULL), emailVerified, image, password (hash), role (DEFAULT 'user'), promptListViewPreference (DEFAULT 'cards'). Relaciones: accounts[], sessions[], prompts[].

**Account**: id (TEXT PK), userId (FK → User), type, provider, providerAccountId, tokens (refresh_token, access_token, expires_at, etc.). Unique: (provider, providerAccountId).

**Session**: id (TEXT PK), sessionToken (UNIQUE NOT NULL), userId (FK → User), expires. Unique: sessionToken.

**VerificationToken**: identifier, token (UNIQUE), expires. PK compuesto: (identifier, token).

### Campos Legacy (Compatibilidad)

Mantener campos legacy en schema y export para compatibilidad con imports v1.0:
- `platform`: String? (reemplazado por relación N:M Platform)
- `useCase`: String? (reemplazado por relación N:M UseCase)
- `clientOrProject`: String? (reemplazado por relación N:M ClientProject)
- `modelHint`: String? (reemplazado por relación N:M ModelHint)

**Regla**: Zod schemas deben aceptar ambos formatos durante transición. Planificar eliminación en Sprint futuro.

## API Routes

| Recurso | Métodos | Ruta | Auth | Descripción |
|---------|---------|------|:----:|-------------|
| **Auth** | GET, POST | `/api/auth/[...nextauth]` | No | NextAuth.js handlers |
| | POST | `/api/auth/register` | No | Registro de usuario |
| **Prompts** | GET, POST | `/api/prompts` | POST sí | Listar con filtros / Crear (Zod + upsert) |
| | GET, PUT, DELETE | `/api/prompts/[id]` | PUT/DELETE sí | CRUD individual con $transaction |
| | PATCH | `/api/prompts/[id]/usage` | No | Tracking de uso (contador + fecha) |
| **Categorías** | GET, POST | `/api/categories` | POST sí | CRUD |
| | PUT, DELETE | `/api/categories/[id]` | Admin | Categoría individual |
| **Tags** | GET, POST | `/api/tags` | POST sí | CRUD |
| | PUT, DELETE | `/api/tags/[id]` | Admin | Tag individual |
| **Platforms** | GET, POST | `/api/platforms` | POST sí | CRUD con normalización + upsert |
| **ClientProjects** | GET, POST | `/api/client-projects` | POST sí | CRUD con normalización + upsert |
| **UseCases** | GET, POST | `/api/use-cases` | POST sí | CRUD con normalización + upsert |
| **ModelHints** | GET, POST | `/api/model-hints` | POST sí | CRUD con normalización + upsert |
| **Export/Import** | GET | `/api/export/prompts` | Sí | Exportar JSON v2.0 con auth + transformación N:M |
| | POST | `/api/import/prompts` | Sí | Importar JSON v1.0/v2.0 con upsert |
| **Preferencias** | GET, PATCH | `/api/user/preferences` | Sí | Preferencia vista cards/lista |
| **Usuarios** | GET, PUT | `/api/users` | Admin | CRUD admin |
| | DELETE | `/api/users/[id]` | Admin | Eliminar usuario |

## Commands (package.json)

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Build para producción (Next.js standalone) |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint` | ESLint (config next/core-web-vitals) |
| `npx tsc --noEmit` | TypeScript check sin output (rápido pre-build) |
| `npm test` | Ejecutar tests (Jest, 56 tests, 8 suites) |
| `npm run test:watch` | Tests en modo watch |
| `npx prisma studio` | Abrir Prisma Studio (UI de BD) |
| `npm run db:push` | Push schema a BD (dev, `prisma db push`) |
| `npm run db:migrate` | Ejecutar migraciones (`prisma migrate deploy`) |
| `npm run db:seed` | Seed de datos de ejemplo |
| `npm run db:generate` | Generar Prisma Client |
| `npm run db:migrate-data` | Migrar datos entre esquemas |
| `npx prisma migrate dev` | Crear migración en desarrollo |
| `vercel` | Deploy a preview |
| `source .env && npx vercel --prod --token="\$VERCEL_TOKEN"` | Deploy a producción (cargar .env primero) |
| `vercel env pull` | Descargar env vars de Vercel |
| `vercel logs` | Ver logs de producción |

## Frontend Architecture
- **Route groups**: `(app)` for authenticated pages (prompts, categories, tags); `(auth)` for public auth pages (signin, signup)
- **shadcn/ui components**: button, card, dialog, input, label, select, textarea, badge (8 total)
- **Key components**: PromptForm (1021 lines), PromptFilters, PromptList, Sidebar, Topbar
- **Context**: ViewModeContext persists via PATCH /api/user/preferences
- **Pages**: /prompts, /prompts/new, /prompts/[id], /categories, /tags, /auth/signin, /auth/signup

## Testing

- **Framework**: Jest 29.7 + next/jest + jest-environment-jsdom
- **Test files**: 8 total — 5 API (auth, prompts, prompts-[id], export, import) + 3 components (PromptFilters, PromptList, auth)
- **Mocks**: next-auth, @auth/prisma-adapter, next-auth/react, next/navigation, prisma ($transaction)
- **Conditional UI debugging**: Before testing a conditional element, verify its render condition ACTUALLY passes. Always provide required state/props for the element to render.
- **Mock methods checklist**: Before mocking a Prisma entity, check: findFirst, findUnique, findMany, create, update, upsert, delete, deleteMany — all that apply.

## Docker

- **Dockerfile** — Multi-stage (node:20-alpine, deps→builder→runner), standalone Next.js output, Prisma generate at build
- **Dockerfile.dev** — Single-stage for hot-reload dev, runs `npm run dev`
- **docker-compose.dev.yml** — app (hot-reload) + PostgreSQL 14 with healthcheck
- **docker-compose.yml** — Production w/ Traefik labels (legacy, no usado)

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| DATABASE_URL_UNPOOLED | Neon non-pooled connection | Production |
| AUTH_SECRET | NextAuth.js JWT signing key | Yes |
| AUTH_URL | NextAuth.js base URL | Yes |
| NODE_ENV | Environment mode (dev/prod/test) | Yes |
| NEXT_PUBLIC_BASE_PATH | Subfolder base path | Optional |
| UPSTASH_ENABLED | Rate limiting feature flag | Optional |
| UPSTASH_REDIS_REST_URL | Upstash Redis REST endpoint | If UPSTASH_ENABLED |
| UPSTASH_REDIS_REST_TOKEN | Upstash Redis auth token | If UPSTASH_ENABLED |
| POSTGRES_PRISMA_URL | Prisma pooled PG URL (Neon) | Production |
| POSTGRES_URL | Pooled PG URL (Neon) | Production |
| POSTGRES_URL_NON_POOLING | Non-pooled PG URL (Neon) | Production |
| POSTGRES_USER | PG user (Neon) | Production |
| POSTGRES_PASSWORD | PG password (Neon) | Production |
| POSTGRES_HOST | PG host (Neon) | Production |
| POSTGRES_DATABASE | PG database name (Neon) | Production |

## Known Pitfalls (Preventive Knowledge)

> Resumen de alto nivel. Para catálogo detallado con código, ver `errors/tech-knowledge.md`.

### Autenticación (NextAuth.js)
- **`AUTH_SECRET` missing** → `MissingSecret` error en middleware. Validar en init, configurar en todos los entornos.
- **Auth pages need `force-dynamic`** → Páginas que usan `auth()` necesitan `export const dynamic = 'force-dynamic'` o fallan pre-render estático.
- **Error page missing** → Config pone `/auth/error` pero la página puede no existir. Crear todas las custom pages.
- **Protección insuficiente de rutas** → Usar enfoque "deny-all" en middleware. Documentar rutas públicas explícitamente.
- **Sidebar en auth pages** → Usar layouts separados `(app)` y `(auth)` para evitar que UI de app aparezca en login.
- **Backend sin frontend** → Endpoints `/api/users/*` existen pero sin UI. Planificar frontend en paralelo.
- **Auth check como PRIMERA operación** → `const session = await auth()` antes de cualquier acceso a DB. Previene exposición de datos.

### Prisma y Base de Datos
- **IDs compuestos en junction tables** → Usar `@@id([promptId, entityId])` en lugar de `@id @default(cuid())`. IDs simples impiden crear múltiples relaciones para un mismo prompt.
- **Seed con relaciones N:M** → Crear prompt con `prisma.prompt.create()` y relaciones con `prisma.promptPlatform.create()` separadas. Evitar nested writes.
- **Campos nullable en TypeScript** → Cuando schema tiene `Type?`, las interfaces deben aceptar `Type | null`. Si no, build falla.
- **$transaction obligatorio** → Updates de múltiples relaciones N:M deben envolverse en `$transaction` explícito. Si una operación falla, todas se revierten.
- **Compatibilidad dual** → Mantener campos legacy como opcionales en Zod schemas durante transición a N:M.
- **`prisma db push` en no-interactivo** → `prisma migrate dev` requiere entorno interactivo. Usar `prisma db push` en Codespaces/CI/Docker.
- **`onDelete: Cascade`** → Todas las junction tables deben tener Cascade en ambas FKs para evitar orphan records.
- **Null coalescing para no-nullables** → Campos `String @default("VALUE")` necesitan `??` si datos externos pueden traer null.

### Despliegue (Vercel)
- **Prisma Client outdated** → Script `"postinstall": "prisma generate"` obligatorio en package.json para cloud deploys.
- **Prisma seed config** → Configurar explícitamente `prisma.seed` en package.json. Documentar comandos por entorno.
- **Despliegues automáticos** → `"deploymentEnabled": { "main": false }` en vercel.json para control manual.
- **BasePath consistency** → Verificar que `basePath` en `next.config.js` coincida con configuración de Vercel.
- **Solo PostgreSQL (Neon)** → No hay entorno local. No existe SQLite ni desarrollo local. Todo el desarrollo y prueba se hace directamente en PRODUCTION (Vercel + Neon.tech PostgreSQL).

### Next.js y Build
- **ESLint unescaped entities** → Apóstrofes en JSX rompen build. Escapar o configurar `react/no-unescaped-entities`.
- **Pre-renderizado estático con auth** → `auth()` necesita `force-dynamic`. Aplicar a todas las páginas que usan sesión.
- **Server Actions body size** → Configurado `bodySizeLimit: '2mb'` en next.config.js. Documentar límites.
- **Serialización de fechas** → Prisma retorna `Date`. Serializar a ISO string antes de pasar a componentes cliente.
- **Navegación condicional** → Create: `router.push()`. Edit: `router.refresh()`. No mezclar ambos en el mismo handler.
- **Parseo de searchParams** → `searchParams` puede ser `string` o `string[]`. Usar `Array.isArray(x) ? x : x ? [x] : []`.

### Testing
- **Baseline primero** → Ejecutar `npm test` antes de añadir tests nuevos. Actualmente 56 tests, 8 suites, 100% passing.
- **Mock de $transaction** → Mock debe ejecutar `fn(mockTx)` y retornar resultado. Mock simple con valor fijo no funciona.
- **Zod en tests** → Schemas de Zod validan estrictamente. Tests con datos incompletos fallan con 400, no prueban lógica.
- **URLSearchParams mock** → NO usar `jest.mock` en setup. Reemplazar `global.URLSearchParams` directamente en cada test.
- **Mocks de upsert completos** → Deben retornar `{ id, name, slug }`. Mock incompleto causa "Cannot read properties of undefined".
- **Mocks de relaciones N:M** → Incluir arrays completos: `platforms: [{ platform: { name: "CURSOR" } }]`.
- **Cobertura ≥ 60%** → Alcanzable con mocks parciales. Actualmente 64.7% (56 tests, 100% passing).

### Filtros y UI
- **Lógica OR con `some`** → Filtros multi-selección usan `some { entityId: { in: ids } }`. Si se necesita AND en futuro, cambiar a `every`.
- **ToggleFilter genérico** → Usar `params.append()` / `params.getAll()` para arrays en URL. No estado local.
- **ViewToggle con persistencia** → Usar `useTransition` para pending state. Revertir a modo anterior si fetch falla.
- **Include de N:M en edición** → Usar `include: { platforms: { include: { platform: true } } }` para cargar valores seleccionados.

### Patrones y Arquitectura
- **Switch en lugar de acceso dinámico** → No usar `prisma[key as any]`. Usar switch statement para cada tipo de entidad (type-safe).
- **Junction tables requieren operaciones explícitas** → No se puede usar `categoryId` directo. Usar `promptCategory.create()` / `promptCategory.deleteMany()`.
- **Filtrado por userId** → Toda query de lectura debe filtrar por `userId: session.user.id`. Nunca `findMany()` sin filtro.
- **Transformación N:M a arrays** → Export: `.map((pp) => pp.platform.name)`. No incluir objetos complejos en JSON.
- **Desarrollo balanceado** → No implementar backend sin frontend. Cada endpoint debe tener UI correspondiente.
- **Planificar tests primero** → Documentar archivos, tests individuales, criterios de aceptación, mocks necesarios antes de implementar.

## 📂 Codebase References

| Context | Implementation |
|---------|---------------|
| API pattern | `app/api/prompts/route.ts` — full CRUD w/ auth + Zod + Prisma |
| Component pattern | `components/prompt/PromptList.tsx` — `"use client"` pattern |
| DB schema | `prisma/schema.prisma` — all models, junctions, indexes |
| Auth config | `lib/auth.ts` — NextAuth + credentials + JWT |
| Auth middleware | `middleware.ts` — route protection for all non-auth pages |
| Prisma client | `lib/prisma.ts` — singleton with global cache |
| Validation | Inline Zod schemas in each API route (app/api/*/route.ts) |
| TypeScript config | `tsconfig.json` — strict: true, path aliases |
| Package manifest | `package.json` — all deps, scripts, Prisma config |
| Docker production | `Dockerfile` — multi-stage build |
| Docker dev | `Dockerfile.dev` — hot-reload |
| Frontend layout | `app/(app)/layout.tsx`, `app/(auth)/layout.tsx` — route groups |
| Test setup | `jest.setup.js` — mocks for next-auth, prisma |
| ViewMode context | `contexts/ViewModeContext.tsx` — list/cards toggle |

## Related Files

- `business-domain.md` — Business context for this technical foundation
- `decisions-log.md` — Migration decisions (SQLite→PG, Railway→Vercel)
- `living-notes.md` — Active technical debt, open questions
- `errors/tech-knowledge.md` — Full error catalog with code examples and prevention steps
