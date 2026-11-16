import type { CapabilitiesContent } from "@/content/capabilities";

/* Mock UIs for the capability tiles. Pure markup + CSS loops (capabilities.css):
   animation runs on load and as ambient loops, never tied to scroll. */

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 ${className}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

const card = "rounded-xl border border-psc-border bg-psc-bg shadow-[0_12px_40px_-16px_rgb(10_10_10/0.25)]";
const mono = "font-mono text-[11px] tracking-wide";

/* ---------- Verify: supplier profile + anonymous network ---------- */

// Fixed, anonymous node layout: left cluster = origin, right cluster = destination
const NODES: [number, number][] = [
  [30, 40], [62, 22], [48, 78], [90, 60], [70, 110], [24, 120], [100, 140],
  [230, 30], [262, 70], [214, 96], [250, 126], [282, 104], [226, 150], [270, 160],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [4, 5], [4, 6], [3, 6],
  [7, 8], [8, 9], [9, 10], [10, 11], [8, 11], [10, 12], [12, 13], [11, 13],
  [3, 9], [6, 10], [1, 7],
];

/* Anonymous network: two clusters joined by red links. Needs capabilities.css. */
export function NetworkGraph({ className = "h-auto w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 310 180" className={className} aria-hidden="true">
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
          className={a < 7 && b >= 7 ? "cap-bridge-edge" : "cap-edge"}
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      {NODES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} className="cap-node" style={{ "--i": i } as React.CSSProperties} />
      ))}
    </svg>
  );
}

export function VerifyVisual({ c }: { c: CapabilitiesContent["verify"] }) {
  return (
    <div className="flex h-full flex-col gap-6 px-6 pb-8 md:flex-row md:items-end md:px-8">
      <div className={`${card} w-full max-w-xs shrink-0 p-5`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-sans text-sm font-medium text-psc-ink">{c.cardTitle}</p>
            <p className={`${mono} text-psc-gray`}>{c.cardRef}</p>
          </div>
          <span className="cap-badge rounded-full bg-psc-red px-2.5 py-1 font-sans text-[11px] font-medium text-psc-bg">
            {c.status}
          </span>
        </div>
        <ul className="mt-4 space-y-2.5">
          {c.checks.map((label, i) => (
            <li
              key={label}
              className="cap-check flex items-center justify-between border-t border-psc-border pt-2.5 font-sans text-[13px] text-psc-ink"
              style={{ "--i": i } as React.CSSProperties}
            >
              {label}
              <span className="cap-check-mark flex h-5 w-5 items-center justify-center rounded-full bg-psc-red text-psc-bg">
                <Check />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <figure className="relative hidden min-w-0 flex-1 md:block">
        <NetworkGraph />
        <figcaption className={`${mono} mt-2 text-center uppercase text-psc-gray`}>{c.networkLabel}</figcaption>
      </figure>
    </div>
  );
}

/* ---------- Quality: inspection report + origin/destination bars ---------- */

const BARS: [number, number][] = [
  [62, 58], [70, 68], [55, 54], [80, 78], [66, 66], [74, 72], [58, 57], [86, 84],
];

export function QualityVisual({ c }: { c: CapabilitiesContent["quality"] }) {
  return (
    <div className="flex h-full flex-col gap-4 px-6 pb-8 md:px-8">
      <div className={`${card} p-4`}>
        <div className="flex items-baseline justify-between">
          <p className="font-sans text-sm font-medium text-psc-ink">{c.reportTitle}</p>
          <p className={`${mono} text-psc-gray`}>{c.reportRef}</p>
        </div>
        <ul className="mt-3 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
          {c.checks.map((label, i) => (
            <li
              key={label}
              className="cap-check flex items-center justify-between rounded-md bg-psc-muted px-2.5 py-1.5 font-sans text-[12px] text-psc-ink"
              style={{ "--i": i } as React.CSSProperties}
            >
              {label}
              <span className="cap-check-mark font-medium text-psc-red">{c.passLabel}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${card} flex-1 p-4`}>
        <div className="flex items-center justify-between">
          <p className="font-sans text-[12px] text-psc-gray">{c.chartTitle}</p>
          <div className={`${mono} flex gap-3 text-psc-gray`}>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-psc-ink" />{c.originLabel}</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-psc-red" />{c.destinationLabel}</span>
          </div>
        </div>
        <div className="mt-4 flex h-28 items-end gap-2">
          {BARS.map(([o, d], i) => (
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

/* ---------- Paperwork: fanned documents + stamp ---------- */

export function PaperworkVisual({ c }: { c: CapabilitiesContent["paperwork"] }) {
  return (
    <div className="relative mx-auto h-56 w-full max-w-[17rem]">
      {c.docs.map((doc, i) => (
        <div
          key={doc}
          className={`${card} cap-doc absolute inset-x-4 top-4 h-44 p-4`}
          style={{ "--i": i, zIndex: i } as React.CSSProperties}
        >
          <p className="font-sans text-[12px] font-medium text-psc-ink">{doc}</p>
          <div className="mt-3 space-y-1.5">
            {[90, 70, 80, 55].map((w, k) => (
              <span key={k} className="block h-1.5 rounded-full bg-psc-muted" style={{ width: `${w}%` }} />
            ))}
          </div>
          {i === c.docs.length - 1 && (
            <span className="cap-stamp absolute bottom-4 right-4 rounded-md border-2 border-psc-red px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-psc-red">
              {c.stamp}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Tracking: project timeline ---------- */

export function TrackingVisual({ c }: { c: CapabilitiesContent["tracking"] }) {
  const pct = (c.current / (c.steps.length - 1)) * 100;
  return (
    <div className="px-6 pb-8 md:px-8">
      <div className={`${card} p-5`}>
        <p className={`${mono} uppercase text-psc-gray`}>{c.projectLabel}</p>
        <div className="relative mt-6">
          <div className="absolute left-2 right-2 top-2 h-0.5 bg-psc-border" />
          <div
            className="cap-progress absolute left-2 top-2 h-0.5 bg-psc-red"
            style={{ "--w": `calc((100% - 1rem) * ${pct / 100})` } as React.CSSProperties}
          />
          <ol className="relative flex justify-between">
            {c.steps.map((step, i) => (
              <li key={step} className="flex flex-col items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full border-2 ${
                    i < c.current
                      ? "border-psc-red bg-psc-red"
                      : i === c.current
                        ? "cap-pulse border-psc-red bg-psc-bg"
                        : "border-psc-border bg-psc-bg"
                  }`}
                />
                <span className={`font-sans text-[11px] ${i <= c.current ? "text-psc-ink" : "text-psc-gray"}`}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-psc-border pt-3 font-sans text-[12px] text-psc-ink">
          <span className="cap-pulse h-2 w-2 rounded-full bg-psc-red" />
          {c.updateLabel}
        </div>
      </div>
    </div>
  );
}
