# 160-BLOQUE-06

## Nombre del bloque

**Seguridad integrada**

## Propósito del bloque

Este bloque tiene como objetivo analizar cómo impacta el cambio sobre los mecanismos, módulos, controles y condiciones de seguridad ya presentes en el sistema, tomando como referencia:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- el código real del repositorio
- y los hallazgos acumulados en los bloques anteriores

Su función es dejar explícito:

- qué partes del cambio afectan o pueden afectar a la seguridad;
- qué mecanismos de seguridad existentes deben preservarse;
- qué puntos deben revisarse o reforzarse;
- qué validaciones de seguridad deben contemplarse;
- qué riesgos de seguridad aparecen o se amplifican;
- y qué decisiones abiertas relacionadas con seguridad podrían condicionar el trabajo posterior.

Este bloque no debe tratar la seguridad como un apéndice aislado ni como una checklist genérica.  
Su foco es **integrar la seguridad dentro de la realidad técnica del cambio**, apoyándose en los mecanismos reales ya presentes en el repositorio.

---

## Entradas obligatorias

Debes usar como entradas mínimas:

- `doc-plan/doc-base/01-Briefing.md`
- `doc-plan/doc-base/02-Improvement-Spec.md`
- el código real del repositorio

Debes usar también, como marco metodológico obligatorio:

- `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`

Debes tener en cuenta, si existen, las salidas previas relacionadas:

- `doc-plan/doc-implementar/conocimiento-tec/00-indice-doc-3.md`
- `doc-plan/doc-implementar/conocimiento-tec/01-mapa-tecnico-intervencion.md`
- `doc-plan/doc-implementar/conocimiento-tec/02-cambios-tecnicos-necesarios.md`
- `doc-plan/doc-implementar/conocimiento-tec/03-relacion-objetivo-vs-realidad.md`
- `doc-plan/doc-implementar/conocimiento-tec/04-dependencias-y-condicionantes-tecnicos.md`
- `doc-plan/doc-implementar/conocimiento-tec/05-validacion-tecnica.md`

---

## Regla metodológica de este bloque

Antes de ejecutar este bloque, debes haber leído y aplicado `doc-plan/bas/prompts/flujo-conocimiento-tec/020-PROMPT-COMUN-DOC-3.md`.

Debes mantener siempre esta jerarquía:

1. El código del repositorio manda como realidad actual.
2. `doc-plan/doc-base/01-Briefing.md` y `doc-plan/doc-base/02-Improvement-Spec.md` mandan como objetivo y dirección.
3. La seguridad debe analizarse sobre mecanismos, flujos y restricciones realmente observables en el sistema.
4. Debes priorizar los módulos, utilidades, controles y patrones de seguridad ya existentes en el repo.
5. Si una implicación de seguridad no puede afirmarse con mínima fiabilidad, debes indicarlo como incertidumbre, limitación o necesidad de confirmación, no como hecho.

Este bloque debe ser **técnico, transversal, trazable y no especulativo**.

---

## Qué debes hacer

1. ✅ **Validar dependencias**: Verificar que existen las salidas de los bloques 00 a 05. Si falta alguna, detente y notifícalo.
2. ✅ **Cargar contexto acumulado**: Leer las salidas de los bloques 00 a 05. Usa los cambios técnicos y dependencias ya identificados para centrar el análisis de seguridad.
3. Leer `doc-plan/doc-base/01-Briefing.md` para recuperar el marco del cambio, sus límites y el tipo de impacto esperado.
4. Leer `doc-plan/doc-base/02-Improvement-Spec.md` para identificar:
   - qué comportamiento se quiere introducir o modificar;
   - qué flujos, interacciones o reglas funcionales pueden tener impacto en seguridad;
   - qué validaciones, excepciones o decisiones funcionales pueden afectar a autenticación, autorización, exposición de datos o control de acceso.
5. Revisar los hallazgos previos sobre:
   - mapa técnico de intervención;
   - cambios técnicos necesarios;
   - relación entre objetivo y realidad;
   - dependencias y condicionantes técnicos;
   - validación técnica.
6. Inspeccionar el repositorio para localizar mecanismos reales de seguridad, por ejemplo si aplica:
   - autenticación;
   - autorización;
   - permisos;
   - roles;
   - guards;
   - middlewares;
   - interceptores;
   - validaciones;
   - sanitización;
   - protección de rutas o endpoints;
   - control de acceso a vistas o componentes;
   - control de exposición de datos;
   - filtros;
   - rate limiting;
   - manejo de secretos;
   - configuración sensible;
   - políticas de sesión;
   - utilidades de seguridad;
   - wrappers o helpers de acceso;
   - mecanismos de auditoría o trazabilidad;
   - y cualquier control transversal observable.
7. Identificar qué partes del cambio afectan directa o indirectamente a esos mecanismos.
8. Distinguir claramente entre:
   - elementos de seguridad que deben preservarse intactos;
   - elementos que deben revisarse;
   - elementos que deben reforzarse o adaptarse;
   - riesgos de seguridad nuevos o amplificados;
   - y puntos donde falta evidencia suficiente para afirmar más.
