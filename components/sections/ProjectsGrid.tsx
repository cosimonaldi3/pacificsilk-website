import Container from "@/components/ui/Container";
import ProjectsGridClient from "@/components/sections/ProjectsGridClient";
import type { CapabilitiesPageContent } from "@/content/capabilities";
import type { Project } from "@/lib/types";

interface ProjectsGridProps {
  content: CapabilitiesPageContent["projectsGrid"];
  projects: Project[];
}

export default function ProjectsGrid({ content, projects }: ProjectsGridProps) {
  return (
    <section className="bg-psc-bg py-24 md:py-32">
      <Container>
        <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
          {content.label}
        </p>
        <h2 className="font-display text-h1 font-medium text-psc-ink mb-16">
          {content.headline}
        </h2>
        <ProjectsGridClient projects={projects} />
      </Container>
    </section>
  );
}
