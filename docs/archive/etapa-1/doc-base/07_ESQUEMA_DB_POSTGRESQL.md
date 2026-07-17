# 🗄️ Esquema de Base de Datos - PostgreSQL

Este documento describe el esquema de base de datos PostgreSQL para el proyecto **Prompt Database**.

---

## 📋 Visión General

El esquema consta de 8 tablas principales que permiten gestionar prompts de IA con categorías jerárquicas, etiquetas y autenticación de usuarios.

---

## 📊 Diagrama de Entidades

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │───────│     Account     │       │   Verification │
│                 │       └─────────────────┘       │    Token       │
│                 │               │                 └───────────────┘
│                 │               │
│                 │               │
└─────────────────┘               │
        │                         │
        │                         │
        │                         │
        │                         │
        │                         │
        └─────────────────────────┼─────────────────┐
                                  │                 │
                                  │                 │
                            ┌─────────────┐   ┌─────────────┐
                            │   Session   │   │   Prompt    │
                            └─────────────┘   └─────────────┘
                                  │                 │
                                  │                 │
                                  │                 │
                                  │                 │
                                  │                 │
                            ┌─────────────────┐   │   ┌─────────────────┐
                            │     Category    │───┼───│      Tag        │
                            └─────────────────┘   │   └─────────────────┘
                                    │   │         │           │
                                    │   └─────────┼───────────┘
                                    │     (parent/children)  │
                                    │                        │
                                    └────────────────────────┼─────────────┐
                                                             │
                                                             │
                                                       ┌───────────────┐
                                                       │   PromptTag   │
                                                       │  (many-to-many)│
                                                       └───────────────┘
```

---

## 📝 Tablas

### 1. `Prompt`

Tabla principal que almacena los prompts de IA.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | VARCHAR(25) | PRIMARY KEY | Identificador único (CUID) |
| `title` | VARCHAR(255) | NOT NULL | Título del prompt |
| `description` | TEXT | NULL | Descripción opcional |
| `body` | TEXT | NOT NULL | Cuerpo del prompt |
| `type` | VARCHAR(50) | DEFAULT 'USER' | Tipo: SYSTEM, USER, TOOL |
| `platform` | VARCHAR(50) | DEFAULT 'CURSOR' | Plataforma: CHATGPT, CURSOR, MIDJOURNEY, SUNO, OTHER |
| `modelHint` | VARCHAR(255) | NULL | Sugerencia de modelo |
| `language` | VARCHAR(10) | DEFAULT 'en' | Código de idioma |
| `useCase` | VARCHAR(255) | NOT NULL | Caso de uso |
| `clientOrProject` | VARCHAR(255) | NULL | Cliente o proyecto asociado |
| `status` | VARCHAR(50) | DEFAULT 'DRAFT' | Estado: DRAFT, TESTED, PRODUCTION |
| `isFavorite` | BOOLEAN | DEFAULT false | Marcador de favorito |
| `version` | INTEGER | DEFAULT 1 | Número de versión |
| `changelog` | TEXT | NULL | Historial de cambios |
| `notes` | TEXT | NULL | Notas adicionales |
| `usageCount` | INTEGER | DEFAULT 0 | Contador de usos |
| `lastUsedAt` | TIMESTAMP | NULL | Fecha de último uso |
| `categoryId` | VARCHAR(25) | NULL, FK | Referencia a Category |
| `userId` | TEXT | NULL, FK | Referencia al creador (User) |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updatedAt` | TIMESTAMP | ON UPDATE NOW() | Fecha de actualización |

#### Relaciones

- `category` → `Category?` (categoría opcional)
- `user` → `User?` (creador del prompt)
- `tags` → `PromptTag[]` (etiquetas asociadas)

#### Índices

- `Prompt_categoryId_idx` en `categoryId`
- `Prompt_status_idx` en `status`
- `Prompt_platform_idx` en `platform`
- `Prompt_isFavorite_idx` en `isFavorite`
- `Prompt_language_idx` en `language`
- `Prompt_userId_idx` en `userId`

---

### 2. `Category`

Tabla para categorías jerárquicas de organización.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | VARCHAR(25) | PRIMARY KEY | Identificador único (CUID) |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | Nombre de la categoría |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | Slug para URL |
| `parentId` | VARCHAR(25) | NULL, FK | Referencia a Category (auto-relación) |
| `sortOrder` | INTEGER | DEFAULT 0 | Orden de visualización |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updatedAt` | TIMESTAMP | ON UPDATE NOW() | Fecha de actualización |

#### Relaciones

- `parent` → `Category` (auto-relación jerárquica)
- `children` → `Category[]` (hijos de esta categoría)
- `prompts` → `Prompt[]` (prompts en esta categoría)

#### Índices

- `idx_category_parentId` en `parentId`
- `idx_category_slug` en `slug`

---

### 3. `Tag`

Tabla para etiquetas que pueden asignarse a múltiples prompts.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | VARCHAR(25) | PRIMARY KEY | Identificador único (CUID) |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | Nombre de la etiqueta |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | Slug para URL |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updatedAt` | TIMESTAMP | ON UPDATE NOW() | Fecha de actualización |

