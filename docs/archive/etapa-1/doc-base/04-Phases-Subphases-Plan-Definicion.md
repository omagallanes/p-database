# 04-Phases-Subphases-Plan-Definicion

## 1. Propósito de este documento

Este documento existe para definir, explicar y fijar el sentido del **`04-Phases-Subphases-Plan.md`** dentro del sistema documental del proyecto.

Su función no es ejecutar ni generar la planificación, sino proporcionar una **base común de comprensión** para que cualquier lector, humano o IA, entienda:

* qué es el documento `04-Phases-Subphases-Plan.md`,
* para qué sirve,
* qué lugar ocupa dentro de la cadena documental,
* qué niveles de organización contiene,
* qué debe representar cada nivel,
* cómo se relaciona con la documentación previa,
* y cómo prepara la documentación posterior de sprints.

Este documento debe servir como **lectura previa obligatoria** antes de crear, revisar o usar el `04-Phases-Subphases-Plan.md`. 

---

## 2. Rol del `04-Phases-Subphases-Plan.md` en la cadena documental

El `04-Phases-Subphases-Plan.md` no es un documento aislado.
Forma parte de una secuencia documental con funciones distintas y complementarias.

### 2.1 Documentos previos

#### `doc-plan/doc-base/01-Briefing.md`

Define el marco de la iniciativa:

* problema,
* objetivo,
* alcance,
* límites,
* contexto,
* impacto esperado.

Su función es responder **por qué existe la iniciativa** y **qué pretende resolver**.

#### `doc-plan/doc-base/02-Improvement-Spec.md`

Define la mejora a nivel funcional:

* qué cambio se quiere introducir,
* cómo debe comportarse,
* qué requisitos debe cumplir,
* cómo debe validarse funcionalmente,
* y qué debe quedar medible.

Su función es responder **qué debe cambiar**.

#### `03-Tech-Intervention-Plan.md`

Traduce la definición funcional a realidad técnica concreta contrastada con el repositorio:

* qué partes reales del sistema están implicadas,
* qué cambios técnicos parecen necesarios,
* qué dependencias y condicionantes existen,
* qué validación técnica se requiere,
* cómo impacta la seguridad,
* y qué riesgos o decisiones abiertas quedan.

Su función es responder **cómo debe entenderse técnicamente el trabajo real a realizar**.

### 2.2 Documento actual de planificación

#### `04-Phases-Subphases-Plan.md`

Toma el objetivo, la definición funcional y la base técnica ya analizada, y los convierte en una **estructura ordenada de avance**.

Su función es responder:

* **cómo se agrupa el trabajo**,
* **en qué orden tiene sentido abordarlo**,
* **qué bloques mayores existen**,
* **qué sub-bloques de intervención contiene cada uno**,
* **cómo debe validarse y desplegarse incrementalmente**,
* y **cómo se deja preparado el paso a los sprints**.

### 2.3 Documentación posterior

#### `sprints-plan/`

A partir del `04-Phases-Subphases-Plan.md`, se generarán después los documentos de sprint, uno a uno.

Esos documentos ya no definirán la estructura general, sino la **ejecución concreta** de cada sprint dentro de una subfase concreta.

Cada Sprint deberá leer y tener en cuenta, como mínimo:

* la Fase a la que pertenece dentro de `04-Phases-Subphases-Plan.md`,
* la Subfase concreta que ejecuta,
* la documentación previa del proyecto relevante para esa SF,
* la gobernanza aplicable,
* el estado actual del repositorio,
* y los informes de los Sprints previos de la misma Subfase, si existen.

Esto significa que la documentación posterior de sprint no se genera como un bloque genérico de trabajo, sino como una **pieza subordinada, contextualizada y acumulativa** dentro de la secuencia ya definida por Fase y Subfase.

Por tanto, el paso a `sprints-plan/` no debe entenderse como una simple división temporal del trabajo, sino como la continuación controlada y trazable de una estructura ya fijada en el 04.

---

## 3. Qué es y qué no es el `04-Phases-Subphases-Plan.md`

## 3.1 Qué es

El `04-Phases-Subphases-Plan.md` es un documento de **organización estructurada del trabajo**.

Debe servir para:

* ordenar el avance,
* separar correctamente niveles de planificación,
* evitar mezclar objetivos con tareas,
* dar coherencia a la secuencia de ejecución,
* hacer visible la relación entre bloques de trabajo,
* y preparar la posterior bajada a sprints.

