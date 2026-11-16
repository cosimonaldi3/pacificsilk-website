"use client";

import { spaced } from "@/lib/tools/format";
import type { TreeOption } from "@/lib/tools/types";
import { useToolsContent } from "./ToolsContent";

interface CodeLevelProps {
  options: TreeOption[];
  onChoose: (node: TreeOption) => void;
}

// One level of the picker: the children of the current code.
export default function CodeLevel({ options, onChoose }: CodeLevelProps) {
  const { current: c } = useToolsContent();
  return (
    <>
      <h3 className="pick">{c.pick}</h3>
      <ul className="rows">
        {options.map((o) => (
          <li key={o.code}>
            <button className="opt" type="button" onClick={() => onChoose(o)}>
              <span>{o.description}</span>
              <span className="digits">{spaced(o.code, o.code.length)}</span>
              {!o.hasChildren && <span className="tag">{c.finalTag}</span>}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