#### Relaciones

- `prompts` → `PromptTag[]` (asociaciones con prompts)

#### Índices

- `idx_tag_slug` en `slug`

---

### 4. `PromptTag`

Tabla de unión para la relación muchos-a-muchos entre Prompt y Tag.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `promptId` | VARCHAR(25) | PRIMARY KEY, FK | Referencia a Prompt |
| `tagId` | VARCHAR(25) | PRIMARY KEY, FK | Referencia a Tag |

#### Relaciones

- `prompt` → `Prompt` (CASCADE DELETE)
- `tag` → `Tag` (CASCADE DELETE)

#### Índices

- PRIMARY KEY compuesto: (`promptId`, `tagId`)
- `PromptTag_promptId_idx` en `promptId`
- `PromptTag_tagId_idx` en `tagId`

---

### 5. `User`

Tabla principal de usuarios para autenticación.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | TEXT | PRIMARY KEY | Identificador único (CUID) |
| `name` | TEXT | NULL | Nombre del usuario |
| `email` | TEXT | UNIQUE, NOT NULL | Email del usuario |
| `emailVerified` | TIMESTAMP | NULL | Fecha de verificación del email |
| `image` | TEXT | NULL | URL de la imagen de perfil |
| `password` | TEXT | NULL | Contraseña hasheada |
| `role` | TEXT | DEFAULT 'user' | Rol del usuario |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updatedAt` | TIMESTAMP | ON UPDATE NOW() | Fecha de actualización |

#### Relaciones

- `accounts` → `Account[]` (cuentas OAuth)
- `sessions` → `Session[]` (sesiones activas)
- `prompts` → `Prompt[]` (prompts creados por el usuario)

#### Índices

- `User_pkey` en `id`
- `User_email_key` en `email` (único)

---

### 6. `Account`

Tabla para cuentas OAuth vinculadas a usuarios.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | TEXT | PRIMARY KEY | Identificador único (CUID) |
| `userId` | TEXT | NOT NULL, FK | Referencia al usuario |
| `type` | TEXT | NOT NULL | Tipo de cuenta |
| `provider` | TEXT | NOT NULL | Proveedor OAuth |
| `providerAccountId` | TEXT | NOT NULL | ID de cuenta en el proveedor |
| `refresh_token` | TEXT | NULL | Token de refresco |
| `access_token` | TEXT | NULL | Token de acceso |
| `expires_at` | INTEGER | NULL | Timestamp de expiración |
| `token_type` | TEXT | NULL | Tipo de token |
| `scope` | TEXT | NULL | Alcance del token |
| `id_token` | TEXT | NULL | ID token |
| `session_state` | TEXT | NULL | Estado de sesión |

#### Relaciones

- `user` → `User` (usuario propietario)

#### Índices

- `Account_pkey` en `id`
- `Account_provider_providerAccountId_key` en (`provider`, `providerAccountId`) (único)

---

### 7. `Session`

Tabla para sesiones de usuario activas.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | TEXT | PRIMARY KEY | Identificador único (CUID) |
| `sessionToken` | TEXT | UNIQUE, NOT NULL | Token de sesión |
| `userId` | TEXT | NOT NULL, FK | Referencia al usuario |
| `expires` | TIMESTAMP | NOT NULL | Fecha de expiración |

#### Relaciones

- `user` → `User` (usuario de la sesión)

#### Índices

- `Session_pkey` en `id`
- `Session_sessionToken_key` en `sessionToken` (único)

---

### 8. `VerificationToken`

Tabla para tokens de verificación de email.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `identifier` | TEXT | NOT NULL | Identificador (email) |
| `token` | TEXT | UNIQUE, NOT NULL | Token de verificación |
| `expires` | TIMESTAMP | NOT NULL | Fecha de expiración |

#### Relaciones

- Ninguna (tabla independiente)

#### Índices

- `VerificationToken_token_key` en `token` (único)
- `VerificationToken_identifier_token_key` en (`identifier`, `token`) (único)

---

## 🔗 Relaciones Entre Tablas

```
User (1) ──────── (*) Account
   │
   └── (1) Session
       │
       └── (1) Prompt ──────── (*) Category
               │
               └── (*) PromptTag (*) ──── (1) Tag
