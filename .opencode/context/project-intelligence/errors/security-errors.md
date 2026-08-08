<!-- Context: project-intelligence/errors/security-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Seguridad y Autorización

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Auth Check como PRIMERA Operación en API Routes

**Estado:** ✅ Validado  
**Código:** `app/api/export/prompts/route.ts`  
**Descripción:** El auth check debe ejecutarse ANTES de cualquier acceso a base de datos para prevenir exposición de datos sensibles.

**Prevención:**
- Importar `auth()` desde `@/lib/auth` al inicio del archivo
- Ejecutar `const session = await auth()` como PRIMERA línea dentro del handler
- Retornar 401 inmediatamente si `!session?.user?.id`
- Nunca acceder a prisma antes de verificar autenticación

**Código de ejemplo:**
```typescript
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // CRÍTICO: Auth check como PRIMERA operación
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    // AHORA SÍ: acceso a DB con userId verificado
    const prompts = await prisma.prompt.findMany({
      where: { userId: userId }
    })
  }
}
```

**Riesgo:** CRÍTICO - Exposición de datos sensibles de todos los usuarios; vulnerabilidad de seguridad grave.

---

## 2. Filtrado por userId en Queries Multi-Usuario

**Estado:** ✅ Validado  
**Código:** `app/api/export/prompts/route.ts`  
**Descripción:** Todas las queries que leen datos deben filtrar por `userId` del usuario autenticado para garantizar aislamiento de datos entre usuarios.

**Prevención:**
- Siempre usar `where: { userId: session.user.id }` en queries de lectura
- Nunca hacer `findMany()` o `findUnique()` sin filtrar por userId (excepto admin)
- Para endpoints de export/list/search, el filtrado es OBLIGATORIO

**Código de ejemplo:**
```typescript
const prompts = await prisma.prompt.findMany({
  where: {
    userId: userId,  // CRÍTICO: aislamiento de datos
  },
  include: { ... },
})
```

**Riesgo:** CRÍTICO - Usuarios pueden ver datos de otros usuarios; violación de privacidad.

---

## 3. Verificación de Endpoints de Creación (D-06)

**Estado:** ✅ Validado  
**Código:** `app/api/platforms/route.ts`, `app/api/client-projects/route.ts`, `app/api/use-cases/route.ts`, `app/api/model-hints/route.ts`  
**Descripción:** Los endpoints de creación de valores globales deben implementar: (1) auth check como primera operación, (2) normalización de nombres (trim + uppercase), (3) upsert por slug para garantizar unicidad.

**Prevención:**
- Auth check usando `auth()` como primera operación
- Normalización: `name.trim().toUpperCase()` para nombres, `.toLowerCase()` para slugs
- Upsert por slug: `prisma.entity.upsert({ where: { slug }, update: {}, create: { ... } })`
- Zod validation estricta para el input

**Código de ejemplo:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createSchema.parse(body)

    // Normalización: trim + uppercase
    const normalizedName = data.name.trim().toUpperCase()
    const normalizedSlug = normalizedName.toLowerCase()

    // Upsert para evitar duplicados (unicidad por slug)
    const entity = await prisma.entity.upsert({
      where: { slug: normalizedSlug },
      update: {},
      create: { name: normalizedName, slug: normalizedSlug },
    })

    return NextResponse.json({ data: entity }, { status: 201 })
  } catch (error) {
    // ... error handling
  }
}
```

**Riesgo:** Duplicados por case ("GPT-4" vs "gpt-4"); creación de valores sin autenticación.

---

# Testing
