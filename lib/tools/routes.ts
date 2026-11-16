import { geoLength } from "d3-geo";
import { CN_PORTS, DEST_PORTS } from "./places.ts";
import type { Coord, Destination, Origin, Route, RouteLeg, ViaKey } from "./types.ts";

// Sea lanes as waypoint chains ([lon, lat]). Between waypoints the route
// follows the great circle, so the points are placed to keep it off land.

const HUB: Coord = [114.4, 21.5]; // south of Hong Kong, where the Chinese coastal lanes meet
const TAIL_SOUTH: Coord[] = [[117.3, 22.9], HUB];
const TAIL_EAST: Coord[] = [[122.6, 28.5], [120.8, 26.3], [119.7, 24.4], ...TAIL_SOUTH];
const TAIL_YELLOW: Coord[] = [[122.8, 34.0], [123.0, 31.5], ...TAIL_EAST];

const CN_HEAD: Record<string, Coord[]> = {
  shenzhen: [[114.27, 22.57], [114.35, 22.15]],
  guangzhou: [[113.62, 22.75], [113.75, 22.2], [114.0, 21.7]],
  xiamen: [[118.07, 24.47], [118.3, 24.15]],
  ningbo: [[121.88, 29.93], [122.4, 29.75]],
  shanghai: [[122.07, 30.63], [122.6, 30.3]],
  qingdao: [[120.32, 36.05], [120.8, 35.7]],
  tianjin: [[117.79, 38.98], [119.2, 38.6], [121.1, 38.3], [123.2, 37.5]],
  dalian: [[121.65, 38.93], [122.4, 38.8], [123.2, 37.5]],
};
const TO_HUB: Record<string, Coord[]> = {
  shenzhen: [HUB], guangzhou: [HUB], xiamen: TAIL_SOUTH,
  ningbo: TAIL_EAST, shanghai: TAIL_EAST,
  qingdao: TAIL_YELLOW, tianjin: TAIL_YELLOW, dalian: TAIL_YELLOW,
};

const HUB_TO_DONDRA: Coord[] = [
  [112.0, 17.8], [110.6, 12.0], [107.5, 6.5], [104.6, 1.35], [103.7, 1.15],
  [101.2, 2.55], [99.3, 4.5], [97.5, 6.2], [94.5, 6.5], [80.6, 5.3],
];
const DONDRA_TO_SUEZ: Coord[] = [
  [55.0, 13.1], [51.2, 12.5], [46.0, 12.2], [43.4, 12.6], [42.5, 14.0], [40.0, 18.0],
  [37.5, 22.5], [34.0, 27.5], [33.0, 29.0], [32.56, 29.93], [32.35, 31.25], [32.3, 31.6],
];
const MED_WEST: Coord[] = [[28.0, 33.7], [22.5, 34.6], [17.0, 35.6], [13.0, 36.95], [11.6, 37.4]];
const TO_GIBRALTAR: Coord[] = [[8.5, 37.6], [3.0, 37.4], [-1.0, 36.4], [-5.3, 35.95], [-7.0, 36.0]];
const ATLANTIC_N: Coord[] = [[-9.8, 36.8], [-10.0, 40.0], [-10.0, 43.4], [-6.0, 48.6]];
const NORTH: Coord[] = [...MED_WEST, ...TO_GIBRALTAR, ...ATLANTIC_N];
const CHANNEL: Coord[] = [...NORTH, [-2.5, 50.0], [1.4, 50.95]];
const NORTH_SEA: Coord[] = [...CHANNEL, [3.6, 52.4]];
const SKAGERRAK: Coord[] = [...NORTH_SEA, [6.0, 55.5], [8.5, 57.75], [10.7, 58.0]];
const KATTEGAT: Coord[] = [...SKAGERRAK, [11.4, 57.0], [12.3, 56.2]];
const DARDANELLES: Coord[] = [[28.0, 33.7], [26.5, 36.3], [25.5, 38.6], [25.4, 39.4], [26.1, 40.0], [26.6, 40.35], [27.5, 40.65]];

// From Port Said to each destination port.
const FROM_SUEZ: Record<string, Coord[]> = {
  valencia: [...MED_WEST, [8.5, 37.6], [3.0, 37.4], [0.7, 38.6]],
  barcelona: [...MED_WEST, [8.5, 37.6], [3.0, 37.4], [2.0, 39.15]],
  genoa: [...MED_WEST, [11.8, 38.2], [10.9, 40.5], [9.6, 43.5]],
  piraeus: [[28.0, 33.7], [25.0, 35.9], [23.9, 37.45]],
  koper: [[28.0, 33.7], [22.5, 34.6], [20.2, 37.0], [19.0, 39.9], [15.8, 42.6], [13.2, 44.9]],
  trieste: [[28.0, 33.7], [22.5, 34.6], [20.2, 37.0], [19.0, 39.9], [15.8, 42.6], [13.2, 44.9]],
  lisbon: [...MED_WEST, ...TO_GIBRALTAR, [-9.4, 37.6], [-9.4, 38.6]],
  lehavre: [...NORTH, [-2.5, 50.0], [0.0, 49.55]],
  antwerp: [...CHANNEL, [3.2, 51.45]],
  rotterdam: [...CHANNEL, [3.6, 52.0]],
  hamburg: [...NORTH_SEA, [6.5, 53.95], [8.3, 54.0], [8.8, 53.9]],
  gothenburg: [...SKAGERRAK],
  copenhagen: [...KATTEGAT],
  gdansk: [...KATTEGAT, [12.65, 56.05], [12.85, 55.4], [14.3, 54.8], [16.5, 55.0], [18.95, 54.55]],
  dublin: [...NORTH, [-6.6, 50.5], [-5.8, 52.0], [-5.9, 53.3]],
  ambarli: [...DARDANELLES],
  constanta: [...DARDANELLES, [29.0, 40.95], [29.1, 41.25], [29.6, 42.5]],
};

