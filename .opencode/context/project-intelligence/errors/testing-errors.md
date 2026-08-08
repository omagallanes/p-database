<!-- Context: project-intelligence/errors/testing-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Testing: Planificación y Mocks

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Verificar Baseline de Tests Antes de Añadir Nuevos

**Estado:** ✅ Validado  
**Código:** `npm test`, `npm test -- --listTests`, `npm test -- --coverage`  
**Descripción:** Antes de añadir tests nuevos, ejecutar `npm test` para verificar que tests existentes pasan, infraestructura funciona, y no hay regresiones. Actualmente (2026-08-06): 388 tests, 40 suites, 100% passing (antes, julio 2026: 56 tests, 8 suites; serie completa del histórico: 60 → 81 → 97 → 147 → 203 → 275 → 338 → 388).

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

## 2. Planificación Detallada Antes de Implementación de Tests

**Estado:** ✅ Validado  
**Descripción:** Crear un plan de acción detallado antes de implementar tests permite identificar qué tests se necesitan, definir criterios de aceptación medibles, estimar esfuerzo y evitar duplicación.

**Prevención:**
- Documentar cada archivo de test a crear
- Especificar tests individuales con descripciones claras
- Definir criterios de aceptación medibles (ej: >= 60% cobertura)
- Identificar dependencias y mocks necesarios

**Riesgo:** Tests incompletos; cobertura insuficiente; duplicación de trabajo.

---

## 3. Documentar Tests Fallidos Pre-Existentes

**Estado:** ✅ Validado  
**Descripción:** Los tests fallidos pre-existentes deben documentarse para no confundirlos con fallos nuevos, planificar su corrección en Sprint futuro, y evitar deuda técnica de testing.

**Prevención:**
- Identificar tests fallidos al inicio del Sprint
- Documentar causa raíz de cada fallo
- Registrar en informe de Sprint como "pre-existente"
- Planificar corrección en Sprint futuro

**Riesgo:** Deuda técnica de testing se acumula; nuevos desarrolladores confunden fallos pre-existentes con regresiones.

---

## 4. Mock de Prisma con $transaction

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

## 5. Zod Validation Requiere Datos Completos en Tests

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

## 6. URLSearchParams No Se Puede Mockear Globalmente

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

## 7. Mocks de Entity Upsert Deben Retornar Estructura Completa

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
