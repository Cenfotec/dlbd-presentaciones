import { crearIceberg } from "./iceberg.js";

// Agenda de la Clase 1, en el orden de la guía docente («Mi plan»).
// Las secciones con `pendiente: true` todavía no tienen diapositivas.
const agenda = [
  { id: "bienvenida", nombre: "Bienvenida y presentación de los estudiantes" },
  { id: "programa", nombre: "Programa del curso" },
  { id: "evaluacion", nombre: "Evaluación del curso" },
  { id: "roles", nombre: "Mapa de roles de Data & AI", pendiente: true },
  { id: "herramientas", nombre: "Herramientas del curso y formatos de datos", pendiente: true },
  { id: "pipeline", nombre: "¿Qué es un pipeline de datos?" },
  { id: "infraestructura", nombre: "La infraestructura moderna de datos", pendiente: true },
  { id: "fuentes", nombre: "Fuentes de datos", pendiente: true },
  { id: "almacenamiento", nombre: "Warehouse, lake, lakehouse y medallion", pendiente: true },
  { id: "dag", nombre: "Orquestación y DAG", pendiente: true },
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
    return { iceberg: crearIceberg(etiquetas) };
  }
};
