"use client";

import { useState } from "react";
import GlobeHero from "@/components/sections/GlobeHero";
import type { CapabilitiesPageContent } from "@/content/capabilities";
import type { CountryMarker, Office } from "@/lib/types";

interface ProjectFinderProps {
  content: CapabilitiesPageContent["finder"];
  countryMarkers: CountryMarker[];
  offices: Office[];
}

/* The project globe with type filter chips. The chips narrow the markers and the
   project lists inside each country card. */
export default function ProjectFinder({ content, countryMarkers, offices }: ProjectFinderProps) {
  const [selected, setSelected] = useState(0);
  const filter = content.filters[selected];

  return (
    <GlobeHero
      eyebrow={content.label}
      headline={content.headline}
      subheadline={content.subheadline}
      countryMarkers={countryMarkers}
      offices={offices}
      typeFilter={filter?.types ?? null}
      headingAs="h2"
    >
      <div role="group" aria-label={content.filterLabel} className="mt-8 flex flex-wrap gap-2">
        {content.filters.map((f, i) => {
          const on = i === selected;
          return (
            <button
              key={f.label}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(i)}
              className={`rounded-full px-4 py-2 font-sans text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
                on
                  ? "border border-psc-ink bg-psc-ink text-psc-bg"
                  : "border border-psc-border text-psc-gray hover:border-psc-ink hover:text-psc-ink"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-wide text-psc-gray">{content.note}</p>
    </GlobeHero>
  );
}
