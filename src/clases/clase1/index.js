import { crearIceberg } from "./iceberg.js";
import { crearHistoria, crearRoles, crearHerramientas, crearAgua, crearFuentes, crearMedallion, crearDag } from "./escenas.js";

// Agenda de la Clase 1: apertura de «Mi plan» y luego el orden del marco teórico.
const agenda = [
  { id: "bienvenida", nombre: "Bienvenida y presentación de los estudiantes" },
  { id: "programa", nombre: "Programa del curso" },
  { id: "evaluacion", nombre: "Evaluación del curso" },
  { id: "introduccion", nombre: "Introducción: ¿por qué fallan los proyectos de IA?" },
  { id: "roles", nombre: "Mapa de roles de Data & AI" },
  { id: "herramientas", nombre: "Herramientas del curso y formatos de datos" },
  { id: "pipeline", nombre: "¿Qué es un pipeline de datos?" },
  { id: "infraestructura", nombre: "La infraestructura moderna de datos" },
  { id: "fuentes", nombre: "Fuentes de datos" },
  { id: "almacenamiento", nombre: "Warehouse, lake, lakehouse y medallion" },
  { id: "dag", nombre: "Orquestación y DAG" },
  { id: "resumen", nombre: "Resumen y conclusiones" },
  { id: "laboratorio", nombre: "Laboratorio C1L1: cuentas y acceso" },
  { id: "cierre", nombre: "Debate y reflexión" }
];

const listaAgenda = (aqui) => `<ol class="agenda">${agenda.map((a) =>
  `<li class="${a.id === aqui ? "aqui" : ""}"><span>${a.nombre}${a.pendiente ? ' <span class="fuente">· en preparación</span>' : ""}</span></li>`).join("")}</ol>`;

const CURSO_GENERAL = { escena: "curso", cam: [0, 60, 104], mira: [0, 0, -4], resaltada: 1 };

