# Briefing técnico del proyecto

## 1. Problema a resolver

La aplicación ya resuelve el CRUD de prompts y concentra la experiencia principal en el listado `/prompts`, los filtros y un único formulario reutilizado para crear y editar. Ese formulario se organiza hoy en tres áreas visibles —**Basic Information**, **Metadata** y **Advanced**—, pero la mejora que motiva esta iniciativa se concentra sobre todo en las dos primeras y en el flujo principal de trabajo del prompt.

Sin embargo, esa experiencia está construida sobre un modelo y una interacción más simples que el uso real que hoy se necesita: el formulario trabaja con `platform` y `category` como valores únicos, `tags` solo permite reutilizar valores ya existentes desde el propio formulario, y otros campos de la sección **Metadata** como `Client/Project`, `Use Case`, `Model Hint` y `Language` siguen comportándose de una forma demasiado rígida para la gestión real del prompt. A esto se suma que el listado solo tiene visualización en cards y que las acciones de guardado y edición expulsan al usuario de su contexto al devolverlo al listado. Esto afecta directamente al usuario operativo que mantiene prompts y, de forma indirecta, al equipo que necesita una gestión más fluida y expresiva de los datos del prompt.

Además, el esquema actual del producto refleja esa limitación: `Prompt` tiene un solo `platform` y un solo `categoryId`, mientras que solo `tags` está resuelto como relación múltiple. En la práctica, esto hace que la estructura actual represente peor la realidad de uso y obligue a simplificar información que el usuario considera relevante para un mismo prompt. La limitación no se percibe solo en los datos, sino también en la experiencia: la sección **Metadata** no acompaña todavía la complejidad real del uso del prompt y la sección **Basic Information** no muestra toda la información funcional que el usuario quiere asociar al registro.

El impacto observable actual es una UX menos eficiente para alta, edición y reutilización de prompts: más saltos de navegación, menor continuidad al trabajar sobre un registro, menor densidad de lectura en el listado y un modelo de datos del prompt que no acompaña la complejidad real de clasificación y uso. También provoca que parte de la información relevante del prompt no tenga todavía un espacio funcional claro o no pueda gestionarse con el mismo nivel de flexibilidad dentro del propio formulario.

## 2. Objetivo

Mejorar la interacción del usuario con la aplicación y con los datos de cada prompt, aumentando la continuidad del flujo de trabajo en el CRUD principal y permitiendo que la información asociada a un prompt se gestione de una forma más natural para el uso real del producto, sin introducir un rediseño visual amplio. Este trabajo busca elevar la eficacia del módulo central de la aplicación, que es la gestión de prompts, manteniendo la coherencia con el propósito general del sistema como biblioteca reutilizable y organizada de prompts de IA.

De forma más concreta, el objetivo es que el formulario principal de prompts permita gestionar mejor la información visible y asociada al prompt, que el usuario no pierda el contexto tras guardar o duplicar, y que el listado ofrezca una forma adicional de consulta sin romper la vista actual que ya existe.

## 3. Alcance

Esta iniciativa incluye el flujo principal de prompts, concretamente:

* el formulario de creación y edición de prompts;
* las tres áreas visibles del formulario, con foco principal en **Metadata** y **Basic Information**;
* la sección **Metadata** del formulario, incluyendo `tags`, `platform`, `category`, `Client/Project`, `Use Case`, `Model Hint` y `Language`;
* la sección **Basic Information** del formulario, incluyendo la incorporación de nuevos campos funcionales después de `Prompt Body`;
* el comportamiento de navegación posterior a guardar y duplicar;
* el listado de prompts en `/prompts`;
* la incorporación de un selector de visualización del listado con dos modos concretos: **cajas** y **lista (grid)**;
* la persistencia de la preferencia de visualización del listado para el usuario autenticado;
* la revisión del impacto de estos cambios sobre filtros y exportación, manteniendo el formato actual como base allí donde aplique.

Dentro de ese alcance, el trabajo contempla cambios funcionales sobre el CRUD de prompts para soportar mejor metadatos y clasificación del prompt, ajustes en la continuidad del flujo de edición y una segunda modalidad de visualización del listado. También incluye la incorporación de nuevos datos persistentes del prompt que deben quedar disponibles en el formulario y, cuando corresponda, en los flujos afectados por el propio cambio.

