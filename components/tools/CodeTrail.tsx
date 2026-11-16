"use client";

import type { CSSProperties } from "react";
import { spaced } from "@/lib/tools/format";
import type { TreeNode } from "@/lib/tools/types";
import { useToolsContent } from "./ToolsContent";

interface CodeTrailProps {
  nodes: TreeNode[];
  onJump: (node: TreeNode) => void;
}

// Breadcrumb from the chapter down to the current code; earlier steps jump back up.
export default function CodeTrail({ nodes, onJump }: CodeTrailProps) {
  const { current: c } = useToolsContent();
  return (
    <ol className="trail" aria-label={c.trailLabel}>
      {nodes.map((n, i) => {
        const last = i === nodes.length - 1;
        const label = (
          <>
            <span className="digits">{spaced(n.code, n.code.length)}</span>
            {n.description}
          </>
        );
        return (
          <li key={n.code} style={{ "--depth": i } as CSSProperties}>
            {last ? (
              <span className="here">{label}</span>
            ) : (
              <button type="button" onClick={() => onJump(n)}>
                {label}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}
