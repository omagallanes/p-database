# F2-SF2.1-S2 — Client/Project, Use Case, Model Hint Multi-Select + Language Selector

**Versión**: 1.0  
**Fecha**: 2026-04-24  
**Fase**: 2 — Form Evolution  
**Subfase**: 2.1 — Metadata multivalor en PromptForm  
**Sprint**: 2 de 2  

---

## 1. Identificación

| Campo | Valor |
|-------|-------|
| **Fase** | 2 — Form Evolution |
| **Subfase** | 2.1 — Metadata multivalor en PromptForm |
| **Sprint** | 2 — Client/Project + Use Case + Model Hint Multi-Select + Language Selector |
| **Objetivo** | Completar la conversión de todos los campos multivalor restantes en PromptForm: Client/Project, Use Case y Model Hint a multi-select con creación inline, y Language a selector con opciones predefinidas. Cerrar SF-2.1. |
| **RF cubiertos** | RF-15 a RF-25 |

---

## 2. Base documental aplicada

### Documentos principales
- Ver `doc-plan/doc-base/04-Phases-Subphases-Plan.md` §Fase 2, SF-2.1
- Ver `doc-plan/doc-base/02-Improvement-Spec.md` §1.1.d-e (Client/Project, Use Case, Model Hint multivalor; Language selector)
- Ver `doc-plan/doc-base/03-Tech-Intervention-Plan.md` §4.3-4.4

### Documentos parciales aplicados
- Ver `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md` §3-6
- Ver `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md` §4 (tabla maestra: Client/Project, Use Case, Model Hint, Language)
- Ver `doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md` §5 (RF-15 a RF-25 no soportados)

### Decisiones aplicadas
- Ver `doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md` §7: D-01 (tablas nuevas + N:M), D-05 (Language: en, es, nl), D-06 (creación inline con normalización), D-07 ($transaction)

### Informes previos de la Subfase
- Ver `doc-plan/doc-implementar/sprints-plan/2/2.1/01-f2-sf2.1-s1-platform-category-multiselect/plan-accion.md` (Sprint 1: Platform + Category)

### Gobernanza aplicada
- Ver `.gobernanza/.governance/reglas_proyecto.md`: R1, R5, R11
- Ver `.gobernanza/.governance/conocimiento_tecnico_preventivo.md` §3, §8.1
- Ver `.gobernanza/.governance/integracion-prisma-typescript.md`: tipos para ClientProject, UseCase, ModelHint

---

## 3. Alcance del Sprint

### Qué debe conseguir este Sprint
1. **Client/Project multi-select**: Selección múltiple con creación inline de nuevos valores
2. **Use Case multi-select**: Selección múltiple con creación inline de nuevos valores
3. **Model Hint multi-select**: Selección múltiple con creación inline de nuevos valores
4. **Language como selector**: De input de texto libre a `<Select>` con opciones: en, es, nl (mínimo)
5. **Estado del formulario**: `clientProjectIds`, `useCaseIds`, `modelHintIds` como arrays; `language` como string con validación
6. **Payload de API**: Envía arrays para los 3 campos multivalor restantes
7. **Cierre de SF-2.1**: Todos los campos de Metadata en PromptForm son multivalor o selector según especificación

### Qué NO entra en este Sprint
- Navegación post-guardado (SF-2.3)
- Nuevos campos Basic Information (SF-2.2)
- Eliminación de campos string legacy del schema
- Cambios en API routes o Zod schemas (ya soportan arrays desde SF-1.2)
- Filtros multi-selección (Fase 3)

---

## 4. Elementos afectados

### Archivos concretos
| Archivo | Ruta | Tipo de cambio |
|---------|------|----------------|
| `PromptForm.tsx` | `components/prompt/PromptForm.tsx` | **Modificación principal**: estado, UI de Client/Project, Use Case, Model Hint, Language |
| `PromptForm.tsx` (interface) | `components/prompt/PromptForm.tsx:34-56` | **Modificación**: añadir tipos para ClientProject, UseCase, ModelHint |
| `page.tsx` (new) | `app/(app)/prompts/new/page.tsx` | **Modificación**: fetch de ClientProject, UseCase, ModelHint |
| `page.tsx` (edit) | `app/(app)/prompts/[id]/page.tsx` | **Modificación**: include de clientProjects, useCases, modelHints |

