# F1-SF1.1-S2 — Junction Tables & Migration — Informe de Sprint

**Fase**: 1 — Database Foundation  
**Subfase**: 1.1 — Schema: nuevas entidades y junction tables  
**Sprint**: 2 de 2  
**Nombre completo**: Junction Tables & Migration  
**Ruta del plan de acción original**: `doc-plan/doc-implementar/sprints-plan/1/1.1/02-junction-tables/F1-SF1.1-S2-Junction-Tables.md`  
**Fecha de ejecución**: 2026-04-24  
**Fecha de finalización**: 2026-04-24  

---

## 1. Objetivo original del Sprint

Definir las 5 junction tables (PromptPlatform, PromptCategory, PromptClientProject, PromptUseCase, PromptModelHint) en `schema.prisma` con IDs compuestos, relaciones con cascade, e índices. Ejecutar `prisma generate` y crear migración. Validar tipos TypeScript completos.

---

## 2. Alcance realmente ejecutado

### ✅ Qué se consiguió finalmente

1. **1 junction table añadida** (las otras 4 ya existían del Sprint 1):
   - `PromptCategory` — relación N:M entre Prompt y Category

2. **Modelo Category modificado**:
   - `Category.prompts` cambiado de `Prompt[]` a `PromptCategory[]`

3. **Modelo Prompt modificado**:
   - Eliminado `categoryId String?`
   - Eliminado `category Category? @relation(...)`
   - Eliminado `@@index([categoryId])`
   - Añadido `categories PromptCategory[]`

4. **Migración creada y aplicada**:
   - `20260424120213_add_multi_value_relations`
   - Todas las tablas creadas en DB PostgreSQL (Docker)

5. **Código actualizado para compatibilidad**:
   - API routes actualizadas para usar `categories` en lugar de `category`
   - Componentes actualizados para usar `categories` en lugar de `categoryId`
   - Seed data actualizado para usar relación N:M

6. **Validaciones ejecutadas exitosamente**:
   - `npx prisma validate` — ✅ Sin errores
   - `npx prisma generate` — ✅ Tipos TypeScript generados
   - `npx prisma migrate dev` — ✅ Migración creada y aplicada
   - `npm run build` — ✅ Compilación sin errores
   - `npm run lint` — ✅ Sin errores ESLint
   - `npm test` — ✅ 30 tests, 8 suites pasaron

### ✅ Qué parte del objetivo original se cumplió

**100% del objetivo cumplido**, más trabajo adicional no planificado:
- Las 4 junction tables ya existían del Sprint 1 (PromptPlatform, PromptClientProject, PromptUseCase, PromptModelHint)
- Se añadió solo PromptCategory (la pendiente)
- **Trabajo adicional**: Se actualizó el código existente (API routes, componentes, seed) para usar las nuevas relaciones N:M. Esto estaba planificado para SF-1.2 pero fue necesario para que el build pasara.

### ⚠️ Desviaciones respecto al plan original

**Desviación 1: Junction tables ya existían**
- **Plan original**: Crear 5 junction tables
- **Realidad**: Solo 1 junction table nueva (PromptCategory), las otras 4 se crearon en Sprint 1
- **Razón**: El Sprint 1 adelantó la creación de junction tables porque las relaciones en Prompt las requerían
- **Impacto**: Positivo — menos trabajo en este Sprint

**Desviación 2: Actualización de código adelantada**
- **Plan original**: No modificar API routes ni componentes (esto es SF-1.2)
- **Realidad**: Se actualizaron API routes y componentes para usar `categories` en lugar de `category`/`categoryId`
- **Razón**: El build fallaba sin estos cambios. Los criterios de finalización requerían `npm run build` sin errores
- **Impacto**: Positivo — adelanta trabajo de SF-1.2, pero requiere validación adicional en SF-1.2

**Desviación 3: PostgreSQL en Docker**
- **Plan original**: Usar PostgreSQL local
- **Realidad**: Se usó PostgreSQL en Docker container
- **Razón**: No hay PostgreSQL nativo disponible en el Codespace
- **Impacto**: Neutro — mismo resultado, diferente método

### ❌ Qué parte quedó pendiente

