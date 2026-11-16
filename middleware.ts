import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { SUPABASE_KEY, SUPABASE_URL } from "./lib/supabase/env";

const intlMiddleware = createIntlMiddleware(routing);

// Authenticated-only portal routes, with or without a locale prefix.
// /portal/login, /portal/reset and /portal/auth/callback stay public.
const PROTECTED = /^(?:\/(?:es|zh))?\/portal\/dashboard(?:\/|$)/;

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Refresh the Supabase session cookie on every page request and copy any
  // updated cookies onto the intl response.
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  if (!user && PROTECTED.test(pathname)) {
    const locale = pathname.match(/^\/(es|zh)\//)?.[1];
    const url = request.nextUrl.clone();
    url.pathname = `${locale ? `/${locale}` : ""}/portal/login`;
    url.search = "";
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and static assets (including .geojson data files
    // used by the globe component, and .mp4/.webm video files used by the hero
    // section — without these exclusions the intl middleware intercepts the
    // requests and tries to locale-prefix them, causing 404)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|geojson|mp4|webm)).*)",
    "/(api|trpc)(.*)",
  ],
};
