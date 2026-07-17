Las respuestas en este documendo  responden a las  planteadas en doc-plan/doc-implementar/conocimiento-tec/07a-decisiones-abiertas-pendientes.md

Se observa ciertas divergencias entre doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md y doc-plan/doc-implementar/conocimiento-tec/07a-decisiones-abiertas-pendientes.md

Decisiones Abiertas Pendientes de Resolución:

D-01: Modelado de campos multivalor
  Decisión:
  A) Tablas nuevas + relaciones N:M
  Crear Platform, ClientProject, UseCase, ModelHint como entidades con junction tables
  Normalización completa; queryable; metadatos futuros
  Complejidad alta; migración compleja; 4+ tablas nuevas
  

D-02: Formato de export/import
- ¿Mantener compatibilidad hacia atrás con el formato antiguo de export/import o romper y migrar?
  Decisión:
  Los exports antiguos no son descartables.
  Los datos  en BD actuales son datos "seed"
  Implementar un nuevo formato export/import que contemple todos los nuevos campos y los cambios/ajustes en los arntiguos.
  

D-03: Ownership en duplicado
  ¿Verificar ownership del prompt original antes de permitir duplicar?
  Decisión:
  B) Cualquiera puede duplicar cualquier prompt	
  No se verifica ownership del original
  Máxima reutilización
  

D-04: Auth en export/import
  ¿Restringir export/import al usuario (solo sus datos) o permitir admin global (todos los datos)?
  Decisión:
  A) Usuario solo exporta/importa sus propios prompts
  Filtrar por userID
  Más seguro; privacidad de datos
  NOTA: Cuando  un usario importa promopt se asginan a si mismos. Si en el import se encuentran prompts existentes en BD que coinciden (userId + ID o título prompt) con los  importados, los  importados reemplazan los  existentes en BD. No se borran prompts en BD y los  nuevos prompts se añaden. 
  

D-05: Lista de idiomas para Language
  ¿Qué opciones incluir en el selector de Language?
  Decisión:
  Opción A (mínimo: en, es, nl). Cubre el uso actual y se puede ampliar después.
  NOTAS: en, es, catalán, nl, fr, de, pt, it, gallego, vasco, chino, ruso
  
D-06: Reglas de creación de nuevos valores
  Decisión:
  Opción A con normalización automática (trim + lowercase) para evitar duplicados por case.
  
  
D-07: Transaccionalidad en N:M
  ¿Implementar $transaction explícito para delete+create de relaciones N:M o confiar en Prisma?
  Decisión:
  Opción A ($transaction). Es la más segura. Prisma no envuelve delete+create en una sola transacción automáticamente.
  

D-08: Rate limiting
   ¿Implementar rate limiting en middleware, a nivel de API, o confiar en Vercel?
   Decisión:
   A) Middleware con rate limiting
   Implementar en middleware.ts
   Protección global; antes de llegar a API
   Complejidad; puede afectar rutas públicas

---
