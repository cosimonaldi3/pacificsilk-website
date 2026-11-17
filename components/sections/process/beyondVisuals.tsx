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

/* ---------- Other ways in: rising steps. Buying, where you are today, is the shortest bar at
   the bottom; each step up goes deeper into China. A red path climbs the ends of the steps. ---------- */

const STEP_H = 32;
const STEP_GAP = 10;
const STEP_TOP = 22;
/* Bar lengths in viewBox units, bottom step first */
const STEP_W = [124, 164, 188, 212];
const STEP_VIEW_W = 250;

export function EntryOptionsVisual({ c, large = false }: { c: BeyondContent["options"]; large?: boolean }) {
  const n = c.items.length;
  /* Row 0 is the bottom step */
  const rowY = (i: number) => STEP_TOP + (n - 1 - i) * (STEP_H + STEP_GAP);
  const ends = c.items.map((_, i) => [STEP_W[i] ?? STEP_W[STEP_W.length - 1], rowY(i) + STEP_H / 2] as const);
  const climb = ends.map(([x, y], i) => `${i ? "L" : "M"}${x + 10} ${y}`).join(" ");
  const height = STEP_TOP + n * (STEP_H + STEP_GAP);
  const [topX, topY] = ends[n - 1];
  return (
    <div className={large ? "mx-auto w-full max-w-[28rem]" : "px-6 pb-6"}>
      <svg viewBox={`0 0 ${STEP_VIEW_W} ${height}`} className="h-auto w-full overflow-visible" role="img" aria-label={c.items.join(", ")}>
        {c.items.map((item, i) => {
          const w = ends[i][0];
          const y = rowY(i);
          const today = i === 0;
          return (
            <g key={item}>
              <rect
                x="0"
                y={y}
                width={w}
                height={STEP_H}
                rx="6"
                fill={today ? "var(--color-psc-ink)" : "var(--color-psc-red)"}
                fillOpacity={today ? 1 : 0.12 + i * 0.1}
              />
              <text
                x="10"
                y={y + STEP_H / 2}
                dominantBaseline="central"
                fontFamily="var(--font-sans)"
                fontSize="11"
                fontWeight="500"
                fill={today ? "var(--color-psc-bg)" : "var(--color-psc-ink)"}
              >
                {item}
              </text>
            </g>
          );
        })}

        {/* The climb, step end to step end (dash flow from capabilities.css) */}
        <path d={climb} fill="none" stroke="var(--color-psc-red)" strokeWidth="1.5" strokeDasharray="4 5" strokeLinejoin="round" className="pb-climb" />
        <path d={`M${topX + 5} ${topY - 6} L${topX + 10} ${topY - 12} L${topX + 15} ${topY - 6}`} fill="none" stroke="var(--color-psc-red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x={topX + 10} y={topY - 20} textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1" fill="var(--color-psc-red)">
          {c.deeperLabel.toUpperCase()}
        </text>

        {/* You are here */}
        <circle cx={ends[0][0] + 10} cy={ends[0][1]} r="5" fill="var(--color-psc-red)" className="pb-here" />
        <circle cx={ends[0][0] + 10} cy={ends[0][1]} r="5" fill="var(--color-psc-red)" />
        <text x={ends[0][0] + 22} y={ends[0][1]} dominantBaseline="central" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1" fill="var(--color-psc-gray)">
          {c.currentLabel.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
