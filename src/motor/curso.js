import * as THREE from "three";
import { COL, estrellas, contorno } from "./util.js";

/**
 * Escena del curso: la ruta con las 8 estaciones, una por clase.
 * La usa el menú y también las diapositivas de agenda, programa y evaluación.
 */
export function crearCurso(clases, estaPublicada) {
  const escena = new THREE.Scene();
  escena.background = new THREE.Color(COL.noche);
  escena.fog = new THREE.FogExp2(COL.noche, 0.0085);
  escena.add(new THREE.AmbientLight(0x8fa8d8, 0.7));
  const luz = new THREE.PointLight(COL.celeste, 1.4, 260);
  luz.position.set(0, 40, 20);
  escena.add(luz);

  const grid = new THREE.GridHelper(600, 120, COL.marino, COL.marino);
  grid.material.transparent = true;
  grid.material.opacity = 0.45;
  grid.position.y = -0.01;
  escena.add(grid);
  escena.add(estrellas(900, 500, 30, COL.celeste, 0.45));

  const ruta = new THREE.CatmullRomCurve3(
    [[-70, 0, 10], [-50, 0, -14], [-30, 0, 8], [-10, 0, -16], [10, 0, 6], [30, 0, -18], [50, 0, 4], [70, 0, -16]]
      .map((p) => new THREE.Vector3(...p))
  );
  escena.add(new THREE.Mesh(new THREE.TubeGeometry(ruta, 300, 0.22, 8, false), new THREE.MeshBasicMaterial({ color: COL.celeste })));
  escena.add(new THREE.Mesh(new THREE.TubeGeometry(ruta, 300, 0.7, 8, false),
    new THREE.MeshBasicMaterial({ color: COL.marino, transparent: true, opacity: 0.35, depthWrite: false })));

  // Estaciones construidas con las piezas del logo: barra alta, barra corta, bloque superior y cuarto de círculo.
  function piezas() {
    const g = [];
    const b1 = new THREE.BoxGeometry(2, 9, 2); b1.translate(-3, 4.5, 0); g.push(b1);
    const b2 = new THREE.BoxGeometry(2, 6.5, 2); b2.translate(1.4, 6.25, 0); g.push(b2);
    const b3 = new THREE.BoxGeometry(4.2, 1.6, 2); b3.translate(1.5, 10.6, 0); g.push(b3);
    const q = new THREE.CylinderGeometry(5.2, 5.2, 2, 24, 1, false, Math.PI, Math.PI / 2);
    q.rotateX(Math.PI / 2); q.translate(2.4, 5.2, 0); g.push(q);
    const base = new THREE.BoxGeometry(11, 0.6, 7); base.translate(0, 0.3, 0); g.push(base);
    return g;
  }

  const estaciones = [];
  const objetivos = [];
  clases.forEach((c, i) => {
    const abierta = estaPublicada(c);
    const grupo = new THREE.Group();
    grupo.position.copy(ruta.getPointAt(i / (clases.length - 1)));
    grupo.rotation.y = -0.35 + i * 0.05;
    piezas().forEach((geo) => {
      grupo.add(contorno(geo, abierta ? COL.celeste : COL.marino, abierta ? 1 : 0.9));
      if (abierta) grupo.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: COL.marino, emissive: COL.marino, emissiveIntensity: 0.35, roughness: 0.45, metalness: 0.2
      })));
    });
    if (abierta) {
      const halo = new THREE.Mesh(new THREE.RingGeometry(7, 7.35, 64), new THREE.MeshBasicMaterial({ color: COL.verde, side: THREE.DoubleSide }));
      halo.rotation.x = -Math.PI / 2; halo.position.y = 0.05;
      grupo.add(halo);
      grupo.userData.halo = halo;
      const caja = new THREE.Mesh(new THREE.BoxGeometry(12, 13, 9), new THREE.MeshBasicMaterial({ visible: false }));
      caja.position.y = 6; caja.userData.n = c.n;
      grupo.add(caja);
      objetivos.push(caja);
    }
    grupo.userData = { ...grupo.userData, clase: c, abierta };
    escena.add(grupo);
    estaciones.push(grupo);
  });

  // Partículas que recorren la ruta: los datos viajando de clase en clase.
  const N = 420;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  const t0 = Float32Array.from({ length: N }, () => Math.random());
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  escena.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: COL.celeste, size: 0.6, transparent: true, opacity: 0.9, depthWrite: false })));
  const v = new THREE.Vector3();

  return {
    escena, ruta, estaciones, objetivos,
    actualizar(dt, t, { quieto, resaltada, liviano }) {
      const n = liviano ? N / 3 : N;
      geo.setDrawRange(0, n);
      for (let i = 0; i < n; i++) {
        t0[i] = (t0[i] + dt * 0.03 * quieto) % 1;
        ruta.getPointAt(t0[i], v);
        pos[i * 3] = v.x; pos[i * 3 + 1] = v.y + 0.25 + Math.sin(i * 7.1) * 0.3; pos[i * 3 + 2] = v.z + Math.cos(i * 3.3) * 0.4;
      }
      geo.attributes.position.needsUpdate = true;
      estaciones.forEach((g) => {
        if (g.userData.halo) g.userData.halo.scale.setScalar(1 + 0.05 * Math.sin(t * 2) * quieto);
        g.children.forEach((m) => {
          if (m.material && m.material.emissiveIntensity !== undefined) m.material.emissiveIntensity = resaltada === g.userData.clase.n ? 0.8 : 0.35;
        });
      });
    }
  };
}
