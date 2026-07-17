# Mapa Técnico de Intervención

**Documento:** `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md`  
**Bloque emisor:** 110-BLOQUE-01  
**Fecha de generación:** 2026-04-24  
**Versión:** 1.0

---

## 1. Alcance del análisis del bloque

### Objetivo tomado como referencia

Este análisis se basa en los requisitos funcionales definidos en:
- `doc-plan/doc-base/01-Briefing.md`: Marco de contexto, problema y objetivo
- `doc-plan/doc-base/02-Improvement-Spec.md`: 50 RF detallados sobre Metadata, Basic Information, continuidad de flujo y visualización del listado

### Qué se ha inspeccionado del repositorio

| Área | Archivos inspeccionados | Nivel de detalle alcanzado |
|------|------------------------|---------------------------|
| **Schema de base de datos** | `prisma/schema.prisma` | Completo (131 líneas) |
| **Componentes de Prompt** | `components/prompt/PromptForm.tsx`, `PromptList.tsx`, `PromptFilters.tsx` | Completo (533 + 181 + 217 líneas) |
| **Rutas de aplicación** | `app/(app)/prompts/page.tsx`, `app/(app)/prompts/new/page.tsx`, `app/(app)/prompts/[id]/page.tsx` | Completo (230 + 37 + 63 líneas) |
| **API Routes** | `app/api/prompts/route.ts`, `app/api/prompts/[id]/route.ts` | Completo (163 + 199 líneas) |
| **Export/Import** | `app/api/export/prompts/route.ts`, `app/api/import/prompts/route.ts` | Completo (60 + 144 líneas) |
| **Autenticación** | `lib/auth.ts` | Completo (62 líneas) |
| **Utilidades** | `lib/prisma.ts`, `lib/utils.ts` | Completo |
| **Configuración** | `package.json` | Dependencies principales |

### Límites del análisis

- **No se inspeccionaron**: `middleware.ts`, `components/layout/Topbar.tsx`, `components/layout/Sidebar.tsx` (se identifican pero no se analiza su contenido completo)
- **No se inspeccionaron**: Componentes de auth (`LoginForm`, `SignupForm`, `UserProfile`)

---

## 2. Resumen del mapa técnico

### Zonas del sistema más relevantes

| Zona | Concentración de impacto | Justificación |
|------|-------------------------|---------------|
| **Frontend — Componentes de Prompt** | ALTA | `PromptForm.tsx` concentra 15+ campos editables, `PromptList.tsx` gestiona visualización, `PromptFilters.tsx` maneja filtros |
| **Backend — API Routes** | ALTA | `app/api/prompts/route.ts` y `[id]/route.ts` contienen validación Zod y lógica CRUD |
| **Base de datos — Schema** | ALTA | `prisma/schema.prisma` define modelo `Prompt` con campos simples que deben evolucionar a múltiples |
| **Autenticación y Permisos** | MEDIA | `lib/auth.ts` y ownership checks en API afectan edición/duplicado |

### Capas o dominios técnicos con mayor impacto

1. **Capa de Presentación (Frontend)**: Componentes React, formularios, validación client-side
2. **Capa de API (Backend)**: Endpoints REST, validación Zod, autorización
3. **Capa de Datos**: Schema Prisma, relaciones, migraciones
4. **Capa de Autenticación**: NextAuth, sesiones JWT, roles

### Tipo de intervención anticipada

- **Evolución de modelo de datos**: Campos simples → múltiples (`platform`, `category`)
- **Nuevos campos persistentes**: `prePrompt`, `manualDeUso`, `promptListViewPreference` en `User`
- **Cambios de comportamiento UX**: Navegación post-guardado, vista lista, persistencia de preferencias
- **Evolución de validación**: Zod schemas deben actualizarse de strings a arrays
- **Nuevas entidades/tablas**: `Platform`, `ClientProject`, `UseCase`, `ModelHint` como entidades con junction tables (decisión D-01 resuelta)

---

## 3. Áreas del sistema implicadas

### Frontend

