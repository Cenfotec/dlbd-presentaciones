import * as THREE from "three";
import gsap from "gsap";
import { COL, escenaBase, bloque, estadoBloque, curvaEntre, tubo, flujo, contorno, reducido } from "../../motor/util.js";

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const DUR = reducido ? 0.01 : 1;

/* =====================================================================
   Introducción y resumen: la empresa con el pipeline roto (y luego reparado)
   ===================================================================== */
export function crearHistoria(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "historia";

  // Tramos del pipeline con huecos: los traspasos (handoffs) que nadie cubre.
  const tramos = [[-34, -22], [-18, -6], [-2, 10], [14, 26]].map(([a, b]) => new THREE.LineCurve3(V(a, 6, 0), V(b, 6, 0)));
  const roto = new THREE.Group();
  tramos.forEach((c) => roto.add(tubo(c, COL.celeste, 0.3)));
  escena.add(roto);
  const entero = tubo(new THREE.LineCurve3(V(-34, 6, 0), V(34, 6, 0)), COL.verde, 0.3);
  entero.visible = false;
  escena.add(entero);

  // Los tres síntomas de la historia
  const sintomas = [["Recomendaciones erróneas", V(30, 10, -8)], ["Cifras contradictorias", V(30, 2, 8)], ["Equipos que se culpan", V(-30, 14, -10)]].map(([n, p]) => {
    const b = bloque(new THREE.OctahedronGeometry(2.2));
    b.position.copy(p);
    escena.add(b);
    etiquetas.crear(n, b, V(0, -3.6, 0), enEscena);
    return b;
  });

  // Datos: en la historia se escapan por los huecos; en el resumen fluyen completos.
  const N = 260;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const tt = Float32Array.from({ length: N }, () => Math.random() * 1.6);
  const seg = Uint8Array.from({ length: N }, (_, i) => i % 4);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  escena.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.55, vertexColors: true, transparent: true, depthWrite: false })));
  const cGris = new THREE.Color(COL.gris), cVerde = new THREE.Color(COL.verde);
  const v = V(0, 0, 0);
  let reparado = false;

  return {
    escena,
    alPaso(p) {
      reparado = !!p.reparado;
      roto.visible = !reparado;
      entero.visible = reparado;
      sintomas.forEach((b) => estadoBloque(b, reparado ? "foco" : "normal"));
    },
    actualizar(dt, t, { quieto }) {
      for (let i = 0; i < N; i++) {
        tt[i] += dt * 0.25 * quieto;
        if (reparado) {
          if (tt[i] > 1) tt[i] = 0;
          v.set(-34 + 68 * tt[i], 6, 0);
          cVerde.toArray(col, i * 3);
        } else {
          if (tt[i] > 1.6) tt[i] = 0;
          const c = tramos[seg[i]];
          if (tt[i] <= 1) c.getPointAt(tt[i], v);
          else { c.getPointAt(1, v); v.y -= (tt[i] - 1) * 14; v.x += (tt[i] - 1) * 2; }
          cGris.toArray(col, i * 3);
        }
        pos[i * 3] = v.x; pos[i * 3 + 1] = v.y + Math.sin(i * 3.7) * 0.25; pos[i * 3 + 2] = v.z + Math.cos(i * 2.1) * 0.25;
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
      sintomas.forEach((b, i) => { b.rotation.y += dt * 0.5 * quieto; if (!reparado) b.position.y += Math.sin(t * 6 + i) * 0.01 * quieto; });
    }
  };
}

/* =====================================================================
   Mapa de roles de Data & AI: una red de traspasos, con ramas paralelas
   ===================================================================== */
