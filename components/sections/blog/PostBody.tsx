import Image from "next/image";
import type { BlogBlock } from "@/content/blog";

interface PostBodyProps {
  blocks: BlogBlock[];
}

/* Renders a post's body blocks (see BlogBlock in content/blog.ts) in reading width. */
export default function PostBody({ blocks }: PostBodyProps) {
  return (
    <div className="font-sans text-[18px] leading-[1.7] text-psc-ink">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="mt-6 first:mt-0">
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2 key={i} className="mt-14 font-display text-[1.75rem] font-medium leading-tight md:text-[2rem]">
                {block.text}
              </h2>
            );
          case "list":
            return (
              <ul key={i} className="mt-6 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-psc-red" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-10 border-l-2 border-psc-red pl-6 font-display text-[1.6rem] leading-snug md:text-[1.9rem]">
                {block.text}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i} className="my-12 md:-mx-12">
                <div className="relative aspect-[3/2] overflow-hidden bg-psc-muted">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(min-width: 1024px) 50rem, 100vw"
                    className="object-cover [filter:sepia(0.08)_saturate(0.86)]"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-3 font-sans text-small leading-snug text-psc-gray">{block.caption}</figcaption>
                )}
              </figure>
            );
          case "qa":
            return (
              <section key={i} className="mt-12 border-t border-psc-border pt-8 first:mt-0 first:border-t-0 first:pt-0">
                <h2 className="font-display text-[1.6rem] font-medium leading-snug md:text-[1.9rem]">{block.question}</h2>
                <div className="mt-4 space-y-5">
                  {block.answer.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            );
        }
      })}
    </div>
  );
}
