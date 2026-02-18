import { clamp } from "../utils/clamp.js";

export function clampZoom(zoom: number, minZoom: number, maxZoom: number): number {
  return clamp(zoom, minZoom, maxZoom);
}

export function zoomIn(
  current: number,
  step: number,
  maxZoom: number,
): number {
  return clamp(current + step, current, maxZoom);
}

export function zoomOut(
  current: number,
  step: number,
  minZoom: number,
): number {
  return clamp(current - step, minZoom, current);
}

/** Scroll up (deltaY < 0) => zoom in; scroll down (deltaY > 0) => zoom out. */
export function zoomFromWheelDelta(
  current: number,
  deltaY: number,
  step: number,
  minZoom: number,
  maxZoom: number,
): number {
  const stepScaled = -step * Math.sign(deltaY) * Math.min(Math.abs(deltaY) / 80, 4);
  return clamp(current + stepScaled, minZoom, maxZoom);
}
