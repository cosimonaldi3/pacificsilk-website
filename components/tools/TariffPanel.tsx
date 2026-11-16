"use client";

import { useEffect, useState } from "react";
import { getTariffs } from "@/lib/tools/api";
import { fill, spaced } from "@/lib/tools/format";
import type { TariffRow } from "@/lib/tools/types";
import { useToolsContent } from "./ToolsContent";

// Tariffs are shown for imports into the EU from China only.
const ORIGIN = "CN";
const ERGA_OMNES = "1011";
const FIRST = 25;

// The import holds some measures twice, identical apart from the row id.
const rowKey = (r: TariffRow): string => [r.goods_code, r.geo_code, r.measure, r.rate_text].join("|");

function prepare(rows: TariffRow[]): TariffRow[] {
  const seen = new Set<string>();
  const geoRank = (g: string | null): number => (g === ORIGIN ? 0 : g === ERGA_OMNES ? 1 : 2);
  return rows
    .filter((r) => {
      const key = rowKey(r);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(
      (a, b) =>
        geoRank(a.geo_code) - geoRank(b.geo_code) ||
        a.goods_prefix.length - b.goods_prefix.length ||
        a.goods_prefix.localeCompare(b.goods_prefix) ||
        a.measure.localeCompare(b.measure),
    );
}

interface TariffPanelProps {
  code: string;
  leaf: boolean | null;
}

interface PanelState {
  key: string | null;
  rows?: TariffRow[];
  error?: Error;
}

// Measures on code and its parents; on a non-leaf also those on every code below.
// rate_text is shown as stored. leaf is null until the drill-down knows.
export default function TariffPanel({ code, leaf }: TariffPanelProps) {
  const { tariff: c } = useToolsContent();
  const [state, setState] = useState<PanelState>({ key: null });
  const [all, setAll] = useState(false);
  const key = `${code}|${leaf}`;

  useEffect(() => {
    if (leaf == null) return;
    let stale = false;
    setAll(false);
    getTariffs(code, { origin: ORIGIN, descendants: !leaf }).then(
      (rows) => {
        if (!stale) setState({ key, rows: prepare(rows) });
      },
      (error: Error) => {
        if (!stale) setState({ key, error });
      },
    );
    return () => {
      stale = true;
    };
  }, [code, leaf]); // eslint-disable-line react-hooks/exhaustive-deps

  // an answer for another code is never shown with this one
  const { rows, error } = state.key === key ? state : ({} as PanelState);
  const loading = state.key !== key;
  const geoName = (g: string | null): string =>
    g === ORIGIN ? c.china : g === ERGA_OMNES ? c.allOrigins : fill(c.group, { code: g ?? "" });
  const where = (r: TariffRow): string | null =>
    r.goods_prefix === code
      ? null
      : r.goods_prefix.length < code.length
        ? fill(c.setAbove, { code: spaced(r.goods_prefix, r.goods_prefix.length) })
        : fill(c.onlyFor, { code: spaced(r.goods_prefix, r.goods_prefix.length) });

  return (
    <section className="tariff" aria-live="polite">
      <h3>{c.title}</h3>
      {loading || error || !rows ? (
        <p className="none">{loading || !error ? c.loading : fill(c.failed, { message: error.message })}</p>
      ) : !rows.length ? (
        <p className="none">{leaf ? c.noneLeaf : c.noneBranch}</p>
      ) : (
        <>
          <ul>
            {(all ? rows : rows.slice(0, FIRST)).map((r) => {
              const sub = [geoName(r.geo_code), where(r)].filter(Boolean).join(" · ");
              return (
                <li key={rowKey(r)}>
                  <span>{r.measure}</span>
                  <span className="rate">{r.rate_text}</span>
                  <span className="sub">{sub}</span>
                </li>
              );
            })}
          </ul>
          {!all && rows.length > FIRST && (
            <button className="more" type="button" onClick={() => setAll(true)}>
              {fill(c.showAll, { count: rows.length })}
            </button>
          )}
          <p className="scope">{leaf ? c.scopeLeaf : c.scopeBranch}</p>
        </>
      )}
    </section>
  );
}
