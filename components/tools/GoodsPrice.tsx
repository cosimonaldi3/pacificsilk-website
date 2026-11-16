"use client";

import type { ReactNode } from "react";
import { eur, fill, fmt } from "@/lib/tools/format";
import type { PriceRange } from "@/lib/tools/types";
import PriceSlider from "./PriceSlider";
import { ServiceLink } from "./Services";
import { useToolsContent } from "./ToolsContent";

interface GoodsPriceProps {
  price: number;
  avg: number;
  range: PriceRange | null;
  qty: number;
  unit: string;
  edited: boolean;
  onChange: (value: number) => void;
  onReset: () => void;
  children?: ReactNode;
}

export default function GoodsPrice({ price, avg, range, qty, unit, edited, onChange, onReset, children }: GoodsPriceProps) {
  const { goods: c } = useToolsContent();
  const lo = Math.max((range ? Math.min(range.minPrice, avg) : avg * 0.5) * 0.75, avg / 100, 0.01);
  const hi = Math.max(range ? range.maxPrice : avg * 1.5, avg, lo * 1.01);

  return (
    <section className="results goods" aria-labelledby="goods-title">
      <p className="eyebrow">{c.eyebrow}</p>
      <div className="goods-head">
        <h2 id="goods-title" className="goods-price">
          {eur(price, 2)} <span>/ {unit}</span>
        </h2>
        <p className="goods-sub">
          {fill(c.forQuantity, { amount: eur(price * qty, 0), qty: fmt(qty), unit: unit === "unit" ? c.units : unit })}
          {edited && (
            <button type="button" className="goods-reset" onClick={onReset}>
              {c.reset}
            </button>
          )}
        </p>
      </div>

      <PriceSlider
        value={price}
        min={lo}
        max={hi}
        onChange={onChange}
        marker={avg}
        markerLabel={fill(c.averageMarker, { price: eur(avg, 2) })}
        label={fill(c.sliderLabel, { unit })}
        valueText={eur(price, 2)}
        ends={[eur(lo, 2), range ? c.rangeEnd : c.typicalEnd, eur(hi, 2)]}
      />

      {children}

      <p className="svc-hints">
        <ServiceLink id="sourcing">{c.hintFactory}</ServiceLink>
        <ServiceLink id="sourcing">{c.hintNegotiate}</ServiceLink>
      </p>
    </section>
  );
}
