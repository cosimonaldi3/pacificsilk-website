"use client";

import { basisLabel, fill, priceNum, spaced } from "@/lib/tools/format";
import { useToolsContent } from "./ToolsContent";
import type { PriceState } from "./usePrice";

interface PriceBoxProps {
  code: string;
  state: PriceState;
}

export default function PriceBox({ code, state }: PriceBoxProps) {
  const { price: c } = useToolsContent();
  const { loading, error, price, range } = state;
  return (
    <section className="price" aria-live="polite">
      <h3>{c.title}</h3>
      {loading ? (
        <p className="none">{c.loading}</p>
      ) : error ? (
        <p className="none">{fill(c.failed, { message: error.message })}</p>
      ) : !price ? (
        <p className="none">{c.none}</p>
      ) : (
        <div className="figure">
          <span className="amount">{fill(c.amount, { price: priceNum(price.avgPrice), basis: basisLabel(price.basis) })}</span>
          <span className="sub">
            {fill(c.average, { year: price.year })}
            {" · "}
            {price.isFallback
              ? fill(c.fromParent, { level: price.level ?? "", code: spaced(price.code, price.code.length) })
              : fill(c.forCode, { level: price.level ?? "", code: spaced(code, code.length) })}
          </span>
          {range && (
            <span className="sub">
              {fill(c.range, {
                min: priceNum(range.minPrice),
                max: priceNum(range.maxPrice),
                basis: basisLabel(price.basis),
                count: range.count,
              })}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
