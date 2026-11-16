"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// flagcdn.com is added to next.config.ts remotePatterns
import type { CountryMarker, Office } from "@/lib/types";

const PAGE_SIZE = 10;

interface CountryCardProps {
  marker: CountryMarker;
  onClose: () => void;
  onOfficeClick: (office: Office) => void;
}

export default function CountryCard({ marker, onClose, onOfficeClick }: CountryCardProps) {
  const [page, setPage] = useState(0);
  const [imgError, setImgError] = useState(false);

  const totalPages = Math.ceil(marker.projects.length / PAGE_SIZE);
  const visibleProjects = marker.projects.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <div className="w-full bg-psc-bg border border-psc-border overflow-hidden">
      {/* Country header — photo or dark placeholder */}
      <div className="relative h-44 overflow-hidden">
        {marker.countryImage && !imgError ? (
          <Image
            src={marker.countryImage}
            alt={marker.country}
            fill
            className="object-cover"
            sizes="384px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-psc-ink flex items-center justify-center">
            {/* Flag emoji: renders as flag on Mac/Linux, as 2-letter text on Windows — both readable at this size */}
            <span className="text-6xl select-none">{marker.flagEmoji}</span>
          </div>
        )}

        {/* Dark scrim — ensures text legibility over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* Circular flag + country name — bottom-left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 inline-flex border border-white/30">
            <Image
              src={`https://flagcdn.com/w40/${marker.countryCode.toLowerCase()}.png`}
              alt=""
              width={40}
              height={30}
              className="object-cover w-full h-full"
            />
          </span>
          <span className="font-display text-h3 font-medium text-white leading-none">
            {marker.country}
          </span>
        </div>

        {/* Close button — top-right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close country card"
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-colors text-small leading-none"
        >
          ✕
        </button>
      </div>

      {/* Project pills */}
      <div className="p-3 flex flex-col gap-2">
        {visibleProjects.map((project) => (
          <Link
            key={project.id}
            href={`/capabilities/${project.slug}`}
            className="flex items-center justify-between gap-2 w-full text-left px-3 py-2 rounded-lg border border-psc-border font-sans text-small font-medium text-psc-ink hover:bg-psc-ink hover:text-psc-bg hover:border-psc-ink transition-colors duration-150 group"
          >
            <span>{project.name}</span>
            <span className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-150">→</span>
          </Link>
        ))}
      </div>

      {/* Pagination — only shown when > 10 projects */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 px-3 pb-3">
          <span className="font-sans text-small text-psc-gray">
            {page + 1} / {totalPages}
          </span>
          {page > 0 && (
            <button
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
              className="font-sans text-small text-psc-gray hover:text-psc-ink transition-colors"
            >
              ←
            </button>
          )}
          {page < totalPages - 1 && (
            <button
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
              className="font-sans text-small text-psc-gray hover:text-psc-ink transition-colors"
            >
              →
            </button>
          )}
        </div>
      )}

      {/* Office buttons — inverted colour scale, always visible below project list */}
      {marker.offices.length > 0 && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          <div className="h-px bg-psc-border mb-1" />
          {marker.offices.map((office) => (
            <button
              key={office.id}
              onClick={() => onOfficeClick(office)}
              className="flex items-center justify-between gap-2 w-full text-left px-3 py-2 rounded-lg bg-psc-ink text-psc-bg font-sans text-small font-medium hover:opacity-75 transition-opacity duration-150 group"
            >
              <span>{office.country} Office</span>
              <span className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity duration-150">→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
