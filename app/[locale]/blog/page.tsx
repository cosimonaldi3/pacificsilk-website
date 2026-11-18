import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import BlogExplorer from "@/components/sections/blog/BlogExplorer";
import NewsletterBand from "@/components/sections/blog/NewsletterBand";
import { blogCategories, getAllPosts, getPopularTopics, toCard } from "@/content/blog";
import { SITE_URL } from "@/lib/siteUrl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts();
  const base = `${SITE_URL}${locale === "en" ? "" : `/${locale}`}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: t("meta.title"),
    description: t("meta.description"),
    url: `${base}/blog`,
    publisher: { "@type": "Organization", name: "Pacific Silk Group", url: SITE_URL },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.date,
      url: `${base}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main>
        <section className="bg-psc-bg pt-24 pb-12 md:pt-28">
          <Container>
            <p className="mb-4 font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
              {t("label")}
            </p>
            <h1 className="max-w-4xl font-display text-h1 font-medium leading-tight text-psc-ink">
              {t("headline")}
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-body leading-body text-psc-gray">{t("subline")}</p>
          </Container>
        </section>

        <BlogExplorer
          cards={posts.map(toCard)}
          categories={blogCategories}
          popularTopics={getPopularTopics()}
        />

        <div className="mt-24">
          <NewsletterBand />
        </div>
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
