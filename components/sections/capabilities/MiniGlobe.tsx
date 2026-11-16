"use client";

import { useEffect, useRef } from "react";
import { geoInterpolate } from "d3-geo";
import { getDots } from "@/components/tools/globe/dots";

const RAD = Math.PI / 180;
// Sample route for the mock: Shanghai → Rotterdam. Display only, no real shipment.
const FROM: [number, number] = [121.5, 31.2];
const TO: [number, number] = [4.5, 51.9];
const TILT = 22 * RAD;
const LOOP_MS = 5200;

interface MiniGlobeProps {
  c: { from: string; to: string; status: string };
  /* Draw the route from the far end back, e.g. a trip towards China */
  reverse?: boolean;
}

/* Dotted, slowly turning globe with a red route and a container travelling it.
   Reuses the land dots from the /tools route globe. Colors come from CSS tokens. */
export default function MiniGlobe({ c, reverse = false }: MiniGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--color-psc-ink").trim();
    const red = css.getPropertyValue("--color-psc-red").trim();
    const border = css.getPropertyValue("--color-psc-border").trim();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dots = getDots();
    const [a, b] = reverse ? [TO, FROM] : [FROM, TO];
    const arc = geoInterpolate(a, b);
    const route = Array.from({ length: 81 }, (_, k) => arc(k / 80));
    const centerLon = 70 * RAD;

    let raf = 0;
    let start = 0;

    const draw = (now: number) => {
      if (!start) start = now;
      const t = reduced ? 0.6 : ((now - start) % LOOP_MS) / LOOP_MS;
      const dpr = window.devicePixelRatio || 1;
      const size = canvas.clientWidth;
      if (canvas.width !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const R = size * 0.46;
      const cx = size / 2;
      const cy = size / 2;
      // gentle sway around Eurasia so both ends stay visible
      const lon0 = centerLon + (reduced ? 0 : Math.sin((now / 9000) * Math.PI) * 14 * RAD);
      const sinT = Math.sin(TILT);
      const cosT = Math.cos(TILT);

      const project = (lon: number, sinLat: number, cosLat: number): [number, number, number] => {
        const d = lon - lon0;
        const z = sinT * sinLat + cosT * cosLat * Math.cos(d);
        const x = cosLat * Math.sin(d);
        const y = cosT * sinLat - sinT * cosLat * Math.cos(d);
        return [cx + R * x, cy - R * y, z];
      };

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = border;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = ink;
      for (let i = 0; i < dots.n; i++) {
        const [x, y, z] = project(dots.lon[i], dots.sinLat[i], dots.cosLat[i]);
        if (z <= 0) continue;
        ctx.globalAlpha = 0.12 + z * 0.4;
        ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);
      }
      ctx.globalAlpha = 1;

      const pts = route.map(([lo, la]) => project(lo * RAD, Math.sin(la * RAD), Math.cos(la * RAD)));
      const head = Math.max(1, Math.floor(Math.min(1, t * 1.25) * (pts.length - 1)));

      ctx.beginPath();
      pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = red;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      ctx.beginPath();
      pts.slice(0, head + 1).forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.lineWidth = 2;
      ctx.stroke();

      for (const p of [pts[0], pts[pts.length - 1]]) {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2);
        ctx.fillStyle = red;
        ctx.fill();
      }
      const [hx, hy] = pts[head];
      ctx.fillStyle = ink;
      ctx.fillRect(hx - 4, hy - 3, 8, 6);

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex h-full flex-col items-center px-6 pb-6">
      <canvas ref={canvasRef} className="aspect-square w-full max-w-[13rem]" aria-hidden="true" />
      <p className="mt-2 flex items-center gap-2 font-mono text-[11px] tracking-wide text-psc-gray">
        <span className="text-psc-ink">{c.from}</span>
        <span className="text-psc-red">→</span>
        <span className="text-psc-ink">{c.to}</span>
        <span className="cap-pulse ml-1 h-1.5 w-1.5 rounded-full bg-psc-red" />
        {c.status}
      </p>
    </div>
  );
}
