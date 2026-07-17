# temp/eslint/ — Propósito y contenido

**Creado:** 2026-07-16
**Propósito:** Explicación del directorio `temp/eslint/` y su finalidad.

---

## ¿Qué significa ESLint?

**ESLint** significa **E**cma**S**cript **Lint** (o **E**cma**S**cript **Lint**er). Es una herramienta de análisis de código estático para JavaScript y TypeScript que detecta patrones problemáticos, errores de sintaxis, malas prácticas y violaciones de estilo en el código fuente. El término "lint" proviene de una herramienta Unix clásica que examinaba código en busca de fallos.

## Finalidad y objetivo de `temp/eslint/`

El directorio `temp/eslint/` se creó durante la ejecución del **Plan A**, una intervención técnica cuyo objetivo fue configurar ESLint con reglas TypeScript y corregir todos los problemas de tipos en el código base del proyecto.

**Finalidad:** Servir como cuaderno de trabajo temporal donde los agentes de OpenCode (CoderAgent, CodeReviewer, etc.) documentaron el plan, el diagnóstico y las fuentes externas consultadas antes y durante la ejecución de los cambios. Es un directorio de trabajo local (`temp/` está en `.gitignore`), no versionado en git.

## Objetivo concreto que perseguía

| Problema | Solución aplicada | Archivos afectados |
|----------|-------------------|:------------------:|
| 11 tipos `any` en lugar de tipos Prisma concretos | Reemplazar con `Prisma.PromptWhereInput`, `Prisma.UserUpdateInput`, `TransformedPrompt`, etc. | 5 archivos |
| 2 `console.log` en producción | Cambiar a `console.warn` | `lib/auth.ts` |
| 4 `catch(error: any)` sin tipo | Cambiar a `catch(error: unknown)` + guard `instanceof Error` | `prisma/migrate-data.ts` |
| Sin reglas TypeScript en ESLint | Instalar `typescript-eslint` y extender `plugin:@typescript-eslint/recommended` | `.eslintrc.json`, `package.json` |

**Estado:** Completado. Los dos commits `6664d84` y `9d78f7e` contienen todos los cambios. Los tres documentos del directorio (`00-PREPARACION.md`, `01-DIAGNOSTICO-CODEBASE.md`, `02-BEST-PRACTICES-EXTERNAS.md`) son el registro histórico de lo planificado, diagnosticado y aprendido durante esa intervención.
