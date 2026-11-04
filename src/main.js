import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/barlow-semi-condensed/500.css";
import "@fontsource/barlow-semi-condensed/600.css";
import "@fontsource/barlow-semi-condensed/700.css";
import "./estilos.css";

import * as THREE from "three";
import gsap from "gsap";
import { CLASES, estaPublicada } from "./clases.js";
import { crearMundo } from "./motor/mundo.js";
import { crearCurso } from "./motor/curso.js";
import { Etiquetas, reducido } from "./motor/util.js";
import clase1 from "./clases/clase1/index.js";
import clase2 from "./clases/clase2/index.js";

const MODULOS = { 1: clase1, 2: clase2 };
const $ = (s) => document.querySelector(s);
const DUR = reducido ? 0.01 : 1;
const CAM_MENU = { cam: [0, 58, 104], mira: [0, -8, -4] };

const mundo = crearMundo($("#escena"));
const etiquetas = new Etiquetas($("#etiquetas"));
const curso = crearCurso(CLASES, estaPublicada);

const estado = { vista: "menu", escena: "curso", clase: null, i: 0, paso: {}, enVuelo: false, sobre: null };
let escenas = { curso };
try { if (mundo) mundo.liviano = localStorage.getItem("dlbd-liviano") === "1"; } catch (e) { /* sin almacenamiento */ }

/* ---------- Menú ---------- */
const listaEst = $("#estaciones");
CLASES.forEach((c) => {
  const abierta = estaPublicada(c) && MODULOS[c.n];
  const li = document.createElement("li");
  const b = document.createElement("button");
  b.className = "estacion " + (abierta ? "abierta" : "cerrada");
  b.type = "button";
  b.id = "est-" + c.n;
  b.innerHTML = `<span class="num">${String(c.n).padStart(2, "0")}</span><span class="nom">${c.nombre}</span><span class="est">${abierta ? "Disponible · entrar" : "Próximamente"}</span>`;
  if (abierta) b.addEventListener("click", () => abrirClase(c.n));
  else b.setAttribute("aria-disabled", "true");
  li.appendChild(b);
  listaEst.appendChild(li);
});

if (mundo) {
  mundo.usar(curso.escena);
  mundo.camara.position.set(...CAM_MENU.cam);
  mundo.mira.set(...CAM_MENU.mira);
} else {
  const a = document.createElement("p");
  a.className = "aviso-webgl";
  a.textContent = "Tu navegador no pudo iniciar el 3D. Puedes recorrer el contenido igual con los botones y el panel de texto.";
  document.body.appendChild(a);
  listaEst.classList.add("sin-3d");
}

const ray = new THREE.Raycaster();
const raton = new THREE.Vector2();
const parallax = { x: 0, y: 0 };
$("#escena").addEventListener("pointermove", (ev) => {
  raton.set((ev.clientX / innerWidth) * 2 - 1, -(ev.clientY / innerHeight) * 2 + 1);
  parallax.x = raton.x; parallax.y = raton.y;
  if (estado.vista !== "menu" || !mundo) return;
  ray.setFromCamera(raton, mundo.camara);
  const hit = ray.intersectObjects(curso.objetivos)[0];
  estado.sobre = hit ? hit.object.userData.n : null;
  $("#escena").style.cursor = estado.sobre ? "pointer" : "default";
});
$("#escena").addEventListener("click", () => { if (estado.vista === "menu" && estado.sobre) abrirClase(estado.sobre); });

/* ---------- Clase ---------- */
const selSeccion = $("#p-seccion");
const prog = $("#p-progreso");

function transicion(cb) {
  gsap.to("#cortina", {
    opacity: 1, duration: 0.5 * DUR,
    onComplete: () => { cb(); gsap.to("#cortina", { opacity: 0, duration: 0.7 * DUR, delay: 0.05 }); }
  });
}

