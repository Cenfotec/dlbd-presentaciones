import * as THREE from "three";
import gsap from "gsap";
import { COL, escenaBase, bloque, estadoBloque, curvaEntre, tubo, flujo, contorno, reducido, conIcono, marca, linea, atenuarCercanos } from "../../motor/util.js";
import { siGithub, siDatabricks, siGooglecolab, siHuggingface, siApacheparquet, siKahoot } from "simple-icons";
import * as L from "lucide-static";

const I = {
  github: marca(siGithub), databricks: marca(siDatabricks), colab: marca(siGooglecolab), hf: marca(siHuggingface),
  parquet: marca(siApacheparquet), kahoot: marca(siKahoot),
  api: linea(L.Webhook), crudo: linea(L.Archive), limpio: linea(L.Filter), oro: linea(L.Gem), volume: linea(L.FolderOpen),
  noticias: linea(L.Newspaper), hoja: linea(L.FileSpreadsheet), reporte: linea(L.ChartColumn), alerta: linea(L.TriangleAlert),
  origen: linea(L.Database), bodega: linea(L.Warehouse), casa: linea(L.House), camion: linea(L.Truck),
  escaner: linea(L.ScanLine), ingeniero: linea(L.Cpu), analista: linea(L.UserRound), sql: linea(L.CodeXml),
  biblioteca: linea(L.Library), ingesta: linea(L.ArrowDownToLine), preproceso: linea(L.Filter), entreno: linea(L.BrainCircuit),
  despliegue: linea(L.Rocket), retro: linea(L.RefreshCw), check: linea(L.CircleCheck), version: linea(L.Tags),
  json: linea(L.Braces), tabla: linea(L.Table), llave: linea(L.KeyRound), candado: linea(L.Lock), reloj: linea(L.History),
  catalogo: linea(L.FolderTree), esquema: linea(L.Layers)
};
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const DUR = reducido ? 0.01 : 1;
const ROJO = 0xff5c7a;
const partes = (o) => o.userData.partes || [o];
const pintar = (o, st) => partes(o).forEach((b) => estadoBloque(b, st));
const cubo = (lado, color, op = 1) => new THREE.Mesh(new THREE.BoxGeometry(lado, lado, lado),
  new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, transparent: op < 1, opacity: op }));

/* =====================================================================
   Ruta del curso: el pipeline completo, con los tramos de hoy encendidos
   ===================================================================== */
export function crearRuta(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "ruta";
  const NODOS = [
    ["api", "API de Hugging Face", V(-30, 5, 0), I.hf],
    ["colab", "Google Colab", V(-18, 5, 0), I.colab],
    ["volume", "Volume raw", V(-6, 5, 0), I.volume],
    ["bronce", "Capa bronce", V(6, 5, 0), I.crudo],
    ["plata", "Capa plata", V(18, 5, 0), I.limpio],
    ["oro", "Capa oro", V(30, 5, 0), I.oro]
  ];
  const nodos = {};
  NODOS.forEach(([id, n, p, ic]) => {
    const b = bloque(new THREE.BoxGeometry(5, 3, 4));
    b.position.copy(p); escena.add(b); nodos[id] = b;
    b.userData.e = etiquetas.crear(n, b, V(0, 2.4, 0), enEscena);
    conIcono(b, ic, { tam: 3 });
  });
  // Fuente del proyecto final: GDELT
  const gdelt = bloque(new THREE.BoxGeometry(5, 3, 4));
  gdelt.position.set(-30, 5, -14); escena.add(gdelt);
  gdelt.userData.e = etiquetas.crear("API de GDELT · proyecto", gdelt, V(0, 2.4, 0), (s) => enEscena(s) && s.paso.foco === "proyecto");
  conIcono(gdelt, I.noticias, { tam: 3 });
  const cGdelt = curvaEntre(V(-27.5, 5, -14), V(-20.5, 5, -1), 1);
  const tGdelt = tubo(cGdelt, COL.verde, 0.14); escena.add(tGdelt);

  const VERBOS = ["Extraer", "Cargar", "Registrar", "Limpiar", "Modelar"];
  const curvas = NODOS.slice(0, -1).map(([, , p], i) => curvaEntre(p.clone().add(V(2.5, 0, 0)), NODOS[i + 1][2].clone().add(V(-2.5, 0, 0)), 1.5));
  const tubos = curvas.map((c) => { const t = tubo(c, COL.marino, 0.14); escena.add(t); return t; });
  curvas.forEach((c, i) => {
    const ancla = new THREE.Object3D(); c.getPointAt(0.5, ancla.position); escena.add(ancla);
    etiquetas.crear(VERBOS[i], ancla, V(0, 1.8, 0), (s) => enEscena(s) && s.paso.tramos && s.paso.tramos.includes(i));
  });
  const datos = flujo([...curvas, cGdelt], 22, COL.celeste, 0.5);
  escena.add(datos.puntos);
  let tramos = [], foco = null;
  return {
    escena,
    alPaso(p) {
      tramos = p.tramos || []; foco = p.foco || null;
      const activos = new Set();
      tramos.forEach((i) => { activos.add(NODOS[i][0]); activos.add(NODOS[i + 1][0]); });
      if (foco === "proyecto") NODOS.forEach(([id]) => activos.add(id));
      Object.entries(nodos).forEach(([id, b]) => {
        const st = !tramos.length && foco !== "proyecto" ? "normal" : activos.has(id) ? "foco" : "tenue";
        estadoBloque(b, st); b.userData.e.el.classList.toggle("activa", st === "foco");
      });
      tubos.forEach((t, i) => t.material.color.set(tramos.includes(i) ? COL.verde : COL.marino));
      gdelt.visible = tGdelt.visible = foco === "proyecto";
      estadoBloque(gdelt, "foco");
    },
    actualizar(dt, t, { quieto, camara }) {
      atenuarCercanos(Object.values(nodos).map((b) => b.userData.icono), camara);
      datos.actualizar(dt, quieto, (i) => i === curvas.length ? (foco === "proyecto" ? "foco" : "apagada")
        : foco === "proyecto" ? "foco" : !tramos.length ? "normal" : tramos.includes(i) ? "foco" : "apagada");
      Object.values(nodos).forEach((b, i) => { b.position.y = 5 + Math.sin(t * 0.8 + i) * 0.2 * quieto; });
    }
  };
}

