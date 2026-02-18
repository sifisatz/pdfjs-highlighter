import { useEffect, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PDFPageProxy } from "pdfjs-dist/types/src/display/api.js";
import { clampPage } from "../controllers/navigationController.js";

export function usePdfPage(
  pdfDocument: PDFDocumentProxy | null,
  pageNumber: number,
): PDFPageProxy | null {
  const [pageProxy, setPageProxy] = useState<PDFPageProxy | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!pdfDocument) {
      setPageProxy(null);
      return;
    }
    const safePage = clampPage(pageNumber, pdfDocument.numPages);
    pdfDocument.getPage(safePage).then((p) => {
      if (!cancelled) setPageProxy(p);
    }).catch(() => {
      if (!cancelled) setPageProxy(null);
    });
    return () => {
      cancelled = true;
    };
  }, [pdfDocument, pageNumber]);

  return pageProxy;
}