En la sección **Metadata**, esta iniciativa incluye:

* permitir alta de nuevos `tags` desde el formulario y su reutilización posterior;
* permitir selección múltiple en `platform` y `category`;
* hacer que `Client/Project`, `Use Case` y `Model Hint` pasen a comportarse como campos multivalor con el mismo patrón funcional que `tags`, incluyendo selección de valores existentes y creación de nuevos valores desde el propio formulario;
* convertir `Language` en un selector simple con opciones predefinidas.

En la sección **Basic Information**, esta iniciativa incluye añadir, después de `Prompt Body` y en este orden:

* `Pre-Prompt`;
* `Manual de uso`;
* `Fecha de creación` visible y no editable;
* `Fecha de actualización` visible y no editable.

En el comportamiento del formulario, esta iniciativa incluye que:

* al guardar desde alta, el usuario permanezca en el formulario;
* al guardar desde edición, el usuario permanezca en el registro en el que estaba trabajando;
* al duplicar, el usuario pase a editar el nuevo prompt duplicado en lugar de volver al listado.

## 4. Fuera de alcance

Quedan fuera de esta iniciativa:

* la creación de nuevas categorías desde el formulario del prompt;
* un rediseño visual amplio de la aplicación;
* mejoras generales no pedidas en accesibilidad, theming, dark mode, i18n o modernización global de componentes;
* cambios funcionales en los módulos de categorías, tags, autenticación o panel de administración, salvo el impacto imprescindible derivado del flujo de prompts;
* una preferencia de vista reutilizable en otras pantallas distintas del listado de prompts;
* una redefinición global del producto más allá del flujo principal de prompts;
* cambios que conviertan esta iniciativa en una refactorización transversal del sistema en lugar de una mejora focalizada sobre formulario, flujo de edición y visualización del listado.

También quedan fuera aquellas mejoras que no sean necesarias para materializar los cambios definidos en **Metadata**, **Basic Information**, continuidad del formulario y visualización del listado. El objetivo de esta iniciativa no es rediseñar la aplicación completa ni abrir un frente amplio de reorganización funcional, sino intervenir con precisión sobre el flujo principal del CRUD de prompts.

## 5. Impactos / condicionantes

La iniciativa impacta el núcleo funcional del producto: modelo de `Prompt`, relaciones con categorías y tags, flujo de formulario, listado, exportación y persistencia asociada al usuario autenticado para recordar la vista elegida. Hoy el sistema documenta `Prompt ? Category` como relación de muchos-a-uno y `platform` como campo simple, por lo que cualquier evolución en esos frentes toca necesariamente datos, respuestas visibles del sistema y comportamiento del formulario. Además, la mejora no afecta solo a `platform` y `category`, sino también a otros campos relevantes de **Metadata** cuyo comportamiento actual es demasiado simple para el uso esperado.

También hay condicionantes claros de arquitectura visible del producto: la app está montada sobre Next.js App Router, con `PromptForm`, `PromptList` y `PromptFilters` como componentes centrales del flujo; los filtros son URL-driven; y la UI está acoplada de forma bastante directa a la estructura de respuesta del backend. Eso condiciona el proyecto porque cambios en datos y contratos pueden tener efecto transversal en formulario, listado, filtros y navegación.

Desde el punto de vista funcional, el formulario de prompts ya tiene una organización reconocible en tres áreas —**Basic Information**, **Metadata** y **Advanced**— y la mejora debe apoyarse en esa estructura existente en lugar de reemplazarla. Esto condiciona el trabajo porque obliga a introducir los cambios sin romper la lógica visual y mental que el usuario ya conoce. El centro de la mejora no está en rehacer el formulario, sino en hacer que sus áreas principales cubran mejor la información y el flujo real de trabajo.

Existen además condicionantes operativos y de calidad: el proyecto despliega en Vercel Hobby, trabaja con Prisma sobre PostgreSQL en producción, y la cobertura automatizada actual es reducida. Dado que la iniciativa se quiere ejecutar por fases, con pruebas y despliegues parciales, esas condiciones influyen en cómo se puede validar y liberar cada subfase sin desalinear frontend, backend y datos.

