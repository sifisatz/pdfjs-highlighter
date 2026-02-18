# Contributing to pdfjs-highlighter

Thank you for your interest in contributing. This document explains how to get set up and submit changes.

## Getting started

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (v9 or later)

### Setup

1. **Fork and clone the repo**

   ```bash
   git clone https://github.com/YOUR_USERNAME/pdfjs-highlighter.git
   cd pdfjs-highlighter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the library**

   ```bash
   npm run build
   ```

4. **Run tests**

   ```bash
   npm test
   ```

   Or a single run:

   ```bash
   npm run test:run
   ```

## Development workflow

- **Branch:** Create a branch from `main` for your work (e.g. `fix/highlight-click`, `feat/custom-cursor`).
- **Test:** Run `npm run test:run` before committing. Keep existing tests passing.
- **Lint:** Run `npm run lint` and fix any reported issues.
- **Build:** Ensure `npm run build` completes without errors.

## Project structure

- **`src/`** — Library source
  - `components/` — React components (Viewer, Toolbar, Highlights)
  - `hooks/` — React hooks (document, zoom, navigation, highlight focus)
  - `controllers/` — Pure logic (zoom, navigation, highlight resolution)
  - `services/` — PDF loading, coordinate mapping
  - `utils/` — Helpers (clamp, scroll, linked-field navigation)
  - `types/` — Public TypeScript types
- **`docs/`** — Architecture, public API, and testing notes
- **`pdf-highlighter-demo/`** — Demo app (Vite + React) for manual testing

See `docs/architecture.md` for a more detailed overview.

## Submitting changes

1. **Open an issue** (optional but helpful) — Describe the bug or feature so we can align before you invest time.
2. **Create a pull request** from your branch to `main`.
   - Use a clear title and description.
   - Reference any related issue (e.g. "Fixes #12").
   - Ensure CI (if enabled) and local tests pass.
3. **Review** — Maintainers will review and may request changes.

## Reporting issues

- Use the [GitHub Issues](https://github.com/sifisatz/pdfjs-highlighter/issues) page.
- Include:
  - **Environment** — Node version, OS, browser (if relevant).
  - **Steps to reproduce** — How to trigger the bug.
  - **Expected vs actual behavior** — What you expected and what happened.
  - **Code/screenshots** — Minimal example or screenshot if useful.

## Code style

- **TypeScript** — Strict types; avoid `any` where possible.
- **Formatting** — Follow the existing style in the repo; run the project linter.
- **Tests** — Prefer unit tests for controllers/utils; use the existing Vitest + Testing Library setup for components.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
