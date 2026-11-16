"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import type { JourneyContent, JourneyStageBase } from "@/content/home";
import { ChatVisual, GrowthVisual, NetworkVisual, RelayVisual, RoutesVisual } from "./journeyVisuals";

interface JourneyProps {
  content: JourneyContent;
}

/* Five stages on one red thread. The thread fills as the reader scrolls
   (approved in the homepage sketch); each stage lights when the thread reaches it.
   Reduced motion: thread fully drawn, every stage lit. */
export default function Journey({ content }: JourneyProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const stageRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [fill, setFill] = useState(0);
  const [lit, setLit] = useState<boolean[]>([]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const f = reduced ? rect.height : Math.max(0, Math.min(rect.height, window.innerHeight * 0.55 - rect.top));
      setFill(f);
      setLit(stageRefs.current.map((el) => !!el && f >= el.offsetTop + 14));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const stages: { s: JourneyStageBase; visual: React.ReactNode }[] = [
    { s: content.local, visual: <ChatVisual c={content.local} /> },
    { s: content.china, visual: <RelayVisual c={content.china} /> },
    { s: content.project, visual: <RoutesVisual c={content.project} /> },
    { s: content.ladder, visual: <GrowthVisual c={content.ladder} /> },
    { s: content.network, visual: <NetworkVisual c={content.network} /> },
  ];

  return (
    <section id="journey" aria-labelledby="journey-heading" className="scroll-mt-16 bg-psc-bg py-16 md:py-20">
      <Container>
        <p className="mb-4 font-sans text-small uppercase tracking-widest text-psc-gray">{content.label}</p>
        <h2 id="journey-heading" className="mb-10 max-w-2xl font-display text-h2 font-medium leading-tight text-psc-ink md:mb-12">
          {content.headline}
        </h2>

        <ol ref={listRef} className="relative">
          {/* Thread: grey track, red fill, glowing tip */}
          <div aria-hidden="true" className="absolute bottom-0 left-[19px] top-0 w-px bg-psc-border" />
          <div aria-hidden="true" className="absolute left-[19px] top-0 w-px bg-psc-red" style={{ height: fill }} />
          <div
            aria-hidden="true"
            className="hm-thread-dot absolute left-[15px] h-[9px] w-[9px] rounded-full bg-psc-red"
            style={{ top: Math.max(0, fill - 4) }}
          />

          {stages.map(({ s, visual }, i) => (
            <li
              key={s.title}
              ref={(el) => {
                stageRefs.current[i] = el;
              }}
              data-lit={lit[i] ?? false}
              className="hm-stage relative grid gap-6 pb-12 pl-16 last:pb-0 lg:grid-cols-2 lg:gap-12"
            >
              <span className="hm-node absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-psc-border bg-psc-bg font-display text-lg text-psc-ink">
                {i + 1}
              </span>
              <div className="pt-1">
                <p className="mb-3 font-mono text-[12px] uppercase tracking-widest text-psc-red">{s.label}</p>
                <h3 className="mb-4 font-display text-h3 font-medium leading-snug text-psc-ink">{s.title}</h3>
                <p className="max-w-lg font-sans text-body leading-body text-psc-gray">{s.body}</p>
              </div>
              <div className="flex items-start lg:justify-end"><div className="w-full max-w-md">{visual}</div></div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
