<!-- Context: project-intelligence/errors/navigation-ui-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Navegación y Estado de UI

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Patrón de Navegación Condicional en Next.js App Router

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

## 2. Toggle de Vista con Persistencia de Preferencia

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

## 3. Render Condicional Cards/Lista con Relaciones N:M

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
