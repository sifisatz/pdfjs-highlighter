import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom does not implement scrollIntoView; polyfill for linked-field navigation tests
if (typeof HTMLElement !== "undefined" && !HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = vi.fn();
}

vi.mock("pdfjs-dist", () => ({
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({
      numPages: 3,
      getPage: vi.fn((n: number) =>
        Promise.resolve({
          getViewport: vi.fn(() => ({ width: 612, height: 792 })),
          render: vi.fn(() => ({ cancel: vi.fn() })),
        }),
      ),
      destroy: vi.fn(),
    }),
  })),
}));
