# 199-BLOQUE-99

## Nombre del bloque

**Consolidación del Plan Técnico de Intervención**

## Propósito del bloque

Este bloque tiene como objetivo consolidar en un único documento coherente, preciso y utilizable el resultado acumulado de los bloques previos del **Plan Técnico de Intervención**, tomando como referencia:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- el código real del repositorio
- y todas las salidas parciales ya generadas en `doc-plan/doc-implementar/conocimiento-tec/`

Su función es producir el documento final:

- `doc-plan/doc-base/03-Tech-Intervention-Plan.md`

a partir de evidencia ya trabajada en los bloques anteriores, sin inventar contenido nuevo, sin reinterpretar de forma excesiva lo ya analizado y sin perder precisión operativa.

Este bloque no debe convertirse en un resumen superficial ni en una reescritura decorativa.  
Su foco es **integrar y ordenar el análisis ya realizado para dejar un documento técnico final, coherente, accionable y útil como base para el siguiente nivel documental**.

---

## Entradas obligatorias

Debes usar como entradas mínimas:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- el código real del repositorio

Debes usar también, como marco metodológico obligatorio:

- `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`

Debes tener en cuenta, si existen, las salidas parciales previas relacionadas:

- `doc-plan/doc-implementar/conocimiento-tec/00-indice-doc-3.md`
- `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md`
- `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md`
- `doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md`
- `doc-plan/doc-implementar/conocimiento-tec/04-dependencias-y-condicionantes-tecnicos.md`
- `doc-plan/doc-implementar/conocimiento-tec/05-validacion-tecnica.md`
- `doc-plan/doc-implementar/conocimiento-tec/06-seguridad-integrada.md`
- `doc-plan/doc-implementar/conocimiento-tec/07-riesgos-y-decisiones-abiertas.md`

---

## Regla metodológica de este bloque

Antes de ejecutar este bloque, debes haber leído y aplicado `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

Debes mantener siempre esta jerarquía:

1. El código del repositorio manda como realidad actual.
2. `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección.
3. Las salidas parciales previas del Plan Técnico de Intervención son la base inmediata de consolidación.
4. Este bloque no debe inventar contenido nuevo no soportado por los bloques previos o por evidencia del repo.
5. Si detectas inconsistencias entre bloques, debes hacerlas explícitas en lugar de ocultarlas.

Este bloque debe ser **integrador, técnico, trazable y no especulativo**.

---

## Qué debes hacer

1. ✅ **Validar dependencias**: Verificar que existen las salidas de TODOS los bloques 00 a 07. Si falta alguna, detente y notifícalo. No generes el documento consolidado incompleto.
2. Leer `doc-plan/doc-base/01-Briefing.md` para recuperar el marco general del cambio y su propósito.
3. Leer `doc-plan/doc-base/02-Improvement-Spec.md` para recuperar el objetivo funcional que el sistema debe llegar a soportar.
4. Leer todas las salidas parciales disponibles en `doc-plan/doc-implementar/conocimiento-tec/`.
4. Consolidar sus hallazgos en un único documento técnico final.
5. Mantener la consistencia entre:
   - objetivo;
   - realidad observada del repo;
   - mapa técnico;
   - cambios técnicos necesarios;
   - grado de alineación;
   - dependencias y condicionantes;
   - validación técnica;
   - seguridad integrada;
   - y riesgos / decisiones abiertas.
6. Eliminar redundancias innecesarias entre bloques, pero sin perder matices importantes.
7. Preservar visibles las discrepancias relevantes y las decisiones abiertas.
8. Mantener el documento final como una base útil para el trabajo posterior, especialmente para el futuro:
   - `doc-plan/doc-base/04-Phases-Subphases-Plan.md`
   - y los documentos de ejecución posteriores en `doc-plan/doc-implementar/sprints-plan/`
9. Si detectas contradicciones o huecos relevantes entre bloques, documentarlos explícitamente en lugar de rellenarlos de forma especulativa.

---

## Qué no debes hacer

No debes:

- convertir la consolidación en un simple resumen ejecutivo;
- inventar contenido nuevo no soportado por bloques previos o por evidencia del repo;
- suavizar discrepancias, riesgos o decisiones abiertas para que el documento “quede mejor”;
- eliminar información operativamente importante por brevedad;
- transformar el documento final en backlog, planificación por sprints o secuencia de implementación;
- reescribir todo en tono narrativo perdiendo estructura técnica;
- mezclar información de futuros documentos que aún no corresponden a este nivel;
- ocultar inconsistencias entre bloques si aparecen.

---

## Documento de salida esperado

Debes generar una salida en Markdown pensada para corresponder a:

- `doc-plan/doc-base/03-Tech-Intervention-Plan.md`

La salida debe mostrarse **en el chat**, en formato **Markdown**, dentro de un **lienzo de código**.

No debes asumir escritura automática en disco salvo instrucción explícita del usuario.

---

## Estructura mínima obligatoria de la salida

La salida de este bloque debe contener, como mínimo, estas secciones:

### 1. Propósito del Plan Técnico de Intervención
Debe explicar brevemente:

- qué documento es;
- para qué existe;
- qué entradas lo sustentan;
- y qué papel cumple dentro del sistema documental.

### 2. Resumen operativo del análisis técnico
Debe sintetizar, de forma breve y precisa:

- qué tipo de intervención técnica se anticipa;
- qué zonas del sistema concentran el trabajo principal;
- qué nivel de alineación existe entre objetivo y realidad;
- y qué condicionantes o riesgos destacan.

### 3. Mapa técnico de intervención
Debe consolidar de forma clara:

- las áreas del sistema implicadas;
- capas, módulos, servicios, componentes, integraciones o archivos relevantes;
- y la zona real de intervención observada en el repositorio.

