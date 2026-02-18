# Instructions for AI agents

This file gives context and rules for AI agents (e.g. Claude, Cursor) working on the **pdfjs-highlighter** repository.

## What this project is

- **pdfjs-highlighter** — A React + TypeScript library that renders PDFs with rectangle highlights, zoom, page navigation, and optional link-to-form-field navigation. Built on PDF.js.
- **Package name:** `pdfjs-highlighter` (use this everywhere; do not use `pdf-highlighter-viewer`).
- **Public API:** Only what is exported from `src/index.ts`: types from `src/types/index.ts` and the component `PdfHighlighterViewer`. Do not export internal modules from the public API.

## Repository layout

- **`src/`** — Library source only.
  - **`types/`** — Public types (Highlight, PdfFileSource, PdfViewerRef, props). Re-export via `types/index.ts`.
  - **`components/`** — Viewer, Toolbar, HighlightLayer, HighlightRect. Entry: `components/Viewer/index.ts` exports `PdfHighlighterViewer`.
  - **`hooks/`** — usePdfDocument, useZoom, useHighlightFocus, etc. Internal; do not export from the library entry.
  - **`controllers/`** — Pure logic (zoom, navigation, highlight resolution). No DOM/React. Unit-tested.
  - **`services/`** — pdfLoader, coordinateMapper. Stateless; test with mocks.
  - **`utils/`** — clamp, scrollToHighlight, linkedFieldNavigation. Pure where possible; unit-tested.
- **`docs/`** — Architecture, public API, testing. Keep these accurate when you change behavior or API.
- **`pdf-highlighter-demo/`** — Separate Vite + React app that depends on the library via `"pdfjs-highlighter": "file:.."`. Use for manual testing; do not put library logic here.

## Conventions and rules

1. **Backward compatibility** — Avoid breaking the public API (component props, ref methods, exported types). New features should be opt-in (e.g. new optional props). Breaking changes imply a major version bump.
2. **TypeScript** — Use strict types. Do not add `any` to the public surface. Types live in `src/types/`; the rest of the code imports from there.
3. **Testing** — Unit tests: Vitest, in `*.test.ts` / `*.test.tsx`. Controllers and utils are unit-tested; component tests use `@testing-library/react`. Run with `npm run test:run`. See `docs/testing.md`.
4. **Naming** — Use the package name **pdfjs-highlighter** in docs, comments, and CSS class prefixes (e.g. `pdfjs-highlighter-linked-field-focus`). Do not use `pdf-highlighter-viewer`.
5. **Build** — `npm run build` produces `dist/` (ESM, CJS, `.d.ts`, `styles.css`). Do not commit `dist/` if the repo ignores it; CI or maintainers run the build before publish.
6. **Demo app** — The demo in `pdf-highlighter-demo/` consumes the library as `pdfjs-highlighter`. Imports must be `from "pdfjs-highlighter"`. Alias in the demo’s Vite config points to the parent `dist/`.

## When adding features

- **New public API** — Extend types in `src/types/`, export from `src/types/index.ts`, and document in `README.md` and `docs/public-api.md`.
- **New internal logic** — Prefer controllers (pure) or services (with mocks). Wire them in hooks or the viewer component; do not expose them from `src/index.ts`.
- **Styling** — Default styles and keyframes are in `src/components/Viewer/PdfHighlighterViewer.tsx` (inline) and `src/styles.css`. Use the `pdfjs-highlighter-*` prefix for class names.

## When fixing bugs

- Add or adjust unit tests so the bug is covered.
- Keep the public API and behavior of existing props/ref stable unless the change is explicitly a breaking change.

## References

- **Architecture:** `docs/architecture.md`
- **Public API:** `docs/public-api.md`
- **Testing:** `docs/testing.md`
- **Contributing:** `CONTRIBUTING.md`
