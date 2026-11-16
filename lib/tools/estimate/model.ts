// Landed-cost model. Pure functions: same input, same output, no I/O.
// All rates are placeholders for the draft and live in RATES so they are
// easy to replace with real quotes later.

import { toolsContent } from "../../../content/tools.ts";
import { fill } from "../format.ts";
import type { CostLine, DutyInfo, EstimateInput, EstimateResult, RouteKm, TransitDays } from "../types.ts";

export type ModelLabels = typeof toolsContent.model;

export const RATES = {
  // door-to-door cost of a 40' container: truck in China, sea, truck at destination
  container: { cbm: 67, cn: { perKm: 1.15, min: 220 }, sea: { base: 1250, perKm: 0.1 }, dest: { perKm: 1.6, min: 300 } },
  small: { cbm: 28, factor: 0.65 }, // a 20' container, priced against the 40'
  // groupage, charged per m³: sea and destination handling, plus a share of each truck
  lcl: { minCbm: 1, sea: { base: 30, perKm: 0.004 }, handling: 40, truckCbm: 33, truckMin: 60 },
  roundTo: 10, // transport is an estimate: no false precision
  insurance: { rate: 0.0035, uplift: 1.1, min: 35 },
};

export function transitDays(km: RouteKm): TransitDays {
  const cn = Math.ceil(km.cn / 500) + 2; // trucking plus export clearance
  const sea = Math.round(km.sea / 700) + 3; // about 16 knots, plus port time
  const dest = Math.ceil(km.dest / 600) + 2; // clearance plus trucking
  return { cn, sea, dest, total: cn + sea + dest };
}

/**
 * Door-to-door freight for a volume in m³, excluding paperwork.
 * As many full 40' containers as the volume fills; the remainder takes the
 * cheapest of groupage, a 20' (if it fits) or another 40'.
 * perContainer (with qty): the most units one 40' can take, for goods too bulky
 * or indivisible to pack to their volume. It can only raise the cost.
 */
export function freightCost(
  volume: number,
  km: RouteKm,
  { qty = 0, perContainer = null }: { qty?: number; perContainer?: number | null } = {},
): number {
  const { container: C, small: S, lcl: L } = RATES;
  const truckCn = Math.max(C.cn.min, km.cn * C.cn.perKm);
  const truckDest = Math.max(C.dest.min, km.dest * C.dest.perKm);
  const box40 = truckCn + C.sea.base + C.sea.perKm * km.sea + truckDest;
  const box20 = box40 * S.factor;

  const groupage = (v: number): number => {
    const cbm = Math.max(L.minCbm, v);
    const truckLeg = (truck: number): number => Math.max(L.truckMin, (truck * cbm) / L.truckCbm);
    return (L.sea.base + L.sea.perKm * km.sea + L.handling) * cbm + truckLeg(truckCn) + truckLeg(truckDest);
  };

  const full = Math.floor(volume / C.cbm);
  const rest = volume - full * C.cbm;
  const restCost = rest > 0 ? Math.min(groupage(rest), rest <= S.cbm ? box20 : Infinity, box40) : 0;
  const byVolume = full * box40 + restCost;
  if (perContainer == null || !(perContainer > 0) || !(qty > 0)) return byVolume;

  const boxes = Math.floor(qty / perContainer);
  const left = qty - boxes * perContainer;
  // the odd units are a share of one container: groupage for that share, a 20' if
  // they are at most half a container's units, or a whole 40'
  const leftCost =
    left === 0 ? 0 : Math.min(box40, left <= perContainer / 2 ? box20 : Infinity, groupage((left / perContainer) * C.cbm));
  const byUnits = boxes * box40 + leftCost;
  return Math.max(byVolume, byUnits);
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

// Bigger amounts are estimates too: above €1k round up to the hundred, above €100k to the thousand.
export function roundUpBig(n: number): number {
  if (n > 100000) return Math.ceil(n / 1000) * 1000;
  if (n > 1000) return Math.ceil(n / 100) * 100;
  return n;
}
const fmtPct = (n: number): string => `${+n.toFixed(2)}%`;

// "Average tariff 4.2% · range 0–12%"; just "4.2%" without stats or when every code has the same rate.
function rateNote(name: string, rate: number, stats: DutyInfo | null, labels: ModelLabels): string {
  if (!stats || stats.min == null || stats.max == null || stats.min === stats.max) return fmtPct(rate);
  return fill(labels.rateRange, {
    name,
    rate: fmtPct(rate),
    min: +stats.min.toFixed(2),
    max: fmtPct(stats.max),
  });
}

/**
 * input: { qty, unitPrice, cbm (per unit), perContainer (units per 40', or null), duty, ad, vat (percent), route (from buildRoute), dest }
 * optional: dutyStats, adStats ({ min, max, count } from lookupDuty) for the notes;
 * adStats.none marks a destination with no anti-dumping recorded, adStats null hides the line.
 */
export function estimate(
  { qty, unitPrice, cbm, perContainer = null, duty, ad, vat, route, dest, dutyStats = null, adStats = null }: EstimateInput,
  labels: ModelLabels = toolsContent.model,
): EstimateResult {
  const R = RATES;
  const km = route.km;

  const goods = r2(qty * unitPrice);

  const transport = roundUpBig(Math.round(freightCost(qty * cbm, km, { qty, perContainer }) / R.roundTo) * R.roundTo);

  const insurance = roundUpBig(r2(Math.max(R.insurance.min, R.insurance.rate * R.insurance.uplift * (goods + transport))));

  const customsValue = goods + transport + insurance;
  const dutyAmt = r2((customsValue * duty) / 100);
  const adAmt = r2((customsValue * ad) / 100);
  const vatAmt = r2(((customsValue + dutyAmt + adAmt) * vat) / 100);

  const lines: CostLine[] = [
    { id: "purchase", label: labels.goods, amount: goods },
    { id: "transport", label: labels.transport, amount: transport },
    { id: "insurance", label: labels.insurance, amount: insurance },
    { id: "duty", label: labels.tariffs, amount: dutyAmt, note: rateNote(labels.tariffWord, duty, dutyStats, labels) },
  ];
  if (adStats || ad) {
    lines.push({
      id: "antidumping",
      label: labels.antidumping,
      amount: adAmt,
      note: adStats?.none ? labels.noAntidumping : rateNote(labels.antidumpingWord, ad, adStats, labels),
    });
  }
  lines.push({
    id: "vat",
    label: dest.id === "us" ? labels.salesTax : labels.vat,
    amount: vatAmt,
    note: fill(labels.vatNote, { rate: fmtPct(vat) }),
  });
  const total = lines.reduce((s, l) => s + l.amount, 0);
  return {
    lines,
    total,
    perUnit: total / qty,
    vat: vatAmt,
    totalExVat: total - vatAmt,
    days: transitDays(km),
  };
}
