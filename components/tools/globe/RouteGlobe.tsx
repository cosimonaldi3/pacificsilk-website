"use client";

import { useEffect, useRef } from "react";
import { geoDistance, geoInterpolate } from "d3-geo";
import { fill } from "@/lib/tools/format";
import type { Coord, LegKind, Route } from "@/lib/tools/types";
import { useToolsContent } from "../ToolsContent";
import { getDots, STEP } from "./dots";
import { toPoint, type GlobeMarker, type GlobePoint } from "./markers";

const RAD = Math.PI / 180;
const TAU = Math.PI * 2;
const DURATION = 6500;
const CHINA = "156";

const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
const wrap = (d: number): number => ((((d + 180) % 360) + 360) % 360) - 180;
const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface DensePoint extends GlobePoint {
  f: number;
}

interface PreparedLeg {
  kind: LegKind;
  angle: number;
  pts: DensePoint[];
  zoom: number;
}

interface PreparedRoute {
  key: number;
  legs: PreparedLeg[];
  B: number[];
  mid: Coord;
  fit: number;
  stops: { p: GlobePoint; label: string }[];
  reached: number[];
  start: number | null;
  done: boolean;
}

// Turn a waypoint chain into evenly spaced points on the great circles,
// each tagged with the fraction of the leg travelled so far.
function densify(coords: Coord[]): { angle: number; pts: DensePoint[] } {
  const out: Coord[] = [coords[0]];
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1];
    const b = coords[i];
    const n = Math.max(1, Math.ceil(geoDistance(a, b) / (0.5 * RAD)));
    const f = geoInterpolate(a, b);
    for (let k = 1; k <= n; k++) out.push(f(k / n));
  }
  let total = 0;
  const cum = [0];
  for (let i = 1; i < out.length; i++) {
    total += geoDistance(out[i - 1], out[i]);
    cum.push(total);
  }
  return { angle: total, pts: out.map((c, i) => ({ ...toPoint(c), f: total ? cum[i] / total : 1 })) };
}

function along(pts: DensePoint[], f: number): GlobePoint {
  if (f <= 0) return pts[0];
  if (f >= 1) return pts[pts.length - 1];
  let lo = 0;
  let hi = pts.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (pts[m].f < f) lo = m;
    else hi = m;
  }
  const a = pts[lo];
  const b = pts[hi];
  return toPoint(geoInterpolate(a.coord, b.coord)((f - a.f) / (b.f - a.f || 1)));
}

function meanCenter(points: GlobePoint[]): Coord {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const p of points) {
    x += p.cosLat * Math.cos(p.lon);
    y += p.cosLat * Math.sin(p.lon);
    z += p.sinLat;
  }
  return [Math.atan2(y, x) / RAD, Math.atan2(z, Math.hypot(x, y)) / RAD];
}

function prepareRoute(route: GlobeRoute): PreparedRoute {
  const legs: PreparedLeg[] = route.legs.map((l) => {
    const dense = densify(l.coords);
    return { kind: l.kind, ...dense, zoom: clamp(0.25 / Math.max(dense.angle, 1e-3), 1.5, 2.6) };
  });
  // Land legs are short, so they get a fixed slice of the time and a zoom-in.
  const weights = legs.map((l) => (l.kind === "sea" ? 0.6 : clamp(0.1 + (l.angle / 0.3) * 0.1, 0.1, 0.2)));
  const sum = weights.reduce((a, b) => a + b, 0);
  const B = [0];
  weights.forEach((w) => B.push(B[B.length - 1] + w / sum));
  const all = legs.flatMap((l) => l.pts);
  const mid = meanCenter(all);
  const maxA = Math.max(...all.map((p) => geoDistance(mid, p.coord)));
  return {
    key: route.key,
    legs,
    B,
    mid,
    fit: clamp(0.86 / Math.sin(Math.min(maxA, Math.PI / 2)), 0.9, 2.2),
    stops: [legs[0].pts[0], ...legs.map((l) => l.pts[l.pts.length - 1])].map((p, i) => ({ p, label: route.stops[i] })),
    reached: [],
    start: null,
    done: false,
  };
}

