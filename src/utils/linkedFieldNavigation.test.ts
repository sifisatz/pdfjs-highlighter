import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  findLinkedFieldElement,
  scrollToLinkedField,
  focusLinkedField,
  navigateToLinkedField,
  DEFAULT_FOCUS_CLASS,
} from "./linkedFieldNavigation.js";
import type { Highlight } from "../types/Highlight.js";

describe("linkedFieldNavigation", () => {
  describe("findLinkedFieldElement", () => {
    it("returns null when element does not exist", () => {
      expect(findLinkedFieldElement("nonexistent-id")).toBeNull();
    });

    it("returns the element when it exists", () => {
      const el = document.createElement("input");
      el.id = "field1";
      document.body.appendChild(el);
      try {
        expect(findLinkedFieldElement("field1")).toBe(el);
      } finally {
        document.body.removeChild(el);
      }
    });

    it("returns null when id is empty string", () => {
      expect(findLinkedFieldElement("")).toBeNull();
    });
  });

  describe("scrollToLinkedField", () => {
    it("calls scrollIntoView with smooth and center", () => {
      const el = document.createElement("div");
      scrollToLinkedField(el, { behavior: "smooth", block: "center", inline: "center" });
      expect(el.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    });
  });

  describe("focusLinkedField", () => {
    it("focuses element and adds focus class then removes after duration", async () => {
      const el = document.createElement("input");
      document.body.appendChild(el);
      const focusSpy = vi.spyOn(el, "focus");
      focusLinkedField(el, { focusClass: "test-focus", focusDurationMs: 50 });
      expect(el.classList.contains("test-focus")).toBe(true);
      expect(focusSpy).toHaveBeenCalled();
      await new Promise((r) => setTimeout(r, 60));
      expect(el.classList.contains("test-focus")).toBe(false);
      document.body.removeChild(el);
      focusSpy.mockRestore();
    });
  });

  describe("navigateToLinkedField", () => {
    let linkedInput: HTMLInputElement;

    beforeEach(() => {
      linkedInput = document.createElement("input");
      linkedInput.id = "transaction-value-doc1";
      document.body.appendChild(linkedInput);
    });

    afterEach(() => {
      if (linkedInput.parentNode) document.body.removeChild(linkedInput);
    });

    it("returns null when highlight has no linkedFieldId", () => {
      const highlight: Highlight = {
        id: "h1",
        page: 1,
        x: 0,
        y: 0,
        width: 100,
        height: 20,
      };
      expect(navigateToLinkedField(highlight)).toBeNull();
    });

    it("returns null when linkedFieldId is empty", () => {
      const highlight: Highlight = {
        id: "h1",
        page: 1,
        x: 0,
        y: 0,
        width: 100,
        height: 20,
        linkedFieldId: "",
      };
      expect(navigateToLinkedField(highlight)).toBeNull();
    });

    it("returns null when DOM element is not found", () => {
      const highlight: Highlight = {
        id: "h1",
        page: 1,
        x: 0,
        y: 0,
        width: 100,
        height: 20,
        linkedFieldId: "does-not-exist",
      };
      expect(navigateToLinkedField(highlight)).toBeNull();
    });

    it("scrolls to element, focuses it, applies focus class, and returns element", () => {
      const highlight: Highlight = {
        id: "h1",
        page: 1,
        x: 0,
        y: 0,
        width: 100,
        height: 20,
        linkedFieldId: "transaction-value-doc1",
      };

      const result = navigateToLinkedField(highlight, {
        focusClass: DEFAULT_FOCUS_CLASS,
        focusDurationMs: 10,
      });

      expect(result).toBe(linkedInput);
      expect(linkedInput.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    });
  });
});
