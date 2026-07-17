# API Endpoints

## Authentication

| Ruta | Métodos | Auth | Descripción |
|------|---------|:----:|-------------|
| `/api/auth/[...nextauth]` | GET, POST | No | NextAuth handlers (login, session, callback) |
| `/api/auth/register` | POST | No | Registro de usuario |

## Prompts

| Ruta | Métodos | Auth | Descripción |
|------|---------|:----:|-------------|
| `/api/prompts` | GET, POST | POST sí | CRUD: listar (con filtros) y crear |
| `/api/prompts/[id]` | GET, PUT, DELETE | PUT/DELETE sí | Prompt individual |
| `/api/prompts/[id]/usage` | PATCH | No | Tracking de uso (contador + fecha) |

## Taxonomías

| Ruta | Métodos | Auth | Descripción |
|------|---------|:----:|-------------|
| `/api/categories` | GET, POST | POST sí | CRUD categorías |
| `/api/categories/[id]` | PUT, DELETE | Admin | Categoría individual |
| `/api/tags` | GET, POST | POST sí | CRUD tags |
| `/api/tags/[id]` | PUT, DELETE | Admin | Tag individual |
| `/api/platforms` | GET, POST | POST sí | Plataformas |
| `/api/use-cases` | GET, POST | POST sí | Casos de uso |
| `/api/client-projects` | GET, POST | POST sí | Clientes/proyectos |
| `/api/model-hints` | GET, POST | POST sí | Modelos/sugerencias |

## Usuarios

| Ruta | Métodos | Auth | Descripción |
|------|---------|:----:|-------------|
| `/api/users` | GET, PUT | Sí | CRUD usuarios (GET listar, PUT actualizar) |
| `/api/users/[id]` | DELETE | Admin | Eliminar usuario (admin only) |
| `/api/user/preferences` | GET, PATCH | Sí | Preferencias de usuario (GET obtener, PATCH actualizar) |

## Export/Import

| Ruta | Métodos | Auth | Descripción |
|------|---------|:----:|-------------|
| `/api/export/prompts` | GET | Sí | Exportar prompts como JSON |
| `/api/import/prompts` | POST | Sí | Importar prompts desde JSON |
