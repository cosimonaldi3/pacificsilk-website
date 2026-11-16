import Container from "@/components/ui/Container";
import TileShell from "./TileShell";
import type { BuildingBlockKey, CapabilitiesPageContent } from "@/content/capabilities";
import "./capabilities.css";

interface BuildingBlocksProps {
  content: CapabilitiesPageContent["blocks"];
}

const GLOW: Record<BuildingBlockKey, string> = {
  find: "95% 0%",
  negotiate: "100% 100%",
  produce: "0% 100%",
  move: "100% 0%",
  advise: "50% 100%",
  groups: "0% 0%",
};

/* Small looping glyph per block. Decorative: the title carries the meaning. */
function Glyph({ kind }: { kind: BuildingBlockKey }) {
  const common = {
    viewBox: "0 0 48 48",
    className: "h-12 w-12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    "aria-hidden": true,
  };
  switch (kind) {
    case "find":
      return (
        <svg {...common}>
          <g className="text-psc-border">
            {[12, 20, 28, 36].map((y) => (
              <path key={y} d={`M8 ${y}h32`} />
            ))}
          </g>
          <g className="bb-scan text-psc-ink">
            <circle cx="20" cy="20" r="8" />
            <path d="M26 26l6 6" className="text-psc-red" stroke="currentColor" />
          </g>
        </svg>
      );
    case "negotiate":
      return (
        <svg {...common}>
          <text x="6" y="22" className="bb-swap-a fill-psc-ink font-sans" stroke="none" fontSize="14">中</text>
          <text x="30" y="40" className="bb-swap-b fill-psc-ink font-sans" stroke="none" fontSize="14">A</text>
          <path d="M26 14h12l-3-3M22 34H10l3 3" className="text-psc-red" />
        </svg>
      );
    case "produce":
      return (
        <svg {...common}>
          <rect x="8" y="10" width="26" height="30" rx="2" className="text-psc-border" />
          <path d="M13 18h16M13 24h12M13 30h14" className="text-psc-border" />
          <g className="bb-stamp text-psc-red">
            <circle cx="34" cy="32" r="9" />
            <path d="M30 32l3 3 5-6" />
          </g>
        </svg>
      );
    case "move":
      return (
        <svg {...common}>
          <path d="M6 30h36" className="text-psc-border" strokeDasharray="3 3" />
          <g className="bb-truck text-psc-ink">
            <rect x="6" y="22" width="12" height="8" rx="1" fill="currentColor" stroke="none" />
            <circle cx="20" cy="30" r="2" className="text-psc-red" fill="currentColor" stroke="none" />
          </g>
        </svg>
      );
    case "advise":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="15" className="text-psc-border" />
          <g className="bb-needle">
            <path d="M24 13l3 11h-6z" className="text-psc-red" fill="currentColor" stroke="none" />
            <path d="M24 35l3-11h-6z" className="text-psc-ink" fill="currentColor" stroke="none" />
          </g>
        </svg>
      );
    case "groups":
      return (
        <svg {...common}>
          {[
            [10, 12],
            [38, 12],
            [10, 36],
            [38, 36],
          ].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x} ${y}L24 24`} className="bb-link text-psc-red" style={{ "--i": i } as React.CSSProperties} />
              <circle cx={x} cy={y} r="3" className="text-psc-ink" fill="currentColor" stroke="none" />
            </g>
          ))}
          <circle cx="24" cy="24" r="4" className="text-psc-red" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

/* Six building blocks in the same cream-tile style as the capabilities grid. */
export default function BuildingBlocks({ content }: BuildingBlocksProps) {
  return (
    <section aria-labelledby="blocks-heading" className="bg-psc-bg py-16 md:py-20">
      <Container>
        <h2 id="blocks-heading" className="mb-8 font-sans text-small uppercase tracking-widest text-psc-gray">
          {content.label}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {content.items.map((b) => (
            <TileShell key={b.key} glowAt={GLOW[b.key]}>
              <div className="relative flex h-full flex-col p-6 md:p-8">
                <Glyph kind={b.key} />
                <h3 className="mt-6 font-display text-h3 font-medium leading-snug text-psc-ink">{b.title}</h3>
                <p className="mt-2 font-sans text-body leading-body text-psc-gray">{b.body}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                  {b.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-psc-border bg-psc-bg/70 px-3 py-1 font-mono text-[11px] tracking-wide text-psc-ink"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </TileShell>
          ))}
        </div>
      </Container>
    </section>
  );
}
