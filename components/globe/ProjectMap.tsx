"use client";

import { useMemo } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import type { Project } from "@/lib/types";

const MAP_WIDTH = 1000;
// Visible latitude band. The bottom cut hides Antarctica and the empty ocean under it.
const LAT_TOP = 84;
const LAT_BOTTOM = -57;
const PAD = 14;

/* A labelled red dot, e.g. a country on the About page */
export interface MapPlace {
  id: string;
  lat: number;
  lng: number;
  /* Leave out for a plain dot with no text */
  label?: string;
  labelSide?: "left" | "right";
  /* Display offset in map units, for dots that sit too close together */
  nudge?: [number, number];
  /* "ink" draws a black dot instead of the default red one */
  tone?: "red" | "ink";
}

const NO_PROJECTS: Project[] = [];
const NO_PLACES: MapPlace[] = [];

interface ProjectMapProps {
  /* Labelled red dots. Leave out to draw projects only (the Projects section). */
  places?: MapPlace[];
  /* Small black dots. Leave out to draw places only (the About page). */
  projects?: Project[];
  /* Optional. Projects not in this set fade out but stay on the map. Leave out to show all. */
  visibleIds?: Set<string>;
  activeProjectId?: string | null;
  activePlaceId?: string | null;
  /* When set, places not in this list are dimmed */
  highlightedPlaceIds?: string[];
  onProjectHover?: (id: string | null) => void;
  onProjectClick?: (id: string) => void;
  onPlaceClick?: (id: string) => void;
  /* Sizing, e.g. a min width so the map scrolls sideways on phones */
  className?: string;
  /* Place label size in map units; raise it when the map is drawn small */
  labelSize?: number;
}

// Flat world map: one borderless land shape, small black dots for projects and
// larger labelled red dots for places. Land comes from the bundled world-atlas
// topology (no network request). The SVG is decorative for assistive tech; the
// chips and lists in the parent are the accessible path.
export default function ProjectMap({
  places = NO_PLACES,
  projects = NO_PROJECTS,
  visibleIds,
  activeProjectId = null,
  activePlaceId = null,
  highlightedPlaceIds,
  onProjectHover,
  onProjectClick,
  onPlaceClick,
  className = "",
  labelSize = 17,
}: ProjectMapProps) {
  const map = useMemo(() => {
    const topology = world as unknown as Topology<{ land: GeometryCollection }>;
    const land = feature(topology, topology.objects.land);
    const sphere = { type: "Sphere" } as const;
    const projection = geoNaturalEarth1().fitWidth(MAP_WIDTH, sphere);
    const path = geoPath(projection);
    const top = (projection([0, LAT_TOP]) ?? [0, 0])[1] - PAD;
    const bottom = (projection([0, LAT_BOTTOM]) ?? [0, MAP_WIDTH / 2])[1] + PAD;
    return {
      viewBox: `${-PAD} ${top} ${MAP_WIDTH + PAD * 2} ${bottom - top}`,
      land: path(land) ?? "",
      project: (lng: number, lat: number) => projection([lng, lat]),
    };
  }, []);

  return (
    <svg
      viewBox={map.viewBox}
      className={`block h-auto w-full ${className}`}
      role="presentation"
    >
      <path d={map.land} className="fill-psc-border" />

      {/* Projects: small black dots, drawn under the places */}
      {projects.map((p) => {
        const pos = map.project(p.lng, p.lat);
        if (!pos) return null;
        const shown = !visibleIds || visibleIds.has(p.id);
        const active = activeProjectId === p.id;
        return (
          <g
            key={p.id}
            transform={`translate(${pos[0]} ${pos[1]})`}
            className={shown ? "cursor-pointer" : "pointer-events-none"}
            opacity={shown ? 1 : 0.12}
            onMouseEnter={() => onProjectHover?.(p.id)}
            onMouseLeave={() => onProjectHover?.(null)}
            onClick={() => onProjectClick?.(p.id)}
          >
            <circle r={11} className="fill-transparent" />
            {active && <circle r={9} className="fill-none stroke-psc-ink" strokeWidth={1.5} />}
            <circle r={4.5} className="fill-psc-ink" fillOpacity={0.8} />
          </g>
        );
      })}

      {/* Places: red dots with a label, all the same size */}
      {places.map((o) => {
        const pos = map.project(o.lng, o.lat);
        if (!pos) return null;
        const [dx, dy] = o.nudge ?? [0, 0];
        const left = o.labelSide === "left";
        const active = activePlaceId === o.id;
        const dimmed = highlightedPlaceIds ? !highlightedPlaceIds.includes(o.id) : false;
        return (
          <g
            key={o.id}
            transform={`translate(${pos[0] + dx} ${pos[1] + dy})`}
            className={onPlaceClick ? "cursor-pointer" : undefined}
            opacity={dimmed ? 0.4 : 1}
            onClick={onPlaceClick ? () => onPlaceClick(o.id) : undefined}
          >
            <circle r={18} className="fill-transparent" />
            {active && <circle r={17} className="fill-none stroke-psc-red" strokeWidth={2} />}
            <circle
              r={10}
              className={o.tone === "ink" ? "fill-psc-ink stroke-psc-bg" : "fill-psc-red stroke-psc-bg"}
              strokeWidth={2}
            />
            {o.label && (
              <text
                x={left ? -(10 + 7) : 10 + 7}
                y={labelSize * 0.3}
                textAnchor={left ? "end" : "start"}
                className="fill-psc-ink font-sans"
                fontSize={labelSize}
                fontWeight={500}
                stroke="var(--color-psc-bg)"
                strokeWidth={4}
                paintOrder="stroke"
                strokeLinejoin="round"
              >
                {o.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
