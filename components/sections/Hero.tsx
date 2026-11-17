"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { useState, useRef, useEffect } from "react";

interface HeroProps {
  eyebrow: string;
  headline: string;
  subheadline: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /* Pin the video to the viewport so the page scrolls over it. The page must give
     the sections below `relative z-10` and an opaque background; any transparent
     section further down shows the video again. */
  fixedBackdrop?: boolean;
  /* Still image instead of the video, same framing and overlay */
  image?: { src: string; alt: string };
  /* Drop the small chevron when the page brings its own scroll cue */
  hideScrollHint?: boolean;
  /* Extra content under the text, over the background */
  children?: React.ReactNode;
}

export default function Hero({
  eyebrow,
  headline,
  subheadline,
  cta,
  secondaryCta,
  fixedBackdrop = false,
  image,
  hideScrollHint = false,
  children,
}: HeroProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!headlineRef.current) return;

    const rect = headlineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chars = headlineRef.current.querySelectorAll("[data-char-index]");
    let found = false;

    chars.forEach((char) => {
      const charRect = (char as HTMLElement).getBoundingClientRect();
      const charX = charRect.left - rect.left;
      const charY = charRect.top - rect.top;

      if (
        x >= charX &&
        x <= charX + charRect.width &&
        y >= charY &&
        y <= charY + charRect.height
      ) {
        const index = parseInt((char as HTMLElement).dataset.charIndex || "");
        setHoveredIndex(index);
        found = true;
      }
    });

    if (!found) {
      setHoveredIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const renderHeadline = () => {
    return headline.split("").map((char, index) => {
      if (char === "\n") {
        return <br key={index} />;
      }
      return (
        <span
          key={index}
          data-char-index={index}
          className={`inline transition-colors ${
            hoveredIndex === index ? "text-psc-red duration-150" : "text-psc-bg duration-300"
          }`}
          style={{
            transitionDelay: hoveredIndex === index ? "0ms" : "100ms",
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <section className={`relative h-[calc(100dvh-4rem)] flex items-center ${fixedBackdrop ? "" : "bg-psc-bg overflow-hidden"}`}>
      {/* Background: still image if given, otherwise the video */}
      {image ? (
        <div className={`${fixedBackdrop ? "fixed" : "absolute"} inset-0 w-full h-full`}>
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
        </div>
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`${fixedBackdrop ? "fixed" : "absolute"} inset-0 w-full h-full object-cover`}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          <source src="/videos/hero-bg.webm" type="video/webm" />
        </video>
      )}

      {/* Dark overlay for contrast */}
      <div className={`${fixedBackdrop ? "fixed" : "absolute"} inset-0 bg-black/40`} />

      {/* Content */}
      <Container className="relative z-10">
        {/* Eyebrow */}
        <div className="font-sans text-small font-medium text-psc-bg uppercase tracking-widest mb-6">
          {eyebrow}
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="font-display text-display leading-display font-medium mb-6 whitespace-pre-line"
        >
          {renderHeadline()}
        </h1>

        {/* Subheadline */}
        <p className="font-sans text-body leading-body text-psc-bg mb-10 max-w-xl">
          {subheadline}
        </p>

        {/* CTAs */}
        {(cta || secondaryCta) && (
          <div className="flex flex-wrap gap-3">
            {cta && (
              <Link
                href={cta.href}
                className="inline-block font-sans text-base font-medium px-8 py-4 bg-psc-red text-psc-bg hover:opacity-80 transition"
              >
                {cta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-block font-sans text-base font-medium px-8 py-4 border border-psc-bg/50 text-psc-bg hover:border-psc-bg hover:bg-psc-bg/10 transition"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
        {children}
      </Container>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        hidden={hideScrollHint}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-700 ${
          scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <svg
          className="scroll-hint-arrow w-6 h-6 text-psc-bg/50"
          style={{ animation: "scroll-hint 2.4s ease-in-out infinite" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