/* =====================================================================
   Valeria: la ingesta manual (columnas que se mueven) y su arreglo
   ===================================================================== */
export function crearValeria(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "valeria";
  const COLS = [["Fecha", COL.celeste], ["Producto", 0x5b8fd6], ["Ventas", COL.verde], ["Descuento", COL.gris]];
  const columnas = COLS.map(([n, c], k) => {
    const g = new THREE.Group();
    for (let r = 0; r < 6; r++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.2, 0.6), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.3 }));
      m.position.y = 2 + r * 1.6; g.add(m);
    }
    g.position.set(-20 + k * 4, 0, 0); escena.add(g);
    etiquetas.crear(n, g.children[5], V(0, 1.6, 0), enEscena);
    return g;
  });
  const hoja = contorno(new THREE.BoxGeometry(18, 11, 2), COL.celeste, 0.6);
  hoja.position.set(-14, 6.8, 0); escena.add(hoja);
  conIcono(hoja, I.hoja, { y: 7.6, tam: 3 });
  const reporte = bloque(new THREE.BoxGeometry(10, 8, 1));
  reporte.position.set(16, 6, 0); escena.add(reporte);
  etiquetas.crear("Reporte de la gerencia", reporte, V(0, 6.6, 0), enEscena);
  const icRep = conIcono(reporte, I.reporte, { placa: true, tam: 4.5, y: 0, z: 0.6 });
  const alerta = conIcono(new THREE.Object3D(), I.alerta, { tam: 3 });
  alerta.parent.position.set(16, 12.5, 0); escena.add(alerta.parent);
  const c = curvaEntre(V(-4, 6, 0), V(10.5, 6, 0), 2);
  const t = tubo(c, COL.marino, 0.16); escena.add(t);
  const datos = flujo([c], 50, COL.celeste, 0.5); escena.add(datos.puntos);
  let reparado = false, ciclo = null;
  const intercambiar = () => {
    const a = columnas[2], b = columnas[3];
    const xa = a.position.x, xb = b.position.x;
    gsap.to(a.position, { x: xb, duration: 0.8 * DUR }); gsap.to(b.position, { x: xa, duration: 0.8 * DUR });
  };
  return {
    escena,
    alPaso(p) {
      reparado = !!p.reparado;
      if (ciclo) { ciclo.kill(); ciclo = null; }
      columnas.forEach((g, k) => gsap.to(g.position, { x: -20 + k * 4, duration: 0.4 * DUR }));
      if (!reparado && !reducido) ciclo = gsap.delayedCall(2, function rep() { intercambiar(); ciclo = gsap.delayedCall(2.4, rep); });
      reporte.userData.linea.material.color.set(reparado ? COL.verde : ROJO);
      icRep.material.color.set(reparado ? COL.verde : ROJO);
      alerta.visible = !reparado;
      alerta.material.color.set(ROJO);
      t.material.color.set(reparado ? COL.verde : COL.marino);
    },
    actualizar(dt, tt, { quieto }) {
      datos.actualizar(dt, quieto, () => (reparado ? "foco" : "normal"));
      if (!reparado) alerta.parent.position.y = 12.5 + Math.sin(tt * 5) * 0.3 * quieto;
    }
  };
}

/* =====================================================================
   ETL frente a ELT (la mudanza) y el escáner de EtLT
   ===================================================================== */
