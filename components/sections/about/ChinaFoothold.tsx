import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countries from "world-atlas/countries-50m.json";
import Container from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import type { ChinaCity, ChinaFootholdContent } from "@/content/about";

interface ChinaFootholdProps {
  content: ChinaFootholdContent;
}

const MAP_W = 800;
const MAP_H = 660;
const CHINA_ID = "156"; // ISO numeric code used by world-atlas

/* China's outline and the projection that places the cities on it. Computed once on the
   server, so the 50m topology never reaches the browser. */
const topology = countries as unknown as Topology<{ countries: GeometryCollection }>;
const china = feature(topology, topology.objects.countries).features.find(
  (f) => String(f.id) === CHINA_ID
);
const projection = geoMercator();
if (china) projection.fitExtent([[8, 8], [MAP_W - 8, MAP_H - 8]], china);
const outline = china ? geoPath(projection)(china) ?? "" : "";

function CityDot({ city, hq = false }: { city: ChinaCity; hq?: boolean }) {
  const pos = projection([city.lng, city.lat]);
  if (!pos) return null;
  const left = city.labelSide === "left";
  const r = hq ? 9 : 6;
  return (
    <g transform={`translate(${pos[0]} ${pos[1]})`}>
      {hq && <circle r={r + 7} className="fill-none stroke-psc-red" strokeWidth={2.5} />}
      <circle r={r} className="fill-psc-red stroke-psc-bg" strokeWidth={2.5} />
      <text
        x={left ? -(r + 16) : r + 16}
        y={(city.labelDy ?? 0) + 10}
        textAnchor={left ? "end" : "start"}
        className="fill-psc-ink font-sans"
        fontSize={hq ? 34 : 30}
        fontWeight={hq ? 600 : 500}
        stroke="var(--color-psc-muted)"
        strokeWidth={7}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {city.name}
      </text>
    </g>
  );
}

/* "Our foothold in China": the China map with the headquarters and offices marked */
export default function ChinaFoothold({ content }: ChinaFootholdProps) {
  return (
    <section className="bg-psc-bg py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[5fr_7fr] md:gap-16">
          <div>
            <div className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
              {content.label}
            </div>
            <h2 className="font-display text-h2 font-medium text-psc-ink">{content.headline}</h2>
            <p className="mt-4 max-w-md font-sans text-body leading-body text-psc-gray">
              {content.body}
            </p>

            <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 font-sans text-body">
              <dt className="text-small font-medium uppercase tracking-widest text-psc-red">
                {content.hqLabel}
              </dt>
              <dd className="font-medium text-psc-ink">{content.hq.name}</dd>
              <dt className="text-small font-medium uppercase tracking-widest text-psc-gray">
                {content.officesLabel}
              </dt>
              <dd className="text-psc-ink">{content.offices.map((o) => o.name).join(" · ")}</dd>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              {content.actions.map((a) => {
                const cls = `inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
                  a.href === "/start"
                    ? "bg-psc-ink text-psc-bg hover:bg-psc-red"
                    : "border border-psc-ink text-psc-ink hover:border-psc-red hover:text-psc-red"
                }`;
                const inner = (
                  <>
                    {a.label}
                    <span aria-hidden="true">→</span>
                  </>
                );
                return a.href.startsWith("mailto:") ? (
                  <a key={a.label} href={a.href} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link key={a.label} href={a.href} locale={a.locale} className={cls}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-psc-border bg-psc-muted/40 p-4 md:p-6">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              role="img"
              aria-label={content.mapLabel}
              className="block h-auto w-full"
            >
              <path d={outline} className="fill-psc-border" />
              {content.offices.map((o) => (
                <CityDot key={o.name} city={o} />
              ))}
              <CityDot city={content.hq} hq />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
