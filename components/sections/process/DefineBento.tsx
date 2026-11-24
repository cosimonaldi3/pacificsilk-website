"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { processLearnMore } from "@/content/blogLinks";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import TileShell from "@/components/sections/capabilities/TileShell";
import DefineTile from "./DefineTile";
import PlusIcon from "./PlusIcon";
import { scrollToCenter } from "./scrollToCenter";
import type { DefineTileCopy } from "@/content/process";
import { isHiddenHref } from "@/lib/features";

export interface DefineBentoTile {
  key: string;
  copy: DefineTileCopy;
  /* Where the warm red glow sits, as a CSS position ("85% 0%") */
  glowAt: string;
  /* Grid span classes for the closed tile */
  className?: string;
  /* The live visual at tile size, and again at the larger overlay size */
  visual: React.ReactNode;
  visualLarge: React.ReactNode;
  /* "ink" sets the tile, and its opened card, in the near-black tone with cream type */
  tone?: "ink";
}

interface DefineBentoProps {
  /* Fixed id prefix for the overlay ("define", "validate"). Not useId: the generated ids
     differed between the server and the browser render and broke hydration. */
  idBase: string;
  tiles: DefineBentoTile[];
  expandLabel: string;
  closeLabel: string;
  /* For a grid taller than a screen (Validate, Execute): the opened card sits at the top of the grid
     at one fixed height (never taller than the screen) instead of filling it, the same for every tile,
     and scrolls inside if its content is longer. The other tiles stay faintly visible below it.
     Clicking them closes the card. */
  tall?: boolean;
}

/* Matches the clip-path transition on .pd-overlay in process.css */
const GROW_MS = 520;
const FULL = "inset(0px 0px 0px 0px round 1rem)";
/* Close-on-scroll: how long after wheel/touch/key input a scroll counts as the reader's, and how far it may drift */
const INTENT_MS = 600;
/* After opening, wheel input is ignored this long (the camera is still scrolling, trackpad momentum may linger) */
const OPEN_GRACE_MS = 1200;
const SCROLL_CLOSE_PX = 24;
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

type Phase = "closed" | "from" | "open" | "closing";

/* The Define bento. Clicking a tile's "+" grows a cream overlay out of that tile until it
   covers the whole grid (a clip-path from the tile's rectangle to the full grid), with the
   visual enlarged on one side and the full explanation next to it. Closing shrinks it back. */
