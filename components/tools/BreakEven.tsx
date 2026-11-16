"use client";

import { useMemo } from "react";
import { eur, fill, fmt } from "@/lib/tools/format";
import { roundQty, sweep } from "@/lib/tools/estimate/breakeven";
import type { SweepInput } from "@/lib/tools/types";
import PriceSlider from "./PriceSlider";
import { useToolsContent } from "./ToolsContent";

interface BreakEvenProps {
  input: SweepInput;
  current: number;
  qty: number;
  unit: string;
  onCurrentChange: (value: number | null) => void;
}

// The client's current price on a slider under the China one, and from what
// quantity buying from China comes out cheaper. No chart: just the answer.
export default function BreakEven({ input, current, qty, unit, onCurrentChange }: BreakEvenProps) {
  const { breakEven: c } = useToolsContent();
  const unitLabel = unit === "unit" ? c.unit : unit;
  const vatName = input.dest.id === "us" ? c.salesTax : c.vat;
  const qtyLabel = (n: number): string =>
    unit === "unit"
      ? fill(c.qtyUnits, { qty: fmt(n) })
      : unit === "kg"
        ? fill(c.qtyKg, { qty: fmt(n) })
        : fill(c.qtyOther, { qty: fmt(n), unit });

  const { points, breakEven } = useMemo(
    () => sweep(input, current, { qty, inclVat: true }), // the client's price is what they pay: VAT included
    [input, current, qty],
  );
  const now = points.find((p) => p.qty === qty);
  const hasCurrent = current > 0;
  const lo = now ? Math.min(now.perUnit * 0.4, hasCurrent ? current : Infinity) : 0;
  const hi = now ? Math.max(now.perUnit * 2.5, hasCurrent ? current : 0) : 0;

  return (
    <div className="breakeven" aria-labelledby="be-title">
      <p className="eyebrow be-title" id="be-title">
        {c.title}
      </p>

      {now && (
        <div className="be-pay">
          <p className="be-pay-head">
            <span>{c.payToday}</span>
            <strong>
              {hasCurrent ? (
                <>
                  {eur(current, 2)} / {unitLabel}
                </>
              ) : (
                <span className="muted">{c.dragToCompare}</span>
              )}
            </strong>
            {hasCurrent && (
              <button type="button" className="goods-reset" onClick={() => onCurrentChange(null)}>
                {c.clear}
              </button>
            )}
          </p>
          <PriceSlider
            value={hasCurrent ? current : now.perUnit}
            min={lo}
            max={hi}
            onChange={onCurrentChange}
            marker={now.perUnit}
            markerLabel={fill(c.chinaMarker, { price: eur(now.perUnit, 2) })}
            label={fill(c.sliderLabel, { unit: unitLabel })}
            valueText={hasCurrent ? eur(current, 2) : c.notSet}
            ends={[eur(lo, 2), "", eur(hi, 2)]}
          />
        </div>
      )}

      <p className="be-headline" aria-live="polite">
        {!hasCurrent ? (
          c.prompt
        ) : breakEven === 1 ? (
          c.anyQuantity
        ) : breakEven ? (
          <>
            {c.cheaperFrom} <em>~{qtyLabel(roundQty(breakEven))}</em>.
          </>
        ) : (
          c.notCheaper
        )}
      </p>

      <p className="caveat">
        {fill(c.caveat, { vat: vatName })}
        {hasCurrent && fill(c.caveatEnter, { vat: vatName })}
      </p>
    </div>
  );
}
