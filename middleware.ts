import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createIntlMiddleware(routing);

export const config = {
  matcher: [
    // /api routes (e.g. /api/quote) must not be locale-prefixed, so they are skipped here too.
    // Skip Next.js internals and static assets (including .geojson data files
    // used by the globe component, and .mp4/.webm video files used by the hero
    // section — without these exclusions the intl middleware intercepts the
    // requests and tries to locale-prefix them, causing 404)
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|geojson|mp4|webm)).*)",
  ],
};
