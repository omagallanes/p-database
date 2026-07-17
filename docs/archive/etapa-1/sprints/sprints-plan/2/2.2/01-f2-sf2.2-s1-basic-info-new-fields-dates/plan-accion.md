# Plan de Acción — Sprint F2-SF2.2-S1

**Fase**: 2 — Form Evolution  
**Subfase**: 2.2 — Basic Information: nuevos campos + fechas  
**Sprint**: 1 (único) — Pre-Prompt + Manual de uso + Fechas en Basic Information  
**Fecha de generación**: 2026-04-25  

---

## 1. Identificación

| Campo | Valor |
|-------|-------|
| **Fase** | 2 — Form Evolution |
| **Subfase** | 2.2 — Basic Information: nuevos campos + fechas |
| **Sprint** | S1 (1 de 1) |
| **Nombre** | Pre-Prompt + Manual de uso + Fechas en Basic Information |
| **Objetivo** | Añadir campos `prePrompt` y `manualDeUso` al schema, API y formulario; mostrar `createdAt`/`updatedAt` como solo lectura en modo edición; cumplir RF-26 a RF-31 |
| **RF cubiertos** | RF-26, RF-27, RF-28, RF-29, RF-30, RF-31 |

---

## 2. Base documental aplicada

### Documentos principales
- `doc-plan/doc-base/04-Phases-Subphases-Plan.md` §Fase 2, SF-2.2
- `doc-plan/doc-base/04-Phases-Subphases-Plan-Definicion.md` §4.2, §4.3
- `doc-plan/doc-base/01-Briefing.md` §3 (Alcance: Basic Information)
- `doc-plan/doc-base/02-Improvement-Spec.md` §1.2, RF-26 a RF-31, §4 (Condiciones)
- `doc-plan/doc-base/03-Tech-Intervention-Plan.md` §4.3 (Ampliación: `prePrompt`, `manualDeUso`)

### Documentos parciales aplicados
- `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md` §6 (Archivos críticos)
- `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md` §4 (Tabla maestra: `model Prompt` prePrompt/manualDeUso)
- `doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md` §4 (RF-26 a RF-28: Parcialmente soportado)
- `doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md` §6 (Discrepancia 6: Ausencia de campos Pre-Prompt y Manual de uso)

### Informes previos usados
- `doc-plan/doc-implementar/sprints-plan/2/2.1/01-f2-sf2.1-s1-platform-category-multiselect/01-f2-sf2.1-s1-informe.md`
- `doc-plan/doc-implementar/sprints-plan/2/2.1/02-f2-sf2.1-s2-clientproject-usecase-modelhint-language/01-f2-sf2.1-s2-informe.md`
- `doc-plan/doc-implementar/sprints-plan/2/2.1/02-f2-sf2.1-s2-clientproject-usecase-modelhint-language/02-f2-sf2.1-s2-informe-oficial.md`

### Gobernanza
- `.gobernanza/.governance/reglas_proyecto.md` (R1-R18)
- `.gobernanza/.governance/inventario_recursos.md`
- `.gobernanza/.governance/conocimiento_tecnico_preventivo.md`
- `.gobernanza/.governance/integracion-prisma-typescript.md`

---

## 3. Alcance del Sprint

