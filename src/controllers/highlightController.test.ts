import { describe, it, expect } from "vitest";
import { resolveGoToHighlight } from "./highlightController.js";

describe("highlightController", () => {
  const highlights = [
    { id: "h1", page: 1, x: 0, y: 0, width: 0.1, height: 0.1 },
    { id: "h2", page: 2, x: 0, y: 0, width: 0.1, height: 0.1 },
  ];

  it("returns page and highlightId when highlight exists and page in range", () => {
    expect(resolveGoToHighlight("h1", highlights, 5)).toEqual({ page: 1, highlightId: "h1" });
    expect(resolveGoToHighlight("h2", highlights, 5)).toEqual({ page: 2, highlightId: "h2" });
  });

  it("returns null when highlight id not found", () => {
    expect(resolveGoToHighlight("h3", highlights, 5)).toBeNull();
  });

  it("returns null when highlights is undefined", () => {
    expect(resolveGoToHighlight("h1", undefined, 5)).toBeNull();
  });

  it("returns null when pageCount is 0", () => {
    expect(resolveGoToHighlight("h1", highlights, 0)).toBeNull();
  });

  it("returns null when highlight page is out of range", () => {
    const h = [{ id: "h1", page: 10, x: 0, y: 0, width: 0.1, height: 0.1 }];
    expect(resolveGoToHighlight("h1", h, 5)).toBeNull();
  });

  it("clamps page to pageCount", () => {
    const h = [{ id: "h1", page: 2, x: 0, y: 0, width: 0.1, height: 0.1 }];
    expect(resolveGoToHighlight("h1", h, 2)).toEqual({ page: 2, highlightId: "h1" });
  });
});
