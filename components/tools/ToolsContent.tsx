"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ToolsContent } from "@/content/tools";

// The tools have many small client components, so their copy travels by context
// rather than through every prop chain. The server layout supplies it per locale.
const ToolsContentContext = createContext<ToolsContent | null>(null);

interface ToolsContentProviderProps {
  content: ToolsContent;
  children: ReactNode;
}

export function ToolsContentProvider({ content, children }: ToolsContentProviderProps) {
  return <ToolsContentContext.Provider value={content}>{children}</ToolsContentContext.Provider>;
}

export function useToolsContent(): ToolsContent {
  const content = useContext(ToolsContentContext);
  if (!content) throw new Error("useToolsContent must be used inside ToolsContentProvider");
  return content;
}