### Qué debe conseguir este Sprint
1. Schema: añadir `prePrompt String? @db.Text` y `manualDeUso String? @db.Text` al modelo `Prompt`
2. Migración: crear y aplicar migración para los 2 nuevos campos
3. Zod: añadir `prePrompt` y `manualDeUso` opcionales a `createPromptSchema` y `updatePromptSchema`
4. API POST: persistir `prePrompt` y `manualDeUso` al crear prompt
5. API PUT: persistir `prePrompt` y `manualDeUso` al actualizar prompt
6. API GET: incluir `prePrompt` y `manualDeUso` en responses
7. PromptForm: añadir Textarea para Pre-Prompt y Manual de uso después de Prompt Body
8. PromptForm: mostrar fechas `createdAt` y `updatedAt` solo en modo edición (no en alta)
9. PromptForm interface: añadir `prePrompt`, `manualDeUso`, `createdAt`, `updatedAt` al tipo `prompt?`
10. PromptForm state: añadir `prePrompt` y `manualDeUso` al formData
11. PromptForm payload: enviar `prePrompt` y `manualDeUso` en handleSubmit y handleDuplicate
12. Páginas: `[id]/page.tsx` ya incluye `createdAt`/`updatedAt` por defecto; verificar que se pasan al form
13. Export: incluir `prePrompt` y `manualDeUso` en JSON de export
14. Import: aceptar `prePrompt` y `manualDeUso` en JSON de import
15. Tests: `npm test` pasa sin regresiones
16. Build: `npm run build` sin errores
17. Lint: `npm run lint` sin errores

### Qué NO entra en este Sprint
- Navegación post-guardado (SF-2.3)
- Vista lista del listado (SF-3.1)
- Filtros multi-selección (SF-3.2)
- Export/Import auth (SF-4.1, SF-4.2)
- Eliminación de campos legacy del schema
- Rate limiting (SF-4.3)

---

## 4. Elementos afectados

### Archivos concretos

| Archivo | Ruta | Tipo de cambio |
|---------|------|----------------|
| `schema.prisma` | `prisma/schema.prisma` | Añadir `prePrompt String? @db.Text` y `manualDeUso String? @db.Text` al modelo Prompt |
| Migración | `prisma/migrations/<timestamp>_add_basic_info_fields/` | Nueva migración (auto-generada) |
| `route.ts` (POST/GET) | `app/api/prompts/route.ts` | Zod schema + handler POST + response GET |
| `route.ts` (PUT) | `app/api/prompts/[id]/route.ts` | Zod schema + handler PUT |
| `PromptForm.tsx` | `components/prompt/PromptForm.tsx` | Interface, state, payload, UI (2 textareas + 2 fechas read-only) |
| `page.tsx` | `app/(app)/prompts/[id]/page.tsx` | Verificar que createdAt/updatedAt se pasan al form |
| `export/route.ts` | `app/api/export/prompts/route.ts` | Incluir prePrompt y manualDeUso en JSON |
| `import/route.ts` | `app/api/import/prompts/route.ts` | Aceptar prePrompt y manualDeUso en schema |

### Módulos y capas implicadas
- **Capa de datos**: modelo Prompt (2 campos nuevos)
- **Capa de API**: Zod validation, POST/PUT handlers, GET response shape
- **Capa de presentación**: PromptForm UI (Basic Information card)
- **Export/Import**: formato JSON

---

## 5. Plan de acción

### Acción 1: Schema — Añadir campos al modelo Prompt
**Archivo**: `prisma/schema.prisma`  
**Qué**: Añadir 2 campos opcionales al modelo `Prompt`, después de `notes` y antes de `usageCount`:
```prisma
prePrompt       String?             @db.Text
manualDeUso     String?             @db.Text
```
**Por qué**: RF-26, RF-27, RF-28 requieren campos persistentes opcionales  
**Impacto**: Requiere migración; campos opcionales no rompen datos existentes

### Acción 2: Migración — Crear y aplicar
**Comandos**:
```bash
set -a && source /workspaces/p-database/.env.development && set +a
npx prisma migrate dev --name add_basic_info_fields
npx prisma generate
```
**Qué**: Generar migración automática y regenerar Prisma Client  
**Validación**: `npx prisma migrate status` muestra migración aplicada

### Acción 3: Zod schemas — Añadir campos opcionales
**Archivo**: `app/api/prompts/route.ts`  
**Qué**: Añadir a `createPromptSchema` (después de `notes`):
```typescript
prePrompt: z.string().optional(),
manualDeUso: z.string().optional(),
```
**Archivo**: `app/api/prompts/[id]/route.ts`  
**Qué**: Añadir los mismos 2 campos al schema de update  
**Por qué**: Validación de entrada debe aceptar los nuevos campos

