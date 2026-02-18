import type * as React from "react";
import type { Highlight } from "./Highlight.js";
import type { PdfFileSource } from "./source.js";

export type PdfViewerRef = {
  goToPage: (page: number) => void;
  goToHighlight: (highlightId: string) => void;
  /** Scroll to and focus the linked form field for the given highlight, if it has linkedFieldId and the element exists. */
  goToLinkedField: (highlightId: string) => void;
};

export type PdfHighlighterViewerToolbarProps = {
  page: number;
  pageCount: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  zoom: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onDownload: () => void;
  showZoomControls?: boolean;
};

export type PdfHighlighterViewerProps = {
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
  enableHighlightNavigation?: boolean;
  highlightScrollBehavior?: "smooth" | "auto";
  highlightFocusZoom?: number;
  enableCtrlWheelZoom?: boolean;
  showZoomControls?: boolean;
  /** When true, clicking a highlight with linkedFieldId scrolls to and focuses the linked DOM element. Default false. */
  enableFieldNavigation?: boolean;
  /** Called after navigating to a linked field (element is null if not found). */
  onLinkedFieldFocus?: (highlight: Highlight, element: HTMLElement | null) => void;
  /** CSS class applied to the linked element during the focus effect. Default uses built-in glow. Override for custom styling. */
  linkedFieldFocusClassName?: string;
  className?: string;
  style?: React.CSSProperties;
};
