import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/ui/Footer";
import ScrollCue from "@/components/ui/ScrollCue";
import Hero from "@/components/sections/Hero";
import HeroSteps from "@/components/sections/process/HeroSteps";
import ProcessExplorer from "@/components/sections/process/ProcessExplorer";
import { processContent } from "@/content/process";
import "@/components/sections/capabilities/capabilities.css";
import "@/components/sections/home/home.css";
import "@/components/sections/process/process.css";

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
  const { intro, detail, stages, define, validate, execute, beyond, finalCta } = await loadContent(locale);

  return (
    <>
      <Nav />
      <ScrollCue label={intro.scrollCue} />
      <main>
        {/* P1 Intro: image backdrop, same framing as the homepage video */}
        <Hero
          headline={intro.headline}
          subheadline={intro.subline}
          image={{ src: intro.image, alt: intro.imageAlt }}
          hideScrollHint
          fixedBackdrop
        >
          <HeroSteps stages={stages} />
        </Hero>

        {/* Everything below scrolls over the fixed image */}
        <div className="relative z-10">
        {/* P3 Stage detail */}
        <ProcessExplorer detail={detail} stages={stages} define={define} validate={validate} execute={execute} beyond={beyond} />

        {/* P4 Call to action */}
        {/* Transparent, so the fixed hero image returns at the bottom, as on the home page */}
        <FinalCta content={finalCta} overVideo />
        </div>
      </main>
      <footer className="relative z-10 bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
