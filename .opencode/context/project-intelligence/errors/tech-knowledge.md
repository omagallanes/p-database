<!-- Context: project-intelligence/errors/tech-knowledge | Priority: high | Version: 1.0 | Updated: 2026-07-16 -->

# Catálogo de Errores y Conocimiento Preventivo

> **Finalidad:** Fuente única de verdad para errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Versión:** 1.0
> **Importante:** Consultar este archivo antes de planificar, desarrollar, modificar, depurar, probar o desplegar cambios.
> **Relación:** Complementa `technical-domain.md` (Known Pitfalls — resumen de alto nivel) con el catálogo detallado.

---

## Leyenda de Estados

| Símbolo | Significado |
|---------|-------------|
| ✅ | Validado contra código actual |
| 🔧 | Corregido en implementación actual |
| ❌ | Activo — requiere corrección |
| ⚠️ | Advertencia crítica |
| 📝 | Información adicional descubierta en código |

---

## 1. Autenticación NextAuth.js

### 1.1 Error `MissingSecret` en Middleware

**Estado:** ✅ Validado  
**Código:** `middleware.ts`, `lib/auth.ts`  
**Descripción:** NextAuth.js requiere `AUTH_SECRET` para firmar tokens. La falta de esta variable causa `MissingSecret`.

**Prevención:**
- Verificar que `AUTH_SECRET` esté configurada en todos los entornos (desarrollo, staging, producción)
- Validar presencia de variable en tiempo de inicialización de la aplicación
- Usar validación Zod para variables críticas de autenticación

---

### 1.2 Redirecciones Incorrectas en Páginas de Autenticación

**Estado:** 🔧 Corregido  
**Código:** `middleware.ts` (líneas 14-22)  
**Descripción:** Error original causado por `MissingSecret`. Corregido al resolver la configuración.

**Prevención:**
- Probar middleware localmente con diferentes estados de sesión (autenticado/no autenticado)
- Verificar que redirecciones respeten la lógica "deny-all" como patrón por defecto
- Implementar logging para errores de autenticación (más allá de `console.log`)

---

### 1.3 Protección Insuficiente de Rutas (Middleware)

**Estado:** 🔧 Corregido  
**Código:** `middleware.ts` (líneas 8-22)  
**Descripción:** El middleware protege todas las rutas excepto `/auth/signin`, `/auth/signup`, `/auth/error`.

**Prevención:**
- Implementar siempre enfoque "deny-all" como patrón por defecto
- Documentar explícitamente las rutas públicas en el middleware
- Validar que nuevas rutas sean consideradas en la protección
- Mantener separación clara entre rutas públicas y privadas en estructura de archivos

---

### 1.4 Sidebar Visible en Páginas de Autenticación

**Estado:** 🔧 Corregido  
**Código:** `app/(auth)/layout.tsx`, `app/(app)/layout.tsx`  
**Descripción:** Layouts separados resuelven problema de UX.

**Prevención:**
- Usar layouts separados para áreas de autenticación vs aplicación
- Validar que componentes de UI (Sidebar, Topbar) no aparezcan en contextos inapropiados

---

### 1.5 Falta de Página de Administración de Usuarios

**Estado:** ✅ Validado  
**Código:** `app/api/users/`, `app/api/users/[id]/`  
**Descripción:** Backend implementado sin frontend correspondiente.

**Prevención:**
- Planificar desarrollo frontend/backend en paralelo
- Validar que cada endpoint API tenga su correspondiente interfaz de usuario
- Documentar funcionalidades incompletas explícitamente

---

### 1.6 Falta de Página de Error de Autenticación

**Estado:** ✅ Validado  
**Código:** `lib/auth.ts` (línea 13), `app/(auth)/`  
**Descripción:** NextAuth.js configura `error: "/auth/error"` pero la página no existe.

**Prevención:**
- Crear páginas de error para todos los flujos posibles de autenticación
- Revisar que todas las páginas personalizadas de NextAuth.js existan
- Validar consistencia entre configuración e implementación

---

## 2. Prisma y Base de Datos

### 2.1 IDs Compuestos en Junction Tables para Relaciones N:M

**Estado:** ✅ Validado  
**Código:** `prisma/schema.prisma:183-225`  
**Descripción:** Las junction tables para relaciones N:M deben usar IDs compuestos (`@@id([campo1, campo2])`) en lugar de IDs simples generados (`@id @default(cuid())`). Los IDs simples impiden crear múltiples relaciones para un mismo registro padre.

**Prevención:**
- Siempre usar `@@id([promptId, platformId])` para junction tables N:M
- Verificar el schema con `prisma validate` antes de ejecutar seed
- Probar con múltiples relaciones para un mismo prompt durante desarrollo

**Código correcto:**
```prisma
model PromptPlatform {
  promptId   String
  platformId String
  prompt     Prompt   @relation(fields: [promptId], references: [id], onDelete: Cascade)
  platform   Platform @relation(fields: [platformId], references: [id], onDelete: Cascade)

  @@id([promptId, platformId])  // ✅ ID compuesto
  @@index([promptId])
  @@index([platformId])
}
```

**Código incorrecto:**
```prisma
model PromptPlatform {
  promptId   String   @id @default(cuid())  // ❌ ID simple
  platformId String
  // ...
}
```

**Riesgo:** Error P2002 (Unique constraint failed) al crear múltiples relaciones para un mismo prompt.

---

### 2.2 Migración de Datos String → Relaciones N:M

**Estado:** ✅ Validado  
**Código:** `prisma/migrate-data.ts`  
**Descripción:** Para migrar campos string existentes a relaciones N:M, se debe leer todos los registros con campos no nulos, crear/obtener entidades con `upsert`, crear entradas en junction tables con `upsert`, y envolver todo en `$transaction` para atomicidad.

**Prevención:**
- Usar `upsert` tanto para entidades como para junction tables
- Normalizar valores antes de buscar/crear (trim, uppercase, etc.)
- Envolver en `$transaction` para garantizar atomicidad
- Loggear progreso para debugging

**Código de ejemplo:**
```typescript
await prisma.$transaction(async (tx) => {
  const prompts = await tx.prompt.findMany({
    where: { platform: { not: null } }
  })

  for (const prompt of prompts) {
    const platformName = prompt.platform.trim().toUpperCase()
    const platform = await tx.platform.upsert({
      where: { slug: platformName.toLowerCase() },
      update: {},
      create: { name: platformName, slug: platformName.toLowerCase() }
    })
    await tx.promptPlatform.upsert({
      where: { promptId_platformId: { promptId: prompt.id, platformId: platform.id } },
      update: {},
      create: { promptId: prompt.id, platformId: platform.id }
    })
  }
})
```

**Riesgo:** Datos inconsistentes, duplicados en junction tables, migración parcial.

---

### 2.3 Seed con Relaciones N:M Múltiples

**Estado:** 🔧 Corregido (ya no aplica al seed actual simplificado)  
**Código:** `prisma/seed.ts`, `package.json` (postinstall, prisma.seed)  
**Descripción:** El seed actual fue simplificado drásticamente. Solo crea 2 usuarios sin prompts ni relaciones N:M. El patrón documentado aquí es técnicamente correcto pero ya no está implementado.

**Prevención:**
- Crear prompt con `prisma.prompt.create()`
- Luego crear relaciones con `prisma.promptPlatform.create()` múltiples veces
- Esto evita errores de unique constraint con IDs compuestos

**Código de ejemplo:**
```typescript
const prompt = await prisma.prompt.create({
  data: { id: 'sample-3', title: '...', platform: 'CURSOR' }
})

await prisma.promptPlatform.create({
  data: { promptId: prompt.id, platformId: platformCursor.id }
})
await prisma.promptPlatform.create({
  data: { promptId: prompt.id, platformId: platformChatGPT.id }
})
```

**Riesgo:** Error P2002 (Unique constraint failed) al crear múltiples relaciones con nested writes.

---

### 2.4 Campos Nullable en Interfaces TypeScript

**Estado:** ✅ Validado  
**Código:** `components/prompt/PromptForm.tsx:55-89`  
**Descripción:** Cuando el schema Prisma tiene campos opcionales (`Type?`), las interfaces TypeScript deben aceptar `Type | null`. De lo contrario, el build fallará con errores de tipo.

