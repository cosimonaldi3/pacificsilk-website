// The only module that talks to Supabase. Read only. See data-pipeline/db/DATABASE.md.
// Goods codes are always text: "0703" must never become 703.

import type {
  Price,
  PriceRange,
  PriceRangeRow,
  PriceRow,
  RateStats,
  RateStatsRow,
  SearchRow,
  TariffRow,
  TreeNode,
  TreeOption,
} from "./types.ts";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";

export const isConfigured = Boolean(
  SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes("YOUR-PROJECT") && !SUPABASE_KEY.includes("YOUR-PUBLIC"),
);

const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

const NODE_COLUMNS = "code,description,level,parent_code,common_terms";
const LEVELS: Record<number, string> = { 2: "chapter", 4: "hs4", 6: "hs6", 8: "cn8", 10: "taric10" };

export class DbError extends Error {
  status: number | null;
  code: string | null;

  constructor(message: string, { status = null, code = null }: { status?: number | null; code?: string | null } = {}) {
    super(message);
    this.name = "DbError";
    this.status = status;
    this.code = code;
  }
}

interface ErrorBody {
  message?: string;
  hint?: string;
  code?: string;
}

// ---------------------------------------------------------------
// Pure helpers (exported for tests)
// ---------------------------------------------------------------

// "Database error 400: column x does not exist (Perhaps you meant ...)"
export function errorMessage(what: string, status: number, body: ErrorBody | null): string {
  const detail = [body?.message, body?.hint && `(${body.hint})`].filter(Boolean).join(" ");
  return `${what}: database error ${status}${detail ? `: ${detail}` : ""}`;
}

export function assertCode(code: string): string {
  if (typeof code !== "string" || !/^\d{2}(\d{2}){0,4}$/.test(code)) {
    throw new TypeError(`Goods code must be a text of 2, 4, 6, 8 or 10 digits, got ${JSON.stringify(code)}`);
  }
  return code;
}

export const levelOf = (code: string): string | null => LEVELS[code.length] ?? null;

// Trimmed query, or null when it is too short to search.
export function normalizeQuery(q: string | null | undefined): string | null {
  const t = typeof q === "string" ? q.trim() : "";
  return t.length >= 2 ? t : null;
}

// "0703200000" -> ["07", "0703", "070320", "07032000", "0703200000"]
export function breadcrumbCodes(code: string): string[] {
  assertCode(code);
  return [2, 4, 6, 8, 10].filter((n) => n <= code.length).map((n) => code.slice(0, n));
}

// price_for row -> app shape; null when there is no price.
export function toPrice(row: PriceRow | undefined, requested: string): Price | null {
  if (!row || row.avg_price == null) return null;
  return {
    code: row.code,
    level: levelOf(row.code),
    avgPrice: row.avg_price,
    basis: row.price_basis,
    eurPerUnit: row.eur_per_unit,
    eurPerKg: row.eur_per_kg,
    kgPerUnit: row.kg_per_unit,
    year: row.year,
    isFallback: row.code !== requested,
  };
}

// price_range_for row -> { minPrice, maxPrice, count }; null unless it spans more than one price.
export function toPriceRange(row: PriceRangeRow | undefined): PriceRange | null {
  if (!row || row.min_price == null || row.max_price == null) return null;
  if (row.n_codes < 2 || row.min_price === row.max_price) return null;
  return { minPrice: row.min_price, maxPrice: row.max_price, count: row.n_codes };
}

// tariffs_hs4 row -> { rate, min, max, count, none }; null when there is no average.
// none: every leaf was zero filled, so no measure exists for the heading.
export function toRateStats(row: RateStatsRow | undefined): RateStats | null {
  if (!row || row.rate_avg == null) return null;
  const leaves = row.n_leaves ?? 0;
  const none = leaves > 0 && row.n_leaves_zero_filled === leaves;
  return {
    rate: none ? 0 : row.rate_avg,
    min: row.rate_min ?? row.rate_avg,
    max: row.rate_max ?? row.rate_avg,
    count: row.n_leaves ?? null,
    none,
  };
}

// children + the parent_code of each grandchild -> children with hasChildren
export function markLeaves<T extends { code: string }>(
  children: T[],
  grandchildParents: string[],
): (T & { hasChildren: boolean })[] {
  const parents = new Set(grandchildParents);
  return children.map((c) => ({ ...c, hasChildren: parents.has(c.code) }));
}

// PostgREST in.() filter; codes are quoted so they stay text.
const inList = (codes: string[]): string => encodeURIComponent(`(${codes.map((c) => `"${c}"`).join(",")})`);

// ---------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------

