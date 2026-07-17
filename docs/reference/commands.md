# Comandos del Proyecto

## Scripts de package.json

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Build para producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint` | ESLint |
| `npm test` | Ejecutar tests (Jest) |
| `npm run test:watch` | Tests en modo watch |
| `npx prisma studio` | Abrir Prisma Studio (UI de BD) |
| `npm run db:push` | Push schema a BD (dev) |
| `npm run db:migrate` | Ejecutar migraciones |
| `npm run db:seed` | Seed de datos de ejemplo |
| `npm run db:generate` | Generar Prisma Client |
| `npm run db:migrate-data` | Migrar datos entre esquemas |
| `npx prisma migrate dev` | Crear migración en desarrollo |

## Vercel CLI

| Comando | Descripción |
|---------|-------------|
| `vercel` | Deploy a preview |
| `vercel --prod` | Deploy a producción |
| `vercel env pull` | Descargar env vars |
| `vercel logs` | Ver logs de producción |