**Prevención:**
- Verificar schema Prisma para campos opcionales (`String?`, `Int?`, etc.)
- Actualizar interfaces TypeScript para aceptar `Type | null`
- Ejecutar `npm run build` después de cambios de schema para detectar errores temprano

**Código de ejemplo:**
```typescript
// Schema: platform String?
interface PromptFormProps {
  prompt?: {
    platform: string | null  // ✅ Acepta null
    // ...
  }
}
```

**Riesgo:** Error de TypeScript en build: "Type 'null' is not assignable to type 'string'".

---

### 2.5 `$transaction` Explícito para Múltiples Junction Tables

**Estado:** ✅ Validado  
**Código:** `app/api/prompts/[id]/route.ts`  
**Descripción:** Cuando se actualizan múltiples relaciones N:M simultáneamente (hasta 6 junction tables), todas las operaciones delete+create deben envolverse en `$transaction` explícito para garantizar atomicidad. Si una operación falla, todas se revierten.

**Prevención:**
- Siempre usar `prisma.$transaction(async (tx) => {...})` para updates que modifican relaciones N:M
- Delete TODAS las relaciones primero (todas las junction tables), luego crear las nuevas
- Incluir TODAS las junction tables en la misma transacción
- Retornar el resultado del update desde dentro de la transacción
- No mezclar operaciones fuera de la transacción con operaciones dentro

**Código de ejemplo:**
```typescript
await prisma.$transaction(async (tx) => {
  // Delete ALL existing relations first
  await tx.promptTag.deleteMany({ where: { promptId } })
  await tx.promptCategory.deleteMany({ where: { promptId } })
  await tx.promptPlatform.deleteMany({ where: { promptId } })
  await tx.promptClientProject.deleteMany({ where: { promptId } })
  await tx.promptUseCase.deleteMany({ where: { promptId } })
  await tx.promptModelHint.deleteMany({ where: { promptId } })

  // Then create new relations
  return await tx.prompt.update({
    where: { id: promptId },
    data: {
      tags: tagIds?.length ? { create: tagIds.map(id => ({ tagId: id })) } : undefined,
      categories: categoryIds?.length ? { create: categoryIds.map(id => ({ categoryId: id })) } : undefined,
      platforms: platformIds?.length ? { create: platformIds.map(id => ({ platformId: id })) } : undefined,
      clientProjects: clientProjectIds?.length ? { create: clientProjectIds.map(id => ({ clientProjectId: id })) } : undefined,
      useCases: useCaseIds?.length ? { create: useCaseIds.map(id => ({ useCaseId: id })) } : undefined,
      modelHints: modelHintIds?.length ? { create: modelHintIds.map(id => ({ modelHintId: id })) } : undefined,
    },
    include: { tags: { include: { tag: true } }, /* etc */ }
  })
})
```

**Riesgo:** Pérdida de datos si el create falla después del delete. Las relaciones se pierden permanentemente sin posibilidad de recuperación.

---

### 2.6 Junction Tables Requieren Operaciones Explícitas

**Estado:** ✅ Validado  
**Código:** `app/api/import/prompts/route.ts`, `prisma/schema.prisma`  
**Descripción:** Relaciones N:M con junction tables no pueden actualizarse con campos directos (`categoryId`). Requieren operaciones explícitas en la junction table.

**Prevención:**
- Usar `prisma.promptCategory.create()` para crear relaciones
- Usar `prisma.promptCategory.deleteMany()` para eliminar relaciones
- Envolver operaciones en `$transaction` para atomicidad

**Código de referencia:**
```typescript
// ❌ INCORRECTO: categoryId no existe en Prompt
await prisma.prompt.update({
  where: { id: promptId },
  data: { categoryId },  // Error: Property no existe
})

// ✅ CORRECTO: Usar junction table explícitamente
await prisma.$transaction([
  prisma.promptCategory.deleteMany({ where: { promptId: promptId } }),
  prisma.promptCategory.create({
    data: { promptId: promptId, categoryId },
  }),
])

// ✅ CORRECTO: Para múltiples relaciones
await prisma.$transaction(
  categoryIds.map((id) =>
    prisma.promptCategory.create({
      data: { promptId: prompt.id, categoryId: id },
    })
  )
)
```

**Riesgo:** Build falla con errores de TypeScript; relaciones no se crean/actualizan correctamente.

---

### 2.7 Null Coalescing para Campos No Nullable

**Estado:** ✅ Validado  
**Código:** `app/api/import/prompts/route.ts`  
**Descripción:** Campos de Prisma definidos como `String @default("VALUE")` no son nullable en el schema. Datos externos (import, API) pueden tener `null` para estos campos, causando errores de TypeScript. Usar null coalescing (`??`) para proporcionar valores por defecto.

**Prevención:**
- Inspeccionar schema de Prisma para identificar campos no nullable
- Usar `??` para campos con valor por defecto: `field: data.field ?? "DEFAULT"`
- Usar `||` para strings vacíos: `field: data.field || "es"`
- Validar que todos los campos no nullable tienen fallback

**Código de referencia:**
```typescript
await prisma.prompt.create({
  data: {
    type: promptData.type ?? "USER",         // Schema: String @default("USER")
    status: promptData.status ?? "DRAFT",    // Schema: String @default("DRAFT")
    language: promptData.language || "es",   // Schema: String @default("es")
    isFavorite: promptData.isFavorite ?? false, // Boolean @default(false)
  },
})
```

**Riesgo:** Build falla con errores de TypeScript; runtime errors si datos externos tienen `null`.

---

### 2.8 Compatibilidad Dual durante Transición de Schema

**Estado:** ✅ Validado  
**Código:** `app/api/prompts/route.ts`  
**Descripción:** Durante migración de campos string simples a relaciones N:M, mantener AMBOS campos en Zod schemas como opcionales permite transición gradual sin romper clientes existentes.

**Prevención:**
- Mantener campo legacy como opcional: `platform: z.enum([...]).optional()`
- Añadir campo nuevo como opcional: `platformIds: z.array(z.string()).optional()`
- Documentar claramente en comentarios que es temporal para transición
- Planificar eliminación de campo legacy en Sprint futuro
- Aceptar ambos formatos en handlers de API

**Código de ejemplo:**
```typescript
const createPromptSchema = z.object({
  // Legacy fields (opcional durante transición)
  platform: z.enum(["CHATGPT", "CURSOR", ...]).optional(),
  useCase: z.string().optional(),
  clientOrProject: z.string().optional(),
  modelHint: z.string().optional(),
  categoryId: z.string().optional(),

  // New N:M fields (preferidos)
  platformIds: z.array(z.string()).optional(),
  useCaseIds: z.array(z.string()).optional(),
  clientProjectIds: z.array(z.string()).optional(),
  modelHintIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
})
```

**Riesgo:** Errores de TypeScript en compilación, clientes existentes dejan de funcionar.

---

### 2.9 Switch Statement para Acceso Dinámico Type-Safe en Prisma

**Estado:** ✅ Validado  
**Código:** `app/api/import/upsert-entity.ts`  
**Descripción:** Cuando se necesita acceso dinámico a propiedades de Prisma (ej: `prisma[entityType]`), TypeScript no puede inferir tipos correctamente. Usar switch statement en lugar de acceso dinámico con `as any` preserva type safety.

**Prevención:**
- Evitar acceso dinámico `prisma[key as any]` cuando sea posible
- Usar switch statement para cada tipo de entidad
- Separar lógica de búsqueda y creación en switches independientes
- Retornar tipos consistentes (`{ id: string }`) desde todos los casos

**Código de referencia:**
```typescript
async function upsertEntity(
  entityType: "platform" | "clientProject" | "useCase" | "modelHint",
  name: string
): Promise<string> {
  let existing: { id: string } | null = null

  switch (entityType) {
    case "platform":
      existing = await prisma.platform.findFirst({...})
      break
    case "clientProject":
      existing = await prisma.clientProject.findFirst({...})
      break
    case "useCase":
      existing = await prisma.useCase.findFirst({...})
      break
    case "modelHint":
      existing = await prisma.modelHint.findFirst({...})
      break
  }

  if (existing) return existing.id

  let created: { id: string }
  switch (entityType) {
    case "platform":
      created = await prisma.platform.create({...})
      break
    case "clientProject":
      created = await prisma.clientProject.create({...})
      break
    case "useCase":
      created = await prisma.useCase.create({...})
      break
    case "modelHint":
      created = await prisma.modelHint.create({...})
      break
  }

  return created.id
}
```

