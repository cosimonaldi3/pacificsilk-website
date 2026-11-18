"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import type { BlogCard, BlogCategory } from "@/content/blog";
import CategoryIcon from "./CategoryIcon";
import PostCell, { type CellVariant } from "./PostCell";
import { formatPostDate } from "./format";

interface BlogExplorerProps {
  cards: BlogCard[];
  categories: BlogCategory[];
  popularTopics: string[];
}

type CategoryFilter = BlogCategory | "all";

/* Posts per page, after the featured one. A multiple of 7: the grid repeats every 7 posts. */
const PAGE_SIZE = 14;

const COL_SPAN: Record<number, string> = {
  12: "lg:col-span-12",
  6: "lg:col-span-6",
  4: "lg:col-span-4",
  3: "lg:col-span-3",
};

interface Row {
  kind: "split" | "three" | "mixed";
  posts: BlogCard[];
}

/* The grid repeats: one wide post with its photo, three cards, then a text-only post beside
   two small ones. A short last row falls back to wider cells, never an empty gap. */
function buildRows(list: BlogCard[]): Row[] {
  const kinds: Row["kind"][] = ["split", "three", "mixed"];
  const takes = { split: 1, three: 3, mixed: 3 };
  const rows: Row[] = [];
  let i = 0;
  for (let r = 0; i < list.length; r++) {
    const kind = kinds[r % kinds.length];
    rows.push({ kind, posts: list.slice(i, i + takes[kind]) });
    i += takes[kind];
  }
  return rows;
}

const PILL =
  "rounded-full border px-3 py-1 font-sans text-[13px] leading-snug transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red";

