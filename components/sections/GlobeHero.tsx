"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Container from "@/components/ui/Container";
import CountryCard from "@/components/ui/CountryCard";
import OfficeCard from "@/components/ui/OfficeCard";
import type { CountryMarker, Office, ProjectType } from "@/lib/types";
import type { ProjectGlobeHandle } from "@/components/globe/ProjectGlobe";

const ProjectGlobe = dynamic(
  () => import("@/components/globe/ProjectGlobe"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-psc-border animate-pulse" />
      </div>
    ),
  }
);

interface GlobeHeroProps {
  eyebrow: string;
  headline: string;
  subheadline: string;
  countryMarkers: CountryMarker[];
  offices: Office[];
  /* Optional: only show projects of these types (markers left with none are hidden).
     null or undefined shows everything. */
  typeFilter?: ProjectType[] | null;
  /* The heading is the page H1 by default; pass "h2" when the globe sits lower on a page. */
  headingAs?: "h1" | "h2";
  /* Extra content under the subheadline, e.g. filter chips */
  children?: React.ReactNode;
}

const HOVER_CLEAR_DELAY_MS = 350;
const GLOBE_HEIGHT = 640;

export default function GlobeHero({
  eyebrow,
  headline,
  subheadline,
  countryMarkers,
  offices,
  typeFilter,
  headingAs: Heading = "h1",
  children,
}: GlobeHeroProps) {
  const visibleMarkers = useMemo(() => {
    if (!typeFilter) return countryMarkers;
    return countryMarkers
      .map((m) => ({ ...m, projects: m.projects.filter((p) => typeFilter.includes(p.type)) }))
      .filter((m) => m.projects.length > 0);
  }, [countryMarkers, typeFilter]);

  const globeRef = useRef<ProjectGlobeHandle>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const [globeWidth, setGlobeWidth] = useState(0);

  // Two separate marker states:
  // hoverMarker — set while mouse is over a globe dot; clears after HOVER_CLEAR_DELAY_MS
  // pinnedMarker — set on click (dot or pill); stays until toggled off or X pressed
  const [hoverMarker, setHoverMarker] = useState<CountryMarker | null>(null);
  const [pinnedMarker, setPinnedMarker] = useState<CountryMarker | null>(null);
  // pinnedOffice — set when a featured office dot or in-card office button is clicked.
  // Office card overrides country card in the right panel; closing it restores the country card.
  const [pinnedOffice, setPinnedOffice] = useState<Office | null>(null);

  // Pinned always wins; hover fills in when nothing is pinned
  // Look the marker up in the filtered list so a hidden country never shows its card,
  // and a visible one shows only its matching projects.
  const pick = (m: CountryMarker | null) => (m ? visibleMarkers.find((v) => v.id === m.id) ?? null : null);
  const activeMarker = pick(pinnedMarker) ?? pick(hoverMarker);
  // Office card takes priority over country card in the right panel
  const panelContent: "office" | "country" | "empty" =
    pinnedOffice ? "office" : activeMarker ? "country" : "empty";

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    []
  );

  // Measure globe container width
  useEffect(() => {
    const el = globeContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setGlobeWidth(Math.round(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Hover handling — debounced clear on leave ─────────────────────────────
  const hoverClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCountryHover = useCallback(
    (marker: CountryMarker | null) => {
      if (marker) {
        if (hoverClearTimer.current) clearTimeout(hoverClearTimer.current);
        setHoverMarker(marker);
      } else {
        hoverClearTimer.current = setTimeout(() => {
          setHoverMarker(null);
        }, HOVER_CLEAR_DELAY_MS);
      }
    },
    []
  );

  // ── Pin handling — pill click and globe dot click ─────────────────────────
  // Card lives in a fixed right panel so screen coords are irrelevant —
  // pin immediately and let the fly animation run in parallel.
  const handlePillClick = useCallback(
    (marker: CountryMarker) => {
      // Toggle: clicking the currently-pinned country clears it
      if (pinnedMarker?.id === marker.id) {
        setPinnedMarker(null);
        return;
      }

      // Show card instantly — no delay
      setPinnedMarker(marker);

      // Fly the globe to the country (non-blocking, runs in the background)
      if (!reducedMotion) {
        globeRef.current?.focusCountry(marker.lat, marker.lng);
      }
    },
    [pinnedMarker, reducedMotion]
  );

  const handleCountryClick = useCallback(
    (marker: CountryMarker) => handlePillClick(marker),
    [handlePillClick]
  );

  const clearPinned = useCallback(() => {
    setPinnedMarker(null);
  }, []);

  const handleOfficeClick = useCallback((office: Office) => {
    setPinnedOffice(office);
  }, []);

  const clearOffice = useCallback(() => {
    setPinnedOffice(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverClearTimer.current) clearTimeout(hoverClearTimer.current);
    };
  }, []);

  return (
    <section className="bg-psc-bg pt-16 pb-16">

      {/* ── Text ── */}
      <Container>
        <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
          {eyebrow}
        </p>
        <Heading className="font-display text-h1 font-medium text-psc-ink whitespace-pre-line mb-4">
          {headline}
        </Heading>
        <p className="font-sans text-body leading-body text-psc-gray max-w-2xl">
          {subheadline}
        </p>
        {children}
      </Container>

      {/* ── Globe + Card — side by side ── */}
      <div className="mt-12 mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

          {/* Globe — takes the bulk of the width on desktop */}
          <div
            ref={globeContainerRef}
            className="relative w-full md:flex-1 min-w-0 overflow-hidden"
            style={{ height: GLOBE_HEIGHT }}
            aria-hidden="true"
          >
            {globeWidth > 0 && (
              <ProjectGlobe
                ref={globeRef}
                width={globeWidth}
                height={GLOBE_HEIGHT}
                countryMarkers={visibleMarkers}
                offices={offices}
                onCountryHover={handleCountryHover}
                onCountryClick={handleCountryClick}
                onOfficeClick={handleOfficeClick}
                reducedMotion={reducedMotion}
              />
            )}
          </div>

          {/* Card panel — fixed width, always right of globe on desktop */}
          <div
            className="w-full md:w-96 flex-shrink-0 flex flex-col justify-center"
            style={{ minHeight: GLOBE_HEIGHT }}
          >
            {panelContent === "office" && pinnedOffice ? (
              <OfficeCard office={pinnedOffice} onClose={clearOffice} />
            ) : panelContent === "country" && activeMarker ? (
              <CountryCard
                marker={activeMarker}
                onClose={clearPinned}
                onOfficeClick={handleOfficeClick}
              />
            ) : (
              /* Empty state — subtle prompt */
              <div className="flex flex-col justify-center gap-3 py-12 md:py-0">
                <div className="w-8 h-px bg-psc-border" />
                <p className="font-sans text-small text-psc-gray leading-relaxed">
                  Hover over a country marker to preview projects. Click a marker or office dot to open a card.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Country pill strip — centred, below globe ── */}
      <div className="mt-8 flex justify-center flex-wrap gap-2 px-6">
        {visibleMarkers.map((m) => {
          const isPinned = pinnedMarker?.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handlePillClick(m)}
              className={`inline-flex items-center gap-2 font-sans text-xs font-medium tracking-wider uppercase px-4 py-2 rounded-full transition-colors duration-150 ${
                isPinned
                  ? "bg-psc-ink text-psc-bg border border-psc-ink"
                  : "border border-psc-border text-psc-gray hover:text-psc-ink hover:border-psc-ink"
              }`}
            >
              {/* Circular flag — cross-platform, no emoji issues */}
              <span className="w-[18px] h-[18px] rounded-full overflow-hidden flex-shrink-0 inline-flex">
                <Image
                  src={`https://flagcdn.com/w40/${m.countryCode.toLowerCase()}.png`}
                  alt=""
                  width={40}
                  height={30}
                  className="object-cover w-full h-full"
                />
              </span>
              {m.country}
            </button>
          );
        })}
      </div>

    </section>
  );
}
