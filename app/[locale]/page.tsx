import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import Journey from "@/components/sections/home/Journey";
import Benefits from "@/components/sections/home/Benefits";
import Comparison from "@/components/sections/home/Comparison";
import ProjectBuilder from "@/components/sections/ProjectBuilder";
import "@/components/sections/capabilities/capabilities.css";
import "@/components/sections/home/home.css";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/ui/Footer";
import { homeContent } from "@/content/home";

async function loadContent(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/home")).homeContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/home")).homeContent;
  return homeContent;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "es")
    return {
      title: "Pacific Silk Group",
      description:
        "El puente entre China y tu mercado. Un idioma, un equipo: nunca tratas con la parte china.",
    };
  if (locale === "zh")
    return {
      title: "太平洋丝绸集团",
      description: "我们提供基础设施。您做决策。通向中国的运营桥梁。",
    };
  return {
    title: "Pacific Silk Group",
    description:
      "The bridge between China and your market. One language, one team: you never deal with the Chinese side.",
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await loadContent(locale);

  return (
    <>
      <Nav />
      <main>
        <Hero {...content.hero} fixedBackdrop />
        {/* Opaque middle sections scroll over the fixed hero video... */}
        <div className="relative z-10">
          <Journey content={content.journey} />
          <Benefits content={content.benefits} />
          <Comparison content={content.comparison} />
          <ProjectBuilder content={content.builder} variant="home" />
        </div>
        {/* ...and the final call to action is transparent, so the video returns */}
        <FinalCta content={content.finalCta} overVideo primaryHref="#builder" />
      </main>
      <footer className="relative z-10 bg-psc-ink py-8">
        <Footer />
      </footer>
    </>
  );
}
