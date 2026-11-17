import { geoConicEqualArea, geoNaturalEarth1, geoPath } from "d3-geo";
import type { FeatureCollection, MultiPolygon } from "geojson";
import provinceData from "./chinaProvinces.json";
import americasData from "./americasOutline.json";

/* The route from China to Mexico on two small maps: factory in the heart of China, the port at
   Shanghai, a line across the Pacific to a port on Mexico's Pacific coast, and on to Mexico
   City. North and South America are drawn whole; Mexico is the sample
   destination, and the sea between the maps is schematic, not to scale. Still, on purpose.
   Province borders: Natural Earth admin-1. Countries: Natural Earth 110m (both public domain). */

const W = 720;
const H = 240;

type P = [number, number];

const provinces = (provinceData as unknown as FeatureCollection<MultiPolygon, { id: string }>).features;
const americas = (americasData as unknown as FeatureCollection<MultiPolygon, { name: string }>).features;

const chinaProj = geoConicEqualArea().parallels([25, 47]).rotate([-105, 0]).center([0, 35.5]);
chinaProj.fitExtent([[6, 8], [330, H - 8]], { type: "FeatureCollection", features: provinces });
const americasProj = geoNaturalEarth1().rotate([80, 0]);
americasProj.fitExtent([[W - 190, 4], [W - 8, H - 4]], { type: "FeatureCollection", features: americas });

const chinaPath = geoPath(chinaProj);
const americasPath = geoPath(americasProj);
const provinceShapes = provinces.map((f) => ({ id: f.properties.id, d: chinaPath(f) ?? "" }));
const americasShapes = americas.map((f) => ({ id: f.properties.name, d: americasPath(f) ?? "" }));

const factory = chinaProj([112.5, 32.5]) as P; // heart of China
const shanghai = chinaProj([121.4, 31.1]) as P;
const port = americasProj([-116.6, 31.85]) as P; // Ensenada, on the Pacific coast
const mexicoCity = americasProj([-99.1, 19.4]) as P;

const f = (n: number) => n.toFixed(1);
/* Leg 1: factory to Shanghai. Leg 2: across the sea. Leg 3: the port to Mexico City. */
const leg1 = `M${f(factory[0])} ${f(factory[1])} C${f(factory[0] + 30)} ${f(factory[1] - 26)} ${f(shanghai[0] - 30)} ${f(shanghai[1] + 26)} ${f(shanghai[0])} ${f(shanghai[1])}`;
const sea: [P, P, P, P] = [
  shanghai,
  [shanghai[0] + 110, shanghai[1] - 70],
  [port[0] - 110, port[1] + 70],
  port,
];
const leg2 = `M${f(sea[0][0])} ${f(sea[0][1])} C${f(sea[1][0])} ${f(sea[1][1])} ${f(sea[2][0])} ${f(sea[2][1])} ${f(sea[3][0])} ${f(sea[3][1])}`;
const leg3 = `M${f(port[0])} ${f(port[1])} C${f(port[0] + 40)} ${f(port[1] + 6)} ${f(mexicoCity[0] - 30)} ${f(mexicoCity[1] - 24)} ${f(mexicoCity[0])} ${f(mexicoCity[1])}`;
export default function RouteMap({ label }: { label: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      {/* The two countries */}
      {/* One flat shape per map: no borders between provinces or countries (the stroke matches the
          fill, only to close hairline gaps between neighbouring shapes) */}
      <g fill="var(--color-psc-border)" stroke="var(--color-psc-border)" strokeWidth="0.6" strokeLinejoin="round">
        {provinceShapes.map((s) => (
          <path key={s.id} d={s.d} />
        ))}
        {americasShapes.map((c) => (
          <path key={c.id} d={c.d} />
        ))}
      </g>

      {/* The route: one red line, open dots at the four stops: factory, port, port, Mexico City */}
      <g fill="none" stroke="var(--color-psc-red)" strokeWidth="2.5" strokeLinecap="round">
        <path d={leg1} />
        <path d={leg2} />
        <path d={leg3} />
      </g>

      <g fill="var(--color-psc-bg)" stroke="var(--color-psc-red)" strokeWidth="2.5">
        {[factory, shanghai, port, mexicoCity].map((p, i) => (
          <circle key={i} cx={f(p[0])} cy={f(p[1])} r="6.5" />
        ))}
      </g>
    </svg>
  );
}
