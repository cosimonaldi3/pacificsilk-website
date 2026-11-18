import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogCard } from "@/content/blog";
import CategoryIcon from "./CategoryIcon";
import { formatPostDate } from "./format";

export type CellVariant = "split" | "card" | "text" | "compact";

interface PostCellProps {
  post: BlogCard;
  variant: CellVariant;
  /* Load the photo eagerly: only for the first image on a page */
  priority?: boolean;
}

const PHOTO = "object-cover [filter:sepia(0.08)_saturate(0.86)] transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

/* One cell of the blog grid. The title is the only link; its ::after stretches over the whole
   cell, so the card is clickable without nesting interactive elements. */
export default function PostCell({ post, variant, priority = false }: PostCellProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const onMuted = variant === "text";

  const label = (
    <p className="flex items-center gap-2 font-sans text-[13px] text-psc-gray">
      <CategoryIcon category={post.category} className="h-4 w-4" />
      {t(`categories.${post.category}`)}
    </p>
  );

  const meta = (
    <div className="mt-auto pt-10">
      <p className="font-sans text-[13px] leading-snug text-psc-gray">
        <span className="block text-psc-ink">{post.author}</span>
        {formatPostDate(post.date, locale)} · {t("minRead", { minutes: post.readMinutes })}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label={t("topics")}>
        {post.topics.map((topic) => (
          <li
            key={topic}
            className={`rounded-full px-2.5 py-1 font-sans text-[12px] leading-none text-psc-ink ${onMuted ? "bg-psc-bg" : "bg-psc-muted"}`}
          >
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );

  const photo = (sizes: string, className: string) => (
    <div className={`relative overflow-hidden bg-psc-muted ${className}`}>
      <Image src={post.image.src} alt={post.image.alt} fill sizes={sizes} priority={priority} className={PHOTO} />
    </div>
  );

  const titleLink = (className: string) => (
    <h2 className={className}>
      <Link
        href={`/blog/${post.slug}`}
        className="after:absolute after:inset-0 group-hover:underline decoration-1 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-psc-red"
      >
        {post.title}
      </Link>
    </h2>
  );

  if (variant === "split") {
    return (
      <article className="group relative grid md:grid-cols-12">
        <div className="order-2 flex flex-col p-6 md:order-1 md:col-span-5 md:p-8">
          {label}
          {titleLink("mt-5 font-display text-h2 font-medium leading-tight text-psc-ink")}
          <p className="mt-4 font-sans text-body leading-body text-psc-gray">{post.dek}</p>
          {meta}
        </div>
        {photo("(min-width: 1024px) 45vw, 100vw", "order-1 aspect-[16/10] md:order-2 md:col-span-7 md:aspect-auto md:min-h-[26rem]")}
      </article>
    );
  }

  if (variant === "text") {
    return (
      <article className="group relative flex h-full flex-col bg-psc-muted p-6 md:p-8">
        {label}
        {titleLink("mt-5 font-display text-h2 font-medium leading-tight text-psc-ink")}
        <p className="mt-4 font-sans text-body leading-body text-psc-gray">{post.dek}</p>
        {meta}
      </article>
    );
  }

  const small = variant === "compact";
  return (
    <article className="group relative flex h-full flex-col p-6">
      {photo(small ? "(min-width: 1024px) 20vw, 100vw" : "(min-width: 1024px) 30vw, 100vw", "mb-6 aspect-[4/3]")}
      {label}
      {titleLink(`mt-3 font-display font-medium leading-snug text-psc-ink ${small ? "text-[1.25rem]" : "text-h3"}`)}
      {!small && <p className="mt-3 line-clamp-3 font-sans text-small leading-body text-psc-gray">{post.dek}</p>}
      {meta}
    </article>
  );
}
