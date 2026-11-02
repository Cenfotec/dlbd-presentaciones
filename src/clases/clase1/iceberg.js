import * as THREE from "three";
import { COL, estrellas, contorno } from "../../motor/util.js";

/** Escena «¿Qué es un pipeline de datos?»: el iceberg analítico y el tubo que sube del fondo a la punta. */
export function crearIceberg(etiquetas) {
  const escena = new THREE.Scene();
  escena.background = new THREE.Color(COL.noche);
  escena.fog = new THREE.FogExp2(COL.noche, 0.006);
  escena.add(new THREE.AmbientLight(0x8fa8d8, 0.55));
  const sol = new THREE.DirectionalLight(0xcfe2ff, 0.8);
  sol.position.set(30, 60, 40);
  escena.add(sol);
  const luzFondo = new THREE.PointLight(COL.celeste, 1.2, 120);
  luzFondo.position.set(0, -40, 20);
  escena.add(luzFondo);
  escena.add(estrellas(1200, 700, 20, COL.celeste, 0.45));

  // Superficie del agua: plano translúcido con retícula
  const agua = new THREE.Mesh(new THREE.PlaneGeometry(700, 700),
    new THREE.MeshBasicMaterial({ color: COL.marino, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }));
  agua.rotation.x = -Math.PI / 2;
  escena.add(agua);
  const reticula = new THREE.GridHelper(700, 140, COL.celeste, COL.celeste);
  reticula.material.transparent = true;
  reticula.material.opacity = 0.14;
  escena.add(reticula);

  // El iceberg: una punta pequeña y una masa sumergida enorme
  function roca(esc, pos, semilla, det) {
    const g = new THREE.IcosahedronGeometry(1, det);
    const p = g.attributes.position;
    const v = new THREE.Vector3();
    const ruido = (x, y, z) => Math.sin(x * 3.1 + semilla) * Math.cos(y * 2.3 + semilla * 0.7) * Math.sin(z * 2.9 + semilla * 1.3);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      v.multiplyScalar(1 + 0.22 * ruido(v.x, v.y, v.z) + 0.08 * ruido(v.x * 3, v.y * 3, v.z * 3));
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.scale(...esc); g.translate(...pos); g.computeVertexNormals();
    return g;
  }
  [roca([7, 13, 6.5], [0, 2.5, 0], 1.7, 2), roca([24, 30, 21], [0, -26, 0], 4.2, 3)].forEach((g, i) => {
    escena.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({
      color: i ? 0x0b2253 : 0x1d4f93, emissive: i ? 0x02081a : 0x081c44,
      transparent: true, opacity: i ? 0.3 : 0.6, flatShading: true, roughness: 0.6, depthWrite: false
    })));
    escena.add(contorno(g, i ? COL.marino : COL.celeste, i ? 0.9 : 0.75, 8));
  });

  // El pipeline: tubo que sube desde las fuentes, en el fondo, hasta la punta
  const tubo = new THREE.CatmullRomCurve3([
    [0, -54, 8], [10, -46, 12], [12, -38, 13], [-8, -32, 14], [-12, -24, 14], [8, -18, 14], [12, -12, 12],
    [-6, -5, 12], [-9, 0, 9], [-4, 5, 6], [0, 10, 3], [0, 13.5, 1]
  ].map((p) => new THREE.Vector3(...p)));
  escena.add(new THREE.Mesh(new THREE.TubeGeometry(tubo, 400, 0.32, 10, false), new THREE.MeshBasicMaterial({ color: COL.celeste })));
  escena.add(new THREE.Mesh(new THREE.TubeGeometry(tubo, 400, 0.85, 10, false),
    new THREE.MeshBasicMaterial({ color: COL.marino, transparent: true, opacity: 0.4, depthWrite: false })));

  const ETAPAS = [["Origen", 0.0], ["Ingesta", 0.2], ["Almacenamiento", 0.38], ["Limpieza", 0.56], ["Modelado", 0.74], ["Consumo", 1.0]];
  const U_LIMPIEZA = 0.56;
  const anillos = ETAPAS.map(([nombre, u], i) => {
    const p = tubo.getPointAt(u), t = tubo.getTangentAt(u);
    const a = new THREE.Mesh(new THREE.TorusGeometry(i === 3 ? 2.6 : 2, 0.2, 12, 48), new THREE.MeshBasicMaterial({ color: COL.celeste }));
    a.position.copy(p);
    a.lookAt(p.clone().add(t));
    escena.add(a);
    a.userData.e = etiquetas.crear(nombre, a, new THREE.Vector3(0, 3.6, 0), (s) => s.escena === "iceberg");
    return a;
  });

  // Las fuentes, en el fondo: API, base de datos y archivos
  const fuentes = new THREE.Group();
  [[new THREE.OctahedronGeometry(2.4), [-10, -56, 2], "API"],
   [new THREE.CylinderGeometry(2, 2, 3.6, 24), [0, -57, -4], "Base de datos"],
   [new THREE.BoxGeometry(3, 3.8, 0.6), [10, -56, 2], "Archivos"]].forEach(([g, p, n]) => {
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: COL.marino, emissive: COL.marino, emissiveIntensity: 0.5 }));
    m.position.set(...p);
    m.add(contorno(g, COL.celeste));
    fuentes.add(m);
    etiquetas.crear(n, m, new THREE.Vector3(0, -3.6, 0), (s) => s.escena === "iceberg" && s.paso.marca === "origen");
  });
  escena.add(fuentes);

  // Lo visible: tres paneles con íconos de línea alrededor de la punta
  function icono(tipo) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const x = c.getContext("2d");
    x.fillStyle = "rgba(3,9,24,0.9)"; x.strokeStyle = "#9cc8ff"; x.lineWidth = 8; x.lineCap = x.lineJoin = "round";
    x.beginPath(); x.roundRect(8, 8, 240, 240, 28); x.fill(); x.stroke();
    x.lineWidth = 10;
    if (tipo === 0) { [[60, 170], [110, 120], [160, 80]].forEach(([px, h]) => x.strokeRect(px, h, 34, 210 - h)); x.beginPath(); x.moveTo(40, 210); x.lineTo(220, 210); x.stroke(); }
    if (tipo === 1) { x.beginPath(); x.arc(128, 120, 64, 0, Math.PI * 2); x.stroke(); x.fillStyle = "#9cc8ff"; [100, 128, 156].forEach((px) => { x.beginPath(); x.arc(px, 120, 7, 0, Math.PI * 2); x.fill(); }); x.beginPath(); x.moveTo(84, 168); x.lineTo(64, 206); x.lineTo(112, 182); x.stroke(); }
    if (tipo === 2) { x.beginPath(); x.moveTo(44, 190); x.lineTo(96, 140); x.lineTo(136, 164); x.lineTo(206, 76); x.stroke(); x.beginPath(); x.moveTo(170, 76); x.lineTo(206, 76); x.lineTo(206, 112); x.stroke(); }
    const tx = new THREE.CanvasTexture(c);
    tx.colorSpace = THREE.SRGBColorSpace;
    return tx;
  }
  const apps = [["Tableros de BI", [0, 20.5, 0]], ["Aplicaciones con LLM", [-9, 17, 2]], ["Modelos predictivos", [9, 17, 2]]].map(([n, p], i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: icono(i), transparent: true, side: THREE.DoubleSide }));
    m.position.set(...p);
    escena.add(m);
    escena.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...p), new THREE.Vector3(0, 13.5, 1)]),
      new THREE.LineBasicMaterial({ color: COL.celeste, transparent: true, opacity: 0.6 })));
    etiquetas.crear(n, m, new THREE.Vector3(0, -3.2, 0), (s) => s.escena === "iceberg" && ["punta", "consumo", "basura"].includes(s.paso.marca));
    return m;
  });

  // Datos que viajan por el tubo: celestes (buenos) y grises (con problemas)
  const ND = 520;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(ND * 3), col = new Float32Array(ND * 3);
  const tt = new Float32Array(ND), vel = new Float32Array(ND), sucio = new Uint8Array(ND), jit = new Float32Array(ND * 3);
  const cBueno = new THREE.Color(COL.celeste), cSucio = new THREE.Color(COL.gris);
  for (let i = 0; i < ND; i++) {
    tt[i] = Math.random(); vel[i] = 0.035 + Math.random() * 0.03; sucio[i] = Math.random() < 0.3 ? 1 : 0;
    for (let k = 0; k < 3; k++) jit[i * 3 + k] = (Math.random() - 0.5) * 0.9;
    (sucio[i] ? cSucio : cBueno).toArray(col, i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  escena.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.75, vertexColors: true, transparent: true, depthWrite: false })));

  let filtro = true;
  const v = new THREE.Vector3();
  return {
    escena,
    alPaso(paso) {
      anillos.forEach((a, i) => {
        const act = i === paso.etapa;
        a.material.color.set(act ? COL.verde : COL.celeste);
        a.userData.e.el.classList.toggle("activa", act);
      });
      filtro = paso.marca !== "basura";
    },
    actualizar(dt, t, { quieto, liviano, camara }) {
      const n = liviano ? ND / 3 : ND;
      geo.setDrawRange(0, n);
      for (let i = 0; i < n; i++) {
        tt[i] += dt * vel[i] * quieto;
        if (sucio[i] && filtro && tt[i] > U_LIMPIEZA) tt[i] = 0;
        if (tt[i] > 1) tt[i] = 0;
        tubo.getPointAt(tt[i], v);
        pos[i * 3] = v.x + jit[i * 3]; pos[i * 3 + 1] = v.y + jit[i * 3 + 1]; pos[i * 3 + 2] = v.z + jit[i * 3 + 2];
      }
      geo.attributes.position.needsUpdate = true;
      anillos.forEach((a, i) => { a.rotation.z += dt * 0.6 * quieto * (i % 2 ? 1 : -1); });
      fuentes.children.forEach((m) => { m.rotation.y += dt * 0.4 * quieto; });
      apps.forEach((m, i) => {
        m.material.opacity = filtro ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(t * 9 + i));
        m.lookAt(camara.position);
      });
      const bajoAgua = camara.position.y < 0;
      escena.fog.density = bajoAgua ? 0.015 : 0.006;
      reticula.material.opacity = bajoAgua ? 0.07 : 0.14;
    }
  };
}
