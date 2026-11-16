import Container from "@/components/ui/Container";
import type { CapabilitiesPageContent } from "@/content/capabilities";
import type { Project } from "@/lib/types";

interface ProjectTypesProps {
  content: CapabilitiesPageContent["projectTypes"];
  projects: Project[];
}

export default function ProjectTypes({ content, projects }: ProjectTypesProps) {
  const countByType = (key: string) =>
    projects.filter((p) => p.type === key).length;

  return (
    <section className="bg-psc-muted py-24 md:py-32">
      <Container>
        <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
          {content.label}
        </p>
        <h2 className="font-display text-h1 font-medium text-psc-ink mb-16">
          {content.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-psc-border">
          {content.types.map((type) => {
            const count = countByType(type.key);
            return (
              <div
                key={type.key}
                className="border-r border-b border-psc-border px-8 py-10"
              >
                {count > 0 && (
                  <p className="font-sans text-small font-medium text-psc-red mb-3">
                    {count} project{count !== 1 ? "s" : ""}
                  </p>
                )}
                <h3 className="font-display text-h3 font-medium text-psc-ink mb-3">
                  {type.label}
                </h3>
                <p className="font-sans text-body leading-body text-psc-gray">
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
