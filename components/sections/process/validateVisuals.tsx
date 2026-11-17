import type { ValidateContent } from "@/content/process";
import MiniGlobe from "@/components/sections/capabilities/MiniGlobe";

/* Mock UIs for the Validate tiles, in the same style as defineVisuals.tsx (cream cards, red
   accent, ambient CSS loops from process.css and capabilities.css). Every name and number
   shown is an invented sample. */

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

function Tick() {
  return (
    <span className="cap-check-mark flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-psc-red text-psc-bg">
      <Check />
    </span>
  );
}

/* ---------- Suppliers: a sample business licence next to the supplier check list ---------- */

/* A fixed, made-up QR pattern: a seeded pseudo-random grid with the three corner finders.
   It encodes nothing. */
const QR_N = 21;
const QR: [number, number][] = (() => {
  const cells: [number, number][] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > QR_N - 9 && y < 8) || (x < 8 && y > QR_N - 9);
  for (let y = 0; y < QR_N; y++)
    for (let x = 0; x < QR_N; x++) if (!inFinder(x, y) && rnd() > 0.52) cells.push([x, y]);
  return cells;
})();

function FakeQr({ className }: { className: string }) {
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} fill="var(--color-psc-ink)" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="var(--color-psc-bg)" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="var(--color-psc-ink)" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${QR_N} ${QR_N}`} className={className} shapeRendering="crispEdges" aria-hidden="true">
      {QR.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="var(--color-psc-ink)" />
      ))}
      {finder(0, 0)}
      {finder(QR_N - 7, 0)}
      {finder(0, QR_N - 7)}
    </svg>
  );
}

/* Round red seal with its text set around the edge. A plain star in the middle, like any
   company seal; it imitates no real authority. */
function Seal({ text, id, className }: { text: string; id: string; className: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <path id={id} d="M50 50 m-34 0 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-psc-red)" strokeWidth="3.5" />
      <text fill="var(--color-psc-red)" fontSize="11" letterSpacing="3" lang="zh">
        <textPath href={`#${id}`} startOffset="0">
          {text}
          {text}
        </textPath>
      </text>
      <path
        d="M50 34 l4.7 9.6 10.6 1.5 -7.7 7.5 1.8 10.5 -9.4-5 -9.4 5 1.8-10.5 -7.7-7.5 10.6-1.5z"
        fill="var(--color-psc-red)"
      />
    </svg>
  );
}

/* Sized in container units (cqw) so the whole document scales with its own width, like a
   scan of the real thing, from a phone to the opened overlay. */
