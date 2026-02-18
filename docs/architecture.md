# Architecture

## Overview

The PDF Highlighter Viewer library is structured for separation of concerns, testability, and future features (e.g. virtualized pages, search).

## Layers

### 1. Types (`src/types/`)

- **Highlight.ts** – Highlight and `HighlightCoordinateSpace`.
- **source.ts** – `PdfFileSource` (url / data / base64).
- **viewer.ts** – `PdfViewerRef`, `PdfHighlighterViewerToolbarProps`, `PdfHighlighterViewerProps`.
- **index.ts** – Re-exports all public types.

All public types are consumed via `src/types/index.ts`. Do not export internal types from the public API.

### 2. Utils (`src/utils/`)

Pure helpers with no side effects:

- **clamp.ts** – Clamp a number between min and max.
- **scrollToHighlight.ts** – `scrollIntoView` wrapper for highlight focus.
- **linkedFieldNavigation.ts** – Find linked DOM element by id, scroll into view, focus, and apply temporary focus effect; used when `enableFieldNavigation` is true and a highlight has `linkedFieldId`.

Used by controllers, hooks, and the viewer. Fully unit-tested.

### 3. Services (`src/services/`)

External integrations and pure computations:

- **pdfLoader.ts** – Load PDF via pdf.js (`loadPdfDocument`), create download URL (`getDownloadUrl`).
- **coordinateMapper.ts** – Map highlight definitions to viewport pixel coordinates (`mapHighlightsToViewport`) using the same scale as the PDF canvas.

Services are stateless and testable with mocks (e.g. mock `getViewport`).

### 4. Controllers (`src/controllers/`)

Pure business logic; no DOM or React:

- **zoomController.ts** – `clampZoom`, `zoomIn`, `zoomOut`, `zoomFromWheelDelta`.
- **navigationController.ts** – `clampPage`, `prevPage`, `nextPage`.
- **highlightController.ts** – `resolveGoToHighlight(highlightId, highlights, pageCount)` → `{ page, highlightId } | null`.

Controllers are unit-tested without jsdom. They are used by hooks.

### 5. Hooks (`src/hooks/`)

React hooks that own state and effects and call services/controllers:

- **usePdfDocument** – Load document from source; expose `pdfDocument`, `pageCount`, `page`, `setPage`.
- **usePdfPage** – Load current page proxy from document.
- **useZoom** – Zoom state and handlers (zoomIn, zoomOut, resetZoom).
- **usePageNavigation** – goToPage, goPrev, goNext, canGoPrev, canGoNext.
- **useCtrlWheelZoom** – Attach Ctrl+wheel listener to container ref; throttle via rAF.
- **useDownloadUrl** – Memoized download URL and revoke on cleanup.
- **useHighlightFocus** – Pending/focused highlight id, refs map, goToHighlight, scroll-into-view + focus animation.

Data flow: props → hooks → state/callbacks; hooks use controllers and services.

### 6. Components (`src/components/`)

- **Viewer/** – `PdfHighlighterViewer` (main export), `PdfPage` (canvas render), `ViewerContainer` (scroll wrapper).
- **Toolbar/** – `Toolbar`, `PageNavigation`, `ZoomControls`.
- **Highlights/** – `HighlightLayer` (maps highlights for current page), `HighlightRect` (single overlay rect with click/focus/tooltip).

The main component composes hooks and subcomponents; it does not duplicate business logic.

### 7. Public API (`src/index.ts`)

- `export * from "./types/index.js"`
- `export { PdfHighlighterViewer } from "./components/Viewer/index.js"`

Everything else is internal. For advanced use (e.g. custom builds), an optional `internal.ts` could re-export hooks/controllers; it is not provided by default to keep the public surface small.

## Data Flow

1. **Props** (source, highlights, initialPage, zoom, etc.) → **PdfHighlighterViewer**.
2. **Hooks** turn props and refs into state and callbacks (document, page, zoom, goToPage, goToHighlight, etc.).
3. **Toolbar** receives toolbar props (page, pageCount, zoom, handlers) and renders navigation + zoom + download.
4. **ViewerContainer** wraps **PdfPage** (canvas at `zoom` scale) and **HighlightLayer** (coordinates from `coordinateMapper` at same scale).
5. **Ref** exposes `goToPage` and `goToHighlight` via `useImperativeHandle`.

## Scaling and Highlights

- The PDF is rendered at `scale: zoom` (single viewport scale).
- `mapHighlightsToViewport(highlights, pageNumber, pageProxy, zoom)` uses the same scale, so highlight overlay pixels match the canvas. No separate transform or per-zoom recalculation beyond the existing viewport math.

## Extension Points

- **Custom toolbar:** `renderToolbar={(props) => <YourToolbar {...props} />}`.
- **Highlight tooltip:** `renderHighlightTooltip={(h) => <YourTooltip />}`.
- **New features:** Add a new hook (e.g. `useSearch`) and wire it in `PdfHighlighterViewer`; keep controllers pure for tests.
- **Virtualized pages:** Replace single `PdfPage` with a list of pages and a visibility/scroll hook; reuse `PdfPage`, `HighlightLayer`, and `coordinateMapper` per visible page.

## Performance

- Ctrl+wheel zoom is throttled with `requestAnimationFrame` to limit re-renders.
- Only the current page is rendered (single-page viewer); architecture supports virtualizing by rendering multiple `PdfPage` + `HighlightLayer` for visible indices.
- Document and page loading are async with cancellation on unmount/source change.
