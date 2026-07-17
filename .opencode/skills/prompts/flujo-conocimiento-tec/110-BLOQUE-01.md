# 110-BLOQUE-01

## Nombre del bloque

**Mapa técnico de intervención**

## Propósito del bloque

Este bloque tiene como objetivo identificar qué partes reales del sistema están implicadas en el trabajo, tomando como referencia:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- y el código real del repositorio

Su función es construir un **mapa técnico inicial, verificable y concreto** de las zonas del sistema que están relacionadas con el cambio deseado.

Este bloque debe permitir responder, con base en evidencia real del repo:

- qué áreas del sistema parecen implicadas;
- qué capas, módulos, servicios, componentes o integraciones están relacionadas;
- qué archivos o directorios concretos merecen atención;
- y qué elementos deben revisarse aunque el impacto todavía no sea concluyente.

Este bloque no debe definir aún la solución técnica final ni convertir el análisis en una lista de tareas de implementación.  
Su foco es **mapear con precisión la zona real de intervención**.

---

## Entradas obligatorias

Debes usar como entradas mínimas:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- el código real del repositorio

Debes usar también, como marco metodológico obligatorio:

- `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`

Y debes tener en cuenta, si existe, el índice o salida previa de preparación:

- `doc-plan/doc-implementar/conocimiento-tec/00-indice-doc-3.md`

---

## Regla metodológica de este bloque

Antes de ejecutar este bloque, debes haber leído y aplicado `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

Debes mantener siempre esta jerarquía:

1. El código del repositorio manda como realidad actual.
2. `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección.
3. Este bloque solo puede trabajar sobre evidencia verificable.
4. Si algo no puede afirmarse con suficiente base, debes indicarlo explícitamente.

Este bloque debe ser **concreto, técnico, trazable y no especulativo**.

---

## Qué debes hacer

1. ✅ **Cargar contexto acumulado**: Leer `doc-plan/doc-implementar/conocimiento-tec/00-indice-doc-3.md` si existe y usarlo como contexto inicial. Si el Bloque 00 ya se ejecutó, no repitas la verificación de existencia de documentos. Confía en su resultado.
2. Leer `doc-plan/doc-base/01-Briefing.md` para entender el marco, el objetivo y los límites del trabajo.
3. Leer `doc-plan/doc-base/02-Improvement-Spec.md` para entender qué cambio funcional se desea y sobre qué experiencia, flujo o comportamiento recae.
4. Inspeccionar el repositorio para localizar las áreas técnicas relacionadas con ese objetivo.
5. Identificar, cuando exista evidencia suficiente:
   - capas implicadas,
   - módulos implicados,
   - servicios implicados,
   - componentes implicados,
   - integraciones relacionadas,
   - configuraciones relacionadas,
   - contratos relevantes,
   - archivos o directorios concretos relevantes.
6. Diferenciar claramente entre:
   - elementos claramente implicados,
   - elementos probablemente relacionados,
   - elementos que deben revisarse por dependencia o proximidad estructural.
7. Documentar el grado de relación de cada elemento con el objetivo.
8. Sustentar cada afirmación en evidencia observable del repo.
9. Señalar incertidumbres o límites del análisis cuando no haya base suficiente para afirmar más.

✅ **Nota**: Todo lo identificado aquí se convertirá en insumo obligatorio para el Bloque 02.

---

## Qué no debes hacer

No debes:

- proponer todavía una solución técnica cerrada;
- convertir este bloque en backlog;
- bajar a planificación por fases, subfases o sprints;
- describir secuencias de implementación;
- asumir relaciones entre componentes sin evidencia;
- inventar arquitectura no observada;
- rellenar huecos con patrones genéricos;
- usar formulaciones vagas como “posiblemente afecta a todo el sistema” sin justificarlo;
- resolver discrepancias funcionales o técnicas que deban quedar para bloques posteriores.

---

## Documento de salida esperado

Debes generar una salida en Markdown pensada para corresponder a:

- `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md`

La salida debe mostrarse **en el chat**, en formato **Markdown**, dentro de un **lienzo de código**.

No debes asumir escritura automática en disco salvo instrucción explícita del usuario.

---

## Estructura mínima obligatoria de la salida

La salida de este bloque debe contener, como mínimo, estas secciones:

### 1. Alcance del análisis del bloque
Debe indicar:

- qué objetivo o parte del objetivo se ha tomado como referencia;
- qué se ha inspeccionado del repo;
- y hasta qué nivel de detalle ha podido llegarse con la evidencia encontrada.

### 2. Resumen del mapa técnico
Debe sintetizar, de forma breve y concreta:

- qué zonas del sistema aparecen como más relevantes;
- qué capas o dominios técnicos concentran el impacto más probable;
- y qué tipo de intervención parece anticiparse, sin entrar todavía en detalle de implementación.

### 3. Áreas del sistema implicadas
Debe identificar las áreas relevantes del sistema, por ejemplo si aplica:

- frontend;
- backend;
- servicios internos;
- integraciones externas;
- persistencia;
- configuración;
- seguridad;
- validación;
- observabilidad;
- despliegue.

No debes forzar esta lista si el repo no soporta esa estructura.  
Debes reflejar lo que realmente se observe.