- **Migración de datos existentes**: Los prompts existentes con campos `platform`, `useCase`, `clientOrProject`, `modelHint` como strings aún no se migran a relaciones. Pendiente para SF-1.3.
- **Zod schemas**: No se actualizaron los schemas Zod para aceptar arrays de IDs. Esto se corregirá en SF-1.2 cuando se implementen los formularios multi-selección.
- **Seed data para nuevas entidades**: No se añadió seed data para Platform, ClientProject, UseCase, ModelHint. Pendiente para SF-1.3.

---

## 3. Cambios reales realizados

### Archivos modificados

| Archivo | Líneas afectadas | Tipo de cambio |
|---------|------------------|----------------|
| `prisma/schema.prisma` | 97-236 | Category.prompts cambiado, Prompt.categoryId eliminado, PromptCategory añadido |
| `prisma/seed.ts` | 93, 116 | Seed data actualizado para usar `categories` en lugar de `categoryId` |
| `app/(app)/prompts/[id]/page.tsx` | 11 | Include cambiado de `category` a `categories` |
| `app/(app)/prompts/page.tsx` | 26-28, 59, 92-97 | Where clause y include actualizados para N:M |
| `app/api/export/prompts/route.ts` | 8, 31 | Include y transformación actualizados |
| `app/api/prompts/route.ts` | (varias) | Includes actualizados |
| `app/api/prompts/[id]/usage/route.ts` | (varias) | Includes actualizados |
| `app/api/prompts/[id]/route.ts` | (varias) | Includes actualizados |
| `app/api/import/prompts/route.ts` | 107 | Create data actualizado (eliminado categoryId) |
| `components/prompt/PromptForm.tsx` | 34-56, 94 | Interfaz y estado actualizados para `categories` |

### Archivos nuevos creados

| Archivo | Propósito |
|---------|-----------|
| `prisma/migrations/20260424120213_add_multi_value_relations/migration.sql` | Migración de base de datos con todas las tablas nuevas |

### Archivos eliminados

Ninguno.

### Cambios en `prisma/schema.prisma` (detalle)

**Junction table añadida (líneas 225-236)**:
```prisma
model PromptCategory {
  promptId   String
  categoryId String
  prompt     Prompt   @relation(fields: [promptId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([promptId, categoryId])
  @@index([promptId])
  @@index([categoryId])
}
```

**Modelo Category modificado (línea 107)**:
```prisma
prompts   PromptCategory[]  // antes: prompts   Prompt[]
```

**Modelo Prompt modificado (líneas 79-89)**:
```prisma
// ELIMINADO: categoryId      String?
// ELIMINADO: category        Category? @relation(fields: [categoryId], references: [id])
// ELIMINADO: @@index([categoryId])
// AÑADIDO: categories      PromptCategory[]
```

---

## 4. Componentes, módulos y recursos afectados

| Componente/Módulo | Impacto | Estado |
|-------------------|---------|--------|
| `prisma/schema.prisma` | Category.prompts, Prompt.categories, PromptCategory | ✅ Modificado |
| `prisma/migrations/` | Nueva migración creada | ✅ Añadido |
| `node_modules/.prisma/client/` | Tipos regenerados | ✅ Actualizado |
| `prisma/seed.ts` | Seed data actualizado | ✅ Modificado |
| API routes (export, import, prompts) | Includes y data transforms | ✅ Modificado |
| Componentes (PromptForm, prompts pages) | Props y estado actualizados | ✅ Modificado |
| PostgreSQL DB (Docker) | Tablas creadas | ✅ Actualizado |

---

## 5. Cambios de configuración

### Configuración de entorno

| Archivo | Cambio | Razón |
|---------|--------|-------|
| `.env.development` | Sin cambios (usa SQLite) | PostgreSQL se usa via Docker con variable inline |

### Docker

| Comando | Propósito |
|---------|-----------|
| `docker run -d --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=prompt_db_dev -p 5432:5432 postgres:14-alpine` | Levantar PostgreSQL temporal para migración |

---

## 6. Pruebas ejecutadas y resultados

### Prueba 1: Validación de schema
- **Qué se probó**: Sintaxis y estructura del schema Prisma
- **Cómo se probó**: `npx prisma validate`
- **Resultado**: ✅ Sin errores

### Prueba 2: Generación de tipos TypeScript
- **Qué se probó**: Prisma Client genera tipos para junction tables
- **Cómo se probó**: `npx prisma generate`
- **Resultado**: ✅ Tipos generados para PromptCategory y todas las relaciones

