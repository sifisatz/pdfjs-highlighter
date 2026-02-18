# pdfjs-highlighter

[![npm version](https://img.shields.io/npm/v/pdfjs-highlighter.svg)](https://www.npmjs.com/package/pdfjs-highlighter)
[![npm license](https://img.shields.io/npm/l/pdfjs-highlighter.svg)](https://www.npmjs.com/package/pdfjs-highlighter)

A React PDF viewer with rectangle highlights, zoom, page navigation, and optional link-to-form-field navigation. Built on PDF.js with full TypeScript support.

## Install

```bash
npm install pdfjs-highlighter pdfjs-dist react react-dom
```

**Peer dependencies:** `react` (^18 or ^19), `react-dom`, `pdfjs-dist` — install them in your app if not already present.

## Quick start

```tsx
import { PdfHighlighterViewer, Highlight } from "pdfjs-highlighter";

const highlights: Highlight[] = [
  { id: "h1", page: 1, x: 0.1, y: 0.2, width: 0.3, height: 0.1, coordinateSpace: "percent" },
];

export function App() {
  return (
    <div style={{ height: 600 }}>
      <PdfHighlighterViewer
        source={{ type: "url", url: "/document.pdf" }}
        highlights={highlights}
        toolbar
      />
    </div>
  );
}
```

## Features

- **PDF rendering** — URL, `ArrayBuffer`, or base64 source
- **Rectangle highlights** — Percent or PDF coordinate space; per-highlight color and opacity
- **Zoom** — Toolbar controls and Ctrl + mouse wheel (configurable)
- **Page navigation** — Prev/next, go to page, optional custom toolbar
- **Highlight navigation** — Click a highlight to scroll into view and focus it; optional zoom-on-focus
- **Link to form fields** — Optional `linkedFieldId` to scroll to and focus a DOM element (e.g. input) when a highlight is clicked
- **Ref API** — `goToPage`, `goToHighlight`, `goToLinkedField` for programmatic control
- **TypeScript** — Typed props, ref, and highlight model

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [Props and API](#props-and-api)
- [Highlights](#highlights)
- [Zoom and navigation](#zoom-and-navigation)
- [Ref API](#ref-api)
- [Linking highlights to form fields](#linking-highlights-to-form-fields)
- [Custom toolbar](#custom-toolbar)
- [Styling](#styling)
- [License](#license)

## Props and API

### Component: `PdfHighlighterViewer`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `PdfFileSource` | required | `{ type: "url", url }` or `{ type: "data", data }` or `{ type: "base64", base64 }` |
| `highlights` | `Highlight[]` | `[]` | Rectangle highlights to overlay |
| `initialPage` | `number` | `1` | First page to show |
| `initialZoom` | `number` | `1` | Initial zoom level |
| `zoomStep` | `number` | `0.2` | Zoom in/out step |
| `minZoom` | `number` | `0.5` | Minimum zoom |
| `maxZoom` | `number` | `3` | Maximum zoom |
| `toolbar` | `boolean` | `true` | Show built-in toolbar |
| `showZoomControls` | `boolean` | `true` | Show zoom buttons and reset in toolbar |
| `enableHighlightNavigation` | `boolean` | `true` | Click highlight to go to page and scroll to it |
| `highlightScrollBehavior` | `"smooth" \| "auto"` | `"smooth"` | Scroll behavior when focusing a highlight |
| `highlightFocusZoom` | `number` | — | Optional zoom level when focusing a highlight |
| `enableCtrlWheelZoom` | `boolean` | `true` | Ctrl + wheel zooms the viewer |
| `enableFieldNavigation` | `boolean` | `false` | Click highlight with `linkedFieldId` scrolls to and focuses that DOM element |
| `onHighlightClick` | `(highlight: Highlight) => void` | — | Called on every highlight click |
| `onLinkedFieldFocus` | `(highlight, element \| null) => void` | — | Called after navigating to a linked field |
| `linkedFieldFocusClassName` | `string` | — | CSS class for linked-field focus effect (override default) |
| `renderHighlightTooltip` | `(highlight) => ReactNode` | — | Custom tooltip for highlights |
| `renderToolbar` | `(props) => ReactNode` | — | Custom toolbar (replaces default) |
| `className` | `string` | — | Root element class |
| `style` | `React.CSSProperties` | — | Root element style |

### Ref: `PdfViewerRef`

- `goToPage(page: number)` — Switch to page
- `goToHighlight(highlightId: string)` — Go to page and scroll to highlight
- `goToLinkedField(highlightId: string)` — Scroll to and focus the linked DOM element (if highlight has `linkedFieldId`)

### Types

- **`Highlight`** — `id`, `page`, `x`, `y`, `width`, `height`, `color?`, `opacity?`, `coordinateSpace?` (`"percent"` \| `"pdf"`), `data?`, `linkedFieldId?`
- **`PdfFileSource`** — `{ type: "url", url }` \| `{ type: "data", data }` \| `{ type: "base64", base64 }`

## Highlights

Highlights are rectangles overlaid on the PDF. Use **percent** (0–1, top-left origin) or **PDF** (points, bottom-left origin).

```tsx
const highlights: Highlight[] = [
  {
    id: "total",
    page: 1,
    x: 0.1,
    y: 0.35,
    width: 0.8,
    height: 0.06,
    color: "#f97316",
    opacity: 0.4,
    coordinateSpace: "percent", // default
  },
];
```

With `enableHighlightNavigation` (default), clicking a highlight navigates to its page, scrolls it into view, and runs a short focus animation. Use `highlightFocusZoom` to set a zoom level when focusing.

## Zoom and navigation

- **Toolbar:** Page prev/next, page input, zoom in/out, reset zoom, download (if source allows).
- **Ctrl + wheel:** Zooms over the viewer (when `enableCtrlWheelZoom` is true).
- Zoom is shared between PDF canvas and highlight overlay so highlights stay aligned.

## Ref API

```tsx
import { useRef } from "react";
import { PdfHighlighterViewer, PdfViewerRef } from "pdfjs-highlighter";

function Viewer() {
  const ref = useRef<PdfViewerRef>(null);

  return (
    <>
      <button onClick={() => ref.current?.goToPage(2)}>Page 2</button>
      <button onClick={() => ref.current?.goToHighlight("total")}>Go to highlight</button>
      <button onClick={() => ref.current?.goToLinkedField("total")}>Go to field</button>
      <PdfHighlighterViewer
        ref={ref}
        source={{ type: "url", url: "/doc.pdf" }}
        highlights={highlights}
      />
    </>
  );
}
```

## Linking highlights to form fields

When `enableFieldNavigation` is true, a highlight can have `linkedFieldId` set to the `id` of a DOM element (e.g. an input). Clicking that highlight (or calling `goToLinkedField(id)`) scrolls the element into view, focuses it, and applies a short focus effect.

```tsx
const highlights: Highlight[] = [
  {
    id: "h1",
    page: 1,
    x: 0.1,
    y: 0.35,
    width: 0.84,
    height: 0.055,
    coordinateSpace: "percent",
    linkedFieldId: "transaction-value",
  },
];

<input id="transaction-value" placeholder="Enter value" />

<PdfHighlighterViewer
  source={{ type: "url", url: "/doc.pdf" }}
  highlights={highlights}
  enableFieldNavigation
  onLinkedFieldFocus={(highlight, element) => {
    if (element) element.setAttribute("aria-describedby", "live-region");
  }}
/>
```

If the element is missing, the library does nothing (no error). Use `linkedFieldFocusClassName` to style the focus effect or `onLinkedFieldFocus` for accessibility (e.g. live region).

## Custom toolbar

Replace the default toolbar with `renderToolbar`:

```tsx
import { PdfHighlighterViewer, PdfHighlighterViewerToolbarProps } from "pdfjs-highlighter";

function CustomToolbar(props: PdfHighlighterViewerToolbarProps) {
  const { page, pageCount, onPrevPage, onNextPage, zoom, onZoomIn, onZoomOut, onDownload } = props;
  return (
    <div className="my-toolbar">
      <button onClick={onPrevPage}>Prev</button>
      <span>{page} / {pageCount}</span>
      <button onClick={onNextPage}>Next</button>
      <button onClick={onZoomOut}>−</button>
      <span>{Math.round(zoom * 100)}%</span>
      <button onClick={onZoomIn}>+</button>
      <button onClick={onDownload}>Download</button>
    </div>
  );
}

<PdfHighlighterViewer
  source={{ type: "url", url: "/doc.pdf" }}
  renderToolbar={(p) => <CustomToolbar {...p} />}
/>
```

## Styling

- The root element accepts `className` and `style` (e.g. for Tailwind or dark mode).
- Optional base styles (focus ring, linked-field effect) can be imported:

```tsx
import "pdfjs-highlighter/styles.css";
```

- Override the linked-field focus effect with `linkedFieldFocusClassName`.

## License

MIT · [GitHub](https://github.com/sifisatz/pdfjs-highlighter) · [npm](https://www.npmjs.com/package/pdfjs-highlighter)