### 4. Capas, módulos y servicios relacionados
Debe listar los elementos técnicos detectados y explicar:

- qué son;
- por qué están relacionados con el objetivo;
- cuál parece ser su grado de implicación.

### 5. Componentes, flujos técnicos e integraciones relacionadas
Debe identificar:

- componentes o piezas funcionales relevantes;
- flujos técnicos conectados con el cambio;
- integraciones implicadas o dependientes;
- y cualquier punto de conexión relevante dentro del sistema.

### 6. Archivos o directorios concretos relevantes
Debe bajar a nivel de archivo o directorio cuando la evidencia del repo lo permita.

Debe dejar claro:

- la ubicación;
- el tipo de elemento;
- su relación con el objetivo;
- y por qué merece atención en bloques posteriores.

### 7. Elementos que deben revisarse aunque el impacto no sea concluyente
Debe incluir elementos que no pueden marcarse aún como afectados con certeza, pero que razonablemente deben revisarse por:

- dependencia;
- acoplamiento;
- proximidad funcional;
- contrato compartido;
- configuración relacionada;
- o impacto indirecto plausible sustentado en evidencia.

### 8. Evidencia encontrada en el repo
Debe dejar trazabilidad mínima de la base observada.

No hace falta copiar grandes fragmentos, pero sí dejar claro:

- qué evidencias sostienen el análisis;
- qué rutas, módulos o estructuras lo respaldan;
- y qué hallazgos son más relevantes para bloques posteriores.

### 9. Observaciones clave para los siguientes bloques
Debe indicar qué aspectos detectados aquí condicionarán especialmente:

- los cambios técnicos necesarios;
- la relación entre objetivo y realidad;
- las dependencias y condicionantes;
- la validación técnica;
- la seguridad integrada;
- y los riesgos o decisiones abiertas.

### 10. Bloqueos o límites del análisis
Solo si aplica.

Debe dejar claro:

- qué no pudo determinarse;
- por qué no pudo determinarse;
- qué evidencia faltó;
- y cómo condiciona eso la confianza del mapa técnico generado.

---

## Formato recomendado

Debes priorizar formatos estructurados y escaneables.

Cuando sea útil, usa tablas como esta:

| Elemento técnico | Tipo | Ubicación | Relación con el objetivo | Grado de implicación | Evidencia |
|---|---|---|---|---|---|

También puedes usar agrupaciones como:

- **claramente implicados**
- **relacionados con alta probabilidad**
- **a revisar por dependencia**
- **pendientes de confirmación**

Pero no uses estas categorías si no están justificadas por evidencia.

---

## Criterios de clasificación recomendados

Cuando clasifiques elementos, usa criterios como:

### Claramente implicado
Cuando la relación con el objetivo esté respaldada de forma directa por:

- estructura del código;
- nombres;
- contratos;
- acoplamientos observables;
- uso en flujos relevantes;
- o evidencia funcional/técnica suficientemente clara.

### Relacionado con alta probabilidad
Cuando haya señales fuertes de relación, aunque no completamente concluyentes.

### A revisar por dependencia
Cuando el elemento no parezca central, pero sí potencialmente afectado por compartir:

- contratos;
- configuración;
- flujo;
- datos;
- validaciones;
- integración;
- o mecanismos transversales.

### Pendiente de confirmación
Cuando existan indicios, pero no base suficiente para afirmarlo con seguridad.

---

## Requisitos de calidad de este bloque

La salida debe ser:

- concreta;
- verificable;
- trazable;
- no ambigua;
- no especulativa;
- suficientemente precisa para alimentar los siguientes bloques;
- y útil como base real del trabajo técnico posterior.

No debe ser:

- retórica;
- decorativa;
- redundante;
- abstracta;
- ni una explicación general del sistema sin foco en el objetivo.

---

## Señales de mala ejecución que debes evitar

Evita especialmente estos errores:

- listar áreas genéricas del sistema sin comprobar si realmente están implicadas;
- confundir visibilidad funcional con implicación técnica real;
- inflar el mapa técnico “por si acaso”;
- omitir archivos concretos cuando el repo sí permite identificarlos;
- mezclar ya en este bloque decisiones de implementación;
- usar frases vagas sin evidencia;
- ignorar piezas transversales relevantes como seguridad, configuración, validación o integración cuando el cambio las toca.

---

## Instrucción final del bloque

Tu tarea en este bloque es **mapear con precisión la zona real de intervención técnica**, no diseñar todavía la solución.

Debes producir una salida clara, estructurada y basada en evidencia, que permita continuar con el menor nivel posible de ambigüedad hacia los siguientes bloques del **Plan Técnico de Intervención**.

## Salida/Resultado

Guarda tu respuesta/resultado en un archivo (con índice de contenido) en doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md

---

## ✅ Validación de salida

Antes de finalizar, verifica que tu salida contiene TODAS estas secciones:
1. Alcance del análisis del bloque
2. Resumen del mapa técnico
3. Áreas del sistema implicadas
4. Nivel de certeza y limitaciones
5. Observaciones para bloques posteriores
6. Evidencia principal utilizada
7. Bloqueos o límites del análisis
