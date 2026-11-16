// Break-even against the client's current supplier. Pure functions built on
// estimate(): run the landed-cost model across many quantities and find the
// volume from which buying in China is cheaper per unit.

import { estimate } from "./model.ts";
import type { SweepInput } from "../types.ts";

export interface SweepPoint {
  qty: number;
  perUnit: number;
}

const perUnitAt = (input: SweepInput, qty: number, inclVat: boolean): SweepPoint => {
  const r = estimate({ ...input, qty });
  return { qty, perUnit: (inclVat ? r.total : r.totalExVat) / qty };
};

// For display: round a quantity up to 2 significant figures (337 -> 340, 1234 -> 1300).
// Up, so "cheaper from about N" never promises a lower quantity than the real break-even.
// Below 100 the quantity is shown as is.
export function roundQty(n: number): number {
  if (!(n > 100)) return n;
  const step = Math.pow(10, Math.floor(Math.log10(n)) - 1);
  return Math.ceil(n / step) * step;
}

function logSpace(max: number, n: number): number[] {
  const out = new Set([1]);
  for (let i = 1; i <= n; i++) out.add(Math.max(1, Math.round(Math.pow(max, i / n))));
  return [...out];
}

/**
 * input: everything estimate() takes except qty.
 * Returns { points, maxQty, breakEven } where breakEven is the smallest
 * quantity from which China stays at or below `current` per unit, or null.
 */
export function sweep(
  input: SweepInput,
  current: number,
  { qty, inclVat = false, points: n = 90 }: { qty: number; inclVat?: boolean; points?: number },
): { points: SweepPoint[]; maxQty: number; breakEven: number | null } {
  const maxQty = Math.max(5000, qty * 1000);
  const qs = [...new Set([...logSpace(maxQty, n), qty])].sort((a, b) => a - b);
  const points = qs.map((q) => perUnitAt(input, q, inclVat));

  // last quantity where China is still dearer; break-even sits just after it
  let last = -1;
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].perUnit > current) {
      last = i;
      break;
    }
  }
  let breakEven: number | null = null;
  if (last === -1) breakEven = 1;
  else if (last < points.length - 1) {
    let lo = points[last].qty;
    let hi = points[last + 1].qty; // lo loses, hi wins
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2);
      if (perUnitAt(input, mid, inclVat).perUnit > current) lo = mid;
      else hi = mid;
    }
    breakEven = hi;
  }
  return { points, maxQty, breakEven };
}