Es, por tanto, un documento de **planificación jerárquica**, no de ejecución detallada.

## 3.2 Qué no es

No debe entenderse como:

* un backlog,
* un listado de tareas,
* un documento de implementación,
* un documento técnico de intervención,
* una secuencia diaria de trabajo,
* un plan de sprint,
* ni una reescritura del `03-Tech-Intervention-Plan.md`.

Tampoco debe convertirse en una pieza narrativa o decorativa.
Su valor está en **ordenar y estructurar**, no en repetir ni adornar.

---

## 4. Jerarquía obligatoria del documento

La comprensión correcta del `04-Phases-Subphases-Plan.md` depende de respetar una jerarquía clara.

Esta jerarquía no es opcional.

## 4.1 Fase

La **Fase** es el nivel superior de organización del trabajo.

### La Fase representa:

* un **grupo mayor de trabajo**,
* una línea de avance coherente,
* un contenedor superior que ordena el proyecto en grandes bloques.

### La Fase existe para:

* evitar mezclar objetivos distintos;
* separar líneas de intervención que no deben confundirse;
* organizar el trabajo en grupos con sentido propio;
* y dar una estructura comprensible al avance global.

### La Fase no debe confundirse con:

* una tarea,
* una ejecución concreta,
* una subfase,
* un sprint.

La Fase agrupa.
La Fase ordena.
La Fase no ejecuta.

---

## 4.2 Subfase (SF)

La **Subfase** es el nivel intermedio y operativo de estructuración.

### La Subfase representa:

* una **acción o intervención concreta** dentro de una Fase;
* un bloque real de avance;
* una unidad suficientemente acotada como para poder validarse y desplegarse.

### La Subfase existe para:

* materializar la Fase en bloques de trabajo reales;
* delimitar intervenciones coherentes;
* preparar una unidad de validación;
* permitir despliegue incremental;
* y servir como contenedor para los sprints posteriores.

### La Subfase debe ser:

* técnicamente coherente,
* funcionalmente entendible,
* validable,
* desplegable,
* y lo bastante acotada como para recibir feedback útil del usuario.

### La Subfase no debe confundirse con:

* una Fase,
* una lista de tareas,
* un sprint,
* ni una simple agrupación arbitraria.

La Subfase organiza la intervención real.
La Subfase prepara la ejecución.
La Subfase es la verdadera unidad de entrega intermedia.

---

## 4.3 Sprint (S)

El **Sprint** es el nivel posterior de ejecución.

### El Sprint representa:

* el nivel de **tareas y ejecuciones concretas** dentro de una Subfase;
* una unidad de trabajo más fina;
* el paso donde se aterriza lo definido por la Subfase.

### El Sprint existe para:

* ejecutar la Subfase de forma gradual;
* organizar tareas concretas;
* adaptarse al estado de los sprints previos;
* incorporar incidencias, mejoras o cambios recientes;
* y producir avance técnico verificable.

### En el `04-Phases-Subphases-Plan.md`, el Sprint:

* debe quedar previsto,
* debe quedar encajado,
* pero **no debe desarrollarse aún con detalle fino**.

Ese detalle pertenece a los documentos posteriores de `sprints-plan/`.

### El Sprint debe entenderse además como:

* una unidad de ejecución concreta subordinada a una SF ya aprobada;
* una pieza que no redefine objetivos, sino que consume lo ya definido por Fase, Subfase y plan técnico;
* una unidad que debe poder cerrarse con trazabilidad suficiente;
* y un punto donde ya importan cambios reales sobre archivos, módulos, servicios, componentes, configuración, pruebas, seguridad y estado actual del repo.

### Cada Sprint:

* se genera **uno a uno**;
* no debe planificarse en bloque para toda la Subfase;
* y debe tener en cuenta no solo la documentación previa, sino también lo ocurrido en los Sprints anteriores de esa misma SF.

### Por tanto, el Sprint no debe tratarse como:

* un nombre decorativo dentro de una tabla;
* una simple partición temporal;
* ni una lista genérica de tareas sin contexto.

El Sprint es la unidad donde la planificación se convierte en **acción concreta, trazable y verificable**.

---

## 5. Regla principal de separación de niveles

Una de las finalidades centrales del `04-Phases-Subphases-Plan.md` es **evitar la mezcla de niveles**.

Por tanto:

* la **Fase** determina el **grupo**;
* la **Subfase** determina las **acciones a realizar**;
* el **Sprint** determina las **tareas y ejecuciones**.

Si estos niveles se mezclan, el documento pierde utilidad y genera arrastre de problemas posteriores.

### Por eso, el `04-Phases-Subphases-Plan.md` debe impedir:

* que una Fase se redacte como si fuera una tarea;
* que una Subfase se redacte como si fuera una Fase;
* que un Sprint aparezca con detalle de implementación antes de tiempo;
* o que los límites entre niveles queden ambiguos.

---

## 6. Qué debe tomar como base el `04-Phases-Subphases-Plan.md`

El documento 04 no se construye desde cero ni desde intuición.

Debe apoyarse sobre documentación ya existente.

## 6.1 Base de objetivo y definición

Debe tener en cuenta:

* `doc-plan/doc-base/01-Briefing.md`
* `doc-plan/doc-base/02-Improvement-Spec.md`

Porque sin ellos se pierde:

* el propósito,
* el alcance,
* el cambio esperado,
* y el sentido funcional de la iniciativa.

## 6.2 Base técnica consolidada

Debe tener en cuenta:

* `03-Tech-Intervention-Plan.md`

Porque ahí ya está la traducción técnica concreta de lo que implica el cambio sobre el proyecto real.

## 6.3 Base técnica parcial detallada

Debe tener en cuenta también los análisis parciales contenidos en:

* `doc-plan/doc-implementar/conocimiento-tec/`

Esto es importante porque el plan de fases y subfases no debe basarse solo en el consolidado, sino también en el detalle parcial que explica:

* mapa técnico de intervención,
* cambios técnicos necesarios,
* relación entre objetivo y realidad,
* dependencias y condicionantes,
* validación técnica,
* seguridad integrada,
* riesgos y decisiones abiertas.

Estos análisis parciales permiten justificar mejor:

* por qué existe cada Fase,
* por qué existe cada Subfase,
* y por qué el orden propuesto tiene sentido.

---

## 7. Relación con la gobernanza del proyecto

El `04-Phases-Subphases-Plan.md` no debe organizar el trabajo ignorando la gobernanza.

Debe tener en cuenta el conocimiento de:

* `.gobernanza/.governance/reglas_proyecto.md`
* `.gobernanza/.governance/inventario_recursos.md`
* `.gobernanza/.governance/conocimiento_tecnico_preventivo.md`
* `.gobernanza/.governance/integracion-prisma-typescript.md`

### Esta gobernanza puede condicionar:

* qué agrupaciones tienen sentido;
* qué límites hay que respetar;
* qué recursos o piezas existen ya;
* qué riesgos conviene prevenir;
* qué integraciones requieren cuidado;
* qué convenciones no deben romperse;
* y qué secuencia resulta más razonable.

Por tanto, la planificación del 04 no debe ser solo funcional o técnica, sino también **gobernada**.

Además, esa misma gobernanza seguirá siendo relevante en el nivel Sprint.

Esto implica que los futuros documentos de sprint no deberán ignorarla ni reinterpretarla libremente, sino consumirla como marco estable de trabajo, especialmente cuando afecte a:

* límites de modificación,
* recursos existentes,
* integración con componentes del proyecto,
* prevención técnica,
* seguridad,
* configuración,
* y convenciones de implementación.

---

## 8. Principios que debe reflejar el `04-Phases-Subphases-Plan.md`

El 04 debe construirse bajo principios explícitos.

## 8.1 Principio de coherencia

Las Fases y Subfases deben tener sentido interno.

No deben existir como agrupaciones arbitrarias o decorativas.

## 8.2 Principio de trazabilidad

Cada Fase y cada Subfase deben poder entenderse en relación con:

* el objetivo,
* la definición funcional,
* el plan técnico,
* los análisis parciales,
* y la gobernanza aplicable.

## 8.3 Principio de no mezcla de niveles

No deben mezclarse:

* grupo,
* acción,
* ejecución.

## 8.4 Principio de validación incremental

Cada Subfase debe poder cerrarse con validación clara.

## 8.5 Principio de despliegue incremental

Cada Subfase debe entenderse, idealmente, como una unidad desplegable o revisable.

## 8.6 Principio de revisión del usuario

El usuario no valida solo al final.
Debe poder revisar, corregir y reorientar por subfases.

## 8.7 Principio de preparación del nivel Sprint