**Riesgo:** Build falla con errores de TypeScript; `as any` oculta errores de tipo.

---

## 3. Despliegue y Migración PostgreSQL

### 3.1 Prisma Client Desactualizado en Vercel

**Estado:** 🔧 Corregido  
**Código:** `package.json` (línea 20)  
**Descripción:** Script `"postinstall": "prisma generate"` regenera Prisma Client en cada instalación.

**Prevención:**
- Incluir siempre script `postinstall` para regenerar Prisma Client
- Considerar cache de dependencias en plataformas cloud (Vercel, Railway)
- Validar que Prisma Client esté actualizado antes del despliegue

---

### 3.2 Configuración Prisma Seed Faltante

**Estado:** 🔧 Corregido  
**Código:** `package.json` (líneas 63-65)  
**Descripción:** Prisma requiere configuración explícita de seed.

**Prevención:**
- Configurar explícitamente seed de Prisma en `package.json`
- Documentar comandos de seed para diferentes entornos
- Validar que seed funcione correctamente en producción

---

### 3.3 Despliegues Automáticos no Controlados

**Estado:** 🔧 Corregido  
**Código:** `vercel.json` (líneas 8-12)  
**Descripción:** Configuración `"deploymentEnabled": { "main": false }` desactiva despliegues automáticos.

**Prevención:**
- Controlar despliegues mediante configuración explícita de Vercel
- Documentar flujo de despliegue controlado
- Validar que despliegues automáticos estén desactivados para ramas críticas

---

### 3.4 PostgreSQL como Configuración Principal desde Desarrollo

**Estado:** ✅ Validado  
**Código:** `.env` (SQLite local), `.env.example`, `prisma/schema.prisma` (provider: postgresql)  
**Descripción:** El proyecto usa PostgreSQL en producción (Neon.tech) pero SQLite en desarrollo local. Prisma schema tiene provider = "postgresql". Esta discrepancia puede causar errores de sintaxis SQL o tipos incompatibles al desplegar.

**Prevención:**
- Tener presente que el desarrollo local usa SQLite y producción usa PostgreSQL
- Probar migraciones contra PostgreSQL antes de desplegar (usar Neon分支 o base local)
- Verificar que queries funcionan en ambos motores
- Schema.prisma define binaryTargets para Vercel: native, linux-musl-openssl-3.0.x, linux-musl-arm64-openssl-3.0.x, debian-openssl-3.0.x

**Código de ejemplo (.env.development recomendado):**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prompt_db_dev?schema=public"
```

**Código de ejemplo (docker-compose.dev.yml):**
```yaml
services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: prompt_db_dev
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
```

**Riesgo:** Errores de sintaxis SQL específicos de PostgreSQL, tipos de datos incompatibles, migraciones que fallan en producción.

---

### 3.5 Configuración de Prisma Binary Targets

**Estado:** 📝 Información adicional  
**Código:** `prisma/schema.prisma` (líneas 2-4)  
**Descripción:** Generador de Prisma Client incluye `binaryTargets` específicos para entornos Linux musl y Debian.

**Relevancia preventiva:**
- Configurar binary targets apropiados para el entorno de despliegue
- Evitar errores de compatibilidad de Prisma Client en entornos cloud
- Validar que binary targets coincidan con plataforma de producción

---

## 4. Next.js y Build

### 4.1 Error de ESLint en Build por Apóstrofo sin Escapar

**Estado:** 🔧 Corregido  
**Código:** `app/(auth)/auth/signin/page.tsx` (línea 18)  
**Descripción:** ESLint rule `react/no-unescaped-entities` puede romper build.

**Prevención:**
- Escapar caracteres especiales en texto JSX
- Configurar reglas de ESLint apropiadamente para proyectos con texto internacionalizado
- Ejecutar linting como parte del proceso de build

---

### 4.2 Error de Pre-renderizado Estático con NextAuth.js

**Estado:** 🔧 Parcialmente corregido  
**Código:** `app/(auth)/auth/signin/page.tsx` (línea 4), otras páginas  
**Descripción:** NextAuth.js requiere renderizado dinámico cuando se usan sesiones.

**Prevención:**
- Usar `export const dynamic = 'force-dynamic'` en páginas que usan `auth()`
- Validar que todas las páginas con autenticación sean renderizadas dinámicamente
- Documentar requisitos de renderizado para componentes que acceden a sesión

---

### 4.3 Serialización de Fechas de Prisma para Componentes Cliente

**Estado:** ✅ Validado  
**Código:** `app/(app)/prompts/[id]/page.tsx`, `components/prompt/PromptForm.tsx`  
**Descripción:** Prisma retorna objetos `Date` pero Next.js no puede serializarlos automáticamente a componentes cliente. Deben serializarse explícitamente a ISO strings.

**Prevención:**
- Serializar fechas en página server component antes de pasar a componente cliente
- Usar `toISOString()` para conversión estándar
- Interface del componente cliente debe esperar `string`, no `Date`

**Código de ejemplo:**
```typescript
// En página server component
const serializedPrompt = {
  ...prompt,
  createdAt: prompt.createdAt.toISOString(),
  updatedAt: prompt.updatedAt.toISOString(),
}
return <PromptForm prompt={serializedPrompt} ... />
```

```typescript
// En componente cliente
interface PromptFormProps {
  prompt?: {
    createdAt: string  // ✅ string, no Date
    updatedAt: string
  }
}
```

**Riesgo:** Error de build: "Type 'Date' is not assignable to type 'string'".

---

### 4.4 Uso de `output: 'standalone'` en Next.js

**Estado:** 📝 Información adicional  
**Código:** `next.config.js` (línea 7)  
**Descripción:** Next.js configurado para output standalone, generando carpeta autónoma para despliegue en Docker.

**Relevancia preventiva:**
- Usar output standalone para mejorar portabilidad
- Reducir tamaño de imagen Docker
- Validar que configuración de output sea consistente con estrategia de despliegue

---

### 4.5 Configuración de Server Actions con Límite de Tamaño

**Estado:** 📝 Información adicional  
**Código:** `next.config.js` (líneas 12-15)  
**Descripción:** Server Actions configuradas con `bodySizeLimit: '2mb'`.

**Relevancia preventiva:**
- Configurar límites apropiados para payloads
- Prevenir errores de payload grande en formularios

---

### 4.6 `prisma db push` para Desarrollo en Entornos No Interactivos

**Estado:** ✅ Validado  
**Código:** `prisma db push`, GitHub Codespaces  
**Descripción:** `prisma migrate dev` requiere entorno interactivo y falla en GitHub Codespaces, CI/CD, Docker. Usar `prisma db push` para desarrollo en entornos no interactivos.

**Prevención:**
- Usar `prisma db push` en Codespaces, GitHub Actions, Docker
- Usar `prisma migrate deploy` en producción
- `prisma db push` sincroniza schema directamente sin crear archivos de migración

**Comandos:**
```bash
# Desarrollo en Codespaces (no interactivo):
prisma db push

# Producción (con migraciones existentes):
prisma migrate deploy
```

**Riesgo:** Error: "Prisma Migrate has detected that the environment is non-interactive".

---

## 5. Filtros y UI

### 5.1 Multi-Select con Badges + Creación Inline para Campos N:M

**Estado:** ✅ Validado  
**Código:** `components/prompt/PromptForm.tsx`, `app/api/platforms/route.ts`  
**Descripción:** Patrón implementado para Platform multi-select con creación inline. Reutilizable para Client/Project, Use Case, Model Hint.

**Prevención:**
- Verificar existencia de endpoint POST antes de desarrollar UI
- Usar upsert en lugar de create para evitar unique constraint errors
- Aplicar normalización (trim + uppercase) para unicidad
- Incluir handler de teclado (Enter) para mejor UX

**Código de ejemplo (Frontend):**
```typescript
const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(...)

