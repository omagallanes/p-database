# Reporte de Error de Despliegue — 2026-04-25

**URL de Producción**: {{AUTH_URL}}  
**Estado**: 🚫 BLOQUEADO - Variables de entorno faltantes  
**Error**: `Application error: a server-side exception has occurred`  
**Digest**: `134316766`

---

## Índice

1. [Diagnóstico del Error](#1-diagnóstico-del-error)
2. [Causa Raíz](#2-causa-raíz)
3. [Acciones Realizadas](#3-acciones-realizadas)
4. [Acciones Pendientes (Requieren Usuario)](#4-acciones-pendientes-requieren-usuario)
5. [Instrucciones Paso a Paso](#5-instrucciones-paso-a-paso)
6. [Verificación Post-Corrección](#6-verificación-post-corrección)

---

## 1. Diagnóstico del Error

### Error Reportado por Usuario

```
Application error: a server-side exception has occurred (see the server logs for more information).
Digest: 134316766
```

### Investigación Realizada

| Paso | Acción | Resultado |
|------|--------|-----------|
| 1 | Verificar logs de despliegue en Vercel | Deployment ID no encontrado (ya fue reciclado) |
| 2 | Listar deployments actuales | 1 deployment encontrado (hace 10m) |
| 3 | Verificar variables de entorno en Vercel | **Solo 2 variables encontradas** (AUTH_SECRET, AUTH_URL) |
| 4 | Revisar middleware.ts | Configurado correctamente, requiere auth() |
| 5 | Revisar lib/auth.ts | Configurado correctamente, requiere DATABASE_URL |
| 6 | Revisar inventario_recursos.md | Producción usa **Neon PostgreSQL** vía Vercel Postgres |

---

## 2. Causa Raíz

### Variable de Entorno Crítica Faltante

| Variable | Estado en Vercel | Propósito | Impacto si falta |
|----------|------------------|-----------|------------------|
| `DATABASE_URL` | ❌ **FALTANTE** | Conexión a PostgreSQL (Neon) | **ERROR BLOQUEANTE** - Prisma no puede conectar a DB |
| `AUTH_SECRET` | ✅ Configurada | Firma de tokens JWT | - |
| `AUTH_URL` | ✅ Configurada | URL base para NextAuth | - |

### Por Qué Ocurre el Error

1. **Middleware** ejecuta `auth()` en cada request
2. **auth()** inicializa NextAuth con PrismaAdapter
3. **Prisma** intenta conectar a la base de datos
4. **DATABASE_URL no existe** → Prisma lanza excepción
5. **Next.js** captura la excepción y muestra error genérico

### Stack Trace Probable (no visible en producción)

```
PrismaClientInitializationError: 
Can't reach database server at `undefined`

Error: 
  at PrismaClient.getEngine (node_modules/@prisma/client/runtime/library.js:123:12)
  at async PrismaClient._request (node_modules/@prisma/client/runtime/library.js:456:7)
  at async auth (lib/auth.ts:8:38)
  at async middleware (middleware.ts:4:1)
```

---

## 3. Acciones Realizadas

### ✅ Variables Añadidas a Vercel

| Variable | Valor | Estado | Timestamp |
|----------|-------|--------|-----------|
| `AUTH_SECRET` | `{{AUTH_SECRET}}` | ✅ Production | 2026-04-25 |
| `AUTH_URL` | `{{AUTH_URL}}` | ✅ Production | 2026-04-25 |

### Comandos Ejecutados

```bash
# Generar AUTH_SECRET
openssl rand -base64 32

# Añadir AUTH_SECRET
echo "{{AUTH_SECRET}}" | \
  vercel --token "$VERCEL_TOKEN" env add AUTH_SECRET production --yes

# Añadir AUTH_URL
echo "{{AUTH_URL}}" | \
  vercel --token "$VERCEL_TOKEN" env add AUTH_URL production --yes

# Verificar variables
vercel --token "$VERCEL_TOKEN" env ls
# Output: AUTH_SECRET, AUTH_URL (2 variables)
```

---

## 4. Acciones Pendientes (Requieren Usuario)

### 🚨 CRÍTICO: Añadir DATABASE_URL a Vercel

**Solo el usuario puede completar esta acción** porque requiere acceso a:
1. Dashboard de Vercel (credenciales del propietario)
2. Connection string de Neon PostgreSQL (almacenado en GitHub Secrets o gestionado por el usuario)

### Información Requerida

| Dato | Valor | Ubicación |
|------|-------|-----------|
| **Proveedor de DB** | Neon (Vercel Postgres) | ✅ Confirmado en inventario |
| **DATABASE_URL** | ⚠️ **PROVEER** | GitHub Secrets o Neon Dashboard |
| **Formato esperado** | `postgres://user:password@host.region.aws.neon.tech/dbname?sslmode=require` | - |

---

## 5. Instrucciones Paso a Paso

### Opción A: Si DATABASE_URL está en GitHub Secrets

1. **Obtener DATABASE_URL de GitHub**:
   - Ve a https://github.com/omagallanes/p-database/settings/secrets/actions
   - Busca `DATABASE_URL` en la lista
   - Click en "Edit" → Copia el valor (oculto, pero puedes reemplazarlo)
   - **Alternativa**: Si no puedes verlo, obtén el valor de Neon Dashboard

2. **Obtener DATABASE_URL de Neon Dashboard** (si no está en GitHub):
   - Ve a https://console.neon.tech/
   - Selecciona tu proyecto `p-database`
   - Click en "Connection Details"
   - Copia el **Connection string** (formato: `postgres://...`)

3. **Añadir DATABASE_URL a Vercel**:
   - Ve a https://vercel.com/omagallanes/p-database/settings/environment-variables
   - Click en "New Variable"
   - **Name**: `DATABASE_URL`
   - **Value**: [Pega el connection string de Neon]
   - **Environments**: ✅ Production
   - Click en "Save"

4. **Redesplegar**:
   - Ve a https://vercel.com/omagallanes/p-database/deployments
   - Busca el deployment más reciente
   - Click en "..." → "Redeploy"
   - ✅ "Use existing Build Cache"
   - Click en "Redeploy"

### Opción B: Usando Vercel CLI (si tienes el valor)

```bash
# Reemplaza [DATABASE_URL_VALUE] con tu connection string real
echo "[DATABASE_URL_VALUE]" | \
  vercel --token "$VERCEL_TOKEN" env add DATABASE_URL production --yes

# Redeploy
vercel --token "$VERCEL_TOKEN" --prod
```

---

## 6. Verificación Post-Corrección

### Checklist de Verificación

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Acceder a {{AUTH_URL}} | Página carga sin error |
| 2 | Verificar logs en Vercel | Sin errores de Prisma/DB |
| 3 | Intentar login | Formulario de signin visible |
| 4 | Listar variables en Vercel | `vercel env ls` muestra 3 variables |

### Comandos de Verificación

```bash
# Verificar variables en Vercel
vercel --token "$VERCEL_TOKEN" env ls
# Expected output: AUTH_SECRET, AUTH_URL, DATABASE_URL (3 variables)

# Verificar deployment status
vercel --token "$VERCEL_TOKEN" ls
# Expected: Status = "Ready", Environment = "Production"

# Acceder a la URL
curl -I {{AUTH_URL}}
# Expected: HTTP/2 200 (no 500)
```

### Criterios de Éxito

- ✅ **HTTP 200** en página principal
- ✅ **Sin errores** en Vercel Functions logs
- ✅ **Login visible** en `/auth/signin`
- ✅ **3 variables** configuradas en Vercel

---

## 7. Timeline Estimado

| Acción | Tiempo Estimado | Responsable |
|--------|-----------------|-------------|
| Obtener DATABASE_URL | 2-5 min | Usuario |
| Añadir a Vercel | 1 min | Usuario |
| Redeploy | 1-2 min | Usuario/Agente |
| Verificación | 2-3 min | Usuario |
| **TOTAL** | **6-11 min** | - |

---

## 8. Contacto y Soporte

Si encuentras problemas durante este proceso:

1. **Error: "Invalid DATABASE_URL format"**
   - Verifica que el string comience con `postgres://` o `postgresql://`
   - Asegúrate de incluir `?sslmode=require` al final

2. **Error: "Cannot connect to database"**
   - Verifica que Neon permita conexiones desde Vercel (0.0.0.0/0)
   - Revisa que el password no tenga caracteres especiales sin escape

3. **Error: "Deployment failed"**
   - Revisa Vercel Dashboard → Deployments → [Latest] → "View Build Logs"
   - Busca errores de Prisma en los logs

---

**Generado**: 2026-04-25  
**Estado**: 🚨 **ACCIÓN REQUERIDA DEL USUARIO**  
**Próximo Paso**: Añadir DATABASE_URL a Vercel y redesplegar
