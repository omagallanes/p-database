# F1-SF1.1-S1 — Core Entities Schema

**Fase**: 1 — Database Foundation  
**Subfase**: 1.1 — Schema: nuevas entidades y junction tables  
**Sprint**: 1 de 2  
**Objetivo**: Definir los 4 modelos de entidad base (Platform, ClientProject, UseCase, ModelHint) en `schema.prisma` con campos, índices y relaciones bidireccionales. Validar generación de tipos TypeScript.

---

## 1. Identificación

| Campo | Valor |
|-------|-------|
| **Fase** | 1 — Database Foundation |
| **Subfase** | 1.1 — Schema: nuevas entidades y junction tables |
| **Sprint** | 1 de 2 — Core Entities |
| **Objetivo** | Crear modelos Platform, ClientProject, UseCase, ModelHint en `schema.prisma` con campos `name` (unique), `slug` (unique), timestamps, y relaciones bidireccionales con `Prompt`. Ejecutar `prisma generate` sin errores. |

---

## 2. Base documental aplicada

### Documentos principales
- `04-Phases-Subphases-Plan.md`: Fase 1, SF-1.1 — definición de alcance y validación
- `03-Tech-Intervention-Plan.md`: §4.4 (Intervención estructural), §3 (Mapa técnico) — entidades y junction tables requeridas
- `01-Briefing.md`: §3 (Alcance) — campos multivalor en Metadata
- `02-Improvement-Spec.md`: RF-06 a RF-22 — requisitos de multivalor

### Documentos parciales
- `01-mapa-tecnico-intervencion.md`: §3 (Áreas implicadas) — capa de datos
- `02-cambios-tecnicos-necesarios.md`: §4 (Tabla Maestra) — cambios en schema para cada entidad
- `04-dependencias-y-condicionantes-tecnicos.md`: §3 (Dependencias internas) — cadena Schema→Zod→State→UI
- `06-seguridad-integrada.md`: §3 (Mecanismos existentes) — Prisma parameterized queries
- `07-riesgos-y-decisiones-abiertas.md`: D-01 (resuelta) — tablas nuevas + N:M

### Gobernanza
- `reglas_proyecto.md`: R9 (Migraciones), R11 (Calidad de código)
- `inventario_recursos.md`: §4.1 (PostgreSQL), §9 (Stack — Prisma 5.19.1)
- `conocimiento_tecnico_preventivo.md`: §2.1 (Prisma Client desactualizado), §5.1 (Binary targets)
- `integracion-prisma-typescript.md`: Visión General, Generación de Tipos, Modelos del Proyecto

### Informes previos
- Ninguno. Primer Sprint de la Subfase 1.1.

---

## 3. Alcance del Sprint

### Qué debe conseguir este Sprint
1. Añadir 4 nuevos modelos al schema Prisma: `Platform`, `ClientProject`, `UseCase`, `ModelHint`
2. Cada modelo debe tener: `id` (cuid), `name` (unique), `slug` (unique), `sortOrder`, `createdAt`, `updatedAt`
3. Cada modelo debe tener relación bidireccional con `Prompt` (preparación para junction tables del Sprint 2)
4. Ejecutar `prisma generate` sin errores — tipos TypeScript generados correctamente
5. Ejecutar `npm run build` para verificar compilación

### Qué NO entra en este Sprint
- Crear junction tables (PromptPlatform, PromptCategory, PromptClientProject, PromptUseCase, PromptModelHint) → Sprint 2
- Ejecutar migraciones en BD → Sprint 2
- Modificar Zod schemas → Fase 1, SF-1.2
- Modificar API routes → Fase 1, SF-1.2
- Modificar componentes UI → Fase 2

---

## 4. Elementos afectados

| Elemento | Ruta | Tipo de cambio | Justificación |
|----------|------|---------------|---------------|
| `schema.prisma` | `prisma/schema.prisma` | Añadir 4 modelos nuevos | D-01: entidades para campos multivalor |
| `Prompt` model | `prisma/schema.prisma:61-93` | Añadir 4 relaciones de array (preparación para junction) | Bidireccionalidad con nuevas entidades |
| Prisma Client | `node_modules/.prisma/client/` | Regenerado automáticamente | `prisma generate` genera tipos TypeScript |

---

## 5. Plan de acción

### Acción 1: Crear modelo `Platform`
**Archivo**: `prisma/schema.prisma` (después del bloque `PromptTag`)

```prisma
model Platform {
  id        String         @id @default(cuid())
  name      String         @unique
  slug      String         @unique
  sortOrder Int            @default(0)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
  prompts   PromptPlatform[]

  @@index([slug])
}
```

**Por qué**: RF-06 a RF-11 requieren platform multivalor. D-01: tabla nueva + relación N:M.

### Acción 2: Crear modelo `ClientProject`
**Archivo**: `prisma/schema.prisma` (después de `Platform`)

```prisma
model ClientProject {
  id        String              @id @default(cuid())
  name      String              @unique
  slug      String              @unique
  sortOrder Int                 @default(0)
  createdAt DateTime            @default(now())
  updatedAt DateTime            @updatedAt
  prompts   PromptClientProject[]

  @@index([slug])
}
```

**Por qué**: RF-15 a RF-22 requieren Client/Project multivalor. D-01: tabla nueva + relación N:M.

### Acción 3: Crear modelo `UseCase`
**Archivo**: `prisma/schema.prisma` (después de `ClientProject`)

```prisma
model UseCase {
  id        String           @id @default(cuid())
  name      String           @unique
  slug      String           @unique
  sortOrder Int              @default(0)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
  prompts   PromptUseCase[]

  @@index([slug])
}
```

