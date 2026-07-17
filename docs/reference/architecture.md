# Prompt Database — Arquitectura de Referencia

**Repositorio:** https://github.com/omagallanes/p-database  
**Última actualización:** 21 de abril de 2026  
**Plataforma de despliegue:** Vercel (Plan Hobby)

---

## 1. Stack Tecnológico

### Lenguajes y Frameworks

| Tecnología | Versión | Propósito |
|---|---|---|
| **TypeScript** | ^5.5.4 | Lenguaje principal |
| **Next.js** | ^14.2.35 | Framework full-stack (App Router) |
| **React** | ^18.3.1 | Librería de UI |
| **Prisma** | ^5.19.1 | ORM type-safe, multi-DB |
| **TailwindCSS** | ^3.4.7 | Framework de estilos |
| **Zod** | ^3.23.8 | Validación de esquemas |
| **NextAuth.js** | ^5.0.0-beta.31 | Autenticación |

### UI y Testing

| Categoría | Herramientas |
|---|---|
| **UI Components** | shadcn/ui + @radix-ui/react-* (dialog, dropdown-menu, label, select, slot, tabs) |
| **Iconos** | lucide-react ^0.427.0 |
| **CSS Utils** | class-variance-authority ^0.7.0 · tailwind-merge ^2.5.2 · clsx ^2.1.1 |
| **Testing** | Jest ^29.7.0 + @testing-library/react ^16.0.0 + jest-environment-jsdom ^29.7.0 |
| **Linting** | ESLint ^8.57.1 + eslint-config-next ^14.2.5 |

**Estructura de tests:** 8 suites, 58 tests
- `tests/api/prompts.test.ts` · `tests/api/prompts-[id].test.ts` · `tests/api/auth.test.ts` · `tests/api/export.test.ts` · `tests/api/import.test.ts`
- `tests/components/PromptList.test.tsx` · `tests/components/PromptFilters.test.tsx` · `tests/components/auth.test.tsx`
- Comandos: `npm test` · `npm run test:watch`

---

## 2. Features

| Feature | Estado | Feature | Estado |
|---|---|---|---|
| CRUD de Prompts | ✅ | Tracking de uso | ✅ |
| Categorías jerárquicas | ✅ | Favoritos | ✅ |
| Etiquetas (relación M:N) | ✅ | Versionado de prompts | ✅ |
| Búsqueda full-text | ✅ | Export/Import JSON | ✅ |
| Filtros avanzados | ✅ | Copiar al portapapeles | ✅ |
| Autenticación + Roles (USER/ADMIN) | ✅ | Duplicar prompts | ✅ |
| Panel de administración | ⚠️ Endpoints admin dispersos (sin UI) | Multidioma (i18n) | 🔄 Pendiente |
| Generación automática de prompts | 🔄 Futuro | | |

---

## 3. Base de Datos

**Motores:** SQLite en desarrollo · PostgreSQL 14+ (Neon serverless, 512 MB) en producción  
**ORM:** Prisma ^5.19.1 — tipos automáticos, migraciones versionadas, multi-base de datos. Migración SQLite → PostgreSQL completada.

### Tablas

**User** — `id` (CUID PK), `email` (UNIQUE, NOT NULL), `password` (hash, NULL si OAuth), `role` (default 'user').  
Relaciones 1:N → Account, Session, Prompt.

**Prompt** (tabla principal) — `id` (CUID PK), `title`, `body` (NOT NULL), `type` (SYSTEM/USER/TOOL), `language` (default "es"), `status` (DRAFT/TESTED/PRODUCTION), `usageCount` (default 0), `lastUsedAt`, `version` (default 1), `isFavorite`, `description`, `changelog`, `notes`, `prePrompt`, `manualDeUso`, `userId` (FK→User), `createdAt`/`updatedAt`.

**Campos legacy (mantenidos para compatibilidad):** `platform`, `modelHint`, `useCase`, `clientOrProject` (String? — reemplazados por relaciones N:M).

**Relaciones N:M en Prompt:**
- `categories PromptCategory[]` (relación N:M con Category vía junction table)
- `platforms PromptPlatform[]`, `clientProjects PromptClientProject[]`, `useCases PromptUseCase[]`, `modelHints PromptModelHint[]`, `tags PromptTag[]`

**Category** (jerárquica) — `id` (CUID PK), `name`/`slug` (UNIQUE), `parentId` (FK→Category, auto-relación), `sortOrder`.

**Tag** — `id` (CUID PK), `name`/`slug` (UNIQUE).

### Modelos Adicionales (relaciones N:M)

**Platform** — `id` (CUID PK), `name`/`slug` (UNIQUE), `sortOrder`, timestamps.

**ClientProject** — `id` (CUID PK), `name`/`slug` (UNIQUE), `sortOrder`, timestamps.

**UseCase** — `id` (CUID PK), `name`/`slug` (UNIQUE), `sortOrder`, timestamps.

**ModelHint** — `id` (CUID PK), `name`/`slug` (UNIQUE), `sortOrder`, timestamps.

### Junction Tables (relaciones N:M)

| Tabla | IDs Compuestos |
|---|---|
| `PromptTag` | `@@id([promptId, tagId])` |
| `PromptCategory` | `@@id([promptId, categoryId])` |
| `PromptPlatform` | `@@id([promptId, platformId])` |
| `PromptClientProject` | `@@id([promptId, clientProjectId])` |
| `PromptUseCase` | `@@id([promptId, useCaseId])` |
| `PromptModelHint` | `@@id([promptId, modelHintId])` |