interface GlobeColors {
  hi: string;
  mid: string;
  lo: string;
  rim: string;
  dot: string;
  cn: string;
  shadow: string;
  ink: string;
  paper: string;
  red: string;
  flow: string;
  leg: Record<LegKind, string>;
}

function readColors(el: HTMLElement): GlobeColors {
  const cs = getComputedStyle(el);
  const v = (n: string): string => cs.getPropertyValue(n).trim();
  return {
    hi: v("--globe-hi"),
    mid: v("--globe-mid"),
    lo: v("--globe-lo"),
    rim: v("--globe-rim"),
    dot: v("--globe-dot"),
    cn: v("--globe-cn"),
    shadow: v("--globe-shadow"),
    ink: v("--ink"),
    paper: v("--paper"),
    red: v("--red"),
    flow: v("--globe-flow"),
    leg: { cn: v("--route-cn"), sea: v("--route-sea"), dest: v("--route-dest") },
  };
}

interface Hit {
  x: number;
  y: number;
  kind: "origin" | "dest";
  id: string;
  label: string;
}

interface GlobeState {
  center: Coord;
  target: Coord;
  zoom: number;
  zoomTarget: number;
  size: number;
  dpr: number;
  R: number;
  colors: GlobeColors;
  font: string;
  drag: { x: number; y: number; moved: boolean } | null;
  hover: Hit | null;
  hits: Hit[];
  manualUntil: number;
  route: PreparedRoute | null;
  visible: boolean;
  last: number;
  reduced: boolean;
}

export type GlobeRoute = Pick<Route, "legs" | "stops"> & { key: number };

export interface RouteGlobeProps {
  origins: GlobeMarker[];
  destinations: GlobeMarker[];
  originId: string;
  destId: string;
  destIsoN?: string;
  route: GlobeRoute | null;
  onPick: (kind: "origin" | "dest", id: string) => void;
  onRouteDone: () => void;
}