**Por qué**: RF-15 a RF-22 requieren Use Case multivalor. D-01: tabla nueva + relación N:M.

### Acción 4: Crear modelo `ModelHint`
**Archivo**: `prisma/schema.prisma` (después de `UseCase`)

```prisma
model ModelHint {
  id        String            @id @default(cuid())
  name      String            @unique
  slug      String            @unique
  sortOrder Int               @default(0)
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt
  prompts   PromptModelHint[]

  @@index([slug])
}
```

**Por qué**: RF-15 a RF-22 requieren Model Hint multivalor. D-01: tabla nueva + relación N:M.

### Acción 5: Añadir relaciones bidireccionales en `Prompt`
**Archivo**: `prisma/schema.prisma`, dentro del modelo `Prompt` (línea ~85, antes del cierre del modelo)

Añadir estas 4 líneas de relación (las junction tables se crean en Sprint 2):

```prisma
  platforms       PromptPlatform[]
  clientProjects  PromptClientProject[]
  useCases        PromptUseCase[]
  modelHints      PromptModelHint[]
```

**Por qué**: Las relaciones bidireccionales son necesarias para que Prisma genere tipos correctos. Las junction tables se definen en Sprint 2.

### Acción 6: Ejecutar `prisma generate`
**Comando**: `npx prisma generate`

**Criterio de éxito**: Sin errores. Tipos TypeScript generados para Platform, ClientProject, UseCase, ModelHint en `node_modules/.prisma/client/`.

### Acción 7: Ejecutar `npm run build`
**Comando**: `npm run build`

**Criterio de éxito**: Compilación sin errores de tipo. Los nuevos tipos de Prisma son accesibles desde TypeScript.

---

## 6. Validación y pruebas

### Qué validar
| Validación | Cómo | Mecanismo existente | Resultado esperado |
|-----------|------|-------------------|-------------------|
| Schema sintácticamente correcto | `npx prisma validate` | Prisma CLI | Sin errores de validación |
| Tipos TypeScript generados | `npx prisma generate` | `postinstall` hook en `package.json` | Platform, ClientProject, UseCase, ModelHint disponibles como tipos |
| Compilación sin errores | `npm run build` | Next.js build con type check | Build exitoso |
| Linting sin errores | `npm run lint` | ESLint configurado | Sin errores |

### Mecanismos existentes a usar
- `npx prisma validate` — validación de schema
- `npx prisma generate` — generación de tipos (ya configurado en `package.json:20` como `postinstall`)
- `npm run build` — compilación + type check (R11 de `reglas_proyecto.md`)
- `npm run lint` — linting (R11 de `reglas_proyecto.md`)

---

## 7. Seguridad y no regresión

### Qué preservar
| Control | Por qué | Cómo verificar |
|---------|---------|---------------|
| Modelos existentes intactos | User, Account, Session, VerificationToken, Prompt, Category, Tag, PromptTag no deben modificarse | Diff de `schema.prisma` solo muestra adiciones |
| Relaciones existentes | `Prompt.category`, `Prompt.user`, `Prompt.tags` deben seguir funcionando | `prisma generate` sin errores de relación |
| Índices existentes | `@@index` en Prompt, Category, Tag deben preservarse | Diff confirma que índices existentes no se tocan |
| Binary targets | `linux-musl-openssl-3.0.x`, etc. deben mantenerse | `generator client` block sin cambios |

### Riesgos de regresión
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Error de sintaxis en nuevos modelos | Baja | Alto (bloquea generate) | Validar con `prisma validate` antes de generate |
| Conflicto de nombres con modelos existentes | Muy baja | Alto | Verificar que Platform, ClientProject, UseCase, ModelHint no existen ya |
| Tipos TypeScript rotos | Baja | Medio | `npm run build` detecta errores de tipo |

---

## 8. Criterios de finalización

- [ ] 4 modelos nuevos añadidos a `schema.prisma`: Platform, ClientProject, UseCase, ModelHint
- [ ] Cada modelo tiene: `id`, `name` (@unique), `slug` (@unique), `sortOrder`, `createdAt`, `updatedAt`
- [ ] Cada modelo tiene relación bidireccional con `Prompt` (array de junction table)
- [ ] Modelo `Prompt` tiene 4 nuevas líneas de relación (platforms, clientProjects, useCases, modelHints)
- [ ] `npx prisma validate` pasa sin errores
- [ ] `npx prisma generate` pasa sin errores
- [ ] `npm run build` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Modelos existentes (User, Prompt, Category, Tag, PromptTag) no modificados en estructura

---

## 9. Riesgos o advertencias

| Riesgo | Tipo | Advertencia |
|--------|------|-------------|
| **Orden de definición** | Estructural | Los 4 modelos deben definirse ANTES de que el modelo Prompt los referencie. Si se añade la relación en Prompt antes de definir el modelo destino, `prisma generate` fallará. |
| **Nombres de modelos** | Convención | Usar PascalCase consistente con modelos existentes (Platform, no platforms). Ver `integracion-prisma-typescript.md` para convenciones. |
| **Campos name/slug únicos** | Datos | `@unique` en name y slug implica que no puede haber duplicados. Esto es intencional (D-06: normalización). Pero seed data existente podría tener duplicados — verificar antes de Sprint 2 (migración). |
| **Binary targets** | Plataforma | No modificar el bloque `generator client`. Los binary targets están configurados para despliegue en Vercel (linux-musl). Ver `conocimiento_tecnico_preventivo.md` §5.1. |

---

**Fin del documento**
