import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalWorkerOptions } from "pdfjs-dist";
import "./index.css";
import Layout, { HomePage } from "./App.tsx";
import { PdfViewerDemo } from "./components/PdfViewerDemo.tsx";
import { PdfComparisonDemo } from "./pages/PdfComparisonDemo.tsx";

// Required by pdf.js: run in a worker so the main thread stays responsive
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.worker.mjs`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="viewer" element={<PdfViewerDemo />} />
          <Route path="comparison" element={<PdfComparisonDemo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