const pasos = [
  // ---- Apertura
  { seccion: "bienvenida", ...CURSO_GENERAL, cam: [-30, 40, 80], mira: [-40, 0, 0],
    ojo: "Clase 1 · Semana 1", t: "Fundamentos de Big Data",
    html: `<p>Agenda de hoy:</p>${listaAgenda()}` ,
    mas: `<p>Cada clase dura 4 horas: de 20 % a 40 % de exposición, de 40 % a 60 % de práctica y 20 % de cierre.</p>` },
  { seccion: "bienvenida", escena: "curso", cam: [-50, 16, 44], mira: [-70, 6, 10], resaltada: 1,
    ojo: "Bienvenida", t: "Presentémonos",
    html: `<p>Cada estudiante comparte en un minuto:</p>
    <ul><li>Nombre y a qué se dedica hoy.</li><li>Experiencia con datos: Python, SQL, Excel, tableros.</li><li>Si ha usado alguna vez la nube o un notebook.</li><li>Qué espera llevarse del curso.</li></ul>`,
    mas: `<p>Sirve para ubicar el punto de partida del grupo y ajustar el ritmo de los laboratorios.</p>` },

  // ---- Programa
  { seccion: "programa", ...CURSO_GENERAL,
    ojo: "Programa del curso", t: "Un pipeline de punta a punta",
    html: `<p>Los equipos de datos de la industria llevan datos crudos hasta un modelo de IA y, de ahí, a una decisión de negocio. Este curso recorre ese camino completo:</p>
    <ul><li>Extraer datos desde una <b>API</b>.</li><li>Cargarlos y transformarlos en capas <b>bronce, plata y oro</b>.</li><li>Analizarlos y visualizarlos.</li><li>Clasificarlos con un <b>modelo preentrenado</b> sobre PyTorch.</li><li>Devolver las predicciones a Databricks para resumir tendencias.</li></ul>`,
    mas: `<p>Todo con datos de texto en español y herramientas gratuitas: Google Colab para la extracción y el entrenamiento, y Databricks Free Edition para el procesamiento con SQL.</p>` },
  { seccion: "programa", escena: "curso", cam: [-20, 44, 74], mira: [0, 0, -4], resaltada: 1,
    ojo: "Programa del curso", t: "Objetivos",
    html: `<p><b>General:</b> usar las herramientas de Python para el procesamiento masivo de datos y para modelos elementales de deep learning, integrando ambos en un pipeline de texto.</p>
    <ul><li><b>Arquitectura:</b> data lake, data warehouse y lakehouse; capas bronce, plata y oro.</li><li><b>Pipelines:</b> extraer de una API, cargar a la nube y transformar con SQL en Databricks.</li><li><b>Análisis:</b> exploración, validación de calidad y visualización de texto.</li><li><b>Deep learning:</b> usar y ajustar modelos preentrenados y llevar sus predicciones al pipeline.</li></ul>`,
    mas: `<p>Los cuatro objetivos específicos siguen el orden del curso: semanas 1 y 2 para los datos, semana 3 para el deep learning y semana 4 para unir todo.</p>` },
  { seccion: "programa", escena: "curso", cam: [34, 34, 76], mira: [6, 0, -6], resaltada: 1,
    ojo: "Programa del curso", t: "8 clases, 4 semanas",
    html: `<ul><li><b>Semana 1:</b> C1 Fundamentos de Big Data · C2 Extracción y carga.</li><li><b>Semana 2:</b> C3 Transformación y calidad · C4 Análisis exploratorio.</li>
    <li><b>Semana 3:</b> C5 Introducción al Deep Learning · C6 Modelos preentrenados.</li><li><b>Semana 4:</b> C7 Pipeline de punta a punta · C8 Cierre y proyectos.</li></ul>
    <p>Herramientas: <b>Google Colab</b>, <b>Databricks Free Edition</b>, <b>GitHub</b> y la API pública de <b>Hugging Face</b>.</p>`,
    mas: `<p>Cada estación de este mapa es una clase. Se encienden a medida que se publica su contenido.</p>` },

  // ---- Evaluación
  { seccion: "evaluacion", escena: "curso", cam: [0, 92, 58], mira: [0, 0, -4], resaltada: 1,
    ojo: "Evaluación del curso", t: "Cómo se evalúa",
    html: `<div class="cifras"><div><b>20 %</b><span>Kahoots</span></div><div><b>50 %</b><span>Laboratorios</span></div><div><b>30 %</b><span>Proyecto final</span></div></div>
    <ul><li><b>Kahoots:</b> 7 quizzes de repaso, al inicio de cada clase de la C2 a la C8.</li>
    <li><b>Laboratorios:</b> 3 entregas semanales, cada una con su rúbrica. Lab 1: C1 y C2 · Lab 2: C3 y C4 · Lab 3: C5 y C6.</li>
    <li><b>Proyecto final:</b> clasificación de noticias en español (GDELT), en grupos de al menos 2 personas. Se asigna en la C2 y se presenta en la C8.</li></ul>`,
    mas: `<p>Los laboratorios se trabajan en el repositorio de GitHub de cada estudiante y se entregan en Moodle con la URL del repositorio. Las soluciones de cada laboratorio se publican después de su fecha de entrega.</p>` },

  // ---- Introducción
  { seccion: "introduccion", escena: "historia", cam: [-6, 14, 42], mira: [0, 6, 0],
    ojo: "Introducción", t: "¿Por qué fallan los proyectos de IA?",
    html: `<p>¿Qué pasa cuando una organización despliega un modelo avanzado de IA, pero los resultados cambian en cada ejecución porque <b>nadie sabe de dónde vienen los datos</b> ni quién debe prepararlos?</p>`,
    mas: `<p>La respuesta casi nunca está en la falta de talento técnico, sino en la falta de claridad sobre dónde termina la responsabilidad de un rol y dónde empieza la del siguiente.</p>` },
  { seccion: "introduccion", escena: "historia", cam: [22, 18, 48], mira: [6, 6, 0],
    ojo: "Introducción", t: "Una historia de comercio electrónico",
    html: `<ul><li>La empresa lanza una función de <b>recomendación de productos</b> para vender más.</li><li>Semanas después, el modelo sugiere productos erróneos.</li>
    <li>Los tableros de la gerencia muestran <b>cifras contradictorias</b> de ingresos.</li><li>Ingenieros y analistas <b>se culpan</b> entre sí.</li></ul>
    <p>Mira el pipeline: tiene huecos entre tramos, y por ahí se escapan los datos.</p>`,
    mas: `<p>Es una historia ficticia, pero muy común en la industria. La retomamos al final de la clase para ver cómo se resuelve.</p>` },
  { seccion: "introduccion", escena: "historia", cam: [0, 30, 64], mira: [0, 6, 0],
    ojo: "Introducción", t: "Al final de esta clase podrán",
    html: `<ul><li>Diferenciar los <b>nueve roles</b> de Data & AI y sus traspasos de trabajo.</li><li>Explicar las <b>herramientas</b> del curso y por qué se protegen los tokens.</li>
    <li>Definir qué es un <b>pipeline</b> y por qué la IA depende de él.</li><li>Describir la <b>infraestructura moderna</b> y la diversidad de las fuentes.</li>
    <li>Distinguir <b>warehouse, lake y lakehouse</b>, y las capas bronce, plata y oro.</li><li>Entender el <b>DAG</b> como base de la orquestación.</li></ul>`,
    mas: `<p>Cada objetivo corresponde a una sección de la clase, en este mismo orden.</p>` },

  // ---- Mapa de roles
  { seccion: "roles", escena: "roles", cam: [-2, 44, 62], mira: [-2, 6, 2],
    ojo: "Mapa de roles de Data & AI", t: "Las brechas en los traspasos",
    html: `<ul><li>Muchas empresas dicen estar guiadas por datos, pero <b>deciden lento y por intuición</b>.</li><li>La causa: las brechas en los traspasos de trabajo (<i>handoff gaps</i>).</li>
    <li>La organización moderna se estructura en <b>nueve roles</b> con responsabilidades claras.</li><li>Cada flecha es un traspaso: lo que un rol entrega y otro recibe.</li></ul><p class="fuente">Curry (2025)</p>`,
    mas: `<p>Los roles no forman una sola fila: varios trabajan en paralelo sobre lo que entrega el mismo rol.</p>` },
  { seccion: "roles", escena: "roles", foco: "DE", cam: [-20, 14, 20], mira: [-26, 5, 0],
    ojo: "Rol 1 de 9", t: "Data Engineer",
    html: `<ul><li><b>Dueño</b> de la ingesta, los pipelines y la confiabilidad de la plataforma.</li><li><b>Misión:</b> que los datos estén limpios, bien modelados y disponibles.</li>
    <li><b>Herramientas:</b> Snowflake, Databricks, Airflow, Kafka, Spark, Python y SQL.</li><li><b>Entrega:</b> tablas estructuradas, listas para usarse.</li></ul>`,
    mas: `<p>Fíjate en las flechas: entrega en paralelo al Analytics Engineer, al Data Scientist y al AI Engineer. Curry (2025); Densmore (2021, cap. 1).</p>` },
  { seccion: "roles", escena: "roles", foco: "AE", cam: [-2, 14, 6], mira: [-8, 5, -12],
    ojo: "Rol 2 de 9", t: "Analytics Engineer",
    html: `<ul><li>Un <b>desarrollador de software</b> para datos analíticos.</li><li><b>Misión:</b> convertir datos crudos en conjuntos listos para el negocio.</li>
    <li>Define <b>métricas únicas</b> y construye la capa semántica.</li><li><b>Herramientas:</b> dbt, SQL, Git, warehouses analíticos.</li><li><b>Entrega:</b> modelos dimensionales y métricas unificadas.</li></ul>`,
    mas: `<p>Sus métricas alimentan a la vez al BI Developer, al Data Analyst y al Data Scientist (Curry, 2025).</p>` },
  { seccion: "roles", escena: "roles", foco: "BI", cam: [16, 14, -2], mira: [10, 5, -20],
    ojo: "Rol 3 de 9", t: "BI Developer",
    html: `<ul><li>Diseña la <b>interfaz visual</b> que consume la empresa.</li><li>Construye tableros, cuida la usabilidad y facilita el <b>autoservicio</b>.</li>
    <li><b>Herramientas:</b> Power BI, Tableau, Looker.</li><li><b>Entrega:</b> visualizaciones de los indicadores clave.</li></ul>`,
    mas: `<p>Curry (2025).</p>` },
  { seccion: "roles", escena: "roles", foco: "DA", cam: [18, 14, 10], mira: [12, 5, -7],
    ojo: "Rol 4 de 9", t: "Data Analyst",
    html: `<ul><li>Convierte los datos en <b>explicaciones e ideas</b> de negocio.</li><li><b>Misión:</b> responder por qué pasó algo y qué decisión tomar.</li>
    <li><b>Herramientas:</b> SQL, Python, Excel.</li><li><b>Entrega:</b> diagnósticos y recomendaciones estratégicas.</li></ul>`,
    mas: `<p>Curry (2025); Densmore (2021, cap. 1).</p>` },
  { seccion: "roles", escena: "roles", foco: "DS", cam: [0, 14, 22], mira: [-6, 5, 4],
    ojo: "Rol 5 de 9", t: "Data Scientist",
    html: `<ul><li>Aporta <b>predicción, optimización y experimentación</b>.</li><li><b>Misión:</b> modelos causales o predictivos que influyan en el comportamiento del usuario.</li>
    <li><b>Herramientas:</b> Python, scikit-learn, PyTorch, TensorFlow.</li><li><b>Entrega:</b> modelos y estimaciones de impacto.</li></ul>`,
    mas: `<p>Recibe datos del Data Engineer y métricas del Analytics Engineer, y entrega sus modelos al AI Engineer y a MLOps (Curry, 2025; Densmore, 2021, cap. 1).</p>` },
  { seccion: "roles", escena: "roles", foco: "AI", cam: [0, 14, 36], mira: [-6, 5, 18],
    ojo: "Rol 6 de 9", t: "AI / LLM Engineer",
    html: `<ul><li>Construye y despliega aplicaciones con <b>LLMs, agentes</b> y flujos automatizados.</li><li><b>Herramientas:</b> LangChain, LlamaIndex, bases de datos vectoriales, APIs de IA.</li>
    <li><b>Entrega:</b> funcionalidades y <i>endpoints</i> inteligentes.</li><li>También <b>trabaja directamente con los datos</b>: la flecha de vuelta hacia el Data Engineer.</li></ul>`,
    mas: `<p>Convierte las predicciones en acciones (Curry, 2025).</p>` },
  { seccion: "roles", escena: "roles", foco: "PE", cam: [18, 14, 38], mira: [12, 5, 24],
    ojo: "Rol 7 de 9", t: "Prompt Engineer",
    html: `<ul><li>Diseña y optimiza las <b>instrucciones</b> que reciben los modelos.</li><li>Busca respuestas precisas, fiables y alineadas con la marca.</li>
    <li><b>Herramientas:</b> marcos de evaluación de LLMs y búsqueda vectorial.</li><li><b>Entrega:</b> marcos de interacción y patrones de comportamiento.</li></ul>`,
    mas: `<p>Trabaja codo a codo con el AI Engineer (Curry, 2025).</p>` },
  { seccion: "roles", escena: "roles", foco: "ML", cam: [24, 14, 24], mira: [16, 5, 10],
    ojo: "Rol 8 de 9", t: "MLOps / DevOps Engineer",
    html: `<ul><li>Convierte los prototipos en <b>sistemas en producción</b> que escalan.</li><li>Despliegue, monitoreo de degradación, reentrenamiento e integración continua.</li>
    <li><b>Herramientas:</b> Docker, Kubernetes, MLflow, GitHub Actions.</li><li><b>Entrega:</b> infraestructura confiable y automatizada.</li></ul>`,
    mas: `<p>Recibe los modelos del Data Scientist y las aplicaciones del AI Engineer (Curry, 2025).</p>` },
  { seccion: "roles", escena: "roles", foco: "PM", cam: [-4, 30, 22], mira: [-4, 16, 2],
    ojo: "Rol 9 de 9", t: "Product Manager (Data & AI)",
    html: `<ul><li>Lidera la <b>priorización estratégica</b> y la alineación con el negocio.</li><li>Asegura que el equipo construya <b>soluciones útiles</b>, no solo experimentos interesantes.</li>
    <li>Se conecta con todos los roles, no es un eslabón más de la cadena.</li></ul>`,
    mas: `<p>Curry (2025).</p>` },
  { seccion: "roles", escena: "roles", foco: ["DE", "AE", "DA", "DS", "AI", "ML"], cam: [-2, 44, 62], mira: [-2, 6, 2],
    ojo: "Mapa de roles de Data & AI", t: "Una cadena con ramas paralelas",
    html: `<ul><li>Data Engineer: datos <b>usables</b> · Analytics Engineer: <b>coherentes</b> · BI Developer: <b>comprensibles</b>.</li>
    <li>Data Analyst: <b>significativos</b> · Data Scientist: <b>predictivos</b> · AI Engineer: <b>acciones</b>.</li><li>MLOps garantiza la <b>confiabilidad</b> y el Product Manager el <b>valor</b>.</li>
    <li>En la práctica, <b>varios roles trabajan en paralelo</b> sobre lo que entrega el mismo rol.</li>
    <li><b>En este curso:</b> Data Engineer, Analytics Engineer, Data Analyst y Data Scientist / AI Engineer, con nociones de MLOps.</li></ul>`,
    mas: `<p>Curry (2025). Los roles resaltados son los que el curso representa.</p>` },

  // ---- Herramientas y formatos
  { seccion: "herramientas", escena: "herramientas", foco: "api", cam: [-7.8, 11, -0.2], mira: [-17.2, 9, -7.7],
    ojo: "Herramientas del curso", t: "REST API",
    html: `<ul><li>Una <b>capa de abstracción</b> sobre un sistema para extraer o enviar datos con peticiones web.</li><li>El mecanismo estándar para hablar con servicios de terceros o aplicaciones internas.</li>
    <li>Segura y estructurada: casi siempre responde en <b>JSON</b>.</li><li>En el curso: la API de datasets de <b>Hugging Face</b>.</li></ul><p class="fuente">Densmore (2021), cap. 2</p>`,
    mas: `<p>Primero se entiende quién hace qué; ahora, con qué herramientas y formatos se construyen los flujos de información.</p>` },
  { seccion: "herramientas", escena: "herramientas", foco: "colab", cam: [-4.35, 11, -3], mira: [-9.57, 9, -13.8],
    ojo: "Herramientas del curso", t: "Google Colab",
    html: `<ul><li>Jupyter Notebooks <b>alojados</b>: sin instalar nada.</li><li>Cómputo en la nube, incluida <b>GPU</b>.</li>
    <li>Pensado para enseñanza, ciencia de datos y machine learning.</li><li>Los notebooks se comparten por Google Drive o <b>GitHub</b>.</li></ul><p class="fuente">Google Colab FAQ</p>`,
    mas: `<p>En el curso: extracción desde la API, carga a Databricks y, en la semana 3, el entrenamiento de modelos.</p>` },
  { seccion: "herramientas", escena: "herramientas", foco: "databricks", cam: [0, 11, -4], mira: [0, 9, -16],
    ojo: "Herramientas del curso", t: "Databricks Free Edition",
    html: `<ul><li>La plataforma central de <b>procesamiento Big Data</b> del curso.</li><li>Reemplazó a la antigua Community Edition.</li>
    <li>Arquitectura <b>serverless</b> con cuotas limitadas, ideal para estudiantes.</li><li>Explorar datos, pipelines con <b>Lakeflow</b>, tableros y prototipos de IA, sin costo.</li></ul><p class="fuente">Databricks Free Edition docs</p>`,
    mas: `<p>Aquí viven las capas bronce, plata y oro de los laboratorios.</p>` },
  { seccion: "herramientas", escena: "herramientas", foco: "github", cam: [4.35, 11, -3], mira: [9.57, 9, -13.8],
    ojo: "Herramientas del curso", t: "GitHub",
    html: `<ul><li>Plataforma en la nube basada en <b>Git</b>, software libre.</li><li>Cubre todo el ciclo: planificar, crear, revisar, probar, desplegar y operar.</li>
    <li><b>Repositorios</b> con el historial de cambios.</li><li>Colaboración con <b>pull requests</b>.</li></ul><p class="fuente">GitHub Docs, What is GitHub?</p>`,
    mas: `<p>En el curso: cada estudiante entrega sus laboratorios en su propio repositorio.</p>` },
  { seccion: "herramientas", escena: "herramientas", foco: "hf", cam: [7.8, 11, -0.2], mira: [17.2, 9, -7.7],
    ojo: "Herramientas del curso", t: "Hugging Face Hub",
    html: `<ul><li>La plataforma abierta de referencia de la comunidad de IA.</li><li>Repositorios de <b>modelos</b>, <b>datasets</b> y aplicaciones (<b>Spaces</b>).</li>
    <li>Almacenamiento de archivos grandes.</li><li>Modelos que se consumen con <b>llamadas programáticas</b>.</li></ul><p class="fuente">Hugging Face Hub docs</p>`,
    mas: `<p>En el curso: el dataset de tweets y, en la semana 3, los modelos preentrenados.</p>` },
  { seccion: "herramientas", escena: "herramientas", foco: "tokens", cam: [6, 7, 22], mira: [0, 3, 10],
    ojo: "Seguridad", t: "Tokens y secretos",
    html: `<ul><li>Un token es una <b>clave privada</b> que autentica a un usuario o script ante un recurso protegido.</li>
    <li><b>Regla de oro:</b> nunca se escriben en el código (<i>hardcoding</i>) ni se suben a repositorios.</li><li>Una clave expuesta abre la puerta a accesos no autorizados y robo de información.</li>
    <li>Se guardan en <b>variables de entorno</b> o gestores de secretos, como los secretos de Colab.</li></ul><p class="fuente">GitHub Docs; Densmore (2021), cap. 2</p>`,
    mas: `<p>En el Laboratorio 1 los tokens de Databricks se guardan como secretos de Colab y se leen con <code>userdata.get(...)</code>.</p>` },
  { seccion: "herramientas", escena: "herramientas", foco: "json", cam: [0, 9, 22], mira: [0, 4, 4],
    ojo: "Formatos de datos", t: "JSON",
    html: `<ul><li>Formato <b>semiestructurado</b>: pares clave-valor y objetos anidados.</li><li>Muy <b>legible</b> para las personas.</li>
    <li>El formato estándar de las <b>REST APIs</b> y de los logs de aplicaciones.</li><li>Se organiza <b>por registro</b>: cada documento trae todos sus campos.</li></ul><p class="fuente">Densmore (2021), cap. 2</p>`,
    mas: `<p>Cada columna de cubos es un registro; cada color, un campo.</p>` },
  { seccion: "herramientas", escena: "herramientas", foco: "parquet", cam: [0, 9, 22], mira: [0, 4, 4],
    ojo: "Formatos de datos", t: "Parquet",
    html: `<ul><li>Almacenamiento en disco <b>orientado a columnas</b>.</li><li>Optimizado para grandes volúmenes en entornos analíticos.</li>
    <li><b>Comprime</b> la información de forma eficiente.</li><li>Los motores leen <b>solo las columnas necesarias</b>: consultas mucho más rápidas.</li></ul><p class="fuente">Densmore (2021), cap. 2; Databricks Free Edition docs</p>`,
    mas: `<p>Los mismos datos que en JSON, reorganizados: ahora cada color, cada campo, queda junto.</p>` },

  // ---- ¿Qué es un pipeline de datos?
  { seccion: "pipeline", escena: "iceberg", cam: [34, 22, 46], mira: [0, 4, 0], etapa: -1,
    ojo: "Fundamentos · El pipeline de datos", t: "¿Qué es un pipeline de datos?",
    html: `<p>Un pipeline es un <b>conjunto de procesos que mueven y transforman datos</b> desde diversas fuentes hacia un destino donde se puede extraer nuevo valor de ellos.</p>
    <p>Sin esa maquinaria, los datos se quedan aislados, sin contexto y sin utilidad para tomar decisiones.</p><p class="fuente">Densmore (2021), cap. 1</p>`,
    mas: `<p>Detrás de cada tablero que impresiona a la gerencia y de cada modelo que anticipa el comportamiento de un usuario hay una maquinaria invisible pero fundamental: el pipeline de datos.</p>` },
  { seccion: "pipeline", escena: "iceberg", marca: "punta", cam: [10, 15, 26], mira: [0, 11, 0], etapa: 5,
    ojo: "El iceberg analítico", t: "Lo que todos ven",
    html: `<p>La mayoría de las personas en una empresa solo ven la punta que sobresale del agua:</p>
    <ul><li><b>Tableros de BI</b>: métricas e informes para decidir.</li><li><b>Aplicaciones con LLM</b>: herramientas de IA generativa.</li><li><b>Modelos predictivos</b>: proyectan tendencias futuras.</li></ul>`,
    mas: `<p>Densmore (2021, cap. 1) usa la imagen del iceberg: tableros interactivos, gráficos y predicciones automáticas son solo la parte visible del trabajo con datos.</p>` },
  { seccion: "pipeline", escena: "iceberg", cam: [42, 0.6, 30], mira: [0, -14, 0], etapa: -1,
    ojo: "El iceberg analítico", t: "Lo que no se ve",
    html: `<p>Bajo el agua está la <b>masa sumergida</b>: por cada tablero o modelo en producción hay pipelines trabajando en silencio para</p>
    <ul><li>extraer datos de muchos sistemas,</li><li>limpiarlos y estructurarlos,</li><li>combinarlos y protegerlos.</li></ul><p>Cada etapa del recorrido agrega un poco más de orden y calidad.</p>`,
    mas: `<p>Vamos a bajar al fondo y subir por el pipeline, etapa por etapa, hasta volver a la superficie.</p>` },
  { seccion: "pipeline", escena: "iceberg", marca: "origen", cam: [20, -44, 34], mira: [0, -50, 6], etapa: 0,
    ojo: "Etapa 1 de 6", t: "Origen",
    html: `<p>Los datos viven en lugares muy distintos: <b>APIs web</b>, <b>bases de datos</b> o <b>archivos</b> guardados en la nube.</p><p>En este curso, el origen es la API de datasets de Hugging Face: tweets en español etiquetados por sentimiento.</p>`,
    mas: `<p>Cada fuente tiene su propia interfaz, estructura, volumen y nivel de limpieza. Lo veremos en detalle en «Fuentes de datos».</p>` },
  { seccion: "pipeline", escena: "iceberg", cam: [26, -34, 30], mira: [2, -38, 6], etapa: 1,
    ojo: "Etapa 2 de 6", t: "Ingesta",
    html: `<p>El pipeline <b>se conecta a las fuentes</b> y traslada la información cruda a un repositorio central.</p><p>En el Laboratorio 1 lo hacen desde Colab: piden los tweets a la API página por página y los suben a Databricks.</p>`,
    mas: `<p>Las partículas grises del tubo son registros con problemas: duplicados, nulos o formatos rotos. Por ahora viajan junto a los buenos.</p>` },
  { seccion: "pipeline", escena: "iceberg", cam: [-26, -22, 30], mira: [-4, -26, 6], etapa: 2,
    ojo: "Etapa 3 de 6", t: "Almacenamiento",
    html: `<p>Los datos se guardan primero <b>tal como llegaron</b>, sin cambios.</p><p>Así queda un historial que permite auditar o volver a procesar si algo sale mal.</p>`,
    mas: `<p>En Databricks esta es la <b>capa bronce</b> de la arquitectura medallion: la tabla <code>bronze_tweets</code> del Laboratorio 1.</p>` },
  { seccion: "pipeline", escena: "iceberg", cam: [26, -12, 28], mira: [4, -14, 6], etapa: 3,
    ojo: "Etapa 4 de 6", t: "Limpieza",
    html: `<p>El pipeline revisa los registros:</p><ul><li>elimina <b>duplicados</b>,</li><li>maneja <b>valores nulos</b>,</li><li>corrige <b>formatos inconsistentes</b>,</li><li>aplica <b>reglas de validación</b>.</li></ul><p>Mira el anillo: las partículas grises no pasan.</p>`,
    mas: `<p>Corresponde a la <b>capa plata</b>. En la Clase 3 la construirán con SQL: deduplicación con <code>ROW_NUMBER()</code> y limpieza del texto, conservando siempre el dato original.</p>` },
  { seccion: "pipeline", escena: "iceberg", cam: [-24, -1, 26], mira: [-3, -3, 4], etapa: 4,
    ojo: "Etapa 5 de 6", t: "Modelado",
    html: `<p>Los datos limpios <b>se combinan y se adaptan</b> a lo que necesita el negocio o el modelo de inteligencia artificial.</p>`,
    mas: `<p>Es la <b>capa oro</b>: en el curso, el dataset limpio y etiquetado con el que entrenarán un clasificador de sentimiento.</p>` },
  { seccion: "pipeline", escena: "iceberg", marca: "consumo", cam: [14, 16, 24], mira: [0, 11, 0], etapa: 5,
    ojo: "Etapa 6 de 6", t: "Consumo",
    html: `<p>El resultado <b>alimenta los tableros de control y los modelos de machine learning</b>.</p><p>Volvimos a la superficie: la punta del iceberg solo existe porque todo lo de abajo funciona.</p>`,
    mas: `<p>Estas etapas se organizan en capas llamadas bronce, plata y oro (Databricks, arquitectura medallion). Lo veremos en la sección de almacenamiento.</p>` },
  { seccion: "pipeline", escena: "iceberg", marca: "basura", cam: [18, 9, 30], mira: [0, 4, 0], etapa: -1,
    ojo: "Por qué la IA depende del pipeline", t: "Basura entra, basura sale",
    html: `<p>Si el pipeline deja pasar información defectuosa, <b>los tableros muestran indicadores falsos</b> y los modelos aprenden patrones que no existen.</p>
    <p>Apagamos el filtro de limpieza: mira cómo llegan los datos grises a la superficie.</p>
    <p>Cuando el trabajo se hace a mano aparecen tres riesgos:</p><ul><li>datos desactualizados,</li><li>varias versiones contradictorias de la verdad,</li><li>talento analítico desperdiciado en tareas repetitivas.</li></ul>`,
    mas: `<p>«Garbage in, garbage out» (Densmore, 2021, cap. 2). Como señala Curry (2025), los proyectos de analítica e IA no suelen fallar por falta de talento técnico, sino por las brechas en los traspasos de trabajo entre roles.</p>` },
  { seccion: "pipeline", escena: "iceberg", cam: [-30, 6, 40], mira: [0, -6, 0], etapa: -1,
    ojo: "Ejemplo", t: "La cocina de un restaurante",
    html: `<ul><li><b>Ingredientes</b> (datos crudos) llegan de distintos <b>proveedores</b> (fuentes) y se guardan en la bodega.</li>
    <li>Nadie cocina verduras con tierra: en la <b>estación de preparación</b> se lavan, se pelan y se descartan las dañadas.</li>
    <li>Los chefs <b>combinan</b> los insumos limpios en porciones exactas para cada receta.</li>
    <li>El pipeline es toda esa cadena: que los ingredientes lleguen impecables, a tiempo y en la cantidad precisa al plato.</li></ul>`,
    mas: `<p>El comensal solo ve el plato, igual que la gerencia solo ve el tablero: la punta del iceberg.</p>` },
  { seccion: "pipeline", escena: "iceberg", cam: [70, 10, 70], mira: [0, -18, 0], etapa: -1,
    ojo: "Lo que construirán", t: "Su propio pipeline",
    html: `<ul><li><b>Extracción</b>: Colab pide los tweets a la API de Hugging Face.</li><li><b>Carga</b>: los datos crudos llegan a un Volume de Databricks, la capa bronce.</li>
    <li><b>Limpieza</b>: con SQL quitan duplicados, nulos y ruido; queda la capa plata.</li><li><b>Dataset final</b>: la capa oro, lista para entrenar un clasificador.</li><li><b>Automatización</b>: Lakeflow Jobs ejecuta todo en orden.</li></ul>`,
    mas: `<p>En el proyecto final repetirán este patrón con titulares de noticias obtenidos por lotes desde la API de GDELT.</p>` },

  // ---- Infraestructura moderna
  { seccion: "infraestructura", escena: "agua", cam: [0, 30, 62], mira: [0, 4, 0],
    ojo: "Infraestructura moderna de datos", t: "Un ecosistema conectado",
    html: `<ul><li>Componentes, servicios en la nube y herramientas <b>conectados entre sí</b>.</li><li>Recolectan, almacenan, procesan y entregan información confiable a toda la organización.</li>
    <li>Antes: servidores físicos y centros de cómputo costosos.</li><li>Hoy: la <b>nube</b> ofrece servicios administrados y almacenamiento <b>elástico</b>.</li></ul><p class="fuente">Densmore (2021), cap. 2</p>`,
    mas: `<p>Para entenderla, pensemos en el sistema de agua potable de una ciudad: cada pieza tiene su equivalente en datos.</p>` },
  { seccion: "infraestructura", escena: "agua", foco: "fuentes", cam: [-30, 12, 22], mira: [-38, 6, 0],
    ojo: "Infraestructura · Manantiales", t: "Fuentes de datos",
    html: `<ul><li>La información nunca viene de un solo lugar.</li><li>Bases de datos operacionales, archivos en servidores, mensajería en tiempo real y APIs de terceros.</li>
    <li>Estructuras distintas: desde <b>tablas</b> hasta <b>JSON</b> o <b>texto libre</b>.</li><li><b>En el curso:</b> la API de Hugging Face. En el proyecto: la API de GDELT.</li></ul>`,
    mas: `<p>El agua nace en ríos y manantiales de la montaña, igual que los datos nacen en los sistemas de origen.</p>` },
  { seccion: "infraestructura", escena: "agua", foco: "ingesta", cam: [-12, 10, 18], mira: [-20, 3, 0],
    ojo: "Infraestructura · Bombeo", t: "Herramientas de ingesta",
    html: `<ul><li>Su único trabajo: <b>conectarse al origen</b> y depositar los datos de forma segura en el almacenamiento central.</li>
    <li><b>En el curso:</b> Google Colab. Desde un notebook se ejecuta la extracción y se envían los datos a Databricks.</li></ul>`,
    mas: `<p>Las estaciones de bombeo capturan el agua y la llevan a los tanques.</p>` },
  { seccion: "infraestructura", escena: "agua", foco: "almacenamiento", cam: [8, 13, 22], mira: [0, 5, 0],
    ojo: "Infraestructura · Tanques", t: "Almacenamiento centralizado",
    html: `<ul><li>Recibe y organiza <b>grandes volúmenes</b>.</li><li><b>Data warehouse:</b> estructurado y optimizado para consultas.</li>
    <li><b>Data lake:</b> más económico, guarda los archivos en su formato original.</li><li><b>Lakehouse:</b> combina ambos, con capas bronce, plata y oro.</li>
    <li><b>En el curso:</b> Databricks. Los tweets crudos llegan a Volumes y empiezan su recorrido por las capas.</li></ul>`,
    mas: `<p>Lo estudiamos a fondo en la sección de almacenamiento.</p>` },
  { seccion: "infraestructura", escena: "agua", foco: "transformacion", cam: [26, 11, 20], mira: [18, 3.5, 0],
    ojo: "Infraestructura · Planta de tratamiento", t: "Transformación y modelado",
    html: `<ul><li>Guardar el agua no basta: <b>hay que tratarla</b>.</li><li>Aplica reglas de negocio y construye modelos de datos limpios sobre las tablas.</li>
    <li><b>En el curso:</b> SQL en Databricks para quitar duplicados, nulos y ruido, y preparar el dataset etiquetado.</li><li>En las empresas lo reparten el Data Engineer y el Analytics Engineer.</li></ul><p class="fuente">Curry (2025)</p>`,
    mas: `<p>El dataset limpio servirá para entrenar el modelo de clasificación en Colab.</p>` },
  { seccion: "infraestructura", escena: "agua", foco: "orquestacion", cam: [12, 22, 12], mira: [0, 10, -18],
    ojo: "Infraestructura · Centro de control", t: "Orquestación de flujos",
    html: `<ul><li>Con muchas fuentes y modelos, ejecutar todo <b>a mano</b> es imposible sin fallas.</li><li>El orquestador programa, monitorea y respeta las <b>dependencias</b> entre tareas.</li>
    <li>Las organiza en grafos dirigidos acíclicos: <b>DAG</b>.</li><li>No abre la válvula de distribución antes de tratar el agua: no limpia antes de cargar.</li>
    <li>Las tareas independientes corren <b>al mismo tiempo</b>.</li><li><b>En el curso:</b> Lakeflow Jobs en Databricks.</li></ul><p class="fuente">Densmore (2021), cap. 2</p>`,
    mas: `<p>Lakeflow Jobs coordinará el paso de bronce a plata y de plata a oro.</p>` },
  { seccion: "infraestructura", escena: "agua", foco: "consumo", cam: [0, 30, 62], mira: [0, 4, 0],
    ojo: "Infraestructura moderna de datos", t: "En resumen",
    html: `<ul><li>No es comprar herramientas sueltas: es diseñar un ecosistema <b>conectado, elástico y automatizado</b>.</li>
    <li>Cada pieza depende de la anterior: manantiales, bombeo, tanques, planta y centro de control.</li><li>Juntas convierten los datos crudos en el insumo confiable que necesitan la analítica y la IA.</li></ul>`,
    mas: `<p>Cuando falta una pieza, el agua se estanca en el origen o se contamina en el camino.</p>` },

  // ---- Fuentes de datos
  { seccion: "fuentes", escena: "fuentes", foco: "interfaces", cam: [0, 34, 58], mira: [0, 5, -6],
    ojo: "Fuentes de datos", t: "Interfaces de ingesta",
    html: `<p>La primera gran etapa: extraer de <b>fuentes heterogéneas</b>. El origen puede ser:</p>
    <ul><li>Bases de datos de aplicaciones (MySQL, PostgreSQL).</li><li>Capas de abstracción como las <b>REST APIs</b>.</li><li>Plataformas de <b>streaming</b> (Apache Kafka).</li>
    <li>Archivos compartidos o contenedores en la nube con logs o archivos planos.</li><li>Warehouses o lakes construidos internamente.</li></ul><p class="fuente">Densmore (2021), cap. 2</p>`,
    mas: `<p>Cada portal trae datos con una forma distinta: es lo que veremos a continuación.</p>` },
  { seccion: "fuentes", escena: "fuentes", foco: "estructurado", cam: [0, 30, 52], mira: [0, 5, -6],
    ojo: "Estructura de los datos", t: "Estructurados",
    html: `<ul><li>Esquema <b>rígido y predefinido</b>.</li><li>Organizados en <b>tablas</b> de filas y columnas.</li><li>Ejemplo: tablas relacionales en SQL.</li></ul><p>Son los cubos que llegan de las bases de datos.</p>`,
    mas: `<p>Densmore (2021, cap. 2).</p>` },
  { seccion: "fuentes", escena: "fuentes", foco: "semi", cam: [0, 30, 52], mira: [0, 5, -6],
    ojo: "Estructura de los datos", t: "Semiestructurados",
    html: `<ul><li>Etiquetas o pares <b>clave-valor</b> organizan el contenido.</li><li>Sin la rigidez de un esquema fijo: cada registro puede tener campos distintos.</li><li>Ejemplos: <b>JSON</b> de una API, archivos XML.</li></ul>`,
    mas: `<p>Los tweets del curso llegan así desde la API de Hugging Face (Densmore, 2021, cap. 2).</p>` },
  { seccion: "fuentes", escena: "fuentes", foco: "no", cam: [0, 30, 52], mira: [0, 5, -6],
    ojo: "Estructura de los datos", t: "No estructurados",
    html: `<ul><li>Sin estructura interna predefinida.</li><li>El insumo principal del <b>deep learning</b>.</li><li>Ejemplos: <b>texto libre</b>, imágenes, audio y video.</li></ul>`,
    mas: `<p>El texto de cada tweet es un dato no estructurado: por eso, en la semana 3, lo procesamos con modelos de lenguaje (Densmore, 2021, cap. 2).</p>` },
  { seccion: "fuentes", escena: "fuentes", foco: "volumen", cam: [0, 34, 58], mira: [0, 5, -6],
    ojo: "Fuentes de datos", t: "Volumen",
    html: `<ul><li>El volumen es un <b>espectro continuo</b>, no "muchos o pocos" datos.</li><li>Más volumen <b>no implica</b> más valor de negocio.</li>
    <li>Pero los volúmenes altos exigen decisiones de arquitectura cuidadosas para no ejecutar de forma ineficiente.</li></ul><p class="fuente">Densmore (2021), cap. 2</p>`,
    mas: `<p>Mira el flujo: triplicamos el ritmo de llegada.</p>` },
  { seccion: "fuentes", escena: "fuentes", foco: "sucios", cam: [0, 30, 52], mira: [0, 5, -6],
    ojo: "Fuentes de datos", t: "Limpieza y validez",
    html: `<p><b>Basura entra, basura sale.</b> Los datos reales nunca son perfectos. Un pipeline debe anticipar:</p>
    <ul><li>registros duplicados o ambiguos, y registros huérfanos,</li><li>campos incompletos o nulos,</li><li>errores de codificación de texto,</li><li>formatos inconsistentes y etiquetas erróneas.</li></ul>
    <p>El Data Engineer asume el <b>peor escenario</b> y valida a lo largo del recorrido.</p>`,
    mas: `<p>Densmore (2021, cap. 2). Los objetos grises que tiemblan son los datos sucios.</p>` },

  // ---- Almacenamiento y medallion
  { seccion: "almacenamiento", escena: "medallion", foco: "paradigmas", cam: [-20, 16, 30], mira: [-20, 4, -2],
    ojo: "Paradigmas de almacenamiento", t: "¿Dónde se guardan los datos?",
    html: `<p>Una vez extraídos, ¿dónde se depositan y cómo se organizan?</p><ul><li>Dos repositorios tradicionales: <b>warehouse</b> y <b>lake</b>.</li><li>Uno moderno que los combina: el <b>lakehouse</b>.</li><li>Y una arquitectura por capas: <b>medallion</b>.</li></ul>`,
    mas: `<p>Densmore (2021, cap. 2); Databricks, arquitectura medallion.</p>` },
  { seccion: "almacenamiento", escena: "medallion", foco: "warehouse", cam: [-28, 10, 14], mira: [-34, 4, -6],
    ojo: "Paradigmas de almacenamiento", t: "Data Warehouse",
    html: `<ul><li>Base de datos <b>centralizada</b>.</li><li>Los datos de distintos sistemas se modelan para <b>análisis y reportes</b>.</li>
    <li>Información muy estructurada, limpia y optimizada.</li><li>Responde preguntas de negocio <b>rápido</b>.</li></ul><p class="fuente">Densmore (2021), cap. 2</p>`,
    mas: `<p>Como un almacén con estantes: todo ordenado, pero solo cabe lo que tiene forma de caja.</p>` },
  { seccion: "almacenamiento", escena: "medallion", foco: "lake", cam: [-14, 10, 18], mira: [-20, 1, 4],
    ojo: "Paradigmas de almacenamiento", t: "Data Lake",
    html: `<ul><li>Depósito <b>masivo</b>: los datos se guardan en su <b>forma original</b>.</li><li>Sin la estructura rígida ni la optimización de consulta del warehouse.</li>
    <li>Texto plano, JSON, imágenes, archivos comprimidos y extractos relacionales.</li><li>A muy <b>bajo costo</b>.</li></ul><p class="fuente">Densmore (2021), cap. 2</p>`,
    mas: `<p>Como un lago: entra de todo, con cualquier forma.</p>` },
  { seccion: "almacenamiento", escena: "medallion", foco: "lakehouse", cam: [0, 10, 14], mira: [-6, 3, -6],
    ojo: "Paradigmas de almacenamiento", t: "Data Lakehouse",
    html: `<ul><li>La <b>convergencia</b> de ambos mundos.</li><li>Del lake: flexibilidad, escalabilidad y bajo costo.</li>
    <li>Del warehouse: transacciones confiables, gobernanza y consultas de alto rendimiento.</li><li>Databricks es un lakehouse.</li></ul><p class="fuente">Databricks, arquitectura medallion</p>`,
    mas: `<p>El lago, con estantes encima para lo que necesita orden.</p>` },
  { seccion: "almacenamiento", escena: "medallion", foco: "medallion", cam: [22, 16, 32], mira: [22, 4, 4],
    ojo: "Arquitectura medallion", t: "Tres capas, multi-salto",
    html: `<ul><li>Patrón de diseño de Databricks para organizar un lakehouse.</li><li>También se llama arquitectura <b>multi-salto</b> (<i>multi-hop</i>).</li>
    <li>Mejora la estructura y la <b>calidad</b> de los datos de forma incremental.</li><li>Los datos fluyen por tres capas sucesivas: <b>bronce, plata y oro</b>.</li></ul>`,
    mas: `<p>Databricks, arquitectura medallion.</p>` },
  { seccion: "almacenamiento", escena: "medallion", foco: "bronce", cam: [15, 9, 18], mira: [10, 4, 4],
    ojo: "Arquitectura medallion", t: "Capa bronce",
    html: `<ul><li>Punto de entrada de los <b>datos crudos</b>.</li><li>Preserva el estado original, sin limpiezas ni validaciones complejas.</li>
    <li>Crece con inserciones <b>incrementales</b>.</li><li>Fuente única de verdad <b>inmutable</b>: permite auditar o reprocesar si cambian las reglas.</li><li><b>Usuarios:</b> ingenieros de datos y operaciones.</li></ul>`,
    mas: `<p>En el curso: la tabla <code>bronze_tweets</code> del Laboratorio 1.</p>` },
  { seccion: "almacenamiento", escena: "medallion", foco: "plata", cam: [27, 9, 18], mira: [22, 4, 4],
    ojo: "Arquitectura medallion", t: "Capa plata",
    html: `<ul><li>Limpieza, filtrado, <b>deduplicación</b>, conformación y normalización.</li><li>Corrige registros corruptos, gestiona nulos y valida esquemas.</li>
    <li>Datos validados y enriquecidos, todavía sin agregar.</li><li><b>Usuarios:</b> analistas y científicos de datos que exploran sin tropezar con inconsistencias.</li></ul>`,
    mas: `<p>En el curso: la Clase 3.</p>` },
  { seccion: "almacenamiento", escena: "medallion", foco: "oro", cam: [39, 9, 18], mira: [34, 4, 4],
    ojo: "Arquitectura medallion", t: "Capa oro",
    html: `<ul><li>Datos <b>refinados, modelados y agregados</b> para necesidades de negocio.</li><li>Esquemas dimensionales, agregaciones temporales y métricas clave.</li>
    <li>Alimenta tableros, reportes ejecutivos y <b>modelos de IA</b> en producción.</li><li><b>Usuarios:</b> ejecutivos, analistas de negocio y desarrolladores de BI.</li></ul>`,
    mas: `<p>En el curso: el dataset con el que entrenarán el clasificador.</p>` },

  // ---- DAG
  { seccion: "dag", escena: "dag", cam: [2, 24, 42], mira: [2, 5, 0],
    ojo: "Orquestación", t: "¿Quién decide el orden?",
    html: `<p>Decenas de tareas: extraer de MySQL, consumir una API, limpiar JSON en plata, agregar en oro.</p>
    <p>¿Cómo garantizamos que la transformación <b>no empiece antes</b> de que termine la extracción?</p>`,
    mas: `<p>Densmore (2021, cap. 2).</p>` },
  { seccion: "dag", escena: "dag", foco: "orquestacion", cam: [2, 24, 42], mira: [2, 5, 0],
    ojo: "Orquestación", t: "Orquestar flujos de trabajo",
    html: `<ul><li><b>Programa, coordina y monitorea</b> la ejecución ordenada de todas las tareas.</li><li>Respeta las <b>dependencias</b> entre ellas.</li>
    <li>Las tareas que no dependen entre sí corren <b>en paralelo</b>: mira cómo arrancan juntas las dos extracciones.</li></ul><p class="fuente">Densmore (2021), cap. 2</p>`,
    mas: `<p>Cada destello verde es una tarea ejecutándose; las del mismo nivel se encienden a la vez.</p>` },
  { seccion: "dag", escena: "dag", foco: "dirigido", cam: [-6, 16, 30], mira: [-4, 5, 0],
    ojo: "Grafo acíclico dirigido (DAG)", t: "Dirigido",
    html: `<ul><li>Un DAG representa las tareas y sus <b>dependencias</b>.</li><li><b>Dirigido:</b> el flujo tiene un sentido claro.</li>
    <li>Cada tarea apunta a las que dependen de ella.</li><li>Un paso no empieza hasta que <b>terminan con éxito</b> los anteriores.</li></ul>`,
    mas: `<p>Densmore (2021, cap. 2).</p>` },
  { seccion: "dag", escena: "dag", foco: "aciclico", cam: [-2, 22, 34], mira: [-2, 9, 0],
    ojo: "Grafo acíclico dirigido (DAG)", t: "Acíclico",
    html: `<ul><li>El flujo <b>no tiene bucles</b>.</li><li>Una tarea completada nunca apunta de regreso a una anterior en la misma ejecución.</li>
    <li>Con un ciclo, la ejecución quedaría atrapada en un <b>bucle eterno</b> y el pipeline nunca terminaría.</li></ul>`,
    mas: `<p>La flecha que parpadea, de oro de vuelta a la extracción, es justo lo que un DAG no permite (Densmore, 2021, cap. 2).</p>` },
  { seccion: "dag", escena: "dag", foco: "lakeflow", cam: [2, 26, 46], mira: [2, 5, 0],
    ojo: "Orquestación en el curso", t: "Estructura, no lógica: Lakeflow Jobs",
    html: `<ul><li>El DAG describe <b>dependencias y orden</b>, no el código de cada tarea.</li><li>Cada tarea puede ser un script de Python, una consulta SQL o una ejecución en la nube.</li>
    <li><b>En el curso:</b> Lakeflow Jobs define, programa y orquesta las tareas en Databricks de forma visual.</li></ul><p class="fuente">Densmore (2021), cap. 2; Databricks Free Edition docs</p>`,
    mas: `<p>Lo usaremos en la Clase 7 para automatizar el paso de bronce a plata y de plata a oro.</p>` },

  // ---- Resumen
  { seccion: "resumen", escena: "historia", reparado: true, cam: [22, 18, 48], mira: [6, 6, 0],
    ojo: "Resumen", t: "Volvamos a la empresa",
    html: `<p>Ahora sabemos qué salió mal:</p><ul><li>no había pipelines orquestados con <b>DAGs</b>,</li><li>los datos se mezclaban sin pasar por <b>bronce, plata y oro</b>,</li>
    <li>las <b>credenciales</b> estaban expuestas,</li><li>nadie sabía qué <b>rol</b> respondía por la calidad.</li></ul>
    <p>Con roles claros, pipelines sólidos y orquestación, el pipeline se cierra y los datos llegan confiables.</p>`,
    mas: `<p>Curry (2025).</p>` },
  { seccion: "resumen", escena: "historia", reparado: true, cam: [0, 30, 64], mira: [0, 6, 0],
    ojo: "Resumen", t: "Puntos clave",
    html: `<ul><li>El éxito en datos e IA depende de <b>eliminar las brechas</b> en los traspasos.</li><li>Herramientas modernas y <b>secretos protegidos</b>.</li>
    <li>Los pipelines son la <b>masa sumergida</b> del iceberg.</li><li>Las fuentes varían en interfaz, volumen y estructura: hay que prever los <b>datos sucios</b>.</li>
    <li>El lakehouse ordena los datos en <b>bronce, plata y oro</b>.</li><li>Los <b>DAGs</b> orquestan dependencias sin bucles infinitos.</li></ul>`,
    mas: `<p>Curry (2025); Densmore (2021, caps. 1 y 2); Databricks, arquitectura medallion.</p>` },
  { seccion: "resumen", escena: "historia", reparado: true, cam: [0, 30, 64], mira: [0, 6, 0],
    ojo: "Fuentes", t: "Para profundizar",
    html: `<ul><li><b>Curry (2025).</b> <i>The Modern Data & AI Organization</i>: roles y traspasos.</li><li><b>Densmore (2021).</b> <i>Data Pipelines Pocket Reference</i>, caps. 1 y 2: pipelines, infraestructura, fuentes, almacenamiento y DAG.</li>
    <li><b>Databricks.</b> Arquitectura medallion y Free Edition.</li><li><b>Documentación oficial:</b> Google Colab FAQ, GitHub Docs y Hugging Face Hub docs.</li></ul>`,
    mas: `<p>La guía del curso tiene el mapeo completo de cada concepto con su capítulo o sección.</p>` },

  // ---- Laboratorio
  { seccion: "laboratorio", escena: "curso", cam: [-84, 12, 34], mira: [-70, 6, 10], resaltada: 1,
    ojo: "Laboratorio C1L1", t: "Cuentas y acceso",
    html: `<span class="cta">Laboratorio 1 · Parte 1</span>
    <ul><li><b>GitHub:</b> crear el repositorio desde la plantilla del curso y poner su nombre en el README.</li><li><b>Colab:</b> abrir el notebook desde GitHub y guardarlo de vuelta con sus salidas.</li>
    <li><b>Databricks Free Edition:</b> cuenta, esquema <code>dlbd</code>, volumen <code>raw</code> y token guardado como secreto.</li><li><b>Hugging Face:</b> verificar que la API pública responde. No necesita cuenta.</li></ul>
    <p>Se empieza en clase y se termina de tarea. El resto del Laboratorio 1 se trabaja en la Clase 2.</p>`,
    mas: `<p>Los pasos detallados están en el README de la plantilla («Primeros pasos») y en el notebook <code>lab1/parte1_verificacion.ipynb</code>.</p>` },

  // ---- Cierre
  { seccion: "cierre", escena: "curso", cam: [20, 30, -80], mira: [0, 0, 0], resaltada: 1,
    ojo: "Debate y reflexión", t: "Antes de irnos",
    html: `<ul><li>¿Qué parte del iceberg les resultó más nueva?</li><li>¿Qué rol de Data & AI se parece más a lo que hacen hoy?</li><li>¿Qué dudas quedan sobre las herramientas o las cuentas?</li></ul>
    <p><b>Próxima clase:</b> Extracción y carga. Empieza con un Kahoot de repaso de la Clase 1.</p>`,
    mas: `<p>Para la próxima clase: terminar la Parte 1 del Laboratorio 1 (cuentas y acceso).</p>` }
];

export default {
  n: 1,
  agenda,
  pasos,
  crearEscenas({ etiquetas }) {
    return {
      iceberg: crearIceberg(etiquetas), historia: crearHistoria(etiquetas), roles: crearRoles(etiquetas),
      herramientas: crearHerramientas(etiquetas), agua: crearAgua(etiquetas), fuentes: crearFuentes(etiquetas),
      medallion: crearMedallion(etiquetas), dag: crearDag(etiquetas)
    };
  }
};
