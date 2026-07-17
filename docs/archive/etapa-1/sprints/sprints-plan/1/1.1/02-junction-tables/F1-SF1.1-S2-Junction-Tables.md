# F1-SF1.1-S2 — Junction Tables & Migration

**Fase**: 1 — Database Foundation  
**Subfase**: 1.1 — Schema: nuevas entidades y junction tables  
**Sprint**: 2 de 2  
**Objetivo**: Definir las 5 junction tables (PromptPlatform, PromptCategory, PromptClientProject, PromptUseCase, PromptModelHint) en `schema.prisma` con IDs compuestos, relaciones con cascade, e índices. Ejecutar `prisma generate` y crear migración. Validar tipos TypeScript completos.

---

## 1. Identificación

| Campo | Valor |
|-------|-------|
| **Fase** | 1 — Database Foundation |
| **Subfase** | 1.1 — Schema: nuevas entidades y junction tables |
| **Sprint** | 2 de 2 — Junction Tables & Migration |
| **Objetivo** | Crear 5 junction tables en `schema.prisma`, ejecutar `prisma generate`, crear migración con `prisma migrate dev`, y validar que todos los tipos TypeScript se generan correctamente. |

---

## 2. Base documental aplicada

### Documentos principales
- `04-Phases-Subphases-Plan.md`: Fase 1, SF-1.1 — definición de alcance y validación
- `03-Tech-Intervention-Plan.md`: §4.4 (Intervención estructural), §6.2 (Cadenas de dependencia) — junction tables y relaciones N:M
- `01-Briefing.md`: §3 (Alcance) — campos multivalor en Metadata
- `02-Improvement-Spec.md`: RF-06 a RF-22 — requisitos de multivalor

### Documentos parciales
- `01-mapa-tecnico-intervencion.md`: §3 (Persistencia) — schema Prisma, migraciones
- `02-cambios-tecnicos-necesarios.md`: §4 (Tabla Maestra) — cambios en schema para cada junction table
- `04-dependencias-y-condicionantes-tecnicos.md`: §3 (Dependencias directas) — patrón delete+create para relaciones N:M
- `05-validacion-tecnica.md`: §5.1 (Evolución de modelo de datos) — validación de migraciones
- `06-seguridad-integrada.md`: §3 (Mecanismos existentes) — Prisma parameterized queries, onDelete: SetNull
- `07-riesgos-y-decisiones-abiertas.md`: D-01 (resuelta) — tablas nuevas + N:M; D-07 (resuelta) — `$transaction` explícito

### Gobernanza
- `reglas_proyecto.md`: R9 (Migraciones), R11 (Calidad de código)
- `inventario_recursos.md`: §4.1 (PostgreSQL), §9 (Stack — Prisma 5.19.1), §10.2 (Comandos de Prisma)
- `conocimiento_tecnico_preventivo.md`: §2.1 (Prisma Client desactualizado), §2.2 (Seed config), §5.1 (Binary targets)
- `integracion-prisma-typescript.md`: Tipos con Include (Relaciones), Tipos de Argumentos, Patrones Reales

### Informes previos
- `F1-SF1.1-S1-Core-Entities.md`: Sprint 1 completó la definición de Platform, ClientProject, UseCase, ModelHint y relaciones bidireccionales en Prompt.

---

## 3. Alcance del Sprint

### Qué debe conseguir este Sprint
1. Añadir 5 junction tables al schema: PromptPlatform, PromptCategory, PromptClientProject, PromptUseCase, PromptModelHint
2. Cada junction table debe tener: composite ID (`@@id([promptId, entityId])`), relaciones con `onDelete: Cascade`, índices en ambas FKs
3. Ejecutar `prisma generate` sin errores — todos los tipos TypeScript generados
4. Crear migración con `prisma migrate dev` — tablas creadas en DB de desarrollo
5. Validar que la migración no destruye datos existentes
6. Ejecutar `npm run build` para verificar compilación

