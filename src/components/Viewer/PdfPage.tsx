import React, { useEffect, useRef } from "react";
import type { PDFPageProxy } from "pdfjs-dist/types/src/display/api.js";

export type PdfPageProps = {
  pageProxy: PDFPageProxy | null;
  zoom: number;
};

export function PdfPage({ pageProxy, zoom }: PdfPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!pageProxy || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    const viewport = pageProxy.getViewport({ scale: zoom });

    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const task = pageProxy.render({
      canvasContext: ctx,
      viewport,
      canvas,
    } as any);

    return () => {
      task.cancel();
    };
  }, [pageProxy, zoom]);

  return <canvas ref={canvasRef} />;
}
