"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/types";

interface ProjectRowProps {
  project: Project;
  typeLabel: string;
  ctaLabel: string;
  highlighted: boolean;
  onHover: (id: string | null) => void;
}

/* Compact version of the client impact cards: thumbnail, type, title, headline fact.
   The whole row is the link. */
export default function ProjectRow({
  project,
  typeLabel,
  ctaLabel,
  highlighted,
  onHover,
}: ProjectRowProps) {
  const image = project.image ?? project.countryImage;

  return (
    <li
      data-project-id={project.id}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link
        href={`/client-impact/${project.slug}`}
        aria-label={`${ctaLabel}: ${project.name}`}
        className={`group flex items-stretch gap-4 rounded-[4px] border bg-psc-bg p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
          highlighted ? "border-psc-ink" : "border-psc-border hover:border-psc-ink"
        }`}
      >
        <span className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[2px] bg-psc-ink">
          {image && (
            <Image
              src={image}
              alt=""
              fill
              sizes="72px"
              className="object-cover [filter:sepia(0.08)_saturate(0.86)]"
            />
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-psc-gray">
            {typeLabel} · {project.country}
          </span>
          <span className="mt-1 font-display text-[19px] font-medium leading-tight text-psc-ink">
            {project.name}
          </span>
          {project.impact && (
            <span className="mt-1.5 font-sans text-[12px] leading-snug text-psc-gray">
              <span className="font-semibold text-psc-ink">{project.impact.value}</span>
              {" · "}
              {project.impact.label}
            </span>
          )}
        </span>

        <span
          aria-hidden
          className="flex-shrink-0 self-center pr-2 font-sans text-psc-gray transition-colors group-hover:text-psc-red"
        >
          →
        </span>
      </Link>
    </li>
  );
}
