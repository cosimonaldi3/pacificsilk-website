"use client";

import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import type { CapabilitiesPageContent } from "@/content/capabilities";
import type { Project } from "@/lib/types";
import "./impact.css";

interface ImpactCarouselProps {
  content: CapabilitiesPageContent["impact"];
  projects: Project[];
}

/* Client impact carousel. Structure follows a "one wide card, the rest collapsed"
   pattern: the active project opens wide with its summary and link, the others stay
   narrow until chosen. Width and track position are pure CSS (impact.css) driven by
   two custom properties, so the motion is a single transition and reduced motion
   just switches it off. */
export default function ImpactCarousel({ content, projects }: ImpactCarouselProps) {
  const [active, setActive] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const total = projects.length;

  function go(i: number) {
    setActive(Math.max(0, Math.min(total - 1, i)));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  }

  // Swipe: a horizontal drag of 50px or more moves one card.
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    pointerStart.current = e.clientX;
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) return;
    const dx = e.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(dx) < 50) return;
    go(dx < 0 ? active + 1 : active - 1);
  }

  if (total === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={content.carouselLabel}
      className="overflow-hidden bg-psc-bg py-16 md:py-24"
    >
      <Container>
        <p className="mb-4 font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
          {content.label}
        </p>
        <h1 className="mb-5 font-display text-h1 font-medium leading-[1.05] text-psc-ink">
          {content.headline}
        </h1>
        <p className="mb-12 max-w-3xl font-sans text-body leading-body text-psc-gray md:mb-14">
          {content.intro}
        </p>

        <div
          className="impact-viewport"
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (pointerStart.current = null)}
        >
          <div
            className="impact-track"
            style={{ "--active": active, "--count": total } as CSSProperties}
          >
            {projects.map((p, i) => (
              <ImpactCard
                key={p.id}
                project={p}
                isActive={i === active}
                typeLabel={content.typeLabels[p.type] ?? p.type}
                ctaLabel={content.ctaLabel}
                slideLabel={content.slideLabel
                  .replace("{n}", String(i + 1))
                  .replace("{total}", String(total))}
                onSelect={() => go(i)}
                priority={i < 2}
              />
            ))}
          </div>
        </div>

        <div
          role="group"
          aria-label={content.dotsLabel}
          className="mt-6 flex justify-end gap-1"
        >
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.id}
                type="button"
                aria-label={p.name}
                aria-current={on ? "true" : undefined}
                onClick={() => go(i)}
                className="impact-dot group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-psc-red"
              >
                <span
                  aria-hidden
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors ${
                    on ? "border-psc-ink" : "border-transparent"
                  }`}
                >
                  <span
                    className={`block h-[6px] w-[6px] rounded-full transition-colors ${
                      on ? "bg-psc-ink" : "bg-psc-gray group-hover:bg-psc-ink"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

interface ImpactCardProps {
  project: Project;
  isActive: boolean;
  typeLabel: string;
  ctaLabel: string;
  slideLabel: string;
  onSelect: () => void;
  priority: boolean;
}

function ImpactCard({
  project,
  isActive,
  typeLabel,
  ctaLabel,
  slideLabel,
  onSelect,
  priority,
}: ImpactCardProps) {
  const image = project.image ?? project.countryImage;

  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={slideLabel}
      data-active={isActive}
      className="impact-card bg-psc-ink"
    >
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 60vw, (min-width: 768px) 70vw, 90vw"
          className="impact-photo object-cover"
        />
      )}

      {project.impact && (
        <div className="impact-badge bg-psc-bg text-psc-ink">
          <p className="font-display text-[26px] font-semibold leading-none">
            {project.impact.value}
          </p>
          <p className="mt-1.5 font-sans text-[11px] font-medium uppercase leading-snug tracking-wider text-psc-gray">
            {project.impact.label}
          </p>
        </div>
      )}

      <div className="impact-panel bg-psc-bg text-psc-ink">
        <p className="mb-3 font-sans text-[12px] font-semibold uppercase tracking-widest text-psc-gray">
          {typeLabel}
        </p>
        <h3 className="impact-title font-display font-medium text-psc-ink">{project.name}</h3>
        <p className="impact-summary mt-4 font-sans text-[15px] leading-relaxed text-psc-gray">
          {project.summary}
        </p>
        {isActive && (
          <Link
            href={`/client-impact/${project.slug}`}
            className="impact-cta mt-6 inline-flex items-center gap-2 self-start border-b border-psc-ink pb-1 font-sans text-small font-semibold uppercase tracking-widest text-psc-ink transition-colors hover:border-psc-red hover:text-psc-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-psc-red"
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>

      {/* Collapsed cards: the whole card selects the project */}
      {!isActive && (
        <button
          type="button"
          onClick={onSelect}
          aria-label={project.name}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-psc-red"
        />
      )}
    </article>
  );
}
