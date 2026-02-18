/**
 * Optional internal exports for custom integrations.
 * These are not part of the stable public API and may change in minor versions.
 */
export { usePdfDocument, usePdfPage, useZoom, usePageNavigation, useCtrlWheelZoom, useDownloadUrl, useHighlightFocus } from "./hooks/index.js";
export { clampZoom, zoomIn, zoomOut, zoomFromWheelDelta } from "./controllers/zoomController.js";
export { clampPage, prevPage, nextPage } from "./controllers/navigationController.js";
export { resolveGoToHighlight } from "./controllers/highlightController.js";
export type { GoToHighlightResult } from "./controllers/highlightController.js";
export { mapHighlightsToViewport } from "./services/coordinateMapper.js";
export type { RenderedHighlight } from "./services/coordinateMapper.js";
export { loadPdfDocument, getDownloadUrl } from "./services/pdfLoader.js";
export { clamp, scrollToHighlight } from "./utils/index.js";
