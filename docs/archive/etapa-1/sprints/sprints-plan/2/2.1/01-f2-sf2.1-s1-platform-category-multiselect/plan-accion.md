# F2-SF2.1-S1 — Platform + Category Multi-Select en PromptForm

**Versión**: 1.0  
**Fecha**: 2026-04-24  
**Fase**: 2 — Form Evolution  
**Subfase**: 2.1 — Metadata multivalor en PromptForm  
**Sprint**: 1 de 2  

---

## 1. Identificación

| Campo | Valor |
|-------|-------|
| **Fase** | 2 — Form Evolution |
| **Subfase** | 2.1 — Metadata multivalor en PromptForm |
| **Sprint** | 1 — Platform + Category Multi-Select |
| **Objetivo** | Convertir Platform y Category de selección simple a multi-select en PromptForm, con selección múltiple de valores existentes y creación inline de nuevas platforms. Preparar la infraestructura de estado y payload para los campos restantes (SF2.1-S2). |
| **RF cubiertos** | RF-06 a RF-14, RF-18 (selección existente), RF-21 (quitar seleccionados) |

---

## 2. Base documental aplicada

### Documentos principales
- Ver `doc-plan/doc-base/04-Phases-Subphases-Plan.md` §Fase 2, SF-2.1
- Ver `doc-plan/doc-base/04-Phases-Subphases-Plan-Definicion.md` §4.2-4.3 (definición de Subfase y Sprint)
- Ver `doc-plan/doc-base/02-Improvement-Spec.md` §1.1.b-c (Platform y Category multivalor)
- Ver `doc-plan/doc-base/03-Tech-Intervention-Plan.md` §4.3-4.4 (ampliación e intervención estructural)

### Documentos parciales aplicados
- Ver `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md` §3-6 (capas y archivos implicados)
- Ver `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md` §4 (tabla maestra de cambios: PromptForm state, Platform, Category)
- Ver `doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md` §5 (RF-06 a RF-14 no soportados)

### Decisiones aplicadas
- Ver `doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md` §7: D-01 (tablas nuevas + N:M), D-06 (creación inline con normalización), D-07 ($transaction)

### Informes previos de la Subfase
- No existen (primer Sprint de SF-2.1)

### Gobernanza aplicada
- Ver `.gobernanza/.governance/reglas_proyecto.md`: R1 (no asumir valores), R5 (idioma inglés en código), R11 (calidad antes de commit)
- Ver `.gobernanza/.governance/conocimiento_tecnico_preventivo.md` §3 (IDs compuestos en junction tables), §8.1 ($transaction explícito)
- Ver `.gobernanza/.governance/integracion-prisma-typescript.md`: tipos Prisma para Platform, PromptPlatform, Category, PromptCategory

---

## 3. Alcance del Sprint

### Qué debe conseguir este Sprint
1. **Platform multi-select**: El usuario puede seleccionar múltiples platforms existentes y crear nuevas desde el formulario con selección inmediata
2. **Category multi-select**: El usuario puede seleccionar múltiples categorías existentes (sin creación inline, fuera de alcance)
3. **Estado del formulario**: `formData` gestiona `platformIds: string[]` y `categoryIds: string[]` en lugar de `platform: string` y `categoryId: string | null`
4. **Payload de API**: handleSubmit envía `platformIds` y `categoryIds` como arrays
5. **Carga de datos existentes**: Al editar un prompt, las platforms y categories asociadas se muestran como seleccionadas
6. **Tests**: Tests existentes pasan sin regresión; nuevos tests para multi-select de Platform y Category

### Qué NO entra en este Sprint
- Client/Project, Use Case, Model Hint multi-select (SF2.1-S2)
- Language como selector (SF2.1-S2)
- Navegación post-guardado (SF-2.3)
- Nuevos campos Basic Information (SF-2.2)
- Eliminación de campos string legacy del schema (se mantienen para compatibilidad dual)
- Cambios en API routes (ya soportan arrays desde SF-1.2)
- Cambios en Zod schemas (ya aceptan arrays desde SF-1.2)

