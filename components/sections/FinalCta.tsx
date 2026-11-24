import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import { FinalCtaContent } from "@/content/home";
import { finalCtaButtons } from "@/content/finalCtaButtons";

interface FinalCtaProps {
  content: FinalCtaContent;
  /* Transparent, taller variant that lets a fixed hero video show through */
  overVideo?: boolean;
  /* On the home page the primary button scrolls to the builder instead of opening /start */
  primaryHref?: string;
}

/* Headline and body come from the page; the three buttons are shared (content/finalCtaButtons.ts) */
export default async function FinalCta({ content, overVideo = false, primaryHref }: FinalCtaProps) {
  const locale = await getLocale();
  const buttons = finalCtaButtons[locale as keyof typeof finalCtaButtons] ?? finalCtaButtons.en;
  return (
    <section className={overVideo ? "relative z-10 flex items-center py-12 md:py-14" : "bg-psc-ink py-24 md:py-32"}>
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
              href={primaryHref ?? buttons.primary.href}
              className="inline-block bg-psc-red text-psc-bg font-sans text-small font-medium px-8 py-4 hover:opacity-90 transition-opacity"
            >
              {buttons.primary.label}
            </Link>
            {buttons.secondary.map((link) => {
              const external = Boolean(link.external);
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
