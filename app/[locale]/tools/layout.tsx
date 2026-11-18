import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import ToolsShell from "@/components/tools/ToolsShell";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import { SHOW_TOOLS } from "@/lib/features";

export default async function ToolsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Hidden on the public site until launch (see lib/features.ts). Covers every /tools page.
  if (!SHOW_TOOLS) notFound();

  const { locale } = await params;

  return (
    <>
      <Nav />
      <ToolsShell locale={locale}>
        <main>{children}</main>
      </ToolsShell>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
