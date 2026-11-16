"use client";

import { useState } from "react";
import Image from "next/image";
import type { Office } from "@/lib/types";

interface OfficeCardProps {
  office: Office;
  onClose: () => void;
}

export default function OfficeCard({ office, onClose }: OfficeCardProps) {
  const [imgError, setImgError] = useState(false);

  const showPhoto = !!office.officeImage && !imgError;

  return (
    <div className="w-full bg-psc-bg border border-psc-border overflow-hidden">
      {/* Office header — photo or solid black placeholder */}
      <div className="relative h-44 overflow-hidden">
        {showPhoto ? (
          <Image
            src={office.officeImage!}
            alt={office.name}
            fill
            className="object-cover"
            sizes="384px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-psc-ink" />
        )}

        {/* Scrim — only needed over photo */}
        {showPhoto && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        )}

        {/* Circular flag + office name — bottom-left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 inline-flex border border-white/30">
            <Image
              src={`https://flagcdn.com/w40/${office.countryCode.toLowerCase()}.png`}
              alt=""
              width={40}
              height={30}
              className="object-cover w-full h-full"
            />
          </span>
          <span className="font-display text-h3 font-medium text-white leading-none">
            {office.name}
          </span>
        </div>

        {/* Close button — top-right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close office card"
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-colors text-small leading-none"
        >
          ✕
        </button>
      </div>

      {/* City + country metadata */}
      <div className="px-4 pt-4 pb-1">
        <p className="font-sans text-xs font-medium text-psc-gray uppercase tracking-widest">
          {office.city}, {office.country}
        </p>
      </div>

      {/* Description */}
      <div className="px-4 pb-5">
        <p className="font-sans text-small text-psc-gray leading-relaxed">
          {office.description}
        </p>
      </div>
    </div>
  );
}