### 4. Cambios técnicos necesarios
Debe integrar de forma ordenada:

- qué parte parece ya soportada por el sistema actual;
- qué parte requiere ajuste;
- qué parte requiere ampliación;
- qué parte exige intervención estructural;
- y qué parte sigue siendo incierta o dependiente de validación adicional.

### 5. Relación entre objetivo y realidad
Debe dejar visible:

- qué parte del objetivo ya está soportada;
- qué parte está solo parcialmente soportada;
- qué parte no está soportada;
- dónde existen fricciones;
- y qué gaps estructurales o funcionales explican esa distancia.

### 6. Dependencias y condicionantes técnicos
Debe consolidar:

- dependencias internas;
- dependencias con contratos o integraciones;
- condicionantes de configuración o infraestructura observable;
- restricciones estructurales relevantes;
- y puntos sensibles que amplifican impacto o complejidad.

### 7. Validación técnica
Debe integrar:

- qué debe validarse;
- qué mecanismos existentes del repo pueden aprovecharse;
- qué cobertura mínima parece razonable;
- qué puntos exigen validación reforzada;
- y qué gaps de validación siguen abiertos.

### 8. Seguridad integrada
Debe consolidar:

- mecanismos de seguridad existentes relevantes;
- puntos del cambio con impacto en seguridad;
- elementos que deben preservarse;
- elementos que deben revisarse o reforzarse;
- validaciones de seguridad a contemplar;
- y riesgos de seguridad relevantes.

### 9. Riesgos y decisiones abiertas
Debe integrar:

- riesgos técnicos;
- riesgos de seguridad;
- riesgos de validación o cobertura;
- discrepancias entre objetivo y realidad;
- decisiones abiertas que requieren intervención del usuario;
- alternativas técnicas tentativas;
- y recomendaciones razonadas, cuando exista base suficiente.

### 10. Conclusiones operativas para el trabajo posterior
Debe indicar, de forma clara:

- qué base deja preparada este documento;
- qué aspectos deberán tenerse especialmente en cuenta en el siguiente nivel documental;
- qué riesgos o decisiones no deben perderse;
- y qué zonas del análisis condicionarán con más fuerza la organización posterior del trabajo.

### 11. Evidencia principal utilizada
Debe dejar trazabilidad mínima de:

- qué documentos y salidas parciales sustentan el contenido consolidado;
- qué evidencias del repo son especialmente relevantes;
- y dónde existen límites de confianza.

### 12. Inconsistencias, límites o bloqueos detectados
Solo si aplica.

Debe indicar:

- qué inconsistencias entre bloques o evidencias se han detectado;
- qué límites de consolidación existen;
- qué información no ha podido integrarse con plena confianza;
- y cómo condiciona eso la solidez del documento final.

---

## Formato recomendado

Debes priorizar una salida estructurada, técnica y legible.

Puedes combinar:

- secciones breves;
- tablas;
- listas;
- matrices;
- y bloques de síntesis comparativa.

Cuando sea útil, usa tablas como esta:

| Área / elemento | Estado actual observado | Cambio técnico necesario | Dependencias / condicionantes | Validación requerida | Impacto en seguridad | Riesgos / decisiones |
|---|---|---|---|---|---|---|

También puedes usar tablas más específicas por sección, siempre que ayuden a mantener:

- precisión;
- trazabilidad;
- y utilidad operativa.

---

## Requisitos de calidad de este bloque

La salida debe ser:

- coherente;
- técnica;
- verificable;
- trazable;
- no ambigua;
- no especulativa;
- útil como documento final de este nivel;
- y suficientemente clara como para servir de base al trabajo posterior sin arrastrar contradicciones ocultas.

No debe ser:

- retórica;
- superficial;
- redundante en exceso;
- decorativa;
- una simple fusión mecánica de bloques;
- ni una reescritura que pierda precisión o elimine decisiones abiertas importantes.

---

## Señales de mala ejecución que debes evitar

Evita especialmente estos errores:

- resumir demasiado y perder contenido operativamente importante;
- eliminar discrepancias o decisiones abiertas para “limpiar” el documento;
- introducir contenido nuevo no soportado por los bloques previos;
- no detectar inconsistencias entre salidas parciales;
- fusionar bloques de forma desordenada o repetitiva;
- perder la trazabilidad con `doc-plan/doc-base/01-Briefing.md`, `doc-plan/doc-base/02-Improvement-Spec.md` y el repo;
- convertir el documento final en una explicación genérica del proyecto;
- anticipar ya la estructura del siguiente nivel documental.

---

## Instrucción final del bloque

Tu tarea en este bloque es **consolidar con precisión todo el análisis previo en un único Plan Técnico de Intervención útil, coherente y accionable**, sin inventar ni degradar la calidad del trabajo ya realizado.

## Salida/Resultado

Debes producir una salida clara, estructurada y verificable que corresponda a:

- `doc-plan/doc-base/03-Tech-Intervention-Plan.md`

y que deje una base técnica sólida para el trabajo documental y operativo posterior.

---

## ✅ Validación de salida

Antes de finalizar, verifica que tu salida contiene TODAS estas secciones:
1. Propósito del Plan Técnico de Intervención
2. Resumen operativo del análisis técnico
3. Mapa técnico de intervención
4. Cambios técnicos necesarios
5. Relación entre objetivo y realidad
6. Dependencias y condicionantes técnicos
7. Validación técnica
8. Seguridad integrada
9. Riesgos y decisiones abiertas
10. Conclusiones operativas para el trabajo posterior
11. Evidencia principal utilizada
12. Inconsistencias, límites o bloqueos detectados