### Qué NO entra en este Sprint
- Modificar Zod schemas → Fase 1, SF-1.2
- Modificar API routes → Fase 1, SF-1.2
- Modificar componentes UI → Fase 2
- Migrar datos existentes de `platform` string a relaciones → Se abordará en sprint de migración de datos (Fase 1, SF-1.3)
- Aplicar migración en producción → Fase 1, SF-1.3

---

## 4. Elementos afectados

| Elemento | Ruta | Tipo de cambio | Justificación |
|----------|------|---------------|---------------|
| `schema.prisma` | `prisma/schema.prisma` | Añadir 5 junction tables | D-01: relaciones N:M entre Prompt y entidades |
| `prisma/migrations/` | `prisma/migrations/` | Nueva migración generada | `prisma migrate dev` crea archivo SQL |
| Prisma Client | `node_modules/.prisma/client/` | Regenerado automáticamente | Tipos para junction tables |

---

## 5. Plan de acción

### Acción 1: Crear junction table `PromptPlatform`
**Archivo**: `prisma/schema.prisma` (después del bloque `ModelHint`)

```prisma
model PromptPlatform {
  promptId   String
  platformId String
  prompt     Prompt   @relation(fields: [promptId], references: [id], onDelete: Cascade)
  platform   Platform @relation(fields: [platformId], references: [id], onDelete: Cascade)

  @@id([promptId, platformId])
  @@index([promptId])
  @@index([platformId])
}
```

**Por qué**: RF-06 a RF-11. Relación N:M entre Prompt y Platform. Patrón idéntico a `PromptTag` existente (`schema.prisma:122-131`).

### Acción 2: Crear junction table `PromptCategory`
**Archivo**: `prisma/schema.prisma` (después de `PromptPlatform`)

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

**Por qué**: RF-12 a RF-14. Reemplaza la FK simple `categoryId` en Prompt por relación N:M. Category ya existe como entidad.

### Acción 3: Modificar modelo `Category` para relación N:M
**Archivo**: `prisma/schema.prisma`, dentro del modelo `Category`

Cambiar la línea existente:
```prisma
  prompts   Prompt[]
```
por:
```prisma
  prompts   PromptCategory[]
```

**Por qué**: La relación bidireccional debe apuntar a la junction table, no directamente a Prompt.

### Acción 4: Modificar modelo `Prompt` para Category N:M
**Archivo**: `prisma/schema.prisma`, dentro del modelo `Prompt`

**Eliminar** estas líneas existentes:
```prisma
  categoryId      String?
  category        Category?   @relation(fields: [categoryId], references: [id])
  @@index([categoryId])
```

**Añadir** esta línea de relación (junto con las ya añadidas en Sprint 1):
```prisma
  categories      PromptCategory[]
```

**Por qué**: La FK simple `categoryId` se reemplaza por relación N:M vía `PromptCategory`.

### Acción 5: Crear junction table `PromptClientProject`
**Archivo**: `prisma/schema.prisma` (después de `PromptCategory`)

```prisma
model PromptClientProject {
  promptId        String
  clientProjectId String
  prompt          Prompt        @relation(fields: [promptId], references: [id], onDelete: Cascade)
  clientProject   ClientProject @relation(fields: [clientProjectId], references: [id], onDelete: Cascade)

  @@id([promptId, clientProjectId])
  @@index([promptId])
  @@index([clientProjectId])
}
```

**Por qué**: RF-15 a RF-22. Relación N:M entre Prompt y ClientProject.

### Acción 6: Crear junction table `PromptUseCase`
**Archivo**: `prisma/schema.prisma` (después de `PromptClientProject`)

```prisma
model PromptUseCase {
  promptId  String
  useCaseId String
  prompt    Prompt  @relation(fields: [promptId], references: [id], onDelete: Cascade)
  useCase   UseCase @relation(fields: [useCaseId], references: [id], onDelete: Cascade)

  @@id([promptId, useCaseId])
  @@index([promptId])
  @@index([useCaseId])
}
```

