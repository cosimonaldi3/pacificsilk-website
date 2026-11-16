// Shared types for the Shipping Estimate and Tariff Finder tools.

export type Coord = [number, number]; // [longitude, latitude]

export interface CnPort {
  name: string;
  short: string;
  coord: Coord;
}

export interface DestPort {
  name: string;
  coord: Coord;
}

export interface Origin {
  id: string;
  region: string;
  city: string;
  coord: Coord;
  port: string;
  known: string;
}

export interface Destination {
  id: string;
  country: string;
  city: string;
  coord: Coord;
  port: string;
  vat: number;
  eu: boolean;
  isoN: string;
  area: string;
}

export type LegKind = "cn" | "sea" | "dest";
export type ViaKey = "suez" | "pacific" | "panama";

export interface RouteLeg {
  kind: LegKind;
  coords: Coord[];
}

export interface RouteKm {
  cn: number;
  sea: number;
  dest: number;
}

export interface Route {
  legs: RouteLeg[];
  stops: string[];
  via: ViaKey;
  cnPort: CnPort;
  destPort: DestPort;
  km: RouteKm;
}

// ----- database rows and their app shapes -----

export type PriceBasis = "unit" | "kg";

export interface PriceRow {
  code: string;
  year: number;
  reporter?: string;
  partner?: string;
  avg_price: number | null;
  price_basis: PriceBasis;
  eur_per_unit: number | null;
  eur_per_kg: number | null;
  kg_per_unit: number | null;
}

export interface Price {
  code: string;
  level: string | null;
  avgPrice: number;
  basis: PriceBasis;
  eurPerUnit: number | null;
  eurPerKg: number | null;
  kgPerUnit: number | null;
  year: number;
  isFallback: boolean;
}

export interface PriceRangeRow {
  min_price: number | null;
  max_price: number | null;
  n_codes: number;
}

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
  count: number;
}

export interface RateStatsRow {
  geo_group?: string;
  rate_avg: number | null;
  rate_min?: number | null;
  rate_max?: number | null;
  n_leaves?: number;
  n_leaves_zero_filled?: number;
}

export interface RateStats {
  rate: number;
  min: number;
  max: number;
  count: number | null;
  none: boolean;
}

export interface SearchRow {
  code: string;
  description: string;
  common_terms: string | null;
  score?: number;
  matched_by?: string[];
}

export interface TreeNode {
  code: string;
  description: string;
  level: string | null;
  parent_code?: string | null;
  common_terms?: string | null;
}

export interface TreeOption extends TreeNode {
  hasChildren: boolean;
}

// The live `tariffs` table: there are no ad_valorem, valid_from, valid_to or note columns.
export interface TariffRow {
  id: number;
  goods_code: string;
  geo_code: string | null;
  measure: string;
  rate_text: string;
  goods_prefix: string;
  rate_perc: number | null;
  is_tariff: string;
}

// ----- estimate -----

export interface DutyInfo {
  rate: number;
  source: "database" | "estimate";
  note?: string;
  min?: number;
  max?: number;
  count?: number | null;
  none?: boolean;
  hs4?: string;
}

export interface DutyLookup {
  duty: DutyInfo;
  ad: DutyInfo | null;
}

export interface EstimateInput {
  qty: number;
  unitPrice: number;
  cbm: number;
  perContainer?: number | null;
  duty: number;
  ad: number;
  vat: number;
  route: Pick<Route, "km">;
  dest: Pick<Destination, "id">;
  dutyStats?: DutyInfo | null;
  adStats?: DutyInfo | null;
}

export type SweepInput = Omit<EstimateInput, "qty">;

export interface CostLine {
  id: string;
  label: string;
  amount: number;
  note?: string;
}

export interface TransitDays {
  cn: number;
  sea: number;
  dest: number;
  total: number;
}

export interface EstimateResult {
  lines: CostLine[];
  total: number;
  perUnit: number;
  vat: number;
  totalExVat: number;
  days: TransitDays;
}

export interface ClassifyOption {
  heading: string | null;
  description: string;
  chapter?: string;
  source: "database" | "generic";
}
