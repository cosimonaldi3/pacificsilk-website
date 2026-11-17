import type { ExecuteContent } from "@/content/process";
import RouteMap from "./RouteMap";

/* Mock UIs for the three new Execute tiles, in the style of defineVisuals.tsx and
   validateVisuals.tsx (cream cards, red accent, ambient CSS loops from process.css and
   capabilities.css). Tracking, quality and paperwork reuse the capability tile visuals. */

const card = "rounded-xl border border-psc-border bg-psc-bg shadow-[0_12px_40px_-16px_rgb(10_10_10/0.25)]";
const mono = "font-mono text-[11px] tracking-wide";
const v = (i: number) => ({ "--i": i }) as React.CSSProperties;

function Check({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

/* ---------- Adaptable support: the route on two small maps (see RouteMap.tsx) ---------- */

export function SupportVisual({ c, large = false }: { c: ExecuteContent["support"]; large?: boolean }) {
  return (
    <div className={large ? "mx-auto w-full max-w-[40rem]" : "px-6 pb-6 md:px-8"}>
      {/* No visible labels; the stops are named for screen readers */}
      <RouteMap label={c.stops.join(" → ")} />
    </div>
  );
}

/* ---------- Additional services: a sketched container and what we can add around it ---------- */

function ContainerSketch({ large, mark }: { large: boolean; mark: string }) {
  const ink = "var(--color-psc-ink)";
  const ribs: number[] = [];
  for (let x = 28; x < 170; x += 8) ribs.push(x);
  return (
    <svg viewBox="0 0 220 124" aria-hidden="true" className={`overflow-visible ${large ? "w-80" : "w-64"}`}>
      {/* Ground shadow */}
      <ellipse cx="112" cy="108" rx="96" ry="5" fill={ink} fillOpacity="0.08" />
      {/* Roof */}
      <path d="M20 44 L50 28 L200 28 L170 44 Z" fill="var(--color-psc-border)" stroke={ink} strokeWidth="1.3" strokeLinejoin="round" />
      {/* Long side, corrugated */}
      <rect x="20" y="44" width="150" height="56" fill="var(--color-psc-bg)" stroke={ink} strokeWidth="1.3" strokeLinejoin="round" />
      <g stroke={ink} strokeOpacity="0.28" strokeWidth="1">
        {ribs.map((x) => (
          <path key={x} d={`M${x} 48 V96`} />
        ))}
      </g>
      <rect x="20" y="82" width="150" height="6" fill="var(--color-psc-red)" />
      {/* The company mark, painted on the side; a cream outline keeps it clear of the ribs */}
      <text
        x="95"
        y="71"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize="14"
        fontWeight="700"
        letterSpacing="3"
        fill="var(--color-psc-red)"
        stroke="var(--color-psc-bg)"
        strokeWidth="3"
        paintOrder="stroke"
      >
        {mark}
      </text>
      {/* Door end, with locking bars */}
      <path d="M170 44 L200 28 L200 84 L170 100 Z" fill="var(--color-psc-muted)" stroke={ink} strokeWidth="1.3" strokeLinejoin="round" />
      <g stroke={ink} strokeWidth="1.3" strokeLinecap="round">
        <path d="M178 42 V96" strokeOpacity="0.7" transform="translate(0 0)" />
        <path d="M186 38 V91" strokeOpacity="0.7" />
        <path d="M194 34 V87" strokeOpacity="0.7" />
      </g>
      <path d="M170 72 L200 56" stroke={ink} strokeOpacity="0.5" strokeWidth="1" />
      {/* Corner castings */}
      <g fill={ink}>
        <rect x="19" y="43" width="6" height="6" />
        <rect x="19" y="95" width="6" height="6" />
        <rect x="165" y="43" width="6" height="6" />
        <rect x="165" y="95" width="6" height="6" />
      </g>
    </svg>
  );
}

export function ServicesVisual({ c, large = false }: { c: ExecuteContent["services"]; large?: boolean }) {
  const text = large ? "text-[15px]" : "text-[13px]";
  return (
    <div className={`flex h-full flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8 ${large ? "mx-auto w-full max-w-[40rem]" : "px-6 pb-6 md:px-8"}`}>
      <div className="flex shrink-0 justify-center">
        <ContainerSketch large={large} mark={c.containerMark} />
      </div>
      <ul className="space-y-2.5">
        {c.items.map((item) => (
          <li key={item} className={`flex items-start gap-3 font-sans text-psc-ink ${text}`}>
            <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-psc-red" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Issues: found, on site, fixed — then you are told ---------- */

export function IssuesVisual({ c, large = false }: { c: ExecuteContent["issues"]; large?: boolean }) {
  const text = large ? "text-[14px]" : "text-[12px]";
  const last = c.steps.length - 1;
  return (
    <div className={large ? "mx-auto w-full max-w-[28rem]" : "px-6 pb-6"}>
      <div className={`${card} ${large ? "p-5" : "p-4"}`}>
        <div className={`items-baseline justify-between ${large ? "flex" : "hidden"}`}>
          <p className="font-sans text-sm font-medium text-psc-ink">{c.cardTitle}</p>
          <p className={`${mono} text-psc-gray`}>{c.ref}</p>
        </div>
        <ol className={`relative ${large ? "mt-3" : ""}`}>
          {/* The thread joining the steps */}
          <span aria-hidden="true" className="absolute top-3 bottom-3 left-[9px] w-px bg-psc-border" />
          {c.steps.map((s, i) => (
            <li key={s.status} style={v(i)} className={`pd-row relative flex gap-3 ${i ? (large ? "pt-3" : "pt-2") : ""}`}>
              <span
                className={`relative mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full ${
                  i === last ? "bg-psc-red text-psc-bg" : i === 0 ? "cap-pulse border-2 border-psc-red bg-psc-bg" : "border-2 border-psc-ink bg-psc-bg"
                }`}
              >
                {i === last ? <Check className="h-3 w-3" /> : i === 0 ? <span className="h-1.5 w-1.5 rounded-full bg-psc-red" /> : null}
              </span>
              <span className="flex flex-col">
                <span className={`${mono} uppercase ${i === 0 || i === last ? "text-psc-red" : "text-psc-gray"}`}>{s.status}</span>
                <span className={`font-sans text-psc-ink ${text}`}>{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <p
          style={v(c.steps.length)}
          className={`pd-chip flex items-center gap-2 border-t border-psc-border font-sans font-medium text-psc-ink ${large ? "mt-3 pt-3" : "mt-2 pt-2"} ${text}`}
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-psc-ink text-psc-bg">
            <Check className="h-3 w-3" />
          </span>
          {c.note}
        </p>
      </div>
    </div>
  );
}

/* ---------- Quality, compact: the same report and bars as the capability tile, in one short card ---------- */

const QUALITY_BARS: [number, number][] = [[62, 58], [70, 68], [55, 54], [80, 78], [66, 66], [74, 72]];

export function QualityCompactVisual({ c }: { c: ExecuteContent["quality"] }) {
  return (
    <div className="px-6 pb-6">
      <div className={`${card} p-3`}>
        <div className="flex items-baseline justify-between">
          <p className="font-sans text-sm font-medium text-psc-ink">{c.reportTitle}</p>
          <p className={`${mono} text-psc-gray`}>{c.reportRef}</p>
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-1.5">
          {c.checks.map((label, i) => (
            <li
              key={label}
              className="cap-check flex items-center justify-between rounded-md bg-psc-muted px-2 py-1 font-sans text-[11px] text-psc-ink"
              style={v(i)}
            >
              {label}
              <span className="cap-check-mark font-medium text-psc-red">{c.passLabel}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex h-12 items-end gap-2 border-t border-psc-border pt-2">
          {QUALITY_BARS.map(([o, d], i) => (
            <div key={i} className="flex h-full flex-1 items-end gap-0.5">
              <span className="cap-bar flex-1 rounded-t-sm bg-psc-ink" style={{ height: `${o}%`, "--i": i } as React.CSSProperties} />
              <span className="cap-bar flex-1 rounded-t-sm bg-psc-red" style={{ height: `${d}%`, "--i": i + 0.5 } as React.CSSProperties} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
