import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}

// Signup is open but gated: PSC approves an account by setting
// app_metadata.approved = true in the Supabase dashboard. Users can't edit app_metadata.
export function isApproved(user: User): boolean {
  return user.app_metadata?.approved === true;
}