/** Dotted globe. Drag to turn; click a marker to pick it. */
export default function RouteGlobe(props: RouteGlobeProps) {
  const { globe: copy } = useToolsContent();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const stateRef = useRef<GlobeState | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapEl = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrapEl || !ctx) return;
    const dots = getDots();
    const s: GlobeState = {
      center: [95, 22],
      target: [72, 32],
      zoom: 1,
      zoomTarget: 1,
      size: 0,
      dpr: 1,
      R: 0,
      colors: readColors(wrapEl),
      // next/font hashes family names, so the canvas takes the resolved stack from CSS
      font: getComputedStyle(wrapEl).fontFamily,
      drag: null,
      hover: null,
      hits: [],
      manualUntil: 0,
      route: null,
      visible: true,
      last: performance.now(),
      reduced: reducedMotion(),
    };
    stateRef.current = s;

    const resize = () => {
      const w = wrapEl.clientWidth;
      s.size = w;
      s.dpr = Math.min(2, window.devicePixelRatio || 1);
      s.R = (w / 2) * 0.86;
      canvas.width = Math.round(w * s.dpr);
      canvas.height = Math.round(w * s.dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapEl);
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
    });
    io.observe(canvas);

    // ---------- projection (orthographic, centred on s.center) ----------
    let lon0 = 0;
    let sin0 = 0;
    let cos0 = 1;
    let Reff = 0;
    let cx = 0;
    let cy = 0;
    let disk = 0;
    const setView = () => {
      lon0 = s.center[0] * RAD;
      sin0 = Math.sin(s.center[1] * RAD);
      cos0 = Math.cos(s.center[1] * RAD);
      Reff = s.R * s.zoom;
      cx = s.size / 2;
      cy = s.size / 2;
      disk = Math.min(Reff, s.R); // zooming magnifies inside the globe's outline
    };
    const project = (p: GlobePoint): { x: number; y: number; z: number } => {
      const dl = p.lon - lon0;
      const cdl = Math.cos(dl);
      return {
        x: cx + Reff * p.cosLat * Math.sin(dl),
        y: cy - Reff * (cos0 * p.sinLat - sin0 * p.cosLat * cdl),
        z: sin0 * p.sinLat + cos0 * p.cosLat * cdl,
      };
    };

    // ---------- drawing ----------
    const drawSphere = () => {
      const c = s.colors;
      ctx.save();
      ctx.shadowColor = c.shadow;
      ctx.shadowBlur = disk * 0.16;
      ctx.shadowOffsetY = disk * 0.07;
      const g = ctx.createRadialGradient(cx - disk * 0.35, cy - disk * 0.4, disk * 0.05, cx, cy, disk);
      g.addColorStop(0, c.hi);
      g.addColorStop(0.62, c.mid);
      g.addColorStop(1, c.lo);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, disk, 0, TAU);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = c.rim;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawDots = () => {
      const c = s.colors;
      const dest = propsRef.current.destIsoN;
      const r0 = Reff * STEP * RAD * 0.36;
      const plain = new Path2D();
      const china = new Path2D();
      const chosen = new Path2D();
      const { n, lon, sinLat, cosLat, country } = dots;
      const pad = r0 * 2;
      for (let i = 0; i < n; i++) {
        const dl = lon[i] - lon0;
        const cdl = Math.cos(dl);
        const z = sin0 * sinLat[i] + cos0 * cosLat[i] * cdl;
        if (z <= 0.03) continue;
        const x = cx + Reff * cosLat[i] * Math.sin(dl);
        const y = cy - Reff * (cos0 * sinLat[i] - sin0 * cosLat[i] * cdl);
        if (x < -pad || y < -pad || x > s.size + pad || y > s.size + pad) continue;
        const r = r0 * (0.4 + 0.6 * z);
        const target = country[i] === dest ? chosen : country[i] === CHINA ? china : plain;
        target.moveTo(x + r, y);
        target.arc(x, y, r, 0, TAU);
      }
      ctx.fillStyle = c.dot;
      ctx.fill(plain);
      ctx.fillStyle = c.cn;
      ctx.fill(china);
      ctx.fillStyle = c.red;
      ctx.globalAlpha = 0.75;
      ctx.fill(chosen);
      ctx.globalAlpha = 1;
    };

    const label = (text: string, x: number, y: number, align: CanvasTextAlign = "left", weight = 600) => {
      ctx.font = `${weight} 12px ${s.font}`;
      ctx.textAlign = align;
      ctx.lineJoin = "round";
      ctx.lineWidth = 4;
      ctx.strokeStyle = s.colors.paper;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = s.colors.ink;
      ctx.fillText(text, x, y);
    };

    const ring = (x: number, y: number, r: number, color: string, alpha: number, width = 1.5) => {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawMarkers = (now: number) => {
      const P = propsRef.current;
      const c = s.colors;
      const faded = !!s.route;
      s.hits = [];
      const pulse = s.reduced ? 0.5 : (now % 1600) / 1600;
      const draw = (list: GlobeMarker[], kind: Hit["kind"], color: string, selectedId: string) => {
        for (const m of list) {
          const q = project(m.p);
          if (q.z < 0.05 || Math.hypot(q.x - cx, q.y - cy) > disk - 4) continue;
          s.hits.push({ x: q.x, y: q.y, kind, id: m.id, label: m.label });
          const selected = m.id === selectedId;
          if (faded && selected) continue; // drawn as a route stop instead
          const hovered = s.hover != null && s.hover.kind === kind && s.hover.id === m.id;
          ctx.globalAlpha = faded && !hovered ? 0.45 : 1;
          ctx.fillStyle = color;
          ctx.strokeStyle = c.paper;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(q.x, q.y, selected || hovered ? 5.5 : 3.6, 0, TAU);
          ctx.fill();
          ctx.stroke();
          ctx.globalAlpha = 1;
          if (selected && !s.reduced) ring(q.x, q.y, 6 + pulse * 14, color, 1 - pulse);
          if (selected || hovered) label(m.label, q.x + 10, q.y + 4);
        }
      };
      draw(P.origins, "origin", c.red, P.originId);
      draw(P.destinations, "dest", c.ink, P.destId);
    };

    const strokePts = (pts: DensePoint[], upto: number, head?: GlobePoint | null) => {
      ctx.beginPath();
      let pen = false;
      const step = (p: GlobePoint) => {
        const q = project(p);
        if (q.z < 0) {
          pen = false;
          return;
        }
        if (pen) ctx.lineTo(q.x, q.y);
        else {
          ctx.moveTo(q.x, q.y);
          pen = true;
        }
      };
      for (const p of pts) {
        if (p.f > upto) break;
        step(p);
      }
      if (head) step(head);
      ctx.stroke();
    };

    const drawRoute = (r: PreparedRoute, now: number) => {
      const c = s.colors;
      if (r.start === null) r.start = now;
      const p = s.reduced ? 1 : clamp((now - r.start) / DURATION, 0, 1);
      const pe = ease(p);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // the whole way, faint, so the eye knows where it is heading
      ctx.setLineDash([2, 5]);
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.35;
      for (const l of r.legs) {
        ctx.strokeStyle = c.leg[l.kind];
        strokePts(l.pts, 1);
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      let head: GlobePoint | null = null;
      let headLeg: PreparedLeg | null = null;
      for (let i = 0; i < r.legs.length; i++) {
        const l = r.legs[i];
        const lp = clamp((pe - r.B[i]) / (r.B[i + 1] - r.B[i]), 0, 1);
        if (lp <= 0) continue;
        const h = lp < 1 ? along(l.pts, lp) : null;
        ctx.strokeStyle = c.leg[l.kind];
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 8;
        strokePts(l.pts, lp, h);
        ctx.globalAlpha = 1;
        ctx.lineWidth = l.kind === "sea" ? 2.6 : 2.2;
        strokePts(l.pts, lp, h);
        if (h) {
          head = h;
          headLeg = l;
        }
      }

      // once arrived, cargo keeps flowing along the line
      if (p >= 1 && !s.reduced) {
        ctx.setLineDash([1.5, 11]);
        ctx.lineDashOffset = -(now / 45) % 12.5;
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = c.flow;
        for (const l of r.legs) strokePts(l.pts, 1);
        ctx.setLineDash([]);
      }

      // stops: city, port, port, city
      r.stops.forEach((st, i) => {
        if (pe + 1e-6 < r.B[i]) return;
        r.reached[i] ??= now;
        const q = project(st.p);
        if (q.z < 0.02) return;
        const age = now - r.reached[i];
        const color = c.leg[r.legs[Math.min(i, r.legs.length - 1)].kind];
        if (age < 900 && !s.reduced) ring(q.x, q.y, 5 + (age / 900) * 20, color, 1 - age / 900, 2);
        ctx.fillStyle = i === 0 || i === 3 ? color : c.paper;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(q.x, q.y, i === 0 || i === 3 ? 5.5 : 4.2, 0, TAU);
        ctx.fill();
        ctx.stroke();
        const city = i === 0 || i === 3;
        if (city) {
          // left of the dot unless that would run off the globe
          ctx.font = `700 12px ${s.font}`;
          const edge = cx - Math.sqrt(Math.max(0, disk * disk - (q.y - 8 - cy) ** 2));
          const left = q.x - 10 - ctx.measureText(st.label).width > edge + 6;
          label(st.label, left ? q.x - 10 : q.x + 10, q.y - 8, left ? "right" : "left", 700);
        } else if (st.label !== r.stops[i === 1 ? 0 : 3].label) {
          ctx.font = `500 12px ${s.font}`;
          const edge = cx + Math.sqrt(Math.max(0, disk * disk - (q.y + 14 - cy) ** 2));
          const right = q.x + 10 + ctx.measureText(st.label).width < edge - 6;
          label(st.label, right ? q.x + 10 : q.x - 10, q.y + 14, right ? "left" : "right", 500);
        }
      });

      // the travelling head
      if (head && headLeg) {
        const q = project(head);
        if (q.z > 0) {
          const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 20);
          g.addColorStop(0, c.leg[headLeg.kind]);
          g.addColorStop(1, "transparent");
          ctx.globalAlpha = 0.45;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 20, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = c.paper;
          ctx.strokeStyle = c.leg[headLeg.kind];
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 4.5, 0, TAU);
          ctx.fill();
          ctx.stroke();
        }
      }

      // camera: follow the head, zoom in on land legs, frame the whole route at the end
      if (now > s.manualUntil) {
        if (head && headLeg) {
          s.target = headLeg.kind === "sea" ? geoInterpolate(head.coord, r.mid)(0.2) : head.coord;
          s.zoomTarget = headLeg.kind === "sea" ? 1.05 : headLeg.zoom;
        } else if (p >= 1) {
          s.target = r.mid;
          s.zoomTarget = r.fit;
        } else {
          s.target = r.legs[0].pts[0].coord;
          s.zoomTarget = r.legs[0].zoom;
        }
      }
      if (p >= 1 && !r.done) {
        r.done = true;
        propsRef.current.onRouteDone();
      }
    };

    // ---------- loop ----------
    let raf: number;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(64, now - s.last);
      s.last = now;
      const P = propsRef.current;
      if ((P.route?.key ?? null) !== (s.route?.key ?? null)) {
        s.route = P.route ? prepareRoute(P.route) : null;
        s.manualUntil = 0;
      }
      if (!s.visible || !s.size) {
        // off screen: skip drawing, but let a running route finish on time
        const r = s.route;
        if (r && !r.done) {
          r.start ??= now;
          if (s.reduced || now - r.start >= DURATION) {
            r.done = true;
            P.onRouteDone();
          }
        }
        return;
      }

      const k = s.reduced ? 1 : 1 - Math.exp(-dt / 280);
      const kz = s.reduced ? 1 : 1 - Math.exp(-dt / 550);
      s.center[0] = wrap(s.center[0] + wrap(s.target[0] - s.center[0]) * k);
      s.center[1] += (s.target[1] - s.center[1]) * k;
      s.zoom += (s.zoomTarget - s.zoom) * kz;

      setView();
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, s.size, s.size);
      drawSphere();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, disk + 0.5, 0, TAU);
      ctx.clip();
      drawDots();
      if (s.route) drawRoute(s.route, now);
      drawMarkers(now);
      ctx.restore();
    };
    raf = requestAnimationFrame(frame);

    // ---------- input ----------
    const local = (e: PointerEvent): [number, number] => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const hitTest = (x: number, y: number): Hit | null => {
      let best: Hit | null = null;
      let bestD = 14;
      for (const h of s.hits) {
        const d = Math.hypot(h.x - x, h.y - y);
        if (d < bestD) {
          best = h;
          bestD = d;
        }
      }
      return best;
    };
    const onDown = (e: PointerEvent) => {
      s.drag = { x: e.clientX, y: e.clientY, moved: false };
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (s.drag) {
        const dx = e.clientX - s.drag.x;
        const dy = e.clientY - s.drag.y;
        if (!s.drag.moved && Math.hypot(dx, dy) < 4) return;
        s.drag.moved = true;
        s.drag.x = e.clientX;
        s.drag.y = e.clientY;
        const Rz = s.R * s.zoom;
        s.center[0] = wrap(s.center[0] - dx / Rz / RAD);
        s.center[1] = clamp(s.center[1] + dy / Rz / RAD, -80, 80);
        s.target = [s.center[0], s.center[1]];
        s.manualUntil = performance.now() + 2500;
        canvas.style.cursor = "grabbing";
        return;
      }
      s.hover = hitTest(...local(e));
      canvas.style.cursor = s.hover ? "pointer" : "grab";
    };
    const onUp = (e: PointerEvent) => {
      if (s.drag && !s.drag.moved) {
        const hit = hitTest(...local(e));
        if (hit) propsRef.current.onPick(hit.kind, hit.id);
      }
      s.drag = null;
      canvas.style.cursor = s.hover ? "pointer" : "grab";
    };
    const onLeave = () => {
      s.hover = null;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Without a route, turn to whatever was just picked.
  const { originId, destId, origins, destinations, route } = props;
  useEffect(() => {
    const s = stateRef.current;
    if (!s || route) return;
    const o = origins.find((m) => m.id === originId);
    const d = destinations.find((m) => m.id === destId);
    s.manualUntil = 0;
    s.zoomTarget = 1;
    if (o && d) s.target = geoInterpolate(o.p.coord, d.p.coord)(0.5);
    else if (o) s.target = o.p.coord;
    else if (d) s.target = d.p.coord;
  }, [originId, destId, route, origins, destinations]);

  const o = origins.find((m) => m.id === originId);
  const d = destinations.find((m) => m.id === destId);
  return (
    <div className="globe" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={fill(copy.hint, {
          origin: o ? fill(copy.madeIn, { label: o.label }) : copy.noOrigin,
          dest: d ? fill(copy.shippingTo, { label: d.label }) : copy.noDest,
        })}
      />
    </div>
  );
}
