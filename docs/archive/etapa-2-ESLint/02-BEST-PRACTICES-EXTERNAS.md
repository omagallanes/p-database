# Plan A — Best Practices Externas Consultadas

**Creado:** 2026-07-14
**Propósito:** Referencia de documentación externa consultada para la configuración de ESLint y corrección de tipos.
**Estado:** Completado

## Fuentes consultadas

### Next.js — Documentación oficial de ESLint
**Archivo:** `.opencode/external-context/nextjs/eslint-configuration.md`
**Hallazgos clave:**
- Next.js 14 usa ESLint 8 con formato legacy (`.eslintrc.json`), no flat config
- `next/core-web-vitals` extiende `next` + `@next/next/recommended` + `plugin:react-hooks/recommended`
- Para añadir TypeScript: extender `plugin:@typescript-eslint/recommended`
- Para compatibilidad con Prettier: añadir `prettier` al final de `extends`

### typescript-eslint — Reglas y configuraciones
**Archivos:**
- `.opencode/external-context/typescript-eslint/typescript-eslint-config.md`
- `.opencode/external-context/typescript-eslint/recommended-configs.md`

**Hallazgos clave:**
- `plugin:@typescript-eslint/recommended` activa `@typescript-eslint/no-explicit-any` como warn por defecto
- `@typescript-eslint/parser` requiere `parserOptions.projectService: true` para type-checking
- `@typescript-eslint/no-unused-vars` reemplaza a la regla base de ESLint
- Versión instalada: 7.18.0 (compatible con ESLint 8)

### TypeScript — Type Guards y Predicados
**Archivo:** `.opencode/external-context/typescript/type-guards-and-predicates.md`
**Hallazgos clave:**
- `catch(error: unknown)` requiere type guard antes de acceder a propiedades
- Patrón correcto: `if (error instanceof Error && (error as any).code !== 'P2002')`
- Para Prisma específicamente: `error instanceof Prisma.PrismaClientKnownRequestError`

### Next.js ESLint Plugins
**Archivos:** `.opencode/external-context/nextjs-eslint/*.md`
**Hallazgos clave:**
- `eslint-plugin-next` bundled con Next.js 14
- `eslint-plugin-jsx-a11y@6.10.2` pre-instalado
- `eslint-plugin-import@2.32.0` pre-instalado
- No requiere instalación adicional de plugins Next.js

## Decisiones técnicas basadas en estas fuentes

| Decisión | Fundamento |
|----------|------------|
| Usar `.eslintrc.json` (no flat config) | Next.js 14 usa ESLint 8 legacy |
| Extender `plugin:@typescript-eslint/recommended` | Provee reglas TypeScript sin configuración manual |
| `no-explicit-any` como **warn** (no error) | Migración gradual — hay 11 ocurrencias que corregir en Fase 2 |
| `no-console` como warn con allow `warn/error` | Estándar del proyecto — `console.log` se reemplaza por `console.warn` |
| `parserOptions.projectService: true` | typescript-eslint v7+ recomienda `projectService` en vez de `project` |
| `eslint-config-prettier` al final de `extends` | Debe ser el último para que sobreescriba reglas de formato |

## Reglas de ESLint finales

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

## Referencias

| Recurso | Ubicación |
|---------|-----------|
| Next.js ESLint docs | `.opencode/external-context/nextjs/eslint-configuration.md` |
| typescript-eslint config | `.opencode/external-context/typescript-eslint/typescript-eslint-config.md` |
| typescript-eslint recommended | `.opencode/external-context/typescript-eslint/recommended-configs.md` |
| Type guards | `.opencode/external-context/typescript/type-guards-and-predicates.md` |
| Next.js ESLint plugins | `.opencode/external-context/nextjs-eslint/` (4 archivos) |
| Code quality standards | `.opencode/context/core/standards/code-quality.md` |
| Code analysis standards | `.opencode/context/core/standards/code-analysis.md` |
| Technical domain | `.opencode/context/project-intelligence/technical-domain.md` |
| Living notes | `.opencode/context/project-intelligence/living-notes.md` |