---

## 4. Elementos afectados

### Archivos concretos
| Archivo | Ruta | Tipo de cambio |
|---------|------|----------------|
| `PromptForm.tsx` | `components/prompt/PromptForm.tsx` | **Modificación principal**: estado, UI de Platform y Category, payload |
| `PromptForm.tsx` (interface) | `components/prompt/PromptForm.tsx:34-56` | **Modificación**: `PromptFormProps.prompt` debe incluir `platforms` y `categories` con datos completos |
| `page.tsx` (new) | `app/(app)/prompts/new/page.tsx` | **Modificación menor**: pasar datos de platforms al formulario |
| `page.tsx` (edit) | `app/(app)/prompts/[id]/page.tsx` | **Modificación menor**: incluir platforms en include de Prisma |

### Módulos y componentes
- **PromptForm state**: `formData` cambia `platform: string` → `platformIds: string[]`, `categoryId: string | null` → `categoryIds: string[]`
- **Platform selector**: De `<Select>` simple a patrón multi-select con badges (igual que tags) + input de creación inline
- **Category selector**: De `<Select>` simple a patrón multi-select con badges (igual que tags, sin creación inline)
- **Payload construction**: `handleSubmit` envía `platformIds` y `categoryIds` en lugar de `platform` y `categoryId`

### Configuración
- Ninguna nueva configuración requerida

### Datos
- Entidades `Platform` ya existen con seed data (SF-1.1-S1, SF-1.3-S1)
- Junction tables `PromptPlatform` y `PromptCategory` ya existen (SF-1.1-S1, SF-1.1-S2)
- API routes ya aceptan arrays (SF-1.2-S1)

---

## 5. Plan de acción

### Acción 1: Actualizar interface PromptFormProps
**Qué**: Modificar `PromptFormProps` para que `prompt` incluya platforms y categories con datos completos.
**Por qué**: El formulario necesita recibir las relaciones N:M cargadas para mostrar las selecciones existentes al editar.
**Archivo**: `components/prompt/PromptForm.tsx:34-56`
**Detalle**:
```typescript
interface PromptFormProps {
  prompt?: {
    // ... campos existentes
    platforms: { platform: { id: string; name: string } }[]  // NUEVO
    categories: { category: { id: string; name: string } }[]  // CAMBIAR: ya existe pero verificar estructura
    // ... resto
  }
  categories: Category[]  // existente
  tags: Tag[]  // existente
  platforms: { id: string; name: string }[]  // NUEVO: lista de todas las platforms
}
```

### Acción 2: Actualizar estado del formulario (formData)
**Qué**: Cambiar `platform: string` → `platformIds: string[]` y `categoryId: string | null` → `categoryIds: string[]` en el estado `formData`.
**Por qué**: El formulario debe gestionar arrays de IDs para campos multivalor.
**Archivo**: `components/prompt/PromptForm.tsx:62-96`
**Detalle**:
- Eliminar `platform: string` del tipo de `formData`
- Añadir `platformIds: string[]` al tipo de `formData`
- Eliminar `categoryId: string | null` del tipo de `formData`
- Añadir `categoryIds: string[]` al tipo de `formData`
- Inicializar `platformIds` desde `prompt?.platforms.map(p => p.platform.id) || []`
- Inicializar `categoryIds` desde `prompt?.categories.map(c => c.category.id) || []`

### Acción 3: Crear estado para selectedPlatforms y selectedCategories
**Qué**: Añadir estados `selectedPlatforms` y `selectedCategories` siguiendo el patrón de `selectedTags`.
**Por qué**: Necesario para gestionar la UI de badges seleccionados vs disponibles.
**Archivo**: `components/prompt/PromptForm.tsx` (después de línea 100)
**Detalle**:
```typescript
const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(
  prompt?.platforms.map((p) => p.platform as Platform) || []
)
const [selectedCategories, setSelectedCategories] = useState<Category[]>(
  prompt?.categories.map((c) => c.category as Category) || []
)
```

