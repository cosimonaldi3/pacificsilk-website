"use client";

import { fill, spaced } from "@/lib/tools/format";
import { useToolsContent } from "./ToolsContent";

interface CodeStripProps {
  code: string;
  final: boolean;
}

// The code as four boxes (4 + 2 + 2 + 2 digits); the reached ones are filled.
export default function CodeStrip({ code, final }: CodeStripProps) {
  const { current: c } = useToolsContent();
  const filled = Math.max(0, code.length / 2 - 1); // 4 digits -> 1 box ... 10 -> 4
  const groups = [0, 4, 6, 8].map((from, i) => code.slice(from, [4, 6, 8, 10][i]));
  return (
    <div
      className={final ? "code final" : "code"}
      role="img"
      aria-label={fill(final ? c.finalCodeAria : c.codeSoFarAria, { code: spaced(code, code.length) })}
    >
      {groups.map((g, i) => (
        <span key={i} className={i < filled ? "on" : ""}>
          {g}
        </span>
      ))}
    </div>
  );
}