**Por qué**: RF-15 a RF-22. Relación N:M entre Prompt y UseCase.

### Acción 7: Crear junction table `PromptModelHint`
**Archivo**: `prisma/schema.prisma` (después de `PromptUseCase`)

```prisma
model PromptModelHint {
  promptId    String
  modelHintId String
  prompt      Prompt    @relation(fields: [promptId], references: [id], onDelete: Cascade)
  modelHint   ModelHint @relation(fields: [modelHintId], references: [id], onDelete: Cascade)

  @@id([promptId, modelHintId])
  @@index([promptId])
  @@index([modelHintId])
}
```

**Por qué**: RF-15 a RF-22. Relación N:M entre Prompt y ModelHint.

### Acción 8: Ejecutar `prisma validate`
**Comando**: `npx prisma validate`

**Criterio de éxito**: Sin errores de sintaxis ni de relación.

### Acción 9: Ejecutar `prisma generate`
**Comando**: `npx prisma generate`

**Criterio de éxito**: Sin errores. Tipos generados para las 5 junction tables y todas las relaciones.

### Acción 10: Crear migración
**Comando**: `npx prisma migrate dev --name add-multi-value-relations`

**Criterio de éxito**: Migración creada en `prisma/migrations/`. Tablas creadas en DB de desarrollo. Sin pérdida de datos en tablas existentes.

### Acción 11: Ejecutar `npm run build`
**Comando**: `npm run build`

**Criterio de éxito**: Compilación sin errores de tipo.

### Acción 12: Ejecutar `npm run lint`
**Comando**: `npm run lint`

**Criterio de éxito**: Sin errores de linting.

---

## 6. Validación y pruebas

### Qué validar
| Validación | Cómo | Mecanismo existente | Resultado esperado |
|-----------|------|-------------------|-------------------|
| Schema sintácticamente correcto | `npx prisma validate` | Prisma CLI | Sin errores |
| Tipos TypeScript generados | `npx prisma generate` | `postinstall` hook | 5 junction tables disponibles como tipos |
| Migración creada | `npx prisma migrate dev` | Prisma CLI | Archivo SQL en `prisma/migrations/` |
| Tablas creadas en DB | `npx prisma db pull` o Prisma Studio | Prisma CLI / Studio | 5 nuevas tablas visibles |
| Datos existentes preservados | Verificar tabla Prompt en Prisma Studio | Prisma Studio | Prompts existentes con platform y category intactos (campos antiguos aún presentes hasta migración de datos) |
| Compilación sin errores | `npm run build` | Next.js build | Build exitoso |
| Tests existentes pasan | `npm test` | Jest (30 tests, 8 suites) | Todos los tests pasan |

### Mecanismos existentes a usar
- `npx prisma validate` — validación de schema
- `npx prisma generate` — generación de tipos
- `npx prisma migrate dev` — migración en desarrollo
- `npx prisma studio` — inspección visual de DB
- `npm test` — tests existentes (R10 de `reglas_proyecto.md`)
- `npm run build` — compilación + type check (R11)
- `npm run lint` — linting (R11)

---

## 7. Seguridad y no regresión

### Qué preservar
| Control | Por qué | Cómo verificar |
|---------|---------|---------------|
| Modelo `PromptTag` intacto | Patrón de referencia para junction tables | Diff confirma sin cambios en PromptTag |
| Modelo `Tag` intacto | Relación existente con PromptTag | Diff confirma sin cambios |
| Modelo `User` intacto | Ownership y sesiones dependen de él | Diff confirma sin cambios |
| Modelo `Account`, `Session`, `VerificationToken` intactos | NextAuth depende de ellos | Diff confirma sin cambios |
| `onDelete: Cascade` en junction tables | Consistencia con `PromptTag` pattern | Verificar que todas las junction tables usan Cascade |
| Binary targets | Despliegue en Vercel requiere linux-musl | `generator client` block sin cambios |