export default function BlogExplorer({ cards, categories, popularTopics }: BlogExplorerProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const listRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [topic, setTopic] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);

  // Filters live in the URL (?category=qa&topic=Sourcing&q=...) so a filtered list can be shared.
  // Read once on load, then keep the address bar in step without adding history entries.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("category");
    if (c && categories.includes(c as BlogCategory)) setCategory(c as BlogCategory);
    setTopic(params.get("topic"));
    setQuery(params.get("q") ?? "");
    setReady(true);
  }, [categories]);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (topic) params.set("topic", topic);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [ready, category, topic, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (topic && !p.topics.includes(topic)) return false;
      if (!q) return true;
      return [p.title, p.dek, p.author, ...p.topics].join(" ").toLowerCase().includes(q);
    });
  }, [cards, category, topic, query]);

  const filtering = category !== "all" || topic !== null || query.trim() !== "";
  // The newest post is featured, but only on the unfiltered first page
  const featured = !filtering && page === 1 ? filtered[0] : undefined;
  const rest = featured ? filtered.slice(1) : filtered;
  const pageCount = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = buildRows(rest.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE));

  function pick(next: () => void) {
    next();
    setPage(1);
  }

  function goTo(n: number) {
    setPage(n);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    listRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function clearAll() {
    setCategory("all");
    setTopic(null);
    setQuery("");
    setPage(1);
  }

  return (
    <Container>
      <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]">
        {/* Left rail: where you are, categories, popular topics */}
        <aside className="border-y border-psc-border py-8 lg:sticky lg:top-24 lg:self-start lg:border-y-0 lg:border-r lg:py-0 lg:pr-8">
          <nav aria-label="Breadcrumb" className="font-sans text-small text-psc-gray">
            <Link href="/" className="hover:text-psc-ink">
              {t("breadcrumbHome")}
            </Link>
            <p className="text-psc-ink">
              <span aria-hidden="true">↳ </span>
              {t("label")}
            </p>
          </nav>

          <div className="mt-8 border-t border-psc-border pt-6">
            <h2 className="font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
              {t("categoriesLabel")}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(["all", ...categories] as CategoryFilter[]).map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    aria-pressed={category === c}
                    onClick={() => pick(() => setCategory(c))}
                    className={`${PILL} ${
                      category === c
                        ? "border-psc-ink bg-psc-ink text-psc-bg"
                        : "border-psc-ink/40 text-psc-ink hover:border-psc-ink"
                    }`}
                  >
                    {c === "all" ? t("all") : t(`categories.${c}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t border-psc-border pt-6">
            <h2 className="font-sans text-small font-medium uppercase tracking-widest text-psc-gray">
              {t("topicsLabel")}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {popularTopics.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    aria-pressed={topic === name}
                    onClick={() => pick(() => setTopic(topic === name ? null : name))}
                    className={`${PILL} border-transparent ${
                      topic === name ? "bg-psc-ink text-psc-bg" : "bg-psc-muted text-psc-ink hover:bg-psc-border"
                    }`}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0 pt-8 lg:pt-0 lg:pl-8" ref={listRef}>
          {featured && (
            <article className="group relative border-b border-psc-border pb-8">
              <div className="relative aspect-[16/9] overflow-hidden bg-psc-muted">
                <Image
                  src={featured.image.src}
                  alt={featured.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60rem, 100vw"
                  className="object-cover [filter:sepia(0.08)_saturate(0.86)] transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
                <div>
                  <p className="flex items-center gap-2 font-sans text-[13px] text-psc-gray">
                    <CategoryIcon category={featured.category} className="h-4 w-4" />
                    {t(`categories.${featured.category}`)}
                  </p>
                  <h2 className="mt-4 max-w-3xl font-display text-h1 font-medium leading-tight text-psc-ink">
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="after:absolute after:inset-0 group-hover:underline decoration-1 underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-psc-red"
                    >
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="mt-4 max-w-2xl font-sans text-body leading-body text-psc-gray">{featured.dek}</p>
                </div>
                <span
                  className="hidden h-14 w-14 items-center justify-center rounded-full border border-psc-ink text-psc-ink transition group-hover:bg-psc-ink group-hover:text-psc-bg md:flex"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
              <p className="mt-6 font-sans text-[13px] leading-snug text-psc-gray">
                <span className="text-psc-ink">{featured.author}</span> · {formatPostDate(featured.date, locale)} ·{" "}
                {t("minRead", { minutes: featured.readMinutes })}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label={t("topics")}>
                {featured.topics.map((name) => (
                  <li key={name} className="rounded-full bg-psc-muted px-2.5 py-1 font-sans text-[12px] leading-none text-psc-ink">
                    {name}
                  </li>
                ))}
              </ul>
            </article>
          )}

          {/* Search + results */}
          <div className={`${featured ? "" : "border-t border-psc-border"} flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-psc-border py-4`}>
            <div className="flex min-w-[14rem] flex-1 items-center gap-3">
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-psc-gray" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="9" cy="9" r="6" />
                <path d="M14 14l4 4" />
              </svg>
              <label htmlFor="blog-search" className="sr-only">
                {t("searchLabel")}
              </label>
              <input
                id="blog-search"
                type="search"
                value={query}
                onChange={(e) => pick(() => setQuery(e.target.value))}
                placeholder={t("searchPlaceholder")}
                className="w-full bg-transparent font-sans text-small text-psc-ink placeholder:text-psc-gray focus-visible:outline-none"
              />
            </div>
            <p className="font-sans text-small text-psc-gray" aria-live="polite">
              {t("results", { count: filtered.length })}
            </p>
            {filtering && (
              <button
                type="button"
                onClick={clearAll}
                className="font-sans text-small font-medium text-psc-ink underline underline-offset-4 hover:text-psc-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
              >
                {t("clear")}
              </button>
            )}
          </div>

          {/* The grid */}
          {filtered.length === 0 ? (
            <p className="py-20 font-sans text-body text-psc-gray">{t("empty")}</p>
          ) : (
            <div>
              {rows.map((row, r) => {
                // Rows with a single post always run full width
                const n = row.posts.length;
                const first = r === 0 && !featured;
                const key = row.posts[0].slug;
                if (row.kind === "split" || n === 1) {
                  return (
                    <div key={key} className="border-b border-psc-border">
                      <PostCell post={row.posts[0]} variant="split" priority={first} />
                    </div>
                  );
                }
                const spans: number[] = row.kind === "three" ? Array<number>(n).fill(12 / n) : n === 3 ? [6, 3, 3] : [6, 6];
                const variants: CellVariant[] = row.kind === "three" ? Array<CellVariant>(n).fill("card") : n === 3 ? ["text", "compact", "compact"] : ["text", "card"];
                return (
                  <div
                    key={key}
                    className="grid grid-cols-1 divide-y divide-psc-border border-b border-psc-border lg:grid-cols-12 lg:divide-x lg:divide-y-0"
                  >
                    {row.posts.map((p, i) => (
                      <div key={p.slug} className={COL_SPAN[spans[i]]}>
                        <PostCell post={p} variant={variants[i]} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {pageCount > 1 && (
            <nav aria-label={t("pagination")} className="flex items-center justify-center gap-2 py-10">
              <button
                type="button"
                onClick={() => goTo(current - 1)}
                disabled={current === 1}
                className="rounded-full px-4 py-2 font-sans text-small text-psc-ink disabled:opacity-40"
              >
                {t("previous")}
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goTo(n)}
                  aria-current={n === current ? "page" : undefined}
                  aria-label={t("page", { page: n })}
                  className={`h-9 w-9 rounded-full font-sans text-small ${n === current ? "bg-psc-ink text-psc-bg" : "text-psc-ink hover:bg-psc-muted"}`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goTo(current + 1)}
                disabled={current === pageCount}
                className="rounded-full px-4 py-2 font-sans text-small text-psc-ink disabled:opacity-40"
              >
                {t("next")}
              </button>
            </nav>
          )}
        </div>
      </div>
    </Container>
  );
}
