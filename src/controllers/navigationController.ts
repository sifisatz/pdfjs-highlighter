import { clamp } from "../utils/clamp.js";

export function clampPage(page: number, pageCount: number): number {
  if (pageCount <= 0) return 1;
  return clamp(page, 1, pageCount);
}

export function prevPage(current: number): number {
  return Math.max(current - 1, 1);
}

export function nextPage(current: number, pageCount: number): number {
  return Math.min(current + 1, pageCount || current + 1);
}
