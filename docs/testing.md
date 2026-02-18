# Testing

## Setup

- **Vitest** – test runner
- **jsdom** – DOM environment
- **@testing-library/react** – component tests
- **@testing-library/jest-dom** – matchers (e.g. `toBeInTheDocument()`)

Configuration: `vitest.config.ts` (environment, setupFiles, coverage).

Setup file: `src/test/setupTests.ts` (cleanup after each test, mock for `pdfjs-dist`).

## Running Tests

```bash
npm test          # watch mode
npm test -- --run # single run
npm test -- --coverage  # with coverage
```

## Unit Tests

Pure logic only; no DOM.

| Path | What |
|------|------|
| `src/utils/clamp.test.ts` | `clamp()` |
| `src/controllers/zoomController.test.ts` | clampZoom, zoomIn, zoomOut, zoomFromWheelDelta |
| `src/controllers/navigationController.test.ts` | clampPage, prevPage, nextPage |
| `src/controllers/highlightController.test.ts` | resolveGoToHighlight |
| `src/services/coordinateMapper.test.ts` | mapHighlightsToViewport (with mock page) |
| `src/utils/linkedFieldNavigation.test.ts` | findLinkedFieldElement, scrollToLinkedField, focusLinkedField, navigateToLinkedField |

## Component Tests

- **PdfHighlighterViewer.test.tsx** – Renders viewer with mocked pdf.js; checks toolbar, zoom controls, and linked-field navigation (enableFieldNavigation, onLinkedFieldFocus, goToLinkedField ref).

Run with:

```bash
npm test -- --run src/components
```

## Integration / E2E

Not included in this repo. For full flows (load PDF, click highlight, zoom), use a separate E2E setup (e.g. Playwright) against the demo app.

## Mocks

- **pdfjs-dist** – In `setupTests.ts`, `getDocument()` returns a promise of a fake document with `numPages`, `getPage()`, and stubbed `getViewport` / `render`. Adjust there if new pdf.js usage is added.

## Coverage

Coverage is configured in `vitest.config.ts` (v8, text + json-summary). Excluded: test files, `src/test/**`, index re-exports. Aim to keep controllers, utils, and services well covered; hooks and components can be covered as needed.
