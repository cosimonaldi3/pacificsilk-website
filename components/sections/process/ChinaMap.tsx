import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import type { DefineContent } from "@/content/process";

/* Stylised map of China: the country outline is real (world-atlas), the provinces are
   approximated. Each province is the area closest to a seed point near its centre, clipped to the
   outline, so borders are indicative only, not survey-accurate. Swap in a province dataset if exact
   borders are ever needed. Product sketches mark well-known industry regions. */

const W = 430;
const H = 330;
const MAP_X = 330; // the map fills x 10..330; the sea on the right holds the product stickers

type P = [number, number];

/* [lon, lat] seeds, roughly each province's centre */
const PROVINCES: { id: string; at: P; tint?: boolean }[] = [
  { id: "heilongjiang", at: [128, 47.5] }, { id: "jilin", at: [125.5, 43.8] }, { id: "liaoning", at: [122.5, 41.2] },
  { id: "innermongolia", at: [112, 43] }, { id: "hebei", at: [115.2, 38.3] }, { id: "beijing", at: [116.4, 40.1] },
  { id: "tianjin", at: [117.3, 39.2] }, { id: "shanxi", at: [112.3, 37.4] }, { id: "shaanxi", at: [108.9, 35.4] },
  { id: "ningxia", at: [106.1, 37.5] }, { id: "gansu", at: [102, 37.5] }, { id: "qinghai", at: [96.5, 35.8] },
  { id: "xinjiang", at: [85, 41.5] }, { id: "tibet", at: [88.5, 31.8] }, { id: "sichuan", at: [103, 30.6] },
  { id: "chongqing", at: [107.6, 30] }, { id: "yunnan", at: [101.5, 25.2], tint: true }, { id: "guizhou", at: [106.8, 26.8] },
  { id: "guangxi", at: [108.3, 23.6] }, { id: "guangdong", at: [113.4, 23.4], tint: true }, { id: "hainan", at: [109.8, 19.2] },
  { id: "hunan", at: [111.9, 27.6] }, { id: "hubei", at: [112.3, 31] }, { id: "henan", at: [113.6, 34.1] },
  { id: "shandong", at: [118.1, 36.3] }, { id: "jiangsu", at: [119.8, 33.1], tint: true }, { id: "shanghai", at: [121.5, 31.2], tint: true },
  { id: "zhejiang", at: [120.2, 29.2], tint: true }, { id: "anhui", at: [117.2, 31.8] }, { id: "jiangxi", at: [115.7, 27.4] },
  { id: "fujian", at: [118.2, 26.3], tint: true },
];