export function crearPatrones(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "patrones";
  const CARRILES = { etl: -9, elt: 9 };
  const X0 = -26, XB = -6, XD = 20;
  const piezas = {};
  const agregar = (id, nombre, obj, alto, ic, vis) => {
    escena.add(obj); piezas[id] = obj;
    obj.userData.e = etiquetas.crear(nombre, obj, V(0, alto, 0), vis || enEscena);
    conIcono(obj, ic, { tam: 3 });
  };
  Object.entries(CARRILES).forEach(([k, z]) => {
    const o = bloque(new THREE.CylinderGeometry(3, 3, 3, 6)); o.position.set(X0, 1.5, z);
    agregar(k + "-origen", "Fuentes", o, 2.6, I.origen);
    const d = bloque(new THREE.BoxGeometry(9, 6, 7), { opacidad: 0.4 }); d.position.set(XD, 3, z);
    agregar(k + "-destino", "Warehouse", d, 4, I.casa);
    escena.add(tubo(new THREE.LineCurve3(V(X0 + 3, 0.6, z), V(XD - 4.5, 0.6, z)), COL.marino, 0.1));
  });
  const bod = bloque(new THREE.BoxGeometry(6, 5, 6), { opacidad: 0.45 }); bod.position.set(XB, 2.5, CARRILES.etl);
  agregar("etl-bodega", "Servidor intermedio: transformar", bod, 3.6, I.bodega);
  const rotulo = (txt, z, k) => { const a = new THREE.Object3D(); a.position.set(X0 - 8, 2, z); escena.add(a);
    const e = etiquetas.crear(txt, a, V(0, 0, 0), (s) => enEscena(s) && (s.paso.foco === k || s.paso.foco === "ambos")); e.el.classList.add("activa"); };
  rotulo("ETL · Extraer → Transformar → Cargar", CARRILES.etl - 4, "etl");
  rotulo("ELT · Extraer → Cargar → Transformar", CARRILES.elt + 4, "elt");
  // Escáner de la t minúscula, en el carril de ELT
  const esc = new THREE.Group();
  [-3, 3].forEach((dz) => { const p = bloque(new THREE.BoxGeometry(0.8, 6, 0.8)); p.position.set(0, 3, dz); esc.add(p); });
  const arcoE = bloque(new THREE.BoxGeometry(0.8, 0.8, 6.8)); arcoE.position.y = 6.4; esc.add(arcoE);
  esc.position.set(XB, 0, CARRILES.elt); esc.userData.partes = esc.children.slice();
  agregar("escaner", "t minúscula: deduplicar · enmascarar", esc, 8.4, I.escaner, (s) => enEscena(s) && s.paso.foco === "etlt");
  // Roles: quién trabaja en cada tramo de ELT
  const ing = new THREE.Object3D(); ing.position.set((X0 + XD) / 2 - 6, 6, CARRILES.elt); escena.add(ing);
  etiquetas.crear("Data engineer: extraer y cargar", ing, V(0, 2.6, 0), (s) => enEscena(s) && s.paso.foco === "roles");
  conIcono(ing, I.ingeniero, { tam: 3, y: 0 });
  const ana = new THREE.Object3D(); ana.position.set(XD, 10, CARRILES.elt); escena.add(ana);
  etiquetas.crear("Analista: transformar con SQL", ana, V(0, 2.6, 0), (s) => enEscena(s) && s.paso.foco === "roles");
  conIcono(ana, I.sql, { tam: 3, y: 0 });
  // Cajas: grises y cerradas al salir; verdes y ordenadas al transformarse
  const cajas = [];
  ["etl", "elt"].forEach((k) => {
    for (let i = 0; i < 9; i++) {
      const m = cubo(1.6, COL.gris); escena.add(m);
      cajas.push({ m, k, t: i / 9, dup: k === "elt" && i % 4 === 1, sens: k === "elt" && i % 4 === 3 });
    }
  });
  const cGris = new THREE.Color(COL.gris), cVerde = new THREE.Color(COL.verde), cRojo = new THREE.Color(ROJO), cCel = new THREE.Color(COL.celeste);
  let f = null;
  return {
    escena,
    alPaso(p) {
      f = p.foco || null;
      const vis = { etl: ["etl"], elt: ["elt"], ambos: ["etl", "elt"], roles: ["elt"], etlt: ["elt"] }[f] || ["etl", "elt"];
      Object.entries(piezas).forEach(([id, o]) => {
        const carril = id.split("-")[0];
        const st = id === "escaner" ? (f === "etlt" ? "foco" : "tenue") : vis.includes(carril) ? "foco" : "tenue";
        pintar(o, st);
      });
      esc.visible = f === "etlt";
      ing.visible = ana.visible = f === "roles";
    },
    actualizar(dt, tt, { quieto, camara }) {
      atenuarCercanos(Object.values(piezas).map((o) => o.userData.icono), camara);
      for (const c of cajas) {
        c.t = (c.t + dt * 0.07 * quieto) % 1;
        const x = X0 + 3 + (XD - X0 - 3) * c.t;
        const z = c.k === "etl" ? -9 : 9;
        let y = 1.4, col = cGris, s = 1, oculto = false;
        if (c.k === "etl") { if (x > XB) { col = cVerde; s = 0.75; } }
        else {
          if (x > XD - 4.5) { col = cVerde; s = 0.75; }
          if (f === "etlt") {
            if (c.sens) col = x > XB ? (x > XD - 4.5 ? cVerde : cCel) : cRojo;
            if (c.dup && x > XB) { y = 1.4 - (x - XB) * 0.6; oculto = y < -3; }
            if (c.dup && x <= XB) y = 3.2;
          }
        }
        c.m.position.set(x, y, z + (c.dup && f === "etlt" ? 0 : 0));
        c.m.scale.setScalar(s);
        c.m.material.color.copy(col); c.m.material.emissive.copy(col);
        c.m.visible = !oculto && (c.k === "etl" ? f !== "etlt" && f !== "roles" && f !== "elt" : f !== "etl");
        c.m.rotation.y += dt * 0.6 * quieto;
      }
    }
  };
}

