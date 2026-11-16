"use client";

import type { CSSProperties } from "react";
import { eur, fill, fmt } from "@/lib/tools/format";
import type { EstimateResult } from "@/lib/tools/types";
import { ServiceLink } from "./Services";
import { useToolsContent } from "./ToolsContent";
import { useTweened } from "./useTweened";

interface CostBreakdownProps {
  result: EstimateResult;
  qty: number;
  product: string;
  unit: string;
}

export default function CostBreakdown({ result, qty, product, unit }: CostBreakdownProps) {
  const { breakdown: c } = useToolsContent();
  const total = useTweened(result.total);

  return (
    <section className="results" id="breakdown" aria-labelledby="breakdown-title">
      <p className="eyebrow">{c.eyebrow}</p>
      <div className="total-row">
        <h2 id="breakdown-title" className="total" aria-live="polite">
          {eur(total, 0)}
        </h2>
        <p className="total-meta">
          <strong>{eur(result.perUnit)}</strong> {fill(c.perUnit, { unit, qty: fmt(qty), product })}
        </p>
      </div>

      <div className="stack" role="img" aria-label={c.stackLabel}>
        {result.lines.map(
          (l) =>
            l.amount > 0 && (
              <span key={l.id} className={`sw-${l.id}`} style={{ flexGrow: l.amount }} title={`${l.label}: ${eur(l.amount)}`} />
            ),
        )}
      </div>

      <div className="ctable">
        {result.lines.map((l, i) => (
          <div className="crow" key={l.id} style={{ "--i": i } as CSSProperties}>
            <span className={`swatch sw-${l.id}`} aria-hidden="true" />
            <span className="crow-label">
              {l.label}
              {l.note && <span className="crow-note">{l.note}</span>}
            </span>
            <span className="crow-amt">{eur(l.amount)}</span>
          </div>
        ))}
        <div className="cgroup-total">
          <span>{c.total}</span>
          <span>{eur(result.total)}</span>
        </div>
      </div>

      <p className="svc-hints">
        <ServiceLink id="logistics">{c.hint}</ServiceLink>
      </p>

      <p className="caveat">{c.caveat}</p>
    </section>
  );
}
