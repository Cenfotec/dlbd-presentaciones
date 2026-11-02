import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// Resplandor sutil: solo realza los bordes de neón, sin lavar la escena.
const BLOOM = { fuerza: 0.32, radio: 0.35, umbral: 0.62 };

/** Renderizador, cámara y posprocesado compartidos por el menú y las clases. */
export function crearMundo(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (e) {
    return null;
  }
  const camara = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1500);
  const mira = new THREE.Vector3();
  // Render target con multisampling: sin esto el posprocesado pierde el antialiasing y los bordes se ven pixeleados.
  const objetivo = new THREE.WebGLRenderTarget(innerWidth, innerHeight, { samples: 4, type: THREE.HalfFloatType });
  const composer = new EffectComposer(renderer, objetivo);
  const pasada = new RenderPass(new THREE.Scene(), camara);
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), BLOOM.fuerza, BLOOM.radio, BLOOM.umbral);
  composer.addPass(pasada);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const mundo = {
    renderer, camara, mira, liviano: false, escena: null,
    usar(escena) { this.escena = escena; pasada.scene = escena; },
    ajustar() {
      camara.aspect = innerWidth / innerHeight;
      camara.updateProjectionMatrix();
      const ratio = this.liviano ? 1 : Math.min(devicePixelRatio, 2);
      renderer.setPixelRatio(ratio);
      renderer.setSize(innerWidth, innerHeight, false);
      // El composer guarda su propia densidad de píxeles: hay que actualizarla o se ve pixeleado en pantallas HiDPI.
      composer.setPixelRatio(ratio);
      composer.setSize(innerWidth, innerHeight);
    },
    correr(px) {
      if (Math.abs(px) < 0.5) { if (camara.view) { camara.clearViewOffset(); } return; }
      camara.setViewOffset(innerWidth, innerHeight, px, 0, innerWidth, innerHeight);
    },
    render() {
      camara.lookAt(mira);
      bloom.enabled = !this.liviano;
      composer.render();
    }
  };
  addEventListener("resize", () => mundo.ajustar());
  mundo.ajustar();
  return mundo;
}