const PACIFIC_EXIT: Record<string, Coord[]> = {
  shenzhen: [[118.0, 21.3], [121.0, 21.2], [126.0, 24.0]],
  guangzhou: [[118.0, 21.3], [121.0, 21.2], [126.0, 24.0]],
  xiamen: [[119.3, 22.6], [121.0, 21.2], [126.0, 24.0]],
  ningbo: [[123.5, 30.0], [129.5, 29.0], [133.0, 30.2], [135.5, 32.6]],
  shanghai: [[123.5, 30.0], [129.5, 29.0], [133.0, 30.2], [135.5, 32.6]],
  qingdao: [[122.8, 34.0], [124.5, 31.0], [129.5, 29.0], [133.0, 30.2], [135.5, 32.6]],
  tianjin: [[122.8, 34.0], [124.5, 31.0], [129.5, 29.0], [133.0, 30.2], [135.5, 32.6]],
  dalian: [[122.8, 34.0], [124.5, 31.0], [129.5, 29.0], [133.0, 30.2], [135.5, 32.6]],
};
const PACIFIC: Coord[] = [[141.5, 34.4], [-122.5, 33.0]];

const PACIFIC_SOUTH: Coord[] = [[141.5, 34.4], [170.0, 15.0], [-150.0, 0.0], [-110.0, -8.0], [-85.0, -11.0]];

// Across the Pacific to the Gulf of Panama (round Punta Mala), through the canal
// from Balboa to Colón, then south of Hispaniola to Caucedo.
const PACIFIC_PANAMA: Coord[] = [
  [141.5, 34.4], [170.0, 26.0], [-160.0, 18.0], [-130.0, 10.0], [-100.0, 6.0], [-84.0, 5.5], [-80.0, 6.8], [-79.3, 8.3],
];
const PANAMA_CANAL: Coord[] = [[-79.55, 8.9], [-79.61, 9.02], [-79.8, 9.2], [-79.92, 9.3], [-79.92, 9.45]];
const CARIBBEAN_TO_CAUCEDO: Coord[] = [[-79.5, 10.2], [-69.6, 17.95]];

export function seaPath(cnPort: string, destPort: string): { coords: Coord[]; via: ViaKey } {
  const end = DEST_PORTS[destPort].coord;
  const head = CN_HEAD[cnPort];
  if (destPort === "losangeles") {
    return { coords: [...head, ...PACIFIC_EXIT[cnPort], ...PACIFIC, end], via: "pacific" };
  }
  if (destPort === "callao") {
    return { coords: [...head, ...PACIFIC_EXIT[cnPort], ...PACIFIC_SOUTH, end], via: "pacific" };
  }
  if (destPort === "caucedo") {
    return {
      coords: [...head, ...PACIFIC_EXIT[cnPort], ...PACIFIC_PANAMA, ...PANAMA_CANAL, ...CARIBBEAN_TO_CAUCEDO, end],
      via: "panama",
    };
  }
  const west = [...head, ...TO_HUB[cnPort], ...HUB_TO_DONDRA];
  return {
    coords: [...west, ...DONDRA_TO_SUEZ, ...FROM_SUEZ[destPort], end],
    via: "suez",
  };
}

const EARTH_KM = 6371;
const km = (coords: Coord[]): number => geoLength({ type: "LineString", coordinates: coords }) * EARTH_KM;
const ROAD_FACTOR = 1.25; // roads are longer than the straight line

export function buildRoute(origin: Origin, dest: Destination): Route {
  const cnPort = CN_PORTS[origin.port];
  const destPort = DEST_PORTS[dest.port];
  const sea = seaPath(origin.port, dest.port);
  const legs: RouteLeg[] = [
    { kind: "cn", coords: [origin.coord, cnPort.coord] },
    { kind: "sea", coords: sea.coords },
    { kind: "dest", coords: [destPort.coord, dest.coord] },
  ];
  return {
    legs,
    stops: [origin.city, cnPort.short, destPort.name, dest.city],
    via: sea.via,
    cnPort,
    destPort,
    km: {
      cn: Math.round(km(legs[0].coords) * ROAD_FACTOR),
      sea: Math.round(km(legs[1].coords)),
      dest: Math.round(km(legs[2].coords) * ROAD_FACTOR),
    },
  };
}
