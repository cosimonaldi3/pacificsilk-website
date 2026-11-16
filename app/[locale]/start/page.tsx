import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import TallyEmbed from "@/components/TallyEmbed";
import { startContent } from "@/content/start";

async function loadContent(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/start")).startContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/start")).startContent;
  return startContent;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await loadContent(locale);
  return { title: content.meta.title, description: content.meta.description };
}

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await loadContent(locale);

  return (
    <>
      <Nav />
      <main className="bg-psc-bg">
        <section className="py-24 md:py-32">
          <Container>
            <div className="max-w-3xl">
              {/* Page header */}
              <h1 className="font-display text-h1 font-medium text-psc-ink mb-6">
                {content.pageTitle}
              </h1>
              <p className="font-sans text-body leading-body text-psc-gray mb-16">
                {content.intro}
              </p>

              {/* Form — visual centerpiece */}
              <div className="mb-16">
                <TallyEmbed />
              </div>

              {/* Booking — secondary */}
              <hr className="border-psc-border mb-12" />
              <div className="mb-12">
                <h2 className="font-display text-h2 font-medium text-psc-ink mb-3">
                  {content.bookingHeading}
                </h2>
                <p className="font-sans text-body leading-body text-psc-gray mb-6">
                  {content.bookingBody}
                </p>
                <a
                  href={content.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-sans text-small font-medium px-6 py-3 bg-psc-ink text-psc-bg hover:opacity-80 transition-opacity"
                >
                  {content.bookingCtaLabel}
                </a>
              </div>

              {/* Email — tertiary / footnote feel */}
              <hr className="border-psc-border mb-8" />
              <div className="pb-16">
                <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-2">
                  {content.emailHeading}
                </p>
                <p className="font-sans text-small text-psc-gray">
                  {content.emailBody}{" "}
                  <a
                    href={`mailto:${content.emailAddress}`}
                    className="text-psc-ink underline underline-offset-2 hover:text-psc-gray transition-colors"
                  >
                    {content.emailAddress}
                  </a>
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
