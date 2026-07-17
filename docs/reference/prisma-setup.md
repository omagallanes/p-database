# Integración de Tipos de Prisma con TypeScript

> ✅ **Estado**: Documento actualizado y alineado con el código real del proyecto (2026-04-24).
>
> Versión de Prisma: `5.19.1`
> Versión de TypeScript: `5.5.4`
>
> **Actualización Sprint F1-SF1.3-S1**: Añadidos 4 modelos nuevos (Platform, ClientProject, UseCase, ModelHint) + 4 junction tables con IDs compuestos. Interface `PromptFormProps` actualizado para aceptar campos nullable (`string | null`).
>
> **Actualización Sprint F2-SF2.1-S1**: Tipos para relaciones N:M de Platform y Category en componentes. Patrones de include anidado para cargar relaciones N:M en páginas Next.js.
>
> **Actualización Sprint F2-SF2.1-S2**: Tipos para relaciones N:M de ClientProject, UseCase, ModelHint en componentes. Interface `PromptFormProps` expandido con 3 entidades nuevas + props. Language selector con 10 idiomas (códigos ISO guardados en BD).
>
> **Actualización Sprint F4-SF4.1-S1**: Patrones de include anidado para export con 6 relaciones N:M. Transformación de relaciones N:M a arrays de nombres para serialización JSON. Campos legacy mantenidos para compatibilidad con imports antiguos.

Este documento documenta cómo los tipos derivados de Prisma se integran con TypeScript y cómo utilizarlos correctamente en el proyecto, incluyendo los patrones reales usados y las desviaciones observadas en la implementación actual.

## Visión General

Prisma genera automáticamente tipos TypeScript basados en el esquema de la base de datos (`prisma/schema.prisma`). Estos tipos proporcionan seguridad de tipos completa para todas las operaciones de base de datos y se pueden utilizar en todo el proyecto.

> ✅ **Estado de la integración**: Funcional y correctamente configurada. Prisma 5.19.1 se usa con TypeScript 5.5.4.
>
> ⚠️ **Observación**: El proyecto actualmente no aprovecha todo el potencial de los tipos generados por Prisma, usando tipos manuales en componentes y `any` en consultas.

## Generación de Tipos

### Cómo Funciona

Cuando ejecutas `npx prisma generate`, Prisma crea tipos TypeScript en `node_modules/.prisma/client/` basados en tu esquema. Estos tipos incluyen:

- **Tipos de modelos:** `Prompt`, `Category`, `Tag`, `PromptTag`
- **Tipos de argumentos:** `PromptFindManyArgs`, `PromptCreateArgs`, etc.
- **Tipos de payload:** `PromptGetPayload<T>`, `CategoryGetPayload<T>`, etc.
- **Tipos de select:** Para proyecciones específicas de campos

### Regeneración de Tipos

Los tipos se regeneran automáticamente cuando:
- Ejecutas `npm run db:generate` / `prisma generate`
- Ejecutas `npm run db:migrate` / `prisma migrate dev`
- Ejecutas `npm run db:push` / `prisma db push`
- Automáticamente durante `npm install` gracias al hook `postinstall`

> ✅ **Comandos disponibles en el proyecto**:
> ```bash
> npm run db:generate    # Genera tipos de Prisma
> npm run db:migrate     # Ejecuta migración y regenera tipos
> npm run db:push        # Empuja esquema directamente y regenera tipos
> ```

## Importación de Tipos

### Importación desde @prisma/client

```typescript
import { PrismaClient, Prompt, Category, Tag } from '@prisma/client'
```

### Importación del Cliente

```typescript
import { prisma } from '@/lib/prisma'
```

## Uso de Tipos en el Proyecto

### Tipos de Modelos Completos

```typescript
// Tipo completo del modelo Prompt
type Prompt = Prisma.PromptGetPayload<{
  include?: {}
  select?: {}
}>

// Ejemplo de uso
const prompt: Prompt = await prisma.prompt.findUnique({
  where: { id: 'clx...' }
})
```

### Tipos con Select (Proyecciones)

```typescript
// Solo campos específicos
type PromptSummary = Prisma.PromptGetPayload<{
  select: {
    id: true
    title: true
    status: true
  }
}>

// Ejemplo de uso
const prompts: PromptSummary[] = await prisma.prompt.findMany({
  select: {
    id: true,
    title: true,
    status: true
  }
})
```

