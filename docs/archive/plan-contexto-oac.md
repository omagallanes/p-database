# Plan de Trabajo: Alimentar Contexto del Proyecto en OAC

> **Versión:** 1.0
> **Fecha:** 2026-07-14
> **Propósito:** Documentar todos los hallazgos y acciones necesarias para poblar los 6 archivos de `project-intelligence/` de OAC con información verídica del proyecto.

---

## Resumen de Hallazgos

De los 6 archivos de contexto, solo **2 tienen contenido real** y **4 están vacíos (templates)** :

| Archivo | Líneas | Estado | Prioridad |
|---------|--------|--------|-----------|
| `technical-domain.md` | 131 | 🟡 Parcial (faltan secciones) | Crítica |
| `navigation.md` | 81 | ✅ Completo | — |
| `business-domain.md` | 88 | 🔴 Template vacío | Alta |
| `business-tech-bridge.md` | 94 | 🔴 Template vacío | Alta |
| `decisions-log.md` | 130 | 🔴 Template vacío | Alta |
| `living-notes.md` | 114 | 🔴 Template vacío | Alta |

---

## 1. technical-domain.md — Ampliaciones necesarias

Estado actual: 131 líneas. Límite MVI: <200 líneas. Margen disponible: ~69 líneas.

### 1.1 Añadir sección: Database Schema
**Fuente:** `prisma/schema.prisma` (leído y verificado)

Contenido a añadir:
- Resumen de modelos (15 total): User, Account, Session, VerificationToken, Prompt + 5 taxonomías (Category, Tag, Platform, ClientProject, UseCase, ModelHint) + 6 junction tables
- Destacar las 6 junction tables con claves compuestas (`@@id([aId, bId])`)
- Mencionar campos legacy en Prompt (platform, useCase, clientOrProject, modelHint — strings) vs N:M relaciones actuales
- Índices en Prompt: status, platform, isFavorite, language, userId

### 1.2 Añadir sección: API Landscape
**Fuente:** Exploración de `app/api/` (18 route files verificados)

Contenido a añadir:
| Ruta | Métodos | Auth | Descripción |
|------|---------|------|-------------|
| /api/auth/[...nextauth] | GET, POST | No | NextAuth handlers |
| /api/auth/register | POST | No | Registro |
| /api/prompts | GET, POST | POST sí | CRUD prompts |
| /api/prompts/[id] | GET, PUT, DELETE | PUT/DELETE sí | Prompt individual |
| /api/prompts/[id]/usage | PATCH | No | Tracking de uso |
| /api/categories | GET, POST | POST sí | CRUD categorías |
| /api/categories/[id] | PUT, DELETE | Admin | Categoría individual |
| /api/tags | GET, POST | POST sí | CRUD tags |
| /api/tags/[id] | PUT, DELETE | Admin | Tag individual |
| /api/platforms | GET, POST | POST sí | Taxonomía plataformas |
| /api/model-hints | GET, POST | POST sí | Taxonomía model-hints |
| /api/client-projects | GET, POST | POST sí | Taxonomía client-projects |
| /api/use-cases | GET, POST | POST sí | Taxonomía use-cases |
| /api/export/prompts | GET | Sí | Export v2.0 JSON |
| /api/import/prompts | POST | Sí | Import v1.0/v2.0 |
| /api/user/preferences | GET, PATCH | PATCH sí | Preferencia vista |
| /api/users | GET, PUT | Admin | Gestión usuarios |
| /api/users/[id] | DELETE | Admin | Eliminar usuario |

### 1.3 Añadir sección: Frontend Architecture
**Fuente:** Exploración de `app/` y `components/`

Contenido a añadir:
- Route groups: `(app)` for authenticated, `(auth)` for public
- Layout nesting: Root → App Layout (Sidebar+Topbar) | Auth Layout (centered)
- shadcn/ui components: 8 (button, card, dialog, input, label, select, textarea, badge)
- Icons: lucide-react
- Key components: PromptForm (1021 lines — the largest), PromptFilters (420 lines), PromptList, Sidebar, Topbar, LoginForm, SignupForm
- Context: ViewModeContext (persiste vía PATCH /api/user/preferences)
- Páginas: /prompts (list), /prompts/new (create), /prompts/[id] (edit), /categories, /tags, /auth/signin, /auth/signup, /auth/profile

