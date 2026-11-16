"use client";

import { useId, useState } from "react";
import Container from "@/components/ui/Container";
import TileShell from "./TileShell";
import MiniGlobe from "./MiniGlobe";
import type { CapabilitiesContent, CapabilitiesPageContent, RouteOwner } from "@/content/capabilities";
import "./capabilities.css";

interface MoveAndSupportProps {
  content: CapabilitiesPageContent["move"];
  /* Labels for the mini globe beside the route */
  globe: CapabilitiesContent["movement"];
}

const OWNER_STYLE: Record<RouteOwner, string> = {
  china: "bg-psc-red text-psc-bg",
  both: "bg-psc-ink text-psc-bg",
  destination: "border border-psc-ink text-psc-ink",
};

/* Five-step route from factory to door. A container dot travels the red line in a
   loop; clicking a step shows who owns it and what happens there. */
export default function MoveAndSupport({ content, globe }: MoveAndSupportProps) {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const step = content.steps[active];

  return (
    <section aria-labelledby="move-heading" className="bg-psc-muted py-16 md:py-20">
      <Container>
        <p className="mb-4 font-sans text-small uppercase tracking-widest text-psc-gray">{content.label}</p>
        <h2 id="move-heading" className="mb-10 max-w-2xl font-display text-h2 font-medium leading-tight text-psc-ink">
          {content.headline}
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
          <TileShell glowAt="0% 100%" className="lg:col-span-2">
            <div className="relative p-6 md:p-8">
              <p className="mb-8 font-mono text-[11px] tracking-wide text-psc-gray">{content.hint}</p>

              {/* Route */}
              <div className="relative">
                <div aria-hidden="true" className="absolute top-[11px] right-[10%] left-[10%] h-0.5 bg-psc-red/80">
                  <span className="ms-dot absolute top-1/2 h-2.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-psc-ink" />
                </div>
                <ol className="relative grid grid-cols-5" role="tablist" aria-label={content.headline}>
                  {content.steps.map((s, i) => {
                    const on = i === active;
                    return (
                      <li key={s.name} className="flex justify-center">
                        <button
                          type="button"
                          role="tab"
                          aria-selected={on}
                          aria-controls={panelId}
                          onClick={() => setActive(i)}
                          className="group/step flex flex-col items-center gap-3 rounded-lg px-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-psc-red"
                        >
                          <span
                            className={`h-6 w-6 rounded-full border-2 transition-colors ${
                              on ? "border-psc-red bg-psc-red" : "border-psc-red bg-psc-bg group-hover/step:bg-psc-muted"
                            }`}
                          />
                          <span
                            className={`font-sans text-[11px] font-medium tracking-tight sm:text-[12px] md:text-small ${on ? "text-psc-ink" : "text-psc-gray group-hover/step:text-psc-ink"}`}
                          >
                            {s.name}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Step panel */}
              <div
                id={panelId}
                role="tabpanel"
                aria-live="polite"
                key={active}
                className="cap-panel mt-8 rounded-xl border border-psc-border bg-psc-bg p-5 md:p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-h3 font-medium text-psc-ink">{step.name}</span>
                  <span className={`rounded-full px-3 py-1 font-mono text-[11px] tracking-wide ${OWNER_STYLE[step.owner]}`}>
                    {content.owners[step.owner]}
                  </span>
                </div>
                <p className="mt-3 font-sans text-body leading-body text-psc-gray">{step.body}</p>
              </div>
            </div>
          </TileShell>

          <TileShell glowAt="50% 100%" className="hidden lg:flex">
            <div className="relative flex flex-1 items-center pt-8">
              <MiniGlobe c={globe} />
            </div>
          </TileShell>
        </div>
      </Container>
    </section>
  );
}
