"use client";

import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Project, ProjectType } from "@/lib/types";

type FilterKey = "all" | "active" | "finished" | ProjectType;

const TAB_LABELS: Record<string, string> = {
  all: "All Projects",
  active: "Active",
  finished: "Finished",
  sourcing: "Sourcing",
  manufacturing: "Manufacturing",
  logistics: "Logistics",
  "market-entry": "Market Entry",
  advisory: "Advisory",
  consulting: "Consulting",
};

// Preferred display order for type tabs
const TYPE_ORDER: ProjectType[] = [
  "sourcing",
  "manufacturing",
  "logistics",
  "market-entry",
  "advisory",
  "consulting",
];

interface ProjectsGridClientProps {
  projects: Project[];
}

export default function ProjectsGridClient({ projects }: ProjectsGridClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  // Build tabs dynamically — only include tabs that have at least one matching project
  const tabs: FilterKey[] = ["all"];
  if (projects.some((p) => p.status === "in-progress")) tabs.push("active");
  if (projects.some((p) => p.status === "completed")) tabs.push("finished");
  const presentTypes = TYPE_ORDER.filter((t) => projects.some((p) => p.type === t));
  tabs.push(...presentTypes);

  // Filter projects based on the active tab
  const filtered =
    activeFilter === "all"
      ? projects
      : activeFilter === "active"
      ? projects.filter((p) => p.status === "in-progress")
      : activeFilter === "finished"
      ? projects.filter((p) => p.status === "completed")
      : projects.filter((p) => p.type === (activeFilter as ProjectType));

  return (
    <div>
      {/* Tab bar — scrollable on mobile */}
      <div
        role="tablist"
        aria-label="Filter projects"
        className="flex gap-6 border-b border-psc-border mb-10 overflow-x-auto"
      >
        {tabs.map((tab) => {
          const isActive = tab === activeFilter;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(tab)}
              className={[
                "font-sans text-small font-medium uppercase tracking-widest pb-3 whitespace-nowrap transition-colors cursor-pointer",
                isActive
                  ? "text-psc-ink border-b-2 border-psc-ink -mb-px"
                  : "text-psc-gray hover:text-psc-ink",
              ].join(" ")}
            >
              {TAB_LABELS[tab] ?? tab}
            </button>
          );
        })}
      </div>

      {/* Projects grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProjectCard key={p.id} projects={[p]} />
          ))}
        </div>
      ) : (
        <p className="font-sans text-body text-psc-gray">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
