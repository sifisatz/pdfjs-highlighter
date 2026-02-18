import type { Highlight } from "../types/Highlight.js";
import { clampPage } from "./navigationController.js";

export type GoToHighlightResult = {
  page: number;
  highlightId: string;
} | null;

/**
 * Resolve navigation to a highlight: returns the target page and highlight id if valid.
 */
export function resolveGoToHighlight(
  highlightId: string,
  highlights: Highlight[] | undefined,
  pageCount: number,
): GoToHighlightResult | null {
  const h = highlights?.find((x) => x.id === highlightId);
  if (!h || !pageCount || h.page < 1 || h.page > pageCount) return null;
  return {
    page: clampPage(h.page, pageCount),
    highlightId: h.id,
  };
}
