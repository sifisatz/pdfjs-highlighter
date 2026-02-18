## PDF Highlighter Viewer

**React + TypeScript PDF viewer library with rectangle highlights.**

The library is refactored into a modular structure (see `docs/architecture.md`). The **public API is unchanged**: same component name, same props, same ref. Existing code using `PdfHighlighterViewer` and the exported types does not need changes.

### 1. Installation

```bash
npm install pdfjs-highlighter pdfjs-dist react react-dom
```

### 2. Basic Usage

```tsx
import React from "react";
import { PdfHighlighterViewer, Highlight } from "pdfjs-highlighter";

const highlights: Highlight[] = [
  {
    id: "h1",
    page: 1,
    x: 0.1,
    y: 0.2,
    width: 0.3,
    height: 0.1,
    color: "#f97316",
    opacity: 0.4,
    coordinateSpace: "percent",
  },
];

export function Example() {
  return (
    <div style={{ height: 600 }}>
      <PdfHighlighterViewer
        source={{ type: "url", url: "/example.pdf" }}
        highlights={highlights}
        initialPage={1}
        zoomStep={0.2}
        toolbar
      />
    </div>
  );
}
```

### 3. Highlight Coordinate Mapping

- **Percent space (`coordinateSpace: "percent"`)**
  - `x`, `width` are relative to page width (0–1).
  - `y`, `height` are relative to page height (0–1) with **top = 0**.
- **PDF space (`coordinateSpace: "pdf"`)**
  - `x`, `y`, `width`, `height` are in PDF points.
  - Origin is **bottom-left**; the library converts to canvas coordinates and flips the Y‑axis.
- Highlights are recomputed whenever the zoom or container size changes, so they always stay aligned.

### 4. API Overview

```ts
type HighlightCoordinateSpace = "pdf" | "percent";

type Highlight = {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  opacity?: number;
  coordinateSpace?: HighlightCoordinateSpace; // default: "percent"
  data?: unknown;
  linkedFieldId?: string; // optional: id of DOM element to scroll/focus when highlight is clicked (requires enableFieldNavigation)
};

type PdfFileSource =
  | { type: "url"; url: string }
  | { type: "data"; data: ArrayBuffer | Uint8Array }
  | { type: "base64"; base64: string };
```

```ts
type PdfViewerRef = {
  goToPage: (page: number) => void;
  goToHighlight: (highlightId: string) => void;
  goToLinkedField: (highlightId: string) => void; // scroll to and focus linked form field, if highlight has linkedFieldId
};

type PdfHighlighterViewerProps = {
  source: PdfFileSource;
  highlights?: Highlight[];
  initialPage?: number;
  zoomStep?: number;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  toolbar?: boolean;
  renderToolbar?: (props: PdfHighlighterViewerToolbarProps) => React.ReactNode;
  onHighlightClick?: (highlight: Highlight) => void;
  renderHighlightTooltip?: (highlight: Highlight) => React.ReactNode;
  enableHighlightNavigation?: boolean;  // default true: click navigates to page and scrolls to highlight
  highlightScrollBehavior?: "smooth" | "auto";
  highlightFocusZoom?: number;          // optional zoom when focusing a highlight
  enableCtrlWheelZoom?: boolean;        // default true: Ctrl + wheel zooms (prevents browser zoom)
  showZoomControls?: boolean;          // default true: show [ – ] 100% [ + ] Reset in toolbar
  enableFieldNavigation?: boolean;      // default false: click highlight with linkedFieldId scrolls to and focuses the DOM element
  onLinkedFieldFocus?: (highlight: Highlight, element: HTMLElement | null) => void;
  linkedFieldFocusClassName?: string;   // CSS class for linked-field focus effect (default: built-in glow)
  className?: string;
  style?: React.CSSProperties;
};
```

### 5. Zoom controls

- **Toolbar:** Zoom In (+), Zoom Out (–), current zoom %, Reset. Toggle with `showZoomControls`.
- **Ctrl + mouse wheel:** When `enableCtrlWheelZoom` is true (default), zoom in/out with Ctrl + wheel over the viewer; browser page zoom is prevented.
- **Shared scale:** The PDF canvas and highlight overlay use the same viewport scale (`zoom`), so highlights stay aligned at any zoom level (no separate coordinate recalculation).
- **Limits:** `minZoom` (default 0.5), `maxZoom` (default 3), `zoomStep` (default 0.2).

### 6. Highlight navigation, focus, and ref API

With `enableHighlightNavigation` (default `true`), clicking a highlight:

- Navigates to its page (if needed).
- Scrolls it into view (`highlightScrollBehavior`: `"smooth"` \| `"auto"`).
- Optionally zooms to a specific level (`highlightFocusZoom`).
- Triggers a short focus animation on the active highlight to make it visually stand out.

The same behavior is used when you call `goToHighlight` via the ref.

