import { crearRuta, crearValeria, crearPatrones, crearBiblioteca, crearCicloML, crearApi, crearVolume } from "./escenas.js";

// Agenda de la Clase 2: la de «Mi plan», en el orden del marco teórico.
const agenda = [
  { id: "apertura", nombre: "Kahoot de repaso y proyecto final" },
  { id: "introduccion", nombre: "Introducción: la ingesta de Valeria" },
  { id: "etl", nombre: "ETL y ELT" },
  { id: "etlt", nombre: "EtLT: la «t» minúscula" },
  { id: "ml", nombre: "Pipelines para machine learning" },
  { id: "api", nombre: "Extracción desde una API REST" },
  { id: "lab1", nombre: "Laboratorio C2L1: extracción y carga" },
  { id: "lake", nombre: "Data lake y Volumes de Databricks" },
  { id: "lab2", nombre: "Laboratorio C2L2: capa bronce" },
  { id: "resumen", nombre: "Resumen y conclusiones" },
  { id: "cierre", nombre: "Cierre y entrega del Laboratorio 1" }
];
const listaAgenda = () => `<ol class="agenda">${agenda.map((a) => `<li><span>${a.nombre}</span></li>`).join("")}</ol>`;

const RUTA = { escena: "ruta", cam: [0, 30, 66], mira: [0, 3, 0] };
const CICLO = { escena: "ml", cam: [0, 40, 44], mira: [0, 2, -2] };
const API = { escena: "api", cam: [0, 22, 52], mira: [0, 5, 2] };

