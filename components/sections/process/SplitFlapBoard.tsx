"use client";

import { useEffect, useRef, useState } from "react";
import type { DefineContent } from "@/content/process";

interface SplitFlapBoardProps {
  c: DefineContent["trip"]["board"];
}

interface FlapCellProps {
  target: number;
  start: number;
  run: boolean;
}

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/* One flip = top flap falls (55ms) then bottom flap lands (55ms); see .pd-flap-* in process.css */
const FLIP_MS = 110;
const HOLD_MS = 6000;
/* Every row has the same number of tiles; shorter names are padded with blank tiles */
const COLS = 8;

/* How many characters a cell runs through before landing: varies per cell so letters settle
   at different moments, like the reference board. Deterministic so server and client agree. */
const stepsFor = (col: number, row: number) => 6 + ((col * 5 + row * 3) % 9);

function Half({ ch, side, className = "" }: { ch: string; side: "top" | "bottom"; className?: string }) {
  return (
    <span className={`pd-half pd-half-${side} ${className}`}>
      <span className="pd-glyph">{ch}</span>
    </span>
  );
}

/* One split-flap cell: static halves show the next (top) and current (bottom) character,
   two animated flaps fold between them, then the cell advances one character. */
function FlapCell({ target, start, run }: FlapCellProps) {
  const [i, setI] = useState(start);
  const flipping = run && i !== target;
  const next = (i + 1) % CHARS.length;
  const cur = CHARS[i];
  const nxt = CHARS[next];

  return (
    <span className="pd-flap-cell">
      <Half ch={flipping ? nxt : cur} side="top" />
      <Half ch={cur} side="bottom" />
      {flipping && (
        <>
          <Half key={`t${i}`} ch={cur} side="top" className="pd-flap-top" />
          <Half key={`b${i}`} ch={nxt} side="bottom" className="pd-flap-bottom" />
          <span key={`e${i}`} className="pd-flap-tick" onAnimationEnd={() => setI(next)} />
        </>
      )}
    </span>
  );
}

/* Retro departures board in the style of a Solari split-flap: one labelled row per city.
   Flips while on screen, holds the finished names, then shuffles and lands again. */
export default function SplitFlapBoard({ c }: SplitFlapBoardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [still, setStill] = useState(false);
  const [gen, setGen] = useState(0);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Replay: longest cell run plus a hold on the finished names, then remount the cells */
  useEffect(() => {
    if (!visible || still) return;
    const longest = Math.max(...c.cities.flatMap((city, r) => [...city].map((_, col) => stepsFor(col, r))));
    const t = setTimeout(() => setGen((g) => g + 1), longest * FLIP_MS + HOLD_MS);
    return () => clearTimeout(t);
  }, [visible, still, gen, c.cities]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${c.title}: ${c.cities.join(", ")}`}
      className="w-fit rounded-xl border border-psc-border bg-psc-muted p-4 shadow-[0_12px_40px_-16px_rgb(10_10_10/0.25)]"
    >
      <div aria-hidden="true" className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-psc-gray">
        {c.title}
        <span className="pd-ping h-1.5 w-1.5 rounded-full bg-psc-red" />
      </div>
      {c.cities.map((city, r) => (
        <div key={city} aria-hidden="true" className="mt-1">
          <div className="flex gap-1">
            {[...city.toUpperCase().padEnd(COLS, " ")].map((letter, col) => {
              const target = Math.max(0, CHARS.indexOf(letter));
              const start = still || target === 0 ? target : (target - stepsFor(col, r) + CHARS.length) % CHARS.length;
              return <FlapCell key={`${gen}-${col}-${still}`} target={target} start={start} run={visible && !still} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
