import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import FinalCta from "@/components/sections/FinalCta";
import CountryPage from "@/components/sections/about/CountryPage";
import { aboutContent } from "@/content/about";
import { routing } from "@/i18n/routing";

async function loadContent(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/about")).aboutContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/about")).aboutContent;
  return aboutContent;
}

/* Only countries with services get a page; "more" has none */
const countryIds = aboutContent.presence.countries
  .filter((c) => c.id !== "more" && c.services?.length)
  .map((c) => c.id);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    countryIds.map((country) => ({ locale, country }))
  );
}

async function findCountry(locale: string, id: string) {
  const content = await loadContent(locale);
  const country = content.presence.countries.find(
    (c) => c.id === id && c.id !== "more" && c.services?.length
  );
  return { content, country };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country: id } = await params;
  const { country } = await findCountry(locale, id);
  if (!country) return {};
  return {
    title: `${country.title} — Pacific Silk Consulting`,
    description: country.servicesIntro ?? country.body,
  };
}

export default async function CountryRoute({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country: id } = await params;
  const { content, country } = await findCountry(locale, id);
  if (!country) notFound();

  return (
    <>
      <Nav />
      <main>
        <CountryPage country={country} content={content.presence} />
        <FinalCta content={content.finalCta} />
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
