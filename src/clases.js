// Estado de cada clase en el menú.
// "publicada": true la muestra encendida. "desde": "AAAA-MM-DD" la enciende sola a partir de esa fecha (hora de Costa Rica).
export const CLASES = [
  { n: 1, nombre: "Fundamentos de Big Data", publicada: true },
  { n: 2, nombre: "Extracción y carga", publicada: true },
  { n: 3, nombre: "Transformación y calidad" },
  { n: 4, nombre: "Análisis exploratorio" },
  { n: 5, nombre: "Introducción al Deep Learning" },
  { n: 6, nombre: "Modelos preentrenados" },
  { n: 7, nombre: "Pipeline de punta a punta" },
  { n: 8, nombre: "Cierre" }
];

export function estaPublicada(c) {
  if (c.publicada) return true;
  if (!c.desde) return false;
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Costa_Rica" }).format(new Date());
  return hoy >= c.desde;
}