/* =====================================================================
   Filas frente a columnas: la biblioteca
   ===================================================================== */
export function crearBiblioteca(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "biblioteca";
  const C = [[COL.celeste, "ID"], [0x5b8fd6, "País"], [COL.gris, "Cliente"], [0xc9a23a, "Total"]];
  const R = 8;
  const celdas = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < 4; c++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshStandardMaterial({ color: C[c][0], emissive: C[c][0], emissiveIntensity: 0.3 }));
    m.userData = { r, c }; escena.add(m); celdas.push(m);
  }
  // Estantes: en modo filas, uno por registro; en modo columnas, uno por campo.
  const estantes = [];
  for (let k = 0; k < R; k++) {
    const e = contorno(new THREE.BoxGeometry(8, 2, 2.4), COL.celeste, 0.35); escena.add(e); estantes.push(e);
  }
  const ePos = (modo, k) => modo === "filas" ? V(-8, 1.6 + k * 2.2, 0) : V(-12 + k * 6, 9, 0);
  const pos = (modo, m) => modo === "filas" ? V(-8 - 2.7 + m.userData.c * 1.8, 1.6 + m.userData.r * 2.2, 0)
    : V(-12 + m.userData.c * 6, 1.6 + m.userData.r * 2.2, 0);
  const consulta = new THREE.Object3D(); consulta.position.set(12, 14, 0); escena.add(consulta);
  const eQ = etiquetas.crear("SUM(Total)", consulta, V(0, 0, 0), enEscena); eQ.el.classList.add("activa");
  const rotulo = new THREE.Object3D(); rotulo.position.set(0, -1, 4); escena.add(rotulo);
  const eR = etiquetas.crear("", rotulo, V(0, 0, 0), enEscena);
  const icP = conIcono(rotulo, I.parquet, { tam: 3, y: 18 });
  let modo = "filas", reloj = 0;
  const colocar = (d) => {
    celdas.forEach((m) => { const p = pos(modo, m); gsap.to(m.position, { x: p.x, y: p.y, z: p.z, duration: d }); });
    estantes.forEach((e, k) => {
      const p = ePos(modo, k); const vis = modo === "filas" || k < 4;
      e.visible = vis;
      if (modo === "filas") { e.scale.set(1, 1, 1); } else { e.scale.set(0.3, 8.6, 1); }
      gsap.to(e.position, { x: p.x, y: p.y, z: p.z, duration: d });
    });
  };
  colocar(0);
  return {
    escena,
    alPaso(p) {
      const nuevo = p.foco === "columnas" || p.foco === "parquet" ? "columnas" : "filas";
      const cambia = nuevo !== modo; modo = nuevo; reloj = 0;
      colocar(cambia ? 1.4 * DUR : 0);
      eR.el.textContent = modo === "filas" ? "Base por filas: la consulta recorre cada registro completo" : "Base columnar: la consulta solo visita el estante de Total";
      eR.ancho = null;
      icP.visible = p.foco === "parquet";
      if (p.foco === "parquet") eR.el.textContent = "Parquet: la misma idea, dentro de un archivo";
    },
    actualizar(dt) {
      reloj += dt * (reducido ? 0 : 1);
      const fila = Math.floor(reloj * 2) % (R + 3);
      celdas.forEach((m) => {
        const { r, c } = m.userData;
        let on;
        if (modo === "filas") on = r === fila; // lee la fila completa
        else on = c === 3 && r <= fila;          // solo la columna Total
        const base = new THREE.Color(C[c][0]);
        m.material.emissive.copy(on ? new THREE.Color(COL.verde) : base);
        m.material.emissiveIntensity = on ? 0.9 : modo === "columnas" && c !== 3 ? 0.08 : 0.3;
      });
    }
  };
}

/* =====================================================================
   Pipeline para machine learning: un ciclo con retroalimentación
   ===================================================================== */