export default function DefineBento({ idBase, tiles, expandLabel, closeLabel, tall = false }: DefineBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tileRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelId = `${idBase}-panel`;
  const titleId = `${idBase}-title`;
  const tBlog = useTranslations("blog");

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("closed");
  const [from, setFrom] = useState(FULL);

  /* The tile's rectangle inside the grid, as a clip-path inset */
  const insetOf = useCallback((key: string) => {
    const grid = gridRef.current?.getBoundingClientRect();
    const tile = tileRefs.current[key]?.getBoundingClientRect();
    if (!grid || !tile) return FULL;
    const t = tile.top - grid.top;
    const r = grid.right - tile.right;
    const b = grid.bottom - tile.bottom;
    const l = tile.left - grid.left;
    return `inset(${t}px ${r}px ${b}px ${l}px round 1rem)`;
  }, []);

  const open = (key: string) => {
    setFrom(insetOf(key));
    setOpenKey(key);
    setPhase("from");
  };

  const close = useCallback(() => {
    if (!openKey || phase === "closing") return;
    setFrom(insetOf(openKey));
    setPhase("closing");
  }, [openKey, phase, insetOf]);

  /* Paint the overlay at the tile's rectangle first, then let it grow to the full grid */
  useLayoutEffect(() => {
    if (phase !== "from") return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setPhase("open")));
    return () => cancelAnimationFrame(id);
  }, [phase]);

  /* Centre the camera on the opened card as soon as it is mounted (it covers the grid, so this
     centres the box the "+" was pressed on). Runs on "from", before the grow starts. */
  useEffect(() => {
    if (phase !== "from") return;
    const card = overlayRef.current?.firstElementChild;
    if (!card) return;
    const r = card.getBoundingClientRect();
    scrollToCenter(r.top, r.height);
  }, [phase]);

  /* Move focus into the overlay once it is open */
  useEffect(() => {
    if (phase !== "open") return;
    closeRef.current?.focus({ preventScroll: true });
  }, [phase]);

  /* After the shrink, unmount the overlay */
  const returnTo = useRef<string | null>(null);
  useEffect(() => {
    if (phase !== "closing" || !openKey) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    returnTo.current = openKey;
    const t = setTimeout(() => {
      setOpenKey(null);
      setPhase("closed");
    }, still ? 0 : GROW_MS);
    return () => clearTimeout(t);
  }, [phase, openKey]);

  /* Return focus to the tile's "+" once the grid is no longer inert */
  useEffect(() => {
    if (openKey !== null || !returnTo.current) return;
    buttonRefs.current[returnTo.current]?.focus({ preventScroll: true });
    returnTo.current = null;
  }, [openKey]);

  /* Escape or a click outside the overlay's card closes it. The card is overlayRef's first
     child: in tall mode the rest of the overlay is see-through, over the faded tiles. */
  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointer = (e: PointerEvent) => {
      const card = overlayRef.current?.firstElementChild;
      if (card && !card.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openKey, close]);

  /* Scrolling the page closes the card. Only scrolling the reader does counts: the camera's own smooth
     scroll to centre the card on open fires scroll events too, but no wheel, touch or key input. Such
     input marks the page as reader-driven for a moment; a scroll of more than a few pixels in that window
     closes the card. A wheel turn inside the card's own overflow moves the card, not the page, so it does not. */
  useEffect(() => {
    if (phase !== "open") return;
    let intentUntil = 0;
    let startY = window.scrollY;
    const openedAt = performance.now();
    const intent = () => {
      const now = performance.now();
      /* Trackpad momentum from before the click, and the camera's own scroll, both land here */
      if (now - openedAt < OPEN_GRACE_MS) return;
      if (now > intentUntil) startY = window.scrollY;
      intentUntil = now + INTENT_MS;
    };
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) intent();
    };
    const onScroll = () => {
      if (performance.now() < intentUntil && Math.abs(window.scrollY - startY) > SCROLL_CLOSE_PX) close();
    };
    window.addEventListener("wheel", intent, { passive: true });
    window.addEventListener("touchmove", intent, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", intent);
      window.removeEventListener("touchmove", intent);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [phase, close]);

  const active = tiles.find((t) => t.key === openKey);
  const grown = phase === "open";
  const ink = active?.tone === "ink";
  const v = (i: number) => ({ "--i": i }) as React.CSSProperties;
  // Blog post that explains the open tile in more depth, if one is linked (content/blogLinks.ts)
  const learnMoreSlug = active ? processLearnMore[`${idBase}:${active.key}`] : undefined;

  return (
    <div ref={gridRef} className={`relative ${tall && openKey ? "lg:min-h-[min(46rem,calc(100svh-8rem))]" : ""}`}>
      <div
        inert={openKey !== null}
        className={`pd-dim grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(18rem,auto)] lg:gap-5 ${
          grown ? (tall ? "pd-dim-soft" : "pd-dim-on") : ""
        }`}
      >
        {tiles.map((t) => (
          <div key={t.key} ref={(el) => { tileRefs.current[t.key] = el; }} className={`flex ${t.className ?? ""}`}>
            <DefineTile
              title={t.copy.title}
              expandLabel={expandLabel}
              panelId={panelId}
              open={openKey === t.key}
              glowAt={t.glowAt}
              className="w-full"
              tone={t.tone ?? "cream"}
              buttonRef={(el) => { buttonRefs.current[t.key] = el; }}
              onOpen={() => open(t.key)}
            >
              {t.visual}
            </DefineTile>
          </div>
        ))}
      </div>

      {active && (
        <div
          ref={overlayRef}
          id={panelId}
          role="region"
          aria-labelledby={titleId}
          className={`pd-overlay absolute inset-0 z-20 flex ${tall ? "pointer-events-none items-start" : ""}`}
          style={{ clipPath: grown ? FULL : from }}
        >
          <TileShell glowAt={active.glowAt} tone={active.tone ?? "cream"} className={`pointer-events-auto w-full ${tall ? "lg:h-[min(46rem,calc(100svh-8rem))]" : ""}`}>
            <div className={`relative flex h-full flex-col overflow-y-auto lg:flex-row ${grown ? "pd-overlay-in" : ""}`}>
              {/* Visual side: the tile's mock UI, larger */}
              <div className="pd-overlay-visual flex items-center justify-center px-4 pt-20 pb-6 md:px-8 lg:w-[58%] lg:py-10">
                <div className="w-full">{active.visualLarge}</div>
              </div>

              {/* Text side: the full explanation */}
              <div className={`flex flex-col justify-center px-6 pb-8 md:px-10 lg:w-[42%] lg:border-l lg:py-10 lg:pr-20 ${ink ? "border-psc-bg/20" : "border-psc-border"}`}>
                <h3 id={titleId} style={v(0)} className={`pd-rise font-display text-h2 leading-tight font-medium ${ink ? "text-psc-bg" : "text-psc-ink"}`}>
                  {active.copy.title}
                </h3>
                <p style={v(1)} className={`pd-rise mt-5 font-sans text-lg leading-body md:text-xl ${ink ? "text-psc-bg" : "text-psc-ink"}`}>
                  {active.copy.body}
                </p>
                <ul className="mt-6 space-y-3">
                  {active.copy.points.map((p, i) => (
                    <li key={p} style={v(i + 2)} className={`pd-rise flex items-start gap-3 font-sans text-body leading-body ${ink ? "text-psc-bg/75" : "text-psc-gray"}`}>
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-psc-red text-psc-bg">
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3.5 8.5l3 3 6-7" />
                        </svg>
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                  {!isHiddenHref(active.copy.link.href) && (
                    <Link
                      href={active.copy.link.href}
                      style={v(active.copy.points.length + 2)}
                      className={`pd-rise inline-flex w-fit items-center gap-2 font-sans text-small font-medium underline underline-offset-4 hover:text-psc-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${ink ? "text-psc-bg" : "text-psc-ink"}`}
                    >
                      {active.copy.link.label}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                  {learnMoreSlug && (
                    <Link
                      href={`/blog/${learnMoreSlug}`}
                      style={v(active.copy.points.length + 3)}
                      className={`pd-rise inline-flex w-fit items-center gap-2 font-sans text-small font-medium underline underline-offset-4 hover:text-psc-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${ink ? "text-psc-bg/75" : "text-psc-gray"}`}
                    >
                      {tBlog("learnMore")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={closeLabel}
              aria-expanded={true}
              className={`absolute top-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red md:top-8 md:right-8 ${
                ink ? "bg-psc-bg/10 text-psc-bg hover:bg-psc-bg/20" : "bg-psc-muted text-psc-red hover:bg-psc-border"
              }`}
            >
              <PlusIcon className={grown ? "rotate-45" : ""} />
            </button>
          </TileShell>
        </div>
      )}
    </div>
  );
}