const togglePlatform = (platform: Platform) => {
  if (selectedPlatforms.find((p) => p.id === platform.id)) {
    setSelectedPlatforms(selectedPlatforms.filter((p) => p.id !== platform.id))
  } else {
    setSelectedPlatforms([...selectedPlatforms, platform])
  }
}

const handleCreatePlatform = async () => {
  const response = await fetch('/api/platforms', {
    method: 'POST',
    body: JSON.stringify({ name: newPlatformName }),
  })
  const newPlatform = await response.json()
  setSelectedPlatforms([...selectedPlatforms, newPlatform])
}
```

**Código de ejemplo (Backend):**
```typescript
const normalizedName = data.name.trim().toUpperCase()
const normalizedSlug = normalizedName.toLowerCase()

const platform = await prisma.platform.upsert({
  where: { slug: normalizedSlug },
  update: {},
  create: { name: normalizedName, slug: normalizedSlug },
})
```

**Riesgo:** Duplicados por case, UX inconsistente, errores de unique constraint.

---

### 5.2 Include de Relaciones N:M en Páginas Next.js

**Estado:** ✅ Validado  
**Código:** `app/(app)/prompts/[id]/page.tsx`  
**Descripción:** Para cargar valores seleccionados en edición, es necesario incluir relaciones N:M con include anidado.

**Prevención:**
- Usar `include: { platforms: { include: { platform: true } } }` para relaciones N:M
- Incluir TODAS las relaciones N:M necesarias en el mismo include
- Usar Promise.all para cargar datos en paralelo

**Código de ejemplo:**
```typescript
const [prompt, categories, tags, platforms] = await Promise.all([
  prisma.prompt.findUnique({
    where: { id },
    include: {
      platforms: { include: { platform: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  }),
  prisma.category.findMany({ ... }),
  prisma.tag.findMany({ ... }),
  prisma.platform.findMany({ ... }),
])
```

**Riesgo:** Formulario no recibe valores seleccionados; edición muestra campos vacíos.

---

### 5.3 Verificación de DB antes de Build en Desarrollo

**Estado:** ✅ Validado  
**Código:** `npm run build`, `docker-compose.dev.yml`  
**Descripción:** Next.js build requiere DB disponible para generar páginas estáticas que fetchean datos.

**Prevención:**
- Iniciar PostgreSQL antes de build: `docker-compose -f docker-compose.dev.yml up -d postgres`
- Verificar migrations aplicadas: `npx prisma migrate status`
- Cargar variables de entorno: `set -a && source .env.development && set +a`

**Riesgo:** Build falla con error "The table 'public.X' does not exist".

---

### 5.4 Selector de Idioma con Códigos ISO

**Estado:** ✅ Validado  
**Código:** `components/prompt/PromptForm.tsx`  
**Descripción:** Language field usa `<Select>` con 10 idiomas. El valor guardado en BD es el código (ej. `es`), no el nombre completo (ej. `Español`).

**Lista de Idiomas:**
| Código | Nombre Visible |
|--------|----------------|
| `en` | English |
| `es` | Español |
| `nl` | Nederlands |
| `fr` | Français |
| `de` | Deutsch |
| `pt` | Português |
| `it` | Italiano |
| `catalan/valenciano` | Català/Valencià |
| `vasco` | Euskara |
| `gallego` | Galego |

**Prevención:**
- Usar `<Select>` de shadcn/ui en lugar de input de texto
- Default: `es` (Español)
- Valores del SelectItem: códigos (se guardan en BD)
- Contenido de SelectItem: nombres completos (se muestran al usuario)

**Código de ejemplo:**
```typescript
<Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="en">English</SelectItem>
    <SelectItem value="es">Español</SelectItem>
    <SelectItem value="nl">Nederlands</SelectItem>
    <SelectItem value="fr">Français</SelectItem>
    <SelectItem value="de">Deutsch</SelectItem>
    <SelectItem value="pt">Português</SelectItem>
    <SelectItem value="it">Italiano</SelectItem>
    <SelectItem value="catalan/valenciano">Català/Valencià</SelectItem>
    <SelectItem value="vasco">Euskara</SelectItem>
    <SelectItem value="gallego">Galego</SelectItem>
  </SelectContent>
</Select>
```

**Riesgo:** Inconsistencia en valores guardados, dificultad para filtrar/agrupar por idioma.

---

### 5.5 Enum de Idiomas Inclusivo desde el Inicio

**Estado:** ✅ Validado  
**Código:** `app/api/prompts/route.ts`, `app/api/prompts/[id]/route.ts`  
**Descripción:** Incluir TODOS los idiomas requeridos (incluyendo regionales) desde el inicio evita refactor posterior. Ampliar enum después requiere migración de datos.

**Prevención:**
- Consultar con usuario TODOS los idiomas requeridos ANTES de implementar
- Incluir idiomas regionales desde el inicio (catalán/valenciano, vasco, gallego, etc.)
- Usar nombres correctos con acentos y formatos apropiados
- Usar `.default("es")` para español como idioma por defecto

---

### 5.6 Patrón de Navegación Condicional en Next.js App Router

**Estado:** ✅ Validado  
**Código:** `components/prompt/PromptForm.tsx`, `app/api/prompts/route.ts`  
**Descripción:** Next.js 14 App Router usa `router.push()` para navegación y `router.refresh()` para recargar datos del server. El patrón correcto depende del modo.

**Prevención:**
- **Modo create**: Usar `router.push(`/prompts/${id}`)` sin `router.refresh()`
- **Modo edit**: Usar solo `router.refresh()` sin `router.push()`
- **API debe retornar**: `{ data: { id: string } }` para permitir redirección post-create
- **Incluir fallback**: Siempre incluir fallback a `/prompts` por si `result.data?.id` es undefined

**Código de ejemplo:**
```typescript
// Create mode:
if (response.ok) {
  const result = await response.json()
  if (!prompt && result.data?.id) {
    router.push(`/prompts/${result.data.id}`)
  } else {
    router.refresh()
  }
}

// Duplicate mode:
if (response.ok) {
  const result = await response.json()
  if (result.data?.id) {
    router.push(`/prompts/${result.data.id}`)
  } else {
    router.push("/prompts")
  }
}

// Edit mode:
if (response.ok) {
  router.refresh()  // Solo recargar, permanece en /prompts/[id]
}
```

**Riesgo:** Navegación incorrecta expulsa al usuario del contexto; race conditions entre `router.push()` y `router.refresh()`.

---

### 5.7 Toggle de Vista con Persistencia de Preferencia

**Estado:** ✅ Validado  
**Código:** `components/prompt/ViewToggle.tsx`, `app/api/user/preferences/route.ts`, `app/(app)/prompts/page.tsx`  
**Descripción:** Patrón implementado para toggle de vista (cards/lista) con persistencia en base de datos.

**Prevención:**
- Componente cliente debe usar `useState` para tracking local + `useTransition` para pending state
- API endpoint debe validar con Zod (`z.enum(["cards", "list"])`)
- Endpoint debe requerir autenticación (`auth()` de NextAuth.js)
- Server component debe leer preferencia con fallback seguro ("cards" por defecto)
- Revertir a modo anterior si fetch falla

**Código de ejemplo (Frontend - ViewToggle.tsx):**
```typescript
"use client"

export function ViewToggle({ initialViewMode }: ViewToggleProps) {
  const [viewMode, setViewMode] = useState<"cards" | "list">(initialViewMode)
  const [isPending, startTransition] = useTransition()

  const handleViewChange = async (mode: "cards" | "list") => {
    startTransition(async () => {
      setViewMode(mode)
      try {
        await fetch('/api/user/preferences', {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptListViewPreference: mode }),
        })
      } catch (error) {
        console.error("Failed to update view preference:", error)
        setViewMode(viewMode) // Revert on error
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant={viewMode === "cards" ? "default" : "ghost"}
        onClick={() => handleViewChange("cards")}
        disabled={isPending || viewMode === "cards"}>
        Cards
      </Button>
      <Button variant={viewMode === "list" ? "default" : "ghost"}
        onClick={() => handleViewChange("list")}
        disabled={isPending || viewMode === "list"}>
        List
      </Button>
    </div>
  )
}
```

**Código de ejemplo (API):**
```typescript
const updatePreferencesSchema = z.object({
  promptListViewPreference: z.enum(["cards", "list"]),
})

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await request.json()
  const data = updatePreferencesSchema.parse(body)
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { promptListViewPreference: data.promptListViewPreference },
    select: { promptListViewPreference: true },
  })
  return NextResponse.json({ data: user })
}
```

**Código de ejemplo (Server Component):**
```typescript
async function getUserViewPreference(): Promise<"cards" | "list"> {
  const session = await auth()
  if (!session?.user?.id) return "cards" // Fallback seguro
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { promptListViewPreference: true },
  })
  return user?.promptListViewPreference || "cards"
}