### 1.4 Añadir sección: Testing
**Fuente:** `jest.config.js`, `jest.setup.js`, `tests/`

Contenido a añadir:
- Framework: Jest 29.7 + next/jest + jest-environment-jsdom
- Setup: @testing-library/jest-dom, mocks de next-auth, prisma, next/navigation
- 8 test files: 5 API (auth, prompts, prompts-[id], export, import) + 3 components (PromptFilters, PromptList, auth)
- Cobertura: CRUD prompts, N:M relations, export/import v1.0/v2.0, ownership checks, filtros frontend

### 1.5 Añadir sección: Docker
**Fuente:** `Dockerfile`, `docker-compose.yml`, `docker-compose.dev.yml`

Contenido a añadir:
- Multi-stage Dockerfile (node:20-alpine, standalone output)
- Dockerfile.dev (hot-reload)
- docker-compose.dev.yml (app + PostgreSQL)
- docker-compose.yml (production with Traefik labels — legacy but present)

### 1.6 Añadir nuevas variables de entorno
**Fuente:** `.env.example`, `.env.development`, `.env.production`, `.env.vercel`

Completar la tabla actual con:
- `DATABASE_URL_UNPOOLED` — Neon non-pooled connection
- `AUTH_URL` — NextAuth URL
- `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_URL_NO_SSL` — Neon vars
- `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE` — PG connection details
- `NEON_PROJECT_ID` — Neon project
- `VERCEL`, `VERCEL_ENV`, `VERCEL_OIDC_TOKEN` — Vercel runtime vars

---

## 2. business-domain.md — Poblar desde cero

Estado actual: 88 líneas de template vacío (100% placeholders `[Nombre]`).

### 2.1 Project Identity
- **Project Name:** Prompt Database
- **Tagline:** Manage and organize your AI prompts
- **Problem Statement:** Users need a centralized, searchable, filterable system to create, organize, and reuse AI prompts across different platforms and AI models.
- **Solution:** Full-stack web app with CRUD, N:M taxonomies, full-text search, export/import, usage tracking, multi-language support.

### 2.2 Target Users
- **Primary:** AI practitioners, prompt engineers, content creators who work with multiple AI platforms (ChatGPT, Claude, Midjourney, etc.)
- **Secondary:** Teams that share and collaborate on prompt libraries

### 2.3 Value Proposition
- Centralized prompt management across platforms
- Full-text search across title, description, body, pre-prompt, usage manual
- Multi-platform export/import with N:M relations
- Usage tracking (count + last used)
- Hierarchical categories + multi-tag taxonomy

### 2.4 Roadmap Context
- **Current state:** 4 de 5 fases completadas. Pendiente despliegue a Vercel.
- **Next milestone:** Despliegue producción + verificación post-deploy

---

## 3. decisions-log.md — Poblar con decisiones reales

Estado actual: 130 líneas de template (2 entries placeholder vacías).

### 3.1 Decisiones a documentar (mínimo 6):

| # | Decisión | Fecha | Estado |
|---|----------|-------|--------|
| 1 | Migración SQLite → PostgreSQL | ~2026-04 | Decidida |
| 2 | Migración Railway → Vercel | ~2026-04 | Decidida |
| 3 | Migración string fields → N:M junction tables | ~2026-04 | Decidida |
| 4 | NextAuth.js JWT + Credentials (no OAuth) | Original | Decidida |
| 5 | shadcn/ui + TailwindCSS como UI library | Original | Decidida |
| 6 | KILO → OAC como framework de desarrollo | ~2026-07 | Decidida |
| 7 | Eliminación VPS/Hetzner/Traefik | ~2026-07 | Decidida |

Cada entrada debe incluir: Contexto, Decisión, Alternativas consideradas, Impacto (positivo/negativo/riesgo).

---

## 4. living-notes.md — Poblar con issues reales

Estado actual: 114 líneas de template vacío.

### 4.1 Technical Debt
| Item | Impacto | Prioridad |
|------|---------|-----------|
| Seed credentials hardcoded en `prisma/seed.ts` (passwords en texto plano) | ⚠️ Seguridad — credenciales en repo público | Alta |
| Campos legacy string en Prompt (platform, useCase, clientOrProject, modelHint) mantenidos por compatibilidad | Medio — duplicación con N:M relations | Media |
| Rate limiting no implementado (solo feature flag `UPSTASH_ENABLED`) | Medio — sin protección contra abuso | Media |

