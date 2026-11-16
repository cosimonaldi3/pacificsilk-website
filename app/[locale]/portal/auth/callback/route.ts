import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Landing point for links in Supabase emails (signup confirmation, password reset).
// Exchanges the one-time code for a session cookie, then sends the user on.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  // Only allow internal portal paths, never an open redirect.
  const target = next && /^\/portal\/[a-z/-]*$/.test(next) ? next : "/portal/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${target}`);
  }
  return NextResponse.redirect(`${origin}/portal/login?error=link`);
}