function BusinessLicence({ c, large }: { c: ValidateContent["suppliers"]["licence"]; large: boolean }) {
  const id = large ? "lg" : "sm";
  const small = "text-[2.1cqw]";
  /* Chinese text is softened, not removed: it reads as script without being legible */
  const zh = "blur-[0.7px]";
  const rows = [...c.left, ...c.right];
  return (
    <figure className="@container relative w-full">
      <span className="sr-only">{c.srLabel}</span>
      <div
        aria-hidden="true"
        lang="zh"
        className="relative aspect-[1.42] w-full overflow-hidden rounded-md bg-psc-bg shadow-[0_12px_40px_-16px_rgb(10_10_10/0.3)]"
      >
        {/* One thin gold frame, the only ornament on the licence */}
        <div className="absolute inset-[3.5%] rounded-sm border border-psc-gold/60 bg-psc-bg" />

        <div className="absolute inset-[3.5%] flex flex-col px-[4.5%] pt-[3%] pb-[3.5%] text-psc-ink">
          {/* Top row: credit code, roundel and title, QR */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-[2cqw]">
            <div className={`${small} leading-snug`}>
              <p className={`text-psc-gray ${zh}`}>{c.serial}</p>
              <p className={`mt-[0.6cqw] ${zh}`}>{c.codeLabel}</p>
              <p className="font-mono tracking-tight">{c.code}</p>
            </div>
            <div className="flex flex-col items-center">
              {/* Simple red and gold roundel, standing in for the emblem */}
              <span className="flex h-[6.5cqw] w-[6.5cqw] items-center justify-center rounded-full bg-psc-gold">
                <span className="h-[70%] w-[70%] rounded-full border border-psc-bg/70 bg-psc-red" />
              </span>
              <p className={`mt-[1cqw] text-[7cqw] font-serif leading-none font-bold tracking-[0.25em] whitespace-nowrap ${zh}`}>
                {c.title}
              </p>
              <p className={`${small} mt-[0.8cqw] ${zh}`}>{c.copy}</p>
            </div>
            <div className="flex items-start justify-end gap-[1cqw]">
              <p className={`max-w-[5.5em] text-right text-[1.7cqw] leading-snug text-psc-gray ${zh}`}>{c.qrNote}</p>
              <FakeQr className="h-[10cqw] w-[10cqw] shrink-0" />
            </div>
          </div>

          {/* Fields: left column, then right column; they appear one by one */}
          <dl className={`mt-[4cqw] grid flex-1 grid-flow-col grid-cols-2 grid-rows-4 content-start gap-x-[5cqw] gap-y-[2.2cqw] text-[2.4cqw] ${zh}`}>
            {rows.map((f, i) => (
              <div key={f.label} style={v(i)} className="pd-row flex gap-[2cqw] leading-snug">
                <dt className="w-[5em] shrink-0 tracking-[0.15em] text-psc-gray">{f.label}</dt>
                <dd className="min-w-0">{f.value}</dd>
              </div>
            ))}
          </dl>

          {/* Issuer and date, with the seal stamped over them */}
          <div className="relative ml-auto flex w-[40%] flex-col items-center text-[2.4cqw]">
            <p className={`tracking-[0.3em] ${zh}`}>{c.issuerLabel}</p>
            <p className={`mt-[0.5cqw] ${zh}`}>{c.issued}</p>
            <Seal
              id={`pv-seal-${id}`}
              text={c.seal}
              className={`pv-stamp absolute top-1/2 left-1/2 h-[17cqw] w-[17cqw] -translate-1/2 opacity-90 mix-blend-multiply ${zh}`}
            />
          </div>
        </div>
      </div>
    </figure>
  );
}

export function SupplierVisual({ c, large = false }: { c: ValidateContent["suppliers"]; large?: boolean }) {
  return (
    <div className={large ? "mx-auto w-full max-w-[40rem]" : "px-6 pb-6"}>
      <div>
        <BusinessLicence c={c.licence} large={large} />
      </div>
    </div>
  );
}

/* ---------- Communication: two clocks, and a message relayed both ways ---------- */

function Clock({ hour, minute, className }: { hour: number; minute: number; className: string }) {
  const h = ((hour % 12) + minute / 60) * 30;
  const m = minute * 6;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="var(--color-psc-bg)" stroke="var(--color-psc-ink)" strokeWidth="1.2" />
      {[0, 90, 180, 270].map((a) => (
        <line key={a} x1="12" y1="2.6" x2="12" y2="4.2" stroke="var(--color-psc-gray)" strokeWidth="1" transform={`rotate(${a} 12 12)`} />
      ))}
      <line x1="12" y1="12" x2="12" y2="7" stroke="var(--color-psc-ink)" strokeWidth="1.8" strokeLinecap="round" transform={`rotate(${h} 12 12)`} />
      <line x1="12" y1="12" x2="12" y2="4.6" stroke="var(--color-psc-ink)" strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${m} 12 12)`} />
      <line className="pv-hand" x1="12" y1="13.5" x2="12" y2="3.8" stroke="var(--color-psc-red)" strokeWidth="0.7" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.1" fill="var(--color-psc-red)" />
    </svg>
  );
}

export function CommsVisual({ c, large = false }: { c: ValidateContent["comms"]; large?: boolean }) {
  const text = large ? "text-[14px]" : "text-[12px]";
  return (
    <div className={large ? "mx-auto w-full max-w-[30rem]" : "px-6 pb-6"}>
      <div className={`${card} ${large ? "p-5" : "p-3"}`}>
        {/* Two working days, side by side */}
        <div className="grid grid-cols-2 gap-3 border-b border-psc-border pb-2">
          {c.clocks.map((k) => (
            <div key={k.label} className="flex items-center gap-2.5">
              <Clock hour={k.hour} minute={k.minute} className={large ? "h-10 w-10" : "h-7 w-7"} />
              <div>
                <p className={`${mono} whitespace-nowrap text-psc-gray`}>{k.label}</p>
                <p className={`font-mono font-medium text-psc-ink ${large ? "text-[16px]" : "text-[13px]"}`}>{k.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* The message goes out in your language, reaches the factory in Chinese, and back */}
        <ol className={large ? "mt-3 space-y-2" : "mt-2 space-y-1"}>
          {c.messages.map((m, i) => {
            const mine = m.from === "you" || (m.from === "us" && !m.zh);
            return (
              <li key={i} style={v(i)} className={`pv-msg flex flex-col ${mine ? "items-end" : "items-start"}`}>
                <span className={`${mono} items-center gap-1 text-psc-gray ${large ? "mb-0.5 flex" : "sr-only"}`}>
                  {m.from === "us" && <span className="h-1.5 w-1.5 rounded-full bg-psc-red" />}
                  {c.senders[m.from]}
                </span>
                <span
                  lang={m.zh ? "zh" : undefined}
                  className={`max-w-[90%] rounded-2xl px-3 ${large ? "py-1.5" : "py-1"} font-sans ${text} ${
                    m.from === "you"
                      ? "rounded-br-sm bg-psc-ink text-psc-bg"
                      : m.from === "factory"
                        ? "rounded-bl-sm bg-psc-muted text-psc-ink"
                        : `border border-psc-red/40 bg-psc-bg text-psc-ink ${mine ? "rounded-br-sm" : "rounded-bl-sm"}`
                  }`}
                >
                  {m.text}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-2 flex items-center justify-between border-t border-psc-border pt-2">
          <span className="hm-typing flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} style={v(i)} className="h-1.5 w-1.5 rounded-full bg-psc-ink" />
            ))}
          </span>
          <p style={v(c.messages.length)} className={`pd-chip flex items-center gap-1.5 font-sans font-medium text-psc-ink ${text}`}>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-psc-red text-psc-bg">
              <Check className="h-3 w-3" />
            </span>
            {c.note}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Logistics: the route globe and the options compared ---------- */

export function LogisticsVisual({ c, large = false }: { c: ValidateContent["logistics"]; large?: boolean }) {
  return (
    <div className={large ? "mx-auto w-full max-w-[24rem]" : "[&_canvas]:max-w-[9rem] [&>div]:pb-4"}>
      <MiniGlobe c={c.globe} />
    </div>
  );
}

/* ---------- Golden sample: a bottle line on a conveyor; the golden sample is the one with the red cap (no text) ---------- */

const GS_INK = "var(--color-psc-ink)";
const GS_RED = "var(--color-psc-red)";
const GS_GOLD = "var(--color-psc-gold)";
const GS_MUTED = "var(--color-psc-muted)";
const GS_BG = "var(--color-psc-bg)";

/* One bottle, origin at its left edge, standing on the belt at y = 180 */
const BOTTLE = "M20 100 H36 V112 Q36 118 52 126 V180 H4 V126 Q20 118 20 112 Z";

function Bottle({ x, golden = false }: { x: number; golden?: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path d={BOTTLE} fill={golden ? GS_GOLD : GS_MUTED} stroke={GS_INK} strokeWidth="1.4" strokeLinejoin="round" />
      {golden && <rect x="18" y="91" width="20" height="10" rx="2.5" fill={GS_RED} stroke={GS_INK} strokeWidth="1.2" />}
    </g>
  );
}

export function GoldenSampleVisual({ large = false }: { large?: boolean }) {
  /* The golden sample sits at index 3, centred under the filling head */
  const xs = [8, 74, 140, 206, 272, 338];
  return (
    <div className={`flex h-full items-center justify-center ${large ? "mx-auto w-full max-w-[44rem]" : "px-4 pb-8 md:px-6"}`}>
      <svg viewBox="0 0 400 230" aria-hidden="true" className="w-full overflow-visible">
        {/* Pipes running along the line, behind the bottles */}
        <g fill="none" stroke={GS_GOLD} strokeWidth="1" strokeLinecap="round">
          <path d="M0 128 H400" />
          <path d="M0 146 H400" />
        </g>

        {/* Filling head: a housing with its nozzle over the golden sample */}
        <g stroke={GS_INK} strokeWidth="1.6" strokeLinejoin="round">
          <rect x="184" y="0" width="100" height="40" rx="10" fill={GS_BG} />
          <rect x="219" y="40" width="30" height="14" fill={GS_BG} />
        </g>

        {/* Bottles */}
        {xs.map((x, i) => (
          <Bottle key={x} x={x} golden={i === 3} />
        ))}

        {/* Conveyor belt: two lines, bottles stand on the top one */}
        <g fill="none" stroke={GS_INK} strokeWidth="1.4" strokeLinecap="round">
          <path d="M0 180 H400" />
          <path d="M0 192 H400" />
        </g>

        {/* Rollers */}
        <g fill={GS_BG} stroke={GS_INK} strokeWidth="1.4">
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={12 + i * 40} cy="214" r="6" />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ---------- Quotation: every line written down, the FOB price fixed, then binding ---------- */

export function QuotationVisual({ c, large = false }: { c: ValidateContent["quote"]; large?: boolean }) {
  const text = large ? "text-[14px]" : "text-[13px]";
  return (
    <div className={large ? "mx-auto w-full max-w-[44rem]" : "px-6 pb-8 md:px-8"}>
      <div className={`${card} flex flex-col overflow-hidden md:flex-row`}>
        {/* The quote lines */}
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-3">
              <p className="font-display text-[22px] leading-none font-medium text-psc-ink">{c.cardTitle}</p>
              <p className={`${mono} text-psc-gray`}>{c.ref}</p>
            </div>
            <span className="rounded-full bg-psc-muted px-2.5 py-1 font-sans text-[11px] font-medium text-psc-ink">{c.tag}</span>
          </div>
          {/* One column when opened: the overlay gives the document less width than the full-row tile */}
          <dl className={`mt-4 grid gap-x-6 ${large ? "" : "sm:grid-cols-2"}`}>
            {c.rows.map((r) => (
              <div
                key={r.label}
                className={`flex items-baseline justify-between gap-3 border-t border-psc-border py-2 font-sans ${text}`}
              >
                <dt className="shrink-0 text-psc-gray">{r.label}</dt>
                <dd className="text-right font-medium text-psc-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The price, fixed, and the stamp that makes it binding */}
        <div className="relative flex flex-col justify-center gap-4 bg-psc-ink p-5 text-psc-bg md:w-[15rem] md:shrink-0">
          <div>
            <p className={`${mono} uppercase text-psc-bg/70`}>{c.price.label}</p>
            <p className={`mt-1 font-display leading-none font-medium ${large ? "text-[40px]" : "text-[34px]"}`}>{c.price.value}</p>
            <p className="mt-1 font-sans text-[12px] text-psc-bg/70">{c.price.unit}</p>
          </div>
          <div className="border-t border-psc-bg/20 pt-3">
            <p className={`${mono} uppercase text-psc-bg/70`}>{c.total.label}</p>
            <p className="mt-1 font-sans text-[18px] font-medium">{c.total.value}</p>
          </div>
          <p
            style={{ transform: "rotate(-8deg)" }}
            className="w-fit rounded-md border-2 border-psc-red px-3 py-1 font-sans text-[13px] font-bold tracking-[0.2em] text-psc-bg uppercase"
          >
            {c.stamp}
          </p>
        </div>
      </div>

      {/* The options: validated suppliers quoting the same product, each adjustable to the client's terms */}
      <div className={`${card} mt-4 overflow-hidden`}>
        <div className="flex items-center justify-between gap-2 px-5 py-3">
          <p className="font-sans text-[13px] font-medium text-psc-ink">{c.optionsTitle}</p>
          <span className="rounded-full bg-psc-muted px-2.5 py-1 font-sans text-[11px] font-medium text-psc-ink">{c.adjustable}</span>
        </div>
        <ul>
          {c.options.map((o) => (
            <li
              key={o.supplier}
              className={`grid grid-cols-[1fr_auto_auto_auto] items-baseline gap-x-4 border-t border-psc-border px-5 py-2.5 font-sans ${text}`}
            >
              <span className="font-medium text-psc-ink">{o.supplier}</span>
              <span className="text-psc-gray">{o.lead}</span>
              <span className="text-psc-ink">{o.fob}</span>
              <span className="text-right font-medium text-psc-ink">{o.total}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