### 4.2 Known Issues
| Issue | Severidad | Estado |
|-------|-----------|--------|
| `/auth/error` referenciado en middleware y `lib/auth.ts` pero el directorio NO existe | 🔴 Alta | Known |
| ESLint `react/no-unescaped-entities` puede romper build con apóstrofos en JSX | 🟡 Media | Known |
| Páginas que usan `auth()` necesitan `force-dynamic` o fallan pre-renderizado estático | 🟡 Media | Known |

### 4.3 Gotchas for Maintainers
- Seed passwords en texto plano — usar env vars o borrar antes de producción
- Las 6 junction tables usan `onDelete: Cascade` en ambas FKs
- Export v2.0 transforma N:M relations a arrays de nombres; import acepta tanto arrays como legacy strings
- El middleware protege todo excepto `/auth/signin`, `/auth/signup`, `/auth/error`

---

## 5. business-tech-bridge.md — Poblar con mapeos reales

Estado actual: 94 líneas de template vacío.

### 5.1 Core Mappings (mínimo 4):

| Business Need | Technical Solution | Business Value |
|---------------|-------------------|----------------|
| Gestionar prompts multi-plataforma | Prompt model + 6 junction tables N:M (Platform, Category, Tag, ClientProject, UseCase, ModelHint) | Taxonomía flexible sin límites |
| Buscar prompts rápidamente | Full-text search en title/description/body + filtros por 8 dimensiones (categoría, tags, plataforma, estado, idioma, favoritos, proyecto, caso de uso) | Encontrar prompts en segundos |
| Exportar/importar entre entornos | JSON v2.0 con N:M relations + dual parser (v1.0 legacy) + upsert por id o título | Portabilidad de datos |
| Control de acceso | NextAuth.js + JWT + middleware (protección por ruta) + owner/admin roles | Datos protegidos por usuario |

### 5.2 Trade-off Decisions
- **Seguridad vs funcionalidad:** Formulario de registro abierto (cualquiera puede crear cuenta) por simplicidad, no por requerimiento de seguridad.

---

## 6. Bugs y problemas adicionales detectados

| # | Hallazgo | Gravedad | Acción |
|---|----------|----------|--------|
| 1 | `/auth/error` — Página referenciada pero no existe. Config en `lib/auth.ts` línea `error: "/auth/error"` y middleware la referencia. | 🔴 Alta | Crear página o corregir config |
| 2 | Seed credentials en texto plano (`prisma/seed.ts`) — Admin password `G4VK2F56FTS96YDG`, User password `281116pDB` | 🔴 Alta | Usar env vars o eliminar seed sensible |
| 3 | `prisma/migrations/` en `.gitignore` — No hay historial de migraciones en el repo | 🟡 Media | Documentar que las migraciones están gitignored |
| 4 | PromptForm.tsx (1021 líneas) — Componente muy grande, difícil de mantener | 🟡 Media | Refactor futuro |
| 5 | Sin rate limiting real — Solo feature flag `UPSTASH_ENABLED=false` | 🟡 Media | Implementar o documentar como pendiente |

---

## 7. Orden de ejecución propuesto

| Orden | Archivo | Acción | Esfuerzo |
|-------|---------|--------|----------|
| 1 | `technical-domain.md` | Añadir secciones: Schema DB, API Landscape, Frontend, Testing, Docker, + env vars | ~~30-45 min~~ |
| 2 | `business-domain.md` | Poblar con identidad, usuarios, propuesta de valor, roadmap | ~~15-20 min~~ |
| 3 | `decisions-log.md` | Documentar 7 decisiones reales con contexto completo | ~~20-30 min~~ |
| 4 | `living-notes.md` | Poblar debt, issues, gotchas | ~~15-20 min~~ |
| 5 | `business-tech-bridge.md` | Poblar core mappings + trade-offs | ~~15-20 min~~ |

**Total estimado:** ~1.5-2 horas

---

*Documento generado a partir de la exploración exhaustiva del proyecto realizada el 2026-07-14.*
*Toda la información ha sido verificada contra archivos reales del repositorio.*