### Acción 4: API POST — Persistir nuevos campos
**Archivo**: `app/api/prompts/route.ts`  
**Qué**: En el handler POST, dentro del `prisma.prompt.create`, añadir:
```typescript
prePrompt: validatedData.prePrompt || null,
manualDeUso: validatedData.manualDeUso || null,
```
**Nota**: Verificar la estructura exacta del handler POST actual para insertar correctamente

### Acción 5: API PUT — Persistir nuevos campos
**Archivo**: `app/api/prompts/[id]/route.ts`  
**Qué**: En el handler PUT, dentro del `prisma.prompt.update`, añadir:
```typescript
prePrompt: validatedData.prePrompt || null,
manualDeUso: validatedData.manualDeUso || null,
```
**Nota**: Verificar la estructura exacta del handler PUT actual (dentro de $transaction si aplica)

### Acción 6: API GET — Incluir nuevos campos en response
**Archivo**: `app/api/prompts/route.ts`  
**Qué**: Verificar que el `findMany` retorna `prePrompt` y `manualDeUso` (Prisma los incluye por defecto al no usar `select` restrictivo)  
**Validación**: Response JSON incluye ambos campos

### Acción 7: PromptForm — Interface y state
**Archivo**: `components/prompt/PromptForm.tsx`  
**Qué**:
1. Interface `prompt?`: añadir `prePrompt: string | null`, `manualDeUso: string | null`, `createdAt: string`, `updatedAt: string`
2. `formData` state: añadir `prePrompt: string` y `manualDeUso: string`
3. Inicialización: `prePrompt: prompt?.prePrompt || ""`, `manualDeUso: prompt?.manualDeUso || ""`

### Acción 8: PromptForm — UI de nuevos campos
**Archivo**: `components/prompt/PromptForm.tsx`  
**Qué**: Dentro del Card "Basic Information", después del Textarea de `body` (línea ~563), añadir en este orden:
1. Textarea para Pre-Prompt (label "Pre-Prompt", opcional, rows={6}, className="font-mono text-sm")
2. Textarea para Manual de uso (label "Manual de uso", opcional, rows={6}, className="font-mono text-sm")
3. Campo read-only para Fecha de creación (visible solo si `prompt` existe):
   ```tsx
   {prompt && (
     <div>
       <Label>Fecha de creación</Label>
       <Input value={new Date(prompt.createdAt).toLocaleString("es-ES")} readOnly disabled />
     </div>
   )}
   ```
4. Campo read-only para Fecha de actualización (visible solo si `prompt` existe):
   ```tsx
   {prompt && (
     <div>
       <Label>Fecha de actualización</Label>
       <Input value={new Date(prompt.updatedAt).toLocaleString("es-ES")} readOnly disabled />
     </div>
   )}
   ```

### Acción 9: PromptForm — Payload de submit y duplicate
**Archivo**: `components/prompt/PromptForm.tsx`  
**Qué**:
1. En `handleSubmit`: el payload ya incluye `...formData`, que ahora contiene `prePrompt` y `manualDeUso`. Verificar que se envían correctamente.
2. En `handleDuplicate`: mismo caso, `...formData` ya los incluye. Verificar.

### Acción 10: Página [id] — Verificar paso de fechas
**Archivo**: `app/(app)/prompts/[id]/page.tsx`  
**Qué**: Verificar que la query de Prisma incluye `createdAt` y `updatedAt` (Prisma los incluye por defecto). Verificar que se pasan como props al `PromptForm`. Si las fechas llegan como `Date`, serializarlas a string ISO antes de pasarlas al componente cliente.

### Acción 11: Export — Incluir nuevos campos
**Archivo**: `app/api/export/prompts/route.ts`  
**Qué**: En el mapeo de prompts para export, añadir:
```typescript
prePrompt: prompt.prePrompt,
manualDeUso: prompt.manualDeUso,
```
**Validación**: JSON exportado incluye ambos campos

