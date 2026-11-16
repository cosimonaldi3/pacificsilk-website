"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getPrice, getPriceRange } from "@/lib/tools/api";
import { classify } from "@/lib/tools/estimate/classify";
import { lookupDuty } from "@/lib/tools/estimate/duty";
import { estimate } from "@/lib/tools/estimate/model";
import { defaultsFor } from "@/lib/tools/estimate/productDefaults";
import { fill } from "@/lib/tools/format";
import { DESTINATIONS, ORIGINS, destById, originById } from "@/lib/tools/places";
import { buildRoute } from "@/lib/tools/routes";
import type { ClassifyOption, DutyLookup, Price, PriceRange, Route, SweepInput } from "@/lib/tools/types";
import BreakEven from "./BreakEven";
import CostBreakdown from "./CostBreakdown";
import GoodsPrice from "./GoodsPrice";
import RouteCard from "./RouteCard";
import { ServicesBand } from "./Services";
import { useToolsContent } from "./ToolsContent";
import { toMarker } from "./globe/markers";

// The globe draws on a canvas from browser-only data, so it never renders on the
// server. The placeholder has the same .globe box, so nothing shifts when it loads.
const RouteGlobe = dynamic(() => import("./globe/RouteGlobe"), {
  ssr: false,
  loading: () => <div className="globe" />,
});

// Every shipment starts in Shanghai for now. The other origins stay in places.ts
// and the model handles any of them: list them in ORIGIN_CHOICES to bring the picker back.
const DEFAULT_ORIGIN_ID = "shanghai";
// Arrival used when none is picked. Not shown in the picker, so the user sees it only once the route is traced.
const DEFAULT_DEST_ID = "es";
const ORIGIN_CHOICES = ORIGINS.filter((o) => o.id === DEFAULT_ORIGIN_ID);
const ORIGIN_MARKERS = ORIGIN_CHOICES.map((o) => toMarker(o.id, o.city, o.coord));
const DEST_MARKERS = DESTINATIONS.map((d) => toMarker(d.id, `${d.country} · ${d.city}`, d.coord));
const AREAS = [...new Set(DESTINATIONS.map((d) => d.area))];

interface ClassifyState {
  status: "idle" | "loading" | "done";
  options: ClassifyOption[];
  index: number;
}

interface RouteRun {
  key: number;
  route: Route;
}

interface EstimatorProps {
  // The page that embeds the estimator already has an h1 when this is "h2"
  headingLevel?: "h1" | "h2";
}