**Highlight → form field navigation (opt-in):** Set `enableFieldNavigation={true}` and add `linkedFieldId` to highlights that should scroll to and focus a form field (e.g. `id="transaction-value-doc1"`). When the user clicks such a highlight, the viewer scrolls the linked element into view, focuses it, and applies a short focus effect (glow). Use `linkedFieldFocusClassName` to override the effect style and `onLinkedFieldFocus` to react (e.g. announce to screen readers). Ref method `goToLinkedField(highlightId)` does the same programmatically. If the element is missing, the library fails silently and existing highlight behavior is unchanged.

Use a ref to control the viewer from outside:

```tsx
import { useRef } from "react";
import { PdfHighlighterViewer, PdfViewerRef } from "pdfjs-highlighter";

function Example() {
  const viewerRef = useRef<PdfViewerRef>(null);

  return (
    <>
      <button onClick={() => viewerRef.current?.goToPage(2)}>Go to page 2</button>
      <button onClick={() => viewerRef.current?.goToHighlight("h1")}>Go to highlight</button>
      <button onClick={() => viewerRef.current?.goToLinkedField("h1")}>Go to linked field</button>
      <PdfHighlighterViewer
        ref={viewerRef}
        source={{ type: "url", url: "/sample.pdf" }}
        highlights={highlights}
        enableHighlightNavigation
        highlightScrollBehavior="smooth"
        highlightFocusZoom={1.2}
        onHighlightClick={(h) => {
          // Called on every highlight click, regardless of navigation settings.
          console.log("Clicked", h.id, "on page", h.page);
        }}
      />
    </>
  );
}
```

### 7. Zoom, mouse wheel, and scroll behavior

- **Zoom step:** Controlled via `zoomStep` (default `0.2`).
- **Zoom limits:** `minZoom` and `maxZoom` (defaults `0.5` and `3`).
- **Toolbar zoom controls:** Shown when `showZoomControls` is `true` (default).
- **Ctrl + wheel zoom:** When `enableCtrlWheelZoom` is `true` (default), Ctrl + mouse wheel zooms the PDF and keeps browser page zoom unchanged.
- **Highlight scrolling:** `highlightScrollBehavior` selects whether focusing a highlight uses smooth scrolling or instant jump.

### 8. Highlight → form field linking (opt-in)

When `enableFieldNavigation` is `true`, highlights with optional `linkedFieldId` link to a DOM element by `id`. Clicking the highlight (or calling `goToLinkedField(highlightId)`) scrolls that element into view, focuses it, and applies a ~2s focus effect. Use for discrepancy review UIs (e.g. “Transaction value” highlight → input field).

```tsx
const highlights = [
  {
    id: "h1",
    page: 1,
    x: 0.1,
    y: 0.35,
    width: 0.84,
    height: 0.055,
    coordinateSpace: "percent",
    linkedFieldId: "transaction-value-doc1",
  },
];

<input id="transaction-value-doc1" placeholder="Enter value" />

<PdfHighlighterViewer
  source={{ type: "url", url: "/sample.pdf" }}
  highlights={highlights}
  enableFieldNavigation
  onLinkedFieldFocus={(highlight, element) => {
    if (element) element.setAttribute("aria-describedby", "live-region");
  }}
/>
```

- **Accessibility:** Focus moves to the linked field; use `onLinkedFieldFocus` to update an ARIA live region or `aria-describedby` so screen readers announce the context.
- **Backward compatibility:** If `linkedFieldId` is omitted or the element is not found, behavior is unchanged (no errors).

### 9. Custom Toolbar

```tsx
import { PdfHighlighterViewer, PdfHighlighterViewerToolbarProps } from "pdfjs-highlighter";

function MyToolbar(props: PdfHighlighterViewerToolbarProps) {
  const { page, pageCount, onPrevPage, onNextPage, zoom, onZoomIn, onZoomOut, onDownload } = props;
  return (
    <div>
      <button onClick={onPrevPage}>Prev</button>
      <span>
        {page} / {pageCount}
      </span>
      <button onClick={onNextPage}>Next</button>
      <button onClick={onZoomOut}>-</button>
      <span>{Math.round(zoom * 100)}%</span>
      <button onClick={onZoomIn}>+</button>
      <button onClick={onDownload}>Download</button>
    </div>
  );
}

export function ExampleWithCustomToolbar() {
  return (
    <PdfHighlighterViewer
      source={{ type: "url", url: "/example.pdf" }}
      renderToolbar={(props) => <MyToolbar {...props} />}
    />
  );
}
```

### 10. Testing

```bash
npm test          # watch
npm run test:run  # single run
npm run test:coverage
```

See `docs/testing.md` for strategy and `docs/architecture.md` for structure.

### 11. Styling Customization

- The root element accepts `className` and `style` so you can:
  - Integrate with Tailwind (e.g. `className="rounded-lg border shadow-sm"`).
  - Apply custom themes or dark mode.
- The default toolbar uses basic inline styles and buttons; override it with `renderToolbar` for a fully custom UI.
- Highlights use an absolutely positioned overlay; customize `color` and `opacity` per highlight.

### 12. Build & Publish

- **Build the library**:

```bash
npm run build
```

- **Publish to npm**:

```bash
npm login
npm publish
```

Ensure the `name` in `package.json` is unique on npm and points to this library.
