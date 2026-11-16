import type { ReactNode } from "react";
import { ServicesProvider } from "@/components/tools/Services";
import { ToolsContentProvider } from "@/components/tools/ToolsContent";
import "@/components/tools/tools.css";
import { loadToolsContent } from "@/content/tools";

interface ToolsShellProps {
  locale: string;
  children: ReactNode;
}

// Everything a tool needs to render: its copy, the scoped styles and the services
// dialog. /tools, the home page and the portal dashboard all mount tools through this.
export default async function ToolsShell({ locale, children }: ToolsShellProps) {
  const content = await loadToolsContent(locale);

  return (
    <ToolsContentProvider content={content}>
      <div className="psc-tools">
        <ServicesProvider>{children}</ServicesProvider>
      </div>
    </ToolsContentProvider>
  );
}
