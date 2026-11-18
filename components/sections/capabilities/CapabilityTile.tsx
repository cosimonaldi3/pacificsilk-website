"use client";

import { Link } from "@/i18n/navigation";
import { useId, useState } from "react";
import TileShell from "./TileShell";
import type { CapabilityTileBase } from "@/content/capabilities";
import { isHiddenHref } from "@/lib/features";

interface CapabilityTileProps {
  tile: CapabilityTileBase;
  expandLabel: string;
  closeLabel: string;
  className?: string;
  /* Where the warm red glow sits, as a CSS position ("85% 0%") */
  glowAt?: string;
  children: React.ReactNode;
}

/* One Stripe-style tile: headline, expand button, and a live mock visual.
   Expanding slides a dark panel over the visual with the copy and a link. */
export default function CapabilityTile({
  tile,
  expandLabel,
  closeLabel,
  className = "",
  glowAt = "85% 0%",
  children,
}: CapabilityTileProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <TileShell glowAt={glowAt} className={`min-h-[22rem] ${className}`}>
      <header className="relative z-20 flex items-start justify-between gap-6 p-6 md:p-8">
        <h3
          className={`font-display text-h3 leading-snug font-medium transition-colors duration-300 ${
            open ? "text-psc-bg" : "text-psc-ink"
          }`}
        >
          {tile.title}
        </h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? closeLabel : expandLabel}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
            open
              ? "bg-psc-bg/10 text-psc-bg hover:bg-psc-bg/20"
              : "bg-psc-muted text-psc-red hover:bg-psc-border"
          }`}
        >
          <svg
            viewBox="0 0 16 16"
            className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
        </button>
      </header>

      <div className="relative flex-1" aria-hidden={open}>
        {children}
      </div>

      <div
        id={panelId}
        hidden={!open}
        className="cap-panel absolute inset-0 z-10 flex flex-col justify-end bg-psc-ink p-6 pt-28 md:p-8"
      >
        <p className="font-sans text-body leading-body text-psc-bg/85 max-w-md">{tile.body}</p>
        {!isHiddenHref(tile.link.href) && (
          <Link
            href={tile.link.href}
            className="mt-6 inline-flex w-fit items-center gap-2 font-sans text-small font-medium text-psc-bg underline underline-offset-4 hover:text-psc-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
          >
            {tile.link.label}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </TileShell>
  );
}
