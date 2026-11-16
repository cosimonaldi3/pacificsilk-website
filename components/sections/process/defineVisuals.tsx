import type { DefineContent } from "@/content/process";
import ChinaMap from "./ChinaMap";

/* Mock UIs for the Define tiles, in the capabilities-grid style (cream cards, red accent,
   ambient CSS loops from process.css). Labels only, no real figures. */

const card = "rounded-xl border border-psc-border bg-psc-bg shadow-[0_12px_40px_-16px_rgb(10_10_10/0.25)]";
const mono = "font-mono text-[11px] tracking-wide";
const v = (i: number) => ({ "--i": i }) as React.CSSProperties;

/* ---------- Market insight: stylised map of China with product sketches ---------- */

export function InsightVisual({ c }: { c: DefineContent["insight"] }) {
  return (
    <div className="flex h-full flex-col gap-4 px-6 pb-8 md:flex-row md:items-center md:px-8">
      <div className={`${card} w-full p-3 md:max-w-[28rem] md:flex-1`}>
        <p className="mb-1 px-1 font-sans text-sm font-medium text-psc-ink">{c.cardTitle}</p>
        <ChinaMap c={c} />
      </div>
      <ul className="flex shrink-0 gap-5 md:flex-col md:gap-3">
        <li className="flex items-center gap-2 font-sans text-[12px] text-psc-ink">
          <span className="h-3.5 w-3.5 rounded-full bg-psc-red ring-4 ring-psc-red/20" />
          {c.legendHub}
        </li>
        <li className="flex items-center gap-2 font-sans text-[12px] text-psc-ink">
          <span className="h-2.5 w-2.5 rounded-full bg-psc-red" />
          {c.legendRegion}
        </li>
      </ul>
    </div>
  );
}

/* ---------- Opportunities: rings around your project, opportunities lighting up ---------- */

const OPPS: [number, number][] = [
  [50, 18], [118, 44], [140, 98], [92, 128], [30, 112], [14, 62],
];

export function OpportunityVisual({ c }: { c: DefineContent["opportunity"] }) {
  return (
    <div className="flex h-full flex-col items-center px-6 pb-6">
      <svg viewBox="0 0 156 150" className="h-auto w-full max-w-[13rem]" aria-hidden="true">
        {[22, 44, 66].map((r) => (
          <circle key={r} cx={78} cy={75} r={r} fill="none" stroke="var(--color-psc-border)" strokeWidth="1" strokeDasharray="2 4" />
        ))}
        {OPPS.map(([x, y], i) => (
          <g key={i}>
            <line x1={78} y1={75} x2={x + 8} y2={y + 4} stroke="var(--color-psc-border)" strokeWidth="1" />
            <circle cx={x + 8} cy={y + 4} r={i % 3 === 0 ? 6 : 4} className="pd-opp" style={v(i)} />
          </g>
        ))}
        <circle cx={78} cy={75} r={13} fill="var(--color-psc-ink)" />
        <circle cx={78} cy={75} r={13} fill="none" stroke="var(--color-psc-red)" strokeWidth="2" className="pd-ping" />
      </svg>
      <p className={`${mono} -mt-1 text-psc-ink`}>{c.center}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
        {c.chips.map((chip, i) => (
          <li key={chip} style={v(i)} className="pd-chip rounded-full border border-psc-border bg-psc-bg px-2.5 py-1 font-sans text-[11px] text-psc-ink">
            {chip}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Costs: a stacked bar built up line by line ---------- */

const SEG = [38, 30, 20, 12];

export function CostVisual({ c }: { c: DefineContent["cost"] }) {
  return (
    <div className="px-6 pb-8">
      <div className={`${card} p-4`}>
        <p className="font-sans text-sm font-medium text-psc-ink">{c.cardTitle}</p>
        <div className="mt-4 flex h-5 w-full gap-0.5 overflow-hidden rounded-md">
          {SEG.map((w, i) => (
            <span
              key={i}
              className="pd-seg h-full origin-left"
              style={{ ...v(i), width: `${w}%`, background: i === 0 ? "var(--color-psc-red)" : `color-mix(in srgb, var(--color-psc-ink) ${90 - i * 22}%, var(--color-psc-bg))` }}
            />
          ))}
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
          {c.segments.map((label, i) => (
            <li key={label} style={v(i)} className="pd-row flex items-center gap-2 font-sans text-[12px] text-psc-ink">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ background: i === 0 ? "var(--color-psc-red)" : `color-mix(in srgb, var(--color-psc-ink) ${90 - i * 22}%, var(--color-psc-bg))` }}
              />
              {label}
            </li>
          ))}
        </ul>
        <p className={`${mono} mt-3 flex items-center gap-1.5 border-t border-psc-border pt-3 text-psc-gray`}>
          <svg viewBox="0 0 16 16" className="h-3 w-3 text-psc-red" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
          {c.note}
        </p>
      </div>
    </div>
  );
}

/* ---------- Trip: itinerary with ticks, next to the globe ---------- */

export function TripPlan({ c }: { c: DefineContent["trip"] }) {
  return (
    <div className={`${card} w-full max-w-xs p-4`}>
      <p className="font-sans text-sm font-medium text-psc-ink">{c.cardTitle}</p>
      <ol className="mt-3 space-y-2.5">
        {c.items.map((label, i) => (
          <li
            key={label}
            className="cap-check flex items-center justify-between border-t border-psc-border pt-2.5 font-sans text-[13px] text-psc-ink"
            style={v(i)}
          >
            {label}
            <span className="cap-check-mark flex h-5 w-5 items-center justify-center rounded-full bg-psc-red text-psc-bg">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