const pasos = [
  // ---- Apertura
  { seccion: "apertura", ...RUTA, tramos: [0, 1, 2],
    ojo: "Clase 2 · Semana 1", t: "Extracción y carga",
    html: `<p>Hoy construimos los primeros tramos del pipeline: sacar los tweets de la API y llevarlos a la capa bronce.</p>${listaAgenda()}`,
    mas: `<p>En verde, los tres tramos de hoy: extraer, cargar y registrar en bronce.</p>` },
  { seccion: "apertura", ...RUTA, cam: [-24, 18, 40], mira: [-14, 4, 0],
    ojo: "Kahoot", t: "Repaso de la Clase 1",
    html: `<span class="cta">Kahoot · 1 de 7</span><p>Entren a <b>kahoot.it</b> con el código que comparto en pantalla.</p>
    <ul><li>Roles de Data & AI.</li><li>Pipeline, infraestructura y fuentes.</li><li>Warehouse, lake, lakehouse y medallion.</li><li>DAG y orquestación.</li></ul>`,
    mas: `<p>Los Kahoots valen 20 % de la nota: 7 quizzes, al inicio de cada clase de la C2 a la C8.</p>` },
  { seccion: "apertura", ...RUTA, foco: "proyecto", cam: [-6, 30, 58], mira: [-4, 3, -4],
    ojo: "Proyecto final", t: "Clasificar noticias en español",
    html: `<ul><li>Titulares de noticias en español desde la <b>API de GDELT</b>.</li><li>El mismo pipeline del curso: extraer, cargar, limpiar, modelar y clasificar.</li>
    <li>En grupos de <b>2 o más</b> personas.</li><li>Vale <b>30 %</b> y se presenta en la <b>Clase 8</b>.</li></ul><p>Vamos a la especificación del proyecto.</p>`,
    mas: `<p>La especificación, los entregables y los criterios de evaluación están en el documento del proyecto.</p>` },

  // ---- Introducción
  { seccion: "introduccion", escena: "valeria", cam: [-2, 14, 44], mira: [-2, 6, 0],
    ojo: "Introducción", t: "Una historia ficticia: Valeria",
    html: `<ul><li>Cada lunes exporta un archivo del sistema de ventas.</li><li>Lo limpia <b>a mano</b> en una hoja de cálculo y lo pega en el reporte.</li>
    <li>Un lunes se enferma: <b>nadie sabe repetir</b> el proceso.</li><li>Otro lunes el sistema <b>cambia el orden de las columnas</b>: las ventas quedan en la columna de descuentos.</li></ul>
    <p>Su problema no es de talento: la ingesta depende de una persona, un archivo suelto y mucha suerte.</p>`,
    mas: `<p>Mira las columnas de Ventas y Descuento: se intercambian y el reporte se pone en rojo. Nadie lo nota hasta que la gerencia pregunta por qué "se perdió" la mitad de los ingresos.</p>` },
  { seccion: "introduccion", ...RUTA, tramos: [0, 1],
    ojo: "Introducción", t: "La ingesta: extraer y cargar",
    html: `<ul><li>Hoy vemos los <b>dos primeros pasos</b> del pipeline.</li><li><b>Extraer:</b> sacar los datos de donde viven.</li>
    <li><b>Cargar:</b> llevarlos a donde los podemos trabajar.</li><li>Juntos se llaman <b>ingesta de datos</b>.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Densmore recomienda pensarlos como pasos separados, aunque muchas herramientas los empaquetan juntos.</p>` },
  { seccion: "introduccion", ...RUTA, tramos: [0, 1, 2], cam: [0, 40, 76],
    ojo: "Introducción", t: "Al final de esta clase podrán",
    html: `<ul><li>Explicar la diferencia entre <b>ETL y ELT</b>, y por qué hoy domina ELT.</li><li>Reconocer qué cabe en el patrón <b>EtLT</b>.</li>
    <li>Describir los pasos de un <b>pipeline para machine learning</b>.</li><li>Extraer de una <b>API REST</b>: petición, JSON, aplanado y almacenamiento.</li>
    <li>Justificar por qué las <b>credenciales</b> nunca van en el código.</li><li>Explicar qué es un <b>data lake</b> y cómo lo cumplen los Volumes.</li></ul>`,
    mas: `<p>Cada objetivo corresponde a una sección de la clase, en este mismo orden.</p>` },

  // ---- ETL y ELT
  { seccion: "etl", escena: "patrones", foco: "ambos", cam: [-8, 30, 46], mira: [-4, 2, 0],
    ojo: "ETL y ELT", t: "Los mismos tres pasos",
    html: `<ul><li><b>Extraer</b> (extract): reunir los datos desde sus fuentes.</li><li><b>Cargar</b> (load): llevarlos al warehouse o al data lake.</li>
    <li><b>Transformar</b> (transform): combinarlos y darles formato para analistas, tableros o modelos.</li><li>La diferencia está solo en el <b>orden</b> de los dos últimos.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Son tan conocidos que mucha gente usa estas siglas como sinónimo de pipeline, pero son patrones: formas probadas de ordenar el trabajo.</p>` },
  { seccion: "etl", escena: "patrones", foco: "etl", cam: [-6, 20, 22], mira: [-4, 2, -9],
    ojo: "ETL y ELT", t: "ETL: transformar antes de cargar",
    html: `<ul><li>Como una mudanza donde las cajas se abren en una <b>bodega intermedia</b>.</li><li>Ahí se ordena todo y se descarta lo que no sirve.</li>
    <li>Solo entonces llegan a la casa nueva.</li><li>Fue el estándar durante <b>décadas</b>.</li></ul>`,
    mas: `<p>Los warehouses de antes no tenían almacenamiento ni cómputo para cargar grandes volúmenes crudos y transformarlos ahí mismo. Por eso se transformaba en un sistema aparte (Densmore, 2021, cap. 3).</p>` },
  { seccion: "etl", escena: "patrones", foco: "elt", cam: [-6, 20, 40], mira: [-4, 2, 9],
    ojo: "ETL y ELT", t: "ELT: cargar primero, transformar adentro",
    html: `<ul><li>Las cajas llegan <b>cerradas</b> a la casa nueva.</li><li>Se ordenan ahí, con todo el espacio y las herramientas de la casa.</li>
    <li>Si mañana cambian las reglas, <b>todavía tenemos las cajas originales</b>.</li><li>Hoy es el patrón dominante.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Fíjate dónde se vuelven verdes las cajas: en ETL, en la bodega intermedia; en ELT, dentro del warehouse.</p>` },
  { seccion: "etl", escena: "biblioteca", foco: "filas", cam: [-2, 12, 40], mira: [-2, 8, 0],
    ojo: "¿Por qué domina ELT?", t: "Bases de datos por filas",
    html: `<ul><li>MySQL o PostgreSQL guardan <b>cada registro completo</b> junto en el disco.</li><li>Ideal para una aplicación: el detalle de <b>un</b> pedido.</li>
    <li>La analítica es al revés: mira <b>millones</b> de pedidos y solo una o dos columnas.</li><li>Para sumar los totales, la base por filas recorre cada registro entero.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Densmore lo ilustra con la tabla de pedidos de una tienda en línea: la aplicación consulta un pedido a la vez; el analista, todos.</p>` },
  { seccion: "etl", escena: "biblioteca", foco: "columnas", cam: [-2, 12, 40], mira: [-2, 8, 0],
    ojo: "¿Por qué domina ELT?", t: "Bases de datos columnares",
    html: `<ul><li>Snowflake o Redshift guardan juntos los valores de <b>una misma columna</b>.</li><li>La consulta lee solo los bloques de las columnas que necesita.</li>
    <li>Menos lectura de disco, menos memoria y <b>mejor compresión</b>: cada bloque tiene un solo tipo de dato.</li><li>Por eso hoy se puede cargar crudo y transformar dentro del warehouse.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Una biblioteca columnar guarda en un estante todos los títulos y en otro todos los años: para contar libros de 2020, solo revisa el estante de los años.</p>` },
  { seccion: "etl", escena: "biblioteca", foco: "parquet", cam: [-2, 14, 42], mira: [-2, 9, 0],
    ojo: "¿Por qué domina ELT?", t: "Parquet: columnar en un archivo",
    html: `<ul><li>En el laboratorio guardamos los tweets en <b>Parquet</b>.</li><li>Es un formato de archivo <b>columnar</b>: la misma idea, aplicada a archivos.</li>
    <li>Pensado para leer rápido solo las columnas que se necesitan.</li></ul>`,
    mas: `<p>Un archivo Parquet por split: train, validation y test.</p>` },
  { seccion: "etl", escena: "patrones", foco: "roles", cam: [0, 22, 40], mira: [2, 4, 9],
    ojo: "ETL y ELT", t: "Una ventaja humana",
    html: `<ul><li>Los analistas suelen dominar <b>SQL</b>.</li><li>Con ELT, los data engineers se concentran en <b>extraer y cargar</b>.</li>
    <li>Los analistas <b>transforman con SQL</b> lo que ya está cargado.</li><li>No hay que adivinar desde el inicio todo lo que se hará con los datos.</li>
    <li>De aquí surge un rol de la clase anterior: el <b>analytics engineer</b>.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p><b>En el curso seguimos ELT:</b> en Colab extraemos y cargamos tal como llegan; limpiar, quitar duplicados y preparar oro lo haremos con SQL dentro de Databricks.</p>` },

  // ---- EtLT
  { seccion: "etlt", escena: "patrones", foco: "etlt", cam: [-6, 16, 32], mira: [-6, 3, 9],
    ojo: "EtLT", t: "La «t» minúscula",
    html: `<ul><li>Transformaciones <b>pequeñas</b> entre extraer y cargar.</li><li>Sin lógica de negocio ni modelado de datos.</li>
    <li>Ejemplos: <b>quitar duplicados</b>, separar los parámetros de una URL y <b>enmascarar</b> datos sensibles.</li><li>Ninguna depende de cómo el negocio define una venta o un cliente.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>En la escena: las cajas repetidas se apartan y las rojas (datos sensibles) salen del escáner ya enmascaradas.</p>` },
  { seccion: "etlt", escena: "patrones", foco: "etlt", cam: [6, 14, 26], mira: [-4, 3, 9],
    ojo: "EtLT", t: "¿Por qué antes de cargar?",
    html: `<ul><li><b>Legal o de seguridad:</b> un dato sensible se oculta lo antes posible. Si se carga primero, ya quedó guardado aunque sea un rato.</li>
    <li><b>Práctica:</b> los warehouses cargan más rápido los datos bien preparados.</li><li>Es como la ventanilla de seguridad del edificio: revisa las cajas, pero no decide en qué cuarto va cada cosa.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>A partir de aquí, cuando hablemos de ELT, asumimos que puede incluir este subpatrón.</p>` },
  { seccion: "etlt", ...RUTA, tramos: [0, 1], cam: [-20, 18, 34], mira: [-14, 4, 0],
    ojo: "EtLT en el curso", t: "Nuestra «t» es muy pequeña",
    html: `<ul><li>Aplanamos el JSON en tres columnas: <code>text</code>, <code>label</code> y <code>split</code>.</li><li>Lo guardamos en Parquet <b>sin cambiar los textos</b>.</li>
    <li>La limpieza del texto queda para la capa plata, en la Clase 3.</li></ul>
    <p>Pero el dataset trae un ejemplo real: los usuarios ya vienen como <code>@user</code>.</p>`,
    mas: `<p>¿Por qué el dataset trae <code>@user</code> en lugar del nombre real? Sus creadores enmascararon ese dato antes de publicarlo: una «t» minúscula hecha antes de que nosotros lo extrajéramos.</p>` },

  // ---- Pipelines para ML
  { seccion: "ml", ...CICLO,
    ojo: "Pipelines para machine learning", t: "Productos de datos",
    html: `<ul><li>Un <b>producto de datos</b> es una aplicación que usa datos para funcionar.</li><li>Recomendaciones de video, un buscador personalizado o <b>análisis de sentimiento de reseñas</b>.</li>
    <li>Empieza como ELT; después de cargar vienen los pasos para <b>construir y actualizar el modelo</b>.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>El análisis de sentimiento es muy parecido a lo que haremos con los tweets.</p>` },
  { seccion: "ml", ...CICLO, foco: "ingesta", cam: [0, 20, 10], mira: [0, 6, -16],
    ojo: "Paso 1 de 5", t: "Ingesta versionada",
    html: `<ul><li>La misma lógica de extraer y cargar.</li><li>Con una consideración extra: los datos quedan <b>versionados</b>.</li>
    <li>El modelo puede referirse a un conjunto de datos <b>específico</b> para entrenar o validar.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Como la edición de un libro de texto: "aprendí con el libro" no dice nada; "aprendí con la tercera edición de 2025", sí.</p>` },
  { seccion: "ml", ...CICLO, foco: "preproceso", cam: [-17, 20, 21], mira: [-15.2, 6, -4.9],
    ojo: "Paso 2 de 5", t: "Preprocesamiento",
    html: `<ul><li>Los datos que llegan casi nunca están listos para un modelo.</li><li>Se limpian y se preparan.</li>
    <li>El texto se divide en piezas que el modelo entienda; los valores se convierten a números y se normalizan.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Cómo se hace con texto lo veremos en detalle en la Clase 5.</p>` },
  { seccion: "ml", ...CICLO, foco: "entreno", cam: [-10.5, 20, 38], mira: [-9.4, 6, 12.9],
    ojo: "Paso 3 de 5", t: "Entrenamiento",
    html: `<ul><li>Cuando llegan datos nuevos y preprocesados, los modelos se <b>vuelven a entrenar</b>.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Lo haremos en las Clases 5 y 6, en Colab con GPU.</p>` },
  { seccion: "ml", ...CICLO, foco: "despliegue", cam: [10.5, 20, 38], mira: [9.4, 6, 12.9],
    ojo: "Paso 4 de 5", t: "Despliegue",
    html: `<ul><li>Puede ser lo más difícil: pasar de un experimento a un producto real.</li><li>Se versionan los datos <b>y también los modelos</b>.</li>
    <li>Muchas veces el modelo se consulta con una <b>API REST</b>, un punto de acceso por versión.</li><li>Requiere a data scientists, ML engineers y data engineers trabajando juntos.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Un pipeline bien diseñado es lo que mantiene unidas las piezas.</p>` },
  { seccion: "ml", ...CICLO, foco: "retro", cam: [17, 20, 21], mira: [15.2, 6, -4.9],
    ojo: "Paso 5 de 5", t: "Retroalimentación",
    html: `<ul><li>Se recoge cómo se comporta el modelo en el mundo real: qué se recomendó y en qué hizo clic el usuario.</li>
    <li>Esos datos <b>vuelven a ingerirse</b> para futuras versiones del modelo.</li><li>También sirven a los analistas para tableros sobre su efectividad.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>La flecha verde cierra el ciclo: de la retroalimentación vuelve a la ingesta.</p>` },
  { seccion: "ml", ...CICLO, foco: "validar",
    ojo: "Pipelines para machine learning", t: "Dos validaciones distintas",
    html: `<ul><li><b>Validar los datos ingeridos:</b> ¿llegaron completos y correctos?</li><li><b>Validar el modelo:</b> ¿qué tan bien predice?</li>
    <li>Densmore insiste en no confundirlas.</li></ul><p class="fuente">Densmore (2021), cap. 3</p>`,
    mas: `<p>Como una cocina que mejora su receta: ingredientes con fecha de compra, se lavan, se cocina, se sirve y el mesero anota qué gustó.</p>` },
  { seccion: "ml", ...RUTA, tramos: [0, 1, 2],
    ojo: "Pipelines para ML en el curso", t: "Lo recorremos por etapas",
    html: `<ul><li><b>Hoy:</b> la ingesta, con los splits bien identificados en la columna <code>split</code>.</li><li>Es nuestro primer paso hacia un <b>dataset versionado</b>.</li>
    <li><b>Clases 5 y 6:</b> preprocesamiento y entrenamiento.</li><li><b>Clase 7:</b> cómo se conectan todas las piezas.</li></ul>`,
    mas: `<p>Los splits train, validation y test vienen definidos por el dataset: no los inventamos nosotros.</p>` },

  // ---- API REST
  { seccion: "api", ...API, foco: "patron",
    ojo: "Extracción desde una API REST", t: "El patrón de tres pasos",
    html: `<ol><li>Enviar una petición <b>HTTP GET</b> al <i>endpoint</i>.</li><li>Recibir la respuesta, casi siempre en <b>JSON</b>.</li><li>Interpretarla y <b>aplanarla</b> en un archivo para cargar.</li></ol>
    <p>Como pedir comida para llevar: se llama, llega la bolsa y se sirve en platos.</p><p class="fuente">Densmore (2021), cap. 4</p>`,
    mas: `<p>La API puede ser de la propia organización o de un servicio externo, como un CRM o una red social.</p>` },
  { seccion: "api", ...API, foco: "json", cam: [0, 14, 34], mira: [0, 5, 8],
    ojo: "Extracción desde una API REST", t: "JSON: cajas dentro de cajas",
    html: `<ul><li>El JSON es <b>semiestructurado y anidado</b>: objetos dentro de objetos, listas dentro de listas.</li>
    <li>La API de filas de Hugging Face devuelve una lista <code>rows</code>.</li><li>Cada elemento trae un objeto <code>row</code> con <code>text</code> y <code>label</code>.</li>
    <li>Una tabla, en cambio, necesita filas y columnas.</li></ul>`,
    mas: `<p>La respuesta también informa el total de filas del split (<code>num_rows_total</code>): lo usaremos para verificar.</p>` },
  { seccion: "api", ...API, foco: "aplanar", cam: [0, 14, 34], mira: [0, 7, 8],
    ojo: "Extracción desde una API REST", t: "Aplanar",
    html: `<ul><li>Sacamos <code>text</code> y <code>label</code> del objeto interno.</li><li>Agregamos una columna que la respuesta <b>no trae</b>: el <code>split</code> que pedimos.</li>
    <li>Sin ella no sabríamos a qué conjunto pertenece cada tweet.</li></ul><p class="fuente">Densmore (2021), cap. 4</p>`,
    mas: `<p>En el ejemplo de Densmore pasa lo mismo: agrega a cada fila datos de la petición que no venían en la respuesta, para que cada fila tenga sentido por sí sola.</p>` },
  { seccion: "api", ...API, foco: "paginacion", cam: [0, 12, 40], mira: [0, 6, 8],
    ojo: "Extracción desde una API REST", t: "Paginación",
    html: `<ul><li>Muchas APIs entregan los datos <b>por páginas</b>.</li><li>La API de filas de Hugging Face entrega hasta <b>100 filas</b> por petición.</li>
    <li>Train tiene 1.839 tweets: hay que avanzar de 100 en 100 hasta el total.</li><li>Como pedir un libro por capítulos: llevar la cuenta del último recibido.</li></ul>`,
    mas: `<p>El libro no necesita paginación en su ejemplo; nuestra API sí.</p>` },
  { seccion: "api", ...API, foco: "falla", cam: [0, 12, 40], mira: [0, 6, 8],
    ojo: "Extracción desde una API REST", t: "¿Y si una página falla?",
    html: `<ul><li>Si una página falla y no lo detectamos, el dataset queda <b>incompleto sin que nadie se entere</b>.</li>
    <li>Por eso la verificación del laboratorio compara el total extraído con el esperado: <b>3.033 filas</b>.</li></ul>`,
    mas: `<p>Es una de las preguntas de reflexión del Laboratorio 1.</p>` },
  { seccion: "api", ...API, foco: "incremental", cam: [0, 10, 36], mira: [0, 4, 8],
    ojo: "Extracción desde una API REST", t: "Completa o incremental",
    html: `<ul><li><b>Completa:</b> todos los registros en cada ejecución. Simple, pero lenta con tablas grandes.</li>
    <li><b>Incremental:</b> solo lo nuevo o modificado desde la última ejecución, con una marca de tiempo.</li>
    <li>La incremental no detecta borrados y necesita una marca de tiempo confiable.</li></ul><p class="fuente">Densmore (2021), cap. 4</p>`,
    mas: `<p><b>En el laboratorio:</b> extracción completa, porque el dataset es pequeño y no cambia. <b>En el proyecto:</b> GDELT se consulta por fecha, y extraer solo lo nuevo será mucho más útil.</p>` },
  { seccion: "api", ...API,
    ojo: "Extracción desde una API REST", t: "¿Construir o comprar?",
    html: `<ul><li>Para algunas APIs existen <b>librerías de Python</b> que simplifican el trabajo.</li><li>Frameworks de código abierto como <b>Singer</b>.</li>
    <li>Productos comerciales como <b>Stitch</b> o <b>Fivetran</b>, con conectores listos.</li><li>En el curso escribimos nuestra propia extracción para entender cada paso.</li></ul><p class="fuente">Densmore (2021), caps. 4 y 5</p>`,
    mas: `<p>Los productos comerciales cuestan según el volumen, generan dependencia del proveedor y obligan a programar cuando la fuente no tiene conector.</p>` },
  { seccion: "api", ...API, foco: "credenciales", cam: [-20, 22, 34], mira: [-20, 6, -4],
    ojo: "Extracción desde una API REST", t: "Credenciales: nunca en el código",
    html: `<ul><li>Para guardar los datos en su destino se necesita un <b>token</b> o una clave.</li><li>Los archivos con credenciales <b>nunca se suben a Git</b>; Densmore los excluye con <code>.gitignore</code>.</li>
    <li>Un repositorio se comparte, se copia y a veces es público.</li><li>Un token publicado es como dejar la llave pegada en la puerta.</li></ul><p class="fuente">Densmore (2021), cap. 4</p>`,
    mas: `<p><b>En el curso:</b> la API de Hugging Face no necesita token, pero Databricks sí. Ese token y la dirección del espacio de trabajo van en los <b>Secretos de Colab</b>: el código los lee al ejecutarse y nunca llegan a GitHub.</p>` },

  // ---- Laboratorio C2L1
  { seccion: "lab1", ...RUTA, tramos: [0, 1], cam: [-18, 22, 44], mira: [-14, 4, 0],
    ojo: "Laboratorio C2L1", t: "Extracción y carga",
    html: `<span class="cta">Laboratorio 1 · Parte 2</span>
    <ul><li><b>Extraer:</b> pedir los tweets a la API de filas de Hugging Face, página por página, para los tres splits.</li><li><b>Verificar:</b> 3.033 filas en total.</li>
    <li><b>Aplanar:</b> una tabla con <code>text</code>, <code>label</code> y <code>split</code>.</li><li><b>Guardar:</b> un Parquet por split, sin modificar los textos.</li>
    <li><b>Cargar:</b> subir los archivos al volumen <code>raw</code> de Databricks.</li></ul>`,
    mas: `<p>Notebook <code>lab1/parte2_extraccion.ipynb</code> en Colab: Archivo → Abrir cuaderno → GitHub. El token de Databricks se lee de los Secretos de Colab.</p>` },

  // ---- Data lake y Volumes
  { seccion: "lake", escena: "volume", foco: "lake", cam: [-6, 16, 36], mira: [-6, 5, 0],
    ojo: "Data lake", t: "El almacenamiento de archivos como data lake",
    html: `<ul><li>En el libro, cada extracción guarda su resultado en almacenamiento de archivos en la nube (S3) y de ahí se carga.</li>
    <li>Cuando los datos se trabajan desde ese almacenamiento, se habla de un <b>data lake</b>.</li><li>Guarda muchos formatos, crudos y a veces sin estructura.</li>
    <li>Más <b>barato</b>, pero menos optimizado para consultas.</li></ul><p class="fuente">Densmore (2021), caps. 4 y 5</p>`,
    mas: `<p>Conviene por costo, por flexibilidad cuando la estructura cambia (como con JSON) y para explorar al inicio de un proyecto de ciencia de datos. Muchas organizaciones usan lake y warehouse juntos.</p>` },
  { seccion: "lake", escena: "volume", foco: "jerarquia", cam: [-6, 18, 40], mira: [-6, 5, 0],
    ojo: "Volumes de Databricks", t: "La bodega de recepción",
    html: `<ul><li>Un <b>volume</b> es un objeto gobernado para datos que no son tablas.</li><li>Guarda archivos de cualquier formato: estructurados, semiestructurados o no estructurados.</li>
    <li>Vive en la jerarquía de Unity Catalog: <b>catálogo → esquema → volume</b>.</li><li>Ruta: <code>/Volumes/catálogo/esquema/volume/archivo</code>, igual desde SQL o Python.</li></ul><p class="fuente">Databricks, Volumes</p>`,
    mas: `<p>Hay volumes <b>administrados</b> (Databricks los controla por completo; la opción por defecto) y <b>externos</b> (registran un almacenamiento que ya existía).</p>` },
  { seccion: "lake", escena: "volume", foco: "llegada", cam: [-16, 16, 40], mira: [-14, 5, 0],
    ojo: "Volumes en el curso", t: "Llegan los tres Parquet",
    html: `<ul><li>Volume <b>administrado</b> <code>raw</code>, dentro del esquema <code>dlbd</code>.</li><li>Desde Colab subimos un Parquet por split, tal como salieron de la API.</li>
    <li>Es el <b>último paso de la ingesta</b>: los datos ya están en nuestra plataforma.</li></ul>`,
    mas: `<p>La documentación lo menciona como uso típico: zona de aterrizaje para datos crudos de sistemas externos (Databricks, Volumes).</p>` },
  { seccion: "lake", escena: "volume", foco: "tabla", cam: [8, 14, 40], mira: [8, 5, 0],
    ojo: "Volumes en el curso", t: "Un archivo no es una tabla",
    html: `<ul><li>Los archivos de un volume <b>no se registran como tablas</b>.</li><li>Para trabajarlos como tabla, hay que leerlos y crearla.</li>
    <li>Creamos <code>bronze_tweets</code> sin limpiar ni filtrar.</li><li>Dos columnas de metadatos: <b>fecha de carga</b> y <b>archivo de origen</b>.</li></ul><p class="fuente">Databricks, Volumes</p>`,
    mas: `<p>Son la etiqueta que se pega a cada caja en la bodega: cuándo llegó y de qué proveedor vino. Si algo se ve raro después, podemos rastrear cada fila.</p>` },

  // ---- Laboratorio C2L2
  { seccion: "lab2", escena: "volume", foco: "tabla", cam: [18, 12, 30], mira: [18, 5, 0],
    ojo: "Laboratorio C2L2", t: "Capa bronce",
    html: `<span class="cta">Laboratorio 1 · Parte 3</span>
    <ul><li>Crear <code>dlbd.bronze_tweets</code> leyendo los archivos del volumen con <code>read_files()</code>.</li><li>Sin limpiar ni filtrar.</li>
    <li>Agregar la fecha y hora de carga y el archivo de origen.</li><li><b>Verificar:</b> 3.033 filas y el conteo por split coincide con el dataset.</li></ul>`,
    mas: `<p>Notebook <code>lab1/parte3_bronce.sql</code> en Databricks: Workspace → Create → Git folder con la URL del repositorio propio, conectado a Serverless.</p>` },

  // ---- Resumen
  { seccion: "resumen", escena: "valeria", reparado: true, cam: [-2, 14, 44], mira: [-2, 6, 0],
    ojo: "Resumen", t: "Volvamos con Valeria",
    html: `<ul><li>Una extracción automática pide los datos, los aplana y los guarda <b>sin tocarlos</b> en un data lake.</li>
    <li>Los datos sensibles se ocultan antes de cargar: una <b>«t» minúscula</b>.</li><li>Ya en la plataforma, se transforma con SQL: <b>ELT</b>.</li>
    <li>Se conserva siempre el dato original y las <b>credenciales</b> viven en un lugar seguro.</li></ul><p>Si un lunes Valeria se enferma, el pipeline sigue funcionando.</p>`,
    mas: `<p>El reporte vuelve a verde: las columnas ya no dependen de que alguien las acomode a mano.</p>` },
  { seccion: "resumen", ...RUTA, tramos: [0, 1, 2], cam: [0, 40, 76],
    ojo: "Resumen", t: "Puntos clave",
    html: `<ul><li>ETL y ELT: mismos pasos, distinto orden. Hoy domina <b>ELT</b> por los warehouses columnares.</li><li><b>Parquet</b> aplica la idea columnar a los archivos.</li>
    <li><b>EtLT:</b> limpiezas pequeñas sin lógica de negocio antes de cargar.</li><li><b>ML:</b> ingesta versionada, preprocesamiento, entrenamiento, despliegue y retroalimentación.</li>
    <li><b>API REST:</b> pedir, recibir JSON, aplanar, recorrer todas las páginas y verificar el total.</li><li><b>Credenciales</b> fuera del código: Secretos de Colab.</li>
    <li><b>Volumes</b> como data lake; bronce convierte los archivos en tabla sin alterarlos.</li></ul>`,
    mas: `<p>Densmore (2021, caps. 3, 4 y 5); Databricks, Volumes.</p>` },
  { seccion: "resumen", ...RUTA, tramos: [0, 1, 2], cam: [0, 40, 76],
    ojo: "Fuentes", t: "Para profundizar",
    html: `<ul><li><b>Densmore (2021).</b> <i>Data Pipelines Pocket Reference</i>, cap. 3 (patrones), cap. 4 (extracción) y cap. 5 (carga y data lake).</li>
    <li><b>Databricks.</b> <i>What are Unity Catalog volumes?</i></li></ul>`,
    mas: `<p>La guía del curso tiene el mapeo completo de cada concepto con su capítulo o sección.</p>` },

  // ---- Cierre
  { seccion: "cierre", ...RUTA, tramos: [0, 1, 2], cam: [24, 26, 54], mira: [6, 3, 0],
    ojo: "Cierre", t: "Debate y entrega",
    html: `<ul><li>¿Por qué el dataset trae <code>@user</code> en lugar del nombre real? ¿En qué paso del pipeline se hizo eso?</li>
    <li>Si una página de la API falla a la mitad, ¿cómo lo detectarían?</li><li>¿Qué ventaja tiene guardar bronce exactamente como llegó?</li></ul>
    <span class="cta">Entrega del Laboratorio 1</span><p>En Moodle, con la URL de su repositorio: la carpeta <code>lab1/</code> con los tres notebooks y <code>respuestas.md</code>.</p>`,
    mas: `<p><b>Próxima clase:</b> Transformación y calidad. Empieza con un Kahoot de repaso de la Clase 2.</p>` }
];

export default {
  n: 2,
  agenda,
  pasos,
  crearEscenas({ etiquetas }) {
    return {
      ruta: crearRuta(etiquetas), valeria: crearValeria(etiquetas), patrones: crearPatrones(etiquetas), biblioteca: crearBiblioteca(etiquetas),
      ml: crearCicloML(etiquetas), api: crearApi(etiquetas), volume: crearVolume(etiquetas)
    };
  }
};