### Acción 12: Import — Aceptar nuevos campos
**Archivo**: `app/api/import/prompts/route.ts`  
**Qué**: Verificar que el schema de import acepta `prePrompt` y `manualDeUso` (si usa `z.any()` no requiere cambio; si tiene schema específico, añadir campos opcionales). En el handler de import, pasar los campos al `prisma.prompt.create` o `update`.

### Acción 13: Validación — Tests, build, lint
**Comandos**:
```bash
npm test
npm run build
npm run lint
```
**Criterio**: Todos pasan sin errores ni regresiones

---

## 6. Validación y pruebas

### Qué debe validarse
| Elemento | Cómo | Mecanismo |
|----------|------|-----------|
| Schema y migración | `npx prisma migrate status` | Prisma CLI |
| Campos existen en DB | `npx prisma studio` o query directa | Prisma Studio |
| Zod acepta nuevos campos | Tests existentes + manual | `npm test` |
| POST crea con prePrompt/manualDeUso | Test manual o API test | Fetch manual |
| PUT actualiza prePrompt/manualDeUso | Test manual o API test | Fetch manual |
| GET retorna prePrompt/manualDeUso | Test manual o API test | Fetch manual |
| Formulario muestra campos en alta | Visual: no hay fechas, sí textareas | Navegador |
| Formulario muestra campos en edición | Visual: fechas visibles + textareas con datos | Navegador |
| Fechas NO aparecen en alta | Visual: sin sección de fechas | Navegador |
| Fechas SÍ aparecen en edición | Visual: fechas con valores formateados | Navegador |
| Guardado con campos vacíos funciona | Guardar sin rellenar prePrompt/manualDeUso | Navegador |
| Export incluye nuevos campos | Exportar prompt y verificar JSON | Navegador + inspección JSON |
| Import con nuevos campos funciona | Importar JSON con prePrompt/manualDeUso | Navegador |
| Sin regresión en tests | `npm test` | Jest |
| Sin errores de compilación | `npm run build` | Next.js |
| Sin errores de lint | `npm run lint` | ESLint |

### Mecanismos existentes del repositorio
- `npm test`: 40 tests, 8 suites (ver informes SF-2.1)
- `npm run build`: compilación TypeScript
- `npm run lint`: ESLint
- `npx prisma generate`: regeneración de tipos
- `npx prisma migrate dev`: migraciones en desarrollo

---

## 7. Seguridad y no regresión

### Qué debe preservarse
| Control | Ubicación | Por qué preservar |
|---------|-----------|-------------------|
| Auth en POST/PUT | `route.ts` handlers | Los nuevos campos son parte del prompt; auth ya cubre la operación completa |
| Ownership check | `[id]/route.ts:26-41` | PUT sigue requiriendo ownership |
| Zod validation | Ambos schemas | Nuevos campos son opcionales; no debilitan validación |
| $transaction en PUT | `[id]/route.ts` | Si el PUT usa $transaction para relaciones N:M, los nuevos campos deben incluirse dentro de la misma transacción |
| Compatibilidad dual | Campos legacy se mantienen | Los campos string legacy (platform, useCase, etc.) no se tocan en este Sprint |

### Qué debe revisarse
| Elemento | Riesgo | Mitigación |
|----------|--------|------------|
| Campos `@db.Text` | Sin límite de longitud | Aceptar; es intencional para contenido largo |
| Fechas en cliente | Serialización Date→string | Serializar explícitamente en `[id]/page.tsx` antes de pasar a PromptForm |
| Export/Import | Formato cambia ligeramente | Campos opcionales; imports antiguos sin estos campos siguen funcionando |

### Riesgos de regresión
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Formulario deja de guardar | BAJA | ALTO | Tests de submit; verificar payload |
| Migración falla | BAJA | ALTO | Campos opcionales; no afectan datos existentes |
| Fechas no se muestran en edición | MEDIA | MEDIA | Verificar serialización en `[id]/page.tsx` |
| Export rompe imports antiguos | BAJA | MEDIA | Campos opcionales; imports sin ellos siguen válidos |

