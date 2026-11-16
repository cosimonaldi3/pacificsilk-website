import Link from "next/link";
import Container from "@/components/ui/Container";
import { ProcessContent } from "@/content/home";

interface ProcessPreviewProps {
  content: ProcessContent;
}

export default function ProcessPreview({ content }: ProcessPreviewProps) {
  return (
    <section className="bg-psc-muted py-24 md:py-32">
      <Container>
        <div className="flex flex-col">
          {/* Top: label and headline */}
          <div className="mb-16">
            <p className="font-sans text-small text-psc-gray uppercase tracking-widest mb-4">
              {content.label}
            </p>
            <h2 className="font-display text-h2 font-medium text-psc-ink">
              {content.headline}
            </h2>
          </div>

          {/* Steps: vertical stack */}
          <div className="flex flex-col">
            {content.steps.map((step, index) => (
              <div
                key={step.number}
                className={`${
                  index > 0 ? "pt-8 pb-8" : "pb-8"
                } border-t border-psc-border`}
              >
                <p className="font-sans text-small text-psc-gray mb-2">
                  {step.number}
                </p>
                <h3 className="font-display text-h3 font-medium text-psc-ink mb-3 hover:text-psc-red transition-colors">
                  {step.title}
                </h3>
                <p className="font-sans text-body leading-body text-psc-gray max-w-2xl">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          {/* Link to full process */}
          <div className="pt-8 border-t border-psc-border">
            <Link
              href={content.cta.href}
              className="font-sans text-small font-medium text-psc-ink underline underline-offset-4 hover:text-psc-red transition-colors"
            >
              {content.cta.label}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
