<!-- Context: project-intelligence/errors/nextjs-build-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Next.js y Build

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Error de ESLint en Build por Apóstrofo sin Escapar

**Estado:** 🔧 Corregido  
**Código:** `app/(auth)/auth/signin/page.tsx` (línea 18)  
**Descripción:** ESLint rule `react/no-unescaped-entities` puede romper build.

**Prevención:**
- Escapar caracteres especiales en texto JSX
- Configurar reglas de ESLint apropiadamente para proyectos con texto internacionalizado
- Ejecutar linting como parte del proceso de build

---

## 2. Error de Pre-renderizado Estático con NextAuth.js

**Estado:** 🔧 Parcialmente corregido  
**Código:** `app/(auth)/auth/signin/page.tsx` (línea 4), otras páginas  
**Descripción:** NextAuth.js requiere renderizado dinámico cuando se usan sesiones.

**Prevención:**
- Usar `export const dynamic = 'force-dynamic'` en páginas que usan `auth()`
- Validar que todas las páginas con autenticación sean renderizadas dinámicamente
- Documentar requisitos de renderizado para componentes que acceden a sesión

---

## 3. Serialización de Fechas de Prisma para Componentes Cliente

**Estado:** ✅ Validado  
**Código:** `app/(app)/prompts/[id]/page.tsx`, `components/prompt/PromptForm.tsx`  
**Descripción:** Prisma retorna objetos `Date` pero Next.js no puede serializarlos automáticamente a componentes cliente. Deben serializarse explícitamente a ISO strings.

**Prevención:**
- Serializar fechas en página server component antes de pasar a componente cliente
- Usar `toISOString()` para conversión estándar
- Interface del componente cliente debe esperar `string`, no `Date`

**Código de ejemplo:**
```typescript
// En página server component
const serializedPrompt = {
  ...prompt,
  createdAt: prompt.createdAt.toISOString(),
  updatedAt: prompt.updatedAt.toISOString(),
}
return <PromptForm prompt={serializedPrompt} ... />
```

```typescript
// En componente cliente
interface PromptFormProps {
  prompt?: {
    createdAt: string  // ✅ string, no Date
    updatedAt: string
  }
}
```

**Riesgo:** Error de build: "Type 'Date' is not assignable to type 'string'".

---

## 4. Uso de `output: 'standalone'` en Next.js

**Estado:** 📝 Información adicional  
**Código:** `next.config.js` (línea 7)  
**Descripción:** Next.js configurado para output standalone, generando carpeta autónoma para despliegue en Docker.

**Relevancia preventiva:**
- Usar output standalone para mejorar portabilidad
- Reducir tamaño de imagen Docker
- Validar que configuración de output sea consistente con estrategia de despliegue

---

## 5. Configuración de Server Actions con Límite de Tamaño

**Estado:** 📝 Información adicional  
**Código:** `next.config.js` (líneas 12-15)  
**Descripción:** Server Actions configuradas con `bodySizeLimit: '2mb'`.

**Relevancia preventiva:**
- Configurar límites apropiados para payloads
- Prevenir errores de payload grande en formularios

---

## 6. `prisma db push` para Desarrollo en Entornos No Interactivos

**Estado:** ✅ Validado  
**Código:** `prisma db push`, GitHub Codespaces  
**Descripción:** `prisma migrate dev` requiere entorno interactivo y falla en GitHub Codespaces, CI/CD, Docker. Usar `prisma db push` para desarrollo en entornos no interactivos.

**Prevención:**
- Usar `prisma db push` en Codespaces, GitHub Actions, Docker
- Usar `prisma migrate deploy` en producción
- `prisma db push` sincroniza schema directamente sin crear archivos de migración

**Comandos:**
```bash
# Desarrollo en Codespaces (no interactivo):
prisma db push

# Producción (con migraciones existentes):
prisma migrate deploy
```

**Riesgo:** Error: "Prisma Migrate has detected that the environment is non-interactive".

---

# Filtros y UI
