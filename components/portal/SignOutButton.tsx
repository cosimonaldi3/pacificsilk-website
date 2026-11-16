"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { portalAuth } from "@/content/portal";

export default function SignOutButton() {
  const router = useRouter();

  async function handleClick() {
    await createClient().auth.signOut();
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="font-sans text-small font-medium px-5 py-2.5 bg-psc-ink text-psc-bg hover:opacity-80 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-ink"
    >
      {portalAuth.signOut}
    </button>
  );
}
