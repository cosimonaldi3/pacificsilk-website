import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "./Reveal";
import type { BenefitsContent } from "@/content/home";

interface BenefitsProps {
  content: BenefitsContent;
}

const v = (i: number) => ({ "--i": i }) as React.CSSProperties;

/* Small looping glyphs, one per benefit, in content order. */
const GLYPHS: React.ReactNode[] = [
  // Language: Chinese ↔ your language
  <div key="lang" className="relative h-12 w-12 font-display text-4xl leading-none text-psc-ink">
    <span lang="zh" className="hm-swap-a absolute inset-0 flex items-center justify-center">中</span>
    <span className="hm-swap-b absolute inset-0 flex items-center justify-center text-psc-red">A</span>
  </div>,
  // Quality: the same check at origin and destination
  <svg key="qual" viewBox="0 0 96 40" className="h-12 w-auto" aria-hidden="true">
    <line x1="18" y1="20" x2="78" y2="20" stroke="var(--color-psc-border)" strokeWidth="2" strokeDasharray="3 4" />
    {[18, 78].map((cx, i) => (
      <g key={cx} className="hm-tick" style={{ ...v(i), transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx={cx} cy={20} r={13} fill="var(--color-psc-red)" />
        <path d={`M${cx - 6} 20.5l4 4 8-9`} fill="none" stroke="var(--color-psc-bg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ))}
  </svg>,
  // Friction: a jagged line smoothing out
  <svg key="fric" viewBox="0 0 120 40" className="h-12 w-auto" aria-hidden="true">
    <path className="hm-fade-out" d="M4 28 L16 10 L26 30 L38 8 L50 32 L62 12 L74 30 L86 10 L98 28 L116 18" fill="none" stroke="var(--color-psc-gray)" strokeWidth="1.5" />
    <path className="hm-draw" d="M4 28 C 40 28, 70 10, 116 12" fill="none" stroke="var(--color-psc-red)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>,
  // Network: nodes join one by one
  <svg key="net" viewBox="0 0 96 48" className="h-12 w-auto" aria-hidden="true">
    {[
      [12, 24], [34, 10], [34, 38], [58, 24], [80, 10], [80, 38], [92, 24],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r={i === 0 ? 6 : 4.5} className="hm-grow" style={v(i)} fill={i === 0 ? "var(--color-psc-red)" : "var(--color-psc-ink)"} />
    ))}
  </svg>,
];

export default function Benefits({ content }: BenefitsProps) {
  return (
    <section aria-labelledby="benefits-heading" className="bg-psc-muted py-16 md:py-20">
      <Container>
        <p id="benefits-heading" className="mb-8 font-sans text-small uppercase tracking-widest text-psc-gray">
          {content.label}
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <Reveal className="relative overflow-hidden rounded-2xl bg-psc-ink p-8 md:col-span-2 md:p-10 lg:col-span-4">
            {/* Skyline on the right: greyscale photo, red tint, fading into the card from the left */}
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-3/5"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 55%)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 55%)",
              }}
            >
              <Image
                src={content.lead.image}
                alt={content.lead.imageAlt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover object-[50%_60%] opacity-70 grayscale"
              />
              <div className="absolute inset-0 bg-psc-red mix-blend-multiply opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-psc-ink/70 via-transparent to-psc-ink/40" />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 md:hidden bg-psc-ink/55"
            />
            <h2 className="relative max-w-3xl font-display text-h1 font-medium leading-tight text-psc-bg">{content.lead.title}</h2>
            <p className="relative mt-6 max-w-2xl font-sans text-body leading-body text-psc-bg/75">{content.lead.body}</p>
          </Reveal>

          {content.items.map((item, i) => (
            <Reveal
              key={item.title}
              className="cap-tile group relative overflow-hidden rounded-2xl border border-psc-border bg-psc-bg p-6 md:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--color-psc-red) 14%, transparent), transparent 60%)" }}
              />
              <div className="relative mb-5 flex h-12 items-center">{GLYPHS[i]}</div>
              <h3 className="relative mb-2 font-display text-h3 font-medium leading-snug text-psc-ink">{item.title}</h3>
              <p className="relative font-sans text-small leading-body text-psc-gray">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
