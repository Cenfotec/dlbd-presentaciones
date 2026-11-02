import * as THREE from "three";

// Paleta 3D: base marino, líneas celeste, acentos verde de Sistemas Inteligentes.
export const COL = {
  noche: 0x030918,
  marino: 0x164a98,
  azul: 0x006aea,
  celeste: 0x9cc8ff,
  gris: 0x7c7b75,
  verde: 0x2fe39a
};

export const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Etiquetas HTML que siguen a un objeto 3D. `visible(estado)` decide cuándo se muestran. */
export class Etiquetas {
  constructor(contenedor) {
    this.contenedor = contenedor;
    this.lista = [];
    this.v = new THREE.Vector3();
  }
  crear(texto, objeto, desfase, visible) {
    const el = document.createElement("div");
    el.className = "etiqueta3d";
    el.textContent = texto;
    el.hidden = true;
    this.contenedor.appendChild(el);
    const e = { el, objeto, desfase: desfase || new THREE.Vector3(), visible: visible || (() => true) };
    this.lista.push(e);
    return e;
  }
  proyectar(camara, estado, limite = innerWidth) {
    const w = innerWidth, h = innerHeight;
    for (const e of this.lista) {
      if (!e.visible(estado)) { e.el.hidden = true; continue; }
      e.objeto.getWorldPosition(this.v);
      this.v.add(e.desfase).project(camara);
      const x = (this.v.x * 0.5 + 0.5) * w;
      // No se dibujan etiquetas detrás del panel de contenido.
      e.el.hidden = this.v.z >= 1 || x > limite;
      e.el.style.transform = `translate(${x}px, ${(-this.v.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
    }
  }
  ocultarTodas() { this.lista.forEach((e) => (e.el.hidden = true)); }
}

export function estrellas(n, r, y0, color, opacidad = 0.55) {
  const g = new THREE.BufferGeometry();
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    a[i * 3] = (Math.random() - 0.5) * r;
    a[i * 3 + 1] = y0 + Math.random() * r * 0.4;
    a[i * 3 + 2] = (Math.random() - 0.5) * r;
  }
  g.setAttribute("position", new THREE.BufferAttribute(a, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color, size: 0.6, transparent: true, opacity: opacidad, depthWrite: false }));
}

/** Contornos de una geometría, en el estilo de línea del libro de marca. */
export function contorno(geo, color, opacidad = 1, umbral = 20) {
  return new THREE.LineSegments(new THREE.EdgesGeometry(geo, umbral),
    new THREE.LineBasicMaterial({ color, transparent: opacidad < 1, opacity: opacidad }));
}

/** Escena base: fondo, niebla, luces, piso de retícula y estrellas. */
export function escenaBase({ niebla = 0.009, piso = true, estrellasN = 700 } = {}) {
  const escena = new THREE.Scene();
  escena.background = new THREE.Color(COL.noche);
  escena.fog = new THREE.FogExp2(COL.noche, niebla);
  escena.add(new THREE.AmbientLight(0x8fa8d8, 0.7));
  const luz = new THREE.DirectionalLight(0xcfe2ff, 0.8);
  luz.position.set(30, 60, 40);
  escena.add(luz);
  if (piso) {
    const grid = new THREE.GridHelper(400, 100, COL.marino, COL.marino);
    grid.material.transparent = true;
    grid.material.opacity = 0.4;
    escena.add(grid);
  }
  if (estrellasN) escena.add(estrellas(estrellasN, 400, 25, COL.celeste, 0.4));
  return escena;
}

/** Un objeto sólido marino con contorno celeste: la pieza básica de las escenas. */
export function bloque(geo, { color = COL.marino, linea = COL.celeste, opacidad = 1 } = {}) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: 0.3, roughness: 0.5, metalness: 0.15,
    transparent: opacidad < 1, opacity: opacidad, depthWrite: opacidad >= 1
  }));
  g.add(m);
  const l = contorno(geo, linea);
  g.add(l);
  g.userData = { malla: m, linea: l };
  return g;
}

/** Enciende o apaga un bloque: verde cuando está en foco, celeste normal, tenue cuando está en segundo plano. */
export function estadoBloque(b, estado) {
  const { malla, linea } = b.userData;
  const c = estado === "foco" ? COL.verde : estado === "tenue" ? COL.marino : COL.celeste;
  linea.material.color.set(c);
  malla.material.emissiveIntensity = estado === "foco" ? 0.6 : estado === "tenue" ? 0.12 : 0.3;
}

/** Curva suave entre dos puntos, levantada en el medio. */
export function curvaEntre(a, b, alto = 3) {
  const m = a.clone().lerp(b, 0.5);
  m.y += alto;
  return new THREE.QuadraticBezierCurve3(a.clone(), m, b.clone());
}

/** Tubo fino a lo largo de una curva. */
export function tubo(curva, color = COL.celeste, radio = 0.14, opacidad = 1) {
  return new THREE.Mesh(new THREE.TubeGeometry(curva, 64, radio, 8, false),
    new THREE.MeshBasicMaterial({ color, transparent: opacidad < 1, opacity: opacidad, depthWrite: opacidad >= 1 }));
}

/**
 * Partículas que recorren varias curvas. En cada cuadro, `estadoCurva(i)` devuelve
 * "foco" (verde), "normal" (celeste) o "apagada" (se funde con el fondo).
 */
export function flujo(curvas, porCurva = 40, color = COL.celeste, tam = 0.45) {
  const n = curvas.length * porCurva;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const t = Float32Array.from({ length: n }, () => Math.random());
  const vel = Float32Array.from({ length: n }, () => 0.12 + Math.random() * 0.1);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const puntos = new THREE.Points(geo, new THREE.PointsMaterial({ size: tam, vertexColors: true, transparent: true, depthWrite: false }));
  const base = new THREE.Color(color), verde = new THREE.Color(COL.verde), apagado = new THREE.Color(COL.noche);
  const v = new THREE.Vector3();
  return {
    puntos,
    actualizar(dt, quieto, estadoCurva = () => "normal") {
      for (let k = 0; k < n; k++) {
        const c = Math.floor(k / porCurva);
        t[k] = (t[k] + dt * vel[k] * quieto) % 1;
        curvas[c].getPointAt(t[k], v);
        pos[k * 3] = v.x; pos[k * 3 + 1] = v.y; pos[k * 3 + 2] = v.z;
        const e = estadoCurva(c);
        (e === "foco" ? verde : e === "apagada" ? apagado : base).toArray(col, k * 3);
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
    }
  };
}
