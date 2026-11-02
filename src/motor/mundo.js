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
  const composer = new EffectComposer(renderer);
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
      renderer.setPixelRatio(this.liviano ? 1 : Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight, false);
      composer.setSize(innerWidth, innerHeight);
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
