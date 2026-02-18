import { describe, it, expect } from "vitest";
import {
  clampZoom,
  zoomIn,
  zoomOut,
  zoomFromWheelDelta,
} from "./zoomController.js";

describe("zoomController", () => {
  describe("clampZoom", () => {
    it("clamps to min and max", () => {
      expect(clampZoom(0.3, 0.5, 3)).toBe(0.5);
      expect(clampZoom(5, 0.5, 3)).toBe(3);
      expect(clampZoom(1, 0.5, 3)).toBe(1);
    });
  });

  describe("zoomIn", () => {
    it("increases by step up to max", () => {
      expect(zoomIn(1, 0.2, 3)).toBe(1.2);
      expect(zoomIn(2.9, 0.2, 3)).toBe(3);
    });
  });

  describe("zoomOut", () => {
    it("decreases by step down to min", () => {
      expect(zoomOut(1, 0.2, 0.5)).toBe(0.8);
      expect(zoomOut(0.6, 0.2, 0.5)).toBe(0.5);
    });
  });

  describe("zoomFromWheelDelta", () => {
    it("zooms in when deltaY is negative", () => {
      expect(zoomFromWheelDelta(1, -100, 0.2, 0.5, 3)).toBeGreaterThan(1);
    });
    it("zooms out when deltaY is positive", () => {
      expect(zoomFromWheelDelta(1, 100, 0.2, 0.5, 3)).toBeLessThan(1);
    });
    it("clamps to min and max", () => {
      expect(zoomFromWheelDelta(0.5, -1000, 0.2, 0.5, 3)).toBeLessThanOrEqual(3);
      expect(zoomFromWheelDelta(3, 1000, 0.2, 0.5, 3)).toBeGreaterThanOrEqual(0.5);
    });
  });
});