El 04 no ejecuta sprints, pero debe dejar su terreno preparado.

## 8.8 Principio de continuidad entre Sprints

Los Sprints no deben tratarse como piezas aisladas.

Cada Sprint debe apoyarse en:

* la Subfase que ejecuta,
* la Fase a la que pertenece,
* la documentación previa,
* el estado actual del repositorio,
* y los informes acumulados de los S anteriores de esa misma SF.

## 8.9 Principio de cierre trazable

Cada Sprint debe dejar evidencia suficiente de lo realizado para que el siguiente Sprint no parta de supuestos difusos.

Esto implica que el nivel Sprint debe producir documentación de continuidad y no solo ejecución.

---

## 9. Qué debe contener el `04-Phases-Subphases-Plan.md`

Aunque este documento no da instrucciones de creación, sí debe dejar claro qué tipo de contenido se espera en el 04.

El `04-Phases-Subphases-Plan.md` debe contener, al menos, de forma estructurada:

* el propósito del plan,
* la definición de la jerarquía Fase > Subfase > Sprint,
* el criterio de agrupación usado,
* las Fases identificadas,
* las Subfases incluidas en cada Fase,
* el objetivo de cada Fase,
* el papel de cada Subfase,
* el orden entre ellas,
* las dependencias que justifican ese orden,
* la validación esperada por subfase,
* el posible despliegue por subfase,
* la revisión esperada del usuario,
* y la preparación del paso a sprints.

Además, el 04 debe mostrar **qué partes del plan técnico y de los análisis parciales respaldan cada agrupación**.

En relación con Sprint, el 04 debe dejar previsto, al menos, que:

* cada Subfase podrá requerir uno o más Sprints;
* esos Sprints deberán generarse después de forma individual;
* el 04 no detalla todavía sus tareas, pero sí debe dejar preparado su encaje;
* y la planificación de Sprint no podrá construirse ignorando la estructura de Fase y Subfase definida aquí.

---

## 10. Qué no debe contener el `04-Phases-Subphases-Plan.md`

Para que mantenga utilidad y no se convierta en una “biblia” impráctica, el 04 no debe contener todavía:

* tareas detalladas de implementación;
* lista fina de archivos por sprint;
* instrucciones operativas de ejecución;
* casos de prueba detallados;
* checklist exhaustivo de release;
* ni la operativa diaria del trabajo.

Todo eso pertenece al nivel Sprint.

Tampoco debe contener:

* el plan de acción detallado de un Sprint concreto;
* los resultados completos de pruebas de un Sprint;
* el detalle de cambios en archivos concretos hechos por un Sprint;
* informes de ejecución de Sprint;
* ni el consolidado de informes de una Subfase.

Todo eso debe vivir en la documentación posterior de `sprints-plan/`.

---

## 11. Relación entre Subfase, validación y despliegue

Esta relación es crítica.

El 04 no debe entender la Subfase solo como agrupación teórica, sino como **unidad de avance validable**.

### Cada Subfase debe aspirar a ser:

* coherente,
* revisable,
* validable,
* y, en lo posible, desplegable.

### Esto implica que el 04 debe asumir:

* que no se espera validar solo al final del proyecto;
* que el usuario debe poder revisar avances parciales;
* que puede haber correcciones entre subfases;
* y que el orden de avance puede depender de esa validación.

La Subfase, por tanto, no solo organiza trabajo.
También organiza **control y revisión**.

Además, esta lógica no desaparece al bajar a Sprint.

Cada Sprint debe contribuir al cierre correcto de la Subfase, y el último Sprint de una SF debe permitir o preparar:

* la validación de la Subfase,
* el despliegue de la Subfase,
* la revisión del usuario,
* y el cierre documental consolidado de esa SF.

---

## 12. Relación del 04 con los documentos de sprint

El `04-Phases-Subphases-Plan.md` no es el final de la cadena.
Es el puente hacia el nivel Sprint.

Los documentos posteriores de `sprints-plan/` tomarán como base:

* la Fase a la que pertenecen,
* la Subfase concreta que deben ejecutar,
* el plan técnico,
* y el estado ya alcanzado por sprints previos.

Por eso el 04 debe dejar claro:

* qué Subfases existen,
* qué objetivo tiene cada una,
* cómo se ordenan,
* qué dependencia tienen,
* y cómo debe entenderse el paso posterior a Sprint.

