export type HighlightCoordinateSpace = "pdf" | "percent";

export type Highlight = {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  opacity?: number;
  coordinateSpace?: HighlightCoordinateSpace;
  data?: unknown;
  /** Optional ID of a DOM element (e.g. form field) to scroll to and focus when this highlight is clicked. Requires enableFieldNavigation on the viewer. */
  linkedFieldId?: string;
};