### Modelos de Autenticación (NextAuth.js)

**Account** — `id` (CUID PK), `userId` (FK→User), `type`, `provider`, `providerAccountId`, tokens.

**Session** — `id` (CUID PK), `sessionToken` (UNIQUE), `userId` (FK→User), `expires`.

**VerificationToken** — `identifier`, `token`, `expires` (PK compuesto).

### Relaciones Clave

| Relación | Tipo | onDelete |
|---|---|---|
| User → Prompt | 1:N | SetNull |
| Prompt → Category | N:M (vía PromptCategory) | Cascade |
| Prompt → Tag | N:M (vía PromptTag) | Cascade |
| Prompt → Platform | N:M (vía PromptPlatform) | Cascade |
| Prompt → ClientProject | N:M (vía PromptClientProject) | Cascade |
| Prompt → UseCase | N:M (vía PromptUseCase) | Cascade |
| Prompt → ModelHint | N:M (vía PromptModelHint) | Cascade |
| Category → Category (árbol) | 1:N (auto-relación) | Cascade |

---

## 4. Arquitectura del Proyecto

**Patrón:** Next.js App Router con arquitectura de capas.

```
Frontend (React Components)
       ↓ HTTP
API Routes (/api/prompts, /api/categories, /api/tags, /api/auth, /api/users)
       ↓
Prisma Client (ORM type-safe)
       ↓
PostgreSQL (Neon) / SQLite (dev)
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

---

## 5. API Endpoints

| Recurso | Métodos | Rutas | Descripción |
|---|---|---|---|
| **Prompts** | GET/POST | `/api/prompts` | Listar con filtros / Crear |
| | GET/PUT/DELETE | `/api/prompts/[id]` | CRUD individual |
| | PATCH | `/api/prompts/[id]/usage` | Tracking de uso |
| **Categorías** | GET/POST/PUT/DELETE | `/api/categories` · `/api/categories/[id]` | CRUD |
| **Tags** | GET/POST/PUT/DELETE | `/api/tags` · `/api/tags/[id]` | CRUD |
| **Platforms** | GET/POST | `/api/platforms` | CRUD con normalización + upsert |
| **ClientProjects** | GET/POST | `/api/client-projects` | CRUD con normalización + upsert |
| **UseCases** | GET/POST | `/api/use-cases` | CRUD con normalización + upsert |
| **ModelHints** | GET/POST | `/api/model-hints` | CRUD con normalización + upsert |
| **Users** | GET/PUT | `/api/users` | CRUD admin |
| | DELETE | `/api/users/[id]` | CRUD admin |
| **Export/Import** | GET | `/api/export/prompts` | Exportar JSON v2.0 (auth) |
| | POST | `/api/import/prompts` | Importar JSON v1.0/v2.0 (auth) |
| **Auth** | GET/POST | `/api/auth/[...nextauth]` | NextAuth handlers |
| | POST | `/api/auth/register` | Registro de usuarios |
| **Preferencias** | GET/PATCH | `/api/user/preferences` | Preferencia vista cards/lista |

---

## 6. Despliegue

### Vercel (Plan Hobby) + Neon PostgreSQL

| Recurso | Límite / Detalle |
|---|---|
| Ancho de banda | 100 GB/mes |
| Ejecuciones / Funciones | 100 GB-horas/mes |
| Construcciones | 6,000 min/mes |
| Base de datos (Neon) | 512 MB, 60 conexiones, backup automático, escalado automático, SSL |
| Dominios | Ilimitados, SSL automático |

### Variables de Entorno

```
DATABASE_URL          → PostgreSQL Neon (producción) / SQLite (desarrollo)
AUTH_SECRET           → Secreto para NextAuth.js
AUTH_URL              → URL de la app en producción
NEXT_PUBLIC_BASE_PATH → Subpath opcional (ej: /prompt-database)
NODE_ENV              → "production" en despliegue
VERCEL_TOKEN          → Token de Vercel CLI (para deploy manual)
UPSTASH_ENABLED       → Control de rate limiting Upstash (opcional, deshabilitado)
```

### Flujo de Despliegue

1. Importar repositorio GitHub en Vercel (framework Next.js)
2. Configurar variables de entorno (DATABASE_URL, AUTH_SECRET, AUTH_URL)
3. Crear proyecto Neon, copiar DATABASE_URL, ejecutar `npx prisma migrate deploy`
4. Despliegues automáticos desactivados — manuales vía Vercel CLI. Preview deployments para PRs.

---

## 7. Gobernanza

### Documentación del Proyecto

Toda la documentación de referencia se encuentra en `docs/`:

| Documento | Contenido |
|---|---|
| `docs/reference/architecture.md` | Este documento — arquitectura de referencia |
| `docs/reference/tech-knowledge.md` | Errores previos, anti-patrones y criterios preventivos |
| `docs/reference/db-schema.md` | Esquema completo de base de datos |
| `docs/reference/api-endpoints.md` | Catálogo de endpoints REST |
| `docs/reference/auth-setup.md` | Configuración de autenticación |
| `docs/reference/prisma-setup.md` | Patrones y configuración de Prisma |
| `docs/guide/deployment.md` | Pasos para desplegar en producción |

### Skills

| Skill | Propósito |
|---|---|
| **context7** | Documentación técnica de librerías externas |
