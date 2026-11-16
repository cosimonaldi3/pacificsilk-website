"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import type { ComparisonContent } from "@/content/home";

interface ComparisonProps {
  content: ComparisonContent;
}

/* One line per column, each with a dot travelling it (home.css):
   0 doing it yourself: the line is broken, the dot falls through the gap
   1 intermediaries: a zigzag through many layers, the dot stutters
   2 Pacific Silk: one smooth red curve, the dot glides */
const CHAIN_PATHS = [
  "M14 12 H60",
  "M14 12 L30 4 L44 20 L58 4 L72 20 L86 4 L100 20 L114 4 L126 12",
  "M14 12 C 50 2, 90 22, 126 12",
];

function Chain({ col }: { col: number }) {
  const ours = col === 2;
  return (
    <svg viewBox="0 0 140 24" className="h-6 w-full max-w-[140px] overflow-visible" aria-hidden="true">
      {col === 0 ? (
        <>
          <path d="M14 12 H60" stroke="var(--color-psc-gray)" strokeWidth={1.5} />
          <path d="M80 12 H126" stroke="var(--color-psc-gray)" strokeWidth={1.5} className="hm-broken" />
          <path d="M60 12 l4 -4 M64 12 l-4 4 M80 12 l-4 -4" stroke="var(--color-psc-red)" strokeWidth={1.2} opacity={0.7} />
        </>
      ) : (
        <path
          d={CHAIN_PATHS[col]}
          fill="none"
          stroke={ours ? "var(--color-psc-red)" : "var(--color-psc-gray)"}
          strokeWidth={ours ? 2.5 : 1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {col === 1 &&
        [30, 44, 58, 72, 86, 100, 114].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 20 : 4} r={2.5} fill="var(--color-psc-border)" stroke="var(--color-psc-gray)" strokeWidth={1} />
        ))}
      {[14, 126].map((x) => (
        <circle key={x} cx={x} cy={12} r={5} fill="var(--color-psc-bg)" stroke={ours ? "var(--color-psc-red)" : "var(--color-psc-ink)"} strokeWidth={1.5} />
      ))}
      <circle r={3.5} className={`hm-chain-dot hm-chain-${col}`} style={{ offsetPath: `path("${CHAIN_PATHS[col]}")` }} fill={ours ? "var(--color-psc-red)" : "var(--color-psc-ink)"} />
    </svg>
  );
}

export default function Comparison({ content }: ComparisonProps) {
  const [tab, setTab] = useState(2);
  const colBg = (i: number) => (i === 2 ? "bg-psc-bg" : "");

  return (
    <section aria-labelledby="comparison-heading" className="bg-psc-bg py-16 md:py-20">
      <Container>
        <p className="mb-4 font-sans text-small uppercase tracking-widest text-psc-gray">{content.label}</p>
        <h2 id="comparison-heading" className="mb-3 font-display text-h2 font-medium leading-tight text-psc-ink">
          {content.headline}
        </h2>
        <p className="mb-8 font-sans text-small text-psc-gray">{content.note}</p>

        {/* Desktop / tablet: full table */}
        <div role="table" aria-label={content.headline} className="hidden overflow-hidden rounded-2xl border border-psc-border bg-psc-muted/60 md:grid md:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div role="row" className="contents">
            <div role="columnheader" className="p-6" />
            {content.columns.map((col, i) => (
              <div key={col.title} role="columnheader" className={`${colBg(i)} ${i === 2 ? "border-t-2 border-psc-red" : ""}`}>
                <div className="flex h-full w-full flex-col items-start gap-3 p-6">
                  <Chain col={i} />
                  <span className={`font-display text-xl font-medium leading-snug ${i === 2 ? "text-psc-red" : "text-psc-ink"}`}>{col.title}</span>
                  <span className="font-sans text-[13px] text-psc-gray">{col.sub}</span>
                </div>
              </div>
            ))}
          </div>
          {content.rows.map((row) => (
            <div role="row" key={row.label} className="contents">
              <div role="rowheader" className="border-t border-psc-border p-6 font-sans text-small font-medium text-psc-ink">
                {row.label}
              </div>
              {row.values.map((val, i) => (
                <div
                  key={i}
                  role="cell"
                  className={`border-t border-psc-border p-6 font-sans text-small leading-snug ${colBg(i)} ${
                    i === 2 ? "font-medium text-psc-ink" : "text-psc-gray"
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile: one column at a time */}
        <div className="md:hidden">
          <div role="tablist" aria-label={content.headline} className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-psc-muted p-1">
            {content.columns.map((col, i) => (
              <button
                key={col.title}
                role="tab"
                type="button"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className={`rounded-lg px-2 py-2 font-sans text-[12px] font-medium leading-tight transition-colors ${
                  tab === i ? "bg-psc-bg text-psc-ink shadow-sm" : "text-psc-gray"
                }`}
              >
                {col.title}
              </button>
            ))}
          </div>
          <div role="tabpanel" className={`rounded-2xl border bg-psc-bg p-5 ${tab === 2 ? "border-psc-red" : "border-psc-border"}`}>
            <Chain col={tab} />
            <p className="mt-2 font-sans text-[13px] text-psc-gray">{content.columns[tab].sub}</p>
            <dl className="mt-4">
              {content.rows.map((row) => (
                <div key={row.label} className="border-t border-psc-border py-3">
                  <dt className="font-sans text-[12px] uppercase tracking-wider text-psc-gray">{row.label}</dt>
                  <dd className={`mt-1 font-sans text-body ${tab === 2 ? "font-medium text-psc-ink" : "text-psc-ink"}`}>{row.values[tab]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
