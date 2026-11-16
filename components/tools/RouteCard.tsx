"use client";

import type { CSSProperties } from "react";
import { eur, fill, fmt } from "@/lib/tools/format";
import type { Destination, EstimateResult, LegKind, Origin, Route } from "@/lib/tools/types";
import { ServiceLink } from "./Services";
import { useToolsContent } from "./ToolsContent";

interface RouteCardProps {
  origin: Origin;
  dest: Destination;
  route: Route;
  result: EstimateResult;
  revealed: boolean;
}

interface LegRow {
  kind: LegKind;
  title: string;
  sub: string;
  meta: string;
}

export default function RouteCard({ origin, dest, route, result, revealed }: RouteCardProps) {
  const { route: c } = useToolsContent();
  const days = result.days;
  const legs: LegRow[] = [
    {
      kind: "cn",
      title: c.exportTitle,
      sub: c.exportSub,
      meta: fill(c.days, { days: days.cn }),
    },
    {
      kind: "sea",
      title: fill(c.seaTitle, { port: route.destPort.name }),
      sub: c.via[route.via],
      meta: fill(c.kmDays, { km: fmt(route.km.sea), days: days.sea }),
    },
    {
      kind: "dest",
      title: fill(c.truckTitle, { city: dest.city }),
      sub: fill(c.truckSub, { port: route.destPort.name }),
      meta: fill(c.kmDays, { km: fmt(route.km.dest), days: days.dest }),
    },
  ];
  return (
    <section className="route-card" aria-label={c.ariaLabel}>
      <header>
        <p className="route-eyebrow">{c.eyebrow}</p>
        <h2>
          {origin.city} <span aria-hidden="true">→</span>
          <span className="sr-only">{c.to}</span> {dest.country}
        </h2>
        <p className="route-sub">{fill(c.sub, { from: origin.city, to: dest.city, days: days.total })}</p>
      </header>
      <ol className="legs">
        {legs.map((l, i) => (
          <li key={l.kind} style={{ "--i": i } as CSSProperties}>
            <span className={`leg-dot leg-${l.kind}`} aria-hidden="true" />
            <span>
              <span className="leg-title">{l.title}</span>
              <span className="leg-sub">{l.sub}</span>
            </span>
            <span className="leg-meta">{l.meta}</span>
          </li>
        ))}
      </ol>
      <p className="route-services">
        <span>{c.servicesIntro}</span>
        <ServiceLink id="manufacturing">{c.qualityControl}</ServiceLink>
        <ServiceLink id="logistics">{c.logistics}</ServiceLink>
      </p>
      <a
        className={`route-total ${revealed ? "on" : ""}`}
        href="#breakdown"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("breakdown")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span>{c.total}</span>
        <strong>{revealed ? eur(result.total) : "…"}</strong>
        <span className="arrow" aria-hidden="true">
          ↓
        </span>
      </a>
    </section>
  );
}
