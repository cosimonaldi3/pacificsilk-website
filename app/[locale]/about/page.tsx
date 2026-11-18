import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import FinalCta from "@/components/sections/FinalCta";
import TestimonialCarousel from "@/components/sections/TestimonialCarousel";
import Container from "@/components/ui/Container";
import Presence from "@/components/sections/about/Presence";
import TeamMemberCard from "@/components/sections/about/TeamMemberCard";
import { aboutContent } from "@/content/about";
import { getTranslations } from "next-intl/server";

async function loadContent(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/about")).aboutContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/about")).aboutContent;
  return aboutContent;
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await loadContent(locale);
  const t = await getTranslations({ locale, namespace: "common" });
  const { story, team, carousel, chinaFoothold, presence, finalCta } = content;
  // Management pair on top (large cards); everyone else in the People grid below.
  const leadership = team.filter((m) => m.leadership);
  const others = team.filter((m) => !m.leadership);

  return (
    <>
      <Nav />
      <main>
        {/* Who we are + the team */}
        <section className="bg-psc-bg pt-24 pb-24 md:pt-28">
          <Container>
            <div className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
              {story.label}
            </div>
            <h1 className="font-display text-h2 font-medium text-psc-ink">
              {t("teamHeadline")}
            </h1>

            {/* Management team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 max-w-4xl gap-x-8 gap-y-16 mt-10">
              {leadership.map((member) => (
                <TeamMemberCard key={member.name} member={member} size="lead" />
              ))}
            </div>

            {/* Rest of the team, separated by a divider */}
            {others.length > 0 && (
              <div className="mt-20 md:mt-24 pt-12 border-t border-psc-border">
                <div className="font-sans text-small uppercase tracking-widest text-psc-gray mb-10">
                  <span className="font-semibold text-psc-ink">{story.peopleLabel}</span>
                  <span className="font-normal"> — {story.peopleSubtitle}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {others.map((member) => (
                    <TeamMemberCard key={member.name} member={member} size="compact" />
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>

        {/* Testimonial Carousel */}
        <TestimonialCarousel
          sectionLabel={carousel.sectionLabel}
          items={carousel.items}
        />

        {/* Presence by country (China is one of the filters) */}
        <Presence content={presence} chinaFoothold={chinaFoothold} />

        {/* Final CTA */}
        <FinalCta content={finalCta} />
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
