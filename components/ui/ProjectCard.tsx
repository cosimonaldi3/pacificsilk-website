"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";

const TYPE_LABELS: Record<string, string> = {
  sourcing: "Sourcing",
  manufacturing: "Manufacturing",
  logistics: "Logistics",
  "market-entry": "Market Entry",
  advisory: "Advisory",
  consulting: "Consulting",
};

// Placeholder header colour when a project has no image yet
const TYPE_HEADER_CLASS: Record<string, string> = {
  sourcing: "bg-psc-ink",
  manufacturing: "bg-psc-gray",
  logistics: "bg-psc-ink",
  "market-entry": "bg-psc-gray",
  advisory: "bg-psc-ink",
  consulting: "bg-psc-ink",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

interface ProjectCardProps {
  projects: Project[];
  className?: string;
}

export default function ProjectCard({ projects: projectList, className = "" }: ProjectCardProps) {
  const [index, setIndex] = useState(0);
  const project = projectList[index];
  const isCluster = projectList.length > 1;

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i - 1 + projectList.length) % projectList.length);
  }

  function next(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + 1) % projectList.length);
  }

  const headerBg = TYPE_HEADER_CLASS[project.type] ?? "bg-psc-ink";

  return (
    <Link
      href={`/capabilities/${project.slug}`}
      className={`group block bg-psc-bg border border-psc-border hover:border-psc-ink transition-colors relative overflow-hidden shadow-sm hover:shadow-md ${className}`}
    >
      {/* Image header — rectangle at the top, like a Notion page header */}
      <div className="relative w-full aspect-[16/7] overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className={`w-full h-full ${headerBg} flex items-end p-4`}>
            <span className="font-display text-[40px] leading-none font-medium text-white/20 select-none">
              {TYPE_LABELS[project.type] ?? project.type}
            </span>
          </div>
        )}

        {/* Slide-in arrow badge */}
        <div className="absolute top-3 right-3 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 bg-psc-bg px-2 py-1">
          <span className="font-sans text-small text-psc-ink">→</span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Type · Status */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-sans text-small font-medium text-psc-red uppercase tracking-widest">
            {TYPE_LABELS[project.type] ?? project.type}
          </span>
          <span className="font-sans text-small text-psc-gray">·</span>
          <span className="font-sans text-small text-psc-gray">
            {project.status === "in-progress" ? "Active" : "Completed"}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-display text-h3 font-medium text-psc-ink mb-1 leading-snug">
          {project.name}
        </h3>

        {/* Location + date */}
        <p className="font-sans text-small text-psc-gray mb-3">
          {project.city}, {project.country}
          {" · "}
          {project.status === "in-progress"
            ? `Since ${formatDate(project.startDate)}`
            : formatDate(project.startDate)}
        </p>

        {/* Summary */}
        <p className="font-sans text-body leading-body text-psc-gray line-clamp-2 text-[15px]">
          {project.summary}
        </p>
      </div>

      {/* Cluster footer */}
      {isCluster && (
        <div className="border-t border-psc-border px-5 py-3 flex items-center justify-between bg-psc-muted">
          <span className="font-sans text-small text-psc-gray">
            {index + 1} / {projectList.length} in {project.country}
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous project"
              className="font-sans text-small text-psc-gray hover:text-psc-ink transition-colors"
            >
              ←
            </button>
            <button
              onClick={next}
              aria-label="Next project"
              className="font-sans text-small text-psc-gray hover:text-psc-ink transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </Link>
  );
}