### Qué revisar
| Elemento | Qué verificar | Por qué |
|----------|--------------|---------|
| Eliminación de `categoryId` FK | Confirmar que `categoryId`, `category` relation, y `@@index([categoryId])` se eliminan del modelo Prompt | La FK simple se reemplaza por N:M |
| Relación en Category | Confirmar que `Category.prompts` apunta a `PromptCategory[]` no `Prompt[]` | Relación bidireccional debe ser consistente |
| Campos antiguos en Prompt | `platform`, `modelHint`, `useCase`, `clientOrProject` se mantienen (se migrarán en SF-1.3) | No eliminar campos antiguos aún — los datos existentes necesitan migración |

### Riesgos de regresión
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Error de relación circular | Baja | Alto (bloquea generate) | Verificar que todas las relaciones apuntan a modelos definidos |
| Migración destructiva | Media | Alto (pérdida de datos) | `prisma migrate dev` en desarrollo primero; verificar con Prisma Studio |
| Campos antiguos referenciados en código | Alta | Medio | Zod schemas y API routes aún referencian `platform` (string) y `categoryId` — se abordará en SF-1.2 |
| Tests existentes fallan | Baja | Medio | `npm test` verifica; si fallan, es porque los tests asumen estructura antigua |

---

## 8. Criterios de finalización

- [ ] 5 junction tables añadidas: PromptPlatform, PromptCategory, PromptClientProject, PromptUseCase, PromptModelHint
- [ ] Cada junction table tiene: composite `@@id([promptId, entityId])`, 2 relaciones con `onDelete: Cascade`, 2 `@@index`
- [ ] Modelo `Category.prompts` cambiado de `Prompt[]` a `PromptCategory[]`
- [ ] Modelo `Prompt`: eliminados `categoryId`, `category` relation, `@@index([categoryId])`
- [ ] Modelo `Prompt`: añadida relación `categories PromptCategory[]`
- [ ] Campos antiguos (`platform`, `modelHint`, `useCase`, `clientOrProject`) se mantienen en Prompt (pendiente migración de datos en SF-1.3)
- [ ] `npx prisma validate` pasa sin errores
- [ ] `npx prisma generate` pasa sin errores
- [ ] `npx prisma migrate dev --name add-multi-value-relations` crea migración exitosamente
- [ ] `npm run build` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] `npm test` pasa (30 tests, 8 suites)
- [ ] Prisma Studio muestra 5 nuevas tablas + 5 nuevas entidades

---

## 9. Riesgos o advertencias

| Riesgo | Tipo | Advertencia |
|--------|------|-------------|
| **Campos antiguos aún en Prompt** | Transición | `platform`, `modelHint`, `useCase`, `clientOrProject` seguirán existiendo como columnas hasta SF-1.3 (migración de datos). Esto es intencional — no eliminar hasta que los datos se migren. |
| **Código existente referenciará campos antiguos** | Compatibilidad | Zod schemas, API routes, y componentes UI aún usan `platform` (string) y `categoryId` (FK). Esto causará errores de compilación hasta SF-1.2. Es esperado y no bloquea este Sprint. |
| **Migración puede pedir drop de columnas** | Prisma behavior | Al eliminar `categoryId` del modelo, Prisma puede proponer DROP COLUMN. Si hay datos en esa columna, Prisma advertirá. Revisar el SQL generado antes de confirmar. |
| **Seed data** | Datos de prueba | `prisma/seed.ts` puede necesitar actualización para usar las nuevas relaciones. Esto se abordará en SF-1.3. |
| **Binary targets** | Plataforma | No modificar el bloque `generator client`. Ver `conocimiento_tecnico_preventivo.md` §5.1. |

---

**Fin del documento**