export function crearCicloML(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "ml";
  const EST = [["ingesta", "Ingesta versionada", I.ingesta], ["preproceso", "Preprocesamiento", I.preproceso], ["entreno", "Entrenamiento", I.entreno],
    ["despliegue", "Despliegue", I.despliegue], ["retro", "Retroalimentación", I.retro]];
  const R = 16, nodos = {}, ps = [];
  EST.forEach(([id, n, ic], k) => {
    const a = Math.PI / 2 + (k / EST.length) * Math.PI * 2;
    const p = V(Math.cos(a) * R, 5, -Math.sin(a) * R); ps.push(p);
    const b = bloque(new THREE.CylinderGeometry(3, 3, 2, 8)); b.position.copy(p); escena.add(b); nodos[id] = b;
    b.userData.e = etiquetas.crear(n, b, V(0, 2.6, 0), enEscena);
    conIcono(b, ic, { tam: 3.4 });
  });
  const curvas = ps.map((p, k) => { const q = ps[(k + 1) % ps.length]; return curvaEntre(p.clone().lerp(q, 0.18), q.clone().lerp(p, 0.18), 1.2); });
  const tubos = curvas.map((c) => { const t = tubo(c, COL.marino, 0.14); escena.add(t); return t; });
  const datos = flujo(curvas, 22, COL.celeste, 0.5); escena.add(datos.puntos);
  const extra = (txt, base, off, ic, f) => {
    const o = new THREE.Object3D(); o.position.copy(base).add(off); escena.add(o);
    const e = etiquetas.crear(txt, o, V(0, -2.2, 0), (s) => enEscena(s) && f(s.paso.foco)); e.el.classList.add("activa");
    const i = conIcono(o, ic, { tam: 2.4, y: 0 }); i.material.color.set(COL.verde); o.userData.ver = f; return o;
  };
  const extras = [
    extra("datos v1 · v2", ps[0], V(-7, 3, 0), I.version, (f) => f === "ingesta" || f === "version"),
    extra("modelo v1 · v2", ps[3], V(6, 3, 0), I.version, (f) => f === "despliegue" || f === "version"),
    extra("Validar los datos ingeridos", ps[0], V(0, 7, 0), I.check, (f) => f === "validar"),
    extra("Validar el modelo", ps[2], V(0, 7, 0), I.check, (f) => f === "validar")
  ];
  let f = null;
  return {
    escena,
    alPaso(p) {
      f = p.foco || null;
      const sel = { validar: ["ingesta", "entreno"], version: ["ingesta", "despliegue"] }[f] || (f ? [f] : []);
      Object.entries(nodos).forEach(([id, b]) => {
        const st = !sel.length ? "normal" : sel.includes(id) ? "foco" : "tenue";
        estadoBloque(b, st); b.userData.e.el.classList.toggle("activa", st === "foco");
      });
      tubos.forEach((t, k) => t.material.color.set(f === "retro" && k === 4 ? COL.verde : COL.marino));
      extras.forEach((o) => (o.visible = o.userData.ver(f)));
    },
    actualizar(dt, t, { quieto, camara }) {
      atenuarCercanos(Object.values(nodos).map((b) => b.userData.icono), camara);
      datos.actualizar(dt, quieto, (k) => !f ? "normal" : f === "retro" ? (k === 4 ? "foco" : "normal") : EST[k][0] === f ? "foco" : "normal");
    }
  };
}

/* =====================================================================
   Extracción desde una API: petición, JSON anidado, aplanado, páginas,
   completa vs incremental y credenciales
   ===================================================================== */