export function crearRoles(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "roles";
  const ROLES = {
    DE: ["Data Engineer", V(-26, 5, 0)],
    AE: ["Analytics Engineer", V(-8, 5, -12)],
    BI: ["BI Developer", V(10, 5, -20)],
    DA: ["Data Analyst", V(12, 5, -7)],
    DS: ["Data Scientist", V(-6, 5, 4)],
    AI: ["AI / LLM Engineer", V(-6, 5, 18)],
    PE: ["Prompt Engineer", V(12, 5, 24)],
    ML: ["MLOps / DevOps", V(16, 5, 10)],
    PM: ["Product Manager", V(-4, 20, 2)]
  };
  const nodos = {};
  Object.entries(ROLES).forEach(([id, [nombre, p]]) => {
    const b = bloque(new THREE.CylinderGeometry(2.4, 2.4, 1.6, 6));
    b.position.copy(p);
    escena.add(b);
    nodos[id] = b;
    b.userData.e = etiquetas.crear(nombre, b, V(0, 2.8, 0), enEscena);
  });
  // Traspasos de trabajo. Varios salen en paralelo del mismo rol.
  const ARISTAS = [["DE", "AE"], ["DE", "DS"], ["DE", "AI"], ["AE", "BI"], ["AE", "DA"], ["AE", "DS"], ["DS", "ML"], ["AI", "ML"], ["DS", "AI"], ["PE", "AI"], ["AI", "DE"]];
  const curvas = ARISTAS.map(([a, b]) => curvaEntre(ROLES[a][1], ROLES[b][1], a === "AI" && b === "DE" ? -2 : 2.5));
  curvas.forEach((c) => escena.add(tubo(c, COL.marino, 0.12)));
  const datos = flujo(curvas, 26, COL.celeste, 0.5);
  escena.add(datos.puntos);
  // El Product Manager se conecta con todos con líneas finas
  Object.keys(ROLES).filter((k) => k !== "PM").forEach((k) => {
    escena.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([ROLES.PM[1], ROLES[k][1]]),
      new THREE.LineBasicMaterial({ color: COL.celeste, transparent: true, opacity: 0.25 })));
  });

  let foco = [];
  return {
    escena,
    alPaso(p) {
      foco = p.foco ? [].concat(p.foco) : [];
      Object.entries(nodos).forEach(([id, b]) => {
        const st = !foco.length ? "normal" : foco.includes(id) ? "foco" : "tenue";
        estadoBloque(b, st);
        b.userData.e.el.classList.toggle("activa", foco.includes(id));
      });
    },
    actualizar(dt, t, { quieto }) {
      datos.actualizar(dt, quieto, (i) => {
        if (!foco.length) return "normal";
        const [a, b] = ARISTAS[i];
        return foco.includes(a) || foco.includes(b) ? "foco" : "apagada";
      });
      Object.values(nodos).forEach((b, i) => { b.rotation.y += dt * 0.3 * quieto * (i % 2 ? 1 : -1); });
    }
  };
}

/* =====================================================================
   Herramientas del curso, tokens y formatos JSON / Parquet
   ===================================================================== */
