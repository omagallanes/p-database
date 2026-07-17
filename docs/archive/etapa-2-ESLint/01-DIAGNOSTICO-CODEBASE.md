# Plan A — Diagnóstico del Codebase

**Creado:** 2026-07-14
**Propósito:** Diagnóstico de ESLint, tipos `any` y `console.log` en el codebase antes de la intervención.
**Estado:** Completado

## Resumen del diagnóstico

| Categoría | Cantidad | Severidad |
|-----------|:--------:|:---------:|
| Tipos `any` en producción | 11 | 🔴 Alta |
| `console.log` en producción | 2 | 🟡 Media |
| `catch(error: any)` sin tipo | 4 | 🟡 Media |
| Warnings `no-unused-vars` | 0 (pre-Plan C) | 🟢 Baja |
| Build status | ✅ Compiled successfully | — |

## Detalle de hallazgos

### 1. Tipos `any` — 11 ocurrencias en 5 archivos

| # | Archivo | Línea | Código actual | Tipo correcto |
|:-:|---------|:-----:|:-------------|:--------------|
| 1 | `app/api/prompts/route.ts` | 47 | `const where: any = {}` | `Prisma.PromptWhereInput` |
| 2 | `app/api/users/route.ts` | 58 | `const updateData: any = {}` | `Prisma.UserUpdateInput` |
| 3 | `app/(app)/prompts/page.tsx` | 23 | `const where: any = {}` | `Prisma.PromptWhereInput` |
| 4 | `app/(app)/prompts/page.tsx` | 143 | `const result: any = { ... }` | `TransformedPrompt` (interface) |
| 5 | `app/(app)/categories/page.tsx` | 154 | `(category as any).sortOrder` | `category.sortOrder` (añadir campo a interface `Category`) |
| 6-9 | `prisma/migrate-data.ts` | 78, 116, 132, 139 | `catch (error: any)` | `catch (error: unknown)` + type guard |
| 10 | `tests/api/prompts.test.ts` | 490 | `mockTx: any` | `MockPrismaTransaction` (interface) |
| 11 | `tests/api/prompts.test.ts` | ~500 | `mockTx.$transaction` (uso del any) | Misma interface |

### 2. `console.log` en producción — 2 ocurrencias

| # | Archivo | Línea | Código | Reemplazar por |
|:-:|---------|:-----:|:-------|:--------------|
| 1 | `lib/auth.ts` | 36 | `console.log("Invalid credentials")` | `console.warn(...)` |
| 2 | `lib/auth.ts` | 59 | `console.log(\`New user created: ${user.email}\`)` | `console.warn(...)` |

### 3. ESLint warnings existentes (pre-intervención)

| Tipo | Cantidad | Detalle |
|------|:--------:|---------|
| `react/no-unescaped-entities` | ~10+ | Apóstrofes y comillas en JSX — se suprime con regla warn |
| `prefer-const` | 1 | `let` → `const` en `import/prompts/route.ts` |
| `no-unused-vars` | 0 | Ya limpio |
| `no-explicit-any` | 0 | Regla nueva — se añade como warn |

### 4. Dependencias a instalar

| Paquete | Versión | Propósito |
|---------|:-------:|-----------|
| `@typescript-eslint/eslint-plugin` | 7.18.0 | Reglas TypeScript para ESLint |
| `@typescript-eslint/parser` | 7.18.0 | Parser TypeScript para ESLint |
| `eslint-config-prettier` | 10.1.8 | Compatibilidad ESLint + Prettier |

## Archivos a modificar (8)

```
.eslintrc.json
app/api/prompts/route.ts
app/api/users/route.ts
app/(app)/prompts/page.tsx
app/(app)/categories/page.tsx
tests/api/prompts.test.ts
prisma/migrate-data.ts
lib/auth.ts
```

## Riesgos identificados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| `Prisma.PromptWhereInput` no acepta `OR` con strings | 🟡 Medio | El `OR` usa objetos `{ field: { contains: string } }`, que SÍ es válido para `PromptWhereInput` |
| `Prisma.UserUpdateInput` no acepta strings para `role` | 🟢 Bajo | `role` es enum en Prisma, pero `role: "ADMIN"` se castea automáticamente |
| `instanceof Error` cambia comportamiento en migrate-data.ts | 🟢 Bajo | `P2002` sigue siendo detectable vía `(error as any).code` |

## Resultado post-intervención

| Métrica | Antes | Después |
|---------|:-----:|:-------:|
| Tipos `any` en producción | 11 | 0 |
| `console.log` en producción | 2 | 0 |
| `catch(error: any)` | 4 | 0 |
| ESLint warnings (nuevas reglas) | — | 0 |
| Build | ✅ | ✅ |
| Tests | 56/56 | 56/56 |
