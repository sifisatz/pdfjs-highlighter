import { describe, it, expect } from "vitest";
import {
  clampPage,
  prevPage,
  nextPage,
} from "./navigationController.js";

describe("navigationController", () => {
  describe("clampPage", () => {
    it("returns page when within range", () => {
      expect(clampPage(2, 5)).toBe(2);
      expect(clampPage(1, 1)).toBe(1);
    });
    it("returns 1 when pageCount is 0 or negative", () => {
      expect(clampPage(5, 0)).toBe(1);
    });
    it("clamps to 1 when page is below 1", () => {
      expect(clampPage(0, 5)).toBe(1);
      expect(clampPage(-1, 5)).toBe(1);
    });
    it("clamps to pageCount when page is above pageCount", () => {
      expect(clampPage(6, 5)).toBe(5);
      expect(clampPage(10, 3)).toBe(3);
    });
  });

  describe("prevPage", () => {
    it("decrements page but not below 1", () => {
      expect(prevPage(2)).toBe(1);
      expect(prevPage(1)).toBe(1);
    });
  });

  describe("nextPage", () => {
    it("increments page up to pageCount", () => {
      expect(nextPage(1, 5)).toBe(2);
      expect(nextPage(5, 5)).toBe(5);
    });
  });
});
