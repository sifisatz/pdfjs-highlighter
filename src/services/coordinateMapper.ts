import type { PDFPageProxy } from "pdfjs-dist/types/src/display/api.js";
import type { Highlight } from "../types/Highlight.js";

export type RenderedHighlight = Highlight & {
  left: number;
  top: number;
  widthPx: number;
  heightPx: number;
};

/**
 * Map highlight definitions to screen coordinates for the current page and scale.
 * Uses the same viewport scale as the PDF canvas so highlights stay aligned.
 */
export function mapHighlightsToViewport(
  highlights: Highlight[] | undefined,
  pageNumber: number,
  page: PDFPageProxy | null,
  scale: number,
): RenderedHighlight[] {
  if (!highlights || !page) return [];

  const viewport = page.getViewport({ scale });
  const pageWidth = viewport.width;
  const pageHeight = viewport.height;

  return highlights
    .filter((h) => h.page === pageNumber)
    .map<RenderedHighlight>((h) => {
      const space = h.coordinateSpace ?? "percent";

      if (space === "percent") {
        return {
          ...h,
          left: h.x * pageWidth,
          top: h.y * pageHeight,
          widthPx: h.width * pageWidth,
          heightPx: h.height * pageHeight,
        };
      }

      const left = h.x * scale;
      const widthPx = h.width * scale;
      const heightPx = h.height * scale;
      const topFromBottom = h.y * scale;
      const top = pageHeight - topFromBottom - heightPx;
      return { ...h, left, top, widthPx, heightPx };
    });
}