function moverCamara(p, inmediato) {
  if (!mundo) return;
  const d = inmediato ? 0 : 2.2 * DUR;
  gsap.to(mundo.camara.position, { x: p.cam[0], y: p.cam[1], z: p.cam[2], duration: d, ease: "power2.inOut", overwrite: true });
  gsap.to(mundo.mira, { x: p.mira[0], y: p.mira[1], z: p.mira[2], duration: d, ease: "power2.inOut", overwrite: true });
}

function pintarPaso(cambioEscena) {
  const mod = estado.clase;
  const p = mod.pasos[estado.i];
  estado.paso = p;
  const sec = mod.agenda.find((a) => a.id === p.seccion);
  selSeccion.value = p.seccion;
  $("#p-contador").textContent = `${estado.i + 1} / ${mod.pasos.length}`;
  $("#p-cuerpo").innerHTML = `<div class="ojo">${p.ojo || sec.nombre}</div><h2>${p.t}</h2>${p.html}` +
    (p.mas ? `<details id="profundizar-${estado.i}"><summary>Profundizar</summary><div class="mas">${p.mas}</div></details>` : "");
  [...prog.children].forEach((el, k) => el.classList.toggle("hecho", k <= estado.i));
  $("#btn-ant").disabled = estado.i === 0;
  $("#btn-sig").textContent = estado.i === mod.pasos.length - 1 ? "Volver al menú" : "Siguiente →";
  history.replaceState(null, "", `#clase-${mod.n}-${estado.i + 1}`);
  const esc = escenas[p.escena];
  if (esc && esc.alPaso) esc.alPaso(p);
  moverCamara(p, cambioEscena);
}

function irA(i) {
  const mod = estado.clase;
  i = Math.max(0, Math.min(mod.pasos.length - 1, i));
  const nueva = mod.pasos[i].escena;
  if (nueva !== estado.escena) {
    transicion(() => {
      estado.i = i; estado.escena = nueva;
      if (mundo) mundo.usar(escenas[nueva].escena);
      pintarPaso(true);
    });
  } else { estado.i = i; pintarPaso(false); }
}
function avanzar(d) {
  if (estado.vista !== "clase") return;
  if (d > 0 && estado.i === estado.clase.pasos.length - 1) return volverMenu();
  irA(estado.i + d);
}

function abrirClase(n, pasoInicial = 0, directo = false) {
  const mod = MODULOS[n];
  if (!mod || estado.vista === "clase" || estado.enVuelo) return;
  const entrar = () => transicion(() => {
    estado.vista = "clase"; estado.clase = mod;
    escenas = { curso, ...(mod._escenas || (mod._escenas = mod.crearEscenas({ etiquetas }))) };
    selSeccion.innerHTML = mod.agenda.map((a) => {
      const k = mod.pasos.findIndex((p) => p.seccion === a.id);
      return `<option value="${a.id}" ${k < 0 ? "disabled" : ""}>${a.nombre}${k < 0 ? " · en preparación" : ""}</option>`;
    }).join("");
    prog.innerHTML = mod.pasos.map(() => "<i></i>").join("");
    $("#vista-menu").hidden = true; $("#vista-clase").hidden = false; $("#btn-menu").hidden = false;
    estado.i = Math.max(0, Math.min(mod.pasos.length - 1, pasoInicial));
    estado.escena = mod.pasos[estado.i].escena;
    if (mundo) mundo.usar(escenas[estado.escena].escena);
    pintarPaso(true);
  });
  const est = curso.estaciones[n - 1].position;
  if (mundo && !reducido && !directo) {
    estado.enVuelo = true;
    gsap.to(mundo.camara.position, { x: est.x + 6, y: 9, z: est.z + 14, duration: 1.3, ease: "power2.in", onComplete: () => { estado.enVuelo = false; entrar(); } });
    gsap.to(mundo.mira, { x: est.x, y: 6, z: est.z, duration: 1.3, ease: "power2.in" });
  } else entrar();
}

function volverMenu() {
  if (estado.vista === "menu") return;
  transicion(() => {
    estado.vista = "menu"; estado.escena = "curso"; estado.clase = null;
    $("#vista-menu").hidden = false; $("#vista-clase").hidden = true; $("#btn-menu").hidden = true;
    etiquetas.ocultarTodas();
    if (mundo) { mundo.usar(curso.escena); moverCamara(CAM_MENU, true); }
    history.replaceState(null, "", location.pathname + location.search);
  });
}