### Módulos y componentes
- **PromptForm state**: `clientOrProject: string` → `clientProjectIds: string[]`, `useCase: string` → `useCaseIds: string[]`, `modelHint: string` → `modelHintIds: string[]`
- **Client/Project selector**: Multi-select con badges + creación inline (patrón Platform de SF2.1-S1)
- **Use Case selector**: Multi-select con badges + creación inline (patrón Platform)
- **Model Hint selector**: Multi-select con badges + creación inline (patrón Platform)
- **Language selector**: `<Select>` con opciones en, es, nl (reemplaza input de texto)

---

## 5. Plan de acción

### Acción 1: Actualizar interface PromptFormProps
**Qué**: Añadir tipos y props para ClientProject, UseCase, ModelHint.
**Archivo**: `components/prompt/PromptForm.tsx:34-56`
**Detalle**: Añadir a `prompt`:
```typescript
clientProjects: { clientProject: { id: string; name: string } }[]
useCases: { useCase: { id: string; name: string } }[]
modelHints: { modelHint: { id: string; name: string } }[]
```
Y a las props del componente:
```typescript
clientProjects: { id: string; name: string }[]
useCases: { id: string; name: string }[]
modelHints: { id: string; name: string }[]
```

### Acción 2: Actualizar estado formData
**Qué**: Cambiar `clientOrProject`, `useCase`, `modelHint` de strings a arrays de IDs.
**Archivo**: `components/prompt/PromptForm.tsx:62-96`
**Detalle**:
- Eliminar `clientOrProject: string`, `useCase: string`, `modelHint: string`
- Añadir `clientProjectIds: string[]`, `useCaseIds: string[]`, `modelHintIds: string[]`
- Inicializar desde `prompt?.clientProjects.map(...)`, `prompt?.useCases.map(...)`, `prompt?.modelHints.map(...)`

### Acción 3: Crear estados selected para los 3 campos
**Qué**: `selectedClientProjects`, `selectedUseCases`, `selectedModelHints` siguiendo patrón de SF2.1-S1.
**Archivo**: `components/prompt/PromptForm.tsx` (junto a Acción 3 del Sprint 1)

### Acción 4: Crear funciones toggle para los 3 campos
**Qué**: `toggleClientProject`, `toggleUseCase`, `toggleModelHint` siguiendo patrón `toggleTag`.
**Archivo**: `components/prompt/PromptForm.tsx`

### Acción 5: Crear funciones de creación inline para los 3 campos
**Qué**: Creación de ClientProject, UseCase, ModelHint vía sus respectivos endpoints POST.
**Archivo**: `components/prompt/PromptForm.tsx`
**Detalle**: Mismo patrón que creación inline de Platform (SF2.1-S1, Acción 5). Cada una llama a su endpoint:
- `POST /api/client-projects`
- `POST /api/use-cases`
- `POST /api/model-hints`

### Acción 6: Reemplazar UI de Client/Project
**Qué**: De `<Input>` simple a multi-select con badges + creación inline.
**Archivo**: `components/prompt/PromptForm.tsx:384-393`
**Detalle**: Patrón idéntico a Platform (SF2.1-S1, Acción 6).

### Acción 7: Reemplazar UI de Use Case
**Qué**: De `<Input>` simple a multi-select con badges + creación inline.
**Archivo**: `components/prompt/PromptForm.tsx:372-382`
**Detalle**: Patrón idéntico a Platform.

### Acción 8: Reemplazar UI de Model Hint
**Qué**: De `<Input>` simple a multi-select con badges + creación inline.
**Archivo**: `components/prompt/PromptForm.tsx:348-358`
**Detalle**: Patrón idéntico a Platform.

