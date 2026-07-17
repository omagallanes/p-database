# Guía de Conexión y Despliegue en Vercel

> **Propósito**: Guía completa para conectar, configurar y desplegar el proyecto en Vercel.
> **Audiencia**: Desarrolladores que necesitan hacer deploy a producción desde CLI.
> **Última actualización**: 2026-07-16

---

## Índice

1. [Arquitectura del despliegue](#1-arquitectura-del-despliegue)
2. [Prerrequisitos](#2-prerrequisitos)
3. [Configuración inicial del proyecto en Vercel](#3-configuración-inicial-del-proyecto-en-vercel)
4. [El archivo `vercel.json`](#4-el-archivo-verceljson)
5. [Autenticación para deploy por CLI](#5-autenticación-para-deploy-por-cli)
6. [Variables de entorno para producción](#6-variables-de-entorno-para-producción)
7. [Flujo completo de deploy](#7-flujo-completo-deploy)
8. [Verificación post-despliegue](#8-verificación-post-despliegue)
9. [Rollback (volver a versión anterior)](#9-rollback-volver-a-versión-anterior)
10. [Solución de problemas comunes](#10-solución-de-problemas-comunes)
11. [Referencia rápida de comandos](#11-referencia-rápida-de-comandos)

---

## 1. Arquitectura del despliegue

```
Desarrollo local (rama version-2)
       ↓
  git push origin version-2
       ↓
  VERCEL_TOKEN + vercel deploy --prod
       ↓
  Vercel build (Next.js, Prisma generate)
       ↓
  Producción: https://prompt-database-liard.vercel.app
```

**Puntos clave**:
- El proyecto usa **Next.js 14 (App Router)** con **Prisma** como ORM.
- La base de datos en producción es **Neon.tech PostgreSQL**.
- El auto-deploy desde la rama `main` está **deshabilitado intencionalmente** (se controla desde `vercel.json`).
- Los deploys se hacen manualmente desde la rama `version-2`.

---

## 2. Prerrequisitos

### 2.1 Cuenta de Vercel
- Una cuenta en [vercel.com](https://vercel.com) con acceso al proyecto `prompt-database`.
- El proyecto está bajo el equipo/usuariO `omagallanes`.
- Rol mínimo necesario: **Developer** (o superior) en el equipo.

### 2.2 Vercel CLI instalado
```bash
# Verificar si está instalado
vercel --version

# Si no está instalado, instalarlo globalmente
npm install -g vercel
```

La versión usada en este proyecto es **Vercel CLI 56.x**. Versiones muy distintas pueden tener cambios en comandos o flags.

### 2.3 Token de acceso personal (VERCEL_TOKEN)
Necesitas un token de API para autenticarte desde la terminal sin hacer login interactivo.

**Cómo generarlo**:
1. Ve a [Vercel Dashboard → Settings → Tokens](https://vercel.com/account/tokens)
2. Asegúrate de estar en el contexto de tu **cuenta personal** (NO dentro de un team)
3. Crea un token con nombre descriptivo (ej: `prompt-database-cli`)
4. Copia el token generado (empieza con `vcp_...`)

**⚠️ IMPORTANTE — Error conocido**:
- Si creas el token mientras estás viendo un **team** en el dashboard, el token será de ámbito team y el flag `--token` NO funcionará. Crea el token desde tu cuenta personal.
- El token se almacena en `.env` como `VERCEL_TOKEN`. No lo compartas ni lo versiones en git.

### 2.4 Proyecto vinculado localmente
El proyecto ya tiene un archivo `.vercel/project.json` que lo vincula a Vercel. Si trabajas en un clone fresco:

```bash
# Desde la raíz del proyecto
vercel link

# Esto crea .vercel/project.json con el projectId y orgId
# Te preguntará a qué proyecto vincular — selecciona prompt-database
```

**Contenido de `.vercel/project.json`** (no versionar, está en `.gitignore`):
```json
{
  "projectId": "prj_cu98UkNifYkmPNO0aLxYjqCHYWO1",
  "orgId": "team_YqXCQfncAM8g3lDJP80NP8uS"
}
```

> ⚠️ `.vercel/` está en `.gitignore` — no se sube al repositorio. Cada desarrollador debe hacer `vercel link` localmente.

---

## 3. Configuración inicial del proyecto en Vercel

### 3.1 Desde Vercel Dashboard

Si alguna vez hay que crear el proyecto desde cero en Vercel:

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar el repositorio `omagallanes/p-database`
3. Configuración recomendada:
   - **Framework**: Next.js (se auto-detecta)
   - **Root directory**: `./` (raíz del proyecto)
   - **Build command**: `npm run build` (por defecto)
   - **Output directory**: `.next` (por defecto)
   - **Node.js version**: 24.x (o la más reciente estable)
4. Configurar variables de entorno (ver sección 6)
5. Desplegar

### 3.2 Desde CLI (alternativa)

```bash
# Vincular proyecto existente (si no está vinculado)
vercel link

# Configurar variable de entorno desde CLI
vercel env add DATABASE_URL production
# Te pedirá escribir/pegar el valor

# Verificar configuración
vercel project ls
```

---

## 4. El archivo `vercel.json`

### 4.1 Ubicación y propósito

El archivo `vercel.json` va en la **raíz del proyecto** (`/vercel.json`). No hay ubicación alternativa — Vercel solo lo lee desde la raíz.

### 4.2 Contenido actual

```json
{
  "experimentalServices": {
    "web": {
      "routePrefix": "/",
      "framework": "nextjs"
    }
  },
  "git": {
    "deploymentEnabled": {
      "main": false
    }
  }
}
```

### 4.3 ¿Qué hace cada parte?

| Propiedad | Función | ¿Necesario? |
|---|---|---|
| `experimentalServices.web` | Configuración interna de Vercel para el servicio web | 🤷 Se generó automáticamente. No tocar. |
| `git.deploymentEnabled.main: false` | **Deshabilita auto-deploy desde `main`** | ✅ Sí — es intencional. Los deploys se hacen manualmente. |

### 4.4 ¿Se puede borrar?

Técnicamente **sí**. Next.js se auto-detecta en Vercel incluso sin `vercel.json`. Pero **no se recomienda borrarlo** porque:
- Perderías la configuración `"main": false`
- Vercel habilitaría auto-deploy desde `main` por defecto
- El proyecto usa deploy manual desde `version-2`

### 4.5 Buenas prácticas

- **Versionar** `vercel.json` en git (no está en `.gitignore`)
- **No poner secrets** en `vercel.json` (para eso están las Environment Variables del Dashboard)
- Si necesitas cambiar configuración de deploy, edita este archivo en vez de hacerlo desde el Dashboard (así queda versionado)

---

## 5. Autenticación para deploy por CLI

### 5.1 Método correcto: Variable de entorno `VERCEL_TOKEN`

**⚠️ ADVERTENCIA CRÍTICA**: El flag `--token` NO funciona con tokens generados desde cuentas personales. Usa SIEMPRE la variable de entorno.

```bash
# ✅ FUNCIONA — usar variable de entorno
VERCEL_TOKEN="vcp_tu_token_aqui" vercel whoami

# ❌ NO FUNCIONA — produce "token not valid"
vercel whoami --token "vcp_tu_token_aqui"
```

**Esto es un comportamiento conocido de Vercel CLI 56.x**. El flag `--token` solo funciona con tokens de ámbito team. Como el token se crea desde la cuenta personal, hay que pasarle la variable de entorno.

### 5.2 Dónde almacenar el token

El token está definido en `.env` (archivo local, no versionado):

```bash
# .env (está en .gitignore)
VERCEL_TOKEN="<your-vercel-token>"
```

**⚠️ Reglas de seguridad**:
- `.env` está en `.gitignore` → No se sube a git
- Nunca compartas el token por canales inseguros
- Si el token se ve comprometido, revócalo desde Vercel Dashboard y genera uno nuevo
- El token del `.env` puede caducar o ser regenerado por el usuario

### 5.3 Verificar que el token funciona

```bash
# Debe responder con tu nombre de usuario (ej: omagallanes)
VERCEL_TOKEN="vcp_tu_token_aqui" vercel whoami

# Listar proyectos a los que tienes acceso
VERCEL_TOKEN="vcp_tu_token_aqui" vercel project ls
```

Si ves `Error: The token provided via --token argument is not valid`, es porque:
1. Usaste `--token` en vez de `VERCEL_TOKEN=...` → Usa variable de entorno
2. El token expiró o fue revocado → Genera uno nuevo en Vercel Dashboard

---

## 6. Variables de entorno para producción

### 6.1 Método recomendado: Vercel Dashboard

Las variables de entorno para producción se configuran en:
**Vercel Dashboard → Project → Settings → Environment Variables**

Esto es **más seguro** que tenerlas en archivos locales, porque:
- No se versionan en git
- Están encriptadas en Vercel
- Se pueden rotar sin tocar código

### 6.2 Variables requeridas para producción

| Variable | Descripción | Dónde obtenerla |
|---|---|---|
| `DATABASE_URL` | Connection string de PostgreSQL en Neon.tech | Dashboard de Neon.tech → Connection Details |
| `AUTH_SECRET` | Secret de NextAuth.js | Generar con `openssl rand -base64 32` |
| `AUTH_URL` | URL base de la app en producción | `https://prompt-database-liard.vercel.app` |
| `NEXTAUTH_SECRET` | (alias) mismo valor que `AUTH_SECRET` | Mismo que arriba |
| `NEXTAUTH_URL` | (alias) mismo valor que `AUTH_URL` | Mismo que arriba |

### 6.3 Variables LOCALES (no van en Vercel)

Estas variables están en `.env` pero solo se usan en desarrollo local:

| Variable | Propósito |
|---|---|
| `VERCEL_TOKEN` | Token de CLI para deploy (solo local) |
| `DATABASE_URL` (local) | Apunta a SQLite `file:./dev.db` en desarrollo |
| `NODE_ENV` | `development` en local; Vercel la setea automáticamente en producción |
| `UPSTASH_*` | Rate limiting (opcional, deshabilitado por defecto) |

### 6.4 Verificar variables desde CLI

```bash
# Listar variables de entorno configuradas en Vercel
# NOTA: El flag --environment no funciona en Vercel CLI 56.x para env ls
# Hay que verlas desde el Dashboard

# Ver las variables que usará el build
VERCEL_TOKEN="vcp_tu_token" vercel env pull .env.production
# Esto descarga las variables de Vercel a un archivo local .env.production
```

---

## 7. Flujo completo de deploy

### 7.1 Preparación local

```bash
# 1. Asegúrate de estar en la rama correcta
git branch
# Debe mostrar: * version-2

# 2. Verifica el estado de los archivos
git status

# 3. Ejecuta tests localmente
npm test

# 4. Verifica que TypeScript compila
npx tsc --noEmit
# ⚠️ Pueden aparecer errores en archivos de test preexistentes
#    (ej: export.test.ts, PromptFilters.test.tsx, etc.)
#    Mientras no sean errores en los archivos que modificaste, es seguro.
#    Si son errores en archivos de test no relacionados, el build de Vercel
#    no los detecta porque Next.js no type-checkea tests.

# 5. (Opcional) Verifica el build local
npm run build
```

### 7.2 Commit y push

```bash
# 6. Añadir solo los archivos de la solución (evita subir contextos, etc.)
git add app/api/prompts/route.ts "app/(app)/prompts/page.tsx" tests/api/prompts.test.ts

# 7. Commitar con mensaje descriptivo
git commit -m "fix: descripción clara de lo que cambió"

# 8. Subir a la rama version-2
git push origin version-2
```

**⚠️ Nota sobre rutas con paréntesis**: El archivo `app/(app)/prompts/page.tsx` tiene paréntesis en el path. Siempre usa comillas dobles al pasarlo a git:
```bash
git add "app/(app)/prompts/page.tsx"  # ✅ correcto
git add app/(app)/prompts/page.tsx    # ❌ error de sintaxis
```

### 7.3 Deploy a producción

```bash
# 9. Cargar el token del .env y desplegar
# La variable de entorno VERCEL_TOKEN se pasa inline en el mismo comando
VERCEL_TOKEN="vcp_tu_token_aqui" vercel deploy --prod
```

**Lo que hace este comando**:
1. Lee `.vercel/project.json` para saber qué proyecto y equipo
2. Sube los archivos del directorio actual a Vercel (~622KB)
3. Ejecuta el build en los servidores de Vercel (Washington D.C. — iad1)
4. El build incluye: `npm install` → `prisma generate` → `next build`
5. Si el build es exitoso, despliega a producción
6. Asigna el alias de producción (ej: `prompt-database-liard.vercel.app`)

**Tiempo estimado**: ~1 minuto (45s build + 15s deploy)

**Salida esperada**:
```
Production      https://prompt-database-47rqojbv6-omagallanes.vercel.app
Aliased         https://prompt-database-liard.vercel.app
✓ Ready in 1m
```

La URL con hash (`-47rqojbv6-`) es la URL única del deployment. La URL alias (`-liard.`) es la que apunta a producción siempre.

### 7.4 Script de deploy one-liner

Para deploy rápido, puedes combinar todo en un solo comando (después de commitear):

```bash
npm test && \
git push origin version-2 && \
VERCEL_TOKEN="vcp_tu_token_aqui" vercel deploy --prod
```

---

## 8. Verificación post-despliegue

### 8.1 Desde navegador

1. Abrir `https://prompt-database-liard.vercel.app`
2. Verificar que la página carga correctamente
3. Probar la funcionalidad específica que se desplegó

### 8.2 Desde CLI

```bash
# Ver el deployment más reciente
VERCEL_TOKEN="vcp_tu_token" vercel list --environment production

# Ver detalles de un deployment específico
VERCEL_TOKEN="vcp_tu_token" vercel inspect <deployment-url>

# Ver logs en tiempo real
VERCEL_TOKEN="vcp_tu_token" vercel logs <deployment-url>
```

### 8.3 Verificar estado del build

```bash
# Esto muestra si el build fue exitoso
VERCEL_TOKEN="vcp_tu_token" vercel inspect dpl_<id>
# Busca en la salida: "status: ● Ready"
```

---

## 9. Rollback (volver a versión anterior)

### 9.1 Desde CLI

```bash
# Listar deployments anteriores (con su ID)
VERCEL_TOKEN="vcp_tu_token" vercel list --environment production

# Promover un deployment anterior a producción
VERCEL_TOKEN="vcp_tu_token" vercel promote <deployment-id-or-url>
```

### 9.2 Desde Vercel Dashboard

1. Ir a **Vercel Dashboard → Project → Deployments**
2. Buscar el deployment deseado
3. Click en "..." → **Promote to Production**

### 9.3 Rollback de código + deploy

```bash
# Si necesitas revertir el código también
git revert HEAD
git push origin version-2
VERCEL_TOKEN="vcp_tu_token" vercel deploy --prod
```

---

## 10. Solución de problemas comunes

### 10.1 `Error: The token provided via --token argument is not valid`

**Causa**: Usaste el flag `--token` en vez de la variable de entorno `VERCEL_TOKEN`.

**Solución**:
```bash
# ❌ Incorrecto
vercel whoami --token "vcp_..."

# ✅ Correcto
VERCEL_TOKEN="vcp_..." vercel whoami
```

### 10.2 `Error: You do not have access to the specified account`

**Causa**: Usaste `--scope` con el ID del equipo en vez del slug, o el token no tiene acceso a ese equipo.

**Solución**:
- No uses `--scope` ni `--team` a menos que sea estrictamente necesario
- El token de cuenta personal tiene acceso automático a los equipos donde el usuario es miembro
- Si necesitas especificar equipo, usa el **slug** (nombre legible), no el ID:
  ```bash
  # ❌ Incorrecto (ID numérico)
  vercel --scope team_YqXCQfncAM8g3lDJP80NP8uS
  
  # ✅ Correcto (slug del equipo)
  vercel --scope omagallanes
  ```

### 10.3 El build falla con error de TypeScript

**Causa**: Errores de tipo en archivos modificados.

**Solución**:
```bash
# Verificar localmente antes de deploy
npx tsc --noEmit

# Si hay errores en archivos de test que NO modificaste
# (ej: export.test.ts, PromptFilters.test.tsx, auth.test.tsx),
# es porque son errores preexistentes. El build de Next.js
# solo type-checkea archivos de la app, NO los tests.
# Estos errores se pueden ignorar para el deploy.
```

### 10.4 El build falla con error de Prisma

**Causa**: Cambios en `prisma/schema.prisma` sin generar el cliente.

**Solución**: Vercel ejecuta `prisma generate` automáticamente en el build (está en el hook `postinstall` de `package.json`). No requiere acción manual.

### 10.5 La página muestra error 500 después del deploy

**Causa**: Posiblemente variables de entorno mal configuradas en Vercel Dashboard.

**Solución**:
```bash
# Ver logs del deployment
VERCEL_TOKEN="vcp_tu_token" vercel logs <deployment-url>

# Verificar variables de entorno en Dashboard
# Vercel → Project → Settings → Environment Variables
```

### 10.6 Error: `Route /api/export/prompts couldn't be rendered statically`

**Causa**: La ruta de export usa `headers()` de Next.js, lo que impresa la generación estática.

**Impacto**: **Ninguno**. Es un warning, no un error de build. El deployment se completa correctamente. La ruta funciona como dinámica (server-rendered).

---

## 11. Referencia rápida de comandos

### Autenticación
```bash
# Verificar conexión
VERCEL_TOKEN="vcp_..." vercel whoami

# Listar proyectos accesibles
VERCEL_TOKEN="vcp_..." vercel project ls
```

### Deploy
```bash
# Deploy a producción
VERCEL_TOKEN="vcp_..." vercel deploy --prod

# Deploy preview (no producción)
VERCEL_TOKEN="vcp_..." vercel deploy
```

### Monitoreo
```bash
# Listar deployments de producción
VERCEL_TOKEN="vcp_..." vercel list --environment production

# Ver detalles de un deployment
VERCEL_TOKEN="vcp_..." vercel inspect <url>

# Ver logs
VERCEL_TOKEN="vcp_..." vercel logs <url>
```

### Rollback
```bash
# Promover deployment anterior a producción
VERCEL_TOKEN="vcp_..." vercel promote <deployment-id>
```

### Variables de entorno
```bash
# Descargar variables de Vercel a archivo local
VERCEL_TOKEN="vcp_..." vercel env pull .env.production

# Añadir variable desde CLI
vercel env add DATABASE_URL production
```

---

## Historial de cambios

| Fecha | Cambio | Autor |
|---|---|---|
| 2026-07-16 | Creación inicial de la guía | Repo Manager |
| 2026-07-16 | Documentados los errores de `--token` vs `VERCEL_TOKEN` | Repo Manager |

---

> **¿Problemas no cubiertos aquí?** Consulta la [documentación oficial de Vercel CLI](https://vercel.com/docs/cli) o abre un issue en el repositorio.