export function crearHerramientas(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "herramientas";
  const HERR = [["api", "REST API"], ["colab", "Google Colab"], ["databricks", "Databricks Free Edition"], ["github", "GitHub"], ["hf", "Hugging Face Hub"]];
  const tarjetas = {};
  HERR.forEach(([id, nombre], i) => {
    const ang = -0.9 + i * 0.45;
    const b = bloque(new THREE.BoxGeometry(6.5, 4.2, 0.5));
    b.position.set(Math.sin(ang) * 22, 9, -Math.cos(ang) * 22 + 6);
    b.lookAt(0, 9, 6);
    escena.add(b);
    tarjetas[id] = b;
    b.userData.e = etiquetas.crear(nombre, b, V(0, 0, 0), (s) => enEscena(s) && !["json", "parquet"].includes(s.paso.foco));
  });

  // La bóveda de secretos: un candado
  const candado = new THREE.Group();
  const cuerpo = bloque(new THREE.BoxGeometry(4, 3.4, 1.6));
  const arco = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.28, 12, 32, Math.PI), new THREE.MeshBasicMaterial({ color: COL.celeste }));
  arco.position.y = 1.7;
  candado.add(cuerpo, arco);
  candado.position.set(0, 3, 10);
  escena.add(candado);
  etiquetas.crear("Tokens y secretos", candado, V(0, -3, 0), (s) => enEscena(s) && s.paso.foco === "tokens");

  // JSON y Parquet: 3 registros × 4 campos. Mismo contenido, distinta organización.
  const CAMPOS = [COL.celeste, COL.verde, 0x5b8fd6, COL.gris];
  const celdas = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), new THREE.MeshStandardMaterial({ color: CAMPOS[c], emissive: CAMPOS[c], emissiveIntensity: 0.35 }));
    m.userData = { r, c };
    escena.add(m);
    celdas.push(m);
  }
  const zona = V(0, 0, 4);
  const ponerJson = (d) => celdas.forEach((m) => gsap.to(m.position, { x: zona.x + (m.userData.r - 1) * 7, y: 2 + (3 - m.userData.c) * 1.8, z: zona.z, duration: d }));
  const ponerParquet = (d) => celdas.forEach((m) => gsap.to(m.position, { x: zona.x + (m.userData.c - 1.5) * 4, y: 2 + (2 - m.userData.r) * 1.6, z: zona.z, duration: d }));
  ponerJson(0);
  const marcoJson = new THREE.Group();
  [-7, 0, 7].forEach((x) => {
    const g = new THREE.BoxGeometry(2.6, 8, 2.6);
    const l = contorno(g, COL.celeste, 0.6); l.position.set(zona.x + x, 4.7, zona.z); marcoJson.add(l);
  });
  const marcoParquet = new THREE.Group();
  [-1.5, -0.5, 0.5, 1.5].forEach((c) => {
    const g = new THREE.BoxGeometry(2.4, 5.6, 2.4);
    const l = contorno(g, COL.verde, 0.8); l.position.set(zona.x + c * 4, 3.6, zona.z); marcoParquet.add(l);
  });
  escena.add(marcoJson, marcoParquet);
  const eJson = etiquetas.crear("JSON: un documento por registro", marcoJson.children[1], V(0, 5.6, 0), (s) => enEscena(s) && s.paso.foco === "json");
  const eParquet = etiquetas.crear("Parquet: una columna por campo", marcoParquet.children[1], V(2, 4.4, 0), (s) => enEscena(s) && s.paso.foco === "parquet");

  return {
    escena,
    alPaso(p) {
      const f = p.foco;
      Object.entries(tarjetas).forEach(([id, b]) => {
        estadoBloque(b, !f ? "normal" : f === id ? "foco" : "tenue");
        b.userData.e.el.classList.toggle("activa", f === id);
      });
      estadoBloque(cuerpo, f === "tokens" ? "foco" : "tenue");
      arco.material.color.set(f === "tokens" ? COL.verde : COL.marino);
      const formato = f === "json" || f === "parquet";
      celdas.forEach((m) => (m.visible = formato));
      marcoJson.visible = f === "json";
      marcoParquet.visible = f === "parquet";
      if (f === "parquet") ponerParquet(1.6 * DUR); else ponerJson(f === "json" ? 1.2 * DUR : 0);
    },
    actualizar(dt, t, { quieto }) {
      candado.rotation.y = Math.sin(t * 0.6) * 0.4 * quieto;
      Object.values(tarjetas).forEach((b, i) => { b.position.y = 9 + Math.sin(t * 0.8 + i) * 0.3 * quieto; });
    }
  };
}

/* =====================================================================
   Infraestructura moderna: el sistema de agua potable de una ciudad
   ===================================================================== */
