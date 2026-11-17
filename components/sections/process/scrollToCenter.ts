/* Space kept clear under the fixed nav when an element is too tall to centre */
const NAV_OFFSET = 96;

/* Smooth-scrolls the page so an element of the given height, whose top is at `top` in the viewport,
   sits in the middle of the screen. An element taller than the screen is lined up just below the nav
   instead, so its start is not cut off. Reduced motion jumps without animating. */
export function scrollToCenter(top: number, height: number) {
  const viewport = window.innerHeight;
  const offset = height <= viewport - NAV_OFFSET * 2 ? top + height / 2 - viewport / 2 : top - NAV_OFFSET;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollBy({ top: offset, behavior: still ? "auto" : "smooth" });
}
