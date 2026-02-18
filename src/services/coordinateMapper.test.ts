import { describe, it, expect, vi } from "vitest";
import { mapHighlightsToViewport } from "./coordinateMapper.js";

describe("coordinateMapper", () => {
  const mockPage = {
    getViewport: vi.fn(({ scale }: { scale: number }) => ({
      width: 612 * scale,
      height: 792 * scale,
    })),
  } as any;

  it("returns empty array when highlights or page is null", () => {
    expect(mapHighlightsToViewport(undefined, 1, mockPage, 1)).toEqual([]);
    expect(mapHighlightsToViewport([], 1, null, 1)).toEqual([]);
  });

  it("filters by page number", () => {
    const highlights = [
      { id: "a", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
      { id: "b", page: 2, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
    ];
    const result = mapHighlightsToViewport(highlights, 1, mockPage, 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a");
  });

  it("maps percent coordinates to viewport pixels", () => {
    const highlights = [
      { id: "p", page: 1, x: 0.5, y: 0.5, width: 0.25, height: 0.25, coordinateSpace: "percent" as const },
    ];
    const result = mapHighlightsToViewport(highlights, 1, mockPage, 1);
    expect(result[0].left).toBe(612 * 0.5);
    expect(result[0].top).toBe(792 * 0.5);
    expect(result[0].widthPx).toBe(612 * 0.25);
    expect(result[0].heightPx).toBe(792 * 0.25);
  });

  it("defaults to percent when coordinateSpace is omitted", () => {
    const highlights = [
      { id: "p", page: 1, x: 0, y: 0, width: 1, height: 1 },
    ];
    const result = mapHighlightsToViewport(highlights, 1, mockPage, 1);
    expect(result[0].widthPx).toBe(612);
    expect(result[0].heightPx).toBe(792);
  });
});
