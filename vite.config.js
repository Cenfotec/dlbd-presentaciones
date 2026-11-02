import { defineConfig } from "vite";

// GitHub Pages publica el sitio en /dlbd-presentaciones/
export default defineConfig({
  base: "/dlbd-presentaciones/",
  build: { chunkSizeWarningLimit: 1200 }
});
