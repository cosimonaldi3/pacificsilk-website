import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Estimator from "@/components/tools/Estimator";
import ToolsShell from "@/components/tools/ToolsShell";
import PortalHeader from "@/components/portal/PortalHeader";
import { createClient, isApproved } from "@/lib/supabase/server";
import { portalAuth } from "@/content/portal";

export const metadata: Metadata = {
  title: "Dashboard — Pacific Silk Consulting Portal",
  description: "Client dashboard.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const approved = isApproved(user);
  const pending = portalAuth.pending;

  return (
    <div className="min-h-screen bg-white">
      <PortalHeader />

      <main>
        {approved ? (
          <>
            <h1 className="sr-only">Dashboard</h1>
            <ToolsShell locale={locale}>
              <Estimator headingLevel="h2" />
            </ToolsShell>
          </>
        ) : (
          // Signed up but not yet approved by PSC (app_metadata.approved).
          <section className="mx-auto max-w-3xl px-6 py-32">
            <h1 className="font-display text-h2 font-medium text-psc-ink mb-6">{pending.heading}</h1>
            <p className="font-sans text-lg leading-body text-psc-gray mb-8">{pending.body}</p>
            <p className="font-sans text-sm text-psc-gray">
              {pending.contact}{" "}
              <Link
                href="/start"
                className="text-psc-ink underline underline-offset-4 hover:text-psc-red"
              >
                {pending.contactLink}
              </Link>
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
