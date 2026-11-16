import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import { termsContent } from "@/content/legal";
import { getTranslations } from "next-intl/server";

async function loadContent(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/legal")).termsContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/legal")).termsContent;
  return termsContent;
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

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [content, t] = await Promise.all([
    loadContent(locale),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const { lastUpdated, sections } = content;

  return (
    <>
      <Nav />
      <main className="bg-psc-bg py-24 md:py-32">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="font-sans text-small text-psc-gray uppercase tracking-widest mb-4">
              {t("legal")}
            </p>
            <h1 className="font-display text-h1 font-medium text-psc-ink mb-4">
              {t("termsOfUse")}
            </h1>
            <p className="font-sans text-small text-psc-gray mb-16">
              {t("lastUpdated")} {lastUpdated}
            </p>

            <div className="space-y-0">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="border-b border-psc-border pb-8 mb-8"
                >
                  <h2 className="font-display text-h3 font-medium text-psc-ink mb-4 mt-12">
                    {section.heading}
                  </h2>
                  {section.body.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="font-sans text-body leading-body text-psc-gray mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
