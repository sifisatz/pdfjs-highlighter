/**
 * Scroll an element into view with the given behavior.
 */
export function scrollToHighlight(
  element: HTMLElement,
  options: { behavior?: ScrollBehavior; block?: ScrollLogicalPosition; inline?: ScrollLogicalPosition } = {},
): void {
  const { behavior = "smooth", block = "center", inline = "center" } = options;
  element.scrollIntoView({ behavior, block, inline });
}