| Sub-área | Implicación | Evidencia |
|----------|-------------|-----------|
| Componentes de Prompt | DIRECTA | `PromptForm.tsx`, `PromptList.tsx`, `PromptFilters.tsx` |
| Rutas de aplicación | DIRECTA | `app/(app)/prompts/`, `new/`, `[id]/` |
| Componentes UI base | INDIRECTA | shadcn/ui: `Select`, `Input`, `Textarea`, `Badge`, `Card` |
| Gestión de estado | DIRECTA | `useState` en `PromptForm`, URL-driven filters en `PromptFilters` |

### Backend

| Sub-área | Implicación | Evidencia |
|----------|-------------|-----------|
| API Routes de Prompts | DIRECTA | `app/api/prompts/route.ts`, `[id]/route.ts` |
| Validación Zod | DIRECTA | `createPromptSchema`, `updatePromptSchema` |
| Autorización | DIRECTA | `checkOwnership()` en `[id]/route.ts` |
| API Routes auxiliares | INDIRECTA | `/api/categories`, `/api/tags`, `/api/export`, `/api/import` |

### Persistencia

| Sub-área | Implicación | Evidencia |
|----------|-------------|-----------|
| Schema Prisma | DIRECTA | Modelo `Prompt`, `Category`, `Tag`, `PromptTag` |
| Migraciones | DIRECTA | Scripts de migración necesarios para nuevos campos/tablas |
| Prisma Client | INDIRECTA | `lib/prisma.ts` - singleton |

### Seguridad

| Sub-área | Implicación | Evidencia |
|----------|-------------|-----------|
| Autenticación | DIRECTA | NextAuth con Credentials, JWT strategy |
| Autorización | DIRECTA | Ownership check + admin role |
| Validación de input | DIRECTA | Zod schemas en API routes |

### Integraciones

| Sub-área | Implicación | Evidencia |
|----------|-------------|-----------|
| Export/Import JSON | INDIRECTA | `/api/export/prompts`, `/api/import/prompts` |
| Base de datos PostgreSQL | DIRECTA | Provider en `schema.prisma` |

---

## 4. Capas, módulos y servicios relacionados

### Capa 1: Presentación (Frontend)

| Módulo | Tipo | Ubicación | Relación con objetivo | Grado |
|--------|------|-----------|----------------------|-------|
| `PromptForm` | Componente | `components/prompt/PromptForm.tsx` | Formulario principal de creación/edición. Contiene secciones Basic Information y Metadata | **DIRECTO** |
| `PromptList` | Componente | `components/prompt/PromptList.tsx` | Listado en cards. Debe añadir vista lista + cambiar "View" por "Edit" | **DIRECTO** |
| `PromptFilters` | Componente | `components/prompt/PromptFilters.tsx` | Filtros URL-driven. Debe soportar multi-selección en Platform y Category | **DIRECTO** |
| `PromptsPage` | Página | `app/(app)/prompts/page.tsx` | Server Component que integra List + Filters. Fetch de datos | **DIRECTO** |
| `NewPromptPage` | Página | `app/(app)/prompts/new/page.tsx` | Wrapper de `PromptForm` en modo creación | **DIRECTO** |
| `EditPromptPage` | Página | `app/(app)/prompts/[id]/page.tsx` | Wrapper de `PromptForm` en modo edición | **DIRECTO** |

### Capa 2: API (Backend)

| Módulo | Tipo | Ubicación | Relación con objetivo | Grado |
|--------|------|-----------|----------------------|-------|
| `POST /api/prompts` | API Route | `app/api/prompts/route.ts` | Creación de prompts. Validación Zod | **DIRECTO** |
| `GET /api/prompts` | API Route | `app/api/prompts/route.ts` | Listado con filtros | **DIRECTO** |
| `PUT /api/prompts/[id]` | API Route | `app/api/prompts/[id]/route.ts` | Actualización. Ownership check | **DIRECTO** |
| `DELETE /api/prompts/[id]` | API Route | `app/api/prompts/[id]/route.ts` | Borrado con autorización | **DIRECTO** |
| `PATCH /api/prompts/[id]/usage` | API Route | `app/api/prompts/[id]/usage/route.ts` | Tracking de uso (copy) | **INDIRECTO** |

