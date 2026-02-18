import { describe, it, expect } from "vitest";
import { clamp } from "./clamp.js";

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(1, 0, 2)).toBe(1);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  it("returns min when value is below min", () => {
    expect(clamp(-1, 0, 2)).toBe(0);
    expect(clamp(0.4, 0.5, 1)).toBe(0.5);
  });

  it("returns max when value is above max", () => {
    expect(clamp(3, 0, 2)).toBe(2);
    expect(clamp(1.1, 0, 1)).toBe(1);
  });

  it("handles equal min and max", () => {
    expect(clamp(5, 1, 1)).toBe(1);
  });
});