### Acción 4: Crear funciones togglePlatform y toggleCategory
**Qué**: Funciones para añadir/quitar platforms y categories del estado seleccionado.
**Por qué**: Patrón idéntico a `toggleTag` (línea 218-224).
**Archivo**: `components/prompt/PromptForm.tsx` (junto a `toggleTag`)
**Detalle**:
```typescript
const togglePlatform = (platform: Platform) => {
  if (selectedPlatforms.find((p) => p.id === platform.id)) {
    setSelectedPlatforms(selectedPlatforms.filter((p) => p.id !== platform.id))
  } else {
    setSelectedPlatforms([...selectedPlatforms, platform])
  }
}
// Mismo patrón para toggleCategory
```

### Acción 5: Crear función de creación inline de Platform
**Qué**: Función que crea una nueva Platform vía `POST /api/platforms` y la añade a la selección.
**Por qué**: RF-08 y RF-09 requieren crear platforms nuevas desde el formulario con selección inmediata.
**Archivo**: `components/prompt/PromptForm.tsx`
**Detalle**:
- Input de texto para nombre de nueva platform
- Botón "Create" o Enter para crear
- `POST /api/platforms` con `{ name: inputValue }` (el backend aplica normalización trim + lowercase, D-06)
- Al recibir respuesta, añadir la platform creada a `selectedPlatforms`
- Validar que el input no esté vacío antes de crear

### Acción 6: Reemplazar UI de Platform (Select → multi-select)
**Qué**: Sustituir el `<Select>` simple de Platform (líneas 328-345) por patrón multi-select con badges.
**Por qué**: RF-06 a RF-11 requieren selección múltiple de platforms.
**Archivo**: `components/prompt/PromptForm.tsx:328-345`
**Detalle**:
- Sección de badges seleccionados (como tags, líneas 439-449)
- Sección de badges disponibles para seleccionar (como tags, líneas 451-463)
- Input de creación inline al final de la sección
- Etiqueta "Platform" se mantiene

### Acción 7: Reemplazar UI de Category (Select → multi-select)
**Qué**: Sustituir el `<Select>` simple de Category (líneas 414-433) por patrón multi-select con badges.
**Por qué**: RF-12 a RF-14 requieren selección múltiple de categorías.
**Archivo**: `components/prompt/PromptForm.tsx:414-433`
**Detalle**:
- Mismo patrón de badges que Platform, pero **sin** input de creación inline (las categorías solo se seleccionan, no se crean desde el formulario)
- Mostrar categorías disponibles que no están seleccionadas
- Mantener orden alfabético o por jerarquía si es relevante

### Acción 8: Actualizar handleSubmit para enviar arrays
**Qué**: Modificar el payload de `handleSubmit` para enviar `platformIds` y `categoryIds`.
**Por qué**: La API espera arrays de IDs (SF-1.2-S1 ya lo soporta).
**Archivo**: `components/prompt/PromptForm.tsx:102-137`
**Detalle**:
```typescript
const payload = {
  ...formData,
  platformIds: selectedPlatforms.map((p) => p.id),
  categoryIds: selectedCategories.map((c) => c.id),
  tagIds: selectedTags.map((t) => t.id),
  // Eliminar: platform, categoryId del payload
}
```
- Eliminar `categoryId: formData.categoryId` del payload
- No enviar `platform` (campo legacy) si `platformIds` tiene valores

### Acción 9: Actualizar handleDuplicate para incluir arrays
**Qué**: Modificar el payload de `handleDuplicate` para incluir `platformIds` y `categoryIds`.
**Por qué**: El duplicado debe copiar todas las relaciones N:M.
**Archivo**: `components/prompt/PromptForm.tsx:140-176`
**Detalle**: Mismo patrón que Acción 8.

