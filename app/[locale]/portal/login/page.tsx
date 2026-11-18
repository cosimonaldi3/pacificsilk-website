import type { Metadata } from "next";
import Logo from "@/components/Logo";
import AuthForm from "@/components/portal/AuthForm";
import { portalAuth } from "@/content/portal";
import RotatingPhrase from "./RotatingPhrase";

export const metadata: Metadata = {
  title: "Client Portal — Pacific Silk Group",
  description: "Sign in to the Pacific Silk Group client portal.",
  robots: { index: false, follow: false },
};

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex h-screen overflow-hidden">
      {/* ── LEFT — white, clean sign-in form ──────────────────────────────── */}
      <div className="relative flex flex-col w-full md:w-[62%] h-full bg-white">
        {/* PS wordmark — top left */}
        <div className="absolute top-8 left-10">
          <Logo variant="psc-horizontal-black" width={220} priority />
        </div>

        {/* Form — centered vertically */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px] px-6">
            <AuthForm initialError={error === "link" ? portalAuth.errors.linkExpired : undefined} />
          </div>
        </div>
      </div>

      {/* ── RIGHT — psc-red panel, bold rotating phrase ───────────────────── */}
      <div className="hidden md:flex md:w-[38%] h-full bg-psc-red flex-col items-center justify-center relative overflow-hidden">
        {/* PS symbol — large white watermark, very subtle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <Logo variant="logo-only-white" width={380} className="opacity-[0.07]" />
        </div>

        {/* Rotating multilingual phrase */}
        <div className="relative z-10 px-14 text-center">
          <RotatingPhrase colorClass="text-white" />
        </div>
      </div>
    </main>
  );
}
