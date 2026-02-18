import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { loadPdfDocument } from "../services/pdfLoader.js";
import type { PdfFileSource } from "../types/source.js";
import { clampPage } from "../controllers/navigationController.js";

export function usePdfDocument(
  source: PdfFileSource,
  initialPage: number,
): {
  pdfDocument: PDFDocumentProxy | null;
  pageCount: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
} {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(initialPage);
  const prevDocRef = useRef<PDFDocumentProxy | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (prevDocRef.current) {
        await prevDocRef.current.destroy();
        prevDocRef.current = null;
      }
      try {
        const doc = await loadPdfDocument(source);
        if (cancelled) {
          await doc.destroy();
          return;
        }
        prevDocRef.current = doc;
        setPdfDocument(doc);
        setPageCount(doc.numPages);
        setPage((prev) => clampPage(prev, doc.numPages));
      } catch (err) {
        if (!cancelled) {
          setPdfDocument(null);
          setPageCount(0);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [source]);

  return { pdfDocument, pageCount, page, setPage };
}