### Tipos con Include (Relaciones)

```typescript
// Prompt con sus categorías y tags
type PromptWithRelations = Prisma.PromptGetPayload<{
  include: {
    category: true
    tags: {
      include: {
        tag: true
      }
    }
  }
}>

// Ejemplo de uso
const prompt: PromptWithRelations = await prisma.prompt.findUnique({
  where: { id: 'clx...' },
  include: {
    category: true,
    tags: {
      include: {
        tag: true
      }
    }
  }
})
```

## Modelos del Proyecto

### Prompt

```typescript
// Tipo completo
type Prompt = Prisma.PromptGetPayload<{}>
```

> 📋 **Campos reales según `prisma/schema.prisma`**:
> | Campo | Tipo | Descripción |
> |-------|------|-------------|
> | `id` | `String` | ID único CUID |
> | `title` | `String` | Título del prompt |
> | `description` | `String?` | Descripción opcional |
> | `body` | `String` | Cuerpo del prompt |
> | `type` | `String` | Tipo: SYSTEM/USER/TOOL |
> | `platform` | `String?` | Plataforma destino (legacy, nullable) |
> | `modelHint` | `String?` | Sugerencia de modelo |
> | `language` | `String` | Idioma (default "es") |
> | `useCase` | `String?` | Caso de uso (nullable) |
> | `clientOrProject` | `String?` | Cliente o proyecto asociado |
> | `status` | `String` | Estado: DRAFT/TESTED/PRODUCTION |
> | `isFavorite` | `Boolean` | Favorito |
> | `version` | `Int` | Versión |
> | `changelog` | `String?` | Registro de cambios |
> | `notes` | `String?` | Notas adicionales |
> | `prePrompt` | `String?` | Pre-prompt (@db.Text) |
> | `manualDeUso` | `String?` | Manual de uso (@db.Text) |
> | `usageCount` | `Int` | Contador de usos |
> | `lastUsedAt` | `DateTime?` | Último uso |
> | `userId` | `String?` | ID del propietario |
> | `createdAt` | `DateTime` | Fecha de creación |
> | `updatedAt` | `DateTime` | Fecha de actualización |

> ⚠️ **Importante**: En la implementación actual:
> - `userId` no se documenta en el formulario pero existe en el modelo
> - Las fechas se serializan como `string` en las respuestas API, no como `Date`

// Ejemplo de uso en API route
export async function GET(request: Request) {
  const prompts: Prompt[] = await prisma.prompt.findMany({
    where: { status: 'PRODUCTION' }
  })
  return Response.json(prompts)
}
```

### Category

```typescript
// Tipo completo
type Category = Prisma.CategoryGetPayload<{}>

// Campos disponibles:
// - id: string
// - name: string
// - slug: string
// - parentId: string | null
// - sortOrder: number
// - createdAt: Date
// - updatedAt: Date

// Con relaciones
type CategoryWithTree = Prisma.CategoryGetPayload<{
  include: {
    parent: true
    children: true
    prompts: true
  }
}>
```

### Tag

```typescript
// Tipo completo
type Tag = Prisma.TagGetPayload<{}>

// Campos disponibles:
// - id: string
// - name: string
// - slug: string
// - createdAt: Date
// - updatedAt: Date
```

### PromptTag (Tabla de relación)

```typescript
// Tipo completo
type PromptTag = Prisma.PromptTagGetPayload<{}>

// Campos disponibles:
// - promptId: string
// - tagId: string

// Con relaciones
type PromptTagWithRelations = Prisma.PromptTagGetPayload<{
  include: {
    prompt: true
    tag: true
  }
}>
```

### Nuevos Modelos (Sprint F1-SF1.3-S1)

**Platform**:
```typescript
type Platform = Prisma.PlatformGetPayload<{}>
// Campos: id, name, slug, sortOrder, createdAt, updatedAt
// Seed data: 5 registros (CHATGPT, CURSOR, MIDJOURNEY, SUNO, OTHER)
```

**ClientProject**:
```typescript
type ClientProject = Prisma.ClientProjectGetPayload<{}>
// Campos: id, name, slug, sortOrder, createdAt, updatedAt
// Seed data: 3 registros (Internal Tool, Client A, Personal)
```

**UseCase**:
```typescript
type UseCase = Prisma.UseCaseGetPayload<{}>
// Campos: id, name, slug, sortOrder, createdAt, updatedAt
// Seed data: 5 registros (Code Review, Documentation, Debugging, Refactoring, Learning)
```

**ModelHint**:
```typescript
type ModelHint = Prisma.ModelHintGetPayload<{}>
// Campos: id, name, slug, sortOrder, createdAt, updatedAt
// Seed data: 5 registros (GPT-4, GPT-3.5-Turbo, Claude-3, Gemini-Pro, Default)
```

**Junction Tables con IDs compuestos**:
```typescript
// PromptPlatform - ID compuesto: @@id([promptId, platformId])
type PromptPlatform = Prisma.PromptPlatformGetPayload<{}>