export function crearAgua(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "agua";
  const piezas = {};
  const agregar = (id, nombre, obj, alto) => {
    escena.add(obj);
    piezas[id] = obj;
    obj.userData.e = etiquetas.crear(nombre, obj, V(0, alto, 0), enEscena);
  };
  const montana = bloque(new THREE.ConeGeometry(7, 12, 6));
  montana.position.set(-38, 6, 0);
  agregar("fuentes", "Manantiales · Fuentes de datos", montana, 8.5);
  const bomba = new THREE.Group();
  const b1 = bloque(new THREE.CylinderGeometry(2.6, 2.6, 6, 16)); b1.position.y = 3;
  const b2 = bloque(new THREE.BoxGeometry(5, 2, 5)); b2.position.y = 1;
  bomba.add(b1, b2); bomba.position.set(-20, 0, 0);
  bomba.userData = { partes: [b1, b2] };
  agregar("ingesta", "Bombeo · Ingesta", bomba, 9);
  const tanque = new THREE.Group();
  [[0x8a5a2b, 0], [0x9aa3b2, 3.4], [0xc9a23a, 6.8]].forEach(([c, y]) => {
    const t = bloque(new THREE.CylinderGeometry(5.5, 5.5, 3.2, 32), { color: c, linea: COL.celeste });
    t.position.y = y + 1.6; tanque.add(t);
  });
  tanque.userData = { partes: tanque.children.slice() };
  agregar("almacenamiento", "Tanques · Almacenamiento", tanque, 13);
  const planta = new THREE.Group();
  const pb = bloque(new THREE.BoxGeometry(8, 7, 7)); pb.position.y = 3.5; planta.add(pb);
  [-2, 0, 2].forEach((x) => { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 5), new THREE.MeshBasicMaterial({ color: COL.celeste })); f.position.set(x, 3.5, 3.6); planta.add(f); });
  planta.position.set(18, 0, 0); planta.userData = { partes: [pb] };
  agregar("transformacion", "Planta de tratamiento · Transformación", planta, 10);
  const grifo = bloque(new THREE.BoxGeometry(6, 4, 0.5));
  grifo.position.set(36, 5, 0);
  agregar("consumo", "Grifos · Analítica e IA", grifo, 4.5);
  const control = new THREE.Group();
  const torre = bloque(new THREE.CylinderGeometry(0.8, 1.6, 14, 8)); torre.position.y = 7;
  const anillo = new THREE.Mesh(new THREE.TorusGeometry(3, 0.25, 12, 48), new THREE.MeshBasicMaterial({ color: COL.celeste }));
  anillo.position.y = 15; anillo.rotation.x = Math.PI / 2;
  control.add(torre, anillo); control.position.set(0, 0, -18); control.userData = { partes: [torre], anillo };
  agregar("orquestacion", "Centro de control · Orquestación", control, 18);
  // Líneas del centro de control hacia cada estación
  [montana, bomba, tanque, planta, grifo].forEach((o) => escena.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 15, -18), o.position.clone().setY(4)]),
    new THREE.LineBasicMaterial({ color: COL.celeste, transparent: true, opacity: 0.25 }))));
  // Tuberías con el agua (los datos)
  const tramos = [[V(-34, 2, 0), V(-22.6, 2, 0)], [V(-17.4, 2, 0), V(-5.5, 2, 0)], [V(5.5, 2, 0), V(14, 2, 0)], [V(22, 2, 0), V(33, 4, 0)]].map(([a, b]) => curvaEntre(a, b, 1.2));
  tramos.forEach((c) => escena.add(tubo(c, COL.marino, 0.45)));
  const agua = flujo(tramos, 40, COL.celeste, 0.55);
  escena.add(agua.puntos);
  const ORDEN = ["fuentes", "ingesta", "almacenamiento", "transformacion", "consumo"];

  let f = null;
  const partes = (o) => o.userData.partes || [o];
  return {
    escena,
    alPaso(p) {
      f = p.foco || null;
      Object.entries(piezas).forEach(([id, o]) => {
        partes(o).forEach((b) => estadoBloque(b, !f ? "normal" : f === id ? "foco" : "tenue"));
        o.userData.e.el.classList.toggle("activa", f === id);
      });
      anillo.material.color.set(f === "orquestacion" ? COL.verde : COL.celeste);
    },
    actualizar(dt, t, { quieto }) {
      agua.actualizar(dt, quieto, (i) => {
        if (!f || f === "orquestacion") return "normal";
        const k = ORDEN.indexOf(f);
        return i === k || i === k - 1 ? "foco" : "normal";
      });
      anillo.rotation.z += dt * 0.8 * quieto;
    }
  };
}

/* =====================================================================
   Fuentes de datos: interfaces, estructura, volumen y calidad
   ===================================================================== */
