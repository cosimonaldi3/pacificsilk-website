import type { ReactNode } from "react";
import ToolsShell from "@/components/tools/ToolsShell";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";

export default async function ToolsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
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
