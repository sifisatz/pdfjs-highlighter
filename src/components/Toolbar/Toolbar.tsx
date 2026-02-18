import React from "react";
import { PageNavigation } from "./PageNavigation.js";
import { ZoomControls } from "./ZoomControls.js";
import type { PdfHighlighterViewerToolbarProps } from "../../types/viewer.js";

export function Toolbar(props: PdfHighlighterViewerToolbarProps) {
  const {
    page,
    pageCount,
    canGoPrev,
    canGoNext,
    zoom,
    onPrevPage,
    onNextPage,
    onGoToPage,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onDownload,
    showZoomControls = true,
  } = props;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: 8,
        borderBottom: "1px solid #e5e7eb",
        background: "#f9fafb",
      }}
    >
      <PageNavigation
        page={page}
        pageCount={pageCount}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onGoToPage={onGoToPage}
      />
      <ZoomControls
        zoom={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetZoom={onResetZoom}
        showZoomControls={showZoomControls}
      />
      <div style={{ flex: 1 }} />
      <button type="button" onClick={onDownload}>
        Download
      </button>
    </div>
  );
}
