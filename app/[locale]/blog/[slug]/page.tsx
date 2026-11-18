import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import CategoryIcon from "@/components/sections/blog/CategoryIcon";
import NewsletterBand from "@/components/sections/blog/NewsletterBand";
import PostBody from "@/components/sections/blog/PostBody";
import PostCell from "@/components/sections/blog/PostCell";
import ShareBar from "@/components/sections/blog/ShareBar";
import { formatPostDate } from "@/components/sections/blog/format";
import { getAllPosts, getPostBySlug, getRelated, readMinutes, toCard } from "@/content/blog";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/siteUrl";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllPosts().map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Pacific Silk Group`,
    description: post.dek,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.dek,
      publishedTime: post.date,
      images: [post.image.src],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.dek, images: [post.image.src] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const related = getRelated(post).map(toCard);
  const base = `${SITE_URL}${locale === "en" ? "" : `/${locale}`}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.dek,
    datePublished: post.date,
    image: `${SITE_URL}${post.image.src}`,
    mainEntityOfPage: `${base}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "Pacific Silk Group", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Pacific Silk Group", url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main>
        <article>
          <header className="bg-psc-bg pt-24 pb-10 md:pt-28">
            <Container>
              <nav aria-label="Breadcrumb" className="font-sans text-small text-psc-gray">
                <Link href="/blog" className="hover:text-psc-ink">
                  {t("backToBlog")}
                </Link>
                <span aria-hidden="true"> / </span>
                <Link href={`/blog?category=${post.category}`} className="hover:text-psc-ink">
                  {t(`categories.${post.category}`)}
                </Link>
              </nav>
              <p className="mt-8 flex items-center gap-2 font-sans text-small text-psc-gray">
                <CategoryIcon category={post.category} className="h-4 w-4" />
                {t(`categories.${post.category}`)}
              </p>
              <h1 className="mt-4 max-w-4xl font-display text-h1 font-medium leading-tight text-psc-ink">
                {post.title}
              </h1>
              <p className="mt-6 max-w-3xl font-sans text-xl leading-body text-psc-gray">{post.dek}</p>
              <p className="mt-8 font-sans text-small text-psc-gray">
                <span className="text-psc-ink">{post.author}</span> · {formatPostDate(post.date, locale)} ·{" "}
                {t("minRead", { minutes: readMinutes(post) })}
              </p>
            </Container>
          </header>

          <Container>
            <div className="relative aspect-[16/9] overflow-hidden bg-psc-muted">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                priority
                sizes="(min-width: 1280px) 72rem, 100vw"
                className="object-cover [filter:sepia(0.08)_saturate(0.86)]"
              />
            </div>
          </Container>

          <Container className="py-16 md:py-20">
            <div className="lg:grid lg:grid-cols-[9rem_minmax(0,45rem)] lg:justify-center lg:gap-16">
              {/* Share rail: stays beside the text while you read */}
              <div className="hidden lg:block">
                <div className="sticky top-28">
                  <ShareBar slug={post.slug} title={post.title} layout="column" />
                </div>
              </div>

              <div>
                <div className="mb-10 lg:hidden">
                  <ShareBar slug={post.slug} title={post.title} />
                </div>

                <PostBody blocks={post.body} />

                <div className="mt-14 border-t border-psc-border pt-8">
                  <h2 className="font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
                    {t("topics")}
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {post.topics.map((topic) => (
                      <li key={topic}>
                        <Link
                          href={`/blog?topic=${encodeURIComponent(topic)}`}
                          className="inline-block rounded-full bg-psc-muted px-3 py-1 font-sans text-[13px] text-psc-ink transition hover:bg-psc-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
                        >
                          {topic}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <ShareBar slug={post.slug} title={post.title} />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </article>

        {/* Call to action */}
        <section className="bg-psc-muted py-20 md:py-24">
          <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-h2 font-medium leading-tight text-psc-ink">{t("cta.headline")}</h2>
              <p className="mt-4 max-w-xl font-sans text-body leading-body text-psc-gray">{t("cta.body")}</p>
            </div>
            <Link
              href="/start"
              className="inline-block shrink-0 rounded-full bg-psc-ink px-6 py-3 text-center font-sans text-small font-medium text-psc-bg transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
            >
              {t("cta.button")}
            </Link>
          </Container>
        </section>

        {/* Keep reading */}
        {related.length > 0 && (
          <section className="py-20 md:py-24" aria-labelledby="related-title">
            <Container>
              <h2 id="related-title" className="mb-10 font-display text-h2 font-medium leading-tight text-psc-ink">
                {t("related")}
              </h2>
              <div className="grid grid-cols-1 divide-y divide-psc-border border-y border-psc-border md:grid-cols-3 md:divide-x md:divide-y-0">
                {related.map((p) => (
                  <PostCell key={p.slug} post={p} variant="card" />
                ))}
              </div>
            </Container>
          </section>
        )}

        <NewsletterBand />
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