```

### Detalle de Relaciones

1. **User → Account** (Uno a Muchos)
    - Un usuario puede tener múltiples cuentas OAuth
    - Una cuenta pertenece a un usuario
    - `ON DELETE CASCADE`: Si se elimina el usuario, se eliminan sus cuentas

2. **User → Session** (Uno a Muchos)
    - Un usuario puede tener múltiples sesiones activas
    - Una sesión pertenece a un usuario
    - `ON DELETE CASCADE`: Si se elimina el usuario, se eliminan sus sesiones

3. **User → Prompt** (Uno a Muchos)
    - Un usuario puede crear múltiples prompts
    - Un prompt pertenece opcionalmente a un usuario
    - `ON DELETE SET NULL`: Si se elimina el usuario, el prompt pierde la referencia

4. **Prompt → Category** (Muchos a Uno)
    - Un prompt puede pertenecer a una categoría opcional
    - Una categoría puede tener múltiples prompts
    - `ON DELETE SET NULL`: Si se elimina la categoría, el prompt pierde la referencia

5. **Prompt ←→ Tag** (Muchos a Muchos)
    - Un prompt puede tener múltiples etiquetas
    - Una etiqueta puede asignarse a múltiples prompts
    - Mediante la tabla intermedia `PromptTag`
    - `ON DELETE CASCADE`: Si se elimina un prompt o tag, se eliminan las asociaciones

6. **Category → Category** (Auto-relación jerárquica)
    - Una categoría puede tener una categoría padre
    - Una categoría puede tener múltiples categorías hijas
    - `ON DELETE CASCADE`: Si se elimina una categoría padre, se eliminan todas las hijas

---

## 📌 Enumeraciones

### `type` (Prompt)
- `SYSTEM`: Prompt de sistema
- `USER`: Prompt de usuario
- `TOOL`: Prompt de herramienta

### `platform` (Prompt)
- `CHATGPT`: ChatGPT
- `CURSOR`: Cursor
- `MIDJOURNEY`: Midjourney
- `SUNO`: Suno
- `OTHER`: Otro

### `status` (Prompt)
- `DRAFT`: Borrador
- `TESTED`: Probado
- `PRODUCTION`: En producción

---

## 🚀 SQL de Creación (Referencia)

```sql
-- Tabla User
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT,
    "email" TEXT UNIQUE NOT NULL,
    "emailVerified" TIMESTAMP,
    "image" TEXT,
    "password" TEXT,
    "role" TEXT DEFAULT 'user',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Tabla Account
CREATE TABLE "Account" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT
);

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- Tabla Session
CREATE TABLE "Session" (
    "id" TEXT PRIMARY KEY,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP NOT NULL
);

-- Tabla VerificationToken
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT UNIQUE NOT NULL,
    "expires" TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- Tabla Category
CREATE TABLE "Category" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "parentId" TEXT,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- Tabla Tag
CREATE TABLE "Tag" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");

-- Tabla Prompt
CREATE TABLE "Prompt" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "body" TEXT NOT NULL,
    "type" TEXT DEFAULT 'USER',
    "platform" TEXT DEFAULT 'CURSOR',
    "modelHint" TEXT,
    "language" TEXT DEFAULT 'en',
    "useCase" TEXT NOT NULL,
    "clientOrProject" TEXT,
    "status" TEXT DEFAULT 'DRAFT',
    "isFavorite" BOOLEAN DEFAULT false,
    "version" INTEGER DEFAULT 1,
    "changelog" TEXT,
    "notes" TEXT,
    "usageCount" INTEGER DEFAULT 0,
    "lastUsedAt" TIMESTAMP,
    "categoryId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "Prompt_categoryId_idx" ON "Prompt"("categoryId");
CREATE INDEX "Prompt_status_idx" ON "Prompt"("status");
CREATE INDEX "Prompt_platform_idx" ON "Prompt"("platform");
CREATE INDEX "Prompt_isFavorite_idx" ON "Prompt"("isFavorite");
CREATE INDEX "Prompt_language_idx" ON "Prompt"("language");
CREATE INDEX "Prompt_userId_idx" ON "Prompt"("userId");

-- Tabla PromptTag (many-to-many)
CREATE TABLE "PromptTag" (
    "promptId" TEXT,
    "tagId" TEXT,
    PRIMARY KEY ("promptId", "tagId")
);

CREATE INDEX "PromptTag_promptId_idx" ON "PromptTag"("promptId");
CREATE INDEX "PromptTag_tagId_idx" ON "PromptTag"("tagId");

-- Foreign Keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE;

ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL;

ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL;

ALTER TABLE "PromptTag" ADD CONSTRAINT "PromptTag_promptId_fkey"
    FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE;

ALTER TABLE "PromptTag" ADD CONSTRAINT "PromptTag_tagId_fkey"
    FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE;
```

---

## 📊 Estadísticas del Esquema

| Métrica | Valor |
|---------|-------|
| Tablas | 8 |
| Relaciones | 6 |
| Índices | 19 |
| Foreign Keys | 7 |
| Enumeraciones | 3 |

---

**Última actualización:** 21 de abril de 2026
**Versión del esquema:** 2.0
**Motor de base de datos:** PostgreSQL
