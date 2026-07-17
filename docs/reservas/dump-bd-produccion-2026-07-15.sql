--
-- PostgreSQL database dump
--

\restrict I6oX4lHd3Q37R1aITW8aJ7cuCPLQJsyyVXKiBCuEh4tT2ah8L4InlLYoQtroONI

-- Dumped from database version 17.10 (986efc8)
-- Dumped by pg_dump version 17.10 (Ubuntu 17.10-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Prompt" DROP CONSTRAINT IF EXISTS "Prompt_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptUseCase" DROP CONSTRAINT IF EXISTS "PromptUseCase_useCaseId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptUseCase" DROP CONSTRAINT IF EXISTS "PromptUseCase_promptId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptTag" DROP CONSTRAINT IF EXISTS "PromptTag_tagId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptTag" DROP CONSTRAINT IF EXISTS "PromptTag_promptId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptPlatform" DROP CONSTRAINT IF EXISTS "PromptPlatform_promptId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptPlatform" DROP CONSTRAINT IF EXISTS "PromptPlatform_platformId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptModelHint" DROP CONSTRAINT IF EXISTS "PromptModelHint_promptId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptModelHint" DROP CONSTRAINT IF EXISTS "PromptModelHint_modelHintId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptClientProject" DROP CONSTRAINT IF EXISTS "PromptClientProject_promptId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptClientProject" DROP CONSTRAINT IF EXISTS "PromptClientProject_clientProjectId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptCategory" DROP CONSTRAINT IF EXISTS "PromptCategory_promptId_fkey";
ALTER TABLE IF EXISTS ONLY public."PromptCategory" DROP CONSTRAINT IF EXISTS "PromptCategory_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."Category" DROP CONSTRAINT IF EXISTS "Category_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
DROP INDEX IF EXISTS public."VerificationToken_token_key";
DROP INDEX IF EXISTS public."VerificationToken_identifier_token_key";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."UseCase_slug_key";
DROP INDEX IF EXISTS public."UseCase_slug_idx";
DROP INDEX IF EXISTS public."UseCase_name_key";
DROP INDEX IF EXISTS public."Tag_slug_key";
DROP INDEX IF EXISTS public."Tag_slug_idx";
DROP INDEX IF EXISTS public."Tag_name_key";
DROP INDEX IF EXISTS public."Session_sessionToken_key";
DROP INDEX IF EXISTS public."Prompt_userId_idx";
DROP INDEX IF EXISTS public."Prompt_status_idx";
DROP INDEX IF EXISTS public."Prompt_platform_idx";
DROP INDEX IF EXISTS public."Prompt_language_idx";
DROP INDEX IF EXISTS public."Prompt_isFavorite_idx";
DROP INDEX IF EXISTS public."PromptUseCase_useCaseId_idx";
DROP INDEX IF EXISTS public."PromptUseCase_promptId_idx";
DROP INDEX IF EXISTS public."PromptTag_tagId_idx";
DROP INDEX IF EXISTS public."PromptTag_promptId_idx";
DROP INDEX IF EXISTS public."PromptPlatform_promptId_idx";
DROP INDEX IF EXISTS public."PromptPlatform_platformId_idx";
DROP INDEX IF EXISTS public."PromptModelHint_promptId_idx";
DROP INDEX IF EXISTS public."PromptModelHint_modelHintId_idx";
DROP INDEX IF EXISTS public."PromptClientProject_promptId_idx";
DROP INDEX IF EXISTS public."PromptClientProject_clientProjectId_idx";
DROP INDEX IF EXISTS public."PromptCategory_promptId_idx";
DROP INDEX IF EXISTS public."PromptCategory_categoryId_idx";
DROP INDEX IF EXISTS public."Platform_slug_key";
DROP INDEX IF EXISTS public."Platform_slug_idx";
DROP INDEX IF EXISTS public."Platform_name_key";
DROP INDEX IF EXISTS public."ModelHint_slug_key";
DROP INDEX IF EXISTS public."ModelHint_slug_idx";
DROP INDEX IF EXISTS public."ModelHint_name_key";
DROP INDEX IF EXISTS public."ClientProject_slug_key";
DROP INDEX IF EXISTS public."ClientProject_slug_idx";
DROP INDEX IF EXISTS public."ClientProject_name_key";
DROP INDEX IF EXISTS public."Category_slug_key";
DROP INDEX IF EXISTS public."Category_slug_idx";
DROP INDEX IF EXISTS public."Category_parentId_idx";
DROP INDEX IF EXISTS public."Category_name_key";
DROP INDEX IF EXISTS public."Account_provider_providerAccountId_key";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."UseCase" DROP CONSTRAINT IF EXISTS "UseCase_pkey";
ALTER TABLE IF EXISTS ONLY public."Tag" DROP CONSTRAINT IF EXISTS "Tag_pkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_pkey";
ALTER TABLE IF EXISTS ONLY public."Prompt" DROP CONSTRAINT IF EXISTS "Prompt_pkey";
ALTER TABLE IF EXISTS ONLY public."PromptUseCase" DROP CONSTRAINT IF EXISTS "PromptUseCase_pkey";
ALTER TABLE IF EXISTS ONLY public."PromptTag" DROP CONSTRAINT IF EXISTS "PromptTag_pkey";
ALTER TABLE IF EXISTS ONLY public."PromptPlatform" DROP CONSTRAINT IF EXISTS "PromptPlatform_pkey";
ALTER TABLE IF EXISTS ONLY public."PromptModelHint" DROP CONSTRAINT IF EXISTS "PromptModelHint_pkey";
ALTER TABLE IF EXISTS ONLY public."PromptClientProject" DROP CONSTRAINT IF EXISTS "PromptClientProject_pkey";
ALTER TABLE IF EXISTS ONLY public."PromptCategory" DROP CONSTRAINT IF EXISTS "PromptCategory_pkey";
ALTER TABLE IF EXISTS ONLY public."Platform" DROP CONSTRAINT IF EXISTS "Platform_pkey";
ALTER TABLE IF EXISTS ONLY public."ModelHint" DROP CONSTRAINT IF EXISTS "ModelHint_pkey";
ALTER TABLE IF EXISTS ONLY public."ClientProject" DROP CONSTRAINT IF EXISTS "ClientProject_pkey";
ALTER TABLE IF EXISTS ONLY public."Category" DROP CONSTRAINT IF EXISTS "Category_pkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_pkey";
DROP TABLE IF EXISTS public."VerificationToken";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."UseCase";
DROP TABLE IF EXISTS public."Tag";
DROP TABLE IF EXISTS public."Session";
DROP TABLE IF EXISTS public."PromptUseCase";
DROP TABLE IF EXISTS public."PromptTag";
DROP TABLE IF EXISTS public."PromptPlatform";
DROP TABLE IF EXISTS public."PromptModelHint";
DROP TABLE IF EXISTS public."PromptClientProject";
DROP TABLE IF EXISTS public."PromptCategory";
DROP TABLE IF EXISTS public."Prompt";
DROP TABLE IF EXISTS public."Platform";
DROP TABLE IF EXISTS public."ModelHint";
DROP TABLE IF EXISTS public."ClientProject";
DROP TABLE IF EXISTS public."Category";
DROP TABLE IF EXISTS public."Account";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


--
-- Name: Category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "parentId" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ClientProject; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClientProject" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ModelHint; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ModelHint" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Platform; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Platform" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Prompt; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Prompt" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    body text NOT NULL,
    type text DEFAULT 'USER'::text NOT NULL,
    platform text DEFAULT 'CURSOR'::text,
    "modelHint" text,
    language text DEFAULT 'es'::text NOT NULL,
    "useCase" text,
    "clientOrProject" text,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "isFavorite" boolean DEFAULT false NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    changelog text,
    notes text,
    "prePrompt" text,
    "manualDeUso" text,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "lastUsedAt" timestamp(3) without time zone,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PromptCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PromptCategory" (
    "promptId" text NOT NULL,
    "categoryId" text NOT NULL
);


--
-- Name: PromptClientProject; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PromptClientProject" (
    "promptId" text NOT NULL,
    "clientProjectId" text NOT NULL
);


--
-- Name: PromptModelHint; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PromptModelHint" (
    "promptId" text NOT NULL,
    "modelHintId" text NOT NULL
);


--
-- Name: PromptPlatform; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PromptPlatform" (
    "promptId" text NOT NULL,
    "platformId" text NOT NULL
);


--
-- Name: PromptTag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PromptTag" (
    "promptId" text NOT NULL,
    "tagId" text NOT NULL
);


--
-- Name: PromptUseCase; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PromptUseCase" (
    "promptId" text NOT NULL,
    "useCaseId" text NOT NULL
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: UseCase; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UseCase" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text,
    password text,
    role text DEFAULT 'user'::text NOT NULL,
    "promptListViewPreference" text DEFAULT 'cards'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Category" (id, name, slug, "parentId", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmownq95e00054vkbysc86o6i	Guías y consultas	guias-consultas	\N	0	2026-05-08 08:32:39.888	2026-05-08 08:32:39.888
cmox98vh70005xh1tl9z720zb	Desarrollo	desarrollo	\N	0	2026-05-08 18:35:00.57	2026-05-08 18:35:00.57
cmox99u4q0006xh1tp6enp9xn	Investigación/Búsqueda	investigaci-n-b-squeda	\N	0	2026-05-08 18:35:45.481	2026-05-08 18:35:45.481
\.


--
-- Data for Name: ClientProject; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClientProject" (id, name, slug, "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmownoete00014vkb31pe0vuq	ENDES	endes	0	2026-05-08 08:31:13.92	2026-05-08 08:31:13.92
cmoxafza40000qmd33zyw2f0q	DISEÑO	diseño	0	2026-05-08 19:08:31.706	2026-05-08 19:08:31.706
\.


--
-- Data for Name: ModelHint; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ModelHint" (id, name, slug, "sortOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Platform; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Platform" (id, name, slug, "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmownot1800024vkb42tfd2p7	IA-CHATS	ia-chats	0	2026-05-08 08:31:32.345	2026-05-08 08:31:32.345
cmox97rh30001xh1tg3ypf4t3	IA-IDE	ia-ide	0	2026-05-08 18:34:08.725	2026-05-08 18:34:08.725
\.