export function crearFuentes(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "fuentes";
  const centro = bloque(new THREE.CylinderGeometry(4, 4, 7, 32));
  centro.position.set(0, 3.5, 0);
  escena.add(centro);
  etiquetas.crear("Pipeline", centro, V(0, 5.6, 0), enEscena);

  // Cada interfaz trae datos con su estructura típica
  const GEOS = {
    estructurado: new THREE.BoxGeometry(0.9, 0.9, 0.9),
    semi: new THREE.OctahedronGeometry(0.7),
    no: new THREE.TetrahedronGeometry(0.8)
  };
  const PORTALES = [
    ["bd", "Bases de datos de aplicaciones", "estructurado"],
    ["api", "REST APIs", "semi"],
    ["stream", "Streaming (Kafka)", "semi"],
    ["archivos", "Archivos y logs en la nube", "no"],
    ["dw", "Warehouses y lakes internos", "estructurado"]
  ];
  const portales = {};
  const flujos = [];
  const N = 22;
  PORTALES.forEach(([id, nombre, tipo], i) => {
    const ang = Math.PI * (0.15 + 0.175 * i);
    const p = V(Math.cos(ang) * 26, 6, -Math.sin(ang) * 26 + 10);
    const portal = bloque(new THREE.TorusGeometry(3.2, 0.35, 12, 48));
    portal.position.copy(p);
    portal.lookAt(0, 6, 0);
    escena.add(portal);
    portales[id] = portal;
    portal.userData.e = etiquetas.crear(nombre, portal, V(0, 4.6, 0), enEscena);
    const curva = curvaEntre(p, V(0, 5, 0), 4);
    const inst = new THREE.InstancedMesh(GEOS[tipo], new THREE.MeshBasicMaterial({ color: 0xffffff }), N);
    escena.add(inst);
    flujos.push({ id, tipo, curva, inst, t: Float32Array.from({ length: N }, () => Math.random()), sucio: Uint8Array.from({ length: N }, () => (Math.random() < 0.3 ? 1 : 0)) });
  });
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = V(1, 1, 1), v = V(0, 0, 0);
  const cNormal = new THREE.Color(COL.celeste), cFoco = new THREE.Color(COL.verde), cTenue = new THREE.Color(COL.marino), cSucio = new THREE.Color(COL.gris);
  let f = null, ritmo = 1;

  return {
    escena,
    alPaso(p) {
      f = p.foco || null;
      ritmo = f === "volumen" ? 3.2 : 1;
      Object.entries(portales).forEach(([id, b]) => {
        const st = !f || ["interfaces", "volumen", "sucios"].includes(f) ? "normal" : f === id || PORTALES.find((x) => x[0] === id)[2] === f ? "foco" : "tenue";
        estadoBloque(b, st);
        b.userData.e.el.classList.toggle("activa", st === "foco");
      });
    },
    actualizar(dt, t, { quieto }) {
      flujos.forEach((fl) => {
        const st = !f || ["interfaces", "volumen", "sucios"].includes(f) ? "normal" : fl.tipo === f || fl.id === f ? "foco" : "tenue";
        for (let k = 0; k < N; k++) {
          fl.t[k] = (fl.t[k] + dt * 0.14 * ritmo * quieto) % 1;
          fl.curva.getPointAt(fl.t[k], v);
          const temblor = f === "sucios" && fl.sucio[k] ? Math.sin(t * 40 + k) * 0.3 : 0;
          e.set(t + k, t * 0.7 + k, 0);
          q.setFromEuler(e);
          sc.setScalar(1 - fl.t[k] * 0.5);
          m4.compose(v.set(v.x + temblor, v.y, v.z), q, sc);
          fl.inst.setMatrixAt(k, m4);
          fl.inst.setColorAt(k, f === "sucios" && fl.sucio[k] ? cSucio : st === "foco" ? cFoco : st === "tenue" ? cTenue : cNormal);
        }
        fl.inst.instanceMatrix.needsUpdate = true;
        if (fl.inst.instanceColor) fl.inst.instanceColor.needsUpdate = true;
      });
      Object.values(portales).forEach((b) => (b.rotation.z += dt * 0.4 * quieto));
    }
  };
}

/* =====================================================================
   Paradigmas de almacenamiento y arquitectura medallion
   ===================================================================== */
