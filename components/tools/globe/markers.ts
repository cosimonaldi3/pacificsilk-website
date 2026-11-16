import type { Coord } from "@/lib/tools/types";

// Kept apart from RouteGlobe so the form can build markers without loading the
// globe's browser-only code, which is imported with next/dynamic.

const RAD = Math.PI / 180;

export interface GlobePoint {
  lon: number;
  sinLat: number;
  cosLat: number;
  coord: Coord;
}

export interface GlobeMarker {
  id: string;
  label: string;
  p: GlobePoint;
}

export const toPoint = ([lon, lat]: Coord): GlobePoint => ({
  lon: lon * RAD,
  sinLat: Math.sin(lat * RAD),
  cosLat: Math.cos(lat * RAD),
  coord: [lon, lat],
});

export const toMarker = (id: string, label: string, coord: Coord): GlobeMarker => ({ id, label, p: toPoint(coord) });
