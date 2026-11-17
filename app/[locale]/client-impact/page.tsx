import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import ProjectFinder from "@/components/sections/capabilities/ProjectFinder";
import ImpactCarousel from "@/components/sections/capabilities/ImpactCarousel";
import BlogBlock from "@/components/sections/BlogBlock";
import FinalCta from "@/components/sections/FinalCta";
import {
  getAllProjects,
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
  const [content, allProjects, posts] =
    await Promise.all([
      loadContent(locale),
      getAllProjects(),
      getPosts(),
    ]);

  const { finder, impact, blogSection, finalCta } = content;

  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PSC Projects",
    itemListElement: allProjects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `https://pacificsilkconsulting.com/client-impact/${p.slug}`,
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
        {/* Client examples first, then the globe of where the work happened */}
        <ImpactCarousel content={impact} projects={allProjects} />
        <ProjectFinder
          content={finder}
          typeLabels={impact.typeLabels}
          projects={allProjects}
        />
        <BlogBlock content={blogSection} posts={posts} />
        <FinalCta content={finalCta} />
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