### Acción 10: Actualizar páginas que pasan datos al formulario
**Qué**: Asegurar que `new/page.tsx` y `[id]/page.tsx` pasan `platforms` al formulario.
**Por qué**: El formulario necesita la lista de todas las platforms para mostrar las disponibles.
**Archivos**:
- `app/(app)/prompts/new/page.tsx`: fetch de `GET /api/platforms` y pasar como prop
- `app/(app)/prompts/[id]/page.tsx`: incluir `platforms: { include: { platform: true } }` en el include de Prisma

### Acción 11: Verificar compatibilidad con campos legacy
**Qué**: Confirmar que el formulario no envía `platform` ni `categoryId` cuando envía los arrays nuevos.
**Por qué**: La API acepta ambos formatos durante la transición (SF-1.2-S1), pero el formulario nuevo debe usar el formato nuevo.
**Validación**: Revisar payload de handleSubmit y handleDuplicate.

---

## 6. Validación y pruebas

### Qué debe validarse
1. **Platform multi-select**: Seleccionar/deseleccionar múltiples platforms funciona correctamente
2. **Category multi-select**: Seleccionar/deseleccionar múltiples categories funciona correctamente
3. **Creación inline de Platform**: Crear una nueva platform desde el formulario la añade a la selección
4. **Carga de datos existentes**: Al editar un prompt, las platforms y categories asociadas aparecen seleccionadas
5. **Guardado**: El prompt se guarda correctamente con las relaciones N:M
6. **Duplicado**: Duplicar un prompt copia las relaciones de platform y category

### Pruebas a ejecutar
- `npm test`: Todos los tests existentes deben pasar (30+ tests actuales)
- Tests manuales:
  - Crear prompt con 2+ platforms y 2+ categories → verificar en DB (Prisma Studio)
  - Editar prompt existente → verificar que selections se cargan correctamente
  - Crear nueva platform desde formulario → verificar que se crea en DB y queda seleccionada
  - Duplicar prompt → verificar que las relaciones se copian

### Mecanismos existentes del repositorio
- Ver `doc-plan/doc-implementar/conocimiento-tec/05-validacion-tecnica.md` §7.2 (Jest + Testing Library, mocks de Prisma)
- Tests existentes en `tests/api/prompts.test.ts` deben pasar sin regresión
- `npm run build`: Compilación sin errores de TypeScript
- `npm run lint`: ESLint sin errores

---

## 7. Seguridad y no regresión

### Qué debe preservarse
- **Auth en API routes**: La API de prompts ya requiere autenticación (SF-1.2-S1). No cambiar.
- **Ownership check**: `checkOwnership` en `[id]/route.ts` debe seguir funcionando para PUT.
- **Zod validation**: Los schemas ya aceptan arrays (SF-1.2-S1). No modificar schemas en este sprint.
- **$transaction**: La API ya usa `$transaction` para delete+create de relaciones (SF-1.2-S1, D-07). No modificar.

### Qué debe revisarse
- **Creación inline de Platform**: El endpoint `POST /api/platforms` debe requerir autenticación (ya lo hace desde SF-1.2-S1). Verificar que aplica normalización (trim + lowercase) según D-06.
- **Payload del formulario**: Confirmar que no se envían datos sensibles o inesperados.

### Riesgos de regresión
| Riesgo | Mitigación |
|--------|-----------|
| Formulario deja de guardar | Verificar payload contra schema Zod existente; tests de API |
| Platform/Category no se cargan al editar | Verificar include de Prisma en `[id]/page.tsx` |
| Creación inline de platform falla | Verificar que `POST /api/platforms` responde con el objeto creado |
| Tests existentes fallan | Ejecutar `npm test` antes de considerar sprint completado |

---

## 8. Criterios de finalización

Este Sprint se considera completado cuando se cumplan **todos** los siguientes criterios:

- [ ] `PromptForm.tsx` gestiona `platformIds: string[]` y `categoryIds: string[]` en el estado
- [ ] UI de Platform muestra badges seleccionados + disponibles + input de creación inline
- [ ] UI de Category muestra badges seleccionados + disponibles (sin creación inline)
- [ ] `handleSubmit` envía `platformIds` y `categoryIds` como arrays
- [ ] `handleDuplicate` incluye `platformIds` y `categoryIds` en el payload
- [ ] Al editar un prompt, las platforms y categories existentes aparecen seleccionadas
- [ ] Crear una nueva platform desde el formulario la crea en DB y la selecciona
- [ ] `npm test` pasa sin fallos (todos los tests existentes + nuevos si se añaden)
- [ ] `npm run build` compila sin errores de TypeScript
- [ ] `npm run lint` no reporta errores
- [ ] `new/page.tsx` pasa la lista de platforms al formulario
- [ ] `[id]/page.tsx` incluye `platforms` en el include de Prisma

---

## 9. Riesgos y advertencias

### Incidencias previsibles
1. **Conflicto de nombres en el estado**: `formData` ya tiene muchos campos. Añadir `platformIds` y `categoryIds` requiere cuidado para no romper referencias existentes a `platform` y `categoryId`.
2. **Carga de datos existentes**: Si la página `[id]/page.tsx` no incluye `platforms` en el include de Prisma, el formulario no recibirá las platforms asociadas.

### Dependencias sensibles
- **API de Platform**: `POST /api/platforms` debe existir y funcionar con autenticación (verificado en SF-1.2-S1). Si no existe, bloquea la creación inline.
- **Include de Prisma**: `[id]/page.tsx` debe incluir `platforms: { include: { platform: true } }` para que el formulario reciba los datos.

### Limitaciones y alertas
- **Compatibilidad dual**: Los campos string legacy (`platform`, `categoryId`) se mantienen en el schema y la API durante la transición. Este sprint usa exclusivamente el formato nuevo (arrays).
- **Category tree**: Las categorías tienen estructura jerárquica (`parentId`). El multi-select es plano; no se muestra la jerarquía en este sprint.
- **No se eliminan campos legacy**: La eliminación de `platform` y `categoryId` del schema corresponde a un sprint futuro (probablemente SF-1.3 o posterior).

---

## 10. Dependencias con Sprints previos

| Sprint previo | Qué aporta a este Sprint | Estado |
|---------------|-------------------------|--------|
| **SF-1.1-S1** (Core Entities) | Modelos `Platform`, `PromptPlatform`, `PromptCategory` creados | ✅ Completado |
| **SF-1.1-S2** (Junction Tables) | Junction tables con IDs compuestos, migración aplicada | ✅ Completado |
| **SF-1.2-S1** (Zod + API N:M) | API acepta `platformIds[]` y `categoryIds[]`; `$transaction` implementado | ✅ Completado |
| **SF-1.3-S1** (Data Migration) | Seed data de Platforms y Categories; migración de datos existentes | ✅ Completado |

---

## 11. Preparación para SF2.1-S2

Al completar este Sprint, el siguiente Sprint (Client/Project, Use Case, Model Hint multi-select + Language selector) debe poder:
- Reutilizar el patrón de multi-select con badges implementado para Platform y Category
- Reutilizar el patrón de creación inline implementado para Platform
- Reutilizar las funciones toggle para los nuevos campos
- Reutilizar la estructura de `formData` con arrays de IDs

El estado del formulario tras este Sprint tendrá:
- `platformIds: string[]` ✅
- `categoryIds: string[]` ✅
- `clientOrProject: string` ⏳ (pendiente SF2.1-S2)
- `useCase: string` ⏳ (pendiente SF2.1-S2)
- `modelHint: string` ⏳ (pendiente SF2.1-S2)
- `language: string` ⏳ (pendiente SF2.1-S2)