const viewMode = await getUserViewPreference()
return <ViewToggle initialViewMode={viewMode} />
```

**Riesgo:** Preferencia no persiste entre recargas; usuario no autenticado causa errores; sin feedback visual.

---

### 5.8 Render Condicional Cards/Lista con Relaciones N:M

**Estado:** ✅ Validado  
**Código:** `components/prompt/PromptList.tsx`  
**Descripción:** PromptList reescrito para soportar ambas vistas (cards y lista) con render condicional.

**Prevención:**
- Server component debe incluir relaciones N:M: `include: { platforms: { include: { platform: true } }, categories: { include: { category: true } } }`
- Componente debe manejar ambos formatos: campo legacy y relación N:M
- Usar chequeos de existencia (`prompt.platforms && prompt.platforms.length > 0`)

**Código de ejemplo (Server Component - includes N:M):**
```typescript
const prompts = await prisma.prompt.findMany({
  include: {
    platforms: { include: { platform: true } },
    categories: { include: { category: true } },
    clientProjects: { include: { clientProject: true } },
    tags: { include: { tag: true } },
  },
  orderBy: { createdAt: 'desc' },
})
```

**Código de ejemplo (Render condicional de plataformas):**
```typescript
{prompt.platforms && prompt.platforms.length > 0 ? (
  prompt.platforms.map((pp) => <Badge key={pp.platform.name}>{pp.platform.name}</Badge>)
) : (
  <Badge>{prompt.platform}</Badge> // Fallback a campo legacy
)}
```

**Riesgo:** Datos incompletos en vista lista; error "Cannot read properties of undefined" si relaciones no están incluidas.

---

### 5.9 Multi-Select con Checkboxes y URL-Driven State

**Estado:** ✅ Validado  
**Código:** `components/prompt/PromptFilters.tsx`  
**Descripción:** PromptFilters.tsx usa función genérica `toggleFilter(key, value)` con `params.append()` y `params.getAll()` para manejar arrays en URL.

**Prevención:**
- Usar función genérica `toggleFilter(key, value)` para todos los filtros
- Usar `params.append()` para añadir múltiples valores del mismo parámetro
- Usar `params.getAll()` para leer todos los valores de un parámetro
- Mantener estado en URL, no en estado local
- Al eliminar un valor, reconstruir array con `filter()` y `forEach()` con `params.append()`

**Código de ejemplo (toggleFilter genérico):**
```typescript
const toggleFilter = (key: string, value: string) => {
  const params = new URLSearchParams(searchParams.toString())
  const currentValues = params.getAll(key)

  if (currentValues.includes(value)) {
    params.delete(key)
    currentValues.filter((v) => v !== value).forEach((v) => params.append(key, v))
  } else {
    params.append(key, value)
  }

  router.push(`/prompts?${params.toString()}`)
}
```

**Código de ejemplo (Render de checkboxes):**
```typescript
{platforms.map((platform) => (
  <label key={platform.id} className="flex items-center gap-2">
    <input type="checkbox"
      checked={selectedPlatformIds.includes(platform.id)}
      onChange={() => toggleFilter("platformIds", platform.id)}
    />
    {platform.name}
  </label>
))}
```

**Riesgo:** Estado no persiste en URL; filtros se pierden al recargar.

---

### 5.10 Lógica OR con `some` en Prisma para Filtros Multi-Selección

**Estado:** ✅ Validado  
**Código:** `app/(app)/prompts/page.tsx`, `app/api/prompts/route.ts`  
**Descripción:** Para filtros multi-selección con lógica OR (prompt debe tener AL MENOS UNA de las categorías seleccionadas), usar `some` en el where clause de Prisma.

**Prevención:**
- Usar `some` con `in` para filtros multi-selección con lógica OR
- Si se necesitara lógica AND en futuro, usar `every` en lugar de `some`
- Combinar con `in` para verificar múltiples IDs: `some: { platformId: { in: platformIds } }`

**Código de ejemplo (Lógica OR):**
```typescript
if (platformIds && platformIds.length > 0) {
  where.platforms = {
    some: { platformId: { in: platformIds } }
  }
}

if (categoryIds && categoryIds.length > 0) {
  where.categories = {
    some: { categoryId: { in: categoryIds } }
  }
}
```

**Riesgo:** Si en futuro se necesita lógica AND, usar `some` daría resultados incorrectos.

---

### 5.11 Parseo de Arrays desde searchParams en Server Components

**Estado:** ✅ Validado  
**Código:** `app/(app)/prompts/page.tsx`  
**Descripción:** searchParams en Next.js puede devolver `string` o `string[]`. Se necesita utilitario para convertir a array consistente.

**Prevención:**
- Usar patrón condicional: `Array.isArray(x) ? x : x ? [x] : []`
- Aplicar para todos los parámetros que pueden ser arrays
- Validar casos: URL sin parámetro, con un valor, con múltiples valores

**Código de ejemplo:**
```typescript
const platformIds = Array.isArray(searchParams.platformIds)
  ? searchParams.platformIds
  : searchParams.platformIds
  ? [searchParams.platformIds]
  : []

const categoryIds = Array.isArray(searchParams.categoryIds)
  ? searchParams.categoryIds
  : searchParams.categoryIds
  ? [searchParams.categoryIds]
  : []
```

**Riesgo:** Error de tipo en tiempo de ejecución; filtros no funcionan con múltiples valores.

---

## 6. Seguridad y Autorización

### 6.1 Auth Check como PRIMERA Operación en API Routes

**Estado:** ✅ Validado  
**Código:** `app/api/export/prompts/route.ts`  
**Descripción:** El auth check debe ejecutarse ANTES de cualquier acceso a base de datos para prevenir exposición de datos sensibles.

**Prevención:**
- Importar `auth()` desde `@/lib/auth` al inicio del archivo
- Ejecutar `const session = await auth()` como PRIMERA línea dentro del handler
- Retornar 401 inmediatamente si `!session?.user?.id`
- Nunca acceder a prisma antes de verificar autenticación

**Código de ejemplo:**
```typescript
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Auth check como PRIMERA operación
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    // AHORA SÍ: acceso a DB con userId verificado
    const prompts = await prisma.prompt.findMany({
      where: { userId: userId }
    })
  }
}
```

**Riesgo:** CRÍTICO - Exposición de datos sensibles de todos los usuarios; vulnerabilidad de seguridad grave.

---

### 6.2 Filtrado por userId en Queries Multi-Usuario

**Estado:** ✅ Validado  
**Código:** `app/api/export/prompts/route.ts`  
**Descripción:** Todas las queries que leen datos deben filtrar por `userId` del usuario autenticado para garantizar aislamiento de datos entre usuarios.

**Prevención:**
- Siempre usar `where: { userId: session.user.id }` en queries de lectura
- Nunca hacer `findMany()` o `findUnique()` sin filtrar por userId (excepto admin)
- Para endpoints de export/list/search, el filtrado es OBLIGATORIO

**Código de ejemplo:**
```typescript
const prompts = await prisma.prompt.findMany({
  where: {
    userId: userId,  // CRÍTICO: aislamiento de datos
  },
  include: { ... },
})
```

**Riesgo:** CRÍTICO - Usuarios pueden ver datos de otros usuarios; violación de privacidad.

---

### 6.3 Verificación de Endpoints de Creación (D-06)

**Estado:** ✅ Validado  
**Código:** `app/api/platforms/route.ts`, `app/api/client-projects/route.ts`, `app/api/use-cases/route.ts`, `app/api/model-hints/route.ts`  
**Descripción:** Los endpoints de creación de valores globales deben implementar: (1) auth check como primera operación, (2) normalización de nombres (trim + uppercase), (3) upsert por slug para garantizar unicidad.

**Prevención:**
- Auth check usando `auth()` como primera operación
- Normalización: `name.trim().toUpperCase()` para nombres, `.toLowerCase()` para slugs
- Upsert por slug: `prisma.entity.upsert({ where: { slug }, update: {}, create: { ... } })`
- Zod validation estricta para el input

**Código de ejemplo:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createSchema.parse(body)

    // Normalización: trim + uppercase
    const normalizedName = data.name.trim().toUpperCase()
    const normalizedSlug = normalizedName.toLowerCase()

    // Upsert para evitar duplicados (unicidad por slug)
    const entity = await prisma.entity.upsert({
      where: { slug: normalizedSlug },
      update: {},
      create: { name: normalizedName, slug: normalizedSlug },
    })

    return NextResponse.json({ data: entity }, { status: 201 })
  } catch (error) {
    // ... error handling
  }
}
```

