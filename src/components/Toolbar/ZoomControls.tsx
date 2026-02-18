import React from "react";

export type ZoomControlsProps = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  showZoomControls?: boolean;
};

export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  showZoomControls = true,
}: ZoomControlsProps) {
  if (!showZoomControls) return null;
  return (
    <>
      <span style={{ marginLeft: 12 }}>[ – ]</span>
      <button type="button" onClick={onZoomOut} aria-label="Zoom out">
        –
      </button>
      <span style={{ minWidth: 48, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
      <button type="button" onClick={onZoomIn} aria-label="Zoom in">
        +
      </button>
      <button type="button" onClick={onResetZoom} aria-label="Reset zoom">
        Reset
      </button>
    </>
  );
}
