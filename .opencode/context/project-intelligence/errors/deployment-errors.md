<!-- Context: project-intelligence/errors/deployment-errors | Priority: high | Version: 1.0 | Updated: 2026-08-08 -->

# Errores de Despliegue y Migración PostgreSQL

> **Finalidad:** Errores conocidos, anti-patrones y conocimiento preventivo del proyecto Prompt Database.
> **Leyenda:** ✅ Validado · 🔧 Corregido · ❌ Activo · ⚠️ Advertencia · 📝 Info
> **Volver al índice:** `tech-knowledge.md`

---
## 1. Prisma Client Desactualizado en Vercel

**Estado:** 🔧 Corregido  
**Código:** `package.json` (línea 20)  
**Descripción:** Script `"postinstall": "prisma generate"` regenera Prisma Client en cada instalación.

**Prevención:**
- Incluir siempre script `postinstall` para regenerar Prisma Client
- Considerar cache de dependencias en plataformas cloud (Vercel, Railway)
- Validar que Prisma Client esté actualizado antes del despliegue

---

## 2. Configuración Prisma Seed Faltante

**Estado:** 🔧 Corregido  
**Código:** `package.json` (líneas 63-65)  
**Descripción:** Prisma requiere configuración explícita de seed.

**Prevención:**
- Configurar explícitamente seed de Prisma en `package.json`
- Documentar comandos de seed para diferentes entornos
- Validar que seed funcione correctamente en producción

---

## 3. Despliegues Automáticos no Controlados

**Estado:** 🔧 Corregido  
**Código:** `vercel.json` (líneas 8-12)  
**Descripción:** Configuración `"deploymentEnabled": { "main": false }` desactiva despliegues automáticos.

**Prevención:**
- Controlar despliegues mediante configuración explícita de Vercel
- Documentar flujo de despliegue controlado
- Validar que despliegues automáticos estén desactivados para ramas críticas

---

## 4. PostgreSQL como Configuración Principal desde Desarrollo

**Estado:** ❌ Obsoleto (desde 2026-08-06)  
**Código:** `prisma/schema.prisma` (provider: postgresql)  
**Descripción:** OBSOLETO — ya NO existe SQLite local ni BD local: la BD única es Neon (producción). Los cambios de schema se aplican contra producción con `npx prisma db push` (ver `development/guides/deploy-to-vercel.md` → "Migración de schema — BD única Neon"). Se conserva: schema.prisma define binaryTargets para Vercel (native, linux-musl-openssl-3.0.x, linux-musl-arm64-openssl-3.0.x, debian-openssl-3.0.x).

**Riesgo:** Seguir la documentación antigua (SQLite local, docker-compose, `.env.development`) ya no aplica a este proyecto.

---

## 5. Configuración de Prisma Binary Targets

**Estado:** 📝 Información adicional  
**Código:** `prisma/schema.prisma` (líneas 2-4)  
**Descripción:** Generador de Prisma Client incluye `binaryTargets` específicos para entornos Linux musl y Debian.

**Relevancia preventiva:**
- Configurar binary targets apropiados para el entorno de despliegue
- Evitar errores de compatibilidad de Prisma Client en entornos cloud
- Validar que binary targets coincidan con plataforma de producción

---

# Next.js y Build