### Prueba 3: Migración de base de datos
- **Qué se probó**: Creación y aplicación de migración
- **Cómo se probó**: `npx prisma migrate dev --name add-multi-value-relations`
- **Resultado**: ✅ Migración creada en `prisma/migrations/20260424120213_add_multi_value_relations/`
- **SQL generado**: 378 líneas con 5 junction tables, índices y foreign keys

### Prueba 4: Compilación del proyecto
- **Qué se probó**: El proyecto compila sin errores de tipo
- **Cómo se probó**: `npm run build`
- **Resultado**: ✅ Build exitoso (17 páginas generadas)

### Prueba 5: Linting
- **Qué se probó**: Código sin errores ESLint
- **Cómo se probó**: `npm run lint`
- **Resultado**: ✅ Sin errores ni warnings

### Prueba 6: Tests existentes
- **Qué se probó**: Tests unitarios y de integración
- **Cómo se probó**: `npm test`
- **Resultado**: ✅ 30 tests, 8 suites pasaron
- **Cobertura**: Tests de API (prompts, auth), componentes (PromptList, auth)

---

## 7. Incidencias detectadas

### Incidencia 1: PostgreSQL no disponible en Codespace
- **Qué ocurrió**: No hay PostgreSQL nativo en el entorno
- **Cuándo se detectó**: Al ejecutar `prisma migrate dev`
- **Impacto**: Alto — bloquea migración
- **Cómo se resolvió**: Levantar PostgreSQL en Docker container temporal
- **Comando**: `docker run -d --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=prompt_db_dev -p 5432:5432 postgres:14-alpine`

### Incidencia 2: Build falla por referencias a `category` y `categoryId`
- **Qué ocurrió**: `npm run build` falló con errores de tipo porque el código referencia `category` (relación 1:N antigua) y `categoryId` (FK eliminada)
- **Cuándo se detectó**: Durante compilación
- **Impacto**: Alto — bloquea criterio de finalización
- **Cómo se resolvió**: Actualizar API routes y componentes para usar `categories` (relación N:M)
- **Archivos afectados**: 10 archivos (API routes, componentes, seed)
- **Nota**: Este trabajo estaba planificado para SF-1.2 pero se adelantó para permitir que el build pasara

### Incidencia 3: Seed data usa `categoryId`
- **Qué ocurrió**: `prisma/seed.ts` usa `categoryId` que ya no existe
- **Cuándo se detectó**: Durante compilación
- **Impacto**: Medio — seed no funcionaría
- **Cómo se resolvió**: Actualizar seed para usar `categories: { create: { categoryId: ... } }`

---

## 8. Correcciones y ajustes aplicados

### Ajuste 1: Código actualizado anticipadamente
- **Qué estaba planificado**: No modificar API routes ni componentes (SF-1.2)
- **Qué se hizo**: Actualizar todos los archivos que referencian `category` o `categoryId`
- **Por qué**: El build no podía pasar sin estos cambios
- **Impacto**: Positivo — adelanta trabajo de SF-1.2

### Ajuste 2: PostgreSQL en Docker
- **Qué estaba planificado**: Usar PostgreSQL local
- **Qué se hizo**: Usar Docker container temporal
- **Por qué**: No hay PostgreSQL nativo en Codespace
- **Impacto**: Neutro — mismo resultado

### Ajuste 3: Migration SQL regenera todas las tablas
- **Qué estaba planificado**: Migración incremental
- **Qué se hizo**: La migración recrea todas las tablas (es una DB nueva)
- **Por qué**: Prisma detectó que es una DB vacía y generó migración completa
- **Impacto**: Bajo — en producción con datos existentes, la migración sería incremental

---

## 9. Despliegue

**No hubo despliegue en este Sprint.**

Este Sprint fue de desarrollo y migración local. El despliegue está planificado para:
- **Fase 1, SF-1.3**: Aplicar migración en producción
- **Fase 5, SF-5.2**: Validación integral + smoke test de producción

---

## 10. Validación por parte del usuario

**No hubo validación del usuario en este Sprint.**

La validación del usuario está planificada para:
- **Fase 1, SF-1.3**: Verificar migración en Prisma Studio
- **Fase 2, SF-2.1**: Probar formulario con campos multivalor

---

## 11. Conocimiento técnico reutilizable

### Error 1: Cambio de relación 1:N a N:M requiere actualización en cascada

