"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import { getDots } from "@/components/tools/globe/dots";
import type { PresenceContent, PresenceCountry } from "@/content/about";
import "./about.css";

const RAD = Math.PI / 180;
const TILT_MAX = 30 * RAD;

/* Marker positions [lon, lat] in degrees. Display only. */
const PLACES: Record<Exclude<PresenceCountry["id"], "more">, [number, number]> = {
  spain: [-3.7, 40.4],
  peru: [-75, -9.2],
  china: [104, 35],
};

interface PresenceProps {
  content: PresenceContent;
}

const glow =
  "radial-gradient(circle at 85% 0%, color-mix(in srgb, var(--color-psc-red) 18%, transparent), color-mix(in srgb, var(--color-psc-muted) 60%, transparent) 45%, transparent 75%)";

export default function Presence({ content }: PresenceProps) {
  const [selected, setSelected] = useState<PresenceCountry["id"]>("spain");
  const country = content.countries.find((c) => c.id === selected) ?? content.countries[0];

  return (
    <section className="bg-psc-bg py-16 md:py-20">
      <Container>
        <div className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
          {content.label}
        </div>
        <h2 className="font-display text-h2 font-medium text-psc-ink">{content.headline}</h2>

        <div role="group" aria-label={content.chipsLabel} className="mt-8 flex flex-wrap gap-2">
          {content.countries.map((c) => {
            const active = c.id === selected;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(c.id)}
                className={`rounded-full border px-4 py-2 font-sans text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
                  active
                    ? "border-psc-red bg-psc-red text-psc-bg"
                    : "border-psc-border bg-psc-bg text-psc-ink hover:border-psc-ink"
                }`}
              >
                {c.chip}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <article
            aria-live="polite"
            className="relative flex min-h-[18rem] flex-col overflow-hidden rounded-2xl border border-psc-border bg-psc-bg p-6 md:p-8"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={{ background: glow }} />
            <div key={country.id} className="ab-fade relative flex flex-1 flex-col">
              <h3 className="font-display text-h3 font-medium text-psc-ink">{country.title}</h3>
              <p className="mt-4 max-w-md font-sans text-body leading-body text-psc-gray">{country.body}</p>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                {country.actions.map((a, i) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    locale={a.locale}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
                      i === country.actions.length - 1
                        ? "bg-psc-ink text-psc-bg hover:bg-psc-red"
                        : "border border-psc-ink text-psc-ink hover:border-psc-red hover:text-psc-red"
                    }`}
                  >
                    {a.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          <div className="flex items-center justify-center rounded-2xl border border-psc-border bg-psc-muted/40 p-6">
            <PresenceGlobe selected={selected} label={content.globeLabel} />
          </div>
        </div>
      </Container>
    </section>
  );
}

interface PresenceGlobeProps {
  selected: PresenceCountry["id"];
  label: string;
}

/* Dotted orthographic globe that eases to centre the selected country.
   "more" shows every office and slowly turns to pass across them all. */
function PresenceGlobe({ selected, label }: PresenceGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef(selected);
  useEffect(() => {
    targetRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--color-psc-ink").trim();
    const red = css.getPropertyValue("--color-psc-red").trim();
    const border = css.getPropertyValue("--color-psc-border").trim();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const dots = getDots();
    // Current view centre (radians)
    let lon = PLACES.spain[0] * RAD;
    let lat = PLACES.spain[1] * RAD;
    let raf = 0;
    let last = 0;
    let spin = lon;

    const draw = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const reduced = motion.matches;
      const target = targetRef.current;

      let tLon: number;
      let tLat: number;
      if (target === "more") {
        // Pass slowly across all offices; reduced motion holds a still view over the Atlantic
        spin += reduced ? 0 : dt * 0.00012;
        tLon = reduced ? -30 * RAD : spin;
        tLat = 15 * RAD;
      } else {
        [tLon, tLat] = [PLACES[target][0] * RAD, PLACES[target][1] * RAD];
        spin = lon;
      }
      // shortest way round
      let dLon = tLon - lon;
      dLon = Math.atan2(Math.sin(dLon), Math.cos(dLon));
      const k = reduced ? 1 : 1 - Math.exp(-dt / 260);
      lon += dLon * k;
      lat += (tLat - lat) * k;

      const dpr = window.devicePixelRatio || 1;
      const size = canvas.clientWidth;
      if (canvas.width !== Math.round(size * dpr)) {
        canvas.width = Math.round(size * dpr);
        canvas.height = Math.round(size * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const R = size * 0.46;
      const cx = size / 2;
      const cy = size / 2;
      const tilt = Math.max(-TILT_MAX, Math.min(TILT_MAX, lat));
      const sinT = Math.sin(tilt);
      const cosT = Math.cos(tilt);
      const project = (l: number, sinLat: number, cosLat: number): [number, number, number] => {
        const d = l - lon;
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
        ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;

      for (const [id, [plon, plat]] of Object.entries(PLACES)) {
        const [x, y, z] = project(plon * RAD, Math.sin(plat * RAD), Math.cos(plat * RAD));
        if (z <= 0.05) continue;
        const on = target === "more" || target === id;
        ctx.globalAlpha = on ? 1 : 0.35;
        if (on && !reduced) {
          const pulse = (now % 2000) / 2000;
          ctx.beginPath();
          ctx.arc(x, y, 5 + pulse * 12, 0, Math.PI * 2);
          ctx.strokeStyle = red;
          ctx.globalAlpha = 0.5 * (1 - pulse);
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.arc(x, y, on ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = red;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="aspect-square w-full max-w-[22rem]"
    />
  );
}