/* Keep the half-plane of points closer to a than to b */
function clipHalf(poly: P[], a: P, b: P): P[] {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const nx = b[0] - a[0];
  const ny = b[1] - a[1];
  const d = (p: P) => (p[0] - mx) * nx + (p[1] - my) * ny;
  const out: P[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const dp = d(p);
    const dq = d(q);
    if (dp <= 0) out.push(p);
    if (dp <= 0 !== dq <= 0) {
      const t = dp / (dp - dq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
}

const topology = world as unknown as Topology<{ countries: GeometryCollection }>;
const china = feature(topology, topology.objects.countries).features.find((f) => String(f.id) === "156");
const projection = geoMercator();
if (china) projection.fitExtent([[10, 12], [MAP_X, H - 12]], china);
const outline = china ? (geoPath(projection)(china) ?? "") : "";

const seeds = PROVINCES.map((p) => ({ ...p, xy: projection(p.at) as P }));
const cells = seeds.map((s, i) => {
  let poly: P[] = [[-60, -60], [W + 60, -60], [W + 60, H + 60], [-60, H + 60]];
  seeds.forEach((o, k) => {
    if (k !== i) poly = clipHalf(poly, s.xy, o.xy);
  });
  return { id: s.id, tint: s.tint, d: "M" + poly.map((q) => q.map((n) => n.toFixed(1)).join(",")).join("L") + "Z" };
});

const at = (lon: number, lat: number) => projection([lon, lat]) as P;

/* 24×24 line sketches */
const ICONS: Record<string, React.ReactNode> = {
  electronics: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4" />
    </>
  ),
  machinery: (
    <>
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  textiles: <path d="M8 4 3 7l2 4 3-1v10h8V10l3 1 2-4-5-3c-.5 1.5-2 2.5-4 2.5S8.5 5.5 8 4Z" />,
  footwear: <path d="M3 17h18v-2.5c0-1.4-1.4-2-3-2.3L14.5 11 13 7.5 10 9 8.5 12C5 12.5 3 13.5 3 15.5V17Z" />,
  tea: (
    <>
      <path d="M5 10h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5v-4Z" />
      <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M9 3.5c0 1.5 1.5 1.5 1.5 3M13 3.5c0 1.5 1.5 1.5 1.5 3" />
    </>
  ),
};

interface MarkerDef {
  key: keyof DefineContent["insight"]["products"];
  at: P;
  hub?: boolean;
  /* where the sticker goes: "sea" = right-hand column, or a fixed spot */
  spot?: P;
}

const MARKERS: MarkerDef[] = [
  { key: "machinery", at: at(121.5, 31.2), hub: true },
  { key: "textiles", at: at(120.1, 29.3) },
  { key: "footwear", at: at(118.1, 25.9) },
  { key: "electronics", at: at(114.06, 22.54), hub: true },
  { key: "tea", at: at(101.5, 24.8), spot: [14, H - 34] },
];

const STICKER_W = 88;
const STICKER_H = 28;

/* Sea-side stickers: align to their marker, push apart so they never overlap */
function layout(): { m: MarkerDef; x: number; y: number }[] {
  const sea = MARKERS.filter((m) => !m.spot).sort((a, b) => a.at[1] - b.at[1]);
  let prev = -Infinity;
  const placed = sea.map((m) => {
    const y = Math.max(prev + STICKER_H + 6, m.at[1] - STICKER_H / 2);
    prev = y;
    return { m, x: W - STICKER_W - 4, y };
  });
  const fixed = MARKERS.filter((m) => m.spot).map((m) => ({ m, x: m.spot![0], y: m.spot![1] }));
  return [...placed, ...fixed];
}
const STICKERS = layout();

interface ChinaMapProps {
  c: DefineContent["insight"];
}

export default function ChinaMap({ c }: ChinaMapProps) {
  const cityLabel: Record<string, string> = { machinery: c.cities.shanghai, electronics: c.cities.shenzhen };
  const hubs = STICKERS.filter((s) => s.m.hub);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={c.cardTitle}>
      <defs>
        <clipPath id="china-clip">
          <path d={outline} />
        </clipPath>
      </defs>

      {/* Provinces, clipped to the real outline */}
      <g clipPath="url(#china-clip)">
        {cells.map((cell) => (
          <path
            key={cell.id}
            d={cell.d}
            fill={cell.tint ? "color-mix(in srgb, var(--color-psc-red) 16%, transparent)" : "var(--color-psc-muted)"}
            stroke="var(--color-psc-bg)"
            strokeWidth={1.2}
            className={cell.tint ? "pd-region" : undefined}
          />
        ))}
      </g>
      <path d={outline} fill="none" stroke="var(--color-psc-gray)" strokeOpacity={0.5} strokeWidth={0.8} />

      {/* Leader lines + markers + stickers */}
      {STICKERS.map(({ m, x, y }, i) => {
        const sx = m.spot ? x + STICKER_W / 2 : x;
        const sy = y + STICKER_H / 2;
        return (
          <g key={m.key}>
            <path
              d={`M${m.at[0]} ${m.at[1]} L${sx} ${sy}`}
              stroke="var(--color-psc-red)"
              strokeWidth={1}
              strokeDasharray="3 3"
              fill="none"
              className="pd-lead"
              style={{ "--i": i } as React.CSSProperties}
            />
            {m.hub && (
              <circle cx={m.at[0]} cy={m.at[1]} r={9} fill="none" stroke="var(--color-psc-red)" strokeWidth={1.5} className="pd-ping" />
            )}
            <circle cx={m.at[0]} cy={m.at[1]} r={m.hub ? 7 : 4.5} fill="var(--color-psc-red)" stroke="var(--color-psc-bg)" strokeWidth={1.5} />
          </g>
        );
      })}

      {STICKERS.map(({ m, x, y }, i) => (
        <g key={`s-${m.key}`} className="pd-sticker" style={{ "--i": i } as React.CSSProperties}>
          <rect x={x} y={y} width={STICKER_W} height={STICKER_H} rx={8} fill="var(--color-psc-bg)" stroke="var(--color-psc-border)" />
          <g transform={`translate(${x + 6} ${y + 4}) scale(0.83)`} fill="none" stroke="var(--color-psc-ink)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            {ICONS[m.key]}
          </g>
          <text x={x + 30} y={y + 18} fontSize={11} fill="var(--color-psc-ink)" className="font-sans">
            {c.products[m.key]}
          </text>
        </g>
      ))}

      {/* City names on the two big hubs */}
      {hubs.map(({ m }) => (
        <text
          key={`c-${m.key}`}
          x={m.at[0] - 12}
          y={m.at[1] + (m.key === "electronics" ? 20 : 4)}
          textAnchor="end"
          fontSize={10}
          fontWeight={600}
          fill="var(--color-psc-ink)"
          className="font-sans"
          style={{ paintOrder: "stroke", stroke: "var(--color-psc-bg)", strokeWidth: 3 }}
        >
          {cityLabel[m.key]}
        </text>
      ))}
    </svg>
  );
}
