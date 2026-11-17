import { geoConicEqualArea, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, MultiPolygon } from "geojson";
import type { DefineContent } from "@/content/process";
import provinceData from "./chinaProvinces.json";

/* Map of China with real province borders (Natural Earth admin-1, public domain, trimmed to
   mainland China and simplified to about 70 KB in chinaProvinces.json). The sea on the right holds
   the icons of the coastal industries. Icons carry no text: the product names are read by screen
   readers only. */

const W = 520;
const H = 410;
const MAP_RIGHT = 410; // the map fills x 8..410; the sea on the right holds the coastal icons

type P = [number, number];
type Province = Feature<MultiPolygon, { id: string }>;

const provinces = (provinceData as unknown as FeatureCollection<MultiPolygon, { id: string }>).features as Province[];

/* Conic projection centred on China: the shape people know from school atlases */
const projection = geoConicEqualArea().parallels([25, 47]).rotate([-105, 0]).center([0, 35.5]);
projection.fitExtent([[8, 10], [MAP_RIGHT, H - 10]], { type: "FeatureCollection", features: provinces });
const path = geoPath(projection);
const shapes = provinces.map((f) => ({ id: f.properties.id, d: path(f) ?? "" }));
const at = (lon: number, lat: number) => projection([lon, lat]) as P;

/* ---------- Icons: 24x24, ink line work with one red accent each ---------- */

function gearPath(cx: number, cy: number, ro: number, ri: number, teeth: number): string {
  const pitch = (Math.PI * 2) / teeth;
  const pt = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * pitch - Math.PI / 2;
    d += `${i === 0 ? "M" : `A${ri} ${ri} 0 0 1 `}${pt(ri, a - pitch * 0.27)}L${pt(ro, a - pitch * 0.15)}L${pt(ro, a + pitch * 0.15)}L${pt(ri, a + pitch * 0.27)}`;
  }
  return `${d}A${ri} ${ri} 0 0 1 ${pt(ri, -Math.PI / 2 - pitch * 0.27)}Z`;
}

const GEAR = gearPath(12, 12, 9.5, 7.2, 8);

const ICONS: Record<keyof DefineContent["insight"]["products"], React.ReactNode> = {
  electronics: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.2" />
      <rect x="9.6" y="9.6" width="4.8" height="4.8" rx="1" className="pd-accent-fill" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </>
  ),
  machinery: (
    <>
      <path d={GEAR} />
      <circle cx="12" cy="12" r="3" className="pd-accent" />
    </>
  ),
  textiles: (
    <>
      <rect x="5.5" y="3" width="13" height="3.2" rx="1.2" />
      <rect x="5.5" y="17.8" width="13" height="3.2" rx="1.2" />
      <path d="M8 6.2v11.6M16 6.2v11.6" />
      <path d="M8 9.2l8 2.1M8 12.4l8 2.1M8 15.6l8 1.6" className="pd-accent" />
    </>
  ),
  footwear: (
    <>
      <path d="M2.8 16.5v-3.7c0-.7.5-1.2 1.2-1.4L7 10.6l1.7-3.4c.2-.4.7-.6 1.1-.4l1.5.8c.8.4 1.6.9 2.3 1.5l.5.4c.6.5 1.3.8 2.1.9l3 .5c1.4.3 2.3 1.4 2.3 2.8v3.3Z" />
      <path d="M2.8 16.5h18.4v1.7c0 .5-.3.8-.8.8H3.6c-.5 0-.8-.3-.8-.8Z" className="pd-accent-fill" />
      <path d="M10.6 9.9l1.6 1.6M12.6 11l1.5 1.5" className="pd-accent" />
    </>
  ),
  tea: (
    <>
      <path d="M12 21v-9.5" />
      <path d="M12 15.2C7.9 15.2 5.4 12.7 5.4 8.4c4.2 0 6.6 2.4 6.6 6.8Z" />
      <path d="M12 11.5c0-4.1 2.3-6.9 6.6-7.6.5 4.3-2.3 7.6-6.6 7.6Z" className="pd-accent-fill" />
    </>
  ),
  ceramics: (
    <>
      <path d="M9.4 3.5h5.2M10 3.5v2.7c0 1.3-3 2.6-3 6.8 0 4.4 2 7.5 5 7.5s5-3.1 5-7.5c0-4.2-3-5.5-3-6.8V3.5" />
      <path d="M7.4 11.8c2.9 1.4 6.3 1.4 9.2 0" className="pd-accent" />
      <path d="M9.6 20.5h4.8" />
    </>
  ),
  batteries: (
    <>
      <rect x="3" y="7.5" width="15.5" height="9.5" rx="2.2" />
      <path d="M21 10.8v2.9" />
      <path d="M11.4 9.6l-2.3 3.2h3.3l-2 3" className="pd-accent" />
    </>
  ),
};

