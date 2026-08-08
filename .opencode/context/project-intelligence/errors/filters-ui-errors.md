<!-- Context: project-intelligence/errors/filters-ui-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Filtros Multi-Select y UI

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Multi-Select con Badges + Creación Inline para Campos N:M

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

## 2. Include de Relaciones N:M en Páginas Next.js

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

## 3. Verificación de DB antes de Build en Desarrollo

**Estado:** ✅ Validado  
**Código:** `npm run build`, `docker-compose.dev.yml`  
**Descripción:** Next.js build requiere DB disponible para generar páginas estáticas que fetchean datos.

**Prevención:**
- Iniciar PostgreSQL antes de build: `docker-compose -f docker-compose.dev.yml up -d postgres`
- Verificar migrations aplicadas: `npx prisma migrate status`
- Cargar variables de entorno: `set -a && source .env.development && set +a`

**Riesgo:** Build falla con error "The table 'public.X' does not exist".

---

## 4. Selector de Idioma con Códigos ISO

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

## 5. Enum de Idiomas Inclusivo desde el Inicio

**Estado:** ✅ Validado  
**Código:** `app/api/prompts/route.ts`, `app/api/prompts/[id]/route.ts`  
**Descripción:** Incluir TODOS los idiomas requeridos (incluyendo regionales) desde el inicio evita refactor posterior. Ampliar enum después requiere migración de datos.

**Prevención:**
- Consultar con usuario TODOS los idiomas requeridos ANTES de implementar
- Incluir idiomas regionales desde el inicio (catalán/valenciano, vasco, gallego, etc.)
- Usar nombres correctos con acentos y formatos apropiados
- Usar `.default("es")` para español como idioma por defecto

---
