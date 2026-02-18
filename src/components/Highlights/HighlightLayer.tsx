import React from "react";
import { mapHighlightsToViewport } from "../../services/coordinateMapper.js";
import type { PDFPageProxy } from "pdfjs-dist/types/src/display/api.js";
import type { Highlight } from "../../types/Highlight.js";
import { HighlightRect } from "./HighlightRect.js";

export type HighlightLayerProps = {
  highlights: Highlight[] | undefined;
  pageNumber: number;
  pageProxy: PDFPageProxy | null;
  zoom: number;
  focusedHighlightId: string | null;
  enableHighlightNavigation: boolean;
  onHighlightClick?: (highlight: Highlight) => void;
  onHighlightInteraction: (highlight: Highlight) => void;
  renderHighlightTooltip?: (highlight: Highlight) => React.ReactNode;
  highlightRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
};

export function HighlightLayer({
  highlights,
  pageNumber,
  pageProxy,
  zoom,
  focusedHighlightId,
  enableHighlightNavigation,
  onHighlightClick,
  onHighlightInteraction,
  renderHighlightTooltip,
  highlightRefs,
}: HighlightLayerProps) {
  const rendered = mapHighlightsToViewport(highlights, pageNumber, pageProxy, zoom);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
      }}
    >
      {rendered.map((h) => (
        <HighlightRect
          key={h.id}
          highlight={h}
          isFocused={focusedHighlightId === h.id}
          isClickable={onHighlightClick != null || enableHighlightNavigation}
          onHighlightClick={() => {
            onHighlightClick?.(h);
            onHighlightInteraction(h);
          }}
          renderTooltip={renderHighlightTooltip}
          setRef={(el) => {
            if (el) highlightRefs.current.set(h.id, el);
            else highlightRefs.current.delete(h.id);
          }}
        />
      ))}
    </div>
  );
}
