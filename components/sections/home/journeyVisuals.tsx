import { NetworkGraph } from "@/components/sections/capabilities/visuals";
import type { JourneyContent } from "@/content/home";

/* Mock visuals for the five journey stages. Markup + CSS loops (home.css). */

const card = "rounded-xl border border-psc-border bg-psc-bg shadow-[0_12px_40px_-16px_rgb(10_10_10/0.25)]";
const mono = "font-mono text-[11px] tracking-wide";
const v = (i: number) => ({ "--i": i }) as React.CSSProperties;

export function ChatVisual({ c }: { c: JourneyContent["local"] }) {
  return (
    <div className={`${card} w-full p-4`}>
      <div className="flex items-center gap-3 border-b border-psc-border pb-3">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-psc-ink font-display text-sm text-psc-bg">
          PS
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-psc-bg bg-psc-red" />
        </span>
        <div>
          <p className="font-sans text-[13px] font-medium text-psc-ink">{c.chatName}</p>
          <p className={`${mono} text-psc-gray`}>{c.chatStatus}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {c.messages.map((m, i) => (
          <li
            key={i}
            style={v(i)}
            className={`hm-msg max-w-[85%] rounded-2xl px-3 py-2 font-sans text-[13px] leading-snug ${
              m.from === "you" ? "ml-auto rounded-br-sm bg-psc-ink text-psc-bg" : "rounded-bl-sm bg-psc-muted text-psc-ink"
            }`}
          >
            {m.text}
          </li>
        ))}
      </ul>
      <div className="hm-typing mt-2 flex gap-1 pl-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} style={v(i)} className="h-1.5 w-1.5 rounded-full bg-psc-gray" />
        ))}
      </div>
    </div>
  );
}

export function RelayVisual({ c }: { c: JourneyContent["china"] }) {
  return (
    <div className={`${card} relative w-full p-4`}>
      <p className={`${mono} uppercase text-psc-gray`}>{c.factoryLabel}</p>
      <p lang="zh" className="mt-1 font-sans text-[15px] text-psc-ink">{c.factoryNote}</p>
      <div className="relative my-3 ml-1 h-11 w-px bg-psc-border" aria-hidden="true">
        <span className="hm-relay-pulse absolute -left-[3px] top-0 h-[7px] w-[7px] rounded-full bg-psc-red" />
      </div>
      <div className="hm-relay-out rounded-lg bg-psc-muted p-3">
        <p className={`${mono} uppercase text-psc-red`}>{c.relayLabel}</p>
        <p className="mt-1 font-sans text-[14px] text-psc-ink">{c.relayNote}</p>
      </div>
    </div>
  );
}

export function RoutesVisual({ c }: { c: JourneyContent["project"] }) {
  const ys = [22, 62, 102, 142];
  return (
    <div className={`${card} w-full p-4`}>
      <svg viewBox="0 0 340 164" className="h-auto w-full" aria-hidden="true">
        {ys.map((y, i) => (
          <g key={i}>
            <path
              d={`M128 ${y} C 190 ${y}, 190 82, 236 82`}
              fill="none"
              strokeWidth={2}
              className="hm-route"
              style={v(i)}
            />
            <circle cx={128} cy={y} r={4} className="hm-route-chip" style={v(i)} />
            <text x={118} y={y + 4} textAnchor="end" className="hm-route-chip font-sans text-[11px]" style={v(i)}>
              {c.routes[i]?.name}
            </text>
          </g>
        ))}
        <line x1={236} y1={82} x2={326} y2={82} stroke="var(--color-psc-red)" strokeWidth={2.5} className="hm-flow" />
        <circle cx={236} cy={82} r={5} fill="var(--color-psc-red)" />
        <circle cx={326} cy={82} r={6} fill="var(--color-psc-bg)" stroke="var(--color-psc-ink)" strokeWidth={2} />
      </svg>
    </div>
  );
}

/* Growth tree: one project at the root, branching wider at every level.
   Level labels come from content (c.steps), bottom to top. */
const TREE_TOP = [132, 160, 188, 216, 244, 272, 300, 328];
function treeLevels(): number[][] {
  const levels = [TREE_TOP];
  while (levels[0].length > 1) {
    const up = levels[0];
    levels.unshift(up.filter((_, k) => k % 2 === 0).map((x, k) => (x + up[2 * k + 1]) / 2));
  }
  return levels; // [root], [2], [4], [8]
}
const LEVEL_Y = [186, 132, 80, 28];

export function GrowthVisual({ c }: { c: { steps: string[] } }) {
  const levels = treeLevels();
  const last = levels.length - 1;
  return (
    <div className={`${card} w-full p-4`}>
      <svg viewBox="0 0 340 204" className="h-auto w-full" aria-hidden="true">
        {levels.slice(1).map((xs, n) =>
          xs.map((x, k) => {
            const px = levels[n][Math.floor(k / 2)];
            const py = LEVEL_Y[n];
            const y = LEVEL_Y[n + 1];
            return (
              <path
                key={`b${n}-${k}`}
                d={`M${px} ${py} C ${px} ${(py + y) / 2}, ${x} ${(py + y) / 2 + 8}, ${x} ${y}`}
                fill="none"
                stroke={n + 1 === last ? "var(--color-psc-red)" : "var(--color-psc-ink)"}
                strokeOpacity={n + 1 === last ? 0.9 : 0.55}
                strokeWidth={n === 0 ? 2.5 : n === 1 ? 2 : 1.5}
                className="hm-branch"
                style={v(n)}
              />
            );
          }),
        )}
        {levels.map((xs, n) =>
          xs.map((x, k) => (
            <circle
              key={`n${n}-${k}`}
              cx={x}
              cy={LEVEL_Y[n]}
              r={n === 0 ? 7 : 5 - n * 0.6}
              fill={n === 0 || n === last ? "var(--color-psc-red)" : "var(--color-psc-ink)"}
              className="hm-grow"
              style={v(n * 1.5)}
            />
          )),
        )}
        {c.steps.map((label, n) => (
          <text
            key={label}
            x={4}
            y={LEVEL_Y[n] + 4}
            className="font-sans text-[11px]"
            fill={n === last ? "var(--color-psc-red)" : "var(--color-psc-ink)"}
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function NetworkVisual({ c }: { c: JourneyContent["network"] }) {
  return (
    <div className={`${card} w-full p-4`}>
      <div className="flex flex-wrap items-center gap-2">
        {c.path.map((p, i) => (
          <span key={p} className="flex items-center gap-2">
            {i > 0 && <span className="text-psc-red" aria-hidden="true">→</span>}
            <span style={v(i)} className="hm-pill rounded-full border border-psc-border px-3 py-1 font-sans text-[12px]">
              {p}
            </span>
          </span>
        ))}
      </div>
      <NetworkGraph className="mt-3 h-auto w-full" />
      <p className={`${mono} text-center uppercase text-psc-gray`}>{c.networkLabel}</p>
    </div>
  );
}
