# Debug Report: Reordenamiento de Campos Metadata en PromptForm

## Índice de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis de la Imagen de Referencia](#análisis-de-la-imagen-de-referencia)
3. [Orden Actual vs Orden Esperado](#orden-actual-vs-orden-esperado)
4. [Análisis del Código Actual](#análisis-del-código-actual)
5. [Mecanismo de Renderizado](#mecanismo-de-renderizado)
6. [Dependencias y Efectos Colaterales](#dependencias-y-efectos-colaterales)
7. [Hipótesis Descartadas](#hipótesis-descartadas)
8. [Plan de Corrección](#plan-de-corrección)
9. [Validaciones Posteriores](#validaciones-posteriores)

---

## Resumen Ejecutivo

**Problema:** Los campos de metadata en el formulario de prompts (`PromptForm.tsx`) no están en el orden especificado por el diseño UI.

**Ubicación:** `components/prompt/PromptForm.tsx`, sección Metadata (líneas 633-971)

**Impacto:** Experiencia de usuario inconsistente con el diseño esperado.

**Solución:** Reordenar los bloques de código JSX dentro de la sección Metadata.

---

## Análisis de la Imagen de Referencia

**Archivo:** `temp/F01.png`

**Campos numerados en la imagen:**

| Número | Campo | Tipo de Input |
|--------|-------|---------------|
| 1 | Type | Select dropdown |
| 2 | Status | Select dropdown |
| 3 | Category | Badges multi-select |
| 4 | Tags | Badges multi-select |
| 5 | Use Case | Badges multi-select |
| 6 | Client/Project | Badges multi-select |
| 7 | Platform | Badges multi-select + input |
| 8 | Model Hint | Badges multi-select + input |
| 9 | Language | Select dropdown |
| 10 | Mark as favorite | Checkbox (sin número, al final) |

---

## Orden Actual vs Orden Esperado

### Orden Actual en el Código (líneas 633-971)

```
1. Type (líneas 638-655)
2. Platform (líneas 657-703)
3. Model Hint (líneas 705-751)
4. Language (líneas 753-777)
5. Use Case (líneas 779-825)
6. Client/Project (líneas 827-873)
7. Status (líneas 875-892)
8. Category (líneas 894-923)
9. Tags (líneas 925-954)
10. Mark as favorite (líneas 956-969)
```

### Orden Esperado (según F01.png)

```
1. Type
2. Status
3. Category
4. Tags
5. Use Case
6. Client/Project
7. Platform
8. Model Hint
9. Language
10. Mark as favorite
```

### Discrepancias Identificadas

| Posición | Actual | Esperado |
|----------|--------|----------|
| 2 | Platform | Status |
| 3 | Model Hint | Category |
| 4 | Language | Tags |
| 5 | Use Case | Use Case ✅ |
| 6 | Client/Project | Client/Project ✅ |
| 7 | Status | Platform |
| 8 | Category | Model Hint |
| 9 | Tags | Language |

---

## Análisis del Código Actual

### Estructura del Componente

**Archivo:** `components/prompt/PromptForm.tsx`

**Sección Metadata:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Metadata</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Campos aquí */}
  </CardContent>
</Card>
```

### Dependencias de Estado

Cada campo usa:
- `formData` state para valores (type, status, language)
- `selected*` states para multi-selects (selectedPlatforms, selectedCategories, etc.)
- `toggle*` functions para selección/deselección
- `*` props para listas disponibles (platforms, categories, tags, etc.)

### Estado Local Relevante

```typescript
// Líneas 98-173
const [formData, setFormData] = useState<{
  type: string
  status: string
  language: string
  // ... otros campos
}>

const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
const [selectedTags, setSelectedTags] = useState<Tag[]>([])
const [selectedClientProjects, setSelectedClientProjects] = useState<ClientProject[]>([])
const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([])
const [selectedModelHints, setSelectedModelHints] = useState<ModelHint[]>([])
```

### Funciones Toggle

```typescript
// Líneas 306-352
const toggleTag = (tag: Tag) => { ... }
const togglePlatform = (platform: Platform) => { ... }
const toggleCategory = (category: Category) => { ... }
const toggleClientProject = (clientProject: ClientProject) => { ... }
const toggleUseCase = (useCase: UseCase) => { ... }
const toggleModelHint = (modelHint: ModelHint) => { ... }
```

---

## Mecanismo de Renderizado

### ¿De qué depende el orden?

**Respuesta:** El orden depende **exclusivamente** del orden estático de los bloques JSX dentro del `CardContent`.

**No depende de:**
- ❌ Arrays de metadata
- ❌ Configuración externa
- ❌ Props dinámicas
- ❌ Estado local
- ❌ Lógica condicional
- ❌ Esquemas de validación

**Depende de:**
- ✅ Orden de escritura en el código JSX
- ✅ Estructura estática del componente

### ¿Por qué es seguro reordenar?

1. **Cada campo es independiente:** No hay dependencias entre los campos
2. **Estado compartido:** Todos usan el mismo `formData` y estados `selected*`
3. **Sin efectos secundarios:** El orden de renderizado no afecta la lógica
4. **Props estables:** Las listas (platforms, categories, etc.) vienen del padre

---

## Dependencias y Efectos Colaterales

### Posibles Efectos Colaterales

1. **Validaciones del formulario:**
   - Estado: ✅ No afectadas
   - Razón: Las validaciones están en los campos individuales, no en el orden

2. **Persistencia de datos:**
   - Estado: ✅ No afectada
   - Razón: El payload se construye con `formData` y `selected*`, independiente del orden visual

3. **API:**
   - Estado: ✅ No afectada
   - Razón: La API recibe el mismo payload sin importar el orden UI

4. **Tests:**
   - Estado: ⚠️ Podrían requerir actualización si prueban orden específico
   - Acción: Verificar tests existentes

5. **Accesibilidad:**
   - Estado: ✅ No afectada
   - Razón: El orden tabular sigue siendo lógico

### Campos Relacionados

| Campo | Depende de | Afecta a |
|-------|------------|----------|
| Type | formData.type | Ninguno |
| Status | formData.status | Ninguno |
| Category | selectedCategories | Ninguno |
| Tags | selectedTags | Ninguno |
| Use Case | selectedUseCases | Ninguno |
| Client/Project | selectedClientProjects | Ninguno |
| Platform | selectedPlatforms | Ninguno |
| Model Hint | selectedModelHints | Ninguno |
| Language | formData.language | Ninguno |
| Favorite | formData.isFavorite | Ninguno |

**Conclusión:** Todos los campos son independientes entre sí.

---

## Hipótesis Descartadas

| Hipótesis | Estado | Razón |
|-----------|--------|-------|
| El orden viene del modelo Prisma | ❌ Descartada | El modelo no define orden UI |
| El orden viene de la API | ❌ Descartada | La API no especifica orden de campos |
| Hay configuración externa | ❌ Descartada | No existe archivo de configuración de orden |
| El orden afecta validaciones | ❌ Descartada | Validaciones son por campo individual |
| El orden afecta el payload | ❌ Descartada | Payload se construye desde estado, no desde UI |
| Hay dependencias entre campos | ❌ Descartada | Todos los campos son independientes |
| El orden viene de props | ❌ Descartada | Las props son listas de opciones, no orden |

---

## Plan de Corrección

### Acción Requerida

Reordenar los bloques JSX dentro de `CardContent` en `components/prompt/PromptForm.tsx`.

### Nuevo Orden de Líneas

```
1. Type (mantener líneas 638-655)
2. Status (mover de 875-892 a después de Type)
3. Category (mover de 894-923 a después de Status)
4. Tags (mover de 925-954 a después de Category)
5. Use Case (mantener líneas 779-825 en posición 5)
6. Client/Project (mantener líneas 827-873 en posición 6)
7. Platform (mover de 657-703 a después de Client/Project)
8. Model Hint (mover de 705-751 a después de Platform)
9. Language (mover de 753-777 a después de Model Hint)
10. Favorite (mantener al final)
```

### Archivos a Modificar

| Archivo | Cambio | Líneas Afectadas |
|---------|--------|------------------|
| `components/prompt/PromptForm.tsx` | Reordenar bloques JSX | 633-971 |

### Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| Error de sintaxis | Baja | Verificar cierre de tags |
| Pérdida de funcionalidad | Baja | Mantener lógica intacta |
| Tests fallan | Media | Actualizar tests si existen |

---

## Validaciones Posteriores

### Checklist de Validación

- [ ] Formulario muestra campos en orden: Type, Status, Category, Tags, Use Case, Client/Project, Platform, Model Hint, Language, Favorite
- [ ] Crear prompt funciona correctamente
- [ ] Editar prompt funciona correctamente
- [ ] Validaciones de campos activas
- [ ] Datos se guardan en base de datos
- [ ] API recibe payload correcto
- [ ] No hay errores en consola
- [ ] Tests pasan (si existen)

### Comandos de Validación

```bash
# Build
npm run build

# Type check
npx tsc --noEmit

# Tests (si existen)
npm test -- PromptForm
```

---

## Fecha de Análisis

**Fecha:** 2026-04-25  
**Analista:** Agente Orquestador  
**Estado:** Debug completado, listo para corrección

---

## Conclusión del Debug

**Causa raíz identificada:** El orden de los campos en la UI está determinado exclusivamente por el orden estático de los bloques JSX en el código fuente.

**Complejidad:** Baja - es un cambio puramente visual/estructural.

**Riesgo:** Bajo - no hay dependencias funcionales entre campos.

**Tiempo estimado de corrección:** 5-10 minutos.

**Acción siguiente:** Proceder con el reordenamiento de bloques JSX en `PromptForm.tsx`.
