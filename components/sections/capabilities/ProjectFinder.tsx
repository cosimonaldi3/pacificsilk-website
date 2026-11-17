"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import ProjectMap from "@/components/globe/ProjectMap";
import type { CapabilitiesPageContent } from "@/content/capabilities";
import type { Project } from "@/lib/types";
import ProjectRow from "./ProjectRow";

interface ProjectFinderProps {
  content: CapabilitiesPageContent["finder"];
  /* Type names shared with the client impact carousel */
  typeLabels: Record<string, string>;
  projects: Project[];
}

/* Map on the left, the list of projects on the right. Hovering or clicking a dot on the
   map highlights its row in the list. */
export default function ProjectFinder({ content, typeLabels, projects }: ProjectFinderProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const highlightedId = hoverId ?? selectedId;

  // After a click on a map dot, bring that row into view.
  useEffect(() => {
    if (!selectedId) return;
    const row = listRef.current?.querySelector(`[data-project-id="${CSS.escape(selectedId)}"]`);
    row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  return (
    <section className="bg-psc-bg pt-16 pb-16">
      <Container>
        <p className="mb-4 font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
          {content.label}
        </p>
        <h2 className="mb-4 whitespace-pre-line font-display text-h1 font-medium text-psc-ink">
          {content.headline}
        </h2>
        <p className="max-w-2xl font-sans text-body leading-body text-psc-gray">
          {content.subheadline}
        </p>
      </Container>

      <div className="mx-auto mt-8 w-full max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/* Map */}
          <div className="min-w-0 lg:sticky lg:top-24">
            <div className="overflow-x-auto" aria-hidden="true">
              <ProjectMap
                className="min-w-[640px] md:min-w-0"
                projects={projects}
                activeProjectId={highlightedId}
                onProjectHover={setHoverId}
                onProjectClick={setSelectedId}
              />
            </div>
          </div>

          {/* Right column: the list */}
          <div className="min-w-0">
            <p
              aria-live="polite"
              className="mb-3 border-b border-psc-border pb-4 font-sans text-[12px] font-semibold uppercase tracking-widest text-psc-gray"
            >
              {projects.length === 1 ? content.countOne : content.count.replace("{n}", String(projects.length))}
            </p>
            <ul ref={listRef} className="flex flex-col gap-2 lg:max-h-[480px] lg:overflow-y-auto lg:pr-1">
              {projects.map((p) => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  typeLabel={typeLabels[p.type] ?? p.type}
                  ctaLabel={content.cta}
                  highlighted={highlightedId === p.id}
                  onHover={setHoverId}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