---

## 8. Criterios de finalización

### Lista de comprobación explícita
- [ ] `prePrompt String? @db.Text` añadido al modelo Prompt en schema.prisma
- [ ] `manualDeUso String? @db.Text` añadido al modelo Prompt en schema.prisma
- [ ] Migración creada y aplicada exitosamente
- [ ] Prisma Client regenerado sin errores
- [ ] `createPromptSchema` incluye `prePrompt` y `manualDeUso` opcionales
- [ ] Update schema incluye `prePrompt` y `manualDeUso` opcionales
- [ ] POST handler persiste ambos campos
- [ ] PUT handler persiste ambos campos
- [ ] GET response incluye ambos campos
- [ ] PromptForm interface incluye `prePrompt`, `manualDeUso`, `createdAt`, `updatedAt`
- [ ] PromptForm state incluye `prePrompt` y `manualDeUso`
- [ ] PromptForm UI: Textarea Pre-Prompt después de Prompt Body
- [ ] PromptForm UI: Textarea Manual de uso después de Pre-Prompt
- [ ] PromptForm UI: Fecha de creación visible solo en modo edición
- [ ] PromptForm UI: Fecha de actualización visible solo en modo edición
- [ ] PromptForm UI: Fechas NO visibles en modo alta
- [ ] handleSubmit envía prePrompt y manualDeUso
- [ ] handleDuplicate incluye prePrompt y manualDeUso
- [ ] Export JSON incluye prePrompt y manualDeUso
- [ ] Import acepta prePrompt y manualDeUso
- [ ] `npm test` pasa sin fallos (40+ tests)
- [ ] `npm run build` compila sin errores
- [ ] `npm run lint` sin errores
- [ ] SF-2.2 completada: campos opcionales guardan correctamente, fechas visibles solo en edición

---

## 9. Riesgos o advertencias

### Incidencias previsibles
| Incidencia | Probabilidad | Impacto | Prevención |
|------------|-------------|---------|------------|
| Fechas llegan como Date object a componente cliente | MEDIA | MEDIO | Serializar a ISO string en `[id]/page.tsx` antes de pasar props |
| Migración requiere DB activa | BAJA | ALTO | Verificar PostgreSQL corriendo antes de migrar |
| Campos @db.Text pueden ser null | BAJA | BAJO | Manejar `|| ""` en inicialización de formData |

### Dependencias sensibles
| Dependencia | Sensibilidad | Nota |
|-------------|-------------|------|
| PostgreSQL debe estar activo | ALTA | Requerido para migración y build |
| SF-2.1 completada | ALTA | Este Sprint asume que todos los campos multivalor ya funcionan |
| Campos legacy se mantienen | MEDIA | Compatibilidad dual sigue vigente |

### Limitaciones y alertas
- Los campos `prePrompt` y `manualDeUso` son **opcionales**; su ausencia no debe impedir guardar el prompt (RF-27, RF-28)
- Las fechas **no deben mostrarse en modo alta** (RF-31); la condición es `prompt` existe → mostrar fechas
- Este Sprint es el **único** de SF-2.2; al completarse, la Subfase queda cerrada y lista para despliegue
- SF-2.2 es paralelizable con SF-2.3 (ambas dependen solo de SF-1.1 completada, no entre sí)

---

## Orden recomendado de trabajo

1. Schema + migración (Acciones 1-2)
2. Zod schemas (Acción 3)
3. API handlers POST/PUT/GET (Acciones 4-6)
4. PromptForm interface + state (Acción 7)
5. PromptForm UI (Acción 8)
6. PromptForm payload (Acción 9)
7. Página [id] verificación (Acción 10)
8. Export/Import (Acciones 11-12)
9. Validación completa (Acción 13)

---

**Fin del plan de acción — F2-SF2.2-S1**
