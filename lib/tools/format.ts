import type { PriceBasis } from "./types.ts";

// "{city} port", { city: "Genoa" } -> "Genoa port"
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

export const eur = (n: number, decimals?: number): string =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: decimals ?? (Math.abs(n) < 100 ? 2 : 0),
    minimumFractionDigits: 0,
  }).format(n);

export const fmt = (n: number, digits = 0): string =>
  n.toLocaleString("en-GB", { maximumFractionDigits: digits });

// "1.234,5" "1,234.5" "€ 1234" -> 1234.5
export function parseNum(text: string | null | undefined): number | null {
  if (text == null) return null;
  let t = String(text).replace(/[^\d.,-]/g, "");
  if (t.includes(".") && t.includes(",")) {
    t = t.lastIndexOf(",") > t.lastIndexOf(".") ? t.replace(/\./g, "").replace(",", ".") : t.replace(/,/g, "");
  } else {
    t = t.replace(",", ".");
  }
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

// "1.7276" -> "1.73", "0.01234" -> "0.0123"
export const priceNum = (n: number): string =>
  n.toLocaleString(
    "en-GB",
    n < 1 ? { maximumSignificantDigits: 3 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );

export const basisLabel = (basis: PriceBasis): string => (basis === "unit" ? "unit" : "kg");

// "8806210000", 6  ->  "8806 21"
export function spaced(code: string, digits = 10): string {
  const s = code.slice(0, digits);
  return [s.slice(0, 4), s.slice(4, 6), s.slice(6, 8), s.slice(8, 10)].filter(Boolean).join(" ");
}

// Chapter names arrive in capitals: "AIRCRAFT, SPACECRAFT" -> "Aircraft, spacecraft"
export const sentence = (s: string): string => s.charAt(0) + s.slice(1).toLowerCase();
