# 📊 Análisis Técnico: Valores Hardcodeados y Viabilidad de Cambios

**Proyecto:** Prompt Database  
**Fecha:** 17 de abril de 2026  
**Versión:** 1.0

---

## 📑 Índice de Contenido

1. [Ubicación de Valores Hardcodeados](#1-ubicación-de-valores-hardcodeados)
2. [Análisis del Formulario /prompts/new](#2-análisis-del-formulario-promptsnew)
3. [Otros Valores Hardcodeados Identificados](#3-otros-valores-hardcodeados-identificados)
4. [Viabilidad: Sistema de Dominio y Valor CRUD](#4-viabilidad-sistema-de-dominio-y-valor-crud)
5. [Viabilidad: Sistema de Multidioma](#5-viabilidad-sistema-de-multidioma)
6. [Conclusiones y Recomendaciones](#6-conclusiones-y-recomendaciones)

---

## 1. Ubicación de Valores Hardcodeados

### 1.1 Campos Select: Type, Platform y Status

Los valores de los campos select están definidos directamente en código en múltiples ubicaciones:

#### **Type** (3 valores: SYSTEM, USER, TOOL)

| Ubicación | Archivo | Líneas | Tipo de Definición |
|-----------|---------|--------|-------------------|
| Validación API | [`app/api/prompts/route.ts:9`](app/api/prompts/route.ts:9) | `z.enum(["SYSTEM", "USER", "TOOL"])` | Zod schema |
| Validación API | [`app/api/prompts/[id]/route.ts:9`](app/api/prompts/[id]/route.ts:9) | `z.enum(["SYSTEM", "USER", "TOOL"]).optional()` | Zod schema |
| Componente Formulario | [`components/prompt/PromptForm.tsx:318-320`](components/prompt/PromptForm.tsx:318-320) | SelectItem JSX | UI Component |
| Valor por defecto | [`components/prompt/PromptForm.tsx:81`](components/prompt/PromptForm.tsx:81) | `type: prompt?.type \|\| "USER"` | Default value |

#### **Platform** (5 valores: CHATGPT, CURSOR, MIDJOURNEY, SUNO, OTHER)

| Ubicación | Archivo | Líneas | Tipo de Definición |
|-----------|---------|--------|-------------------|
| Validación API | [`app/api/prompts/route.ts:10`](app/api/prompts/route.ts:10) | `z.enum(["CHATGPT", "CURSOR", "MIDJOURNEY", "SUNO", "OTHER"])` | Zod schema |
| Validación API | [`app/api/prompts/[id]/route.ts:10`](app/api/prompts/[id]/route.ts:10) | `z.enum(["CHATGPT", "CURSOR", "MIDJOURNEY", "SUNO", "OTHER"]).optional()` | Zod schema |
| Componente Formulario | [`components/prompt/PromptForm.tsx:337-341`](components/prompt/PromptForm.tsx:337-341) | SelectItem JSX | UI Component |
| Componente Filtros | [`components/prompt/PromptFilters.tsx:126-130`](components/prompt/PromptFilters.tsx:126-130) | SelectItem JSX | UI Component |
| Colores UI | [`components/prompt/PromptList.tsx:57-63`](components/prompt/PromptList.tsx:57-63) | `colors: Record<string, string>` | Color mapping |
| Valor por defecto | [`components/prompt/PromptForm.tsx:82`](components/prompt/PromptForm.tsx:82) | `platform: prompt?.platform \|\| "CURSOR"` | Default value |

#### **Status** (3 valores: DRAFT, TESTED, PRODUCTION)

| Ubicación | Archivo | Líneas | Tipo de Definición |
|-----------|---------|--------|-------------------|
| Validación API | [`app/api/prompts/route.ts:15`](app/api/prompts/route.ts:15) | `z.enum(["DRAFT", "TESTED", "PRODUCTION"]).default("DRAFT")` | Zod schema |
| Validación API | [`app/api/prompts/[id]/route.ts:15`](app/api/prompts/[id]/route.ts:15) | `z.enum(["DRAFT", "TESTED", "PRODUCTION"]).optional()` | Zod schema |
| Validación Import | [`app/api/import/prompts/route.ts:102`](app/api/import/prompts/route.ts:102) | `status: promptData.status \|\| "DRAFT"` | Default value |
| Componente Formulario | [`components/prompt/PromptForm.tsx:405-407`](components/prompt/PromptForm.tsx:405-407) | SelectItem JSX | UI Component |
| Componente Filtros | [`components/prompt/PromptFilters.tsx:149-151`](components/prompt/PromptFilters.tsx:149-151) | SelectItem JSX | UI Component |
| Colores UI | [`components/prompt/PromptList.tsx:68-72`](components/prompt/PromptList.tsx:68-72) | `colors: Record<string, string>` | Color mapping |
| Valor por defecto | [`components/prompt/PromptForm.tsx:87`](components/prompt/PromptForm.tsx:87) | `status: prompt?.status \|\| "DRAFT"` | Default value |

### 1.2 Cómo Actualizar los Valores Actualmente

Para actualizar los valores de Type, Platform o Status actualmente se debe:

1. **Modificar en 4-6 ubicaciones diferentes:**
   - Schema de validación Zod en API routes (2 archivos)
   - Componentes UI de formulario (1 archivo)
   - Componentes de filtros (1 archivo)
   - Mapeo de colores (1 archivo)
   - Valores por defecto (1 archivo)

2. **Proceso manual:**
   - Editar cada archivo individualmente
   - Asegurar consistencia entre todas las ubicaciones
   - No hay validación automatizada de consistencia

3. **Riesgos:**
   - Inconsistencias si se olvida actualizar alguna ubicación
   - Errores de validación si los valores no coinciden
   - Dificultad para mantener versiones diferentes

---

## 2. Análisis del Formulario /prompts/new

### 2.1 Definición del Formulario

El formulario disponible en [`/prompts/new`](app/prompts/new/page.tsx:1) se define en el componente [`PromptForm`](components/prompt/PromptForm.tsx:57).

**Ubicación del componente:** [`components/prompt/PromptForm.tsx`](components/prompt/PromptForm.tsx:1)

**Página que lo renderiza:** [`app/prompts/new/page.tsx`](app/prompts/new/page.tsx:1)

### 2.2 Estructura del Formulario

El formulario se compone de las siguientes secciones:

| Sección | Campo | Tipo | Ubicación en Código |
|---------|-------|------|-------------------|
| **Información Básica** | Title | Input | Líneas 220-229 |
| | Description | Textarea | Líneas 231-240 |
| | Body | Textarea | Líneas 242-251 |
| **Metadatos** | Type | Select (hardcodeado) | Líneas 307-322 |
| | Platform | Select (hardcodeado) | Líneas 325-343 |
| | Model Hint | Input | Líneas 347-356 |
| | Language | Input | Líneas 359-368 |
| | Use Case | Input | Líneas 371-380 |
| | Client/Project | Input | Líneas 383-391 |
| | Status | Select (hardcodeado) | Líneas 394-410 |
| **Organización** | Category | Select (dinámico) | Líneas 413-432 |
| | Tags | Multi-select (dinámico) | Líneas 434-460 |
| **Versionado** | Version | Input (readonly) | Líneas 462-471 |
| | Changelog | Textarea | Líneas 473-482 |
| | Notes | Textarea | Líneas 484-493 |

### 2.3 Componentes Utilizados

El formulario utiliza componentes de la librería `shadcn/ui`:

| Componente | Ubicación | Uso |
|-----------|-----------|-----|
| `Button` | [`components/ui/button.tsx`](components/ui/button.tsx:1) | Acciones del formulario |
| `Input` | [`components/ui/input.tsx`](components/ui/input.tsx:1) | Campos de texto |
| `Label` | [`components/ui/label.tsx`](components/ui/label.tsx:1) | Etiquetas de campos |
| `Textarea` | [`components/ui/textarea.tsx`](components/ui/textarea.tsx:1) | Áreas de texto |
| `Select` | [`components/ui/select.tsx`](components/ui/select.tsx:1) | Selectores desplegables |
| `Card` | [`components/ui/card.tsx`](components/ui/card.tsx:1) | Contenedores de secciones |
| `Badge` | [`components/ui/badge.tsx`](components/ui/badge.tsx:1) | Etiquetas de tags |

### 2.4 Flujo de Datos

```
app/prompts/new/page.tsx
    ↓ (Server Component)
    - getCategories() → Prisma query
    - getTags() → Prisma query
    ↓
    PromptForm (Client Component)
    ↓ (formData state)
    - type, platform, status (hardcodeados)
    - categories, tags (dinámicos de API)
    ↓ (handleSubmit)
    POST/PUT /api/prompts
    ↓ (Zod validation)
    Prisma create/update
```

### 2.5 Dificultad de Cambios en el Formulario

**Nivel de dificultad:** MEDIA

**Partes a tocar para cambios:**

| Tipo de Cambio | Archivos Afectados | Complejidad | Impacto |
|----------------|-------------------|-------------|---------|
| **Agregar campo simple** | PromptForm.tsx, API routes | Baja | Local |
| **Modificar select hardcodeado** | PromptForm.tsx, PromptFilters.tsx, API routes, PromptList.tsx | Media | Múltiple |
| **Cambiar estructura de datos** | Schema.prisma, migraciones, todos los componentes | Alta | Global |
| **Modificar validaciones** | API routes, formularios | Media | Múltiple |

**Impacto en el resto del proyecto:**

- **Cambios locales** (agregar campos simples): Solo afectan al formulario y API correspondiente
- **Cambios en selectores hardcodeados**: Afectan a filtros, listas y validaciones en múltiples archivos
- **Cambios en schema**: Requieren migraciones de base de datos y afectan a toda la aplicación

---

## 3. Otros Valores Hardcodeados Identificados

### 3.1 Textos de UI en Inglés

| Texto | Ubicación | Contexto |
|-------|-----------|----------|
| "System", "User", "Tool" | [`PromptForm.tsx:318-320`](components/prompt/PromptForm.tsx:318-320) | Labels de Type |
| "ChatGPT", "Cursor", "Midjourney", "Suno", "Other" | [`PromptForm.tsx:337-341`](components/prompt/PromptForm.tsx:337-341) | Labels de Platform |
| "Draft", "Tested", "Production" | [`PromptForm.tsx:405-407`](components/prompt/PromptForm.tsx:405-407) | Labels de Status |
| "Select category", "None" | [`PromptForm.tsx:421,424`](components/prompt/PromptForm.tsx:421-424) | Labels de Category |
| "Filters", "All categories", "All platforms", "All statuses" | [`PromptFilters.tsx:75,100,123,146`](components/prompt/PromptFilters.tsx:75-146) | Labels de filtros |
| "Prompts", "Categories", "Tags" | [`Sidebar.tsx:9-11`](components/layout/Sidebar.tsx:9-11) | Navegación |
| "Prompt DB" | [`Sidebar.tsx:24`](components/layout/Sidebar.tsx:24) | Branding |
| "Search prompts..." | [`Topbar.tsx:90`](components/layout/Topbar.tsx:90) | Placeholder de búsqueda |
| "Create your first prompt", "No prompts found" | [`PromptList.tsx:48,50`](components/prompt/PromptList.tsx:48-50) | Mensajes de estado |
| "Are you sure you want to delete..." | Múltiples archivos | Confirmaciones |
| "Failed to save/delete/export/import..." | Múltiples archivos | Mensajes de error |
| "Copied to clipboard!" | [`PromptForm.tsx:183`](components/prompt/PromptForm.tsx:183) | Feedback |

### 3.2 Rutas y URLs

| Valor | Ubicación | Contexto |
|-------|-----------|----------|
| `/prompts`, `/categories`, `/tags` | [`Sidebar.tsx:9-11`](components/layout/Sidebar.tsx:9-11) | Navegación |
| `/prompts/new` | [`Topbar.tsx:99`](components/layout/Topbar.tsx:99) | Crear prompt |
| `/prompt-database` | Múltiples archivos | Base path (configurable) |

### 3.3 Colores y Estilos

| Valor | Ubicación | Contexto |
|-------|-----------|----------|
| Colores de platform badges | [`PromptList.tsx:57-63`](components/prompt/PromptList.tsx:57-63) | Mapeo de colores |
| Colores de status badges | [`PromptList.tsx:68-72`](components/prompt/PromptList.tsx:68-72) | Mapeo de colores |
| Clases Tailwind hardcodeadas | Múltiples archivos | Estilos inline |

### 3.4 Valores por Defecto

| Campo | Valor | Ubicación |
|-------|-------|-----------|
| type | "USER" | [`PromptForm.tsx:81`](components/prompt/PromptForm.tsx:81) |
| platform | "CURSOR" | [`PromptForm.tsx:82`](components/prompt/PromptForm.tsx:82) |
| language | "en" | [`PromptForm.tsx:84`](components/prompt/PromptForm.tsx:84), [`app/api/prompts/route.ts:12`](app/api/prompts/route.ts:12) |
| status | "DRAFT" | [`PromptForm.tsx:87`](components/prompt/PromptForm.tsx:87), [`app/api/prompts/route.ts:15`](app/api/prompts/route.ts:15) |
| version | 1 | [`PromptForm.tsx:89`](components/prompt/PromptForm.tsx:89) |
| sortOrder | 0 | [`app/categories/page.tsx:53`](app/categories/page.tsx:53) |

### 3.5 Mensajes de Error y Confirmación

| Mensaje | Ubicación | Tipo |
|---------|-----------|------|
| "Are you sure you want to delete this prompt?" | [`PromptForm.tsx:192`](components/prompt/PromptForm.tsx:192) | Confirmación |
| "Are you sure you want to delete this category?" | [`app/categories/page.tsx:127`](app/categories/page.tsx:127) | Confirmación |
| "Are you sure you want to delete this tag?" | [`app/tags/page.tsx:93`](app/tags/page.tsx:93) | Confirmación |
| "Failed to save prompt" | [`PromptForm.tsx:132`](components/prompt/PromptForm.tsx:132) | Error |
| "Failed to export prompts" | [`Topbar.tsx:48`](components/layout/Topbar.tsx:48) | Error |
| "Failed to import prompts" | [`Topbar.tsx:79`](components/layout/Topbar.tsx:79) | Error |

---

## 4. Viabilidad: Sistema de Dominio y Valor CRUD

### 4.1 Análisis del Enfoque Actual

**Estado actual:** Valores hardcodeados en código con validación Zod

**Problemas identificados:**
1. Duplicación de código en múltiples archivos
2. Dificultad para mantener consistencia
3. Cambios requieren modificaciones en 4-6 ubicaciones
4. No hay gestión dinámica de valores
5. No hay historial de cambios en dominios

### 4.2 Propuesta: Sistema de Dominio y Valor

#### 4.2.1 Esquema de Base de Datos Propuesto

```sql
-- Tabla Domain (Dominios)
CREATE TABLE "Domain" (
    "id" VARCHAR(25) PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Tabla DomainValue (Valores de Dominio)
CREATE TABLE "DomainValue" (
    "id" VARCHAR(25) PRIMARY KEY,
    "domainId" VARCHAR(25) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(50),
    "icon" VARCHAR(50),
    "isActive" BOOLEAN DEFAULT true,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("domainId", "value")
);

-- Foreign Keys
ALTER TABLE "DomainValue" ADD CONSTRAINT "fk_domainvalue_domain"
    FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE;

-- Índices
CREATE INDEX "idx_domainvalue_domainId" ON "DomainValue"("domainId");
CREATE INDEX "idx_domainvalue_isActive" ON "DomainValue"("isActive");
```

#### 4.2.2 Datos Iniciales Propuestos

```sql
-- Dominio: Type
INSERT INTO "Domain" (id, name, slug, description) VALUES
('domain-type', 'Type', 'type', 'Tipo de prompt');

INSERT INTO "DomainValue" (id, domainId, value, label, sortOrder) VALUES
('val-system', 'domain-type', 'SYSTEM', 'System', 1),
('val-user', 'domain-type', 'USER', 'User', 2),
('val-tool', 'domain-type', 'TOOL', 'Tool', 3);

-- Dominio: Platform
INSERT INTO "Domain" (id, name, slug, description) VALUES
('domain-platform', 'Platform', 'platform', 'Plataforma de IA');

INSERT INTO "DomainValue" (id, domainId, value, label, color, sortOrder) VALUES
('val-chatgpt', 'domain-platform', 'CHATGPT', 'ChatGPT', 'green', 1),
('val-cursor', 'domain-platform', 'CURSOR', 'Cursor', 'purple', 2),
('val-midjourney', 'domain-platform', 'MIDJOURNEY', 'Midjourney', 'pink', 3),
('val-suno', 'domain-platform', 'SUNO', 'Suno', 'orange', 4),
('val-other', 'domain-platform', 'OTHER', 'Other', 'gray', 5);

-- Dominio: Status
INSERT INTO "Domain" (id, name, slug, description) VALUES
('domain-status', 'Status', 'status', 'Estado del prompt');

INSERT INTO "DomainValue" (id, domainId, value, label, color, sortOrder) VALUES
('val-draft', 'domain-status', 'DRAFT', 'Draft', 'amber', 1),
('val-tested', 'domain-status', 'TESTED', 'Tested', 'blue', 2),
('val-production', 'domain-status', 'PRODUCTION', 'Production', 'emerald', 3);
```

#### 4.2.3 Cambios Requeridos en Código

**Archivos a modificar:**

1. **Schema Prisma** (`prisma/schema.prisma`)
   - Agregar modelos `Domain` y `DomainValue`
   - Crear migración

2. **API Routes** (Nuevos archivos)
   - `app/api/domains/route.ts` - CRUD de dominios
   - `app/api/domains/[id]/route.ts` - CRUD individual
   - `app/api/domain-values/route.ts` - CRUD de valores
   - `app/api/domain-values/[id]/route.ts` - CRUD individual

3. **API Routes Existentes** (Modificar)
   - `app/api/prompts/route.ts` - Validación dinámica
   - `app/api/prompts/[id]/route.ts` - Validación dinámica

4. **Componentes UI** (Modificar)
   - `components/prompt/PromptForm.tsx` - Selectores dinámicos
   - `components/prompt/PromptFilters.tsx` - Selectores dinámicos
   - `components/prompt/PromptList.tsx` - Colores dinámicos

5. **Nuevos Componentes** (Crear)
   - `app/domains/page.tsx` - Gestión de dominios
   - `components/domain/DomainForm.tsx` - Formulario de dominio
   - `components/domain/DomainValueForm.tsx` - Formulario de valores

#### 4.2.4 Estrategia de Migración

**Fase 1: Preparación**
1. Crear tablas `Domain` y `DomainValue`
2. Insertar datos iniciales
3. Crear API routes para dominios

**Fase 2: Transición**
1. Modificar componentes para usar datos de API
2. Mantener validación hardcodeada como fallback
3. Testing exhaustivo

**Fase 3: Finalización**
1. Eliminar validaciones hardcodeadas
2. Actualizar documentación
3. Deploy

### 4.3 Viabilidad y Complejidad

| Aspecto | Valoración | Detalles |
|---------|------------|----------|
| **Viabilidad técnica** | ✅ ALTA | Arquitectura soporta el cambio |
| **Complejidad** | MEDIA-ALTA | Requiere cambios en múltiples capas |
| **Tiempo estimado** | 2-3 semanas | Desarrollo + testing + migración |
| **Riesgo** | MEDIO | Cambios en schema y validaciones |
| **Impacto en código existente** | ALTO | Modifica componentes core |
| **Beneficios** | ALTO | Flexibilidad, mantenibilidad, escalabilidad |

### 4.4 Dependencias y Consideraciones

**Dependencias:**
- Migración de base de datos requerida
- Cambios en schema Prisma
- Actualización de tests existentes
- Documentación actualizada

**Consideraciones:**
- Necesario mantener backward compatibility durante transición
- Validación de datos existentes en base de datos
- Performance: Caching de dominios en memoria
- Seguridad: Control de acceso a gestión de dominios

---

## 5. Viabilidad: Sistema de Multidioma

### 5.1 Análisis del Estado Actual

**Estado actual:** Textos hardcodeados en inglés

**Problemas identificados:**
1. Textos en inglés distribuidos en múltiples archivos
2. No hay sistema de internacionalización
3. Cambios de idioma requieren modificaciones manuales
4. No hay soporte para RTL (Right-to-Left)
5. No hay gestión de pluralización, formateo de fechas, etc.

### 5.2 Propuesta: Sistema de Multidioma

#### 5.2.1 Tecnología Recomendada

**next-intl** - Librería de internacionalización para Next.js 14

**Ventajas:**
- Soporte nativo para App Router
- Integración con TypeScript
- Server Components y Client Components
- Soporte para pluralización, formateo de fechas/números
- Compatible con Next.js 14

#### 5.2.2 Estructura de Archivos Propuesta

```
messages/
├── en.json          # Inglés (idioma actual)
└── es.json          # Español (nuevo)

i18n/
├── config.ts        # Configuración de next-intl
├── request.ts       # Middleware para detección de idioma
└── routing.ts       # Configuración de rutas
```

#### 5.2.3 Ejemplo de Archivo de Traducciones

```json
// messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search",
    "loading": "Loading..."
  },
  "navigation": {
    "prompts": "Prompts",
    "categories": "Categories",
    "tags": "Tags",
    "brand": "Prompt DB"
  },
  "prompts": {
    "type": {
      "label": "Type",
      "system": "System",
      "user": "User",
      "tool": "Tool"
    },
    "platform": {
      "label": "Platform",
      "chatgpt": "ChatGPT",
      "cursor": "Cursor",
      "midjourney": "Midjourney",
      "suno": "Suno",
      "other": "Other"
    },
    "status": {
      "label": "Status",
      "draft": "Draft",
      "tested": "Tested",
      "production": "Production"
    },
    "form": {
      "title": "Title",
      "description": "Description",
      "body": "Body",
      "modelHint": "Model Hint",
      "language": "Language",
      "useCase": "Use Case",
      "clientOrProject": "Client/Project",
      "version": "Version",
      "changelog": "Changelog",
      "notes": "Notes",
      "selectCategory": "Select category",
      "none": "None"
    },
    "messages": {
      "noPromptsFound": "No prompts found.",
      "createFirstPrompt": "Create your first prompt",
      "copiedToClipboard": "Copied to clipboard!",
      "confirmDelete": "Are you sure you want to delete this prompt?",
      "failedToSave": "Failed to save prompt",
      "failedToDelete": "Failed to delete prompt",
      "failedToCopy": "Failed to copy to clipboard"
    }
  },
  "filters": {
    "title": "Filters",
    "category": "Category",
    "platform": "Platform",
    "status": "Status",
    "allCategories": "All categories",
    "allPlatforms": "All platforms",
    "allStatuses": "All statuses",
    "searchPlaceholder": "Search prompts..."
  }
}
```

```json
// messages/es.json
{
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "create": "Crear",
    "search": "Buscar",
    "loading": "Cargando..."
  },
  "navigation": {
    "prompts": "Prompts",
    "categories": "Categorías",
    "tags": "Etiquetas",
    "brand": "Prompt DB"
  },
  "prompts": {
    "type": {
      "label": "Tipo",
      "system": "Sistema",
      "user": "Usuario",
      "tool": "Herramienta"
    },
    "platform": {
      "label": "Plataforma",
      "chatgpt": "ChatGPT",
      "cursor": "Cursor",
      "midjourney": "Midjourney",
      "suno": "Suno",
      "other": "Otro"
    },
    "status": {
      "label": "Estado",
      "draft": "Borrador",
      "tested": "Probado",
      "production": "Producción"
    },
    "form": {
      "title": "Título",
      "description": "Descripción",
      "body": "Cuerpo",
      "modelHint": "Sugerencia de modelo",
      "language": "Idioma",
      "useCase": "Caso de uso",
      "clientOrProject": "Cliente/Proyecto",
      "version": "Versión",
      "changelog": "Registro de cambios",
      "notes": "Notas",
      "selectCategory": "Seleccionar categoría",
      "none": "Ninguno"
    },
    "messages": {
      "noPromptsFound": "No se encontraron prompts.",
      "createFirstPrompt": "Crear tu primer prompt",
      "copiedToClipboard": "¡Copiado al portapapeles!",
      "confirmDelete": "¿Estás seguro de que quieres eliminar este prompt?",
      "failedToSave": "Error al guardar el prompt",
      "failedToDelete": "Error al eliminar el prompt",
      "failedToCopy": "Error al copiar al portapapeles"
    }
  },
  "filters": {
    "title": "Filtros",
    "category": "Categoría",
    "platform": "Plataforma",
    "status": "Estado",
    "allCategories": "Todas las categorías",
    "allPlatforms": "Todas las plataformas",
    "allStatuses": "Todos los estados",
    "searchPlaceholder": "Buscar prompts..."
  }
}
```

#### 5.2.4 Cambios Requeridos en Código

**Archivos a modificar:**

1. **Configuración** (Nuevos archivos)
   - `i18n/config.ts` - Configuración de next-intl
   - `i18n/request.ts` - Middleware para detección de idioma
   - `i18n/routing.ts` - Configuración de rutas
   - `middleware.ts` - Middleware de Next.js (modificar)

2. **Archivos de traducciones** (Nuevos archivos)
   - `messages/en.json` - Traducciones en inglés
   - `messages/es.json` - Traducciones en español

3. **Layout** (Modificar)
   - `app/layout.tsx` - Agregar provider de next-intl
   - Crear estructura `[locale]/layout.tsx`

4. **Componentes UI** (Modificar todos)
   - `components/layout/Sidebar.tsx` - Traducir navegación
   - `components/layout/Topbar.tsx` - Traducir búsqueda
   - `components/prompt/PromptForm.tsx` - Traducir formulario
   - `components/prompt/PromptFilters.tsx` - Traducir filtros
   - `components/prompt/PromptList.tsx` - Traducir mensajes
   - `app/categories/page.tsx` - Traducir página
   - `app/tags/page.tsx` - Traducir página

5. **API Routes** (Modificar)
   - Validación de mensajes de error
   - Mensajes de respuesta

#### 5.2.5 Ejemplo de Uso en Componentes

**Antes (hardcodeado):**
```tsx
<Button>Create your first prompt</Button>
```

**Después (con next-intl):**
```tsx
import { useTranslations } from 'next-intl'

function MyComponent() {
  const t = useTranslations('prompts')
  
  return (
    <Button>{t('messages.createFirstPrompt')}</Button>
  )
}
```

### 5.3 Viabilidad y Complejidad

| Aspecto | Valoración | Detalles |
|---------|------------|----------|
| **Viabilidad técnica** | ✅ ALTA | next-intl es maduro y bien documentado |
| **Complejidad** | MEDIA | Requiere cambios en estructura de rutas |
| **Tiempo estimado** | 1-2 semanas | Implementación + traducciones + testing |
| **Riesgo** | BAJO-MEDIO | Cambios principalmente en UI |
| **Impacto en código existente** | MEDIO | Modifica componentes UI, no lógica de negocio |
| **Beneficios** | ALTO | Accesibilidad, alcance global, UX mejorada |

### 5.4 Dependencias y Consideraciones

**Dependencias:**
- Instalación de `next-intl`
- Reestructuración de rutas con `[locale]`
- Traducción de todos los textos
- Testing en ambos idiomas

**Consideraciones:**
- Detección automática de idioma del navegador
- Selector de idioma en UI
- SEO con URLs localizadas (`/en/prompts`, `/es/prompts`)
- Formateo de fechas y números según idioma
- Soporte futuro para más idiomas (fr, de, pt, etc.)

**Integración con sistema de dominios:**
- Los labels de dominios (Type, Platform, Status) también deberían ser traducibles
- Posible extensión de `DomainValue` con campo `label_i18n` o tabla separada

---

## 6. Conclusiones y Recomendaciones

### 6.1 Resumen de Hallazgos

| Aspecto | Estado Actual | Problemas Principales |
|---------|---------------|----------------------|
| **Valores Type, Platform, Status** | Hardcodeados en 4-6 ubicaciones | Duplicación, inconsistencia, difícil mantenimiento |
| **Formulario /prompts/new** | Componente bien estructurado | Selectores hardcodeados limitan flexibilidad |
| **Textos de UI** | 100% en inglés hardcodeado | No hay soporte multidioma |
| **Colores y estilos** | Hardcodeados en componentes | Difícil personalización |

### 6.2 Recomendaciones Prioritarias

#### 🥇 Prioridad 1: Sistema de Multidioma (EN + ES)

**Justificación:**
- Menor complejidad técnica
- Mayor beneficio inmediato para usuarios
- No afecta lógica de negocio
- Prepara el terreno para expansión global

**Plan de acción:**
1. Implementar next-intl
2. Crear archivos de traducción EN y ES
3. Migrar componentes UI gradualmente
4. Testing exhaustivo
5. Deploy

**Tiempo estimado:** 1-2 semanas

#### 🥈 Prioridad 2: Sistema de Dominio y Valor CRUD

**Justificación:**
- Resuelve problema fundamental de hardcodeados
- Permite gestión dinámica de valores
- Facilita futuras extensiones
- Mejora mantenibilidad a largo plazo

**Plan de acción:**
1. Diseñar schema de dominios
2. Crear API routes CRUD
3. Desarrollar UI de gestión
4. Migrar componentes existentes
5. Testing y validación

**Tiempo estimado:** 2-3 semanas

#### 🥉 Prioridad 3: Mejoras en Formulario

**Justificación:**
- El formulario es el componente principal de interacción
- Mejoras incrementales pueden implementarse rápido
- Impacto directo en UX

**Plan de acción:**
1. Validaciones mejoradas
2. Autoguardado
3. Previsualización en tiempo real
4. Mejoras en UX de selección de tags

**Tiempo estimado:** 1 semana

### 6.3 Roadmap Sugerido

```
Fase 1 (Semanas 1-2): Multidioma
├── Implementación de next-intl
├── Traducciones EN y ES
├── Migración de componentes UI
└── Testing y deploy

Fase 2 (Semanas 3-5): Sistema de Dominios
├── Diseño e implementación de schema
├── API routes CRUD
├── UI de gestión de dominios
├── Migración de componentes existentes
└── Testing y deploy

Fase 3 (Semanas 6-7): Mejoras en Formulario
├── Validaciones mejoradas
├── Autoguardado
├── Previsualización
└── UX improvements

Fase 4 (Semanas 8+): Expansiones
├── Más idiomas (FR, DE, PT)
├── Más dominios personalizados
├── Analytics y reporting
└── Integraciones externas
```

### 6.4 Consideraciones Técnicas Adicionales

#### Testing
- Implementar tests unitarios para validaciones de dominios
- Tests E2E para flujo completo de multidioma
- Tests de regresión para asegurar no romper funcionalidad existente

#### Performance
- Implementar caching de dominios en memoria
- Lazy loading de traducciones
- Optimización de bundle size

#### Seguridad
- Control de acceso a gestión de dominios (roles/permisos)
- Validación de entrada en API de dominios
- Auditoría de cambios en dominios

#### Documentación
- Documentar API de dominios
- Guía de traducción para nuevos idiomas
- Documentación de arquitectura del sistema

---

## 📎 Anexos

### Anexo A: Archivos Afectados por Cambios

**Para sistema de dominios:**
- `prisma/schema.prisma`
- `app/api/prompts/route.ts`
- `app/api/prompts/[id]/route.ts`
- `app/api/import/prompts/route.ts`
- `components/prompt/PromptForm.tsx`
- `components/prompt/PromptFilters.tsx`
- `components/prompt/PromptList.tsx`

**Para sistema de multidioma:**
- `app/layout.tsx`
- `middleware.ts`
- `components/layout/Sidebar.tsx`
- `components/layout/Topbar.tsx`
- `components/prompt/PromptForm.tsx`
- `components/prompt/PromptFilters.tsx`
- `components/prompt/PromptList.tsx`
- `app/categories/page.tsx`
- `app/tags/page.tsx`
- Todos los componentes con textos de UI

### Anexo B: Estimación de Esfuerzo

| Tarea | Complejidad | Tiempo (horas) |
|-------|-------------|----------------|
| Sistema de dominios - Diseño | Media | 8 |
| Sistema de dominios - Schema + Migración | Alta | 12 |
| Sistema de dominios - API CRUD | Media | 16 |
| Sistema de dominios - UI Gestión | Media | 20 |
| Sistema de dominios - Migración componentes | Alta | 24 |
| Sistema de dominios - Testing | Media | 12 |
| **Total Sistema de Dominios** | **Alta** | **92 horas (~12 días)** |
| | | |
| Sistema de multidioma - Configuración | Baja | 4 |
| Sistema de multidioma - Traducciones EN | Baja | 8 |
| Sistema de multidioma - Traducciones ES | Baja | 8 |
| Sistema de multidioma - Migración componentes | Media | 32 |
| Sistema de multidioma - Testing | Media | 12 |
| **Total Sistema de Multidioma** | **Media** | **64 horas (~8 días)** |

---

**Documento preparado por:** Análisis Técnico del Código  
**Fecha de creación:** 17 de abril de 2026  
**Versión:** 1.0  
**Estado:** ✅ Completado
