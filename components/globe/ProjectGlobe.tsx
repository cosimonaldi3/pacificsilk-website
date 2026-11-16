"use client";

import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo,
} from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import type { CountryMarker, Office } from "@/lib/types";

// Globe colours — WebGL needs raw hex; values match CSS design tokens.
const GLOBE_COLORS = {
  surface: "#F5F3EE",
  hexContinent: "rgba(107,107,107,0.45)",
  projectMarker: "#E71F1F",  // psc-red
  officeMarker: "#0A0A0A",   // psc-ink
  atmosphere: "rgba(239,236,228,0.4)",
} as const;

const RESUME_AFTER_DRAG_MS = 3000;
const RESUME_AFTER_HOVER_MS = 1500;

// Internal point shape passed to react-globe.gl pointsData
type GlobePoint = {
  lat: number;
  lng: number;
  markerType: "project" | "office";
  countryMarker?: CountryMarker;
  office?: Office;
};

export interface ProjectGlobeHandle {
  focusCountry: (lat: number, lng: number) => void;
  getScreenCoords: (lat: number, lng: number) => { x: number; y: number } | null;
}

interface ProjectGlobeProps {
  countryMarkers: CountryMarker[];
  offices: Office[];
  onCountryHover: (marker: CountryMarker | null, coords: { x: number; y: number } | null) => void;
  onCountryClick: (marker: CountryMarker) => void;
  onOfficeClick: (office: Office) => void;
  width: number;
  height: number;
  reducedMotion: boolean;
}

const ProjectGlobe = forwardRef<ProjectGlobeHandle, ProjectGlobeProps>(
  function ProjectGlobe(
    { countryMarkers, offices, onCountryHover, onCountryClick, onOfficeClick, width, height, reducedMotion },
    ref
  ) {
    // react-globe.gl exposes no public TS types for its imperative ref
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globeEl = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controlsRef = useRef<any>(null);
    const dragResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hoverResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [countries, setCountries] = useState<{ features: object[] }>({ features: [] });

    const globeMaterial = useMemo(
      () =>
        new THREE.MeshPhongMaterial({
          color: new THREE.Color(GLOBE_COLORS.surface),
          shininess: 8,
        }),
      []
    );

    // Build unified pointsData from country markers + offices
    const pointsData = useMemo<GlobePoint[]>(() => {
      const pts: GlobePoint[] = countryMarkers.map((cm) => ({
        lat: cm.lat,
        lng: cm.lng,
        markerType: "project",
        countryMarker: cm,
      }));
      for (const o of offices) {
        pts.push({ lat: o.lat, lng: o.lng, markerType: "office", office: o });
      }
      return pts;
    }, [countryMarkers, offices]);

    // Load GeoJSON hex polygons
    useEffect(() => {
      fetch("/data/world-countries.geojson")
        .then((r) => r.json())
        .then(setCountries)
        .catch(() => { /* markers still render */ });
    }, []);

    // Controls: no zoom, auto-rotate, drag pause/resume.
    // Deferred one animation frame so the Three.js scene is guaranteed ready.
    useEffect(() => {
      let onStart: (() => void) | null = null;
      let onEnd: (() => void) | null = null;

      const raf = requestAnimationFrame(() => {
        const controls = globeEl.current?.controls?.();
        if (!controls) return;
        controlsRef.current = controls;

        controls.enableZoom = false;
        controls.autoRotate = !reducedMotion;
        controls.autoRotateSpeed = 0.35;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;

        onStart = () => {
          controls.autoRotate = false;
          if (dragResumeTimer.current) clearTimeout(dragResumeTimer.current);
          if (hoverResumeTimer.current) clearTimeout(hoverResumeTimer.current);
        };

        onEnd = () => {
          if (reducedMotion) return;
          if (dragResumeTimer.current) clearTimeout(dragResumeTimer.current);
          dragResumeTimer.current = setTimeout(() => {
            if (controlsRef.current) controlsRef.current.autoRotate = true;
          }, RESUME_AFTER_DRAG_MS);
        };

        controls.addEventListener("start", onStart);
        controls.addEventListener("end", onEnd);
      });

      return () => {
        cancelAnimationFrame(raf);
        const controls = controlsRef.current;
        if (controls && onStart) controls.removeEventListener("start", onStart);
        if (controls && onEnd) controls.removeEventListener("end", onEnd);
        if (dragResumeTimer.current) clearTimeout(dragResumeTimer.current);
        if (hoverResumeTimer.current) clearTimeout(hoverResumeTimer.current);
      };
    }, [reducedMotion]);

    useImperativeHandle(ref, () => ({
      focusCountry: (lat, lng) => {
        globeEl.current?.pointOfView({ lat, lng, altitude: 2.0 }, 1200);
      },
      getScreenCoords: (lat, lng) => {
        return globeEl.current?.getScreenCoords(lat, lng, 0.02) ?? null;
      },
    }));

    return (
      <Globe
        ref={globeEl}
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={globeMaterial}
        atmosphereColor={GLOBE_COLORS.atmosphere}
        atmosphereAltitude={0.12}
        // Hex-polygon continents
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => GLOBE_COLORS.hexContinent}
        // Markers
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d) =>
          (d as GlobePoint).markerType === "office"
            ? GLOBE_COLORS.officeMarker
            : GLOBE_COLORS.projectMarker
        }
        pointRadius={(d) =>
          (d as GlobePoint).markerType === "office" ? 0.4 : 0.7
        }
        pointAltitude={0.02}
        pointLabel=""
        onPointHover={(point) => {
          const pt = point as GlobePoint | null;

          if (pt?.markerType === "project" && pt.countryMarker) {
            // Stop rotation while hovering a project marker
            if (controlsRef.current) controlsRef.current.autoRotate = false;
            if (hoverResumeTimer.current) clearTimeout(hoverResumeTimer.current);
            if (dragResumeTimer.current) clearTimeout(dragResumeTimer.current);

            const coords =
              globeEl.current?.getScreenCoords(pt.lat, pt.lng, 0.02) ?? null;
            onCountryHover(pt.countryMarker, coords);
          } else {
            // Not hovering a project marker — schedule resume
            onCountryHover(null, null);
            if (!reducedMotion) {
              if (hoverResumeTimer.current) clearTimeout(hoverResumeTimer.current);
              hoverResumeTimer.current = setTimeout(() => {
                if (controlsRef.current) controlsRef.current.autoRotate = true;
              }, RESUME_AFTER_HOVER_MS);
            }
          }
        }}
        onPointClick={(point) => {
          const pt = point as GlobePoint;
          if (pt.markerType === "project" && pt.countryMarker) {
            onCountryClick(pt.countryMarker);
          } else if (pt.markerType === "office" && pt.office?.featured) {
            // Only featured offices get a card; Hangzhou stays black-dot-only
            onOfficeClick(pt.office);
          }
        }}
      />
    );
  }
);

export default ProjectGlobe;
