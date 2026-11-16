"use client";

import { basisLabel, eur, fill, fmt, parseNum, priceNum } from "@/lib/tools/format";
import type { Price } from "@/lib/tools/types";
import { useToolsContent } from "./ToolsContent";

export interface QuantityInput {
  text: string;
  kg: boolean;
}

interface ImportEstimateProps {
  price: Price;
  input: QuantityInput;
  onInput: (input: QuantityInput) => void;
}

// Quantity × average price. Duties are not computed: tariffs are text for now.
// input = what was typed and whether it is in kg; the parent keeps it so it
// survives the drill-down.
export default function ImportEstimate({ price, input, onInput }: ImportEstimateProps) {
  const { importEstimate: c } = useToolsContent();
  const { text: qtyText, kg: enterKg } = input;
  const setQtyText = (text: string) => onInput({ ...input, text });
  const setEnterKg = (kg: boolean) => onInput({ ...input, kg });

  const unit = basisLabel(price.basis);
  const kgPerUnit = price.kgPerUnit ?? 0;
  const canUseKg = price.basis === "unit" && kgPerUnit > 0;
  const inKg = canUseKg && enterKg;
  const unitWord = unit === "unit" ? c.units : c.kg;

  const entered = parseNum(qtyText);
  const qty = entered == null || entered < 0 ? null : inKg ? entered / kgPerUnit : entered;
  const value = qty == null ? null : qty * price.avgPrice;

  return (
    <section className="estimate">
      <h3>{c.title}</h3>
      <div className="qty">
        <label htmlFor="est-qty">{c.quantity}</label>
        <div className="qty-row">
          <input
            id="est-qty"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={inKg ? c.kg : unitWord}
            value={qtyText}
            onChange={(e) => setQtyText(e.target.value)}
          />
          {canUseKg ? (
            <div className="seg" role="group" aria-label={c.quantityIn}>
              <button type="button" aria-pressed={!inKg} onClick={() => setEnterKg(false)}>
                {c.units}
              </button>
              <button type="button" aria-pressed={inKg} onClick={() => setEnterKg(true)}>
                {c.kg}
              </button>
            </div>
          ) : (
            <span className="unit">{unitWord}</span>
          )}
        </div>
        {inKg && qty != null && entered != null && (
          <p className="note">
            {fill(c.conversion, { entered: fmt(entered, 2), perUnit: fmt(kgPerUnit, 3), qty: fmt(qty, 1) })}
          </p>
        )}
      </div>
      <ul>
        <li>
          <span>{c.value}</span>
          <span className="amount">{value == null ? "—" : eur(value)}</span>
          {qty != null && (
            <span className="sub">{fill(c.calc, { qty: fmt(qty, 2), unitWord, price: priceNum(price.avgPrice), unit })}</span>
          )}
        </li>
        <li className="soon">
          <span>{c.duties}</span>
          <span className="amount">{c.comingSoon}</span>
          <span className="sub">{c.dutiesNote}</span>
        </li>
      </ul>
    </section>
  );
}