### Capa 3: Datos

| Módulo | Tipo | Ubicación | Relación con objetivo | Grado |
|--------|------|-----------|----------------------|-------|
| `Prompt` | Modelo | `prisma/schema.prisma:61-93` | Entidad principal. Campos actuales: `platform` (string simple), `categoryId` (FK simple) | **DIRECTO** |
| `Category` | Modelo | `prisma/schema.prisma:95-109` | Relación 1:N con Prompt. Árbol jerárquico | **DIRECTO** |
| `Tag` | Modelo | `prisma/schema.prisma:111-120` | Relación N:M vía `PromptTag` | **DIRECTO** |
| `PromptTag` | Modelo | `prisma/schema.prisma:122-131` | Junction table para tags | **DIRECTO** |
| `User` | Modelo | `prisma/schema.prisma:11-24` | Ownership, preferencias de vista (nuevo) | **DIRECTO** |

### Capa 4: Autenticación

| Módulo | Tipo | Ubicación | Relación con objetivo | Grado |
|--------|------|-----------|----------------------|-------|
| `auth()` | Función | `lib/auth.ts` | NextAuth instance. Session con user.id y user.role | **DIRECTO** |
| Ownership check | Función | `app/api/prompts/[id]/route.ts:26-41` | Verifica si user es owner o admin | **DIRECTO** |

---

## 5. Componentes, flujos técnicos e integraciones relacionadas

### Componentes Claramente Implicados

| Componente | Función actual | Cambio requerido |
|------------|----------------|------------------|
| `PromptForm` | Formulario CRUD con 3 secciones (Basic Info, Metadata, Advanced) | Añadir campos Pre-Prompt, Manual de uso, Fechas; convertir Platform/Category a multivalor; Client/Project, Use Case, Model Hint multivalor; Language como selector |
| `PromptList` | Grid de cards con botón "View" | Añadir vista lista; cambiar "View" → "Edit" |
| `PromptFilters` | Filtros URL-driven con selects simples | Platform y Category deben permitir multi-selección con lógica acumulativa |

### Flujos Técnicos Identificados

#### Flujo 1: Creación de Prompt
```
/prompts/new → PromptForm (modo create) → POST /api/prompts → 
Prisma create → redirect /prompts
```
**Cambio requerido**: Tras guardar, permanecer en `/prompts/[nuevo-id]` en modo edición

#### Flujo 2: Edición de Prompt
```
/prompts/[id] → PromptForm (modo edit) → PUT /api/prompts/[id] → 
Prisma update → redirect /prompts
```
**Cambio requerido**: Tras guardar, permanecer en `/prompts/[id]`

#### Flujo 3: Duplicado de Prompt
```
PromptForm.handleDuplicate() → POST /api/prompts (con datos duplicados) → 
redirect /prompts
```
**Cambio requerido**: Tras duplicar, redirigir a `/prompts/[nuevo-id]` en modo edición

#### Flujo 4: Listado con filtros
```
/prompts?platform=CHATGPT&categoryId=abc → PromptsPage.getPrompts() → 
Prisma findMany con where → PromptList + PromptFilters
```
**Cambio requerido**: Soportar `platform[]=CHATGPT&platform[]=CURSOR` y lógica acumulativa

### Integraciones Relacionadas

| Integración | Tipo | Impacto |
|-------------|------|---------|
| **Export/Import JSON** | Formato de intercambio | Debe incluir nuevos campos (Pre-Prompt, Manual de uso) y soportar arrays para platform, category, Client/Project, etc. |
| **NextAuth** | Autenticación | Sesión JWT con user.id y user.role. Posible extensión para preferencia de vista |
| **Prisma + PostgreSQL** | ORM + DB | Migraciones necesarias para nuevos campos/tablas |

---

## 6. Archivos o directorios concretos relevantes

### Archivos Críticos (Impacto DIRECTO)

