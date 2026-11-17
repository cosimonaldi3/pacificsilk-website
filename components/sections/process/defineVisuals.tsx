import type { DefineContent } from "@/content/process";
import ChinaMap from "./ChinaMap";

/* Mock UIs for the Define tiles, in the capabilities-grid style (cream cards, red accent,
   ambient CSS loops from process.css). Labels only, no real figures. */

const card = "rounded-xl border border-psc-border bg-psc-bg shadow-[0_12px_40px_-16px_rgb(10_10_10/0.25)]";
const mono = "font-mono text-[11px] tracking-wide";
const v = (i: number) => ({ "--i": i }) as React.CSSProperties;

/* ---------- Market insight: stylised map of China with product sketches ----------
   Static on purpose: no animation. */

/* Sample trend lines (x 0..100, y 0..24, higher = further up). Shapes only, no figures. */
const TRENDS: { key: keyof DefineContent["insight"]["products"]; pts: string }[] = [
  { key: "batteries", pts: "0,20 18,18 36,15 54,12 72,6 100,2" },
  { key: "electronics", pts: "0,18 20,15 40,16 60,10 80,8 100,4" },
  { key: "machinery", pts: "0,16 25,14 45,12 65,11 85,8 100,6" },
  { key: "tea", pts: "0,14 22,15 44,11 66,12 84,9 100,8" },
];

export function InsightVisual({ c, large = false }: { c: DefineContent["insight"]; large?: boolean }) {
  const row = large ? "text-[14px]" : "text-[12px]";
  return (
    <div className={`flex h-full flex-col items-stretch gap-4 md:flex-row ${large ? "" : "px-6 pb-6 md:px-8"}`}>
      <div className={`${card} flex flex-1 flex-col p-3`}>
        <p className="mb-1 px-1 font-sans text-sm font-medium text-psc-ink">{c.cardTitle}</p>
        <div className={`mx-auto flex w-full flex-1 items-center ${large ? "max-w-[34rem]" : "max-w-[22rem]"}`}>
          <ChinaMap c={c} />
        </div>
      </div>
      <div className={`${card} flex flex-col p-4 md:shrink-0 ${large ? "md:w-[13.5rem]" : "md:w-[13rem]"}`}>
        <p className="font-sans text-sm font-medium text-psc-ink">{c.trending.cardTitle}</p>
        <ul className="mt-2 flex flex-1 flex-col justify-around">
          {TRENDS.map((t, i) => (
            <li key={t.key} className="border-t border-psc-border py-1.5 first:border-t-0">
              <div className={`flex items-center justify-between font-sans text-psc-ink ${row}`}>
                {c.products[t.key]}
                <svg viewBox="0 0 16 16" className="h-3 w-3 text-psc-red" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12L12 4M6 4h6v6" />
                </svg>
              </div>
              <svg viewBox="0 0 100 24" preserveAspectRatio="none" className={`mt-1 w-full ${large ? "h-6" : "h-4"}`} aria-hidden="true">
                <polyline points={t.pts} fill="none" stroke={i === 0 ? "var(--color-psc-red)" : "var(--color-psc-ink)"} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </li>
          ))}
        </ul>
        <p className={`${mono} mt-1 border-t border-psc-border pt-3 text-psc-gray`}>{c.trending.note}</p>
      </div>
    </div>
  );
}

/* ---------- Viability: price, volume and timeline gauges against the minimum that works ---------- */

export function OpportunityVisual({ c, large = false }: { c: DefineContent["opportunity"]; large?: boolean }) {
  return (
    <div className={large ? "mx-auto w-full max-w-[34rem]" : "px-6 pb-6"}>
      <div className={`${card} ${large ? "p-6" : "p-4"}`}>
        <p className="font-sans text-sm font-medium text-psc-ink">{c.cardTitle}</p>
        <ul className={large ? "mt-5 space-y-5" : "mt-4 space-y-4"}>
          {c.factors.map((f, i) => (
            <li key={f.label}>
              <p className={`mb-1.5 font-sans text-psc-ink ${large ? "text-[14px]" : "text-[12px]"}`}>{f.label}</p>
              <div className={`relative w-full rounded-full bg-psc-muted ${large ? "h-2.5" : "h-2"}`}>
                <span
                  className="pd-fill absolute inset-y-0 left-0 origin-left rounded-full bg-psc-ink"
                  style={{ ...v(i), width: `${f.fill}%` }}
                />
                <span
                  aria-hidden="true"
                  className="absolute -inset-y-1 w-0.5 rounded-full bg-psc-red"
                  style={{ left: `${f.tick}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className={`${mono} mt-3 flex items-center gap-1.5 text-psc-gray`}>
          <span aria-hidden="true" className="h-3 w-0.5 rounded-full bg-psc-red" />
          {c.tickLabel}
        </p>
        <p
          style={v(c.factors.length)}
          className={`pd-chip mt-3 flex items-center gap-2 border-t border-psc-border pt-3 font-sans font-medium text-psc-ink ${large ? "text-[15px]" : "text-[13px]"}`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-psc-red text-psc-bg">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
          </span>
          {c.verdict}
        </p>
      </div>
    </div>
  );
}

/* ---------- Contract: the terms we commit to ----------
   Static on purpose: no animation. Laid out in two columns so the card fills its wide tile
   instead of floating in it. */

export function CostVisual({ c, large = false }: { c: DefineContent["cost"]; large?: boolean }) {
  return (
    <div className={large ? "mx-auto w-full max-w-[40rem]" : "px-6 pb-6 md:px-8"}>
      <div className={`${card} ${large ? "p-6" : "p-4"}`}>
        <p className="font-sans text-sm font-medium text-psc-ink">{c.cardTitle}</p>
        <ul className={`grid gap-x-6 sm:grid-cols-2 ${large ? "mt-4" : "mt-3"}`}>
          {c.terms.map((t) => (
            <li
              key={t.label}
              className={`flex items-center justify-between gap-3 border-t border-psc-border font-sans text-psc-ink ${large ? "py-3 text-[14px]" : "py-2 text-[12px]"}`}
            >
              <span className="flex flex-col">
                <span className="text-psc-gray">{t.label}</span>
                <span className="font-medium">{t.value}</span>
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-psc-red text-psc-bg">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" />
                </svg>
              </span>
            </li>
          ))}
        </ul>
        <p className={`${mono} mt-1 border-t border-psc-border pt-3 text-psc-gray`}>{c.note}</p>
      </div>
    </div>
  );
}

/* ---------- Cost breakdown: a stacked bar built up line by line ----------
   Saved for the Validate stage (content: define.breakdown). Not used on the page yet. */

const SEG = [38, 30, 20, 12];

export function BreakdownVisual({ c }: { c: DefineContent["breakdown"] }) {
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
      <ol className="mt-3 space-y-1.5">
        {c.items.map((label, i) => (
          <li
            key={label}
            className="cap-check flex items-center justify-between border-t border-psc-border pt-1.5 font-sans text-[13px] text-psc-ink"
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
