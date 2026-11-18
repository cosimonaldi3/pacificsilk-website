import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { capabilitiesContent } from "@/content/capabilities";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

async function loadCapabilitiesContent(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/capabilities")).capabilitiesContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/capabilities")).capabilitiesContent;
  return capabilitiesContent;
}

function formatDate(iso: string, locale: string): string {
  const dateLocale =
    locale === "zh" ? "zh-CN" : locale === "es" ? "es-ES" : "en-GB";
  return new Date(iso).toLocaleDateString(dateLocale, {
    month: "long",
    year: "numeric",
  });
}

function durationLabel(
  start: string,
  end: string | undefined,
  t: (key: string) => string
): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months =
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (months < 1) return t("lessThanOneMonth");
  if (months === 1) return t("oneMonth");
  if (months < 12) return `${months} ${t("months")}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const yLabel = years === 1 ? t("year") : t("years");
  return rem === 0 ? `${years} ${yLabel}` : `${years}y ${rem}m`;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Pacific Silk Group`,
    description: project.summary,
    openGraph: {
      title: project.name,
      description: project.summary,
      ...(project.image ? { images: [project.image] } : {}),
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [project, allProjects, content, t] = await Promise.all([
    getProjectBySlug(slug),
    getAllProjects(),
    loadCapabilitiesContent(locale),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const tType = await getTranslations({ locale, namespace: "typeLabels" });

  if (!project) notFound();

  const idx = allProjects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

  const cta =
    content.detailCta[project.type] ?? content.detailCta["advisory"];

  const typeLabel = tType(project.type as keyof typeof tType) ?? project.type;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: project.name,
    description: project.summary,
    datePublished: project.startDate,
    ...(project.completedDate ? { dateModified: project.completedDate } : {}),
    publisher: {
      "@type": "Organization",
      name: "Pacific Silk Group",
      url: "https://pacificsilkconsulting.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        {/* Header */}
        <section className="bg-psc-bg pt-24 pb-16">
          <Container className="max-w-3xl">
            {/* 1. Badge row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-sans text-small font-medium text-psc-red uppercase tracking-widest">
                {typeLabel}
              </span>
              <span className="font-sans text-small text-psc-gray">·</span>
              <span className="font-sans text-small text-psc-gray">
                {project.status === "in-progress"
                  ? t("active")
                  : t("completed")}
              </span>
              <span className="font-sans text-small text-psc-gray">·</span>
              <span className="font-sans text-small text-psc-gray">
                {project.city}, {project.country}
              </span>
            </div>

            {/* 2. H1 */}
            <h1 className="font-display text-h1 font-medium text-psc-ink mb-6 leading-tight">
              {project.name}
            </h1>

            {/* 3. Date range */}
            <p className="font-sans text-small text-psc-gray mb-10">
              {project.status === "in-progress"
                ? `${t("since")} ${formatDate(project.startDate, locale)} · ${t("ongoing")}`
                : `${formatDate(project.startDate, locale)} — ${
                    project.completedDate
                      ? formatDate(project.completedDate, locale)
                      : ""
                  }`}
            </p>
          </Container>
        </section>

        {/* 4. Hero image (optional) */}
        {project.image && (
          <div className="bg-psc-bg">
            <Container>
              <div className="relative w-full aspect-[16/7] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Container>
          </div>
        )}

        {/* Body content */}
        <section className="bg-psc-bg py-16">
          <Container className="max-w-3xl">
            {/* 5. Summary with red left border */}
            <p className="font-display text-h3 font-medium text-psc-ink italic border-l-4 border-psc-red pl-6 mb-10 leading-snug">
              {project.summary}
            </p>

            {/* 6. Body paragraphs */}
            <div className="space-y-6">
              {project.body.map((para, i) => (
                <p
                  key={i}
                  className="font-sans text-body leading-body text-psc-gray"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* 7. Outcome block (optional) */}
            {project.outcome && (
              <div className="mt-12 bg-psc-muted p-8">
                <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-3">
                  {t("outcome")}
                </p>
                <p className="font-sans text-body leading-body text-psc-ink">
                  {project.outcome}
                </p>
              </div>
            )}

            {/* 7b. Photo carousel (bodyImages) */}
            {project.bodyImages && project.bodyImages.length > 0 && (
              <div className="mt-12">
                <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-6">
                  Photos
                </p>
                <ImageCarousel
                  images={project.bodyImages}
                  altPrefix={project.name}
                />
              </div>
            )}

            {/* 8. 3-cell detail row */}
            <div className="mt-12 grid grid-cols-3 border-t border-psc-border pt-8 gap-6">
              <div>
                <p className="font-sans text-small text-psc-gray mb-1">
                  {t("type")}
                </p>
                <p className="font-sans text-small font-medium text-psc-ink">
                  {typeLabel}
                </p>
              </div>
              {project.alliance && (
                <div>
                  <p className="font-sans text-small text-psc-gray mb-1">
                    {t("ledBy")}
                  </p>
                  <p className="font-sans text-small font-medium text-psc-ink">
                    {project.alliance}
                  </p>
                </div>
              )}
              <div>
                <p className="font-sans text-small text-psc-gray mb-1">
                  {t("duration")}
                </p>
                <p className="font-sans text-small font-medium text-psc-ink">
                  {durationLabel(project.startDate, project.completedDate, t)}
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 9. Prev / Next navigation */}
        {(prev || next) && (
          <section className="bg-psc-muted py-16">
            <Container>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {prev ? (
                  <Link
                    href={`/client-impact/${prev.slug}`}
                    className="group flex flex-col gap-1 max-w-sm"
                  >
                    <span className="font-sans text-small text-psc-gray group-hover:text-psc-ink transition-colors">
                      {t("previous")}
                    </span>
                    <span className="font-display text-h3 font-medium text-psc-ink group-hover:text-psc-red transition-colors leading-snug">
                      {prev.name}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {next && (
                  <Link
                    href={`/client-impact/${next.slug}`}
                    className="group flex flex-col gap-1 max-w-sm md:items-end"
                  >
                    <span className="font-sans text-small text-psc-gray group-hover:text-psc-ink transition-colors">
                      {t("next")}
                    </span>
                    <span className="font-display text-h3 font-medium text-psc-ink group-hover:text-psc-red transition-colors leading-snug md:text-right">
                      {next.name}
                    </span>
                  </Link>
                )}
              </div>
            </Container>
          </section>
        )}

        {/* 10. CTA */}
        <section className="bg-psc-ink py-24 md:py-32">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-h1 font-medium text-psc-bg mb-6">
                {cta.headline}
              </h2>
              <p className="font-sans text-body text-psc-gray mb-10">
                {cta.body}
              </p>
              <Link
                href={cta.cta.href}
                className="inline-block bg-psc-red text-psc-bg font-sans text-small font-medium px-8 py-4 hover:opacity-90 transition-opacity"
              >
                {cta.cta.label}
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
