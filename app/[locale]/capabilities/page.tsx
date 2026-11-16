import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import ProjectFinder from "@/components/sections/capabilities/ProjectFinder";
import ImpactCarousel from "@/components/sections/capabilities/ImpactCarousel";
import BlogBlock from "@/components/sections/BlogBlock";
import FinalCta from "@/components/sections/FinalCta";
import {
  getAllProjects,
  getCountryMarkers,
  getOffices,
  getPosts,
} from "@/lib/projects";
import { capabilitiesContent } from "@/content/capabilities";

async function loadContent(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/capabilities")).capabilitiesContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/capabilities")).capabilitiesContent;
  return capabilitiesContent;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await loadContent(locale);
  return {
    title: content.meta.title,
    description: content.meta.description,
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
    },
  };
}

export default async function CapabilitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [content, allProjects, countryMarkers, offices, posts] =
    await Promise.all([
      loadContent(locale),
      getAllProjects(),
      getCountryMarkers(),
      getOffices(),
      getPosts(),
    ]);

  const { intro, finder, impact, blogSection, finalCta } = content;

  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PSC Projects",
    itemListElement: allProjects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `https://pacificsilkconsulting.com/capabilities/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <Nav />
      <main>
        {/* C1 Intro */}
        <section className="bg-psc-bg pt-16 pb-4 md:pt-20">
          <Container>
            <p className="mb-4 font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
              {intro.label}
            </p>
            <h1 className="mb-4 font-display text-h1 font-medium text-psc-ink">{intro.headline}</h1>
            <p className="max-w-2xl font-sans text-body leading-body text-psc-gray">{intro.subline}</p>
          </Container>
        </section>
        {/* Client examples first, then the globe of where the work happened */}
        <ImpactCarousel content={impact} projects={allProjects} />
        <ProjectFinder content={finder} countryMarkers={countryMarkers} offices={offices} />
        <BlogBlock content={blogSection} posts={posts} />
        <FinalCta content={finalCta} />
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