| Archivo | Ruta | Tipo | Líneas | Razón de implicación |
|---------|------|------|--------|---------------------|
| `schema.prisma` | `prisma/schema.prisma` | Schema DB | 131 | Modelo `Prompt` debe evolucionar: `platform` → N, `category` → N, nuevos campos |
| `PromptForm.tsx` | `components/prompt/PromptForm.tsx` | Componente | 533 | Formulario principal. RF-01 a RF-31 |
| `PromptList.tsx` | `components/prompt/PromptList.tsx` | Componente | 181 | Vista lista + cambio "View"→"Edit". RF-37 a RF-43 |
| `PromptFilters.tsx` | `components/prompt/PromptFilters.tsx` | Componente | 217 | Multi-selección en Platform/Category. RF-44 a RF-47 |
| `prompts/page.tsx` | `app/(app)/prompts/page.tsx` | Página | 230 | Fetch de datos, lógica de filtros |
| `route.ts` (GET/POST) | `app/api/prompts/route.ts` | API Route | 163 | Validación Zod, creación |
| `route.ts` (PUT/DELETE) | `app/api/prompts/[id]/route.ts` | API Route | 199 | Actualización, ownership |

### Archivos de Impacto INDIRECTO

| Archivo | Ruta | Tipo | Razón de implicación |
|---------|------|------|---------------------|
| `new/page.tsx` | `app/(app)/prompts/new/page.tsx` | Página | Wrapper de PromptForm (modo create) |
| `[id]/page.tsx` | `app/(app)/prompts/[id]/page.tsx` | Página | Wrapper de PromptForm (modo edit) |
| `usage/route.ts` | `app/api/prompts/[id]/usage/route.ts` | API Route | Tracking de uso (copy) |
| `export/prompts/route.ts` | `app/api/export/prompts/route.ts` | API Route | Exportación debe incluir nuevos datos |
| `import/prompts/route.ts` | `app/api/import/prompts/route.ts` | API Route | Importación debe soportar nuevos formatos |
| `auth.ts` | `lib/auth.ts` | Utilidad | Sesión con preferencia de vista (posible extensión) |

### Directorios Relevantes

| Directorio | Ruta | Contenido |
|------------|------|-----------|
| Componentes de Prompt | `components/prompt/` | `PromptForm.tsx`, `PromptList.tsx`, `PromptFilters.tsx` |
| Rutas de Prompts | `app/(app)/prompts/` | `page.tsx`, `new/page.tsx`, `[id]/page.tsx` |
| API de Prompts | `app/api/prompts/` | `route.ts`, `[id]/route.ts`, `[id]/usage/route.ts` |
| Schema | `prisma/` | `schema.prisma`, `seed.ts` |

---

## 7. Elementos que deben revisarse aunque el impacto no sea concluyente

### A Revisar por Dependencia

| Elemento | Razón de duda | Qué debe confirmarse |
|----------|---------------|---------------------|
| `middleware.ts` | No inspeccionado | Protección de rutas, redirecciones post-login |
| `components/layout/Topbar.tsx` | No inspeccionado | Botón "New Prompt" en Topbar; posible impacto en navegación |
| `components/layout/Sidebar.tsx` | No inspeccionado | Navegación lateral; posible impacto mínimo |
| `app/api/tags/route.ts` | No inspeccionado | API de creación de tags (RF-02, RF-05) |
| `app/api/categories/route.ts` | No inspeccionado | API de categorías; posible impacto en selección múltiple |

### Pendientes de Confirmación

| Elemento | Duda | Impacto potencial |
|----------|------|-------------------|
| Nuevas entidades para campos multivalor | **RESUELTO (D-01)**: Tablas nuevas + relaciones N:M para todos los campos | Platform, ClientProject, UseCase, ModelHint como entidades con junction tables |
| Preferencia de vista del usuario | ¿Dónde persistir? | ¿Tabla `User`? ¿Tabla nueva `UserPreference`? |
| Fechas de creación/actualización | ¿Campos nuevos o usar `createdAt`/`updatedAt`? | Modelo ya tiene `createdAt` y `updatedAt` (líneas 81-82) |

---

## 8. Evidencia encontrada en el repo

### Evidencia de Estructura Actual

