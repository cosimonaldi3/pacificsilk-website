import { NetworkGraph } from "@/components/sections/capabilities/visuals";
import type { BeyondContent } from "@/content/process";

/* Mock UIs for the Beyond tiles, in the style of executeVisuals.tsx (cream cards, red
   accent). Only the repeat order and the network move; the pass and the options are static. */

const card = "rounded-xl border border-psc-border bg-psc-bg shadow-[0_12px_40px_-16px_rgb(10_10_10/0.25)]";
const mono = "font-mono text-[11px] tracking-wide";
const v = (i: number) => ({ "--i": i }) as React.CSSProperties;

/* ---------- Recurring: a stack of purchase orders, one per year. The earlier ones peek out
   behind; the front one is this year's reorder, filled in from last year's and stamped. ---------- */

export function RecurringVisual({ c, large = false }: { c: BeyondContent["recurring"]; large?: boolean }) {
  const text = large ? "text-[14px]" : "text-[12px]";
  const depth = c.pastTags.length;
  return (
    <div className={`flex h-full items-center justify-center ${large ? "mx-auto w-full max-w-[30rem]" : "px-6 pb-6 md:px-8"}`}>
      <div className={`relative w-full ${large ? "max-w-[24rem]" : "max-w-[22rem]"}`} style={{ paddingTop: depth * 16 }}>
        {/* Earlier years, fanned behind */}
        {c.pastTags.map((tag, i) => {
          const back = depth - i;
          return (
            <div
              key={tag}
              aria-hidden="true"
              className={`${card} absolute inset-x-0 bottom-0 flex items-start px-4 pt-1 ${back % 2 ? "justify-end" : "justify-start"}`}
              style={{
                top: i * 16,
                transform: `scale(${1 - back * 0.04}) rotate(${back % 2 ? -3 : 2.5}deg)`,
                opacity: 1 - back * 0.12,
              }}
            >
              <span className={`${mono} uppercase text-psc-gray`}>{tag}</span>
            </div>
          );
        })}

        {/* This year's order */}
        <div className={`${card} relative ${large ? "p-5" : "p-4"}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-xl font-medium leading-none text-psc-ink">{c.poTitle}</p>
            <span className={`${mono} shrink-0 whitespace-nowrap rounded-full bg-psc-red px-2 py-0.5 uppercase text-psc-bg`}>{c.currentTag}</span>
          </div>
          <dl className="mt-3 border-t border-dashed border-psc-border">
            {c.rows.map((r) => (
              <div key={r.label} className={`flex items-baseline justify-between gap-3 border-b border-dashed border-psc-border ${large ? "py-2" : "py-1"}`}>
                <dt className={`${mono} uppercase text-psc-gray`}>{r.label}</dt>
                <dd className={`font-sans font-medium text-psc-ink ${text}`}>{r.value}</dd>
              </div>
            ))}
          </dl>
          {/* Stamped across the bottom edge of the order; same motion as the Validate tiles (process.css) */}
          <span
            aria-hidden="true"
            className={`pv-stamp absolute -bottom-4 left-5 whitespace-nowrap bg-psc-bg rounded-md border-2 border-psc-red px-2 py-0.5 font-mono font-bold uppercase tracking-widest text-psc-red ${large ? "text-[13px]" : "text-[11px]"}`}
            style={{ "--r": "-8deg" } as React.CSSProperties}
          >
            {c.stamp}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Trade fairs: a visitor pass on its lanyard. Static. ---------- */

export function FairVisual({ c, large = false }: { c: BeyondContent["fairs"]; large?: boolean }) {
  return (
    <div className={`flex justify-center ${large ? "" : "px-6 pb-6"}`}>
      <div className="flex flex-col items-center">
        {/* Lanyard */}
        <svg viewBox="0 0 80 28" aria-hidden="true" className={large ? "w-28" : "w-20"}>
          <path d="M8 0 L36 26 M72 0 L44 26" stroke="var(--color-psc-red)" strokeWidth="5" strokeLinecap="round" />
          <rect x="34" y="20" width="12" height="8" rx="2" fill="var(--color-psc-ink)" />
        </svg>
        <div className={`${card} -mt-1 overflow-hidden ${large ? "w-64" : "w-48"} -rotate-2`}>
          <div className="flex items-center justify-between bg-psc-red px-3 py-1.5">
            <span className={`${mono} uppercase text-psc-bg`}>{c.passLabel}</span>
            <span aria-hidden="true" className="h-2 w-6 rounded-full bg-psc-bg/80" />
          </div>
          <div className={large ? "p-4" : "p-3"}>
            <p className={`font-display font-medium leading-tight text-psc-ink ${large ? "text-3xl" : "text-2xl"}`}>{c.fairName}</p>
            <p className={`${mono} mt-1 uppercase text-psc-gray`}>{c.place}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {c.sessions.map((s) => (
                <li key={s} className="rounded-full border border-psc-border bg-psc-muted px-2 py-0.5 font-sans text-[11px] text-psc-ink">
                  {s}
                </li>
              ))}
            </ul>
            {/* A barcode, drawn */}
            <div aria-hidden="true" className="mt-3 flex h-5 items-stretch gap-[2px]">
              {[2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2].map((w, i) => (
                <span key={i} className="bg-psc-ink" style={{ width: w }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Network: the shared graph (capabilities.css) and the roles you can take ---------- */

export function NetworkVisual({ c, large = false }: { c: BeyondContent["network"]; large?: boolean }) {
  return (
    <div className={`flex h-full flex-col justify-end ${large ? "mx-auto w-full max-w-[36rem]" : "px-6 pb-6 md:px-8"}`}>
      <NetworkGraph className={`mx-auto h-auto w-full ${large ? "" : "max-w-[22rem]"}`} />
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {c.roles.map((role, i) => (
          <li
            key={role}
            className={`rounded-full px-3 py-1 font-sans text-[12px] font-medium ${
              i === 0 ? "bg-psc-red text-psc-bg" : "border border-psc-border bg-psc-bg text-psc-ink"
            }`}
          >
            {role}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Other ways in: one road that splits. You start on the trunk, buying. It forks, and one
   fork forks again: each road ends in its own way into China. No words, no motion: the title and
   points beside it say the rest. ---------- */

export function EntryOptionsVisual({ c, large = false }: { c: BeyondContent["options"]; large?: boolean }) {
  /* Each road as one path; the trunk and the first fork are shared, so they are drawn once */
  const roads = [
    "M0 70 H56 C84 70 84 70 100 70", // trunk
    "M100 70 C128 70 134 22 170 22 H228", // upper road
    "M100 70 C128 70 134 70 150 70 H228", // middle road
    "M100 70 C128 70 134 118 170 118 H228", // lower road
    "M150 70 C176 70 182 46 200 46 H228", // the middle road forks again
  ];
  const ends = [22, 46, 70, 118];
  return (
    <div className={large ? "mx-auto w-full max-w-[26rem]" : "px-6 pb-6"}>
      <svg viewBox="0 0 240 140" className="h-auto w-full overflow-visible" role="img" aria-label={c.items.join(", ")} fill="none">
        {roads.map((d) => (
          <path key={d} d={d} stroke="var(--color-psc-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {/* The junctions */}
        {[
          [100, 70],
          [150, 70],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="2.5" fill="var(--color-psc-ink)" />
        ))}
        {/* Where each road arrives */}
        {ends.map((y) => (
          <circle key={y} cx="228" cy={y} r="4" fill="var(--color-psc-bg)" stroke="var(--color-psc-red)" strokeWidth="1.5" />
        ))}
        {/* You, at the start of the trunk */}
        <circle cx="14" cy="70" r="9" fill="var(--color-psc-red)" fillOpacity="0.18" />
        <circle cx="14" cy="70" r="4.5" fill="var(--color-psc-red)" />
      </svg>
    </div>
  );
}
