"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import ProjectMap from "@/components/globe/ProjectMap";
import type { MapPlace } from "@/components/globe/ProjectMap";
import ChinaFoothold from "@/components/sections/about/ChinaFoothold";
import { presencePlaces } from "@/content/presence-places";
import type {
  ChinaFootholdContent,
  PresenceAction,
  PresenceContent,
  PresenceCountry,
  PresenceCountryId,
  PresenceNetwork,
} from "@/content/about";
import "./about.css";

interface PresenceProps {
  content: PresenceContent;
  chinaFoothold: ChinaFootholdContent;
}

/* The filter also holds "china", which shows the China panel instead of a country card */
type PresenceSelection = PresenceCountryId | "china";

const glow =
  "radial-gradient(circle at 85% 0%, color-mix(in srgb, var(--color-psc-red) 18%, transparent), color-mix(in srgb, var(--color-psc-muted) 60%, transparent) 45%, transparent 75%)";

/* Country chips + map. With nothing selected (the default) the card shows the network
   explanation. Clicking a country, China or its map dot opens that panel; clicking the
   active one again returns to the network explanation. The card's "+" (top) and the
   "Discover our services" link (bottom) open that country's own page. */
export default function Presence({ content, chinaFoothold }: PresenceProps) {
  /* null = network view */
  const [selected, setSelected] = useState<PresenceSelection | null>(null);

  const toggle = (id: PresenceSelection) =>
    setSelected((prev) => (prev === id ? null : id));

  const showChina = selected === "china";
  const country: PresenceCountry | undefined =
    selected && selected !== "china" ? content.countries.find((c) => c.id === selected) : undefined;
  const hasServices = !!country?.services?.length && !!country?.name;
  const activePlaceId = country?.id ?? (showChina ? "china" : null);

  const places = useMemo<MapPlace[]>(
    () => [
      ...content.countries.flatMap((c) => {
        if (!c.name) return [];
        const p = presencePlaces[c.id];
        return [{ id: c.id, lat: p.lat, lng: p.lng }];
      }),
      /* China: black dot at Shanghai, opens the China panel */
      { id: "china", lat: 31.23, lng: 121.47, tone: "ink" as const },
    ],
    [content.countries]
  );

  return (
    <section id="presence" className="scroll-mt-24 bg-psc-bg py-16 md:py-20">
      <Container>
        <div className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
          {content.label}
        </div>
        <h2 className="font-display text-h2 font-medium text-psc-ink">{content.headline}</h2>

        <div role="group" aria-label={content.chipsLabel} className="mt-8 flex flex-wrap gap-2">
          {content.countries.map((c) => {
            const active = c.id === selected;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(c.id)}
                className={`rounded-full border px-4 py-2 font-sans text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
                  active
                    ? "border-psc-red bg-psc-red text-psc-bg"
                    : "border-psc-border bg-psc-bg text-psc-ink hover:border-psc-ink"
                }`}
              >
                {c.chip}
              </button>
            );
          })}
          {/* China: black with white letters so it stands out from the country chips */}
          <button
            type="button"
            aria-pressed={showChina}
            onClick={() => toggle("china")}
            className={`rounded-full border border-psc-ink bg-psc-ink px-4 py-2 font-sans text-small font-medium text-psc-bg transition-colors hover:border-psc-red hover:bg-psc-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
              showChina ? "outline outline-2 outline-offset-2 outline-psc-red" : ""
            }`}
          >
            {content.chinaChip}
          </button>
        </div>

        {showChina ? (
          <div className="mt-8">
            <ChinaFoothold content={chinaFoothold} />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[5fr_7fr]">
            {/* All the cards share one grid cell, so the cell is as tall as the tallest card
                (China, with its extra button) and switching views never moves the page.
                The invisible copies only set the height; they are inert and hidden from
                assistive tech. */}
            <div className="grid">
              {content.countries.map((c) => (
                <div
                  key={c.id}
                  aria-hidden="true"
                  inert
                  className="invisible col-start-1 row-start-1 flex min-h-[18rem] flex-col rounded-2xl border border-transparent p-6 md:p-8"
                >
                  <CardBody country={c} content={content} />
                </div>
              ))}
              <div
                aria-hidden="true"
                inert
                className="invisible col-start-1 row-start-1 flex min-h-[18rem] flex-col rounded-2xl border border-transparent p-6 md:p-8"
              >
                <NetworkBody network={content.network} />
              </div>
              <article
                aria-live="polite"
                className="relative col-start-1 row-start-1 flex flex-col overflow-hidden rounded-2xl border border-psc-border bg-psc-bg p-6 md:p-8"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={{ background: glow }} />
                {hasServices && country && (
                  <Link
                    href={`/about/${country.id}`}
                    aria-label={content.expandLabel}
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-psc-ink font-sans text-lg leading-none text-psc-ink transition-colors hover:bg-psc-ink hover:text-psc-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
                  >
                    <span aria-hidden="true">+</span>
                  </Link>
                )}
                <div key={selected ?? "network"} className="ab-fade relative flex flex-1 flex-col">
                  {country ? (
                    <CardBody country={country} content={content} link />
                  ) : (
                    <NetworkBody network={content.network} />
                  )}
                </div>
              </article>
            </div>

            <div
              role="img"
              aria-label={content.globeLabel}
              className="flex items-center overflow-x-auto rounded-2xl border border-psc-border bg-psc-muted/40 p-4"
            >
              <ProjectMap
                className="min-w-[480px] md:min-w-0"
                places={places}
                activePlaceId={activePlaceId}
                onPlaceClick={(id) => toggle(id as PresenceSelection)}
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

interface NetworkBodyProps {
  network: PresenceNetwork;
}

/* Network explanation shown when no country is selected */
function NetworkBody({ network }: NetworkBodyProps) {
  return (
    <>
      <h3 className="pr-12 font-display text-h3 font-medium text-psc-ink">{network.title}</h3>
      <p className="mt-4 max-w-md font-sans text-body leading-body text-psc-gray">{network.body}</p>
      <Actions actions={network.actions} className="mt-auto min-h-[7.25rem] items-end pt-8" />
    </>
  );
}

interface CardBodyProps {
  country: PresenceCountry;
  content: PresenceContent;
  /* Leave out for the invisible height-setting copies, which render a plain text link */
  link?: boolean;
}

/* Title, text, actions and the services link of one country card */
function CardBody({ country, content, link }: CardBodyProps) {
  const hasServices = !!country.services?.length && !!country.name;
  const linkText = content.servicesLink.replace("{country}", country.name ?? "");
  const linkClass =
    "mt-6 inline-flex items-center gap-2 self-start border-b border-psc-ink pb-0.5 font-sans text-small font-medium text-psc-ink";
  return (
    <>
      <h3 className="pr-12 font-display text-h3 font-medium text-psc-ink">{country.title}</h3>
      <p className="mt-4 max-w-md font-sans text-body leading-body text-psc-gray">{country.teaser ?? country.body}</p>
      {country.insights && country.insights.length > 0 && (
        <ul className="mt-6 flex flex-col gap-3">
          {country.insights.map((line) => (
            <li key={line} className="border-t border-psc-border pt-3 font-sans text-small leading-body text-psc-ink">
              {line}
            </li>
          ))}
        </ul>
      )}
      <Actions actions={country.actions} className="mt-auto min-h-[7.25rem] items-end pt-8" />
      {hasServices &&
        (link ? (
          <Link
            href={`/about/${country.id}`}
            className={`${linkClass} transition-colors hover:border-psc-red hover:text-psc-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-psc-red`}
          >
            {linkText}
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span className={linkClass}>
            {linkText}
            <span aria-hidden="true">→</span>
          </span>
        ))}
    </>
  );
}

interface ActionsProps {
  actions: PresenceAction[];
  className?: string;
}

function Actions({ actions, className = "" }: ActionsProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {actions.map((a) => {
        const cls = `inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
          a.href === "/start"
            ? "bg-psc-ink text-psc-bg hover:bg-psc-red"
            : "border border-psc-ink text-psc-ink hover:border-psc-red hover:text-psc-red"
        }`;
        const inner = (
          <>
            {a.label}
            <span aria-hidden="true">→</span>
          </>
        );
        /* mailto links bypass the locale-aware Link */
        return a.href.startsWith("mailto:") ? (
          <a key={a.label} href={a.href} className={cls}>
            {inner}
          </a>
        ) : (
          <Link key={a.label} href={a.href} locale={a.locale} className={cls}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