export default function Estimator({ headingLevel: Heading = "h1" }: EstimatorProps) {
  const content = useToolsContent();
  const c = content.estimator;
  const [product, setProduct] = useState("");
  const [cls, setCls] = useState<ClassifyState>({ status: "idle", options: [], index: 0 });
  const [originId, setOriginId] = useState(DEFAULT_ORIGIN_ID);
  const [destId, setDestId] = useState("");
  const [qtyText, setQtyText] = useState("");
  const [unitPrice, setUnitPrice] = useState<number | null>(null); // null = the average price
  const [current, setCurrent] = useState<number | null>(null); // what the client pays today, per unit; null = not set
  const [dutyInfo, setDutyInfo] = useState<DutyLookup | null>(null);
  const [run, setRun] = useState<RouteRun | null>(null); // the animation on screen
  const [revealed, setRevealed] = useState(false);

  const origin = originById(originId);
  const chosenDest = destById(destId);
  const dest = chosenDest ?? destById(DEFAULT_DEST_ID);

  // product name -> HS heading candidates
  useEffect(() => {
    const q = product.trim();
    if (q.length < 2) {
      setCls({ status: "idle", options: [], index: 0 });
      return;
    }
    setCls((prev) => ({ ...prev, status: "loading" }));
    let stale = false;
    const t = setTimeout(() => {
      classify(q, content.classify.generic).then((options) => {
        if (!stale) setCls({ status: "done", options, index: 0 });
      });
    }, 350);
    return () => {
      stale = true;
      clearTimeout(t);
    };
  }, [product, content.classify.generic]);

  const picked = cls.status === "done" ? cls.options[cls.index] : null;
  const heading = picked?.heading ?? null;

  // average price of the heading, or of its nearest parent with data
  const [price, setPrice] = useState<Price | null>(null);
  const [range, setRange] = useState<PriceRange | null>(null);
  useEffect(() => {
    setPrice(null);
    setRange(null);
    if (!heading) return;
    let stale = false;
    getPrice(heading).then(
      (p) => {
        if (!stale) setPrice(p);
      },
      () => {
        /* typical figures stay */
      },
    );
    getPriceRange(heading).then(
      (r) => {
        if (!stale) setRange(r);
      },
      () => {
        /* the range is optional */
      },
    );
    return () => {
      stale = true;
    };
  }, [heading]);

  const defaults = useMemo(
    () => defaultsFor(heading, price, price && !price.isFallback ? range : null),
    [heading, price, range],
  );

  // a different product means a different price
  useEffect(() => {
    setUnitPrice(null);
    setCurrent(null);
  }, [heading, picked?.source]);

  useEffect(() => {
    if (!picked || !dest) {
      setDutyInfo(null);
      return;
    }
    let stale = false;
    setDutyInfo(null);
    lookupDuty(heading, dest, defaults.duty, content.duty).then((d) => {
      if (!stale) setDutyInfo(d);
    });
    return () => {
      stale = true;
    };
  }, [heading, destId]); // eslint-disable-line react-hooks/exhaustive-deps

  const qty = Math.max(1, Math.round(Number(qtyText) || defaults.qty));
  const values = {
    unitPrice: unitPrice ?? defaults.unitPrice,
    cbm: defaults.cbm,
    perContainer: defaults.perContainer,
    duty: dutyInfo?.duty.rate ?? defaults.duty,
    ad: dutyInfo?.ad?.rate ?? 0,
    vat: dest?.vat ?? 0,
  };

  const route = useMemo(() => (origin && dest ? buildRoute(origin, dest) : null), [origin, dest]);
  const result =
    route && dest && picked
      ? estimate(
          { ...values, qty, route, dest, dutyStats: dutyInfo?.duty ?? null, adStats: dutyInfo?.ad ?? null },
          content.model,
        )
      : null;

  // everything estimate() needs except quantity, for the break-even sweep
  const sweepInput = useMemo<SweepInput | null>(
    () =>
      route && dest
        ? {
            unitPrice: values.unitPrice,
            cbm: values.cbm,
            perContainer: values.perContainer,
            duty: values.duty,
            ad: values.ad,
            vat: values.vat,
            route,
            dest,
          }
        : null,
    [values.unitPrice, values.cbm, values.perContainer, values.duty, values.ad, values.vat, route, dest],
  );

  const ready = !!(picked && origin);
  const go = () => {
    if (!route) return;
    setRevealed(false);
    setRun({ key: Date.now(), route });
    // on narrow screens the globe sits above the form: bring it into view for the animation
    if (window.matchMedia("(max-width: 960px)").matches) {
      document.querySelector(".globe")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // once a route is on screen, changing either end redraws it
  useEffect(() => {
    if (run && route) go();
    else if (!route) setRun(null);
  }, [route]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPick = (kind: "origin" | "dest", id: string) => (kind === "origin" ? setOriginId(id) : setDestId(id));

  return (
    <div className="est">
      <header className="est-hero">
        <p className="eyebrow">{c.eyebrow}</p>
        <Heading className="tool-title">{c.headline}</Heading>
        <p className="lede">{c.lede}</p>
      </header>

      <div className="stage">
        <div className="stage-globe">
          <RouteGlobe
            origins={ORIGIN_MARKERS}
            destinations={DEST_MARKERS}
            originId={originId}
            destId={destId}
            destIsoN={chosenDest?.isoN}
            route={run ? { ...run.route, key: run.key } : null}
            onPick={onPick}
            onRouteDone={() => setRevealed(true)}
          />
          <div className="globe-legend">
            <span>
              <i className="lg-origin" /> {c.legendOrigin}
            </span>
            <span>
              <i className="lg-dest" /> {c.legendDest}
            </span>
            <span className="muted">{c.legendHint}</span>
          </div>
        </div>

        <div className="stage-panel">
          <form
            className="eform"
            onSubmit={(e) => {
              e.preventDefault();
              if (ready) go();
            }}
          >
            <div className="field">
              <label htmlFor="product">{c.productLabel}</label>
              <input
                id="product"
                className="input"
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder={c.productPlaceholder}
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
              {cls.status === "idle" && (
                <div className="chips">
                  {c.examples.map((x) => (
                    <button key={x} type="button" onClick={() => setProduct(x)}>
                      {x}
                    </button>
                  ))}
                </div>
              )}
              {cls.status === "loading" && <p className="field-note">{c.classifying}</p>}
              {cls.status === "done" && (
                <div className="hs">
                  <label className="sr-only" htmlFor="hs">
                    {c.classificationLabel}
                  </label>
                  <select
                    id="hs"
                    className="hs-select"
                    value={cls.index}
                    onChange={(e) => setCls((prev) => ({ ...prev, index: Number(e.target.value) }))}
                  >
                    {cls.options.map((o, i) => (
                      <option key={i} value={i}>
                        {o.heading ? fill(c.headingPrefix, { heading: o.heading }) : ""}
                        {o.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className={ORIGIN_CHOICES.length > 1 ? "field-row" : undefined}>
              {ORIGIN_CHOICES.length > 1 && (
                <div className="field">
                  <label htmlFor="origin">{c.originLabel}</label>
                  <select id="origin" className="input" value={originId} onChange={(e) => setOriginId(e.target.value)}>
                    <option value="">{c.originChoose}</option>
                    {ORIGIN_CHOICES.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="field">
                <label htmlFor="dest">{c.destLabel}</label>
                <select id="dest" className="input" value={destId} onChange={(e) => setDestId(e.target.value)}>
                  <option value="">{c.destChoose}</option>
                  {AREAS.map((a) => (
                    <optgroup key={a} label={a}>
                      {DESTINATIONS.filter((d) => d.area === a).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.country} · {d.city}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="qty">{c.quantityLabel}</label>
              <div className="input-unit">
                <input
                  id="qty"
                  className="input"
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder={String(defaults.qty)}
                  value={qtyText}
                  onChange={(e) => setQtyText(e.target.value)}
                />
                <span>{defaults.unit === "unit" ? c.unitsWord : defaults.unit === "kg" ? "kg" : `× ${defaults.unit}`}</span>
              </div>
            </div>

            <button className="cta" type="submit" disabled={!ready}>
              <span>{run ? c.traceAgain : c.trace}</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>

          {run && result && origin && dest && route && (
            <RouteCard origin={origin} dest={dest} route={route} result={result} revealed={revealed} />
          )}
        </div>
      </div>

      {run && result && revealed && (
        <>
          <div className="results-grid">
            <div className="results-col">
              <GoodsPrice
                price={values.unitPrice}
                avg={defaults.unitPrice}
                range={price && !price.isFallback ? range : null}
                qty={qty}
                unit={defaults.unit}
                edited={unitPrice !== null}
                onChange={setUnitPrice}
                onReset={() => setUnitPrice(null)}
              >
                {sweepInput && (
                  <BreakEven
                    input={sweepInput}
                    current={current ?? 0}
                    qty={qty}
                    unit={defaults.unit}
                    onCurrentChange={setCurrent}
                  />
                )}
              </GoodsPrice>
            </div>
            <div className="results-col">
              <CostBreakdown result={result} qty={qty} product={product.trim()} unit={defaults.unit} />
            </div>
          </div>
          <ServicesBand />
        </>
      )}
    </div>
  );
}