Por último, la iniciativa tiene impacto funcional sobre otros puntos del producto aunque no sean el centro del cambio: los filtros del listado pueden necesitar alinearse con la nueva semántica de algunos campos, la exportación puede verse afectada por la nueva forma de representar cierta información del prompt, y la preferencia de visualización del listado introduce una nueva expectativa de continuidad para el usuario autenticado.

## 6. Riesgos

1. **Riesgo de desalineación entre UI, API y datos.**
   Cambiar la estructura y el comportamiento visible de `platform`, `category`, `tags`, `Client/Project`, `Use Case`, `Model Hint` y `Language` puede afectar simultáneamente formulario, listado, filtros, exportación y contratos de respuesta, porque la UI actual asume estructuras simples y acopladas al backend.

2. **Riesgo de ruptura por acoplamiento con respuestas actuales.**
   El análisis de UI identifica dependencias fuertes con la forma exacta de las respuestas de API y con supuestos muy concretos del formulario y del listado. Si los cambios funcionales no quedan bien recogidos en todos los puntos afectados, la experiencia puede quedar inconsistente.

3. **Riesgo de inconsistencia funcional durante despliegues parciales.**
   Como la iniciativa debe salir por subfases, puede haber estados intermedios donde formulario, listado, filtros o exportación no expresen todavía el mismo modelo funcional o la misma semántica de uso.

4. **Riesgo de degradación de experiencia en el flujo principal.**
   El módulo de prompts es el eje central del producto; si una subfase altera navegación, edición o visualización sin suficiente validación, el impacto para el usuario será inmediato y muy visible.

5. **Riesgo de inconsistencia entre campos que deberían seguir el mismo patrón de uso.**
   Si `tags`, `Client/Project`, `Use Case` y `Model Hint` no se comportan de forma suficientemente coherente dentro del formulario, el usuario puede percibir una experiencia fragmentada aunque todos los campos estén presentes.

6. **Riesgo de pérdida de foco de la iniciativa.**
   Al incorporar temas adicionales como preferencia de vista, exportación o posible impacto en filtros, existe el riesgo de que el proyecto deje de estar claramente centrado en lo que realmente motiva la mejora: la evolución de **Metadata**, la ampliación de **Basic Information**, la continuidad tras guardar o duplicar y la nueva visualización del listado.

7. **Riesgo de ampliar el alcance por efecto colateral.**
   La necesidad de categorías múltiples, de varios campos multivalor y de nuevas preferencias por usuario puede empujar cambios en más áreas de las inicialmente previstas si no se controlan bien los límites entre mejora funcional y rediseño estructural.

## 7. Decisiones abiertas

1. **Cómo se extenderá el formato actual de exportación/importación para los nuevos datos y estructuras multivalor.**
   Está decidido que no se inventará un formato arbitrario y que debe respetarse el actual, pero la representación exacta no está definida.

2. **Si los filtros de `/prompts` deben evolucionar también en esta iniciativa para reflejar la nueva semántica de los campos que pasan a tener varios valores o nuevas opciones seleccionables.**
   El cambio funcional afecta el modelo visible del prompt, pero todavía debe validarse hasta qué punto los filtros forman parte de la misma intervención o quedan como impacto asociado.

3. **Cómo deben mostrarse `Fecha de creación` y `Fecha de actualización` en modo alta antes del primer guardado.**
   Se ha definido que son visibles y no editables cuando el prompt ya existe, pero todavía debe quedar completamente cerrado el comportamiento exacto del modo alta.

4. **Hasta qué punto la preferencia de vista por usuario se trata solo como dato de interfaz o como parte estable del perfil.**
   Está claro que debe quedar asociada al usuario autenticado y aplicar solo al listado de prompts, pero no se ha concretado su alcance conceptual dentro del perfil de usuario.

5. **Qué nivel de explicitud debe tener el briefing respecto al patrón común de comportamiento entre `tags`, `Client/Project`, `Use Case` y `Model Hint`.**
   Está claro que estos campos deben alinearse funcionalmente, pero conviene dejar completamente cerrado si esa equivalencia debe quedar descrita de forma directa en el propio briefing para evitar interpretaciones distintas en documentos posteriores.
