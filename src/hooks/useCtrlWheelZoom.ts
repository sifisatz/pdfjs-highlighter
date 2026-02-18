import { useEffect, useRef } from "react";
import { zoomFromWheelDelta } from "../controllers/zoomController.js";

export function useCtrlWheelZoom(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: {
    enabled: boolean;
    zoom: number;
    setZoom: (value: number | ((prev: number) => number)) => void;
    zoomStep: number;
    minZoom: number;
    maxZoom: number;
  },
) {
  const { enabled, zoom, setZoom, zoomStep, minZoom, maxZoom } = options;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const rafRef = useRef<number | null>(null);
  const pendingDeltaRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      pendingDeltaRef.current += e.deltaY;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const delta = pendingDeltaRef.current;
        pendingDeltaRef.current = 0;
        const next = zoomFromWheelDelta(
          zoomRef.current,
          delta,
          zoomStep,
          minZoom,
          maxZoom,
        );
        setZoom(next);
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, zoomStep, minZoom, maxZoom, setZoom]);
}