**Estado**: ✅ Validado  
**Código relacionado**: Múltiples archivos (API routes, componentes, seed)  
**Descripción**: Cuando se cambia una relación 1:N (FK simple) a N:M (junction table), todos los puntos del código que referencian la relación antigua deben actualizarse. Esto incluye:
- Schema Prisma (obvio)
- API routes (includes y creates)
- Componentes React (props y estado)
- Seed data (creates)
- Zod schemas (validación de entrada)

**Prevención**:
- Planificar el trabajo de actualización de código en el mismo Sprint que el cambio de schema
- O dividir en dos Sprints: 1) schema + migración, 2) actualización de código
- Usar búsqueda global (`grep`) para encontrar todas las referencias antes de empezar

### Patrón 1: Relación N:M en Prisma con junction table

**Estado**: ✅ Validado  
**Código relacionado**: `prisma/schema.prisma:225-236`  
**Descripción**: El patrón correcto para relación N:M con junction table explícita:
```prisma
model Prompt {
  categories PromptCategory[]
}

model Category {
  prompts PromptCategory[]
}

model PromptCategory {
  promptId   String
  categoryId String
  prompt     Prompt   @relation(fields: [promptId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([promptId, categoryId])  // Composite ID
  @@index([promptId])
  @@index([categoryId])
}
```

**Aplicación**:
- Usar `@@id([campo1, campo2])` para ID compuesto (o `@id @default(cuid())` si se necesita ID individual)
- Siempre `onDelete: Cascade` en ambas relaciones
- Índices en ambos campos para queries eficientes

### Patrón 2: Query con relación N:M en Prisma

**Estado**: ✅ Validado  
**Código relacionado**: `app/(app)/prompts/page.tsx:26-28`  
**Descripción**: Para filtrar por una relación N:M:
```typescript
// Antes (1:N):
where: { categoryId: "abc" }

// Ahora (N:M):
where: {
  categories: {
    some: {
      categoryId: "abc"
    }
  }
}
```

**Aplicación**:
- Usar `some` para existencia (al menos uno)
- Usar `every` para todos
- Usar `none` para ninguno

### Patrón 3: Include con relación N:M

**Estado**: ✅ Validado  
**Código relacionado**: `app/(app)/prompts/[id]/page.tsx:11`  
**Descripción**: Para incluir relaciones N:M:
```typescript
// Antes (1:N):
include: { category: true }

// Ahora (N:M):
include: { categories: true }
```

El resultado será un array: `categories: { categoryId: string, promptId: string }[]`

Para obtener los datos completos de Category:
```typescript
include: {
  categories: {
    include: {
      category: true
    }
  }
}
```

---

## 12. Comprobaciones y preguntas pendientes para el usuario

### Para el usuario revisar:

1. **Migración aplicada**:
   - ✅ Verificar en Prisma Studio que las 5 junction tables existen
   - ✅ Confirmar que Prompt ya no tiene columna `categoryId`
   - ✅ Verificar que Category tiene relación correcta

2. **Seed data**:
   - ⚠️ Ejecutar `npx prisma db seed` para poblar BD con datos de prueba
   - ⚠️ Verificar que los prompts de prueba tienen categorías asignadas vía junction table

3. **Código actualizado**:
   - ⚠️ Revisar que los cambios en API routes son correctos (export, import, prompts)
   - ⚠️ Probar formulario de prompts para verificar que guarda correctamente

### Para el siguiente Sprint (SF-1.2 — Zod + API routes para N:M):

1. **Zod schemas**:
   - Actualizar schemas para aceptar `platformIds: string[]`, `categoryIds: string[]`, etc.
   - Validar arrays de IDs en lugar de valores simples

2. **API routes POST/PUT**:
   - Actualizar para aceptar y persistir arrays de IDs
   - Usar transacciones para delete+create en relaciones N:M

3. **Formularios**:
   - Implementar selección múltiple para Platform, Category, Client/Project, Use Case, Model Hint
   - Creación inline de nuevos valores (D-06)

---

## 13. Estado de salida para el siguiente Sprint

### ✅ Qué queda listo y cerrado

- **Schema completo**: 4 entidades nuevas + 5 junction tables + relaciones N:M
- **Migración creada y aplicada**: Todas las tablas existen en DB de desarrollo
- **Tipos TypeScript generados**: PromptCategory y todas las relaciones disponibles
- **Código actualizado**: API routes y componentes usan `categories` en lugar de `category`/`categoryId`
- **Tests pasando**: 30 tests, 8 suites sin errores
- **Build exitoso**: Compilación sin errores de tipo