### Acción 9: Reemplazar UI de Language
**Qué**: De `<Input>` de texto libre a `<Select>` con opciones predefinidas.
**Archivo**: `components/prompt/PromptForm.tsx:360-369`
**Detalle**:
```typescript
<Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="en">English</SelectItem>
    <SelectItem value="es">Español</SelectItem>
    <SelectItem value="nl">Nederlands</SelectItem>
  </SelectContent>
</Select>
```
Opciones según D-05: en, es, nl (mínimo). Default: "es" (preferencia del usuario, ver inventario §Notas 7).

### Acción 10: Actualizar handleSubmit y handleDuplicate
**Qué**: Incluir `clientProjectIds`, `useCaseIds`, `modelHintIds` en el payload.
**Archivo**: `components/prompt/PromptForm.tsx` (handleSubmit y handleDuplicate)
**Detalle**: Mismo patrón que SF2.1-S1, Acción 8 y 9.

### Acción 11: Actualizar páginas que pasan datos al formulario
**Qué**: `new/page.tsx` y `[id]/page.tsx` deben fetch y pasar ClientProject, UseCase, ModelHint.
**Archivos**:
- `app/(app)/prompts/new/page.tsx`: fetch de las 3 entidades
- `app/(app)/prompts/[id]/page.tsx`: include de `clientProjects`, `useCases`, `modelHints` en Prisma query

### Acción 12: Limpieza de campos legacy en el payload
**Qué**: Eliminar `clientOrProject`, `useCase`, `modelHint` del payload enviado a la API.
**Por qué**: El formulario nuevo usa exclusivamente el formato de arrays.
**Validación**: Revisar payload de handleSubmit y handleDuplicate.

---

## 6. Validación y pruebas

### Qué debe validarse
1. **Client/Project multi-select**: Selección múltiple + creación inline funciona
2. **Use Case multi-select**: Selección múltiple + creación inline funciona
3. **Model Hint multi-select**: Selección múltiple + creación inline funciona
4. **Language selector**: Selector con opciones en, es, nl; default "es"
5. **Carga de datos existentes**: Al editar, los valores asociados aparecen seleccionados
6. **Guardado**: Prompt se guarda con todas las relaciones N:M
7. **Duplicado**: Duplicado copia todas las relaciones

### Pruebas a ejecutar
- `npm test`: Todos los tests deben pasar
- Tests manuales:
  - Crear prompt con valores en los 3 campos multivalor + Language
  - Editar prompt existente → verificar selections
  - Crear nuevos valores desde el formulario → verificar en DB
  - Duplicar → verificar que todas las relaciones se copian

### Mecanismos existentes
- Ver `doc-plan/doc-implementar/conocimiento-tec/05-validacion-tecnica.md` §7.2
- `npm run build`: Compilación sin errores
- `npm run lint`: ESLint sin errores

---

## 7. Seguridad y no regresión

### Qué debe preservarse
- **Auth en endpoints de creación**: `POST /api/client-projects`, `POST /api/use-cases`, `POST /api/model-hints` deben requerir autenticación
- **Normalización**: Todos los endpoints deben aplicar trim + lowercase (D-06)
- **Ownership y $transaction**: API de prompts sigue funcionando con $transaction para todas las relaciones

### Riesgos de regresión
| Riesgo | Mitigación |
|--------|-----------|
| Formulario deja de guardar | Verificar payload contra schema Zod; tests de API |
| Valores no se cargan al editar | Verificar includes de Prisma en `[id]/page.tsx` |
| Creación inline falla | Verificar endpoints POST de cada entidad |
| Tests existentes fallan | Ejecutar `npm test` antes de completar sprint |

---

## 8. Criterios de finalización

Este Sprint se considera completado cuando se cumplan **todos** los siguientes criterios:

- [ ] `PromptForm.tsx` gestiona `clientProjectIds`, `useCaseIds`, `modelHintIds` como arrays en el estado
- [ ] UI de Client/Project muestra multi-select con badges + creación inline
- [ ] UI de Use Case muestra multi-select con badges + creación inline
- [ ] UI de Model Hint muestra multi-select con badges + creación inline
- [ ] UI de Language es `<Select>` con opciones en, es, nl
- [ ] `handleSubmit` envía los 3 arrays de IDs
- [ ] `handleDuplicate` incluye los 3 arrays de IDs
- [ ] Al editar un prompt, los valores existentes aparecen seleccionados
- [ ] Crear nuevos valores desde el formulario los crea en DB y los selecciona
- [ ] `npm test` pasa sin fallos
- [ ] `npm run build` compila sin errores
- [ ] `npm run lint` no reporta errores
- [ ] `new/page.tsx` pasa las listas de ClientProject, UseCase, ModelHint al formulario
- [ ] `[id]/page.tsx` incluye las 3 relaciones en el include de Prisma
- [ ] **SF-2.1 completada**: Todos los campos de Metadata en PromptForm son multivalor o selector

---

## 9. Riesgos y advertencias

### Incidencias previsibles
1. **Acumulación de estados**: El formulario tendrá muchos estados de arrays (platformIds, categoryIds, clientProjectIds, useCaseIds, modelHintIds, tagIds). Riesgo de complejidad y bugs de estado.
2. **Rendimiento del render**: Muchos badges en pantalla pueden afectar la UX si hay muchos valores disponibles.

### Dependencias sensibles
- **Endpoints de creación**: `POST /api/client-projects`, `POST /api/use-cases`, `POST /api/model-hints` deben existir y funcionar con auth + normalización.
- **Seed data**: Las entidades deben tener datos seed para mostrar opciones disponibles al usuario.

### Limitaciones
- **Compatibilidad dual**: Campos string legacy se mantienen. Este sprint usa exclusivamente arrays.
- **Language**: Solo 3 opciones iniciales (en, es, nl). Ampliable después sin migración.
- **Cierre de SF-2.1**: Este Sprint cierra SF-2.1. El siguiente paso es SF-2.2 (Basic Information) o SF-2.3 (Navegación), que son paralelizables.

---

## 10. Dependencias con Sprints previos

| Sprint previo | Qué aporta a este Sprint | Estado |
|---------------|-------------------------|--------|
| **SF-1.1-S1** | Modelos ClientProject, UseCase, ModelHint + junction tables | ✅ Completado |
| **SF-1.2-S1** | API acepta arrays para los 3 campos; $transaction | ✅ Completado |
| **SF-1.3-S1** | Seed data para las 3 entidades | ✅ Completado |
| **SF2.1-S1** | Patrón de multi-select con badges + creación inline reutilizable | ✅ Completado |

---

## 11. Cierre de Subfase SF-2.1

Al completar este Sprint, SF-2.1 queda cerrada. Todos los campos de Metadata en PromptForm han evolucionado:

| Campo | Estado anterior | Estado tras SF-2.1 |
|-------|----------------|-------------------|
| Platform | Select simple | ✅ Multi-select + creación inline |
| Category | Select simple | ✅ Multi-select (solo existentes) |
| Client/Project | Input texto | ✅ Multi-select + creación inline |
| Use Case | Input texto | ✅ Multi-select + creación inline |
| Model Hint | Input texto | ✅ Multi-select + creación inline |
| Language | Input texto libre | ✅ Selector (en, es, nl) |
| Tags | Multi-select (existente) | ✅ Sin cambios (ya cumplía) |

### Validación de Subfase
- Ver `doc-plan/doc-base/04-Phases-Subphases-Plan.md` §Fase 2, SF-2.1: "Formulario envía y recibe arrays de IDs; selección múltiple funciona para Platform, Category, Client/Project, Use Case, Model Hint; creación inline de nuevos valores funciona (D-06); Language es selector con en/es/nl (D-05)"

### Despliegue de Subfase
- Obligatorio según `04-Phases-Subphases-Plan.md`: "El formulario sin multivalor es inutilizable con el nuevo schema"

### Revisión de usuario
- Obligatoria: "Probar alta y edición de prompt con múltiples valores en cada campo multivalor"
