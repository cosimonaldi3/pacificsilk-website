import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import ResetPasswordForm from "@/components/portal/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Set a new password — Pacific Silk Group Portal",
  description: "Set a new password for the Pacific Silk Group client portal.",
  robots: { index: false, follow: false },
};

// Reached from the password-reset email via /portal/auth/callback, which has
// already signed the user in with a recovery session.
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login?error=link");

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-white">
      <div className="absolute top-8 left-10">
        <Logo variant="psc-horizontal-black" width={220} priority />
      </div>
      <div className="w-full max-w-[400px] px-6">
        <ResetPasswordForm />
      </div>
    </main>
  );
}
