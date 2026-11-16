"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  altPrefix?: string;
}

export default function ImageCarousel({
  images,
  altPrefix = "Project image",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden bg-psc-muted group">
      <Image
        key={images[index]}
        src={images[index]}
        alt={`${altPrefix} — photo ${index + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
      />

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-[13px] text-white/70 bg-black/30 px-3 py-1 pointer-events-none">
        {index + 1} / {images.length}
      </div>

      {/* Arrows — always visible, overlaid on the image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-psc-bg/80 hover:bg-psc-bg text-psc-ink transition-colors"
          >
            ←
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-psc-bg/80 hover:bg-psc-bg text-psc-ink transition-colors"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}