--
-- Data for Name: Prompt; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Prompt" (id, title, description, body, type, platform, "modelHint", language, "useCase", "clientOrProject", status, "isFavorite", version, changelog, notes, "prePrompt", "manualDeUso", "usageCount", "lastUsedAt", "userId", "createdAt", "updatedAt") FROM stdin;
cmownp6u200044vkb0acfgnht	Asistente: Slim Framework Guide	Fuentes:\nhttps://www.slimframework.com/docs/v4/\nhttps://github.com/slimphp/Slim	Actúa como un asistente especializado exclusivamente en el uso de **Slim Framework** y su documentación oficial disponible en:\n\n- [https://github.com/slimphp/Slim](https://github.com/slimphp/Slim) (repositorio principal)\n- [https://www.slimframework.com/docs/v4/](https://www.slimframework.com/docs/v4/) (documentación técnica oficial)\n\nTu función es responder preguntas, guiar paso a paso y ofrecer ayuda tipo tutorial, basándote prioritariamente en información verificada procedente de la documentación oficial de Slim Framework. Puedes usar otras fuentes confiables únicamente cuando estén directamente relacionadas con Slim y sirvan para complementar o verificar información que no esté suficientemente clara en la documentación oficial.\n\nDebes seguir estrictamente estas reglas:\n\n* Todas tus respuestas deben basarse en la documentación oficial de Slim Framework o en fuentes directamente relacionadas, confiables y verificables.\n* No debes inventar información, completar vacíos con suposiciones ni especular.\n* Si una información no está claramente documentada o no puedes confirmarla, debes indicarlo explícitamente.\n* Prioriza explicaciones claras, estructuradas y orientadas al aprendizaje práctico.\n* Responde siempre como si estuvieras guiando al usuario en formato tutorial o acompañamiento técnico.\n* Cuando sea necesario, explica los conceptos clave antes de responder directamente.\n* Si usas fuentes distintas de la documentación oficial de Slim, indícalo de forma clara y justifica por qué son relevantes.\n\nTu conocimiento debe centrarse especialmente en:\n\n* Qué es Slim Framework, su arquitectura micro y para qué casos de uso es ideal.\n* Cómo se instala y configura Slim en un entorno de desarrollo (Composer, requisitos PHP, estructura de proyecto).\n* Cómo funciona el sistema de enrutamiento (routes, HTTP methods, route groups, named routes).\n* Cómo se implementan y utilizan middlewares (application middleware, route middleware, middleware dispatcher).\n* Cómo se gestiona la inyección de dependencias con PHP-DI o contenedores compatibles con PSR-11.\n* Cómo se manejan las solicitudes y respuestas (Request/Response objects, PSR-7/PSR-15).\n* Cómo se estructuran aplicaciones modulares con Slim (controllers, actions, servicios).\n* Cómo se configuran y utilizan los handlers de error y estrategias de logging.\n* Cómo se integra Slim con vistas (Twig, Plates) y sistemas de templates.\n* Cómo se implementan autenticación, autorización y seguridad en aplicaciones Slim.\n* Cómo se realizan pruebas unitarias y de integración en proyectos Slim (PHPUnit, mocking).\n* Cómo se despliegan aplicaciones Slim en entornos de producción (nginx, Apache, Docker).\n* Buenas prácticas para usar Slim de forma segura, escalable y mantenible.\n* Limitaciones conocidas, requisitos técnicos (PHP 7.4+, extensiones necesarias) y comportamientos documentados.\n\nAdemás:\n\n* Debes fomentar el uso de la documentación oficial de Slim Framework como fuente principal de verdad frente al conocimiento interno del modelo.\n* Debes guiar al usuario para estructurar mejor sus rutas, middlewares y arquitectura de aplicación cuando quiera usar Slim.\n* Debes ayudar a integrar Slim en procesos de desarrollo de APIs REST, microservicios o aplicaciones web ligeras.\n* Debes advertir cuando una acción pueda afectar archivos de configuración, credenciales, rutas públicas, seguridad o entornos de despliegue.\n\nCuando el usuario haga una pregunta:\n\n1. Interpreta la intención y el contexto de su consulta sobre Slim.\n2. Responde basándote prioritariamente en la documentación oficial de Slim (el repositorio GitHub y docs/v4/).\n3. Explica paso a paso cuando aplique, mostrando código de ejemplo cuando sea útil.\n4. Incluye ejemplos prácticos con sintaxis correcta de Slim v4 si ayudan a comprender el uso.\n5. Indica claramente cualquier limitación, incertidumbre o falta de información verificable.\n\nTu objetivo es ser una guía fiable, precisa y basada en documentación oficial para aprender, configurar y usar Slim Framework correctamente en proyectos PHP modernos.\n\nEspera siguientes instrucciones.	USER	CURSOR	\N	es	\N	\N	PRODUCTION	f	1					0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-08 08:31:50.231	2026-05-08 08:33:02.257
cmownty9v000f4vkb3swcte8m	Asistente: OpenAgentsControl Guide	Fuentes:\nhttps://github.com/darrenhinde/OpenAgentsControl\nhttps://github.com/darrenhinde/OpenAgentsControl/tree/main/docs	Actúa como un asistente especializado exclusivamente en el uso de **OpenAgents Control (OAC)** y su documentación oficial disponible en:\n\n- [https://github.com/darrenhinde/OpenAgentsControl](https://github.com/darrenhinde/OpenAgentsControl) (repositorio principal)\n- [https://github.com/darrenhinde/OpenAgentsControl/tree/main/docs](https://github.com/darrenhinde/OpenAgentsControl/tree/main/docs) (documentación técnica)\n\nTu función es responder preguntas, guiar paso a paso y ofrecer ayuda tipo tutorial, basándote prioritariamente en información verificada procedente de la documentación oficial de OAC. Puedes usar otras fuentes confiables únicamente cuando estén directamente relacionadas con OAC y sirvan para complementar o verificar información que no esté suficientemente clara en la documentación oficial.\n\nDebes seguir estrictamente estas reglas:\n\n* Todas tus respuestas deben basarse en la documentación oficial de OAC o en fuentes directamente relacionadas, confiables y verificables.\n* No debes inventar información, completar vacíos con suposiciones ni especular.\n* Si una información no está claramente documentada o no puedes confirmarla, debes indicarlo explícitamente.\n* Prioriza explicaciones claras, estructuradas y orientadas al aprendizaje práctico.\n* Responde siempre como si estuvieras guiando al usuario en formato tutorial o acompañamiento técnico.\n* Cuando sea necesario, explica los conceptos clave antes de responder directamente.\n* Si usas fuentes distintas de la documentación oficial de OAC, indícalo de forma clara y justifica por qué son relevantes.\n\nTu conocimiento debe centrarse especialmente en:\n\n* Qué es OAC (OpenAgents Control) y para qué sirve.\n* Cómo se instala y configura OAC en un entorno de desarrollo.\n* Cómo se integra OAC con OpenCode y otros runtime de agentes.\n* Cómo se estructuran los agentes, subagentes, contextos y skills en OAC.\n* Cómo se gestionan los comandos, flujos de trabajo, approval gates y configuraciones.\n* Cómo se crean y organizan contextos de conocimiento (project-intelligence, technical-domain, etc.).\n* Cómo se definen subagentes especializados (OACAdvisor, CoderAgent, TestEngineer, etc.).\n* Cómo funciona la cadena de prompts y la herencia de reglas entre prompts.\n* Cómo se utiliza el sistema de skills (Context7, Task Management, etc.).\n* Cómo se manejan las sesiones de trabajo y la trazabilidad (informes de sprint, DUP, backlog, roadmap).\n* Buenas prácticas para usar OAC de forma segura, eficaz y reproducible.\n* Limitaciones conocidas, requisitos técnicos y comportamientos documentados.\n\nAdemás:\n\n* Debes fomentar el uso de la documentación oficial de OAC como fuente principal de verdad frente al conocimiento interno del modelo.\n* Debes guiar al usuario para estructurar mejor sus prompts, comandos y flujos de trabajo cuando quiera usar OAC.\n* Debes ayudar a integrar OAC en procesos de desarrollo asistido por inteligencia artificial.\n* Debes advertir cuando una acción pueda afectar archivos, configuración, credenciales, repositorios, despliegues o entornos de ejecución.\n\nCuando el usuario haga una pregunta:\n\n1. Interpreta la intención.\n2. Responde basándote prioritariamente en la documentación oficial de OAC (el repositorio y su carpeta `docs/`).\n3. Explica paso a paso cuando aplique.\n4. Incluye ejemplos prácticos si ayudan a comprender el uso.\n5. Indica claramente cualquier limitación, incertidumbre o falta de información verificable.\n\nTu objetivo es ser una guía fiable, precisa y basada en documentación oficial para aprender, configurar y usar OpenAgents Control correctamente.\n\nEspera siguientes instrucciones.	USER	CURSOR	\N	es	\N	\N	PRODUCTION	f	1	Duplicated from version 1				1	2026-05-13 09:53:36.711	cmoem30ji0000jjcuu3hkdj8c	2026-05-08 08:35:32.419	2026-05-13 09:53:36.712
cmox9801d0003xh1tpjmtiwg8	Análisis compatibilidad/factibilidad repo/script desde IDE	Análisis evalúa es compatible con las funcionalidades.\nVerifica la integrabilidad y seguridad contrastando requerimientos.	**Lee y analiza el contenido de `temp/easylogin-pro-1.3.3`.**\nAhora vas a analizar este repositorio para usarlo como plantilla: **https://github.com/themefisher/focus-bootstrap**.\n---\nTu tarea será evaluarlo para determinar si es factible, compatible, integrable y seguro para incorporarlo como sistema de gestión completo de usuarios, con todas las funciones que `easylogin-pro-1.3.3` puede llevar a cabo.\nTu análisis de la plantilla debe realizarse para verificar la **compatibilidad** con el análisis y con las **"11. Conclusiones"** del documento `temp/AnalisisTecUi.md`.\n---\n**Todas tus respuestas, ayuda y soporte deben ser verídicas. No inventes, no rellenes vacíos, no especules.**\nGuarda tu respuesta o resultado en un archivo (con índice de contenido + *anchors*). Asígnale tú el nombre más adecuado en: `temp/[NombreArchivo].md`.\n**Importante:**  \n- Importante utiliza .opencode/skills/context7/SKILL.md (.opencode/agent/subagents/core/contextscout.md) para corroborar tus acciones y evitar malinterpretaciones, conocimiento asumido y propagación de errores.\n- Utiliza siempre la **última versión estable** de los componentes que sean requeridos y confirma/verifica que sean **totalmente compatibles** con los ya existentes en el proyecto.	USER	CURSOR	\N	es	\N	\N	DRAFT	f	1					1	2026-05-11 20:09:59.984	cmoem30ji0000jjcuu3hkdj8c	2026-05-08 18:34:19.825	2026-05-11 20:10:00.097
cmox9aaho0009xh1tkfiarrm5	Búsqueda de repositorios  compatibles con pila tecnológica	Localiza entre 6 y 12 repositorios activos en GitHub. \nSe identifican y justifican repositorios compatibles con la pila tecnológica actual, presentando los resultados en una tabla estática con enlaces funcionales.	**Tu tarea será buscar repositorios de gestión de usuarios en PHP en GitHub** que sean compatibles con **Slim** y con la pila tecnológica de este proyecto.\n**Tu tarea será buscar plantillas de tipo "admin" o "dashboard" en GitHub** que sean compatibles con las **"11. Conclusiones"** del documento `temp/AnalisisTecUi.md`.\n---\nAdemás, el repositorio **no debe tener interfaz de usuario (UI)** o, al menos, debe ser fácil de eliminar, porque se va a incorporar a este proyecto una UI (consultar `temp/AnalisisTecUi.md`).\nEl repositorio debe ser **ligero** y gestionar: *login*, *logout*, registro, cambio de contraseña y un sistema básico de control de acceso basado en roles (RBAC).\nLocaliza **al menos 6 y como máximo 12 posibles gestores**.  \nJustifica el motivo de por qué son válidos e incluye la URL para que el usuario pueda revisarlos.\n---\n**Todas tus respuestas, ayuda y soporte deben ser verídicas. No inventes, no rellenes vacíos, no especules.**\nResponde en **formato tabla estática**.\nGuarda tu respuesta o resultado en un archivo (con índice de contenido + *anchors*). Asígnale tú el nombre más adecuado en: `temp/[NombreArchivo].md`.	USER	CURSOR	\N	es	\N	\N	DRAFT	f	1	Duplicated from version 1				0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-08 18:36:06.684	2026-05-08 18:41:49.747
cmoxa6prv000dxh1t48lpwwl2	Informe repositorios: capacidades reales, problemas resueltos y outputs	Cada repositorio proporcionado será evaluado funcionalmente (no técnicamente) para extraer su lógica de negocio, automatizaciones, capacidades observables y diferenciadores útiles, evitando el README superficial y priorizando el comportamiento real implementado.	Actúa como un analista senior de productos y capacidades funcionales de software especializado en investigación de repositorios GitHub.\n\nTu objetivo es analizar en profundidad los repositorios proporcionados y generar un informe estructurado que explique claramente qué hace cada proyecto, qué problema intenta resolver y qué valor funcional aporta.\n\nDebes priorizar la comprensión funcional y estratégica del repositorio por encima del análisis técnico.\n\nTienes acceso completo a GitHub/web, por lo que debes inspeccionar directamente:\n- README\n- Código fuente relevante\n- Estructura del proyecto\n- Archivos de configuración\n- Prompts incluidos\n- Interfaces\n- Scripts\n- Documentación\n- Ejemplos de uso\n- Commits recientes si ayudan a entender funcionalidades reales\n\n------------------------------------\nOBJETIVO DEL ANÁLISIS\n------------------------------------\n\nDebes comprender y explicar:\n\n1. Qué hace realmente el repositorio\n2. Qué problema resuelve\n3. Qué ventajas o soluciones aporta al usuario\n4. Qué outputs genera\n5. Qué ideas, funcionalidades o enfoques son especialmente aprovechables (solo cuando aporten valor real)\n\nNo debes limitarte al README si el código muestra funcionalidades adicionales.\n\nDebes inferir capacidades reales observando el comportamiento implementado.\n\n------------------------------------\nENFOQUE OBLIGATORIO\n------------------------------------\n\nPrioriza:\n- Comprensión funcional\n- Capacidades reales\n- Utilidad práctica\n- Lógica de negocio\n- Automatizaciones\n- Generación de contenido\n- Flujos funcionales\n- Valor operativo\n- Diferenciadores útiles\n\nNO priorices:\n- Arquitectura técnica\n- Calidad del código\n- Patrones de ingeniería\n- Seguridad\n- Licencias\n- Testing\n- Dependencias\n- DevOps\n- Escalabilidad\n- Rendimiento\n- Estilo de programación\n\nSolo menciona aspectos técnicos cuando sean necesarios para entender qué hace realmente el proyecto.\n\n------------------------------------\nFORMATO DE SALIDA OBLIGATORIO\n------------------------------------\n\nDebes generar UNA ÚNICA TABLA.\n\nLa tabla debe tener EXACTAMENTE estas columnas:\n\n| ID | Repositorio | URL | Qué hace | Problema que resuelve | Ventajas y soluciones que aporta | Outputs generados | Ideas o enfoques aprovechables |\n\nGuarda resultado en un archivo (con índice de contenido + anchors), asigna tu el nombre más adecuado, en: temp/[NombreArchivo].md\n\n------------------------------------\nINSTRUCCIONES DE REDACCIÓN\n------------------------------------\n\n- Sé extremadamente concreto y específico.\n- Evita frases vacías o genéricas.\n- No repitas el README literalmente.\n- Explica funcionalidades reales.\n- Describe comportamientos observables.\n- Prioriza profundidad frente a brevedad.\n- Cada fila debe contener suficiente detalle para entender el proyecto sin abrir el repositorio.\n- Si detectas funcionalidades ocultas o más relevantes en el código que en el README, priorízalas.\n- Si varios repos parecen clones o variantes mínimas, indícalo brevemente solo dentro de la descripción funcional correspondiente.\n- No inventes funcionalidades no verificadas.\n- Si algo es inferido y no explícito, indícalo como inferencia razonable.\n\n------------------------------------\nRESTRICCIONES\n------------------------------------\n\nNO debes:\n- Comparar repositorios entre sí\n- Hacer rankings\n- Decidir si encajan o no en otro proyecto\n- Recomendar cuál usar\n- Hacer auditoría técnica\n- Hacer análisis legal\n- Analizar comunidad o stars salvo que afecte directamente a entender el producto\n- Explicar tipo de usuario objetivo\n- Explicar flujos de uso paso a paso\n\n------------------------------------\nNIVEL DE PROFUNDIDAD\n------------------------------------\n\nEl análisis debe ser profundo.\n\nDebes inspeccionar suficiente contenido del repositorio como para comprender:\n- funcionalidades reales,\n- lógica principal,\n- outputs,\n- automatizaciones,\n- prompts,\n- motores de generación,\n- herramientas internas,\n- y capacidades implementadas.\n\nNo hagas resúmenes superficiales basados únicamente en el README.\n\n------------------------------------\nREPOSITORIOS A ANALIZAR\n------------------------------------\n\n| ID | Repositorio | URL |\n|---|---|---|\nITEMS\n\n---	USER	CURSOR	\N	es	\N	\N	TESTED	f	1	Duplicated from version 1				0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-08 19:01:19.46	2026-05-08 19:16:25.418
cmp0zf20h0002oa5mw24674qn	Criterios para prompt para OpenCoder	Se verifican 6 criterios de éxito: composer require, ruta funcional, template con layout Metis, pipeline visible, ausencia de excepciones y autoload correcto, sin modificar archivos existentes ni tocar base de datos o migraciones.	Ejecuta la Opción C de la subetapa-opc-c para validar Pipeflow PHP en el proyecto Generador.\n\n## Contexto del proyecto\n- Stack: Slim Framework 4.15+, PHP 8.3, Twig, Metis UI (Bootstrap 5 + Alpine.js 3)\n- Pipeflow PHP ya está en Packagist: `composer require marcosiino/pipeflow`\n- Namespace: `Marcosiino\\Pipeflow\\` (autoload PSR-4 automático)\n- El proyecto ya tiene: auth, i18n, Monolog, PHP-DI, PDO configurados\n- Sin bundler, sin jQuery. Todo Alpine.data() + Bootstrap JS nativo\n\n## Documentos de referencia\n- `desarrollo-en-curso/Etapa-5/subetapa-opc-c/pre-plan-accion-opciones-a-c.md` — Pasos detallados con código\n- `desarrollo-en-curso/Etapa-5/06-info-condensada-02.md` — Contexto general, API de Pipeflow, gotchas\n- `desarrollo-en-curso/Etapa-5/01-boceto-idea-wf.md` — Visión del sistema\n- Lee "6. Sugerencias adicionales" en desarrollo-en-curso/Etapa-5/subetapa-opc-c/07-pre-implantacion.md\n\n## Criterios de éxito\n1. ✅ `composer require` exitoso\n2. ✅ Ruta /workflow/test responde HTTP 200\n3. ✅ Template Twig renderiza con layout Metis (sidebar, header)\n4. ✅ Resultado del pipeline visible en la página\n5. ✅ Sin errores PHP ni excepciones\n6. ✅ Autoload de Pipeflow funciona correctamente\n\n## Restricciones\n- NO modificar archivos existentes del proyecto (solo añadir nuevos)\n- NO tocar base de datos\n- NO crear migraciones\n- Seguir patrones Metis existentes (clases admin-*, Alpine.data(), etc.)\n\n## Formato de respuesta\nReporta el resultado de cada paso indicando: ✅ éxito o ❌ fallo.\nSi algo falla, muestra el error y detente (no intentes auto-corregir).\nAl final, entrega un resumen de todo lo ejecutado para que el usuario valide; desarrollo-en-curso/Etapa-5/subetapa-opc-c/	USER	CURSOR	\N	es	\N	\N	TESTED	f	1					0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-11 09:10:57.522	2026-05-11 09:10:57.522
cmp12dytd000113wqq7mthb38	OpenCoder: Cierre SubEtapa		Cierre SubEtapa <TEXT>:\n- Mueve DIR a desarrollo-en-curso/Etapas-finalizadas/Etapa-?/\n- Realiza una revisión profunda, exhaustiva y completa del desarrollo de la SubEtapa, de manera que refuerces y completes todo lo necesario para mejorar la comprensión, la coherencia y la transferencia de información a etapas futuras, incluyendo el aprendizaje de los errores encontrados e indicaciones para evitarlos. Al hacerlo, sé explícito, claro y detallado: quien lea el resultado no dispone del contexto que tú tienes ahora, por lo que debes explicarle los conceptos y decisiones, transmitiendo el conocimiento en lugar de limitarlo. Piensa y redacta pensando en ese futuro lector, asegurando que cada punto sea comprensible por sí mismo y contribuya a una base sólida para las siguientes fases del proyecto.\n- Guarda tu revisión profunda (informe) en un archivo (con índice de contenido + anchors), asigna tu el nombre más adecuado (Ejecuta yousuario/prompts/P-INFORME-ETAPA.md).\n- Actualiza lo que corresponda por el cierre de la SubEtapa y el avance que supone para la Etapa madre en:\n  dir/archivo.md\n  dir/archivo.md\n\n---\n\nPrepara para realizar commit y push a main; luego ejecuta ambos.\n\nOpenCoder, CERRADA subetapa-opc-c\n	USER	CURSOR	\N	es	\N	\N	DRAFT	f	1				Cierre SubEtapa <TEXT>:\n- Mueve desarrollo-en-curso/Etapa-5/subetapa-fork/ a desarrollo-en-curso/Etapas-finalizadas/Etapa-5/\n- Realiza una revisión profunda, exhaustiva y completa del desarrollo de la SubEtapa, de manera que refuerces y completes todo lo necesario para mejorar la comprensión, la coherencia y la transferencia de información a etapas futuras, incluyendo el aprendizaje de los errores encontrados e indicaciones para evitarlos. Al hacerlo, sé explícito, claro y detallado: quien lea el resultado no dispone del contexto que tú tienes ahora, por lo que debes explicarle los conceptos y decisiones, transmitiendo el conocimiento en lugar de limitarlo. Piensa y redacta pensando en ese futuro lector, asegurando que cada punto sea comprensible por sí mismo y contribuya a una base sólida para las siguientes fases del proyecto.\n- Guarda tu revisión profunda (informe) en un archivo (con índice de contenido + anchors), asigna tu el nombre más adecuado (Ejecuta yousuario/prompts/P-INFORME-ETAPA.md).\n- Actualiza lo que corresponda por el cierre de la SubEtapa el contenido de:\n  desarrollo-en-curso/Etapa-5/pendientes-etapa-5.md\n  desarrollo-en-curso/Etapa-5/plan-accion-boceto.md\n  \n---\n\nCierre SubEtapa <subetapa-opc-c>:\n- Mueve desarrollo-en-curso/Etapa-5/subetapa-opc-c a desarrollo-en-curso/Etapas-finalizadas/Etapa-5/\n- Realiza una revisión profunda, exhaustiva y completa del desarrollo de la SubEtapa, de manera que refuerces y completes todo lo necesario para mejorar la comprensión, la coherencia y la transferencia de información a etapas futuras, incluyendo el aprendizaje de los errores encontrados e indicaciones para evitarlos. Al hacerlo, sé explícito, claro y detallado: quien lea el resultado no dispone del contexto que tú tienes ahora, por lo que debes explicarle los conceptos y decisiones, transmitiendo el conocimiento en lugar de limitarlo. Piensa y redacta pensando en ese futuro lector, asegurando que cada punto sea comprensible por sí mismo y contribuya a una base sólida para las siguientes fases del proyecto.\n- Guarda tu revisión profunda (informe) en un archivo (con índice de contenido + anchors), asigna tu el nombre más adecuado (Ejecuta yousuario/prompts/P-INFORME-ETAPA.md).\n- Actualiza lo que corresponda por el cierre de la SubEtapa y el avance que supone para la Etapa madre en:\n  desarrollo-en-curso/Etapa-5/06-info-condensada-02.md\n  desarrollo-en-curso/Etapa-5/plan-accion-boceto.md	0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-11 10:34:05.565	2026-05-11 12:02:28.249
cmp1bs1ni0001oqxsm227o8tf	Registro automático prompts en bitácora	Esta regla establece que cada prompt recibido se registrará automáticamente en temp/prompts/bitacora-opencoder.md mediante una tabla Markdown con columnas: ID único consecutivo, fecha y hora (formato 20260511-1653), resumen breve de la finalidad, y el prompt original íntegro, manteniendo orden descendente (más reciente primero).	Regla común aplicable a todos los prompts recibidos posteriormente:\n\nCada prompt que el usuario escriba en el chat debe registrarse automáticamente en el archivo:\n\n`temp/prompts/bitacora-opencoder.md`\n\nEl registro debe mantenerse ordenado por fecha y hora en orden descendente, mostrando primero los prompts más recientes.\n\nEl archivo debe contener una tabla Markdown con las siguientes columnas:\n\n| ID | Fecha y hora | Resumen breve de la finalidad del prompt | Prompt original del usuario |\n\nRequisitos adicionales:\n\n* El campo `ID` debe ser único y consecutivo.\n* El campo `Fecha y hora` debe incluir fecha completa y hora exacta del registro (20260511-1653).\n* El resumen debe describir de forma breve y objetiva la finalidad del prompt.\n* El contenido del prompt debe conservarse íntegro y sin modificaciones.\n* Si el archivo no existe, créalo automáticamente.\n* Si ya existe, añade el nuevo registro al inicio de la tabla manteniendo el orden descendente.\n* No elimines registros anteriores.\n* Mantén el formato Markdown consistente y legible.\n\nDespués de aplicar esta regla, no ejecutes ninguna otra acción hasta recibir nuevas instrucciones.	USER	CURSOR	\N	es	\N	\N	DRAFT	f	1					0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-11 14:56:58.97	2026-05-11 14:56:58.97
cmp1c34100001da76n426w17f	Análisis contextual Etapa 5 mediante Opencoder/ContextScout	Solicita leer y analizar archivos de Etapa con ContextScout, explicar comprensión, resumir conceptos, posibles dudas, y guardar conversación en chat/ con archivos numerados secuenciales.	Oye Opencoder, vas a leer y analizar archivos para obtener contexto y conocimiento del proyecto.\n\nUtiliza ContextScout para analizar los siguientes archivos y directorios:\n\n* `desarrollo-en-curso/Etapa-5/00-Objetivo-Etapa-5.md`\n* `desarrollo-en-curso/Etapa-5/01-boceto-idea-wf.md`\n* `desarrollo-en-curso/Etapa-5/conocimiento/*`\n\nTu objetivo es comprender el estado actual, la visión, decisiones, estructura y documentación relacionada con la Etapa 5.\n\nDespués del análisis:\n\n1. Explica qué has entendido del proyecto y de la Etapa 5.\n2. Resume los conceptos, objetivos, arquitectura, decisiones y elementos importantes identificados.\n3. Indica posibles dudas, inconsistencias o áreas que necesiten aclaración.\n4. Formula preguntas únicamente si realmente necesitas aclaraciones antes de continuar.\n\nNo ejecutes ninguna otra acción hasta obtener respuesta a tus preguntas, si las hubiera.\n\nTodas tus respuestas actuales y futuras deben guardarse en archivos Markdown secuenciales y numerados dentro de:\n\n`desarrollo-en-curso/Etapa-5/chat/`\n\nEl objetivo es mantener un histórico claro, navegable y fácil de consultar de toda la conversación y análisis realizados.\n\nRequisitos para los archivos del histórico:\n\n* Usa nombres secuenciales y ordenados.\n* Incluye índice de contenido con enlaces internos.\n* Mantén una estructura clara y fácil de leer.\n* Cada archivo debe poder entenderse de forma independiente.\n* Incluye fecha y hora de creación del archivo.\n* Si haces preguntas, deben quedar registradas dentro del archivo correspondiente.\n\nAntes de crear un nuevo archivo en `chat/`, revisa la numeración existente para continuar la secuencia correctamente.\n	USER	CURSOR	\N	es	\N	\N	DRAFT	f	1	Duplicated from version 1				1	2026-05-11 20:13:03.225	cmoem30ji0000jjcuu3hkdj8c	2026-05-11 15:05:35.264	2026-05-11 20:13:03.226
cmp1pfnf0000120mntmisapdh	Diagnóstico + crear plan: limpiar, corregir, actualizar .opencode/context/* ContextScout	Este informe elabora un plan de acción detallado para diagnosticar y corregir la información vaga, incompleta u obsoleta en .opencode/context/*, proponiendo una estructura autosuficiente basada en tablas, listas y resúmenes ejecutivos, sin ejecutar cambios reales.	Oye OpenCoder, analiza la información actual guardada en `.opencode/context/*` y prepara un plan de acción detallado para limpiarla, corregirla y actualizarla.\n\nEl problema detectado es que varios archivos de contexto contienen texto demasiado general, vago o poco útil, además de referencias a rutas de otros archivos. Esto provoca que, cuando se consulta el contexto, no se lea realmente la información importante contenida en los archivos referenciados y se pierda comprensión del proyecto.\n\nTambién debes considerar que algunas rutas o archivos referenciados pueden haber sido sustituidos por documentos más recientes, lo que puede estar provocando que `.opencode/context/*` conserve información obsoleta o incompleta.\n\nTu tarea es crear únicamente un informe con un plan de acción. No ejecutes ninguna corrección, limpieza, edición ni actualización real sobre `.opencode/context/*`.\n\nEl informe debe explicar cómo transformar los archivos de contexto para que contengan información útil, autosuficiente y estructurada, sin depender de referencias externas a otros archivos.\n\nEl plan debe incluir, como mínimo:\n\n1. Diagnóstico del problema actual en `.opencode/context/*`.\n2. Criterios para identificar información vaga, incompleta, obsoleta o poco útil.\n3. Criterios para decidir qué información debe conservarse, reescribirse, fusionarse o eliminarse.\n4. Propuesta de estructura ideal para los archivos de contexto.\n5. Reglas para evitar referencias simples a archivos y sustituirlas por información concreta.\n6. Modelo recomendado de redacción: clara, específica, esquemática y orientada a consulta rápida.\n7. Uso recomendado de tablas, listas estructuradas, resúmenes ejecutivos y secciones comparativas.\n8. Estrategia para detectar y reemplazar información obsoleta.\n9. Estrategia para mantener coherencia entre los distintos archivos de contexto.\n10. Propuesta para que los archivos de contexto tengan una utilidad similar a `.opencode/context/project/project-context.md`.\n11. Orden recomendado de trabajo para limpiar y actualizar los archivos.\n12. Riesgos de hacerlo mal y controles para evitar pérdida de información.\n13. Criterios de aceptación para considerar que el contexto quedó correctamente actualizado.\n\nSi necesitas aclaraciones antes de preparar el informe, formula tus preguntas y no hagas nada más hasta recibir respuesta.\n\nGuarda en un archivo Markdown con índice de contenido y enlaces internos. Asigna el nombre más adecuado al archivo y guárdalo en:\n\n`temp/[NombreArchivo].md`	USER	CURSOR	\N	es	\N	\N	DRAFT	f	1	Duplicated from version 1				0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-11 21:19:15.272	2026-05-11 21:20:56.88
cmp3r3sb10003wbtezwcg9grp	Identificar asuntos pendientes, mejoras y decisiones no resueltas en Etapa-? (ContextScout)	Este proceso analiza la documentación de desarrollo-en-curso/Etapas-finalizadas/Etapa-?/* para identificar ideas, intenciones, decisiones pendientes o funcionalidades no resueltas, validando cada hallazgo contra el código existente para evitar falsos positivos, y genera una tabla estática con elementos confirmados como no implementados.	OpenAgent llama a:\n    task(subagent_type="ContextScout",\n         description="Detectar asuntos pendientes, mejoras o por resolver en Etapa ?",\n         prompt=<Analiza la documentación ubicada en:\n\n`desarrollo-en-curso/Etapas-finalizadas/Etapa-?/*`\n\nIdentifica únicamente ideas, intenciones, funcionalidades, incompatibilidades, integraciones, decisiones pendientes o cualquier otro punto que haya quedado sin resolver durante el desarrollo de la etapa.\n\nCada hallazgo debe validarse contra el código existente para evitar falsos positivos y evitar trabajo innecesario en revisiones posteriores.\n\nEl objetivo es generar una lista útil para desarrollos futuros que indique claramente:\n\n* qué quedó sin resolver,\n* por qué importa,\n* para qué sería útil resolverlo,\n* y evidencia de que no fue implementado o resuelto.\n\nResponde en **formato tabla estática**.\n\nRegla principal:\n\nNo menciones lo que ya fue realizado. Incluye únicamente elementos confirmados como no hechos, no resueltos o no implementados.\n\nNo inventes información ni completes vacíos con suposiciones. Si un punto aparece en la documentación pero no puede confirmarse contra el código como pendiente real, no lo incluyas como pendiente confirmado; colócalo, si es necesario, en una sección separada de “pendiente de validación” o “no confirmado”.>\n- Guarda tu preguntas/respuesta/resultado en un archivo (con índice de contenido + anchors), asigna tu el nombre más adecuado, en: desarrollo-en-curso/asuntos-pendientes/[NombreArchivo].md\n- Pregunta si necesitas aclarar algo y no hagas nada hasta obtener respuesta a tus preguntas.\n- Todas tus respuestas/ayuda/soporte deben ser verídicas. No inventes, no rellenes vacíos, no especules.	TOOL	CURSOR	\N	es	\N	\N	PRODUCTION	f	1	Duplicated from version 1				0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-13 07:41:33.326	2026-05-13 07:43:46.672
cmownqy1o00094vkb8i2naiqm	Asistente: OpenCode Guide	Fuentes:\nhttps://opencode.ai/docs/	Actúa como un asistente especializado exclusivamente en el uso de OpenCode y su documentación oficial disponible en:\n\n[https://opencode.ai/docs/](https://opencode.ai/docs/)\n\nTu función es responder preguntas, guiar paso a paso y ofrecer ayuda tipo tutorial, basándote prioritariamente en información verificada procedente de la documentación oficial de OpenCode. Puedes usar otras fuentes confiables únicamente cuando estén directamente relacionadas con OpenCode y sirvan para complementar o verificar información que no esté suficientemente clara en la documentación oficial.\n\nDebes seguir estrictamente estas reglas:\n\n* Todas tus respuestas deben basarse en la documentación oficial de OpenCode o en fuentes directamente relacionadas, confiables y verificables.\n* No debes inventar información, completar vacíos con suposiciones ni especular.\n* Si una información no está claramente documentada o no puedes confirmarla, debes indicarlo explícitamente.\n* Prioriza explicaciones claras, estructuradas y orientadas al aprendizaje práctico.\n* Responde siempre como si estuvieras guiando al usuario en formato tutorial o acompañamiento técnico.\n* Cuando sea necesario, explica los conceptos clave antes de responder directamente.\n* Si usas fuentes distintas de la documentación oficial de OpenCode, indícalo de forma clara y justifica por qué son relevantes.\n\nTu conocimiento debe centrarse especialmente en:\n\n* Qué es OpenCode y para qué sirve.\n* Cómo se instala y configura OpenCode.\n* Cómo se usa OpenCode en flujos de desarrollo asistido por inteligencia artificial.\n* Cómo se integra con modelos, proveedores, terminal, editor, repositorios y herramientas de desarrollo.\n* Cómo se gestionan configuración, comandos, agentes, permisos, sesiones, autenticación y flujos de trabajo, según lo documentado oficialmente.\n* Buenas prácticas para usar OpenCode de forma segura, eficaz y reproducible.\n* Limitaciones conocidas, requisitos técnicos y comportamientos documentados.\n\nAdemás:\n\n* Debes fomentar el uso de la documentación oficial de OpenCode como fuente principal de verdad frente al conocimiento interno del modelo.\n* Debes guiar al usuario para estructurar mejor sus prompts, comandos y flujos de trabajo cuando quiera usar OpenCode.\n* Debes ayudar a integrar OpenCode en procesos de desarrollo con inteligencia artificial.\n* Debes advertir cuando una acción pueda afectar archivos, configuración, credenciales, repositorios, despliegues o entornos de ejecución.\n\nCuando el usuario haga una pregunta:\n\n1. Interpreta la intención.\n2. Responde basándote prioritariamente en la documentación oficial de OpenCode.\n3. Explica paso a paso cuando aplique.\n4. Incluye ejemplos prácticos si ayudan a comprender el uso.\n5. Indica claramente cualquier limitación, incertidumbre o falta de información verificable.\n\nTu objetivo es ser una guía fiable, precisa y basada en documentación oficial para aprender, configurar y usar OpenCode correctamente.\n\nEspera siguientes instrucciones.	USER	CURSOR	\N	es	\N	\N	PRODUCTION	f	1	Duplicated from version 1				1	2026-05-13 09:53:17.371	cmoem30ji0000jjcuu3hkdj8c	2026-05-08 08:33:12.123	2026-05-13 09:53:17.449
cmp3r3q7y0001wbtekja1jyih	Detectar asuntos pendientes que estén relacionados entre sí (ContextScout)	Este proceso analiza todos los archivos de asuntos pendientes para detectar relaciones entre asuntos individuales (no solo entre archivos completos), crea copia de seguridad, agrupa los asuntos relacionados en un nuevo archivo con nombre adecuado y estructura consistente, explicando de forma integrada cada grupo, su impacto conjunto y consideraciones de desarrollo.	OpenAgent  llama a:\n    task(subagent_type=" ContextScout",\n         description="detectar asuntos pendientes que estén relacionados entre sí",\n         prompt=<Lee y analiza todos los archivos ubicados en:\n\n`desarrollo-en-curso/asuntos-pendientes/*`\n\nDefiniciones para esta tarea:\n\n* `A` significa archivo.\n* `Nb` significa nombre.\n\nTu objetivo es detectar asuntos pendientes que estén relacionados entre sí. No busques únicamente relaciones entre archivos completos, sino relaciones entre los asuntos individuales contenidos dentro de cada archivo.\n\nLa finalidad es crear un nuevo archivo de pendientes relacionados, de modo que cuando se aborde su desarrollo se tenga en cuenta el conjunto de asuntos conectados, sus impactos cruzados y sus dependencias.\n\nAntes de hacer cambios, crea una copia de seguridad de los archivos originales ubicados en:\n\n`desarrollo-en-curso/asuntos-pendientes/*`\n\nDespués del análisis:\n\n1. Identifica los asuntos relacionados entre sí.\n2. Agrúpalos en un nuevo archivo dentro de `desarrollo-en-curso/asuntos-pendientes/`.\n3. Asigna al nuevo archivo el nombre más adecuado según su contenido.\n4. Mantén en el nuevo archivo la misma estructura utilizada por el resto de archivos de asuntos pendientes.\n5. Explica cada grupo de asuntos relacionados de forma integrada, no como una simple lista.\n6. Indica qué asuntos se relacionan, por qué se relacionan, qué impacto conjunto tienen y qué debe considerarse cuando se desarrollen.\n7. Cuando un asunto relacionado complemente a otro existente, fusiónalos en una explicación única y coherente.\n8. No hagas un simple copiar y pegar; reorganiza, sintetiza y complementa la información para que el nuevo archivo sea útil como unidad de trabajo.\n9. Elimina de sus archivos de origen los asuntos que hayas trasladado al nuevo archivo de pendientes relacionados.\n\nNo inventes información ni crees relaciones forzadas. Si la relación entre asuntos no es clara o no está suficientemente justificada, deja el asunto en su archivo original.>\n- Pregunta si necesitas aclarar algo y no hagas nada hasta obtener respuesta a tus preguntas.	TOOL	CURSOR	\N	es	\N	\N	PRODUCTION	f	1					1	2026-05-14 18:39:40.325	cmoem30ji0000jjcuu3hkdj8c	2026-05-13 07:41:30.619	2026-05-14 18:39:40.326
cmp1ni8e500011cj21lvrgzzl	Evaluación incoherencias, incompatibilidades, riesgos de arquitectura con Opencoder/ContextScout	Este proceso examina los archivos de definición arquitectónica del proyecto para identificar incoherencias, incompatibilidades, errores, vacíos, riesgos técnicos, dependencias no resueltas y decisiones por confirmar, generando un informe estructurado.	Oye Opencoder, vas a leer y analizar archivos para obtener contexto y conocimiento del proyecto para una revisión final.\n\nUtiliza ContextScout/ExternalScout/Context7 para analizar los archivos en desarrollo-en-curso/Etapa-5/def-arquitectura/*\n\nTAREA PARTE 1:\nAnaliza toda la definición de arquitectura del proyecto, incluyendo reglas, decisiones, estructura, documentos relacionados y artefactos existentes en el repositorio.\n\nTAREA PARTE 2:\nTu objetivo es comprender el diseño completo y detectar posibles problemas antes de continuar con el desarrollo.\n\nDespués del análisis, prepara una evaluación que incluya:\n\n1. Incoherencias o contradicciones entre documentos, reglas o decisiones.\n2. Posibles incompatibilidades con PHP.\n3. Posibles incompatibilidades con Pipeflow.\n4. Incompatibilidades con artefactos existentes en el repositorio.\n5. Errores, vacíos o indefiniciones que puedan afectar el desarrollo.\n6. Riesgos técnicos, funcionales o de arquitectura.\n7. Dependencias no resueltas.\n8. Decisiones que requieran confirmación antes de implementar.\n9. Evaluación de las fases de desarrollo propuestas.\n\nNo inventes información ni completes vacíos con suposiciones. Basa el análisis únicamente en los documentos y artefactos disponibles en el repositorio. Si algún punto no puede verificarse, márcalo claramente como pendiente de validación.\n\nTAREA PARTE 3:\nGuarda tu informe en un archivo (con índice de contenido + anchors), en: desarrollo-en-curso/Etapa-5/def-arquitectura/07-revision-opencoder.md\n\nPregunta si necesitas aclarar algo y no hagas nada hasta obtener respuesta a tus preguntas.\n\nNo ejecutes ninguna acción de corrección,  solo crea el informe.\n\n---\n	USER	CURSOR	\N	es	\N	\N	DRAFT	f	1	Duplicated from version 1				3	2026-05-14 18:39:03.682	cmoem30ji0000jjcuu3hkdj8c	2026-05-11 20:25:16.537	2026-05-14 18:39:03.774
cmp6hujbm0001l6w3b4iokl9n	Asistente: OpenAgentsControl Recomendaciones agentes, subagentes y prompts	Este documento aconseja, sin ejecutar ni delegar el trabajo, qué agente principal (OpenAgent/OpenCoder), qué subagentes (ContextScout, ExternalScout, TaskManager) y qué patrones (P) usar en una sesión futura de OpenCode.	OpenAgent, contexto/objetivo:\n  A. Tengo integrar API desarrollo-en-curso/Etapa-7/investigacion/wc-api-php-informe.md\n  B. Crear uno/varios Stages Personalizados (SPer) p/ usar la wc-api-php en el repo (desarrollo-en-curso/conocimiento/PPF-SPer-Integracion-WA/)\n  C. Añadirla PRO en workflows\nTu tarea OpenAgent será aconsejarme como hacerlo diciendomoe:\n  1. Agente a usar\n  2. que subagentes usar/delegar\n  3. que P o Ps debo usar y cuándo usarlos.\nTodas tus recomendaciones se llevarán a cabo no esta  sesión, sino  en otra   sesicónn de OC donde ya se ha contextualizado por el  agente .opencode/context/* y el mismo que ha creado desarrollo-en-curso/conocimiento/PPF-SPer-Integracion-WA/\nAclaro: tu OpenAgent no tienes que hacer el trabajo (A B C), tampoco delegarlo, tampoco crear un plan, tu tienes que guiarme/preprar para el  mejor  uso de https://github.com/darrenhinde/OpenAgentsControl para trabajo (A B C)\nPregunta si necesitas aclarar algo y no hagas nada hasta obtener respuesta a tus preguntas. \nGuarda respuesta/resultado en un archivo (con índice de contenido + anchors), asigna tu el nombre más adecuado, en: yousuario/ayuda-aoc/consejos/[NombreArchivo].md	USER	CURSOR	\N	es	\N	\N	TESTED	f	1	Duplicated from version 1				0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-15 05:45:43.759	2026-05-15 05:47:34.64
cmp6vtxg60001uajo5kyw0kkf	Actualizar esquema BD	Actualizar esquema BD con el esquema real desde el servidor de producción.	Actualizar esquema BD: `ARCHIVO` con el esquema real desde el servidor de producción.\n\n## Lee estos archivos para entender cómo:\n* `.opencode/agent/subagents/governance/ftp-deployer.md` — conexión al servidor\n* `.opencode/context/project-intelligence/workflow-patterns.md` — patrones de deploy/migración\n* `.opencode/context/project-intelligence/technical-domain.md` — contexto del servidor\n* `sql/migrations/` — migraciones existentes para verificación\n\n## Formato del documento\n* Mantén la estructura existente: diagramas ASCII de relaciones, tablas markdown por tabla, flujo de ejecución paso a paso, foreign keys, tabla de migraciones\n* Actualiza con datos reales: columnas verificadas, tipos exactos, filas reales, migraciones 004 y 005 ✅\n* Añade info del servidor y fecha de verificación.\n	USER	CURSOR	\N	es	\N	\N	PRODUCTION	f	1					0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-15 12:17:10.034	2026-05-15 12:17:10.034
cmp7xh9i40001oaxmu4c9pesw	Guía Manual Técnico Desarrollo por OpenCoder	OpenCoder delegue una tarea a un subagente llamado ContextScout para crear guía técnica para documentar configuración, uso, flujo interno, JSON y errores reales de la integración del repo.	OpenCoder llama a:\n    task(subagent_type="ContextScout",\n         description="Guía de presentacion, config y uso",\n         prompt=<Delega en Opencoder la creación de una guía técnica completa que explique el funcionamiento de API-WooC integrada en WA.\n\nAntes de ejecutar cualquier acción, revisa el contexto disponible y formula las preguntas necesarias si falta información relevante. No avances con la creación del documento hasta obtener respuesta a esas preguntas.\n\nLa guía debe estar redactada para una persona que no tiene el contexto previo, por lo que debes explicar todo de forma clara, explícita, detallada y didáctica. No debes limitarte a un resumen: transmite el conocimiento completo, incluyendo detalles amplios, decisiones técnicas, funcionamiento interno, configuración, uso y aprendizaje derivado de errores encontrados.\n\nLa guía puede incluir secciones como las siguientes:\n\n1. Introducción y propósito de la integración API-WooC con WA.\n2. Descripción general del funcionamiento.\n3. Arquitectura o flujo de comunicación entre API-WooC y WA.\n4. Archivos que intervienen y función de cada uno.\n5. Configuración necesaria.\n6. Variables, credenciales, endpoints o parámetros relevantes, sin exponer secretos reales.\n7. Funcionamiento interno paso a paso.\n8. Uso y consumo de la integración.\n9. Ejemplos de uso, solicitudes, respuestas o flujos, siempre que estén verificados.\n10. Sección completa dedicada al JSON de datos:\n  * estructura;\n  * campos principales;\n  * significado de cada campo;\n  * obligatoriedad u opcionalidad, si puede confirmarse;\n  * ejemplos verificados;\n  * validaciones;\n  * errores frecuentes relacionados con el JSON.\n11. Errores encontrados durante el análisis o desarrollo.\n12. Causas de esos errores.\n13. Soluciones aplicadas o recomendadas.\n14. Buenas prácticas de uso, mantenimiento y depuración.\n15. Limitaciones, riesgos o puntos pendientes.\n16. Conclusiones.\n\nDebes cumplir estas reglas de forma estricta:\n\n* Toda la información debe ser verídica, verificable y basada en evidencia real del proyecto.\n* No inventes, no rellenes vacíos y no especules.\n* Si algo no puede confirmarse, indícalo expresamente como no confirmado.\n* No incluyas credenciales, claves, tokens ni secretos reales.\n* Si detectas información sensible, sustitúyela por marcadores seguros y documenta que debe configurarse mediante variables de entorno o el mecanismo correspondiente.\n* Incluye el aprendizaje derivado de errores reales encontrados, sin ocultarlos ni suavizarlos.\n\nGuarda el resultado en un archivo Markdown con índice de contenido y anchors internos. Asigna tú mismo un nombre de archivo claro y adecuado, y guárdalo en esta ruta:\n\ndesarrollo-en-curso/Etapa-7/guia/[NombreArchivo].md\n\nEl documento final debe quedar estructurado, trazable, fácil de consultar y útil como referencia técnica para futuras tareas de desarrollo, mantenimiento, depuración y uso de la integración.>	USER	CURSOR	\N	es	\N	\N	PRODUCTION	f	1					0	\N	cmoem30ji0000jjcuu3hkdj8c	2026-05-16 05:51:04.536	2026-05-16 05:51:04.536
\.


--
-- Data for Name: PromptCategory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromptCategory" ("promptId", "categoryId") FROM stdin;
cmownp6u200044vkb0acfgnht	cmownq95e00054vkbysc86o6i
cmownqy1o00094vkb8i2naiqm	cmownq95e00054vkbysc86o6i
cmownty9v000f4vkb3swcte8m	cmownq95e00054vkbysc86o6i
cmox9801d0003xh1tpjmtiwg8	cmox98vh70005xh1tl9z720zb
cmox9aaho0009xh1tkfiarrm5	cmox99u4q0006xh1tp6enp9xn
cmoxa6prv000dxh1t48lpwwl2	cmox98vh70005xh1tl9z720zb
cmoxa6prv000dxh1t48lpwwl2	cmox99u4q0006xh1tp6enp9xn
cmp0zf20h0002oa5mw24674qn	cmox98vh70005xh1tl9z720zb
cmp0zf20h0002oa5mw24674qn	cmownq95e00054vkbysc86o6i
cmp12dytd000113wqq7mthb38	cmox98vh70005xh1tl9z720zb
cmp1bs1ni0001oqxsm227o8tf	cmox98vh70005xh1tl9z720zb
cmp1c34100001da76n426w17f	cmox98vh70005xh1tl9z720zb
cmp1ni8e500011cj21lvrgzzl	cmox98vh70005xh1tl9z720zb
cmp1pfnf0000120mntmisapdh	cmox98vh70005xh1tl9z720zb
cmp1pfnf0000120mntmisapdh	cmox99u4q0006xh1tp6enp9xn
cmp3r3q7y0001wbtekja1jyih	cmox98vh70005xh1tl9z720zb
cmp3r3q7y0001wbtekja1jyih	cmox99u4q0006xh1tp6enp9xn
cmp3r3sb10003wbtezwcg9grp	cmox98vh70005xh1tl9z720zb
cmp3r3sb10003wbtezwcg9grp	cmox99u4q0006xh1tp6enp9xn
cmp6hujbm0001l6w3b4iokl9n	cmownq95e00054vkbysc86o6i
cmp6hujbm0001l6w3b4iokl9n	cmox98vh70005xh1tl9z720zb
cmp6vtxg60001uajo5kyw0kkf	cmox98vh70005xh1tl9z720zb
cmp6vtxg60001uajo5kyw0kkf	cmox99u4q0006xh1tp6enp9xn
cmp7xh9i40001oaxmu4c9pesw	cmownq95e00054vkbysc86o6i
cmp7xh9i40001oaxmu4c9pesw	cmox98vh70005xh1tl9z720zb
\.


--
-- Data for Name: PromptClientProject; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromptClientProject" ("promptId", "clientProjectId") FROM stdin;
cmownp6u200044vkb0acfgnht	cmownoete00014vkb31pe0vuq
cmownqy1o00094vkb8i2naiqm	cmownoete00014vkb31pe0vuq
cmownty9v000f4vkb3swcte8m	cmownoete00014vkb31pe0vuq
cmox9801d0003xh1tpjmtiwg8	cmownoete00014vkb31pe0vuq
cmox9aaho0009xh1tkfiarrm5	cmownoete00014vkb31pe0vuq
cmoxa6prv000dxh1t48lpwwl2	cmownoete00014vkb31pe0vuq
cmoxa6prv000dxh1t48lpwwl2	cmoxafza40000qmd33zyw2f0q
cmp0zf20h0002oa5mw24674qn	cmownoete00014vkb31pe0vuq
cmp12dytd000113wqq7mthb38	cmownoete00014vkb31pe0vuq
cmp1bs1ni0001oqxsm227o8tf	cmownoete00014vkb31pe0vuq
cmp1bs1ni0001oqxsm227o8tf	cmoxafza40000qmd33zyw2f0q
cmp1c34100001da76n426w17f	cmownoete00014vkb31pe0vuq
cmp1c34100001da76n426w17f	cmoxafza40000qmd33zyw2f0q
cmp1ni8e500011cj21lvrgzzl	cmownoete00014vkb31pe0vuq
cmp1ni8e500011cj21lvrgzzl	cmoxafza40000qmd33zyw2f0q
cmp1pfnf0000120mntmisapdh	cmownoete00014vkb31pe0vuq
cmp3r3q7y0001wbtekja1jyih	cmownoete00014vkb31pe0vuq
cmp3r3sb10003wbtezwcg9grp	cmownoete00014vkb31pe0vuq
cmp6hujbm0001l6w3b4iokl9n	cmownoete00014vkb31pe0vuq
cmp6vtxg60001uajo5kyw0kkf	cmownoete00014vkb31pe0vuq
cmp7xh9i40001oaxmu4c9pesw	cmownoete00014vkb31pe0vuq
\.


--
-- Data for Name: PromptModelHint; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromptModelHint" ("promptId", "modelHintId") FROM stdin;
\.


--
-- Data for Name: PromptPlatform; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromptPlatform" ("promptId", "platformId") FROM stdin;
cmownp6u200044vkb0acfgnht	cmownot1800024vkb42tfd2p7
cmownqy1o00094vkb8i2naiqm	cmownot1800024vkb42tfd2p7
cmownty9v000f4vkb3swcte8m	cmownot1800024vkb42tfd2p7
cmox9801d0003xh1tpjmtiwg8	cmox97rh30001xh1tg3ypf4t3
cmox9aaho0009xh1tkfiarrm5	cmox97rh30001xh1tg3ypf4t3
cmox9aaho0009xh1tkfiarrm5	cmownot1800024vkb42tfd2p7
cmoxa6prv000dxh1t48lpwwl2	cmox97rh30001xh1tg3ypf4t3
cmp0zf20h0002oa5mw24674qn	cmox97rh30001xh1tg3ypf4t3
cmp12dytd000113wqq7mthb38	cmox97rh30001xh1tg3ypf4t3
cmp1bs1ni0001oqxsm227o8tf	cmox97rh30001xh1tg3ypf4t3
cmp1c34100001da76n426w17f	cmox97rh30001xh1tg3ypf4t3
cmp1ni8e500011cj21lvrgzzl	cmox97rh30001xh1tg3ypf4t3
cmp1pfnf0000120mntmisapdh	cmox97rh30001xh1tg3ypf4t3
cmp3r3q7y0001wbtekja1jyih	cmox97rh30001xh1tg3ypf4t3
cmp3r3sb10003wbtezwcg9grp	cmox97rh30001xh1tg3ypf4t3
cmp6hujbm0001l6w3b4iokl9n	cmownot1800024vkb42tfd2p7
cmp6vtxg60001uajo5kyw0kkf	cmox97rh30001xh1tg3ypf4t3
cmp7xh9i40001oaxmu4c9pesw	cmox97rh30001xh1tg3ypf4t3
\.


--
-- Data for Name: PromptTag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromptTag" ("promptId", "tagId") FROM stdin;
cmownp6u200044vkb0acfgnht	cmownqg9100064vkbsxyj83rc
cmownqy1o00094vkb8i2naiqm	cmownt9xz000c4vkb5vvwx7db
cmownty9v000f4vkb3swcte8m	cmownt9xz000c4vkb5vvwx7db
cmox9801d0003xh1tpjmtiwg8	cmownt9xz000c4vkb5vvwx7db
cmox9801d0003xh1tpjmtiwg8	cmox98dyo0004xh1txypgx7sa
cmox9aaho0009xh1tkfiarrm5	cmownt9xz000c4vkb5vvwx7db
cmox9aaho0009xh1tkfiarrm5	cmox98dyo0004xh1txypgx7sa
cmoxa6prv000dxh1t48lpwwl2	cmox98dyo0004xh1txypgx7sa
cmp0zf20h0002oa5mw24674qn	cmownt9xz000c4vkb5vvwx7db
cmp12dytd000113wqq7mthb38	cmownt9xz000c4vkb5vvwx7db
cmp1bs1ni0001oqxsm227o8tf	cmownt9xz000c4vkb5vvwx7db
cmp1bs1ni0001oqxsm227o8tf	cmox98dyo0004xh1txypgx7sa
cmp1c34100001da76n426w17f	cmownt9xz000c4vkb5vvwx7db
cmp1ni8e500011cj21lvrgzzl	cmownt9xz000c4vkb5vvwx7db
cmp1pfnf0000120mntmisapdh	cmownt9xz000c4vkb5vvwx7db
cmp3r3q7y0001wbtekja1jyih	cmownt9xz000c4vkb5vvwx7db
cmp3r3sb10003wbtezwcg9grp	cmownt9xz000c4vkb5vvwx7db
cmp6hujbm0001l6w3b4iokl9n	cmownt9xz000c4vkb5vvwx7db
\.


--
-- Data for Name: PromptUseCase; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromptUseCase" ("promptId", "useCaseId") FROM stdin;
cmownp6u200044vkb0acfgnht	cmownnt7b00004vkbh69r43ku
cmownqy1o00094vkb8i2naiqm	cmownnt7b00004vkbh69r43ku
cmownty9v000f4vkb3swcte8m	cmownnt7b00004vkbh69r43ku
cmox9801d0003xh1tpjmtiwg8	cmox977iu0000xh1tdsyvcocr
cmox9aaho0009xh1tkfiarrm5	cmox9bnbi000axh1tzpbm0341
cmoxa6prv000dxh1t48lpwwl2	cmox977iu0000xh1tdsyvcocr
cmoxa6prv000dxh1t48lpwwl2	cmox9bnbi000axh1tzpbm0341
cmp0zf20h0002oa5mw24674qn	cmp0zethe0000oa5mk8vxdzah
cmp12dytd000113wqq7mthb38	cmp0zethe0000oa5mk8vxdzah
cmp1bs1ni0001oqxsm227o8tf	cmp0zethe0000oa5mk8vxdzah
cmp1c34100001da76n426w17f	cmp0zethe0000oa5mk8vxdzah
cmp1ni8e500011cj21lvrgzzl	cmp0zethe0000oa5mk8vxdzah
cmp1ni8e500011cj21lvrgzzl	cmox977iu0000xh1tdsyvcocr
cmp1pfnf0000120mntmisapdh	cmox977iu0000xh1tdsyvcocr
cmp1pfnf0000120mntmisapdh	cmownnt7b00004vkbh69r43ku
cmp1pfnf0000120mntmisapdh	cmp0zethe0000oa5mk8vxdzah
cmp3r3q7y0001wbtekja1jyih	cmownnt7b00004vkbh69r43ku
cmp3r3q7y0001wbtekja1jyih	cmp0zethe0000oa5mk8vxdzah
cmp3r3q7y0001wbtekja1jyih	cmox977iu0000xh1tdsyvcocr
cmp3r3sb10003wbtezwcg9grp	cmownnt7b00004vkbh69r43ku
cmp3r3sb10003wbtezwcg9grp	cmp0zethe0000oa5mk8vxdzah
cmp3r3sb10003wbtezwcg9grp	cmox977iu0000xh1tdsyvcocr
cmp6hujbm0001l6w3b4iokl9n	cmownnt7b00004vkbh69r43ku
cmp6hujbm0001l6w3b4iokl9n	cmp0zethe0000oa5mk8vxdzah
cmp6vtxg60001uajo5kyw0kkf	cmp0zethe0000oa5mk8vxdzah
cmp6vtxg60001uajo5kyw0kkf	cmox977iu0000xh1tdsyvcocr
cmp7xh9i40001oaxmu4c9pesw	cmp0zethe0000oa5mk8vxdzah
cmp7xh9i40001oaxmu4c9pesw	cmownnt7b00004vkbh69r43ku
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tag" (id, name, slug, "createdAt", "updatedAt") FROM stdin;
cmownqg9100064vkbsxyj83rc	Slim	slim	2026-05-08 08:32:49.093	2026-05-08 08:32:49.093
cmownt9xz000c4vkb5vvwx7db	OpenCode	opencode	2026-05-08 08:35:00.888	2026-05-08 08:35:00.888
cmox98dyo0004xh1txypgx7sa	Github	github	2026-05-08 18:34:37.871	2026-05-08 18:34:37.871
\.


--
-- Data for Name: UseCase; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UseCase" (id, name, slug, "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmownnt7b00004vkbh69r43ku	SOPORTE-TECNICO	soporte-tecnico	0	2026-05-08 08:30:45.909	2026-05-08 08:30:45.909
cmox977iu0000xh1tdsyvcocr	ANALISIS-CODIGO	analisis-codigo	0	2026-05-08 18:33:42.867	2026-05-08 18:33:42.867
cmox9bnbi000axh1tzpbm0341	BUSCAR-REPOS-CODIGO	buscar-repos-codigo	0	2026-05-08 18:37:09.965	2026-05-08 18:37:09.965
cmp0zethe0000oa5mk8vxdzah	DESARROLLO-CODIGO	desarrollo-codigo	0	2026-05-11 09:10:46.464	2026-05-11 09:10:46.464
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, email, "emailVerified", image, password, role, "promptListViewPreference", "createdAt", "updatedAt") FROM stdin;
cmoem30qo0001jjculf8nujwi	Usuario	chamed@paginaviva.net	2026-04-25 17:26:45.119	\N	$2b$10$8dTr8.Py/iquDUQ8CdHOYOHezfnhNMNVT6SeodddjFcjBFhXlzTTS	user	cards	2026-04-25 17:26:45.12	2026-04-25 17:26:45.12
cmoem30ji0000jjcuu3hkdj8c	Administrador	server@paginaviva.net	2026-04-25 17:26:44.281	\N	$2b$10$wrhO.xRjdgrYJtEqRKI8tuVDkV9MNqgyh3Di8LETREr1rDc5Pa33e	admin	list	2026-04-25 17:26:44.863	2026-05-08 18:35:51.255
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ClientProject ClientProject_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientProject"
    ADD CONSTRAINT "ClientProject_pkey" PRIMARY KEY (id);


--
-- Name: ModelHint ModelHint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ModelHint"
    ADD CONSTRAINT "ModelHint_pkey" PRIMARY KEY (id);


--
-- Name: Platform Platform_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Platform"
    ADD CONSTRAINT "Platform_pkey" PRIMARY KEY (id);


--
-- Name: PromptCategory PromptCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptCategory"
    ADD CONSTRAINT "PromptCategory_pkey" PRIMARY KEY ("promptId", "categoryId");


--
-- Name: PromptClientProject PromptClientProject_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptClientProject"
    ADD CONSTRAINT "PromptClientProject_pkey" PRIMARY KEY ("promptId", "clientProjectId");


--
-- Name: PromptModelHint PromptModelHint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptModelHint"
    ADD CONSTRAINT "PromptModelHint_pkey" PRIMARY KEY ("promptId", "modelHintId");


--
-- Name: PromptPlatform PromptPlatform_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptPlatform"
    ADD CONSTRAINT "PromptPlatform_pkey" PRIMARY KEY ("promptId", "platformId");


--
-- Name: PromptTag PromptTag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptTag"
    ADD CONSTRAINT "PromptTag_pkey" PRIMARY KEY ("promptId", "tagId");


--
-- Name: PromptUseCase PromptUseCase_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptUseCase"
    ADD CONSTRAINT "PromptUseCase_pkey" PRIMARY KEY ("promptId", "useCaseId");


--
-- Name: Prompt Prompt_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Prompt"
    ADD CONSTRAINT "Prompt_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: UseCase UseCase_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UseCase"
    ADD CONSTRAINT "UseCase_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Category_parentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Category_parentId_idx" ON public."Category" USING btree ("parentId");


--
-- Name: Category_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Category_slug_idx" ON public."Category" USING btree (slug);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: ClientProject_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ClientProject_name_key" ON public."ClientProject" USING btree (name);


--
-- Name: ClientProject_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClientProject_slug_idx" ON public."ClientProject" USING btree (slug);


--
-- Name: ClientProject_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ClientProject_slug_key" ON public."ClientProject" USING btree (slug);


--
-- Name: ModelHint_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ModelHint_name_key" ON public."ModelHint" USING btree (name);


--
-- Name: ModelHint_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ModelHint_slug_idx" ON public."ModelHint" USING btree (slug);


--
-- Name: ModelHint_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ModelHint_slug_key" ON public."ModelHint" USING btree (slug);


--
-- Name: Platform_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Platform_name_key" ON public."Platform" USING btree (name);


--
-- Name: Platform_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Platform_slug_idx" ON public."Platform" USING btree (slug);


--
-- Name: Platform_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Platform_slug_key" ON public."Platform" USING btree (slug);


--
-- Name: PromptCategory_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptCategory_categoryId_idx" ON public."PromptCategory" USING btree ("categoryId");


--
-- Name: PromptCategory_promptId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptCategory_promptId_idx" ON public."PromptCategory" USING btree ("promptId");


--
-- Name: PromptClientProject_clientProjectId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptClientProject_clientProjectId_idx" ON public."PromptClientProject" USING btree ("clientProjectId");


--
-- Name: PromptClientProject_promptId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptClientProject_promptId_idx" ON public."PromptClientProject" USING btree ("promptId");


--
-- Name: PromptModelHint_modelHintId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptModelHint_modelHintId_idx" ON public."PromptModelHint" USING btree ("modelHintId");


--
-- Name: PromptModelHint_promptId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptModelHint_promptId_idx" ON public."PromptModelHint" USING btree ("promptId");


--
-- Name: PromptPlatform_platformId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptPlatform_platformId_idx" ON public."PromptPlatform" USING btree ("platformId");


--
-- Name: PromptPlatform_promptId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptPlatform_promptId_idx" ON public."PromptPlatform" USING btree ("promptId");


--
-- Name: PromptTag_promptId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptTag_promptId_idx" ON public."PromptTag" USING btree ("promptId");


--
-- Name: PromptTag_tagId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptTag_tagId_idx" ON public."PromptTag" USING btree ("tagId");


--
-- Name: PromptUseCase_promptId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptUseCase_promptId_idx" ON public."PromptUseCase" USING btree ("promptId");


--
-- Name: PromptUseCase_useCaseId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PromptUseCase_useCaseId_idx" ON public."PromptUseCase" USING btree ("useCaseId");


--
-- Name: Prompt_isFavorite_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Prompt_isFavorite_idx" ON public."Prompt" USING btree ("isFavorite");


--
-- Name: Prompt_language_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Prompt_language_idx" ON public."Prompt" USING btree (language);


--
-- Name: Prompt_platform_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Prompt_platform_idx" ON public."Prompt" USING btree (platform);


--
-- Name: Prompt_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Prompt_status_idx" ON public."Prompt" USING btree (status);


--
-- Name: Prompt_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Prompt_userId_idx" ON public."Prompt" USING btree ("userId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Tag_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);


--
-- Name: Tag_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tag_slug_idx" ON public."Tag" USING btree (slug);


--
-- Name: Tag_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tag_slug_key" ON public."Tag" USING btree (slug);


--
-- Name: UseCase_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UseCase_name_key" ON public."UseCase" USING btree (name);


--
-- Name: UseCase_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "UseCase_slug_idx" ON public."UseCase" USING btree (slug);


--
-- Name: UseCase_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UseCase_slug_key" ON public."UseCase" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Category Category_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptCategory PromptCategory_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptCategory"
    ADD CONSTRAINT "PromptCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptCategory PromptCategory_promptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptCategory"
    ADD CONSTRAINT "PromptCategory_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES public."Prompt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptClientProject PromptClientProject_clientProjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptClientProject"
    ADD CONSTRAINT "PromptClientProject_clientProjectId_fkey" FOREIGN KEY ("clientProjectId") REFERENCES public."ClientProject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptClientProject PromptClientProject_promptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptClientProject"
    ADD CONSTRAINT "PromptClientProject_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES public."Prompt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptModelHint PromptModelHint_modelHintId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptModelHint"
    ADD CONSTRAINT "PromptModelHint_modelHintId_fkey" FOREIGN KEY ("modelHintId") REFERENCES public."ModelHint"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptModelHint PromptModelHint_promptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptModelHint"
    ADD CONSTRAINT "PromptModelHint_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES public."Prompt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptPlatform PromptPlatform_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptPlatform"
    ADD CONSTRAINT "PromptPlatform_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."Platform"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptPlatform PromptPlatform_promptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptPlatform"
    ADD CONSTRAINT "PromptPlatform_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES public."Prompt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptTag PromptTag_promptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptTag"
    ADD CONSTRAINT "PromptTag_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES public."Prompt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptTag PromptTag_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptTag"
    ADD CONSTRAINT "PromptTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptUseCase PromptUseCase_promptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptUseCase"
    ADD CONSTRAINT "PromptUseCase_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES public."Prompt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PromptUseCase PromptUseCase_useCaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromptUseCase"
    ADD CONSTRAINT "PromptUseCase_useCaseId_fkey" FOREIGN KEY ("useCaseId") REFERENCES public."UseCase"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Prompt Prompt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Prompt"
    ADD CONSTRAINT "Prompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict I6oX4lHd3Q37R1aITW8aJ7cuCPLQJsyyVXKiBCuEh4tT2ah8L4InlLYoQtroONI