interface MarkerDef {
  key: keyof DefineContent["insight"]["products"];
  /* [lon, lat] of the industrial region */
  geo: P;
  /* province that gets a red tint */
  province: string;
  /* badge position relative to the region: [0, 0] sits on it, otherwise a leader line joins them */
  off?: P;
}

const MARKERS: MarkerDef[] = [
  { key: "machinery", geo: [123.4, 41.8], province: "liaoning" },
  { key: "batteries", geo: [104.1, 30.7], province: "sichuan" },
  { key: "tea", geo: [101.7, 24.9], province: "yunnan" },
  { key: "ceramics", geo: [116.6, 28.6], province: "jiangxi" },
  { key: "textiles", geo: [120.4, 29.8], province: "zhejiang", off: [74, -14] },
  { key: "footwear", geo: [118.3, 25.6], province: "fujian", off: [66, 14] },
  { key: "electronics", geo: [113.9, 22.8], province: "guangdong", off: [42, 34] },
];

const R = 17; // badge radius
const tinted = new Set(MARKERS.map((m) => m.province));

interface ChinaMapProps {
  c: DefineContent["insight"];
}

export default function ChinaMap({ c }: ChinaMapProps) {
  const label = [c.cardTitle, ...Object.values(c.products)].join(", ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      {/* Coastline halo: the provinces drawn once with a grey stroke; the fills below hide the inner half */}
      <g fill="var(--color-psc-muted)" stroke="var(--color-psc-gray)" strokeOpacity={0.55} strokeWidth={1.6} strokeLinejoin="round">
        {shapes.map((s) => (
          <path key={s.id} d={s.d} />
        ))}
      </g>
      <g stroke="var(--color-psc-bg)" strokeWidth={1} strokeLinejoin="round">
        {shapes.map((s) => (
          <path
            key={s.id}
            d={s.d}
            fill={tinted.has(s.id) ? "color-mix(in srgb, var(--color-psc-red) 17%, var(--color-psc-muted))" : "var(--color-psc-muted)"}
          />
        ))}
      </g>

      {/* Leader lines and region dots for the icons that sit in the sea */}
      {MARKERS.map((m) => {
        if (!m.off) return null;
        const [x, y] = at(...m.geo);
        return (
          <g key={`l-${m.key}`} aria-hidden="true">
            <path
              d={`M${x.toFixed(1)} ${y.toFixed(1)} L${(x + m.off[0]).toFixed(1)} ${(y + m.off[1]).toFixed(1)}`}
              stroke="var(--color-psc-red)"
              strokeWidth={1}
              strokeDasharray="3 3"
              fill="none"
            />
            <circle cx={x} cy={y} r={3.5} fill="var(--color-psc-red)" stroke="var(--color-psc-bg)" strokeWidth={1.4} />
          </g>
        );
      })}

      {/* Icon badges */}
      {MARKERS.map((m) => {
        const [x, y] = at(...m.geo);
        const bx = x + (m.off?.[0] ?? 0);
        const by = y + (m.off?.[1] ?? 0);
        return (
          <g
            key={m.key}
            aria-hidden="true"
            transform={`translate(${bx.toFixed(1)} ${by.toFixed(1)})`}
          >
            <circle r={R} fill="var(--color-psc-bg)" stroke="var(--color-psc-border)" strokeWidth={1} className="pd-badge-disc" />
            <g
              transform="translate(-10 -10) scale(0.833)"
              fill="none"
              stroke="var(--color-psc-ink)"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[m.key]}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