**Riesgo:** Duplicados por case ("GPT-4" vs "gpt-4"); creación de valores sin autenticación.

---

## 7. Testing

### 7.1 Verificar Baseline de Tests Antes de Añadir Nuevos

**Estado:** ✅ Validado  
**Código:** `npm test`, `npm test -- --listTests`, `npm test -- --coverage`  
**Descripción:** Antes de añadir tests nuevos, ejecutar `npm test` para verificar que tests existentes pasan, infraestructura funciona, y no hay regresiones. Actualmente (julio 2026): 56 tests, 8 suites, 100% passing.

**Prevención:**
- Ejecutar `npm test -- --listTests` para ver qué tests existen
- Ejecutar `npm test` para verificar tests existentes pasan
- Ejecutar `npm test -- --coverage` para verificar cobertura base
- Documentar tests fallidos pre-existentes para no confundirlos con fallos nuevos

**Comandos de referencia:**
```bash
# Listar todos los tests existentes
npm test -- --listTests

# Ejecutar tests existentes
npm test

# Verificar cobertura base
npm test -- --coverage
```

**Riesgo:** Tests nuevos pueden romper tests existentes sin detección; falsa sensación de cobertura.

---

### 7.2 Planificación Detallada Antes de Implementación de Tests

**Estado:** ✅ Validado  
**Descripción:** Crear un plan de acción detallado antes de implementar tests permite identificar qué tests se necesitan, definir criterios de aceptación medibles, estimar esfuerzo y evitar duplicación.

**Prevención:**
- Documentar cada archivo de test a crear
- Especificar tests individuales con descripciones claras
- Definir criterios de aceptación medibles (ej: >= 60% cobertura)
- Identificar dependencias y mocks necesarios

**Riesgo:** Tests incompletos; cobertura insuficiente; duplicación de trabajo.

---

### 7.3 Documentar Tests Fallidos Pre-Existentes

**Estado:** ✅ Validado  
**Descripción:** Los tests fallidos pre-existentes deben documentarse para no confundirlos con fallos nuevos, planificar su corrección en Sprint futuro, y evitar deuda técnica de testing.

**Prevención:**
- Identificar tests fallidos al inicio del Sprint
- Documentar causa raíz de cada fallo
- Registrar en informe de Sprint como "pre-existente"
- Planificar corrección en Sprint futuro

**Riesgo:** Deuda técnica de testing se acumula; nuevos desarrolladores confunden fallos pre-existentes con regresiones.

---

### 7.4 Mock de Prisma con $transaction

**Estado:** ✅ Validado (con limitaciones)  
**Código:** `tests/api/prompts-[id].test.ts`, `tests/api/prompts.test.ts`  
**Descripción:** Para mockear Prisma.$transaction con función, el mock debe ejecutar la función y retornar su resultado. Mock simple que retorna valor fijo no funciona para tests que dependen del resultado.

**Prevención:**
- Mockear $transaction como: `$transaction: jest.fn(async (fn) => await fn(mockTx))`
- Proporcionar mock de transaction object (`mockTx`) con todos los métodos necesarios
- Asegurar que la función se ejecuta asíncronamente
- Verificar que el resultado de la transacción se retorna correctamente

**Código de referencia:**
```typescript
// Mock de transaction
const mockTx = {
  prompt: { update: jest.fn().mockResolvedValue(mockUpdatedPrompt) },
  promptTag: { deleteMany: jest.fn() },
  promptCategory: { deleteMany: jest.fn() },
  promptPlatform: { deleteMany: jest.fn() },
  promptClientProject: { deleteMany: jest.fn() },
  promptUseCase: { deleteMany: jest.fn() },
  promptModelHint: { deleteMany: jest.fn() },
}

// Mock de $transaction que ejecuta la función
;(prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
  return await fn(mockTx)
})

// En test verificar:
expect(prisma.$transaction).toHaveBeenCalled()
expect(mockTx.promptTag.deleteMany).toHaveBeenCalledWith(/* ... */)
```

**Riesgo:** Tests de operaciones con transacciones fallan incorrectamente.

---

### 7.5 Zod Validation Requiere Datos Completos en Tests

**Estado:** ✅ Validado  
**Código:** `tests/api/import.test.ts`, `tests/api/export.test.ts`  
**Descripción:** Los schemas de Zod en API routes validan estrictamente los datos de entrada. Tests que envían datos incompletos fallan con 400 Bad Request, no prueban la lógica de negocio.

**Prevención:**
- Inspeccionar Zod schema antes de escribir tests
- Incluir TODOS los campos requeridos en los datos de test
- Usar datos realistas que pasarían validación en producción
- Separar tests de validación (400) de tests de lógica de negocio (200)

**Riesgo:** Tests fallan por validación en lugar de probar lógica de negocio.

---

### 7.6 URLSearchParams No Se Puede Mockear Globalmente

**Estado:** ✅ Validado  
**Código:** `tests/components/PromptFilters.test.tsx`  
**Descripción:** Inicialmente se intentó mockear URLSearchParams con jest.mock en jest.setup.js, lo que causó problemas. La solución actual reemplaza global.URLSearchParams directamente con un mock manual en cada test.

**Prevención:**
- No usar jest.mock para URLSearchParams en jest.setup.js (no intercepta instancias)
- Reemplazar global.URLSearchParams directamente con mock manual en cada test
- El mock debe implementar getAll, toString, delete, append, set

**Código de referencia:**
```typescript
global.URLSearchParams = jest.fn(() => ({
  getAll: mockGetAll,
  toString: mockToString,
  delete: mockDelete,
  append: mockAppend,
  set: mockSet,
})) as any
```

**Riesgo:** Tests de componentes que usan URLSearchParams fallan inconsistentemente.

---

### 7.7 Mocks de Entity Upsert Deben Retornar Estructura Completa

**Estado:** ✅ Validado  
**Código:** `tests/api/import.test.ts`  
**Descripción:** Mocks de upsert/findFirst para entidades (platform, category, tag, etc.) deben retornar estructura completa con todos los campos que el código de producción espera (id, name, slug).

**Prevención:**
- Inspeccionar código de producción para identificar TODOS los campos usados después del upsert
- Mockear upsert con todos los campos: `{ id: "...", name: "...", slug: "..." }`
- Incluir al menos `id` y `name` como mínimo (campos más comúnmente accedidos)

**Código de referencia:**
```typescript
// Mock de upsert debe retornar entidad completa:
;(prisma.platform.upsert as jest.Mock).mockResolvedValue({
  id: "platform-1",
  name: "CHATGPT",
  slug: "chatgpt",  // ✅ Campo requerido por código de producción
})

// Mock de findFirst también debe retornar estructura completa:
;(prisma.platform.findFirst as jest.Mock).mockResolvedValue({
  id: "platform-1",
  name: "CHATGPT",
  slug: "chatgpt",
})
```

**Riesgo:** Tests fallan con "Cannot read properties of undefined (reading 'id')".

---

### 7.8 Cobertura ≥ 60% es Alcanzable con Mocks Parciales

**Estado:** ✅ Validado  
**Código:** `tests/api/*.test.ts`, `tests/components/*.test.tsx`  
**Descripción:** No es necesario tener 100% de tests passing para alcanzar ≥ 60% de cobertura. Actualmente (julio 2026) hay 56 tests con 100% passing.

