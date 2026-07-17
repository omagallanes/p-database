# Plan A — Preparación: ESLint Config + Correcciones de Tipo

**Creado:** 2026-07-14
**Propósito:** Documento de preparación para la ejecución del Plan A.
**Estado:** Completado — ver commits `6664d84` y `9d78f7e`

## Objetivo

Configurar ESLint con reglas TypeScript y corregir todos los warnings de tipo y `console.log` en el codebase.

## Estructura del Plan

### Fase 1 — Configuración de ESLint
| Paso | Acción | Commit |
|:----:|--------|:------:|
| 1.1 | Verificar estado actual de ESLint y dependencias | — |
| 1.2 | Consultar documentación externa (Next.js ESLint, typescript-eslint) | — |
| 1.3 | Diagnosticar codebase (warnings actuales, tipos `any`, `console.log`) | — |
| 1.4 | Instalar `@typescript-eslint/eslint-plugin@7.18.0`, `@typescript-eslint/parser`, `eslint-config-prettier@10.1.8` | `6664d84` |
| 1.5 | Editar `.eslintrc.json`: extender `plugin:@typescript-eslint/recommended` + `prettier`, reglas `no-explicit-any`, `no-unused-vars`, `no-console` | `6664d84` |
| 1.6 | `npm run build` para verificar build intacto | `6664d84` |

### Fase 2 — Corrección de Warnings (Type Fixes)
| Paso | Archivo | Cambio | Commit |
|:----:|---------|--------|:------:|
| 2.1 | `.eslintrc.json` | Añadir `react/no-unescaped-entities: warn` | `9d78f7e` |
| 2.2 | `app/api/prompts/route.ts:47` | `any` → `Prisma.PromptWhereInput` | `9d78f7e` |
| 2.3 | `app/api/users/route.ts:58` | `any` → `Prisma.UserUpdateInput` | `9d78f7e` |
| 2.4 | `app/(app)/prompts/page.tsx:23` | `any` → `Prisma.PromptWhereInput` | `9d78f7e` |
| 2.5 | `app/(app)/prompts/page.tsx:143` | `any` → `TransformedPrompt` (interface nueva) | `9d78f7e` |
| 2.6 | `app/(app)/categories/page.tsx:154` | `(category as any)` → `category.sortOrder` (tipo `Category` añade `sortOrder`) | `9d78f7e` |
| 2.7 | `tests/api/prompts.test.ts:490` | `mockTx: any` → `MockPrismaTransaction` (interface de test) | `9d78f7e` |
| 2.8 | `prisma/migrate-data.ts` (4 líneas) | `catch(error: any)` → `catch(error: unknown)` + `instanceof Error` guard | `9d78f7e` |
| 2.9 | `lib/auth.ts:36,59` | `console.log` → `console.warn` | `9d78f7e` |

### Fase 3 — Verificación Final
| Paso | Acción | Resultado |
|:----:|--------|:---------:|
| 3.1 | `npm run lint` | ✅ 0 warnings de reglas nuevas |
| 3.2 | `npm run build` | ✅ Compiled successfully |
| 3.3 | `npm test` | ✅ Todos pasan |
| 3.4 | CodeReviewer | ✅ Aprobado |
| 3.5 | Commit `9d78f7e` | ✅ `fix: replace any types with proper Prisma types and interfaces` |

## Reglas de ESLint configuradas

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "projectService": true,
    "tsconfigRootDir": "."
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "react/no-unescaped-entities": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

## Constraints
- Next.js 14 usa ESLint 8 (legacy `.eslintrc`, no flat config)
- No modificar lógica de negocio — solo ESLint config + type fixes
- CodeReviewer debe revisar cada batch antes de pasar al siguiente
- `react/no-unescaped-entities` es un issue conocido (living-notes.md)
- `eslint-plugin-import@2.32.0` ya bundled, `eslint-plugin-jsx-a11y@6.10.2` ya bundled

## Exit Criteria
- [x] `npm run lint` → 0 warnings de reglas nuevas
- [x] `npm run build` → Compiled successfully
- [x] `npm test` → 56 tests pass (8 suites)
- [x] Todos los `any` reemplazados con tipos Prisma o interfaces explícitas
- [x] Sin `console.log` en código de producción (solo `console.warn`/`console.error`)
- [x] CodeReviewer aprobó cada batch
