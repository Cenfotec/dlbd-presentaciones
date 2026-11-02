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
  proyectar(camara, estado) {
    const w = innerWidth, h = innerHeight;
    for (const e of this.lista) {
      if (!e.visible(estado)) { e.el.hidden = true; continue; }
      e.objeto.getWorldPosition(this.v);
      this.v.add(e.desfase).project(camara);
      e.el.hidden = this.v.z >= 1;
      e.el.style.transform = `translate(${(this.v.x * 0.5 + 0.5) * w}px, ${(-this.v.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
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