export function crearMedallion(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "medallion";
  const piezas = {};
  // Warehouse: estantes ordenados
  const wh = new THREE.Group();
  const whCaja = bloque(new THREE.BoxGeometry(9, 8, 7), { opacidad: 0.35 }); whCaja.position.y = 4; wh.add(whCaja);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), new THREE.MeshStandardMaterial({ color: COL.celeste, emissive: COL.celeste, emissiveIntensity: 0.3 }));
    m.position.set(-3 + c * 2, 1.6 + r * 2.4, 0); wh.add(m);
  }
  wh.position.set(-34, 0, -6); wh.userData.partes = [whCaja];
  // Lake: un lago con formas mezcladas
  const lk = new THREE.Group();
  const lago = bloque(new THREE.CylinderGeometry(6, 6, 0.6, 40), { opacidad: 0.5 }); lago.position.y = 0.3; lk.add(lago);
  const formas = [new THREE.BoxGeometry(1, 1, 1), new THREE.OctahedronGeometry(0.7), new THREE.TetrahedronGeometry(0.8), new THREE.SphereGeometry(0.6, 12, 8)];
  for (let i = 0; i < 18; i++) {
    const m = new THREE.Mesh(formas[i % 4], new THREE.MeshStandardMaterial({ color: i % 3 ? COL.celeste : COL.gris, emissive: COL.marino, emissiveIntensity: 0.3 }));
    const a = i * 2.4, r = 1 + (i % 5);
    m.position.set(Math.cos(a) * r, 1 + (i % 3) * 0.5, Math.sin(a) * r); lk.add(m);
  }
  lk.position.set(-20, 0, 4); lk.userData.partes = [lago];
  // Lakehouse: el lago con un estante encima
  const lh = new THREE.Group();
  const lh1 = bloque(new THREE.CylinderGeometry(6, 6, 0.6, 40), { opacidad: 0.5 }); lh1.position.y = 0.3;
  const lh2 = bloque(new THREE.BoxGeometry(8, 5, 6), { opacidad: 0.35 }); lh2.position.y = 3.2;
  lh.add(lh1, lh2); lh.position.set(-6, 0, -6); lh.userData.partes = [lh1, lh2];
  [["warehouse", "Data Warehouse", wh, 10], ["lake", "Data Lake", lk, 5], ["lakehouse", "Data Lakehouse", lh, 8.5]].forEach(([id, n, o, alto]) => {
    escena.add(o); piezas[id] = o; o.userData.e = etiquetas.crear(n, o, V(0, alto, 0), enEscena);
  });
  // Medallion: tres cámaras, cada una más refinada
  const CAPAS = [["bronce", "Bronce · crudo", 0x8a5a2b, 10], ["plata", "Plata · limpio", 0x9aa3b2, 22], ["oro", "Oro · negocio", 0xc9a23a, 34]];
  CAPAS.forEach(([id, n, c, x]) => {
    const b = bloque(new THREE.CylinderGeometry(4, 4, 8, 6), { color: c, opacidad: 0.55 });
    b.position.set(x, 4, 4); escena.add(b); piezas[id] = b;
    b.userData.e = etiquetas.crear(n, b, V(0, 6, 0), enEscena);
  });
  const tramos = [curvaEntre(V(-1, 3, 4), V(6, 3, 4), 2), curvaEntre(V(14, 3, 4), V(18, 3, 4), 2), curvaEntre(V(26, 3, 4), V(30, 3, 4), 2), curvaEntre(V(38, 3, 4), V(46, 5, 4), 2)];
  tramos.forEach((c) => escena.add(tubo(c, COL.marino, 0.35)));
  // Partículas: muchas y grises al entrar; menos y limpias al avanzar
  const N = [70, 50, 30, 18];
  const flujos = tramos.map((c, i) => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(N[i] * 3);
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: [COL.gris, 0xc58a52, 0xd8dde6, 0xf0c955][i], size: [0.45, 0.5, 0.55, 0.9][i], transparent: true, depthWrite: false }));
    escena.add(pts);
    return { c, g, p, t: Float32Array.from({ length: N[i] }, () => Math.random()), pts };
  });
  const v = V(0, 0, 0);
  let f = null;
  const partes = (o) => o.userData.partes || [o];
  return {
    escena,
    alPaso(p) {
      f = p.foco || null;
      const grupo = { medallion: ["bronce", "plata", "oro"], curso: ["bronce", "plata", "oro"], paradigmas: ["warehouse", "lake", "lakehouse"] }[f] || [f];
      Object.entries(piezas).forEach(([id, o]) => {
        const st = !f ? "normal" : grupo.includes(id) ? "foco" : "tenue";
        partes(o).forEach((b) => estadoBloque(b, st));
        o.userData.e.el.classList.toggle("activa", st === "foco");
      });
    },
    actualizar(dt, t, { quieto }) {
      flujos.forEach((fl, i) => {
        for (let k = 0; k < fl.t.length; k++) {
          fl.t[k] = (fl.t[k] + dt * 0.2 * quieto) % 1;
          fl.c.getPointAt(fl.t[k], v);
          fl.p[k * 3] = v.x; fl.p[k * 3 + 1] = v.y + Math.sin(k * 5.1) * 0.3; fl.p[k * 3 + 2] = v.z + Math.cos(k * 3.7) * 0.3;
        }
        fl.g.attributes.position.needsUpdate = true;
      });
      lk.children.forEach((m, i) => { if (i) m.position.y = 1 + (i % 3) * 0.5 + Math.sin(t + i) * 0.2 * quieto; });
    }
  };
}