// PromptClientProject - ID compuesto: @@id([promptId, clientProjectId])
type PromptClientProject = Prisma.PromptClientProjectGetPayload<{}>

// PromptUseCase - ID compuesto: @@id([promptId, useCaseId])
type PromptUseCase = Prisma.PromptUseCaseGetPayload<{}>

// PromptModelHint - ID compuesto: @@id([promptId, modelHintId])
type PromptModelHint = Prisma.PromptModelHintGetPayload<{}>
```

> ⚠️ **Importante**: Las junction tables usan IDs compuestos (`@@id([promptId, platformId])`) en lugar de IDs simples (`@id @default(cuid())`). Esto permite múltiples relaciones para un mismo prompt pero requiere crear relaciones una por una (no nested create con arrays).

## Tipos de Argumentos de Prisma

### FindManyArgs

```typescript
// Para consultas findMany
type FindPromptsArgs = Prisma.PromptFindManyArgs

// Ejemplo de uso con tipos
const args: FindPromptsArgs = {
  where: {
    status: 'PRODUCTION',
    isFavorite: true
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 10
}

const prompts = await prisma.prompt.findMany(args)
```

### CreateArgs

```typescript
// Para crear registros
type CreatePromptArgs = Prisma.PromptCreateArgs

// Ejemplo de uso
const createArgs: CreatePromptArgs = {
  data: {
    title: 'Mi Prompt',
    body: 'Contenido del prompt',
    type: 'USER',
    platform: 'CURSOR',
    language: 'es',
    useCase: 'Desarrollo',
    status: 'DRAFT'
  }
}

const prompt = await prisma.prompt.create(createArgs)
```

### UpdateArgs

```typescript
// Para actualizar registros
type UpdatePromptArgs = Prisma.PromptUpdateArgs

// Ejemplo de uso
const updateArgs: UpdatePromptArgs = {
  where: { id: 'clx...' },
  data: {
    status: 'PRODUCTION',
    usageCount: { increment: 1 }
  }
}

const prompt = await prisma.prompt.update(updateArgs)
```

## Integración con Zod

### Validación de Datos de Entrada

> ✅ **Patrón usado correctamente en el proyecto**:
> El proyecto implementa la validación de entrada con Zod en todos los endpoints API, alineado con los tipos de Prisma. El esquema `createPromptSchema` en `app/api/prompts/route.ts` es fiel a los campos y enumeraciones del modelo.

```typescript
import { z } from 'zod'

// Schema Zod para crear un Prompt
const createPromptSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  body: z.string().min(1),
  type: z.enum(['SYSTEM', 'USER', 'TOOL']),
  platform: z.enum(['CHATGPT', 'CURSOR', 'MIDJOURNEY', 'SUNO', 'OTHER']).optional(),
  platformIds: z.array(z.string()).optional(),
  modelHint: z.string().optional(),
  modelHintIds: z.array(z.string()).optional(),
  language: z.enum(['en', 'es', 'nl', 'fr', 'de', 'pt', 'it', 'catalán/valenciano', 'vasco', 'gallego']).default('es'),
  useCase: z.string().optional(),
  useCaseIds: z.array(z.string()).optional(),
  clientOrProject: z.string().optional(),
  clientProjectIds: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'TESTED', 'PRODUCTION']).default('DRAFT'),
  isFavorite: z.boolean().default(false),
  categoryId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  prePrompt: z.string().optional(),
  manualDeUso: z.string().optional(),
  version: z.number().default(1),
})

// Tipo inferido del schema Zod
type CreatePromptInput = z.infer<typeof createPromptSchema>
```

### Validación de Datos de Salida

```typescript
// Schema Zod para respuesta de API
const promptResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  createdAt: z.date()
})