#### Schema Prisma (líneas 61-93)
```prisma
model Prompt {
  id              String      @id @default(cuid())
  title           String
  description     String?
  body            String
  type            String      @default("USER")
  platform        String      @default("CURSOR")      // ⚠️ CAMPO SIMPLE
  modelHint       String?
  language        String      @default("en")
  useCase         String
  clientOrProject String?
  status          String      @default("DRAFT")
  isFavorite      Boolean     @default(false)
  version         Int         @default(1)
  changelog       String?
  notes           String?
  usageCount      Int         @default(0)
  lastUsedAt      DateTime?
  categoryId      String?                       // ⚠️ FK SIMPLE
  userId          String?
  createdAt       DateTime    @default(now())   // ✅ EXISTE
  updatedAt       DateTime    @updatedAt        // ✅ EXISTE
  category        Category?   @relation(fields: [categoryId], references: [id])
  user            User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
  tags            PromptTag[] // ✅ RELACIÓN MÚLTIPLE
}
```

#### PromptForm.tsx - Estado inicial (líneas 62-96)
```typescript
const [formData, setFormData] = useState<{
  title: string
  description: string
  body: string
  type: string
  platform: string        // ⚠️ STRING SIMPLE
  modelHint: string
  language: string
  useCase: string
  clientOrProject: string
  status: string
  isFavorite: boolean
  version: number
  changelog: string
  notes: string
  categoryId: string | null  // ⚠️ STRING SIMPLE
  tagIds: string[]        // ✅ ARRAY
}>({ ... })
```

#### PromptForm.tsx - Navegación post-guardado (líneas 125-127)
```typescript
if (response.ok) {
  router.push("/prompts")  // ⚠️ REDIRIGE AL LISTADO
  router.refresh()
}
```

#### PromptList.tsx - Botón "View" (línea 171)
```typescript
<View
  ExternalLink className="mr-2 h-4 w-4" />
  View  {/* ⚠️ DEBE CAMBIAR A "Edit" */}
</Button>
```

#### PromptFilters.tsx - Filtro Platform (líneas 113-133)
```typescript
<Select
  value={initialFilters.platform || undefined}
  onValueChange={(value) => updateFilter("platform", value || null)}
>
  {/* ⚠️ SELECT SIMPLE, NO PERMITE MÚLTIPLE */}
</Select>
```

#### API Route - Validación Zod (líneas 6-23)
```typescript
const createPromptSchema = z.object({
  title: z.string().min(1),
  platform: z.enum(["CHATGPT", "CURSOR", "MIDJOURNEY", "SUNO", "OTHER"]), // ⚠️ ENUM SIMPLE
  categoryId: z.string().optional(),  // ⚠️ STRING SIMPLE
  tagIds: z.array(z.string()).optional(), // ✅ ARRAY
  // ...
})
```

### Hallazgos Relevantes

| Hallazgo | Evidencia | Implicación |
|----------|-----------|-------------|
| `platform` es campo simple | `schema.prisma:67`, `PromptForm.tsx:67` | **Decisión D-01**: Evolucionar a tabla `Platform` + relación N:M vía `PromptPlatform` |
| `category` es FK simple | `schema.prisma:79`, `PromptForm.tsx:77` | **Decisión D-01**: Evolucionar a relación N:M vía `PromptCategory` |
| `tags` ya es múltiple | `schema.prisma:85`, `PromptTag` junction table | Patrón a replicar para otros campos |
| `createdAt`/`updatedAt` ya existen | `schema.prisma:81-82` | RF-29 y RF-30 pueden usar campos existentes |
| Navegación expulsa del formulario | `PromptForm.tsx:126` | Debe cambiarse para RF-32 a RF-36 |
| Botón se llama "View" | `PromptList.tsx:171` | Debe cambiarse a "Edit" (RF-38) |
| Filtros son URL-driven | `PromptFilters.tsx:38-59` | Ventaja: persistencia natural. Reto: multi-selección |
| Ownership check en API | `[id]/route.ts:26-41` | Afecta edición y duplicado |

---

## 9. Observaciones clave para los siguientes bloques

### Para Bloque 02 (Cambios Técnicos Necesarios)

