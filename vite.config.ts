import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";

// Vite library build for pdf-highlighter-viewer
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "PdfHighlighterViewer",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.esm" : "index.cjs"),
    },
    rollupOptions: {
      // Do not bundle React or pdf.js; leave them as peer deps
      external: ["react", "react-dom", "pdfjs-dist"],
    },
  },
});

