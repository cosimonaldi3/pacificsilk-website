"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Container from "@/components/ui/Container";
import type {
  CarouselItem,
  CarouselTestimonial,
  CarouselReflection,
} from "@/content/about";

interface TestimonialCarouselProps {
  sectionLabel: string;
  items: CarouselItem[];
}

function TestimonialSlide({
  item,
  isActive,
}: {
  item: CarouselTestimonial;
  isActive: boolean;
}) {
  return (
    <article
      aria-hidden={!isActive}
      aria-current={isActive ? true : undefined}
      className="flex-shrink-0 w-[calc(100vw-3rem)] md:w-[min(85vw,900px)] rounded-xl overflow-hidden flex flex-col md:flex-row bg-psc-bg"
      style={{ minHeight: "480px" }}
    >
      {/* Photo */}
      <div className="relative w-full md:w-1/2 min-h-[260px] md:min-h-0 overflow-hidden">
        <Image
          src={item.photo}
          alt={item.name}
          fill
          className="object-cover"
          style={{
            objectPosition: "center 15%",
            filter: "grayscale(100%) brightness(0.88) contrast(1.05)",
          }}
          sizes="(max-width: 768px) 100vw, 450px"
        />
      </div>
      {/* Text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-10 md:py-14">
        <p className="font-sans text-small font-medium text-psc-red uppercase tracking-widest mb-5">
          {item.label}
        </p>
        <blockquote className="font-display font-medium text-psc-ink leading-snug mb-8" style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.625rem)" }}>
          &ldquo;{item.quote}&rdquo;
        </blockquote>
        <div className="w-8 h-px bg-psc-border mb-5" />
        <p className="font-display text-h3 font-medium text-psc-ink">
          {item.name}
        </p>
        <p className="font-sans text-small text-psc-gray mt-1">{item.title}</p>
      </div>
    </article>
  );
}

function ReflectionSlide({
  item,
  isActive,
}: {
  item: CarouselReflection;
  isActive: boolean;
}) {
  return (
    <article
      aria-hidden={!isActive}
      aria-current={isActive ? true : undefined}
      className="flex-shrink-0 w-[calc(100vw-3rem)] md:w-[min(85vw,900px)] rounded-xl bg-psc-ink flex items-center justify-center px-10 md:px-20 py-14 md:py-20"
      style={{ minHeight: "480px" }}
    >
      <div className="max-w-xl text-center">
        <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-8">
          {item.label}
        </p>
        <blockquote className="font-display font-medium text-psc-bg leading-snug" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
          &ldquo;{item.quote}&rdquo;
        </blockquote>
      </div>
    </article>
  );
}

export default function TestimonialCarousel({
  sectionLabel,
  items,
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const advance = useCallback(
    () => setCurrent((c) => (c + 1) % items.length),
    [items.length]
  );

  // Auto-advance every 4 seconds; reset when user manually navigates
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(advance, 4000);
    return () => clearInterval(id);
  }, [advance, reducedMotion, resetKey]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length);
    setResetKey((k) => k + 1);
  }, [items.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
    setResetKey((k) => k + 1);
  }, [items.length]);

  return (
    <section
      className="bg-psc-muted py-24"
      role="region"
      aria-label={sectionLabel}
    >
      {/* Header */}
      <Container>
        <div className="flex items-center justify-between">
          <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest">
            {sectionLabel}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full border border-psc-border flex items-center justify-center text-psc-ink hover:border-psc-ink transition-colors duration-150"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="10 12 6 8 10 4" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full border border-psc-border flex items-center justify-center text-psc-ink hover:border-psc-ink transition-colors duration-150"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 4 10 8 6 12" />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Track — intentionally breaks out of Container for peek effect */}
      <div className="overflow-hidden mt-10 pl-6 md:pl-8 lg:pl-12">
        <div
          className="flex gap-4 md:gap-6"
          style={{
            transform: `translateX(calc(-${current} * (min(85vw, 900px) + 1.5rem)))`,
            transition: reducedMotion
              ? "none"
              : "transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
          }}
          tabIndex={0}
          role="group"
          aria-label="Carousel slides"
        >
          {items.map((item, i) =>
            item.kind === "testimonial" ? (
              <TestimonialSlide key={item.id} item={item} isActive={i === current} />
            ) : (
              <ReflectionSlide key={item.id} item={item} isActive={i === current} />
            )
          )}
        </div>
      </div>

      {/* Visually hidden live region for screen readers */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {current + 1} of {items.length}
      </span>
    </section>
  );
}
