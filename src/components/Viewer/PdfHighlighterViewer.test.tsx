import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PdfHighlighterViewer } from "./PdfHighlighterViewer.js";

describe("PdfHighlighterViewer", () => {
  it("renders toolbar and viewer container", () => {
    render(
      <PdfHighlighterViewer
        source={{ type: "url", url: "https://example.com/doc.pdf" }}
        highlights={[]}
      />,
    );
    expect(screen.getByRole("button", { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
  });

  it("renders zoom controls when showZoomControls is true", () => {
    render(
      <PdfHighlighterViewer
        source={{ type: "url", url: "https://example.com/doc.pdf" }}
        showZoomControls
      />,
    );
    expect(screen.getByRole("button", { name: /zoom in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /zoom out/i })).toBeInTheDocument();
  });

  it("when enableFieldNavigation is true and highlight has linkedFieldId, click scrolls to field and calls onLinkedFieldFocus", async () => {
    const onLinkedFieldFocus = vi.fn();
    const linkedInput = document.createElement("input");
    linkedInput.id = "transaction-value-doc1";
    linkedInput.placeholder = "Enter value";
    document.body.appendChild(linkedInput);

    const highlights = [
      {
        id: "h1",
        page: 1,
        x: 0.1,
        y: 0.2,
        width: 0.3,
        height: 0.05,
        coordinateSpace: "percent" as const,
        linkedFieldId: "transaction-value-doc1",
      },
    ];

    render(
      <PdfHighlighterViewer
        source={{ type: "url", url: "https://example.com/doc.pdf" }}
        highlights={highlights}
        enableFieldNavigation
        onLinkedFieldFocus={onLinkedFieldFocus}
      />,
    );

    const highlightEl = await screen.findByTestId("pdf-highlighter-viewer-highlight");
    fireEvent.click(highlightEl);

    expect(onLinkedFieldFocus).toHaveBeenCalledTimes(1);
    expect(onLinkedFieldFocus).toHaveBeenCalledWith(
      expect.objectContaining({ id: "h1", linkedFieldId: "transaction-value-doc1" }),
      linkedInput,
    );

    document.body.removeChild(linkedInput);
  });

  it("goToLinkedField ref scrolls to linked field and calls onLinkedFieldFocus", () => {
    const onLinkedFieldFocus = vi.fn();
    const linkedInput = document.createElement("input");
    linkedInput.id = "ref-field";
    document.body.appendChild(linkedInput);

    const highlights = [
      {
        id: "h2",
        page: 1,
        x: 0.1,
        y: 0.2,
        width: 0.3,
        height: 0.05,
        coordinateSpace: "percent" as const,
        linkedFieldId: "ref-field",
      },
    ];

    const ref = { current: null as { goToLinkedField: (id: string) => void } | null };
    render(
      <PdfHighlighterViewer
        ref={ref}
        source={{ type: "url", url: "https://example.com/doc.pdf" }}
        highlights={highlights}
        enableFieldNavigation
        onLinkedFieldFocus={onLinkedFieldFocus}
      />,
    );

    ref.current?.goToLinkedField("h2");

    expect(onLinkedFieldFocus).toHaveBeenCalledWith(
      expect.objectContaining({ id: "h2", linkedFieldId: "ref-field" }),
      linkedInput,
    );

    document.body.removeChild(linkedInput);
  });
});
