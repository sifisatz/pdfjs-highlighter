# Public API

The library exposes a single component and a set of types. All other modules are internal.

## Component

### `PdfHighlighterViewer`

React component that renders a PDF with an optional toolbar and rectangle highlights. It also supports:

- Programmatic navigation via ref (`goToPage`, `goToHighlight`, `goToLinkedField`).
- Click-to-focus highlight navigation (scroll + optional zoom + focus animation).
- Optional **highlight → form field** linking: when `enableFieldNavigation` is true, highlights with `linkedFieldId` scroll to and focus the linked DOM element on click.
- Zoom controls in the toolbar and via Ctrl + mouse wheel.

```tsx
import { PdfHighlighterViewer } from "pdfjs-highlighter";

<PdfHighlighterViewer
  ref={viewerRef}
  source={{ type: "url", url: "/sample.pdf" }}
  highlights={highlights}
  initialPage={1}
  initialZoom={1}
  zoomStep={0.2}
  minZoom={0.5}
  maxZoom={3}
  toolbar
  showZoomControls
  enableCtrlWheelZoom
  enableHighlightNavigation
  highlightScrollBehavior="smooth"
  highlightFocusZoom={1.2}
  enableFieldNavigation
  onLinkedFieldFocus={(highlight, element) => {}}
  linkedFieldFocusClassName="my-focus-class"
  onHighlightClick={(h) => {}}
  renderHighlightTooltip={(h) => <span>{h.id}</span>}
  renderToolbar={(props) => <CustomToolbar {...props} />}
  className="..."
  style={{}}
/>
```

**Ref:** `PdfViewerRef` with `goToPage(page: number)`, `goToHighlight(highlightId: string)`, and `goToLinkedField(highlightId: string)`.

#### Props (highlight & zoom related)

- **`highlights?: Highlight[]`** – Rectangles to overlay on the PDF.
- **`enableHighlightNavigation?: boolean`** – When `true` (default), clicking a highlight navigates to its page and focuses it.
- **`highlightScrollBehavior?: "smooth" | "auto"`** – Scroll behavior when focusing a highlight (default `"smooth"`).
- **`highlightFocusZoom?: number`** – If set, zoom level to apply when focusing a highlight (both for click and `goToHighlight`).
- **`onHighlightClick?: (highlight: Highlight) => void`** – Called on every highlight click, regardless of navigation settings.
- **`renderHighlightTooltip?: (highlight: Highlight) => React.ReactNode`** – Custom tooltip content for highlights.
- **`zoomStep?: number`** – Increment/decrement per zoom in/out action (default `0.2`).
- **`minZoom?: number`, `maxZoom?: number`** – Zoom boundaries (defaults `0.5` and `3`).
- **`enableCtrlWheelZoom?: boolean`** – When `true` (default), Ctrl + mouse wheel zooms the viewer instead of the browser page.
- **`showZoomControls?: boolean`** – Show or hide built-in zoom controls in the toolbar (default `true`).
- **`enableFieldNavigation?: boolean`** – When `true`, clicking a highlight with `linkedFieldId` scrolls to and focuses that DOM element (default `false`).
- **`onLinkedFieldFocus?: (highlight: Highlight, element: HTMLElement | null) => void`** – Called after navigating to a linked field (element is null if not found).
- **`linkedFieldFocusClassName?: string`** – CSS class applied to the linked element during the focus effect; override for custom styling.

## Types

Export path: `pdfjs-highlighter` (npm package name).

- **Highlight** – `id`, `page`, `x`, `y`, `width`, `height`, `color?`, `opacity?`, `coordinateSpace?`, `data?`, `linkedFieldId?`
- **HighlightCoordinateSpace** – `"pdf" | "percent"`
- **PdfFileSource** – `{ type: "url", url } | { type: "data", data } | { type: "base64", base64 }`
- **PdfViewerRef** – `{ goToPage, goToHighlight, goToLinkedField }`
- **PdfHighlighterViewerToolbarProps** – Props passed to `renderToolbar`
- **PdfHighlighterViewerProps** – Props for `PdfHighlighterViewer`

## Versioning and breaking changes

- The public API is the component plus the types listed above. Internal modules (hooks, controllers, services, subcomponents) may change without a major version bump.
- If we introduce an `internal.ts` (or similar) for hooks/controllers, it will be documented and its exports may change in minor versions.