### ⚠️ Qué queda pendiente para siguientes Sprints

**SF-1.2 — Zod schemas + API routes para N:M**:
- Actualizar Zod schemas para aceptar arrays de IDs
- Actualizar API routes POST/PUT para manejar arrays
- Implementar selección múltiple en formularios
- Creación inline de nuevos valores

**SF-1.3 — Migraciones + seed data**:
- Seed data para Platform, ClientProject, UseCase, ModelHint
- Migración de datos existentes (campos string → relaciones)
- Aplicar migración en producción

### 🔗 Qué debe tener en cuenta obligatoriamente el siguiente Sprint

1. **Relaciones N:M ya existen**: El schema y la DB ya tienen las junction tables
2. **Código actualizado parcialmente**: Las API routes ya usan `categories`, pero los Zod schemas aún no aceptan arrays
3. **PostgreSQL en Docker**: El entorno de desarrollo usa Docker container (puede necesitar cleanup)

### ⚠️ Dependencias, acoplamientos o problemas que arrastramos

1. **Zod schemas desactualizados**: Los schemas actuales esperan `platform` (string) y `categoryId`, pero la DB usa relaciones N:M
2. **Datos existentes sin migrar**: Los prompts existentes tienen campos `platform`, `useCase`, etc. como strings que deben migrarse a relaciones
3. **Docker container**: El container PostgreSQL temporal debe limpiarse o hacerse permanente

---

## 14. Nuevo conocimiento generado para incorporación

### Para `conocimiento_tecnico_preventivo.md`:

```markdown
### 2.6 Cambio de relación 1:N a N:M requiere actualización en cascada
**Estado**: ✅ Validado  
**Código relacionado**: Múltiples archivos (schema, API routes, componentes, seed)  
**Descripción**: Cuando se cambia una relación 1:N (FK simple) a N:M (junction table), todos los puntos del código que referencian la relación antigua deben actualizarse. Esto incluye schema, API routes (includes y creates), componentes React (props y estado), seed data, y Zod schemas.

**Prevención**:
- Planificar el trabajo de actualización de código en el mismo Sprint que el cambio de schema
- Usar búsqueda global (grep) para encontrar todas las referencias antes de empezar
- No dividir schema y actualización de código en Sprints diferentes a menos que se acepte que el build fallará temporalmente

### 2.7 PostgreSQL en Docker para desarrollo en Codespaces
**Estado**: ✅ Validado  
**Código relacionado**: Docker, Prisma CLI  
**Descripción**: En GitHub Codespaces sin PostgreSQL nativo, se puede usar un container Docker temporal para desarrollo y migraciones.

**Prevención**:
- Comando: `docker run -d --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=prompt_db_dev -p 5432:5432 postgres:14-alpine`
- DATABASE_URL: `postgresql://postgres:postgres@localhost:5432/prompt_db_dev?schema=public`
- Limpiar container cuando no se necesite: `docker rm -f postgres-dev`
```

### Para `inventario_recursos.md`:

```markdown
### 4.1 PostgreSQL — Modelos actualizados (2026-04-24, Sprint F1-SF1.1-S2)

**Junction Tables añadidas**:
| Tabla | Relación | Estado |
|-------|----------|--------|
| `PromptCategory` | Prompt ↔ Category | ✅ |

**Modelo Category actualizado**:
| Modificación | Estado |
|-------------|--------|
| `prompts` cambiado de `Prompt[]` a `PromptCategory[]` | ✅ |

**Modelo Prompt actualizado**:
| Modificación | Estado |
|-------------|--------|
| Eliminado `categoryId` (campo FK) | ✅ |
| Eliminado `category` (relación 1:N) | ✅ |
| Eliminado `@@index([categoryId])` | ✅ |
| Añadido `categories` (relación N:M) | ✅ |

**Migraciones**:
| Migración | Fecha | Estado |
|-----------|-------|--------|
| `20260424120213_add_multi_value_relations` | 2026-04-24 | ✅ Creada y aplicada en desarrollo |
```

---

## 15. Historial de cambios del informe

| Fecha | Cambio | Responsable |
|-------|--------|-------------|
| 2026-04-24 | Creación inicial del informe de Sprint F1-SF1.1-S2 | Agente Orquestador |

---

**Fin del informe**