export function crearApi(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "api";
  const fs = (...k) => (s) => enEscena(s) && k.includes(s.paso.foco);
  const colab = bloque(new THREE.BoxGeometry(6, 4, 4)); colab.position.set(-22, 5, 0); escena.add(colab);
  colab.userData.e = etiquetas.crear("Google Colab", colab, V(0, 3, 0), enEscena); conIcono(colab, I.colab, { tam: 3.2 });
  const hf = bloque(new THREE.BoxGeometry(6, 4, 4)); hf.position.set(22, 5, 0); escena.add(hf);
  hf.userData.e = etiquetas.crear("API de filas de Hugging Face", hf, V(0, 3, 0), enEscena); conIcono(hf, I.hf, { tam: 3.2 });
  const cIda = curvaEntre(V(-19, 6, 0), V(19, 6, 0), 5), cVuelta = curvaEntre(V(19, 4, 0), V(-19, 4, 0), -3);
  const tIda = tubo(cIda, COL.marino, 0.1), tVuelta = tubo(cVuelta, COL.marino, 0.1); escena.add(tIda, tVuelta);
  const paquete = cubo(1.2, COL.celeste); escena.add(paquete);
  const ePet = etiquetas.crear("GET /rows?split=train&offset=0&length=100", paquete, V(0, 1.8, 0), fs("patron"));
  const respuesta = cubo(2.4, COL.verde, 0.8); escena.add(respuesta);
  const eRes = etiquetas.crear("Respuesta JSON", respuesta, V(0, 2.4, 0), fs("patron"));
  // JSON anidado: rows → row → text, label. Al aplanar cae en una tabla text | label | split.
  const nido = new THREE.Group(); nido.position.set(0, 4, 8); escena.add(nido);
  const caja = (w, h, d, color, op) => { const g = new THREE.BoxGeometry(w, h, d); const l = contorno(g, color, op); return l; };
  const exterior = caja(20, 10, 4, COL.celeste, 0.7); nido.add(exterior);
  const eExt = etiquetas.crear("{ rows: [ … ], num_rows_total: 1839 }", exterior, V(0, 6, 0), fs("json"));
  const filasJ = [], celdasT = [];
  for (let r = 0; r < 3; r++) {
    const fila = caja(5.4, 7, 3, 0x5b8fd6, 0.8); fila.position.set(-6.5 + r * 6.5, -0.5, 0); nido.add(fila); filasJ.push(fila);
    const interno = caja(4.4, 3.6, 2.4, COL.gris, 0.9); interno.position.set(-6.5 + r * 6.5, -1.2, 0); nido.add(interno); filasJ.push(interno);
    for (let c = 0; c < 3; c++) {
      const color = [COL.celeste, 0x5b8fd6, COL.verde][c];
      const m = cubo(1.3, color); m.userData = { r, c }; nido.add(m); celdasT.push(m);
    }
  }
  const eFila = etiquetas.crear("row: { text, label }", filasJ[1], V(0, 3, 0), fs("json"));
  const tablaRot = new THREE.Object3D(); tablaRot.position.set(0, 9, 0); nido.add(tablaRot);
  etiquetas.crear("text | label | split ← split viene de la petición", tablaRot, V(0, 0, 0), fs("aplanar")).el.classList.add("activa");
  const posJson = (m) => V(-6.5 + m.userData.r * 6.5 + (m.userData.c === 2 ? 0 : (m.userData.c - 0.5) * 1.8), m.userData.c === 2 ? 4.2 : -1.2, 0);
  const posTabla = (m) => V(-4 + m.userData.c * 4, 6 - m.userData.r * 2.2, 0);
  // Páginas: una pila por split, de 100 filas cada página
  const SPL = [["train", 1839, -10], ["validation", 324, 0], ["test", 870, 10]];
  const pilas = SPL.map(([n, tot, x]) => {
    const g = new THREE.Group(); g.position.set(x, 0, 8); escena.add(g);
    const nPag = Math.ceil(tot / 100);
    const pags = Array.from({ length: nPag }, (_, k) => { const m = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 3.4),
      new THREE.MeshStandardMaterial({ color: COL.celeste, emissive: COL.celeste, emissiveIntensity: 0.3 })); m.position.y = 0.3 + k * 0.5; g.add(m); return m; });
    const e = etiquetas.crear("", g, V(0, nPag * 0.5 + 2, 0), fs("paginacion", "falla"));
    return { n, tot, g, pags, e };
  });
  const totalAncla = new THREE.Object3D(); totalAncla.position.set(0, 14, 8); escena.add(totalAncla);
  const eTotal = etiquetas.crear("", totalAncla, V(0, 0, 0), fs("paginacion", "falla"));
  // Completa frente a incremental: una línea de tiempo con una marca
  const linea0 = new THREE.Group(); linea0.position.set(0, 2, 8); escena.add(linea0);
  const barra = (y, color) => { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 })); m.position.y = y; linea0.add(m); return m; };
  const bFull = barra(4, COL.celeste), bInc = barra(0, COL.verde);
  const base0 = new THREE.Mesh(new THREE.BoxGeometry(32, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: COL.gris })); base0.position.y = -2; linea0.add(base0);
  const marcaT = new THREE.Mesh(new THREE.BoxGeometry(0.3, 9, 0.3), new THREE.MeshBasicMaterial({ color: COL.verde })); marcaT.position.set(8, 2, 0); linea0.add(marcaT);
  etiquetas.crear("Completa: todo, en cada ejecución", bFull, V(-4, 1.8, 0), fs("incremental"));
  etiquetas.crear("Incremental: solo lo nuevo desde la última marca", bInc, V(4, -1.8, 0), fs("incremental"));
  etiquetas.crear("Última extracción", marcaT, V(0, 5.6, 0), fs("incremental")).el.classList.add("activa");
  conIcono(marcaT, I.reloj, { tam: 2.2, y: 7.2 });
  // Credenciales: la llave pegada a la puerta y el candado de Secretos de Colab
  const gh = bloque(new THREE.BoxGeometry(5, 3, 3)); gh.position.set(-38, 5, -8); escena.add(gh);
  gh.userData.e = etiquetas.crear("Repositorio en GitHub", gh, V(0, 2.4, 0), fs("credenciales")); conIcono(gh, I.github, { tam: 2.8 });
  const dbx = bloque(new THREE.BoxGeometry(5, 3, 3)); dbx.position.set(-2, 5, -12); escena.add(dbx);
  dbx.userData.e = etiquetas.crear("Databricks", dbx, V(0, 2.4, 0), fs("credenciales")); conIcono(dbx, I.databricks, { tam: 2.8 });
  const cand = new THREE.Object3D(); cand.position.set(-22, 14, 0); escena.add(cand);
  const icCand = conIcono(cand, I.llave, { tam: 2.8, y: 0 });
  const eCand = etiquetas.crear("Token en el código", cand, V(0, 2.4, 0), fs("credenciales"));
  const token = cubo(0.9, COL.verde); escena.add(token);
  const cTok = curvaEntre(V(-23, 11, 0), V(-35.5, 6.5, -8), 3), cDbx = curvaEntre(V(-21, 11, 0), V(-4.5, 6.5, -12), 4);
  let f = null, reloj = 0, plano = false;
  const v = V(0, 0, 0);
  const ponerCeldas = (modo, d) => celdasT.forEach((m) => { const p = modo === "tabla" ? posTabla(m) : posJson(m); gsap.to(m.position, { x: p.x, y: p.y, z: p.z, duration: d }); });
  ponerCeldas("json", 0);
  return {
    escena,
    alPaso(p) {
      f = p.foco || null; reloj = 0;
      const enJson = f === "json" || f === "aplanar";
      nido.visible = enJson;
      exterior.visible = f === "json"; filasJ.forEach((l) => (l.visible = f === "json"));
      plano = f === "aplanar"; ponerCeldas(plano ? "tabla" : "json", 1.4 * DUR);
      pilas.forEach((pl) => (pl.g.visible = f === "paginacion" || f === "falla"));
      totalAncla.visible = pilas[0].g.visible;
      linea0.visible = f === "incremental";
      [gh, dbx].forEach((o) => (o.visible = f === "credenciales"));
      cand.visible = token.visible = f === "credenciales";
      paquete.visible = respuesta.visible = f === "patron" || !f;
      [tIda, tVuelta].forEach((t) => t.material.color.set(f === "patron" ? COL.verde : COL.marino));
      estadoBloque(colab, f === "credenciales" || f === "patron" || !f ? "foco" : "normal");
      estadoBloque(hf, f === "patron" || !f ? "foco" : "normal");
      [gh, dbx].forEach((o) => estadoBloque(o, "normal"));
      if (f === "falla") pilas[0].pags[7].material.color.set(ROJO), pilas[0].pags[7].material.emissive.set(ROJO);
      else pilas[0].pags[7].material.color.set(COL.celeste), pilas[0].pags[7].material.emissive.set(COL.celeste);
    },
    actualizar(dt, t, { quieto, camara }) {
      reloj += dt * (reducido ? 0 : 1);
      if (paquete.visible) {
        const k = (reloj * 0.35) % 2;
        if (k < 1) { cIda.getPointAt(k, v); paquete.position.copy(v); paquete.visible = true; respuesta.position.set(0, -50, 0); }
        else { cVuelta.getPointAt(k - 1, v); respuesta.position.copy(v); paquete.position.set(0, -50, 0); }
      }
      if (pilas[0].g.visible) {
        let suma = 0;
        pilas.forEach((pl) => {
          const n = pl.pags.length, vistas = reducido ? n : Math.min(n, Math.floor(reloj * 4));
          pl.pags.forEach((m, k) => (m.visible = k < vistas && !(f === "falla" && pl.n === "train" && k === 7 && reloj > 3)));
          let filas = Math.min(pl.tot, vistas * 100);
          if (f === "falla" && pl.n === "train" && vistas > 7) filas -= 100;
          suma += filas;
          pl.e.el.textContent = `${pl.n}: ${filas.toLocaleString("es-CR")} / ${pl.tot.toLocaleString("es-CR")}`;
        });
        const ok = suma === 3033;
        eTotal.el.textContent = f === "falla" && reloj > 6 ? `Verificación: ${suma.toLocaleString("es-CR")} ≠ 3.033 filas` : `Total: ${suma.toLocaleString("es-CR")} de 3.033 filas`;
        eTotal.el.classList.toggle("error", f === "falla" && reloj > 6);
        eTotal.el.classList.toggle("activa", ok);
      }
      if (linea0.visible) {
        const k = (reloj * 0.5) % 2;
        bFull.scale.set(Math.max(0.01, 32 * Math.min(1, k)), 1, 1); bFull.position.x = -16 + 16 * Math.min(1, k);
        const ini = 8, largo = 8 * Math.min(1, k);
        bInc.scale.set(Math.max(0.01, largo), 1, 1); bInc.position.x = ini + largo / 2;
      }
      if (cand.visible) {
        const k = (reloj * 0.4) % 3;
        if (reloj < 3) { // la llave intenta subir a GitHub y rebota
          const u = k < 1 ? k : 2 - k; cTok.getPointAt(Math.min(1, Math.max(0, u)) * 0.9, v); token.position.copy(v);
          icCand.material.color.set(ROJO); eCand.el.textContent = "Token en el código → GitHub"; eCand.el.classList.add("error");
        } else { // ya en Secretos de Colab: viaja solo a Databricks
          cDbx.getPointAt(((reloj - 3) * 0.4) % 1, v); token.position.copy(v);
          if (icCand.userData.svg !== "c") { icCand.material.map = conIcono(new THREE.Object3D(), I.candado, { tam: 1 }).material.map; icCand.userData.svg = "c"; }
          icCand.material.color.set(COL.verde); eCand.el.textContent = "Secretos de Colab"; eCand.el.classList.remove("error"); eCand.el.classList.add("activa");
        }
        eCand.ancho = null;
      } else if (icCand.userData.svg === "c") {
        icCand.material.map = conIcono(new THREE.Object3D(), I.llave, { tam: 1 }).material.map; icCand.userData.svg = "";
        eCand.el.classList.remove("activa");
      }
      atenuarCercanos([colab, hf].map((b) => b.userData.icono), camara);
    }
  };
}

