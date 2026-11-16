import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";

export const STEP = 1.1; // degrees between dots
const RAD = Math.PI / 180;

export interface GlobeDots {
  n: number;
  lon: Float32Array;
  sinLat: Float32Array;
  cosLat: Float32Array;
  country: string[];
}

let cache: GlobeDots | null = null;

// Land as a hexagonal grid of dots. Countries are painted into an offscreen
// equirectangular image, one colour per country, and the grid samples it.
// That is far faster than a point-in-polygon test per dot.
export function getDots(): GlobeDots {
  if (cache) return cache;
  const topology = world as unknown as Topology<{ countries: GeometryCollection }>;
  const countries = feature(topology, topology.objects.countries).features;
  const W = 1440;
  const H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D is not available");
  const proj = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]);
  const path = geoPath(proj, ctx);
  countries.forEach((f, i) => {
    ctx.beginPath();
    path(f);
    ctx.fillStyle = `rgb(${(i + 1) & 255},${(i + 1) >> 8},0)`;
    ctx.fill();
  });
  const px = ctx.getImageData(0, 0, W, H).data;

  const lon: number[] = [];
  const sinLat: number[] = [];
  const cosLat: number[] = [];
  const country: string[] = [];
  let row = 0;
  for (let lat = 83; lat > -57; lat -= STEP * 0.866, row++) {
    const lonStep = STEP / Math.max(0.2, Math.cos(lat * RAD));
    for (let lo = -180 + ((row % 2) * lonStep) / 2; lo < 180; lo += lonStep) {
      const projected = proj([lo, lat]);
      if (!projected) continue;
      const [x, y] = projected;
      const i = (Math.floor(y) * W + Math.floor(x)) * 4;
      if (px[i + 3] < 128) continue;
      const idx = px[i] + (px[i + 1] << 8) - 1;
      lon.push(lo * RAD);
      sinLat.push(Math.sin(lat * RAD));
      cosLat.push(Math.cos(lat * RAD));
      country.push(String(countries[idx]?.id ?? ""));
    }
  }
  cache = {
    n: lon.length,
    lon: Float32Array.from(lon),
    sinLat: Float32Array.from(sinLat),
    cosLat: Float32Array.from(cosLat),
    country,
  };
  return cache;
}
