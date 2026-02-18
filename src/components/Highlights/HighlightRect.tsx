import React from "react";
import type { RenderedHighlight } from "../../services/coordinateMapper.js";

export type HighlightRectProps = {
  highlight: RenderedHighlight;
  isFocused: boolean;
  isClickable: boolean;
  onHighlightClick: () => void;
  renderTooltip?: (highlight: RenderedHighlight) => React.ReactNode;
  setRef: (el: HTMLDivElement | null) => void;
};

export function HighlightRect({
  highlight,
  isFocused,
  isClickable,
  onHighlightClick,
  renderTooltip,
  setRef,
}: HighlightRectProps) {
  const color = highlight.color ?? "#f97316";
  const opacity = highlight.opacity ?? 0.3;

  const style: React.CSSProperties = {
    position: "absolute",
    left: highlight.left,
    top: highlight.top,
    width: highlight.widthPx,
    height: highlight.heightPx,
    backgroundColor: color,
    opacity,
    borderRadius: 2,
    cursor: isClickable ? "pointer" : "default",
    pointerEvents: "auto",
    boxShadow: isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.8)" : undefined,
    animation: isFocused ? "pdf-highlighter-viewer-pulse 1.5s ease-in-out 2" : undefined,
  };

  const tooltip = renderTooltip?.(highlight);

  return (
    <div
      ref={setRef}
      data-testid="pdf-highlighter-viewer-highlight"
      data-highlight-id={highlight.id}
      className={isFocused ? "pdf-highlighter-viewer-highlight--focused" : undefined}
      style={style}
      onClick={onHighlightClick}
    >
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 4,
            background: "#111827",
            color: "#f9fafb",
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 12,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