/* =====================================================================
   Data lake y Volumes: la bodega de recepción y el paso a la tabla bronce
   ===================================================================== */
export function crearVolume(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "volume";
  const fs = (...k) => (s) => enEscena(s) && k.includes(s.paso.foco);
  // Jerarquía de Unity Catalog: catálogo ⊃ esquema ⊃ volume
  const NIV = [["catalogo", "Catálogo", 30, 14, 20, COL.celeste, I.catalogo], ["esquema", "Esquema dlbd", 24, 11, 15, 0x5b8fd6, I.esquema], ["volume", "Volume raw", 17, 8, 10, COL.verde, I.volume]];
  const niveles = {};
  NIV.forEach(([id, n, w, h, d, c, ic], k) => {
    const l = contorno(new THREE.BoxGeometry(w, h, d), c, 0.75); l.position.set(-6, h / 2 + k * 0.2, 0); escena.add(l); niveles[id] = l;
    etiquetas.crear(n, l, V(-w / 2 + 4, h / 2 + 0.8, d / 2), (s) => enEscena(s) && ["jerarquia", "llegada", "lake"].includes(s.paso.foco));
    conIcono(l, ic, { tam: 2.4, y: h / 2 - 1.6 }).position.x = w / 2 - 2;
  });
  const ruta = new THREE.Object3D(); ruta.position.set(-6, -1, 7); escena.add(ruta);
  etiquetas.crear("/Volumes/…/dlbd/raw/train.parquet", ruta, V(0, 0, 0), fs("jerarquia", "llegada")).el.classList.add("activa");
  // Archivos de muchos formatos (data lake) o los tres Parquet del curso
  const mezcla = [I.json, I.hoja, I.tabla, I.parquet, I.noticias].map((ic, k) => {
    const o = new THREE.Object3D(); o.position.set(-12 + k * 3, 3, 0); escena.add(o); conIcono(o, ic, { tam: 2.4, y: 0 }); return o;
  });
  etiquetas.crear("Archivos de cualquier formato, crudos", mezcla[2], V(0, 3, 0), fs("lake"));
  const SPL = ["train", "validation", "test"];
  const pq = SPL.map((n, k) => {
    const b = bloque(new THREE.BoxGeometry(3.4, 2.6, 2.6)); escena.add(b);
    b.userData.e = etiquetas.crear(n + ".parquet", b, V(0, 2.2, 0), fs("llegada", "tabla"));
    conIcono(b, I.parquet, { placa: true, tam: 2, y: 0, z: 1.4 });
    b.userData.destino = V(-11 + k * 5, 2, 0); b.userData.origen = V(-40, 6 + k * 2, 0);
    return b;
  });
  const colab = bloque(new THREE.BoxGeometry(5, 3.4, 3.4)); colab.position.set(-40, 6, 0); escena.add(colab);
  colab.userData.e = etiquetas.crear("Google Colab", colab, V(0, 2.6, 0), fs("llegada")); conIcono(colab, I.colab, { tam: 2.6 });
  // La tabla bronze_tweets: 3 columnas de datos + 2 de metadatos que brillan
  const tabla = new THREE.Group(); tabla.position.set(21, 0, 0); escena.add(tabla);
  const COLS = [["text", COL.celeste], ["label", 0x5b8fd6], ["split", COL.gris], ["fecha de carga", COL.verde], ["archivo de origen", COL.verde]];
  const celdas = [];
  COLS.forEach(([n, c], k) => {
    for (let r = 0; r < 6; r++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1, 1.2), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: k > 2 ? 0.7 : 0.3 }));
      m.position.set(-8 + k * 4, 1 + r * 1.3, 0); tabla.add(m); celdas.push(m);
    }
    const e = etiquetas.crear(n, tabla.children[k * 6 + 5], V(0, k % 2 ? 2.6 : 1.3, 0), fs("tabla"));
    if (k > 2) e.el.classList.add("activa");
  });
  const tit = new THREE.Object3D(); tit.position.set(0, 10.4, 0); tabla.add(tit);
  etiquetas.crear("dlbd.bronze_tweets", tit, V(0, 0, 0), fs("tabla")).el.classList.add("activa");
  conIcono(tit, I.tabla, { tam: 2.6, y: 2.2 });
  const cTab = curvaEntre(V(2, 3, 0), V(12, 3, 0), 3); const tTab = tubo(cTab, COL.verde, 0.14); escena.add(tTab);
  const datos = flujo([cTab], 30, COL.verde, 0.5); escena.add(datos.puntos);
  let f = null;
  return {
    escena,
    alPaso(p) {
      f = p.foco || null;
      mezcla.forEach((o) => (o.visible = f === "lake"));
      const conPq = f === "llegada" || f === "tabla";
      pq.forEach((b, k) => {
        b.visible = conPq;
        if (f === "llegada") { b.position.copy(b.userData.origen); gsap.to(b.position, { x: b.userData.destino.x, y: b.userData.destino.y, z: 0, duration: 1.8 * DUR, delay: k * 0.4 * DUR, ease: "power2.inOut" }); }
        else b.position.copy(b.userData.destino);
        estadoBloque(b, f === "llegada" ? "foco" : "normal");
      });
      colab.visible = f === "llegada";
      tabla.visible = tTab.visible = datos.puntos.visible = f === "tabla";
      Object.entries(niveles).forEach(([id, l]) => l.material.opacity = f === "jerarquia" || id === "volume" ? 0.8 : 0.35);
    },
    actualizar(dt, t, { quieto }) {
      if (tabla.visible) datos.actualizar(dt, quieto, () => "foco");
      mezcla.forEach((o, k) => { o.position.y = 3 + Math.sin(t + k) * 0.3 * quieto; });
    }
  };
}