**Prevención:**
- Priorizar cobertura de flujos críticos sobre perfección de mocks
- Aceptar que algunos tests pueden fallar por complejidad de mocks (no por bugs)
- Documentar tests fallando como "refinamientos pendientes" (no bugs de producción)
- Validar que cobertura ≥ 60% en archivos objetivo es suficiente para continuar

---

### 7.9 Tests con Mocks de Relaciones N:M

**Estado:** ✅ Validado  
**Código:** `tests/components/PromptList.test.tsx`  
**Descripción:** Los tests de componentes que consumen relaciones N:M deben incluir mocks completos con la estructura anidada correcta.

**Prevención:**
- Mocks deben incluir arrays de relaciones: `platforms: [{ platform: { name: "CURSOR" } }]`
- Mocks deben incluir `categories: [{ category: { name: "Coding" } }]`
- Mocks deben incluir `clientProjects: []` (vacío si no aplica)
- Mocks deben incluir `user: { name: "Test User" }` si se muestra el autor

**Código de ejemplo (Mock completo):**
```typescript
const mockPrompts = [
  {
    id: "1",
    title: "Test Prompt 1",
    description: "Test description",
    platform: "CURSOR",
    status: "PRODUCTION",
    isFavorite: true,
    lastUsedAt: new Date().toISOString(),
    usageCount: 5,
    platforms: [{ platform: { name: "CURSOR" } }],
    categories: [{ category: { name: "Coding" } }],
    clientProjects: [],
    tags: [{ tag: { name: "refactoring" } }],
    user: { name: "Test User" },
    body: "Test prompt body",
  },
]
```

**Riesgo:** Tests fallan con "Cannot read properties of undefined (reading 'length')".

---

### 7.10 M-01: Mock Faltante `findUnique` en category/tag (CRÍTICO)

**Estado:** 🔧 Corregido  
**Código:** `tests/api/import.test.ts`  
**Descripción:** La función `upsertEntity` usa un switch con 4 casos: `platform`, `clientProject`, `useCase`, `modelHint`. Cada caso ejecuta `prisma.<entidad>.create()`. El test mockeaba `create` con `jest.fn()` sin valor de retorno, por lo que `created` era `undefined` y `created.id` fallaba con `TypeError`. Además, los mocks de `category` y `tag` tenían `findFirst`, `create` y `upsert` pero faltaba `findUnique`.

**Prevención:**
- Leer el handler completo y listar TODOS los métodos Prisma usados por entidad antes de escribir mocks
- Checklist: findFirst, findUnique, findMany, create, update, upsert, delete, deleteMany
- Mock `create` siempre debe retornar `{ id: "..." }`, no `jest.fn()` sin valor

**Código de referencia:**
```typescript
// CORRECTO: create con valor de retorno
platform: {
  findFirst: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({ id: "platform-1" }),
},
category: {
  findFirst: jest.fn().mockResolvedValue(null),
  findUnique: jest.fn().mockResolvedValue(null),  // ← obligatorio
  create: jest.fn().mockResolvedValue({ id: "cat-1" }),
  update: jest.fn().mockResolvedValue({ id: "cat-1" }),
}
```

**Riesgo:** TypeError: Cannot read properties of undefined (reading 'id').

---

### 7.11 Error 1: Botón Condicional No Encontrado en Test

**Estado:** 🔧 Corregido  
**Código:** `components/prompt/PromptFilters.tsx`, `tests/components/PromptFilters.test.tsx`  
**Descripción:** `screen.getByRole("button", { name: /clear filters/i })` no encontraba el botón "Clear filters" porque el botón es condicional — solo se renderiza cuando `initialFilters` tiene valores activos. El test no pasaba `initialFilters` con datos.

**Prevención:**
- Verificar la condición de renderizado del componente ANTES de escribir la query del test
- Si el elemento es condicional, proporcionar los props/estado necesarios para que se renderice
- Usar `getByRole` con `name` regex en lugar de `getByText` para botones con iconos

**Código de referencia:**
```typescript
// Proporcionar initialFilters activos para que el botón se renderice
render(<PromptFilters
  initialFilters={{ platformIds: "plat-1", categoryIds: "cat-1", tagIds: "tag-1" }}
  {...defaultProps}
/>)
const clearButton = screen.getByRole("button", { name: /clear filters/i })
```

**Riesgo:** Elemento no encontrado en test; falsos negativos.

---

### 7.12 Error 2: Expectativa Incorrecta en clearFilters

**Estado:** 🔧 Corregido  
**Código:** `tests/components/PromptFilters.test.tsx`  
**Descripción:** Se asumió que `clearFilters()` usaba `delete()` en searchParams, pero en realidad usaba `router.push("/prompts")`. El test esperaba `expect(mockDelete).toHaveBeenCalled()` pero fallaba.

**Prevención:**
- Leer la implementación real de la función ANTES de escribir la aserción
- No asumir el comportamiento interno de funciones basándose en su nombre
- Verificar la implementación con `explore` o lectura directa

**Código de referencia:**
```typescript
// CORRECTO: clearFilters() navega a /prompts
expect(mockPush).toHaveBeenCalledWith("/prompts")
```

**Riesgo:** Tests fallan por asunciones incorrectas sobre la implementación.

---

### 7.13 Error 3: Prop `placeholder` Inexistente en MetadataSegment

**Estado:** 🔧 Corregido  
**Código:** `components/prompt/MetadataSegment.tsx`  
**Descripción:** Se usó una prop `placeholder` en el JSX que no estaba definida en la interfaz del componente `MetadataSegmentProps`. TypeScript no detectó el error porque la prop se pasaba a un componente hijo que sí la aceptaba, pero rompía la interfaz del segmento.

**Prevención:**
- Verificar que TODAS las props usadas en JSX estén definidas en la interfaz del componente
- Ejecutar `npx tsc --noEmit` después de cambios para detectar props no declaradas
- Revisar interfaces después de refactors que involucran segmentos extraídos

**Riesgo:** Error de TypeScript en build; prop no declarada en interfaz.

---

### 7.14 Error 4: Dos Tareas Modificando el Mismo Archivo en Batches Separados

**Estado:** 🔧 Corregido  
**Código:** `components/prompt/PromptFilters.tsx`  
**Descripción:** P1c (añadir `aria-label`) y P2 (eliminar imports no usados) modificaban el mismo archivo `PromptFilters.tsx` en batches separados. Esto creaba riesgo de conflicto de merge y obligaba a resolver solapamientos manualmente.

**Prevención:**
- Mapear archivos × tareas ANTES de definir batches de ejecución
- Si dos tareas tocan el mismo archivo, fusionarlas en el MISMO batch
- Usar un "file collision map" antes de planificar subtareas

**Riesgo:** Merge conflicts; cambios que se pisan entre sí; retrabajo.

---

## 8. Export/Import

### 8.1 Transformación de Relaciones N:M a Arrays de Nombres para Export

**Estado:** ✅ Validado  
**Código:** `app/api/export/prompts/route.ts`  
**Descripción:** Para exportación JSON, transformar relaciones N:M a arrays simples de nombres usando `.map()` sobre relaciones anidadas.

**Prevención:**
- Usar include anidado: `{ platforms: { include: { platform: true } } }`
- Transformar con `.map()`: `platforms: prompt.platforms.map((pp) => pp.platform.name)`
- Aplicar mismo patrón para todas las relaciones N:M

**Código de ejemplo:**
```typescript
// Include anidado
include: {
  platforms: { include: { platform: true } },
  categories: { include: { category: true } },
  clientProjects: { include: { clientProject: true } },
  useCases: { include: { useCase: true } },
  modelHints: { include: { modelHint: true } },
  tags: { include: { tag: true } },
}

// Transformación a arrays de nombres
platforms: prompt.platforms.map((pp) => pp.platform.name),
categories: prompt.categories.map((pc) => pc.category.name),
clientProjects: prompt.clientProjects.map((cp) => cp.clientProject.name),
useCases: prompt.useCases.map((uc) => uc.useCase.name),
modelHints: prompt.modelHints.map((mh) => mh.modelHint.name),
tags: prompt.tags.map((pt) => pt.tag.name),
```