async function request(what: string, path: string, init: RequestInit = {}): Promise<Response> {
  if (!isConfigured) {
    throw new DbError(`${what}: the database is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_KEY)`);
  }
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...headers, ...init.headers } });
  } catch (err) {
    throw new DbError(`${what}: could not reach the database (${(err as Error).message})`);
  }
  if (!res.ok) {
    let body: ErrorBody | null = null;
    try {
      body = (await res.json()) as ErrorBody;
    } catch {
      /* not JSON */
    }
    throw new DbError(errorMessage(what, res.status, body), { status: res.status, code: body?.code ?? null });
  }
  return res;
}

const select = async <T>(what: string, path: string): Promise<T> => (await request(what, path)).json() as Promise<T>;

const rpc = async <T>(fn: string, args: Record<string, unknown>): Promise<T> =>
  (
    await request(fn, `rpc/${fn}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    })
  ).json() as Promise<T>;

// ---------------------------------------------------------------
// Public API
// ---------------------------------------------------------------

// Plain English -> ranked hs4 rows: { code, description, common_terms, score, matched_by }.
export async function searchHs4(q: string, limit = 20): Promise<SearchRow[]> {
  const query = normalizeQuery(q);
  if (!query) return [];
  return rpc<SearchRow[]>("search_hs4", { q: query, max_results: limit });
}

// One nomenclature row, or null.
export async function getNode(code: string): Promise<TreeNode | null> {
  assertCode(code);
  const rows = await select<TreeNode[]>("getNode", `nomenclature?select=${NODE_COLUMNS}&code=eq.${code}`);
  return rows[0] ?? null;
}

// Children of code, ordered by code, each with hasChildren. Two queries:
// the children, then the parent_code of their own children.
export async function getChildren(code: string): Promise<TreeOption[]> {
  assertCode(code);
  const children = await select<TreeNode[]>(
    "getChildren",
    `nomenclature?select=${NODE_COLUMNS}&parent_code=eq.${code}&order=code`,
  );
  if (!children.length) return [];
  const res = await request(
    "getChildren",
    `nomenclature?select=parent_code&parent_code=in.${inList(children.map((c) => c.code))}`,
    { headers: { Prefer: "count=exact" } },
  );
  const grandchildren = (await res.json()) as { parent_code: string }[];
  // the API caps rows per response: a cut list would mark some children as leaves
  const total = Number(res.headers.get("content-range")?.split("/")[1]);
  if (total > grandchildren.length) {
    throw new DbError(
      `getChildren: ${total} grandchildren of ${code}, only ${grandchildren.length} returned; leaf flags would be wrong`,
    );
  }
  return markLeaves(children, grandchildren.map((g) => g.parent_code));
}

// Ancestors from the chapter down to code itself, in one query.
export async function getBreadcrumb(code: string): Promise<TreeNode[]> {
  const codes = breadcrumbCodes(code);
  return select<TreeNode[]>(
    "getBreadcrumb",
    `nomenclature?select=${NODE_COLUMNS}&code=in.${inList(codes)}&order=code`,
  );
}

// Average price for code, or for its nearest parent with data (isFallback). null if none.
export async function getPrice(code: string, partner?: string): Promise<Price | null> {
  assertCode(code);
  const rows = await rpc<PriceRow[]>("price_for", partner ? { p_code: code, p_partner: partner } : { p_code: code });
  return toPrice(rows[0], code);
}

// Min and max cn8 price under code (same basis and year as getPrice), or null.
export async function getPriceRange(code: string, partner?: string): Promise<PriceRange | null> {
  assertCode(code);
  const rows = await rpc<PriceRangeRow[]>(
    "price_range_for",
    partner ? { p_code: code, p_partner: partner } : { p_code: code },
  );
  return toPriceRange(rows[0]);
}

interface TariffOptions {
  origin?: string;
  includeGroups?: boolean;
  descendants?: boolean;
}

// Tariff rows as stored: rate_text untouched.
export async function getTariffs(
  code: string,
  { origin = "CN", includeGroups = false, descendants = false }: TariffOptions = {},
): Promise<TariffRow[]> {
  assertCode(code);
  return rpc<TariffRow[]>("tariffs_for", {
    p_code: code,
    p_origin: origin,
    p_include_groups: includeGroups,
    p_descendants: descendants,
  });
}

// Duty stats for an hs4 heading from tariffs_hs4, keyed by geo_group: { ERGA_OMNES: {...}, CHINA: {...} }.
// Each value is toRateStats() of the row; groups without a row are absent.
export async function getHs4TariffStats(
  hs4: string,
  groups: string[] = ["ERGA_OMNES", "CHINA"],
): Promise<Record<string, RateStats>> {
  assertCode(hs4);
  const rows = await select<RateStatsRow[]>(
    "getHs4TariffStats",
    `tariffs_hs4?select=geo_group,rate_avg,rate_min,rate_max,n_leaves,n_leaves_zero_filled&hs4=eq.${hs4}&geo_group=in.${inList(groups)}`,
  );
  const stats: Record<string, RateStats> = {};
  for (const row of rows) {
    const value = toRateStats(row);
    if (value && row.geo_group) stats[row.geo_group] = value;
  }
  return stats;
}
