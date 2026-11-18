// Feature visibility switches for the public site.
//
// /tools is hidden from the public until launch. The code stays in the repo so
// the team can keep editing it. To see it locally, set NEXT_PUBLIC_SHOW_TOOLS=true
// in your .env.local. Production does not set it, so the route returns 404 and
// no public link points at it. Read at build time (NEXT_PUBLIC_*).
export const SHOW_TOOLS = process.env.NEXT_PUBLIC_SHOW_TOOLS === "true";

// True when an internal link points at a hidden section, so the link should not render.
export function isHiddenHref(href: string): boolean {
  return !SHOW_TOOLS && href.startsWith("/tools");
}
