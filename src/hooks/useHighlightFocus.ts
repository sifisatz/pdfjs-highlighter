import { useCallback, useEffect, useRef, useState } from "react";
import type { Highlight } from "../types/Highlight.js";
import { resolveGoToHighlight } from "../controllers/highlightController.js";
import { scrollToHighlight } from "../utils/scrollToHighlight.js";

const FOCUS_ANIMATION_DURATION_MS = 2000;

export function useHighlightFocus(
  highlights: Highlight[] | undefined,
  page: number,
  pageCount: number,
  setPage: (page: number) => void,
  setZoom: (value: number) => void,
  highlightFocusZoom: number | undefined,
  highlightScrollBehavior: "smooth" | "auto",
) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const refs = useRef<Map<string, HTMLDivElement>>(new Map());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToHighlight = useCallback(
    (highlightId: string) => {
      const result = resolveGoToHighlight(highlightId, highlights, pageCount);
      if (!result) return;
      setPendingId(result.highlightId);
      if (highlightFocusZoom != null) setZoom(highlightFocusZoom);
      if (result.page !== page) setPage(result.page);
    },
    [highlights, pageCount, page, setPage, setZoom, highlightFocusZoom],
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!pendingId || !pageCount) return;
    const h = highlights?.find((x) => x.id === pendingId);
    if (!h || h.page !== page) return;
    const el = refs.current.get(pendingId);
    if (!el) return;
    setFocusedId(pendingId);
    setPendingId(null);
    scrollToHighlight(el, { behavior: highlightScrollBehavior, block: "center", inline: "center" });
    timeoutRef.current = setTimeout(() => {
      setFocusedId(null);
      timeoutRef.current = null;
    }, FOCUS_ANIMATION_DURATION_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [page, pendingId, highlights, pageCount, highlightScrollBehavior]);

  return {
    highlightRefs: refs,
    focusedHighlightId: focusedId,
    pendingFocusHighlightId: pendingId,
    setPendingFocusHighlightId: setPendingId,
    goToHighlight,
  };
}
