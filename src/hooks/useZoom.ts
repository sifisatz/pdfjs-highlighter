import { useCallback, useState } from "react";
import { zoomIn, zoomOut } from "../controllers/zoomController.js";

export function useZoom(
  initialZoom: number,
  minZoom: number,
  maxZoom: number,
  zoomStep: number,
) {
  const [zoom, setZoom] = useState(initialZoom);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => zoomIn(prev, zoomStep, maxZoom));
  }, [zoomStep, maxZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => zoomOut(prev, zoomStep, minZoom));
  }, [zoomStep, minZoom]);

  const handleResetZoom = useCallback(() => {
    setZoom(initialZoom);
  }, [initialZoom]);

  return {
    zoom,
    setZoom,
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
    resetZoom: handleResetZoom,
  };
}
