import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import { FinalCtaContent } from "@/content/home";

interface FinalCtaProps {
  content: FinalCtaContent;
  /* Transparent, taller variant that lets a fixed hero video show through */
  overVideo?: boolean;
}

export default function FinalCta({ content, overVideo = false }: FinalCtaProps) {
  return (
    <section className={overVideo ? "relative z-10 flex min-h-[80dvh] items-center py-24 md:py-32" : "bg-psc-ink py-24 md:py-32"}>
      <Container>
        <div className="text-center">
          <h2 className="font-display text-h1 font-medium text-psc-bg mb-6 whitespace-pre-line">
            {content.headline}
          </h2>
          <p className={`font-sans text-body mb-10 max-w-2xl mx-auto ${overVideo ? "text-psc-bg/80" : "text-psc-gray"}`}>
            {content.body}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={content.cta.href}
              className="inline-block bg-psc-red text-psc-bg font-sans text-small font-medium px-8 py-4 hover:opacity-90 transition-opacity"
            >
              {content.cta.label}
            </Link>
            {content.secondary?.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="inline-block border border-psc-bg/30 text-psc-bg font-sans text-small font-medium px-8 py-4 hover:border-psc-bg transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
