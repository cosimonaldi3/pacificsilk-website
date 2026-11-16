import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Alliance from "@/components/sections/Alliance";
import FinalCta from "@/components/sections/FinalCta";
import TestimonialCarousel from "@/components/sections/TestimonialCarousel";
import Container from "@/components/ui/Container";
import Presence from "@/components/sections/about/Presence";
import JoinNetwork from "@/components/sections/about/JoinNetwork";
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
  const { story, team, carousel, alliance, presence, joinNetwork, finalCta } = content;

  return (
    <>
      <Nav />
      <main>
        {/* Story */}
        <section className="bg-psc-bg py-32">
          <Container>
            <div className="max-w-3xl">
              <div className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
                {story.label}
              </div>
              <h1 className="font-display text-h1 font-medium text-psc-ink mb-8">
                {story.headline.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className="font-sans text-body leading-body text-psc-gray">
                {story.body}
              </p>
            </div>
          </Container>
        </section>

        {/* Team */}
        <section className="bg-psc-bg py-24">
          <Container>
            <div className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
              {t("theTeam")}
            </div>
            <h2 className="font-display text-h2 font-medium text-psc-ink">
              {t("teamHeadline")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 max-w-4xl gap-x-8 gap-y-16 mt-16">
              {team.map((member) => (
                <div key={member.name}>
                  {/* Photo area */}
                  <div className="aspect-square w-full mb-6 overflow-hidden bg-psc-muted">
                    {member.placeholder || !member.photo ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-h1 text-psc-gray">
                          {member.initials}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: "center 15%",
                          filter:
                            "grayscale(100%) brightness(0.88) contrast(1.05)",
                        }}
                      />
                    )}
                  </div>
                  {/* Company */}
                  <div className="font-sans text-small font-medium text-psc-red uppercase tracking-widest mb-1">
                    {member.company}
                  </div>
                  {/* Name */}
                  <div className="font-display text-h3 font-medium text-psc-ink mb-1">
                    {member.name}
                  </div>
                  {/* Title */}
                  <div className="font-sans text-small text-psc-gray mb-4">
                    {member.title}
                  </div>
                  {/* Bio */}
                  <p className="font-sans text-small leading-body text-psc-gray">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonial Carousel */}
        <TestimonialCarousel
          sectionLabel={carousel.sectionLabel}
          items={carousel.items}
        />

        {/* The three companies */}
        <Alliance content={alliance} />

        {/* Presence by country */}
        <Presence content={presence} />

        {/* Join the network */}
        <JoinNetwork content={joinNetwork} />

        {/* Final CTA */}
        <FinalCta content={finalCta} />
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