/* =====================================================================
   Orquestación y DAG
   ===================================================================== */
export function crearDag(etiquetas) {
  const escena = escenaBase();
  const enEscena = (s) => s.escena === "dag";
  const NODOS = {
    mysql: ["Extraer de MySQL", V(-22, 5, -7), 0],
    api: ["Consumir la REST API", V(-22, 5, 7), 0],
    bronce: ["Cargar en bronce", V(-9, 5, 0), 1],
    plata: ["Limpiar en plata", V(3, 5, 0), 2],
    oro: ["Agregar en oro", V(15, 5, 0), 3],
    tablero: ["Actualizar tablero", V(27, 5, -7), 4],
    modelo: ["Reentrenar modelo", V(27, 5, 7), 4]
  };
  const nodos = {};
  Object.entries(NODOS).forEach(([id, [n, p]]) => {
    const b = bloque(new THREE.BoxGeometry(5, 2.4, 3));
    b.position.copy(p); escena.add(b); nodos[id] = b;
    b.userData.e = etiquetas.crear(n, b, V(0, 2.6, 0), enEscena);
  });
  const ARISTAS = [["mysql", "bronce"], ["api", "bronce"], ["bronce", "plata"], ["plata", "oro"], ["oro", "tablero"], ["oro", "modelo"]];
  const flechas = ARISTAS.map(([a, b]) => {
    const pa = NODOS[a][1].clone().add(V(2.5, 0, 0)), pb = NODOS[b][1].clone().add(V(-2.5, 0, 0));
    const c = curvaEntre(pa, pb, 0.01);
    const t = tubo(c, COL.celeste, 0.12);
    const punta = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 12), new THREE.MeshBasicMaterial({ color: COL.celeste }));
    punta.position.copy(pb.clone().add(V(-0.6, 0, 0)));
    punta.lookAt(pb.clone().add(pb.clone().sub(pa)));
    punta.rotateX(Math.PI / 2);
    escena.add(t, punta);
    return { t, punta };
  });
  // El ciclo prohibido: de oro de vuelta a la extracción
  const ciclo = tubo(new THREE.CatmullRomCurve3([V(15, 7.5, 0), V(0, 16, 0), V(-22, 7.6, -7)]), 0xff5c7a, 0.16);
  ciclo.visible = false; escena.add(ciclo);
  const eCiclo = etiquetas.crear("Ciclo: la ejecución nunca termina", ciclo, V(-4, 16.5, 0), (s) => enEscena(s) && s.paso.foco === "aciclico");
  eCiclo.el.classList.add("error");
  // El marco de un Job de Lakeflow alrededor del grafo
  const job = contorno(new THREE.BoxGeometry(60, 10, 22), COL.verde, 0.8);
  job.position.set(2.5, 5, 0); job.visible = false; escena.add(job);
  etiquetas.crear("Lakeflow Job", job, V(-26, 6, 0), (s) => enEscena(s) && s.paso.foco === "lakeflow");

  let f = null, reloj = 0;
  return {
    escena,
    alPaso(p) {
      f = p.foco || null; reloj = 0;
      ciclo.visible = f === "aciclico";
      job.visible = f === "lakeflow";
      Object.values(nodos).forEach((b) => estadoBloque(b, "normal"));
    },
    actualizar(dt, t, { quieto }) {
      if (f === "dirigido" || f === "orquestacion" || f === "lakeflow") {
        // Ejecución por niveles: las tareas del mismo nivel corren en paralelo
        reloj += dt * (reducido ? 0 : 1);
        const nivel = Math.floor(reloj / 1.1) % 6;
        Object.entries(NODOS).forEach(([id, [, , n]]) => estadoBloque(nodos[id], n === nivel ? "foco" : n < nivel ? "normal" : "tenue"));
      } else if (f === "aciclico") {
        ciclo.material.opacity = 1;
        ciclo.visible = Math.sin(t * 6) > -0.4 || reducido;
      }
    }
  };
}