| Observación | Condicionante |
|-------------|---------------|
| Schema actual tiene `platform` como string simple | **Decisión D-01**: Requiere migración a tabla `Platform` + relación N:M |
| Schema actual tiene `categoryId` como FK simple | **Decisión D-01**: Requiere migración a relación N:M con `PromptCategory` |
| `createdAt`/`updatedAt` ya existen en modelo | RF-29 y RF-30 pueden mapear a campos existentes, pero deben hacerse visibles en UI |
| `PromptForm` usa `useState` manual para 15 campos | Complejidad de gestión de estado para campos multivalor |
| API usa Zod schemas separados para create/update | Ambos deben actualizarse de forma coherente |

### Para Bloque 03 (Objetivo vs Realidad)

| Discrepancia anticipada | Evidencia |
|-------------------------|-----------|
| Briefing pide `platform` multivalor | Schema: `platform String @default("CURSOR")` |
| Briefing pide `category` múltiple | Schema: `categoryId String?` (FK simple) |
| Briefing pide crear tags desde formulario | UI actual solo permite seleccionar existentes |
| Briefing pide permanecer en edición tras guardar | Código actual: `router.push("/prompts")` |
| Briefing pide vista lista | UI actual solo tiene cards |

### Para Bloque 04 (Dependencias y Condicionantes)

| Dependencia | Impacto |
|-------------|---------|
| Relación N:M con `Category` | Requiere junction table o cambio estructural |
| Preferencia de vista por usuario | Requiere nuevo campo en `User` o tabla nueva |
| Export/Import | Debe soportar nuevos formatos multivalor |
| Ownership check | Afecta duplicado: ¿quién es owner del duplicado? |

### Para Bloque 05 (Validación Técnica)

| Mecanismo existente | Aprovechamiento |
|---------------------|-----------------|
| Zod schemas en API | Extender para validar arrays y nuevos campos |
| Tests existentes (`tests/api/prompts.test.ts`) | Actualizar tests para nuevos comportamientos |
| Prisma Client | Usar para validación de relaciones |

### Para Bloque 06 (Seguridad Integrada)

| Punto de atención | Riesgo |
|-------------------|--------|
| Ownership en duplicado | ¿El duplicado pertenece al usuario que duplica o mantiene owner original? |
| Creación de nuevos valores (tags, platforms, etc.) | ¿Quién puede crear? ¿Validación de duplicados? |
| Preferencia de vista | ¿Expone información sensible? |

### Para Bloque 07 (Riesgos y Decisiones Abiertas)

| Decisión | Estado | Impacto técnico |
|----------|--------|-----------------|
| ¿Tablas nuevas para Platform, Client/Project, etc. o campos JSON? | **RESUELTA (D-01)**: Tablas nuevas + relaciones N:M | Crear 5 entidades nuevas con junction tables; migración compleja pero normalización completa |
| ¿Dónde persistir preferencia de vista? | Pendiente: campo en `User` recomendado | `User` table vs tabla nueva |
| ¿Fechas visibles usan `createdAt`/`updatedAt` o campos nuevos? | Sin decisión: usar campos existentes | Duplicación de datos o reutilización |

---

## 10. Bloqueos o límites del análisis

### Lo que NO pudo determinarse

| Elemento | Razón | Cómo condiciona el mapa |
|----------|-------|------------------------|
| Implementación exacta de `middleware.ts` | No inspeccionado | No se conoce protección de rutas ni redirecciones post-login |
| Formato actual de exportación | `export/prompts/route.ts` inspeccionado pero formato exacto debe confirmarse | Puede definirse cambio de formato |
| Estado actual de tests | **RESUELTO**: `npm test` ejecutado. 30 tests, 8 suites, TODOS PASAN | Infraestructura de testing funcional |

### Evidencia que falta

| Evidencia faltante | Estado |
|--------------------|--------|
| Contenido de `middleware.ts` | **PENDIENTE**: Confirmar protección de rutas |
| APIs de creación de tags/categories | **RESUELTO**: `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts`, `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` inspeccionados. POST tiene auth; PUT/DELETE requieren admin; NO hay unicidad ni sanitización |

