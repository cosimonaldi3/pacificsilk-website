import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import CapabilitiesGrid from "@/components/sections/CapabilitiesGrid";
import MoveAndSupport from "@/components/sections/capabilities/MoveAndSupport";
import HeroSteps from "@/components/sections/process/HeroSteps";
import ProcessExplorer from "@/components/sections/process/ProcessExplorer";
import { processContent } from "@/content/process";
import "@/components/sections/capabilities/capabilities.css";
import "@/components/sections/home/home.css";
import "@/components/sections/process/process.css";

/* The grid and the route reuse the capabilities copy (they moved here from that page) */
async function loadCapabilities(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/capabilities")).capabilitiesContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/capabilities")).capabilitiesContent;
  return (await import("@/content/capabilities")).capabilitiesContent;
}

async function loadContent(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/process")).processContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/process")).processContent;
  return processContent;
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
    openGraph: { title: content.meta.title, description: content.meta.description },
  };
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { intro, detail, stages, define, finalCta } = await loadContent(locale);
  const { grid, move } = await loadCapabilities(locale);

  return (
    <>
      <Nav />
      <main>
        {/* P1 Intro: image backdrop, same framing as the homepage video */}
        <Hero
          eyebrow={intro.label}
          headline={intro.headline}
          subheadline={intro.subline}
          image={{ src: intro.image, alt: intro.imageAlt }}
          fixedBackdrop
        >
          <HeroSteps stages={stages} />
        </Hero>

        {/* Everything below scrolls over the fixed image */}
        <div className="relative z-10">
        {/* P3 Stage detail */}
        <ProcessExplorer detail={detail} stages={stages} define={define} />

        {/* What we run + the route from factory to door */}
        <CapabilitiesGrid content={grid} />
        <MoveAndSupport content={move} globe={grid.movement} />

        {/* P4 Call to action */}
        <FinalCta content={finalCta} />
        </div>
      </main>
      <footer className="relative z-10 bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
