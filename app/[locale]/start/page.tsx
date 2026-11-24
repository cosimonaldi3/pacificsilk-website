import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import ProjectBuilder from "@/components/sections/ProjectBuilder";
import QuoteForm from "@/components/start/QuoteForm";
import "@/components/sections/home/home.css";
import { startContent } from "@/content/start";
import { homeContent } from "@/content/home";

async function loadContent(locale: string) {
  if (locale === "es") {
    const [start, home] = await Promise.all([import("@/content/i18n/es/start"), import("@/content/i18n/es/home")]);
    return { start: start.startContent, builder: home.homeContent.builder };
  }
  if (locale === "zh") {
    const [start, home] = await Promise.all([import("@/content/i18n/zh/start"), import("@/content/i18n/zh/home")]);
    return { start: start.startContent, builder: home.homeContent.builder };
  }
  return { start: startContent, builder: homeContent.builder };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { start } = await loadContent(locale);
  return { title: start.meta.title, description: start.meta.description };
}

/* One action on this page: the form. The builder below is the same component as on the home page,
   sharing its selections, so "Get a quote" carries the blueprint here. */
export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { start, builder } = await loadContent(locale);

  return (
    <>
      <Nav />
      {/* One background for details + builder so they read as a single piece */}
      <main className="bg-psc-bg">
        <section aria-labelledby="start-heading" className="pt-24 pb-10 md:pt-28 md:pb-12">
          <Container>
            <h1 id="start-heading" className="mb-4 font-display text-h1 font-medium text-psc-ink">
              {start.pageTitle}
            </h1>
            <p className="mb-10 max-w-2xl font-sans text-body leading-body text-psc-gray">{start.intro}</p>
            <QuoteForm content={start.form} builder={builder} />
          </Container>
        </section>
        <ProjectBuilder content={builder} variant="start" />
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
