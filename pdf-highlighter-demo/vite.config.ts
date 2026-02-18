import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@local/pdf-highlighter-viewer": path.resolve(__dirname, "../dist/index.js"),
    },
  },
  server: {
    port: 3441,
    strictPort: false,
    open: true,
    proxy: {
      // Avoid CORS: fetch PDF via same origin; Vite proxies to the real host
      "/pdf-proxy": {
        target: "https://www.sldttc.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdf-proxy/, "/allpdf"),
        secure: true,
      },
    },
  },
});
