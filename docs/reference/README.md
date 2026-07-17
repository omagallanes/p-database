# docs/reference/ — Referencia Técnica

**Propósito:** Documentación técnica de referencia sobre la arquitectura, configuración y operación del proyecto.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `api-endpoints.md` | Rutas de la API REST |
| `architecture.md` | Visión general del sistema |
| `auth-setup.md` | Configuración de NextAuth.js |
| `commands.md` | Scripts de package.json |
| `db-schema.md` | Esquema de base de datos |
| `env-resources.md` | Variables de entorno y configuración |
| `prisma-setup.md` | Setup y patrones de Prisma ORM |
| `tech-knowledge.md` | Guías técnicas del proyecto |
| `README.md` | Este archivo |

## Contenido por área

### Infraestructura y entorno
- **`env-resources.md`** — Variables de entorno necesarias (base de datos, autenticación, Vercel, etc.)
- **`architecture.md`** — Visión general: stack tecnológico (Next.js 14, Prisma, PostgreSQL, Vercel), estructura de directorios y decisiones arquitectónicas.

### Base de datos
- **`db-schema.md`** — Esquema relacional: tablas, relaciones, índices y constraints.
- **`prisma-setup.md`** — Configuración de Prisma: schema, migrations, seed, patrones de consulta.

### API y autenticación
- **`api-endpoints.md`** — Catálogo de endpoints REST: métodos, rutas, autenticación, formatos de request/response.
- **`auth-setup.md`** — Configuración de NextAuth.js: providers, callbacks, eventos, sesiones.

### Desarrollo y operación
- **`commands.md`** — Scripts de npm disponibles: dev, build, test, lint, prisma.
- **`tech-knowledge.md`** — Guías técnicas, estándares de código y patrones del proyecto.
