import Container from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import type { JoinNetworkContent } from "@/content/about";
import "../home/home.css";
import "./about.css";

interface JoinNetworkProps {
  content: JoinNetworkContent;
}

const pillDelay = (i: number) => ({ "--i": i }) as React.CSSProperties;
const btn =
  "inline-flex w-fit items-center gap-2 rounded-full bg-psc-ink px-5 py-2.5 font-sans text-small font-medium text-psc-bg transition-colors hover:bg-psc-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red";

export default function JoinNetwork({ content }: JoinNetworkProps) {
  return (
    <section id="network" className="scroll-mt-24 bg-psc-bg py-16 md:py-20">
      <Container>
        <div className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
          {content.label}
        </div>
        <h2 className="font-display text-h2 font-medium text-psc-ink">{content.headline}</h2>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {content.path.map((p, i) => (
            <span key={p} className="flex items-center gap-2">
              {i > 0 && <span className="text-psc-red" aria-hidden="true">→</span>}
              <span style={pillDelay(i)} className="hm-pill rounded-full border border-psc-border px-3 py-1 font-sans text-[12px]">
                {p}
              </span>
            </span>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {content.tiles.map((tile, i) => (
            <article
              key={tile.title}
              className="group relative flex min-h-[16rem] flex-col overflow-hidden rounded-2xl border border-psc-border bg-psc-bg p-6 md:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at ${i ? "15% 0%" : "85% 0%"}, color-mix(in srgb, var(--color-psc-red) 18%, transparent), color-mix(in srgb, var(--color-psc-muted) 60%, transparent) 45%, transparent 75%)`,
                }}
              />
              <h3 className="relative font-display text-h3 font-medium text-psc-ink">{tile.title}</h3>
              <p className="relative mt-4 max-w-md font-sans text-body leading-body text-psc-gray">{tile.body}</p>
              <div className="relative mt-auto pt-8">
                {tile.action.href.startsWith("mailto:") ? (
                  <a href={tile.action.href} className={btn}>
                    {tile.action.label}
                    <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <Link href={tile.action.href} className={btn}>
                    {tile.action.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 font-sans text-small text-psc-gray">{content.footnote}</p>
      </Container>
    </section>
  );
}