selSeccion.addEventListener("change", () => {
  const k = estado.clase.pasos.findIndex((p) => p.seccion === selSeccion.value);
  if (k >= 0) irA(k);
  selSeccion.blur();
});
$("#btn-ant").addEventListener("click", () => avanzar(-1));
$("#btn-sig").addEventListener("click", () => avanzar(1));
$("#btn-menu").addEventListener("click", volverMenu);
addEventListener("keydown", (ev) => {
  if (ev.target.tagName === "SELECT") return;
  if (["ArrowRight", "PageDown"].includes(ev.key)) { ev.preventDefault(); avanzar(1); }
  if (["ArrowLeft", "PageUp"].includes(ev.key)) { ev.preventDefault(); avanzar(-1); }
  if (ev.key === "Escape") volverMenu();
});

const btnLiv = $("#btn-liviano");
function pintarLiviano() {
  btnLiv.setAttribute("aria-pressed", String(!!(mundo && mundo.liviano)));
  if (mundo) mundo.ajustar();
}
btnLiv.addEventListener("click", () => {
  if (!mundo) return;
  mundo.liviano = !mundo.liviano;
  try { localStorage.setItem("dlbd-liviano", mundo.liviano ? "1" : "0"); } catch (e) { /* sin almacenamiento */ }
  pintarLiviano();
});
pintarLiviano();

function leerHash() {
  const m = location.hash.match(/^#clase-(\d+)(?:-(\d+))?$/);
  if (m) abrirClase(Number(m[1]), m[2] ? Number(m[2]) - 1 : 0, true);
}
addEventListener("hashchange", () => { if (!location.hash) volverMenu(); });

/* ---------- Bucle ---------- */
const reloj = new THREE.Clock();
const v = new THREE.Vector3();
function proyectarEstaciones() {
  CLASES.forEach((c, k) => {
    const el = document.getElementById("est-" + c.n);
    if (!mundo) return;
    v.copy(curso.estaciones[k].position).add({ x: 0, y: 14, z: 0 }).project(mundo.camara);
    el.style.transform = `translate(${(v.x * 0.5 + 0.5) * innerWidth}px, ${(-v.y * 0.5 + 0.5) * innerHeight}px) translate(-50%, -100%)`;
    el.style.visibility = v.z < 1 && estado.vista === "menu" ? "visible" : "hidden";
  });
}
let corrimiento = 0;
function animar() {
  requestAnimationFrame(animar);
  if (!mundo) return;
  const dt = Math.min(reloj.getDelta(), 0.05), t = reloj.elapsedTime;
  const quieto = reducido ? 0 : 1;
  const ctx = { quieto, liviano: mundo.liviano, camara: mundo.camara, resaltada: estado.vista === "menu" ? estado.sobre : estado.paso.resaltada };
  escenas[estado.escena].actualizar(dt, t, ctx);
  if (estado.vista === "menu" && !estado.enVuelo && !reducido) {
    mundo.camara.position.x += ((CAM_MENU.cam[0] + parallax.x * 8) - mundo.camara.position.x) * 0.02;
    mundo.camara.position.y += ((CAM_MENU.cam[1] + parallax.y * 4) - mundo.camara.position.y) * 0.02;
  }
  // En una clase, el panel ocupa la derecha: se corre el centro óptico hacia el espacio libre.
  const panel = estado.vista === "clase" && innerWidth > 760 ? $(".panel").getBoundingClientRect() : null;
  const meta = panel ? (innerWidth - panel.left) / 2 : 0;
  corrimiento += (meta - corrimiento) * Math.min(1, dt * 4);
  mundo.correr(corrimiento);
  mundo.render();
  proyectarEstaciones();
  etiquetas.proyectar(mundo.camara, { vista: estado.vista, escena: estado.escena, paso: estado.paso }, panel ? panel.left - 12 : innerWidth);
}
animar();
leerHash();