**Riesgo:** JSON incluye objetos complejos en lugar de nombres simples; import no puede procesar.

---

### 8.2 Campos Legacy para Compatibilidad durante Transición

**Estado:** ✅ Validado  
**Código:** `app/api/export/prompts/route.ts`  
**Descripción:** Mantener campos legacy en el formato de exportación para permitir compatibilidad con imports antiguos durante transición de schema (string simple → relaciones N:M).

**Prevención:**
- Incluir campos legacy en el JSON exportado junto a nuevos campos N:M
- Campos legacy para F4: `platform`, `clientOrProject`, `useCase`, `modelHint`
- NO incluir campos que ya no existen en schema (ej: `categoryId` eliminado en SF-1.3)

**Código de ejemplo:**
```typescript
{
  // Nuevos campos N:M (formato v2.0)
  platforms: prompt.platforms.map((pp) => pp.platform.name),
  categories: prompt.categories.map((pc) => pc.category.name),

  // Campos legacy (compatibilidad con imports antiguos)
  platform: prompt.platform,         // String simple (puede ser null)
  clientOrProject: prompt.clientOrProject,
  useCase: prompt.useCase,
  modelHint: prompt.modelHint,
}
```

**Riesgo:** Imports antiguos dejan de funcionar; ruptura de compatibilidad.

---

## 9. Patrones Comunes y Lecciones Generales

### 9.1 Validación de Configuración

**Estado:** ✅ Validado  
**Descripción:** El código muestra uso de variables de entorno para configuración flexible, pero no hay validación automática.

**Prevención:**
- Validar todas las variables de entorno requeridas antes del despliegue
- Verificar formato de URLs (postgresql://, https://)
- Crear backup de archivos críticos (.env, package.json) antes de modificaciones

---

### 9.2 Desarrollo Balanceado

**Estado:** ✅ Validado  
**Descripción:** Backend implementado sin frontend correspondiente crea funcionalidad incompleta.

**Prevención:**
- Planificar desarrollo frontend/backend en paralelo
- Validar que cada endpoint API tenga su correspondiente interfaz de usuario
- Documentar funcionalidades incompletas explícitamente

---

### 9.3 Pruebas de Flujos Críticos

**Estado:** ✅ Validado  
**Descripción:** Existen tests para API y componentes, pero no se verifica cobertura completa.

**Prevención:**
- Implementar pruebas end-to-end para flujos críticos (autenticación, CRUD)
- Validar cobertura de tests para código sensible
- Automatizar pruebas en pipeline de CI/CD

---

### 9.4 Middleware Sensible

**Estado:** ✅ Validado  
**Descripción:** Middleware actual maneja autenticación correctamente, con logs limitados.

**Prevención:**
- Implementar logging estructurado en middleware
- Validar que middleware maneje correctamente todos los casos de error
- Documentar decisiones de diseño del middleware

---

### 9.5 Cache y Dependencias en Plataformas Cloud

**Estado:** ✅ Validado  
**Descripción:** Script postinstall mitiga cache de Vercel.

**Prevención:**
- Incluir scripts postinstall para regenerar dependencias sensibles
- Considerar cache de build en diferentes plataformas cloud
- Validar que dependencias estén actualizadas en producción

---

### 9.6 Configuración Explícita vs Implícita

**Estado:** ✅ Validado  
**Descripción:** Configuración explícita de seed presente en package.json.

**Prevención:**
- Preferir configuración explícita sobre implícita
- Documentar todas las configuraciones requeridas
- Validar que configuraciones estén presentes en todos los entornos

---

### 9.7 Relación de Categorías Recursiva

**Estado:** 📝 Información adicional  
**Código:** `prisma/schema.prisma:107-108` (parent/children relation)  
**Descripción:** Modelo `Category` tiene relación consigo mismo (`parent`, `children`) para árboles de categorías.

**Relevancia preventiva:**
- Considerar relaciones recursivas en diseño de esquema
- Documentar estructuras de datos complejas
- Validar que UI soporte relaciones recursivas

---

## 10. Checklist de Prevención

### Configuración y Variables
- [ ] Validar todas las variables de entorno requeridas antes del despliegue
- [ ] Verificar formato de URLs (postgresql://, https://)
- [ ] Crear backup de archivos críticos (.env, package.json) antes de modificaciones

### Prisma y Base de Datos
- [ ] Usar `@@id([campo1, campo2])` para junction tables N:M
- [ ] Envolver updates de múltiples relaciones en `$transaction`
- [ ] Delete todas las relaciones antes de crear nuevas
- [ ] Incluir TODAS las junction tables en la transacción
- [ ] Usar `upsert` para crear/obtener entidades (evita errores unique constraint)
- [ ] Normalizar nombres (trim + uppercase) antes de upsert
- [ ] Campos nullable en TypeScript: `Type | null`
- [ ] Null coalescing (`??`) para campos no nullable con datos externos
- [ ] Switch statement en lugar de `as any` para acceso dinámico a Prisma
- [ ] Usar `prisma db push` en entornos no interactivos
- [ ] `prisma migrate deploy` en producción (no `migrate dev`)
- [ ] Script `postinstall: "prisma generate"` en package.json
- [ ] Configurar seed de Prisma explícitamente
- [ ] Validar conexión a BD antes de migraciones

### Autenticación y Seguridad
- [ ] Auth check como PRIMERA operación en handlers
- [ ] Filtrar queries por `userId` en endpoints multi-usuario
- [ ] Probar middleware con diferentes estados de sesión
- [ ] Implementar logging para errores de autenticación
- [ ] Crear páginas de error para todos los flujos de auth
- [ ] Revisar que todas las custom pages de NextAuth.js existan
- [ ] Protección de rutas con enfoque "deny-all"

### Desarrollo de APIs
- [ ] Incluir campos legacy como opcionales durante transición de schema
- [ ] Transformar relaciones N:M a arrays de nombres en export
- [ ] Zod validation estricta en cada endpoint
- [ ] Mantener compatibilidad dual entre formatos legacy y N:M
- [ ] Verificar consistencia de basePath entre entornos

### Testing
- [ ] Ejecutar `npm test` antes de añadir tests nuevos
- [ ] Documentar tests fallidos pre-existentes
- [ ] Mock de $transaction debe ejecutar fn(mockTx)
- [ ] Incluir TODOS los campos requeridos en datos de test
- [ ] Mock de URLSearchParams: reemplazar global.URLSearchParams, no jest.mock
- [ ] Mock de upsert con estructura completa (id, name, slug)
- [ ] Mock de relaciones N:M con arrays anidados completos

### UI y Filtros
- [ ] ToggleFilter genérico con params.append/getAll para arrays en URL
- [ ] Lógica OR con `some` (cambiar a `every` si se necesita AND)
- [ ] Parseo de searchParams: `Array.isArray(x) ? x : x ? [x] : []`
- [ ] Serializar fechas a ISO string antes de pasar a componentes cliente
- [ ] Router.push() para create, router.refresh() para edit
- [ ] ViewToggle con useTransition y fallback "cards"

---

## 11. Historial de Cambios

| Fecha | Cambio | Responsable |
|-------|--------|-------------|
| 2026-07-16 | Creación inicial desde tech-knowledge.md del proyecto | Repo Manager |
| 2026-04-25 | Última actualización de fuente original (Fase 4 COMPLETADA, SF-5.1 ✅, SF-5.2 ✅ Build+Lint) | agente-inventariador |
| 2026-04-24 | Añadido Selector de Idioma con Códigos ISO (SF-2.1-S2) | agente-inventariador |
| 2026-04-24 | Añadidos Multi-Select con Badges + Creación Inline, Include de Relaciones N:M, Verificación DB (SF-2.1-S1) | agente-inventariador |
| 2026-04-24 | Añadidos IDs compuestos, migración String→N:M, seed con relaciones múltiples, campos nullable (SF-1.3-S1) | agente-inventariador |
| 2026-04-20 | Creación inicial basada en DOC-RECOPILATORIO | agente-orquestador |

---

> **Nota final:** Este documento es la fuente detallada de conocimiento preventivo. Para resumen de alto nivel, consultar `technical-domain.md` → Known Pitfalls. Cualquier discrepancia entre este documento y el código debe resolverse a favor del código como fuente de verdad definitiva.
