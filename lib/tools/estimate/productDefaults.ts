import { densityFor } from "./density.ts";
import { unitsPerContainer } from "./containerLimits.ts";
import type { Price, PriceRange } from "../types.ts";

// Placeholder figures for the draft. Each entry: typical ex-works price in EUR,
// weight (kg) per unit, a typical order quantity and an approximate EU import
// duty (%). Volume is not listed: it always comes from weight and density.

interface HeadingDefaults {
  label: string;
  unitPrice: number;
  kg: number;
  qty: number;
  duty: number;
  unit: string;
}

export interface ProductDefaults extends HeadingDefaults {
  basis: string;
  cbm: number;
  perContainer: number | null;
  priceBasis: "default" | "unit" | "kg";
  priceSource: string;
}

type PriceInput = Pick<Price, "code" | "year" | "basis" | "avgPrice" | "isFallback"> &
  Partial<Pick<Price, "eurPerUnit" | "eurPerKg" | "kgPerUnit">>;

const H = (label: string, unitPrice: number, kg: number, qty: number, duty: number, unit = "unit"): HeadingDefaults => ({
  label,
  unitPrice,
  kg,
  qty,
  duty,
  unit,
});

export const HEADINGS: Record<string, HeadingDefaults> = {
  "3926": H("Other articles of plastics", 0.9, 0.06, 10000, 6.5),
  "6110": H("Jerseys, pullovers, sweatshirts and hoodies, knitted", 6.5, 0.55, 2000, 12),
  "7304": H("Seamless steel tubes and pipes", 48, 55, 400, 0, "6 m length"),
  "8806": H("Drones", 140, 1.6, 300, 0),
};

const GENERIC = H("Generic manufactured goods", 10, 0.5, 1000, 4);

const base = (heading: string | null): HeadingDefaults & { basis: string } => {
  if (heading && HEADINGS[heading]) return { ...HEADINGS[heading], basis: `typical for HS ${heading}` };
  return { ...GENERIC, basis: "generic assumption" };
};

const rangeNote = (r: PriceRange | null): string => {
  if (!r) return "";
  const n = (x: number): string =>
    x.toLocaleString(
      "en-GB",
      x < 1 ? { maximumSignificantDigits: 3 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    );
  return `; range € ${n(r.minPrice)} – € ${n(r.maxPrice)} across ${r.count} CN8 codes`;
};

// kg per unit from the trade data. It is only stored at cn8 level; above that
// the two stored prices give it: (€/unit) / (€/kg) = kg/unit. Null if neither.
const dataKgPerUnit = (price: PriceInput): number | null => {
  if (price.kgPerUnit != null && price.kgPerUnit > 0) return price.kgPerUnit;
  if (price.eurPerUnit != null && price.eurPerKg != null && price.eurPerUnit > 0 && price.eurPerKg > 0) {
    return price.eurPerUnit / price.eurPerKg;
  }
  return null;
};

// Prices come from getPrice() when it has one: per unit, or per kg (and then
// the order is counted in kg). Duty stays the typical figure above. Volume is
// weight / density: per unit from the trade data's weight (or the typical
// weight when it has none), per kg simply 1 / density.
// range (from getPriceRange) only adds its spread to the source line.
export function defaultsFor(
  heading: string | null,
  price: PriceInput | null,
  range: PriceRange | null = null,
): ProductDefaults {
  const d = base(heading);
  const density = densityFor(heading);
  const perContainer = unitsPerContainer(heading); // only meaningful when the order is counted in units
  if (!price) return { ...d, cbm: d.kg / density, perContainer, priceBasis: "default", priceSource: d.basis };
  const source = `HS ${price.code} trade data ${price.year}, € per ${price.basis}${price.isFallback ? " (parent level)" : ""}${rangeNote(range)}`;
  if (price.basis === "unit") {
    const kg = dataKgPerUnit(price) ?? d.kg;
    return { ...d, unitPrice: price.avgPrice, kg, cbm: kg / density, perContainer, priceBasis: "unit", priceSource: source };
  }
  return {
    ...d,
    unit: "kg",
    unitPrice: price.avgPrice,
    kg: 1,
    cbm: 1 / density,
    perContainer: null,
    qty: Math.round(d.qty * d.kg),
    priceBasis: "kg",
    priceSource: source,
  };
}
