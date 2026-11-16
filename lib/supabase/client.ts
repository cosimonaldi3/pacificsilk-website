import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

// Browser client for the portal auth forms. Session lives in cookies so the
// server (middleware, dashboard) sees the same user.
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
