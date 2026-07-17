---
source: Context7 API
library: TypeScript
package: typescript
topic: project-structure-monorepo
fetched: 2026-07-14T10:00:00Z
official_docs: https://www.typescriptlang.org/docs/
---

# TypeScript Project Structure & Monorepo Best Practices

## Root tsconfig.json with Project References

Source: TypeScript compiler source (microsoft/typescript)

Solution root config file that references multiple sub-projects using the 'references' array. This is the parent config for a monorepo with project references.

```json
{
  "files": [],
  "include": [],
  "references": [
    { "path": "./compiler" },
    { "path": "./deprecatedCompat" },
    { "path": "./harness" },
    { "path": "./jsTyping" },
    { "path": "./server" },
    { "path": "./services" },
    { "path": "./testRunner" },
    { "path": "./tsc" },
    { "path": "./tsserver" },
    { "path": "./typescript" },
    { "path": "./typingsInstaller" },
    { "path": "./typingsInstallerCore" },
    { "path": "./watchGuard" }
  ]
}
```

## Basic Project Reference Structure

Source: TypeScript Performance Wiki

This diagram shows a fundamental project reference setup, organizing a codebase into client, server, and shared projects. This structure helps manage dependencies and reduces the number of files loaded in a single compilation.

```text
              ------------
              |          |
              |  Shared  |
              ^----------^
             /            \
            /              \
------------                ------------
|          |                |          |
|  Client  |                |  Server  |
-----^------                ------^-----
```

## Project Reference Structure with Dedicated Test Projects

This diagram extends the basic project reference model by incorporating separate projects for client, server, and shared tests. This further modularizes the codebase and prevents product code from accidentally depending on test code.

```text
              ------------
              |          |
              |  Shared  |
              ^-----^----^
             /      |     \
            /       |      \
------------  ------------  ------------
|          |  |  Shared  |  |          |
|  Client  |  |  Tests   |  |  Server  |
-----^------  ------------  ------^-----
     |                            |
     |                            |
------------                ------------
|  Client  |                |  Server  |
|  Tests   |                |  Tests   |
------------                ------------
```

## Best Practices for File Organization

Source: TypeScript Performance Wiki

- **Specify only input folders** in tsconfig.json
- **Avoid mixing source files from different projects** in the same directory
- **Give test files distinct names** for easy exclusion
- **Prevent large build artifacts** and dependency folders like `node_modules` in source directories
- **`node_modules` is excluded by default**, but if an `exclude` list is added, it must be explicitly included
- **Adding a tsconfig.json file** helps organize projects containing both TypeScript and JavaScript files