### El 04 debe preparar el trabajo posterior sin duplicarlo.

Es decir:

* debe dejar el terreno listo;
* pero no debe hacer el trabajo de los documentos de sprint.

### El nivel Sprint debe entenderse como un sistema documental propio

Eso implica que, para cada Subfase, podrán existir después documentos de Sprint que cumplan funciones distintas, por ejemplo:

* plan de acción de un Sprint concreto;
* informe de ejecución y cierre de ese Sprint;
* y, cuando corresponda, un documento compilado de cierre de Subfase que consolide todos los informes de S de esa SF.

### Cada Sprint debe producir continuidad documental

El Sprint no solo ejecuta.
También debe dejar un registro completo y útil para el siguiente Sprint.

Ese registro deberá recoger, al menos:

* tareas realizadas;
* cambios en archivos existentes;
* archivos nuevos, eliminados o modificados;
* componentes y recursos afectados;
* pruebas ejecutadas y sus resultados;
* incidencias detectadas;
* correcciones aplicadas;
* cambios de configuración;
* despliegue realizado, si aplica;
* incidencias de despliegue y su resolución;
* y comprobaciones o preguntas para el usuario.

### Ese informe de Sprint cumple una función crítica

No es un apéndice opcional.

Debe servir como:

* base del siguiente Sprint de la misma SF;
* memoria operativa real;
* y mecanismo para evitar pérdida de contexto, repetición de errores o suposiciones no documentadas.

### En cierre de Subfase

Cuando un Sprint sea el último de su SF, la documentación posterior deberá poder producir además un documento compilado de Subfase que reúna los informes de todos los Sprints de esa SF y deje trazado:

* el trabajo completo de la Subfase,
* su evolución real,
* las incidencias y correcciones acumuladas,
* el resultado global de validación,
* el despliegue de Subfase,
* y los puntos que condicionen la siguiente SF o Fase.

---

## 13. Cómo debe leerse este documento de definición

Este documento debe leerse como una **base de referencia**.

No es un prompt.
No es una salida operativa.
No es el plan en sí.

Debe usarse para:

* entender qué se espera del 04;
* alinear criterios entre humano e IA;
* evitar confusiones de nivel;
* y mantener coherencia cuando más adelante se creen sprints.

También debe usarse como referencia conceptual cuando se construyan los futuros prompts y documentos de Sprint.

Eso implica que todo lo explicativo sobre:

* qué es un Sprint,
* cómo se relaciona con Fase y Subfase,
* qué función tiene,
* y cómo se conecta con informes, validación y cierre de Subfase,

debe entenderse desde este documento y no reexplicarse innecesariamente en cada prompt posterior.

---

## 14. Relación de este documento con la creación del 04

Este documento no crea el `04-Phases-Subphases-Plan.md`.

Lo que crea el 04 será un **prompt específico de creación**.

Por tanto:

* este documento aporta **sentido, marco, finalidad e integración**;
* el prompt posterior aportará **reglas, requisitos, directrices e instrucciones de creación**.

Ambos documentos son complementarios, pero no equivalentes.

La misma lógica aplicará después al nivel Sprint:

* este documento seguirá aportando el marco conceptual;
* y los prompts específicos de Sprint aportarán las reglas de creación y ejecución concretas para cada operación.

---

## 15. Conclusión

El `04-Phases-Subphases-Plan.md` existe para convertir lo ya definido y analizado en una estructura de avance clara, jerárquica y utilizable.

Para hacerlo correctamente, debe entenderse que:

* no parte de cero;
* no sustituye al plan técnico;
* no ejecuta los sprints;
* no debe mezclar niveles;
* y debe organizar el trabajo de forma que cada Subfase sea una unidad coherente, validable y revisable.

Además, debe dejar preparado un nivel Sprint que no sea ambiguo, genérico ni aislado, sino:

* subordinado a una Subfase concreta,
* trazable a la Fase correspondiente,
* apoyado en documentación previa,
* gobernado por el estado real del proyecto,
* y capaz de dejar continuidad documental para el siguiente Sprint.

Este documento de definición existe precisamente para evitar que el 04 se convierta en un artefacto ambiguo, excesivo o mal entendido.

Su propósito es fijar el marco de comprensión necesario para que el 04 cumpla su función real:
**ordenar el trabajo sin perder trazabilidad, sin mezclar niveles y sin arrastrar problemas a las subfases ni a los sprints posteriores.**
