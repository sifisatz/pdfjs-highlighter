import type { Highlight } from "../types/Highlight.js";

export const DEFAULT_FOCUS_CLASS = "pdf-highlighter-viewer-linked-field-focus";
const DEFAULT_FOCUS_DURATION_MS = 2000;

export type LinkedFieldNavigationOptions = {
  scrollBehavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  focusClass?: string;
  focusDurationMs?: number;
};

/**
 * Find a DOM element by ID. Returns null if not found or not an HTMLElement (e.g. in SSR).
 * Safe for missing or hidden elements; callers should handle null.
 */
export function findLinkedFieldElement(linkedFieldId: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const el = document.getElementById(linkedFieldId);
  return el instanceof HTMLElement ? el : null;
}

/**
 * Scroll a linked field element into view.
 */
export function scrollToLinkedField(
  element: HTMLElement,
  options: { behavior?: ScrollBehavior; block?: ScrollLogicalPosition; inline?: ScrollLogicalPosition } = {},
): void {
  const { behavior = "smooth", block = "center", inline = "center" } = options;
  element.scrollIntoView({ behavior, block, inline });
}

/**
 * Focus an element and apply a temporary focus effect class, then remove it after duration.
 * The class can be styled by the library default CSS or overridden via linkedFieldFocusClassName.
 */
export function focusLinkedField(
  element: HTMLElement,
  options: LinkedFieldNavigationOptions = {},
): void {
  const {
    focusClass = DEFAULT_FOCUS_CLASS,
    focusDurationMs = DEFAULT_FOCUS_DURATION_MS,
  } = options;

  element.focus();

  element.classList.add(focusClass);
  const timeoutId = window.setTimeout(() => {
    element.classList.remove(focusClass);
  }, focusDurationMs);

  // Store timeout id on element so we could clear it on unmount or repeat call (optional)
  (element as HTMLElement & { _pdfHighlighterFocusTimeout?: number })._pdfHighlighterFocusTimeout = timeoutId;
}

/**
 * Navigate to the linked form field for a highlight: find element, scroll into view, focus, and apply focus effect.
 * Fails silently if linkedFieldId is missing or element is not found.
 * @returns The focused element, or null if not found or not linked
 */
export function navigateToLinkedField(
  highlight: Highlight,
  options: LinkedFieldNavigationOptions = {},
): HTMLElement | null {
  const linkedFieldId = highlight?.linkedFieldId;
  if (!linkedFieldId || typeof linkedFieldId !== "string") return null;

  const element = findLinkedFieldElement(linkedFieldId);
  if (!element) return null;

  scrollToLinkedField(element, {
    behavior: options.scrollBehavior ?? "smooth",
    block: options.block ?? "center",
    inline: options.inline ?? "center",
  });

  focusLinkedField(element, {
    focusClass: options.focusClass ?? DEFAULT_FOCUS_CLASS,
    focusDurationMs: options.focusDurationMs ?? DEFAULT_FOCUS_DURATION_MS,
  });

  return element;
}