type PromptResponse = z.infer<typeof promptResponseSchema>

// Transformar datos de Prisma a respuesta
export function toPromptResponse(prompt: Prompt): PromptResponse {
  return promptResponseSchema.parse({
    id: prompt.id,
    title: prompt.title,
    status: prompt.status,
    createdAt: prompt.createdAt
  })
}
```

## Patrones Comunes

### DTO (Data Transfer Objects)

```typescript
// DTO para crear un prompt
export interface CreatePromptDTO {
  title: string
  description?: string
  body: string
  type: 'SYSTEM' | 'USER' | 'TOOL'
  platform: 'CHATGPT' | 'CURSOR' | 'MIDJOURNEY' | 'SUNO' | 'OTHER'
  language: string
  useCase: string
  clientOrProject?: string
  status?: 'DRAFT' | 'TESTED' | 'PRODUCTION'
  categoryId?: string
}

// DTO para actualizar un prompt
export interface UpdatePromptDTO {
  title?: string
  description?: string
  body?: string
  status?: 'DRAFT' | 'TESTED' | 'PRODUCTION'
  isFavorite?: boolean
  categoryId?: string
}
```

### Tipos de Respuesta de API

```typescript
// Respuesta completa
export interface PromptResponse {
  id: string
  title: string
  description: string | null
  body: string
  type: string
  platform: string
  language: string
  useCase: string
  status: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
    slug: string
  } | null
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
}

// Respuesta resumida
export interface PromptSummaryResponse {
  id: string
  title: string
  status: string
  isFavorite: boolean
  createdAt: string
}
```

### Tipos para Componentes React

```typescript
// Props para componente de PromptCard
interface PromptCardProps {
  prompt: Prisma.PromptGetPayload<{
    select: {
      id: true
      title: true
      description: true
      status: true
      isFavorite: true
      createdAt: true
    }
  }>
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

// Props para componente de PromptForm
interface PromptFormProps {
  prompt?: Prisma.PromptGetPayload<{
    include: {
      categories: {
        include: {
          category: true
        }
      }
      tags: {
        include: {
          tag: true
        }
      }
      platforms: {
        include: {
          platform: true
        }
      }
      clientProjects: {
        include: {
          clientProject: true
        }
      }
      useCases: {
        include: {
          useCase: true
        }
      }
      modelHints: {
        include: {
          modelHint: true
        }
      }
    }
  }>
  categories: Category[]
  tags: Tag[]
  platforms: Platform[]
  clientProjects: ClientProject[]
  useCases: UseCase[]
  modelHints: ModelHint[]
}
```

## Patrones Reales Usados en el Proyecto

### ✅ Patrones Correctos Observados

1. **Cliente Prisma global singleton**:
   ```typescript
   // lib/prisma.ts - Correctamente implementado
   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
   export const prisma = globalForPrisma.prisma ?? new PrismaClient()
   ```

2. **Validación Zod en endpoints**: Todos los endpoints POST/PUT usan Zod para validar entradas antes de pasar a Prisma.

3. **Serialización explícita de fechas**: Se maneja correctamente la conversión de `Date` a `string` para JSON.

 4. **Interfaces actualizadas para campos nullable (Sprint F1-SF1.3-S1)**:
    ```typescript
    // components/prompt/PromptForm.tsx:55-89 - Corregido
    interface PromptFormProps {
      prompt?: {
        platform: string | null  // ✅ Acepta null (schema: String?)
        useCase: string | null   // ✅ Acepta null (schema: String?)
        clientOrProject: string | null // ✅ Acepta null (schema: String?)
        modelHint: string | null // ✅ Acepta null (schema: String?)
        // ... campos legacy mantenidos para compatibilidad dual
      }
    }
    ```

 5. **Interfaces actualizadas para relaciones N:M (Sprint F2-SF2.1-S1 y SF2.1-S2)**:
    ```typescript
    // components/prompt/PromptForm.tsx:76-81 - Corregido
    interface PromptFormProps {
      prompt?: {
        // ... otros campos
        categories: { category: { id: string; name: string } }[]
        tags: { tag: { id: string; name: string } }[]
        platforms: { platform: { id: string; name: string } }[]
        clientProjects: { clientProject: { id: string; name: string } }[]
        useCases: { useCase: { id: string; name: string } }[]
        modelHints: { modelHint: { id: string; name: string } }[]
      }
      categories: Category[]
      tags: Tag[]
      platforms: Platform[]
      clientProjects: ClientProject[]
      useCases: UseCase[]
      modelHints: ModelHint[]
    }
    ```

### ❌ Anti-patrones Observados

1. **Redefinición manual de tipos**: Los componentes no usan `Prisma.PromptGetPayload`, sino que redefinen interfaces manualmente:
   ```typescript
   // components/prompt/PromptForm.tsx:55 - Anti-patrón
   interface PromptFormProps {
     prompt?: {
       id: string
       title: string
       // ... 18 campos redefinidos manualmente
     }
   }
   ```

2. ~~Uso de `any` en consultas~~ 🔧 **CORREGIDO**:
   ```typescript
   // app/(app)/prompts/page.tsx:52 - Corregido
   const where: Prisma.PromptWhereInput = {}  // ✅ Ya no es any
   ```
   El anti-patrón fue corregido. Ahora se usa `Prisma.PromptWhereInput`.

3. **No uso de tipos inferidos**: No se aprovecha la inferencia automática de tipos de consultas Prisma.

## Mejores Prácticas

### 1. Usar Tipos Derivados de Prisma

```typescript
// ✅ BUENO: Usar tipos derivados de Prisma
type PromptWithCategory = Prisma.PromptGetPayload<{
  include: { category: true }
}>

// ❌ MALO: Redefinir tipos que ya existen
interface PromptWithCategory {
  id: string
  title: string
  category?: {
    id: string
    name: string
  }
}
```

### 2. Usar Select para Proyecciones Específicas

```typescript
// ✅ BUENO: Usar select para campos específicos
const prompts = await prisma.prompt.findMany({
  select: {
    id: true,
    title: true,
    status: true
  }
})

// Esto genera el tipo correcto automáticamente
type PromptSummary = typeof prompts[0]
```

> ⚠️ **Nota importante para este proyecto**:
> Actualmente el proyecto NO hace esto. La página de prompts realiza la consulta completa y luego transforma manualmente los datos. Esto es ineficiente y pierde seguridad de tipos.

### 2.1. Manejo de Serialización de Fechas

> 📌 **Patrón específico del proyecto**:
> Next.js App Router no puede serializar objetos `Date` directamente a JSON. Siempre debes convertir fechas a string:
> ```typescript
> // ✅ BUENO: Serialización explícita
> const transformedPrompts = prompts.map((prompt) => ({
>   ...prompt,
>   createdAt: prompt.createdAt.toISOString(),
>   updatedAt: prompt.updatedAt.toISOString(),
> }))
> ```

### 3. Validar Datos de Entrada con Zod

```typescript
// ✅ BUENO: Validar antes de crear
const createPromptSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  // ...
})