### Cómo se mitigará en bloques posteriores

- **Bloque 02**: Debe leer archivos no inspeccionados antes de definir cambios técnicos
- **Bloque 03**: Debe contrastar Briefing/Spec contra código real de archivos pendientes
- **Bloque 05**: **RESUELTO**: Tests existentes identificados y ejecutados (30 tests, 8 suites, TODOS PASAN)

---

## 11. Clasificación de Elementos por Grado de Implicación

### Claramente Implicados (Evidencia Directa)

| Elemento | Tipo | Ubicación | RF Impactados |
|----------|------|-----------|---------------|
| `PromptForm` | Componente | `components/prompt/PromptForm.tsx` | RF-01 a RF-31 (Metadata, Basic Info) |
| `PromptList` | Componente | `components/prompt/PromptList.tsx` | RF-37 a RF-43 (Vista lista, Edit) |
| `PromptFilters` | Componente | `components/prompt/PromptFilters.tsx` | RF-44 a RF-47 (Filtros multivalor) |
| `schema.prisma` | Schema | `prisma/schema.prisma` | Todos los RF (modelo de datos) |
| `POST /api/prompts` | API Route | `app/api/prompts/route.ts` | RF-01 a RF-50 (creación) |
| `PUT /api/prompts/[id]` | API Route | `app/api/prompts/[id]/route.ts` | RF-01 a RF-50 (actualización) |

### Relacionados con Alta Probabilidad

| Elemento | Tipo | Ubicación | Razón |
|----------|------|-----------|-------|
| `new/page.tsx` | Página | `app/(app)/prompts/new/page.tsx` | Wrapper de `PromptForm` (modo create) |
| `[id]/page.tsx` | Página | `app/(app)/prompts/[id]/page.tsx` | Wrapper de `PromptForm` (modo edit) |
| `usage/route.ts` | API Route | `app/api/prompts/[id]/usage/route.ts` | Tracking de uso (copy) |

### A Revisar por Dependencia

| Elemento | Tipo | Ubicación | Razón |
|----------|------|-----------|-------|
| `export/prompts/route.ts` | API Route | `app/api/export/prompts/route.ts` | Debe soportar nuevos campos |
| `import/prompts/route.ts` | API Route | `app/api/import/prompts/route.ts` | Debe soportar nuevos formatos |
| `auth.ts` | Utilidad | `lib/auth.ts` | Posible extensión para preferencia de vista |
| `User` model | Modelo | `prisma/schema.prisma:11-24` | Posible campo para preferencia de vista |
| `middleware.ts` | Middleware | `middleware.ts` | Protección de rutas |

---

## 12. Nivel de Certeza y Limitaciones

### Matriz de Certeza por Área

| Área | Nivel de certeza | Justificación |
|------|------------------|---------------|
| **Componentes de Prompt** | ALTO (90%) | Archivos inspeccionados completamente |
| **API Routes principales** | ALTO (90%) | `route.ts` inspeccionadas completamente |
| **Schema Prisma** | ALTO (100%) | Archivo completo inspeccionado |
| **Rutas de página** | ALTO (100%) | `page.tsx`, `new/page.tsx`, `[id]/page.tsx` inspeccionados |
| **Export/Import** | ALTO (90%) | Archivos inspeccionados completamente |
| **Autenticación** | ALTO (95%) | `lib/auth.ts` inspeccionado completamente |
| **Tests existentes** | ALTO (100%) | **RESUELTO**: 30 tests, 8 suites, TODOS PASAN |

### Limitaciones del Análisis

1. **Middleware no inspeccionado**: `middleware.ts` no leído; protección de rutas no confirmada
2. **Tests analizados y ejecutados**: **RESUELTO**: 30 tests, 8 suites, TODOS PASAN
3. **APIs auxiliares inspeccionadas**: **RESUELTO**: `app/api/tags/route.ts`, `app/api/tags/[id]/route.ts`, `app/api/categories/route.ts`, `app/api/categories/[id]/route.ts` inspeccionados
4. **Configuración no revisada**: `next.config.js`, variables de entorno, `.env`

---

**Fin del documento**