9. Relacionar cada impacto o necesidad de seguridad con:
   - el cambio técnico o funcional que lo provoca;
   - el mecanismo real del repo que puede verse afectado;
   - el riesgo asociado;
   - y la validación o cuidado posterior que exigirá.
10. Señalar si el cambio toca o puede tocar:
    - acceso a datos;
    - exposición de información;
    - flujos autenticados;
    - permisos;
    - acciones privilegiadas;
    - contratos sensibles;
    - configuraciones críticas;
    - integraciones sensibles;
    - o comportamientos donde la relajación de controles pueda introducir problemas.
11. Indicar qué hallazgos de este bloque condicionarán especialmente:
    - la validación técnica;
    - los riesgos y decisiones abiertas;
    - y la futura documentación operativa de trabajo más detallado.

---

## Qué no debes hacer

No debes:

- tratar seguridad como una lista genérica de buenas prácticas desconectadas del repo;
- asumir que el sistema usa mecanismos estándar si no están observados;
- inventar amenazas abstractas sin vínculo con el cambio real;
- convertir este bloque en un threat model completo si el contexto no lo exige;
- redactar recomendaciones vagas como “tener en cuenta la seguridad” sin concretar qué se ve afectado y por qué;
- mezclar seguridad con planificación por sprints;
- repetir el contenido de validación técnica sin aportar el foco específico de seguridad;
- proponer reescrituras globales de la seguridad del sistema sin base suficiente;
- cerrar decisiones sensibles que deban quedar abiertas para el usuario.

---

## Documento de salida esperado

Debes generar una salida en Markdown pensada para corresponder a:

- `doc-plan/doc-implementar/conocimiento-tec/06-seguridad-integrada.md`

La salida debe mostrarse **en el chat**, en formato **Markdown**, dentro de un **lienzo de código**.

No debes asumir escritura automática en disco salvo instrucción explícita del usuario.

---

## Estructura mínima obligatoria de la salida

La salida de este bloque debe contener, como mínimo, estas secciones:

### 1. Alcance del análisis del bloque
Debe indicar:

- qué parte del cambio se ha tomado como referencia para el análisis de seguridad;
- qué zonas del sistema se han revisado;
- y hasta qué nivel de fiabilidad ha podido evaluarse el impacto en seguridad.

### 2. Resumen del impacto en seguridad
Debe sintetizar, de forma breve y precisa:

- si el cambio afecta o no a mecanismos relevantes de seguridad;
- qué zonas concentran el mayor impacto o sensibilidad;
- qué controles deben preservarse;
- y dónde aparecen revisiones, refuerzos o riesgos relevantes.

### 3. Mecanismos de seguridad existentes relevantes
Debe identificar los mecanismos de seguridad realmente observables en el repositorio que guardan relación con el cambio.

Para cada uno, debe indicar:

- qué mecanismo es;
- dónde está o cómo se manifiesta en el sistema;
- qué función cumple;
- y por qué es relevante para el cambio.

### 4. Puntos del cambio con impacto en seguridad
Debe señalar qué partes del cambio afectan o pueden afectar a seguridad, por ejemplo si aplica:

- acceso a recursos;
- exposición de datos;
- controles de acceso;
- rutas o endpoints protegidos;
- acciones privilegiadas;
- validaciones de entrada;
- filtrado de datos;
- persistencia de información sensible;
- integraciones sensibles;
- configuración o secretos;
- sesión, identidad o contexto del usuario.

No debes forzar esta lista si el sistema no muestra esos elementos.  
Debes reflejar solo lo que el cambio realmente toca o puede tocar.

### 5. Elementos que deben preservarse
Debe dejar claro qué controles, mecanismos o comportamientos de seguridad **no deben degradarse** como consecuencia del cambio.

Debes explicar:

- qué debe preservarse;
- por qué;
- y qué riesgo habría si se alterara o relajara.

### 6. Elementos que deben revisarse o reforzarse
Debe identificar los puntos donde el cambio exige revisar, adaptar o reforzar seguridad.

Puede incluir, si la evidencia lo justifica:

- permisos;
- validaciones;
- filtros;
- sanitización;
- políticas de acceso;
- trazabilidad;
- manejo de datos sensibles;
- protección de flujos;
- o configuración de seguridad relacionada.

Debes dejar claro:

- qué se ve afectado;
- por qué necesita revisión o refuerzo;
- y cuál parece ser la naturaleza del ajuste necesario.

### 7. Validaciones de seguridad a contemplar
Debe identificar qué comprobaciones específicas de seguridad deberán tenerse en cuenta posteriormente, apoyándose preferentemente en mecanismos existentes del repo.

No debes convertir esta sección en una lista exhaustiva de tests, pero sí debes dejar claro:

- qué debe verificarse;
- por qué;
- y qué base actual del proyecto puede aprovecharse para ello.

### 8. Riesgos de seguridad identificados o amplificados
Debe señalar riesgos que el cambio introduce, amplifica o deja especialmente expuestos.

Debes priorizar riesgos vinculados al sistema real, por ejemplo si aplica:

- acceso no autorizado;
- fuga o sobreexposición de datos;
- relajación de controles;
- bypass de validaciones;
- incoherencia entre capas de control;
- errores en enforcement de permisos;
- ampliación involuntaria de superficie de exposición;
- o dependencia de configuraciones sensibles.

### 9. Puntos inciertos o pendientes de confirmación
Debe recoger los casos donde:

- no puede afirmarse con suficiente fiabilidad el impacto de seguridad;
- la observación del repo es insuficiente;
- existen indicios de control, pero no evidencia suficiente de su alcance;
- o el cambio podría tocar piezas sensibles cuya relación todavía no es concluyente.

Debes dejar claro por qué existe esa incertidumbre.

### 10. Observaciones que condicionan bloques posteriores
Debe indicar qué hallazgos de este bloque condicionarán especialmente:

- la validación técnica;
- los riesgos y decisiones abiertas;
- y la futura documentación operativa más detallada.

### 11. Evidencia principal utilizada
Debe dejar trazabilidad mínima de:

- qué módulos, archivos, controles, configuraciones o utilidades del repo sostienen el análisis;
- qué evidencia permite afirmar que existe o no impacto relevante en seguridad;
- y dónde existen límites de confianza.

### 12. Bloqueos o límites del análisis
Solo si aplica.

Debe indicar:

- qué parte del impacto en seguridad no pudo determinarse con suficiente fiabilidad;
- por qué;
- qué evidencia faltó;
- y cómo condiciona eso la confianza del análisis.

---

## Formato recomendado

Debes priorizar formatos estructurados y comparativos.

Cuando sea útil, usa tablas como esta:

| Mecanismo o punto sensible | Tipo | Ubicación / evidencia | Relación con el cambio | Impacto en seguridad | Qué debe preservarse / revisarse | Nivel de certeza | Notas |
|---|---|---|---|---|---|---|---|

También puedes usar agrupaciones como:

- **mecanismos a preservar**
- **mecanismos a revisar**
- **mecanismos a reforzar**
- **riesgos identificados**
- **pendientes de confirmación**

Pero no uses estas categorías si no están justificadas por evidencia.

---

## Criterios de clasificación recomendados

Cuando clasifiques el impacto en seguridad, usa criterios como estos:

### A preservar
Cuando existe un control o mecanismo relevante que el cambio no debe degradar ni relajar.

### A revisar
Cuando el cambio puede afectar al comportamiento, cobertura o coherencia del control y requiere verificación o ajuste.

### A reforzar
Cuando el control actual existe, pero el cambio aumenta la exigencia o exposición y hace razonable endurecerlo o ampliarlo.

### Riesgo identificado
Cuando el cambio crea o amplifica una posibilidad relevante de fallo de seguridad observable en el contexto del sistema real.

### Pendiente de confirmación
Cuando existen indicios de impacto o sensibilidad, pero no suficiente evidencia para afirmarlo con seguridad.

---

## Requisitos de calidad de este bloque

La salida debe ser:

- concreta;
- técnica;
- verificable;
- trazable;
- no ambigua;
- no especulativa;
- útil para los bloques posteriores;
- y suficientemente clara como para evitar que seguridad quede tratada de forma superficial o decorativa.

No debe ser:

- retórica;
- genérica;
- alarmista sin evidencia;
- una checklist estándar de ciberseguridad sin vínculo con el sistema;
- ni una repetición de otros bloques sin foco específico en seguridad.

---

## Señales de mala ejecución que debes evitar

Evita especialmente estos errores:

- asumir mecanismos de seguridad inexistentes por convención;
- tratar seguridad como algo separado del cambio real;
- no identificar qué controles concretos pueden verse afectados;
- listar riesgos abstractos sin relación con el repositorio;
- no distinguir entre preservar, revisar y reforzar;
- olvidar exposición de datos, permisos, validaciones o flujos protegidos cuando el cambio los toca;
- no dejar clara la incertidumbre cuando la evidencia del repo sea insuficiente;
- mezclar este bloque con despliegue, QA final o decisiones de sprint.

---

## Instrucción final del bloque

Tu tarea en este bloque es **integrar la seguridad dentro del análisis técnico del cambio**, con base en evidencia real del proyecto y sin tratarla como una capa decorativa o genérica.

Debes producir una salida clara, estructurada y verificable, que permita continuar con el menor nivel posible de ambigüedad hacia los siguientes bloques del **Plan Técnico de Intervención**.

## Salida/Resultado

Guarda tu respuesta/resultado en un archivo (con índice de contenido) en doc-plan/doc-implementar/conocimiento-tec/06-seguridad-integrada.md

---

## ✅ Validación de salida

Antes de finalizar, verifica que tu salida contiene TODAS estas secciones:
1. Alcance del análisis del bloque
2. Resumen del impacto en seguridad
3. Mecanismos de seguridad existentes relevantes
4. Puntos del cambio con impacto en seguridad
5. Elementos que deben preservarse / revisarse / reforzarse
6. Validaciones de seguridad a contemplar
7. Riesgos de seguridad identificados
8. Observaciones para bloques posteriores
9. Evidencia principal utilizada
10. Bloqueos o límites del análisis
