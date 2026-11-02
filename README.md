# Presentaciones · Deep Learning y Big Data con Python (SINT-646)

Universidad CENFOTEC · Escuela de Sistemas Inteligentes.

Sitio: **https://cenfotec.github.io/dlbd-presentaciones/**

Una presentación 3D por clase, con un menú de inicio de 8 estaciones («el viaje del dato»). Cada clase sigue la agenda de la guía docente y el contenido de su marco teórico.

## Uso

- **Navegar:** flechas ← →, o los botones del panel. **Esc** vuelve al menú.
- **Índice:** el selector de arriba del panel salta a cualquier sección de la agenda.
- **Profundizar:** cada diapositiva tiene un panel con el detalle del marco teórico para estudiar.
- **Modo liviano:** para computadoras lentas (menos partículas, sin resplandor).
- Cada diapositiva tiene su enlace: `#clase-1-7` abre la Clase 1 en la diapositiva 7.

## Estructura

```
src/
├── clases.js            ← qué clases están publicadas (publicada: true o desde: "AAAA-MM-DD")
├── motor/               ← mundo 3D, escena del curso (menú) y utilidades
└── clases/claseN/       ← agenda, diapositivas y escenas de cada clase
```

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # compila en dist/
```

Cada push a `main` compila y publica el sitio en GitHub Pages (`.github/workflows/publicar.yml`).

## Marca

Colores, logo y elementos gráficos según el Libro de Marca de la Universidad CENFOTEC. Tipografías libres equivalentes: Barlow Semi Condensed (títulos, en lugar de DIN Alternate) y Figtree (texto, en lugar de Circular Std).
