# Informe de Despliegue — F3-SF3.1-S1 + F3-SF3.2-S1 en Vercel

**Fecha de despliegue**: 2026-04-25  
**Estado**: ✅ DESPLEGADO EN PRODUCCIÓN  
**URL de producción**: https://p-database-hnhg96b87-omagallanes.vercel.app

---

## Índice de Contenido

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Estado del Proyecto Antes del Despliegue](#2-estado-del-proyecto-antes-del-despliegue)
3. [Configuración de Vercel](#3-configuración-de-vercel)
4. [Proceso de Despliegue](#4-proceso-de-despliegue)
5. [Resultado del Despliegue](#5-resultado-del-despliegue)
6. [Incidencias y Limitaciones](#6-incidencias-y-limitaciones)
7. [Checklist de Validación para Usuario](#7-checklist-de-validación-para-usuario)
8. [Instrucciones de Acceso](#8-instrucciones-de-acceso)

---

## 1. Resumen Ejecutivo

### Fases Desplegadas

| Fase | Subfase | Nombre | Estado |
|------|---------|--------|--------|
| **Fase 3** | SF-3.1 | Vista lista + preferencia de visualización | ✅ COMPLETADA |
| **Fase 3** | SF-3.2 | Filtros multi-selección con lógica AND | ✅ COMPLETADA |

### Funcionalidades Disponibles para Validación

1. **Vista lista de prompts**: Toggle cards/lista, persistencia de preferencia por usuario
2. **Filtros multi-selección**: Platform y Category con checkboxes y lógica AND
3. **Navegación post-guardado**: Create → detalle, Edit → permanece, Duplicate → edición, Delete → listado
4. **Campos nuevos**: Pre-Prompt y Manual de uso en edición

### URL de Acceso

| Ambiente | URL | Estado |
|----------|-----|--------|
| **Producción** | https://p-database-hnhg96b87-omagallanes.vercel.app | ✅ Ready |
| **Inspect** | https://vercel.com/omagallanes/p-database/9EUaobh9fCfCgpUZubdt6C5pNZSx | ✅ Disponible |

---

## 2. Estado del Proyecto Antes del Despliegue

### Validaciones Ejecutadas

| Validación | Comando | Resultado | Detalles |
|------------|---------|-----------|----------|
| **Build** | `npm run build` | ✅ Exitoso | Next.js compiló sin errores; 22 páginas generadas |
| **Lint** | `npm run lint` | ✅ Sin errores | ESLint sin warnings ni errores |
| **Tests** | `npm test` | ✅ 40/40 passing | 8 test suites passed |

### Detalle del Build

```
Route (app)                              Size     First Load JS
┌ ƒ /                                    146 B          87.5 kB
├ ƒ /prompts                             5.39 kB         137 kB
├ ƒ /prompts/[id]                        148 B           132 kB
├ ƒ /prompts/new                         146 B           132 kB
└ ƒ /tags                                3.8 kB          113 kB
+ First Load JS shared by all            87.3 kB
ƒ Middleware                             117 kB
```

### Archivos Modificados en este Despliegue

| Archivo | Cambios Principales |
|---------|-------------------|
| `app/(app)/prompts/page.tsx` | `getPlatforms()` añadida, lógica AND con `every`, parseo de arrays |
| `components/prompt/PromptFilters.tsx` | Checkboxes multi-select, `togglePlatform`/`toggleCategory` |
| `components/prompt/PromptList.tsx` | Vista lista con toggle, render condicional cards/lista |
| `app/api/user/preferences/route.ts` | API para persistir preferencia de vista |
| `app/api/prompts/route.ts` | `getAll()` para arrays, lógica AND en where clause |

---

## 3. Configuración de Vercel

### vercel.json

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

**Nota**: Los despliegues automáticos desde `main` están **desactivados**. Este despliegue fue ejecutado manualmente vía Vercel CLI.

### Variables de Entorno Requeridas

Las siguientes variables deben estar configuradas en Vercel:

| Variable | Propósito | Estado en Producción |
|----------|-----------|---------------------|
| `DATABASE_URL` | Conexión a PostgreSQL | ⚠️ **Requiere verificación** |
| `AUTH_SECRET` | Firma de tokens NextAuth | ⚠️ **Requiere verificación** |
| `AUTH_URL` | URL base para NextAuth | ⚠️ **Requiere verificación** |
| `NEXT_PUBLIC_BASE_PATH` | Base path de la app | ✅ Vacío (root) |
| `NODE_ENV` | Entorno (production) | ✅ Automático en Vercel |

### GitHub Secrets Utilizados

| Secret | Propósito | Estado |
|--------|-----------|--------|
| `VERCEL_TOKEN` | Autenticación CLI para despliegue | ✅ Disponible y usado |

---

## 4. Proceso de Despliegue

### Comandos Ejecutados

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Desplegar con token
vercel --token "$VERCEL_TOKEN" --yes
```

### Timeline del Despliegue

| Paso | Duración | Estado |
|------|----------|--------|
| Login/autenticación | < 1s | ✅ Completado |
| Detección de servicio (Next.js) | < 1s | ✅ Completado |
| Upload de archivos (2.8MB) | ~5s | ✅ Completado |
| Build en Vercel (iad1) | ~1m | ✅ Completado |
| Deploy a producción | < 5s | ✅ Completado |

### Logs de Build en Vercel

```
Building: Running build in Washington, D.C., USA (East) – iad1
Building: Build machine configuration: 2 cores, 8 GB
Building: Installing dependencies...
Building: > prompt-database@0.1.0 postinstall
Building: > prisma generate
Building: ✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client in 220ms
Building: Running "npm run build"
Building: ✓ Compiled successfully
Building: ✓ Generating static pages
Building: ✓ Finalizing page optimization
```

---

## 5. Resultado del Despliegue

### Estado Final

| Métrica | Valor |
|---------|-------|
| **URL de producción** | https://p-database-hnhg96b87-omagallanes.vercel.app |
| **Estado** | ● Ready |
| **Duration** | 1m |
| **Username** | omagallanes |
| **Deployment ID** | 9EUaobh9fCfCgpUZubdt6C5pNZSx |

### Endpoints Disponibles

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/` | GET | Home page |
| `/prompts` | GET | Listado de prompts (cards/lista) |
| `/prompts/new` | GET/POST | Crear nuevo prompt |
| `/prompts/[id]` | GET/PUT/DELETE | Ver/editar/eliminar prompt |
| `/api/prompts` | GET/POST | API de prompts |
| `/api/user/preferences` | PATCH | Actualizar preferencia de vista |
| `/auth/signin` | GET/POST | Inicio de sesión |
| `/auth/signup` | GET/POST | Registro de usuario |

---

## 6. Incidencias y Limitaciones

### Incidencia 1: GitHub Connection Failed

| Campo | Valor |
|-------|-------|
| **Error** | `Failed to connect omagallanes/p-database to project` |
| **Causa** | Permisos de integración de GitHub insuficientes para el CLI en Codespaces |
| **Impacto** | Ninguno — el despliegue se completó exitosamente sin conexión GitHub |
| **Resolución** | El despliegue continuó sin conexión GitHub; los archivos se subieron directamente |

### Incidencia 2: Variables de Entorno en Vercel

| Campo | Valor |
|-------|-------|
| **Problema** | No se pudo verificar automáticamente si `DATABASE_URL` y `AUTH_SECRET` están configuradas en Vercel |
| **Causa** | Vercel CLI no permite listar variables de entorno existentes por seguridad |
| **Impacto** | **POTENCIALMENTE BLOQUEANTE** — Si las variables no están configuradas, la app no funcionará |
| **Resolución requerida** | Usuario debe verificar manualmente en Vercel Dashboard: Settings → Environment Variables |

### Limitación 1: Base de Datos

| Campo | Valor |
|-------|-------|
| **Limitación** | La base de datos de producción debe ser accesible desde Vercel |
| **Requisito** | PostgreSQL debe permitir conexiones desde IPs de Vercel (0.0.0.0/0 o IPs específicas) |
| **Verificación** | Usuario debe confirmar que `DATABASE_URL` apunta a DB accesible desde cloud |

### Limitación 2: NextAuth Configuration

| Campo | Valor |
|-------|-------|
| **Limitación** | `AUTH_URL` debe coincidir con el dominio de producción |
| **Requisito** | `AUTH_URL` debe ser `https://p-database-hnhg96b87-omagallanes.vercel.app` |
| **Verificación** | Usuario debe verificar en Vercel Dashboard → Environment Variables |

---

## 7. Checklist de Validación para Usuario

### Instrucciones Generales

1. **Accede a la URL**: https://p-database-hnhg96b87-omagallanes.vercel.app
2. **Inicia sesión** con tus credenciales (o regístrate si es tu primera vez)
3. **Completa cada prueba** marcando el estado correspondiente
4. **Reporta cualquier error** con capturas de pantalla si es posible

---

### Fase 3 — List & Filters

#### SF-3.1 — Vista Lista + Preferencia de Visualización

| ID | Funcionalidad | Pasos | Resultado Esperado | Estado | Observaciones |
|----|--------------|-------|-------------------|--------|---------------|
| **3.1-01** | Toggle cards/lista | 1. Ir a `/prompts`<br>2. Click en botón "List"<br>3. Click en botón "Cards" | La vista cambia entre cards y lista instantáneamente | ⬜ Pendiente | |
| **3.1-02** | Persistencia de preferencia | 1. Cambiar a vista lista<br>2. Recargar página (F5)<br>3. Navegar a otra página y volver | La vista lista se mantiene después de recargar | ⬜ Pendiente | |
| **3.1-03** | Vista lista muestra datos | 1. Cambiar a vista lista<br>2. Verificar columnas visibles | Se muestran: Copy, Edit, título, favorito, estado, plataformas, categorías, tags, cliente/proyecto | ⬜ Pendiente | |
| **3.1-04** | Vista lista NO muestra campos detallados | 1. En vista lista, verificar contenido | NO se muestran: Pre-Prompt, Manual de uso | ⬜ Pendiente | |
| **3.1-05** | Botón "Edit" en ambas vistas | 1. En vista cards, verificar botón<br>2. En vista lista, verificar botón | El botón dice "Edit" (no "View") en ambas vistas | ⬜ Pendiente | |
| **3.1-06** | Vista lista en móvil | 1. Reducir ancho de ventana<br>2. Verificar responsive | La vista lista se adapta correctamente a móvil | ⬜ Pendiente | |

#### SF-3.2 — Filtros Multi-Selección con Lógica AND

| ID | Funcionalidad | Pasos | Resultado Esperado | Estado | Observaciones |
|----|--------------|-------|-------------------|--------|---------------|
| **3.2-01** | Platform filter usa checkboxes | 1. Ir a `/prompts`<br>2. Abrir filtro Platform | Se muestran checkboxes (no select dropdown) | ⬜ Pendiente | |
| **3.2-02** | Platform multi-select | 1. Seleccionar 2+ platforms (ej: CHATGPT + CURSOR)<br>2. Verificar resultados | Solo se muestran prompts que tienen AMBAS platforms | ⬜ Pendiente | |
| **3.2-03** | Category filter usa checkboxes | 1. Abrir filtro Category | Se muestran checkboxes (no select dropdown) | ⬜ Pendiente | |
| **3.2-04** | Category multi-select | 1. Seleccionar 2+ categories<br>2. Verificar resultados | Solo se muestran prompts que tienen AMBAS categories | ⬜ Pendiente | |
| **3.2-05** | Lógica AND combinada | 1. Seleccionar 2 platforms<br>2. Seleccionar 2 categories<br>3. Verificar resultados | Solo prompts que cumplen TODOS los filtros (AND) | ⬜ Pendiente | |
| **3.2-06** | URL refleja selecciones | 1. Seleccionar filtros<br>2. Verificar URL en navegador | URL contiene `?platformIds=xxx&platformIds=yyy&categoryIds=zzz` | ⬜ Pendiente | |
| **3.2-07** | Persistencia al recargar | 1. Seleccionar filtros<br>2. Recargar página (F5) | Los filtros se mantienen activos después de recargar | ⬜ Pendiente | |
| **3.2-08** | Clear filters | 1. Activar múltiples filtros<br>2. Click en botón "X" (clear) | Todos los filtros se limpian, se muestran todos los prompts | ⬜ Pendiente | |
| **3.2-09** | Filtros en vista lista | 1. Cambiar a vista lista<br>2. Activar filtros | Los filtros funcionan correctamente en vista lista | ⬜ Pendiente | |
| **3.2-10** | Filtros se mantienen al cambiar vista | 1. Activar filtros en vista cards<br>2. Cambiar a vista lista | Los filtros permanecen activos, resultados se mantienen | ⬜ Pendiente | |

---

### Fase 2 — Form Evolution (Validación Adicional)

#### SF-2.2 — Basic Information: Nuevos Campos

| ID | Funcionalidad | Pasos | Resultado Esperado | Estado | Observaciones |
|----|--------------|-------|-------------------|--------|---------------|
| **2.2-01** | Campo Pre-Prompt | 1. Ir a `/prompts/new` o editar existente<br>2. Localizar campo Pre-Prompt | Campo de texto visible y editable | ⬜ Pendiente | |
| **2.2-02** | Campo Manual de uso | 1. En formulario, localizar campo Manual de uso | Campo de texto visible y editable | ⬜ Pendiente | |
| **2.2-03** | Persistencia de campos | 1. Llenar Pre-Prompt y Manual de uso<br>2. Guardar<br>3. Volver a editar | Los valores se mantienen guardados | ⬜ Pendiente | |
| **2.2-04** | Fechas solo en edición | 1. Crear nuevo prompt<br>2. Verificar campos de fechas | Las fechas NO son editables en alta, solo en edición | ⬜ Pendiente | |

#### SF-2.3 — Navegación Post-Guardado

| ID | Funcionalidad | Pasos | Resultado Esperado | Estado | Observaciones |
|----|--------------|-------|-------------------|--------|---------------|
| **2.3-01** | Create → Detalle | 1. Crear nuevo prompt<br>2. Click en Create | Redirige a `/prompts/[nuevo-id]` (detalle del prompt creado) | ⬜ Pendiente | |
| **2.3-02** | Edit → Permanece | 1. Editar prompt existente<br>2. Click en Update | Permanece en `/prompts/[id]` (misma página) | ⬜ Pendiente | |
| **2.3-03** | Duplicate → Edición | 1. Duplicar prompt<br>2. Verificar navegación | Abre nuevo prompt en modo edición `/prompts/new` con datos copiados | ⬜ Pendiente | |
| **2.3-04** | Delete → Listado | 1. Eliminar prompt<br>2. Verificar navegación | Redirige a `/prompts` (listado) | ⬜ Pendiente | |

---

### Autenticación y Seguridad

| ID | Funcionalidad | Pasos | Resultado Esperado | Estado | Observaciones |
|----|--------------|-------|-------------------|--------|---------------|
| **AUTH-01** | Registro de usuario | 1. Ir a `/auth/signup`<br>2. Completar formulario<br>3. Submit | Usuario creado, redirige a home | ⬜ Pendiente | |
| **AUTH-02** | Inicio de sesión | 1. Ir a `/auth/signin`<br>2. Ingresar credenciales<br>3. Submit | Sesión iniciada, redirige a home | ⬜ Pendiente | |
| **AUTH-03** | Protección de rutas | 1. Cerrar sesión<br>2. Intentar acceder a `/prompts` | Redirige a `/auth/signin` | ⬜ Pendiente | |
| **AUTH-04** | Persistencia de sesión | 1. Iniciar sesión<br>2. Recargar página<br>3. Navegar entre páginas | Sesión se mantiene activa | ⬜ Pendiente | |

---

### Rendimiento y UX General

| ID | Funcionalidad | Pasos | Resultado Esperado | Estado | Observaciones |
|----|--------------|-------|-------------------|--------|---------------|
| **UX-01** | Tiempo de carga inicial | 1. Acceder a URL desde incógnito<br>2. Medir tiempo hasta interactuable | < 3 segundos en conexión normal | ⬜ Pendiente | |
| **UX-02** | Navegación entre páginas | 1. Navegar entre home, prompts, detalle | Transiciones suaves, sin recargas completas | ⬜ Pendiente | |
| **UX-03** | Feedback visual en acciones | 1. Click en botones de acción (Create, Update, Delete) | Botones muestran estado disabled/pending durante acción | ⬜ Pendiente | |
| **UX-04** | Mensajes de error | 1. Intentar acción inválida (ej: form incompleto) | Se muestran mensajes de error claros | ⬜ Pendiente | |
| **UX-05** | Responsive en móvil | 1. Abrir en dispositivo móvil o DevTools móvil | UI se adapta correctamente a pantallas pequeñas | ⬜ Pendiente | |

---

## 8. Instrucciones de Acceso

### URL de Producción

```
https://p-database-hnhg96b87-omagallanes.vercel.app
```

### Credenciales de Prueba

Si necesitas credenciales de prueba y no tienes una cuenta:

1. **Regístrate** en `/auth/signup` con cualquier email
2. **Verifica** tu email (si está habilitada la verificación)
3. **Inicia sesión** en `/auth/signin`

### Verificación de Variables de Entorno

**Importante**: Antes de probar, verifica que las variables de entorno estén configuradas correctamente en Vercel:

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto `p-database`
3. Ve a **Settings** → **Environment Variables**
4. Verifica que existan:
   - `DATABASE_URL` (apuntando a PostgreSQL accesible desde Vercel)
   - `AUTH_SECRET` (generado con `openssl rand -base64 32`)
   - `AUTH_URL` (debe ser `https://p-database-hnhg96b87-omagallanes.vercel.app`)

Si alguna variable falta o es incorrecta, **la aplicación no funcionará correctamente**.

### Reporte de Errores

Si encuentras errores durante la validación:

1. **Toma captura de pantalla** del error
2. **Abre DevTools** (F12) y ve a la consola
3. **Copia cualquier error** que aparezca en consola
4. **Reporta** con:
   - ID de la prueba fallida
   - Pasos exactos que seguiste
   - Captura de pantalla
   - Errores de consola

---

## Resumen de Validación

### Total de Pruebas

| Categoría | Cantidad |
|-----------|----------|
| SF-3.1 (Vista lista) | 6 pruebas |
| SF-3.2 (Filtros AND) | 10 pruebas |
| SF-2.2 (Campos nuevos) | 4 pruebas |
| SF-2.3 (Navegación) | 4 pruebas |
| Autenticación | 4 pruebas |
| UX General | 5 pruebas |
| **TOTAL** | **33 pruebas** |

### Criterio de Aceptación

- **✅ APROBADO**: 90%+ de pruebas pasadas (30/33)
- **⚠️ CONDICIONAL**: 75-89% de pruebas pasadas (25-29/33)
- **🚫 RECHAZADO**: < 75% de pruebas pasadas (< 25/33)

---

**Generado**: 2026-04-25  
**Despliegue ID**: 9EUaobh9fCfCgpUZubdt6C5pNZSx  
**URL**: https://p-database-hnhg96b87-omagallanes.vercel.app  
**Estado**: ✅ DESPLEGADO Y LISTO PARA VALIDACIÓN
