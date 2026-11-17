"use client";

import { useEffect, useState } from "react";

interface ScrollCueProps {
  label: string;
}

/* Pinned to the bottom of the viewport for the whole page: a bank of slow fog, and over it the
   word and an arrow pointing down. Clicking scrolls a screen at a time. The fog thins out near
   the end of the page, where the dark footer takes over. */
export default function ScrollCue({ label }: ScrollCueProps) {
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setAtEnd(window.scrollY + window.innerHeight >= doc.scrollHeight - 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollOnce = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 h-52 overflow-hidden transition-opacity duration-1000 ease-out ${
        atEnd ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Fog: a soft base, and two drifting banks */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-psc-bg via-psc-bg/55 to-transparent" />
      <div aria-hidden="true" className="scroll-fog scroll-fog-a" />
      <div aria-hidden="true" className="scroll-fog scroll-fog-b" />

      <button
        type="button"
        onClick={scrollOnce}
        tabIndex={atEnd ? -1 : 0}
        className={`group absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-full px-6 py-2 font-sans text-[12px] font-medium tracking-[0.32em] text-psc-ink uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
          atEnd ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        <span className="opacity-70 transition-opacity group-hover:opacity-100">{label}</span>
        <svg
          aria-hidden="true"
          className="scroll-cue-arrow h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v15M6 13l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