const validated = createPromptSchema.parse(input)
await prisma.prompt.create({ data: validated })
```

### 4. No Exponer Tipos Internos en APIs

```typescript
// ✅ BUENO: Usar DTOs para APIs
export interface CreatePromptDTO {
  title: string
  body: string
  // ...
}

// ❌ MALO: Exponer tipos de Prisma directamente
export type CreatePromptInput = Prisma.PromptCreateInput
```

### 5. Usar Tipos de Argumentos para Consultas Reutilizables

```typescript
// ✅ BUENO: Reutilizar tipos de argumentos
const findProductionPrompts = async (args: Prisma.PromptFindManyArgs) => {
  return await prisma.prompt.findMany({
    ...args,
    where: {
      ...args.where,
      status: 'PRODUCTION'
    }
  })
}
```

---

## Observaciones y Correcciones Identificadas

### ✅ Contenido Correcto y Vigente
1. Generación de tipos Prisma - Funciona según lo documentado
2. Importación de tipos - Correcta
3. Integración con Zod - Correctamente implementada en el código
4. Mejores prácticas generales - Alineadas con la documentación oficial
5. **Nuevos modelos (Sprint F1-SF1.3-S1)**: Platform, ClientProject, UseCase, ModelHint documentados
6. **Junction tables con IDs compuestos**: Documentado patrón correcto (`@@id([promptId, platformId])`)
7. **Fix campos nullable**: Interface `PromptFormProps` actualizado para aceptar `string | null`
8. **Patrones de include N:M (Sprint F2-SF2.1-S1)**: Platform y Category con include anidado documentados
9. **Patrones de include N:M (Sprint F2-SF2.1-S2)**: ClientProject, UseCase, ModelHint con include anidado documentados
10. **Language selector**: 10 idiomas con códigos ISO guardados en BD (SF2.1-S2)

### ⚠️ Correcciones Necesarias
1. **Modelo Prompt**: Se añadió el campo `userId` que faltaba en la documentación
2. **Serialización de fechas**: Se añadió el patrón específico de serialización de fechas requerido por Next.js
3. **Comandos**: Se actualizaron los comandos con los alias reales del proyecto
4. **Antipatrones**: Se documentaron los patrones reales usados actualmente en el código

### 📌 Recomendaciones de Mejora
1. Reemplazar las interfaces manuales en `PromptForm.tsx` y `PromptList.tsx` por tipos derivados de `Prisma.PromptGetPayload<>`
2. Cambiar el tipo `any` en los objetos `where` por `Prisma.PromptWhereInput`
3. Aprovechar la inferencia automática de tipos de las consultas Prisma en lugar de transformar manualmente
4. ~~Usar tipos de Prisma para las nuevas entidades (Platform, ClientProject, UseCase, ModelHint) en componentes~~ ✅ COMPLETADO en Sprint F2-SF2.1-S2

---

## Patrones de Include para Relaciones N:M (Sprint F2-SF2.1-S1)

### Include Anidado para Cargar Relaciones N:M en Páginas

**Estado:** ✅ Validado  
**Sprint:** F2-SF2.1-S1  
**Descripción:** Para cargar valores seleccionados en edición de formularios con relaciones N:M, es necesario usar include anidado en las queries de Prisma.

**Patrón para Platform:**
```typescript
// En app/(app)/prompts/[id]/page.tsx
const prompt = await prisma.prompt.findUnique({
  where: { id },
  include: {
    platforms: {
      include: {
        platform: true,  // ✅ Include anidado para obtener datos de Platform
      },
    },
  },
})
```

**Tipo resultante:**
```typescript
// El tipo inferido es:
{
  platforms: {
    platform: {
      id: string
      name: string
      slug: string
      // ... campos de Platform
    }
  }[]
}
```

**Patrón para Category:**
```typescript
const prompt = await prisma.prompt.findUnique({
  where: { id },
  include: {
    categories: {
      include: {
        category: true,  // ✅ Include anidado para obtener datos de Category
      },
    },
  },
})
```

**Patrón completo para múltiples relaciones N:M (Sprint F2-SF2.1-S2):**
```typescript
const [prompt, categories, tags, platforms, clientProjects, useCases, modelHints] = await Promise.all([
  prisma.prompt.findUnique({
    where: { id },
    include: {
      platforms: { include: { platform: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      clientProjects: { include: { clientProject: true } },  // ✅ SF2.1-S2
      useCases: { include: { useCase: true } },              // ✅ SF2.1-S2
      modelHints: { include: { modelHint: true } },          // ✅ SF2.1-S2
    },
  }),
  prisma.category.findMany({ orderBy: { name: 'asc' } }),
  prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  prisma.platform.findMany({ orderBy: { name: 'asc' } }),
  prisma.clientProject.findMany({ orderBy: { name: 'asc' } }),
  prisma.useCase.findMany({ orderBy: { name: 'asc' } }),
  prisma.modelHint.findMany({ orderBy: { name: 'asc' } }),
])
```

**Uso en componentes React (Sprint F2-SF2.1-S2):**
```typescript
// En PromptForm.tsx
interface PromptFormProps {
  prompt?: {
    // ... otros campos
    platforms: { platform: { id: string; name: string } }[]
    categories: { category: { id: string; name: string } }[]
    clientProjects: { clientProject: { id: string; name: string } }[]  // ✅ SF2.1-S2
    useCases: { useCase: { id: string; name: string } }[]              // ✅ SF2.1-S2
    modelHints: { modelHint: { id: string; name: string } }[]          // ✅ SF2.1-S2
  }
  platforms: Platform[]  // Lista completa para selección
  categories: Category[]
  tags: Tag[]
  clientProjects: ClientProject[]  // ✅ SF2.1-S2
  useCases: UseCase[]              // ✅ SF2.1-S2
  modelHints: ModelHint[]          // ✅ SF2.1-S2
}

// Inicializar estado desde relaciones N:M
const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(
  prompt?.platforms?.map((p) => p.platform as Platform) || []
)
const [selectedClientProjects, setSelectedClientProjects] = useState<ClientProject[]>(
  prompt?.clientProjects?.map((cp) => cp.clientProject as ClientProject) || []
)
const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>(
  prompt?.useCases?.map((uc) => uc.useCase as UseCase) || []
)
const [selectedModelHints, setSelectedModelHints] = useState<ModelHint[]>(
  prompt?.modelHints?.map((mh) => mh.modelHint as ModelHint) || []
)
```

**Riesgo si se ignora:** El formulario no recibe los valores seleccionados; la edición muestra campos vacíos aunque el prompt tenga relaciones guardadas.

---

## Actualización Sprint F2-SF2.2-S1: Campos Opcionales y Serialización de Fechas

**Estado:** ✅ Validado  
**Sprint:** F2-SF2.2-S1  
**Descripción:** Añadidos campos opcionales `prePrompt` y `manualDeUso` al modelo Prompt. Implementada serialización de fechas `createdAt`/`updatedAt` para componentes cliente.

**Cambios en Schema:**
```prisma
model Prompt {
  // ... campos existentes
  prePrompt   String?   @db.Text
  manualDeUso String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Serialización en Server Component:**
```typescript
// En app/(app)/prompts/[id]/page.tsx
const serializedPrompt = {
  ...prompt,
  createdAt: prompt.createdAt.toISOString(),
  updatedAt: prompt.updatedAt.toISOString(),
}

return <PromptForm prompt={serializedPrompt} ... />
```

**Interface en Componente Cliente:**
```typescript
interface PromptFormProps {
  prompt?: {
    prePrompt: string | null
    manualDeUso: string | null
    createdAt: string  // string, no Date
    updatedAt: string
    // ... otros campos
  }
}
```

**Riesgo si se ignora:** Error de TypeScript: "Type 'Date' is not assignable to type 'string'". Build falla.

---

## Actualización Sprint F3-SF3.1-S1: Preferencia de Vista en Modelo User

**Estado:** ✅ Validado  
**Sprint:** F3-SF3.1-S1  
**Descripción:** Añadido campo `promptListViewPreference` al modelo `User` para persistir preferencia de visualización (cards/lista).

**Cambios en Schema:**
```prisma
model User {
  // ... campos existentes
  promptListViewPreference String  @default("cards")
}
```

**Tipos generados por Prisma:**
```typescript
// Tipo completo de User con nuevo campo
type User = Prisma.UserGetPayload<{}>
// Campos: id, name, email, emailVerified, image, password, role, promptListViewPreference, createdAt, updatedAt

// Tipo para preferencia específica
type UserViewPreference = Pick<User, 'promptListViewPreference'>
```

**Uso en Server Component (page.tsx):**
```typescript
async function getUserViewPreference(): Promise<"cards" | "list"> {
  const session = await auth()
  
  if (!session?.user?.id) {
    return "cards"
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { promptListViewPreference: true },
  })

  return user?.promptListViewPreference || "cards"
}
```

**Interface en API Route:**
```typescript
const updatePreferencesSchema = z.object({
  promptListViewPreference: z.enum(["cards", "list"]),
})

// PATCH /api/user/preferences
const data = updatePreferencesSchema.parse(body)
// data.promptListViewPreference: "cards" | "list"
```

**Riesgo si se ignora:** Error de TypeScript si el enum de Zod no coincide con el schema de Prisma; preferencia no persiste entre sesiones.

---


## Referencias

- [Prisma TypeScript Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures)
- [Prisma Type Utilities](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#type-utilities)
- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Prisma Best Practices](https://www.prisma.io/docs/orm/more/best-practices)

---

> **Última actualización**: 2026-04-25 (Fase 4 COMPLETADA, F5-SF5.1-S1 implementación parcial - 31 tests creados, 16 passing)  
> **SF-4.1**: ✅ CERRADA - Export con auth + nuevo formato N:M completado  
> **SF-3.1**: ✅ CERRADA - Vista lista + preferencia de visualización implementada  
> **SF-3.1**: ✅ CERRADA - Vista lista + preferencia de visualización implementada (campo `promptListViewPreference` en User)  
> **SF-2.3**: ✅ CERRADA - Navegación post-guardado implementada (sin cambios en tipos Prisma)  
> **SF-2.2**: ✅ CERRADA - Campos Pre-Prompt y Manual de uso añadidos; fechas serializadas para cliente
